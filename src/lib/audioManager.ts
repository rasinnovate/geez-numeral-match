/**
 * Audio Manager for Ge'ez Numeral Match
 *
 * Provides:
 * 1. Authentic native Amharic audio recordings (/audio/am/{num}.mp3)
 * 2. High-performance, low-latency Web Audio API synthesizers for interactive feedback
 * 3. SpeechSynthesis fallback for any un-cached numbers
 * 4. Master volume and mute control
 */

import { Howl, Howler } from 'howler';

const AMHARIC_NUMBER_NAMES: Record<number, string> = {
  1: 'አንድ',
  2: 'ሁለት',
  3: 'ሦስት',
  4: 'አራት',
  5: 'አምስት',
  6: 'ስድስት',
  7: 'ሰባት',
  8: 'ስምንት',
  9: 'ዘጠኝ',
  10: 'አሥር',
  20: 'ሃያ',
  30: 'ሠላሳ',
  40: 'አርባ',
  50: 'ኃምሳ',
  60: 'ስድሳ',
  70: 'ሰባ',
  80: 'ሰማንያ',
  90: 'ዘጠና',
  100: 'መቶ',
};

class AudioManager {
  private isMuted: boolean = false;
  private audioCtx: AudioContext | null = null;
  private speechLang: 'am' | 'en' = 'am';
  private numberCache: Map<string, Howl> = new Map();
  private phraseCache: Map<string, Howl> = new Map();
  private activeHowl: Howl | null = null;
  private activeAudioEl: HTMLAudioElement | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      const savedMute = localStorage.getItem('geez_match_muted');
      if (savedMute !== null) {
        this.isMuted = savedMute === 'true';
      }

      // Unlock Howler audio on the very first user interaction anywhere
      const unlock = () => {
        this.unlockContext();
        window.removeEventListener('pointerdown', unlock);
        window.removeEventListener('touchstart', unlock);
        window.removeEventListener('click', unlock);
      };
      window.addEventListener('pointerdown', unlock, { once: true });
      window.addEventListener('touchstart', unlock, { once: true });
      window.addEventListener('click', unlock, { once: true });
    }
  }

  public unlockContext(): void {
    if (typeof window === 'undefined') return;
    try {
      if (Howler && (Howler as any).ctx && (Howler as any).ctx.state === 'suspended') {
        (Howler as any).ctx.resume().catch(() => {});
      }
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume().catch(() => {});
      }
    } catch {
      // Safe ignore
    }
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
    return this.audioCtx;
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    if (typeof window !== 'undefined') {
      localStorage.setItem('geez_match_muted', String(muted));
    }
    if (muted) {
      this.stopAll();
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public setLanguage(lang: 'am' | 'en'): void {
    this.speechLang = lang;
  }

  public getLanguage(): 'am' | 'en' {
    return this.speechLang;
  }

  public stopAll(): void {
    if (this.activeHowl) {
      try {
        this.activeHowl.stop();
      } catch {}
      this.activeHowl = null;
    }
    if (this.activeAudioEl) {
      try {
        this.activeAudioEl.pause();
        this.activeAudioEl.currentTime = 0;
      } catch {}
      this.activeAudioEl = null;
    }
    this.numberCache.forEach((h) => {
      try {
        h.stop();
      } catch {}
    });
    this.phraseCache.forEach((h) => {
      try {
        h.stop();
      } catch {}
    });
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // Safe ignore
      }
    }
  }

  private getSoundUrl(num: number): string {
    const meta = import.meta as any;
    const base = typeof meta !== 'undefined' && meta.env?.BASE_URL ? meta.env.BASE_URL : '/';
    const cleanBase = base.endsWith('/') ? base : `${base}/`;
    return `${cleanBase}audio/${this.speechLang}/${num}.mp3`.replace(/\/\//g, '/');
  }

  /**
   * Play pre-recorded native studio audio for number.
   * Number name sound is ALWAYS played!
   */
  public playNumber(num: number, onEnd?: () => void): void {
    if (this.isMuted) return;

    this.unlockContext();
    this.stopAll();

    const soundUrl = this.getSoundUrl(num);
    const key = `${this.speechLang}-${num}`;
    let howl = this.numberCache.get(key);

    if (!howl) {
      howl = new Howl({
        src: [soundUrl],
        html5: true, // HTML5 Audio for reliable mobile/WebView streaming and autoplay
        volume: 1.0,
        onloaderror: () => {
          this.fallbackHtml5OrSpeech(num, soundUrl, onEnd);
        },
        onplayerror: (_id, _err) => {
          // If Howler encounters playerror (e.g. autoplay restriction), fallback immediately
          this.fallbackHtml5OrSpeech(num, soundUrl, onEnd);
        },
      });
      this.numberCache.set(key, howl);
    }

    if (onEnd) {
      howl.once('end', onEnd);
    }

    this.activeHowl = howl;

    try {
      const playPromise = howl.play();
      if (!playPromise && typeof playPromise !== 'undefined') {
        this.fallbackHtml5OrSpeech(num, soundUrl, onEnd);
      }
    } catch {
      this.fallbackHtml5OrSpeech(num, soundUrl, onEnd);
    }
  }

  /**
   * Direct HTML5 Audio fallback or Web Speech if Howler was blocked
   */
  private fallbackHtml5OrSpeech(num: number, soundUrl: string, onEnd?: () => void): void {
    if (typeof window !== 'undefined' && typeof Audio !== 'undefined') {
      try {
        const audio = new Audio(soundUrl);
        this.activeAudioEl = audio;
        if (onEnd) {
          audio.onended = () => {
            this.activeAudioEl = null;
            onEnd();
          };
        }
        audio.play().catch(() => {
          // Browser completely blocked audio without user interaction; fallback to speech
          this.fallbackSpeakNumber(num, onEnd);
        });
        return;
      } catch {
        // Fall through to speak
      }
    }
    this.fallbackSpeakNumber(num, onEnd);
  }

  /**
   * Fallback to play spoken number name using sequential files or SpeechSynthesis
   */
  private fallbackSpeakNumber(num: number, onEnd?: () => void): void {
    if (num > 20 && num < 100) {
      const tens = Math.floor(num / 10) * 10;
      const units = num % 10;
      if (units !== 0) {
        this.playNumber(tens, () => {
          setTimeout(() => {
            this.playNumber(units, onEnd);
          }, 120);
        });
        return;
      }
    }

    // Try SpeechSynthesis in Amharic
    const name = AMHARIC_NUMBER_NAMES[num] || String(num);
    this.speakText(name);
    if (onEnd) {
      setTimeout(onEnd, 800);
    }
  }

  /**
   * Play celebration praise audio
   */
  public playPraise(): void {
    if (this.isMuted) return;
    const praiseIdx = Math.floor(Math.random() * 3) + 1;
    const phraseName = `good_job_${praiseIdx}`;
    const key = `am-${phraseName}`;

    let howl = this.phraseCache.get(key);
    if (!howl) {
      howl = new Howl({
        src: [`/audio/am_phrases/${phraseName}.mp3`],
        volume: 1.0,
        onloaderror: () => {
          this.playSuccessChime();
        },
      });
      this.phraseCache.set(key, howl);
    }
    howl.play();
  }

  /**
   * Web Speech fallback for Amharic pronunciation
   */
  public speakText(text: string): void {
    if (this.isMuted || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'am-ET';
      utterance.rate = 0.85;
      utterance.pitch = 1.05;
      window.speechSynthesis.speak(utterance);
    } catch {
      // Safe ignore
    }
  }

  // ──── Synthesized Interactive Audio Effects ────

  /**
   * Crisp button tap feedback tone
   */
  public playTapSound(): void {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(540, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(780, ctx.currentTime + 0.06);

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.09);
  }

  /**
   * Correct match celebration chime (bright ascending major chords)
   */
  public playSuccessChime(): void {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.07);

      const startTime = ctx.currentTime + idx * 0.07;
      const duration = 0.28;

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.2, startTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    });
  }

  /**
   * Level 2 Additive Combination Snap Sound (Smooth resonant swoosh into cheerful chime)
   */
  public playCombineSwoosh(): void {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.18);

    gain.gain.setValueAtTime(0.02, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.22, ctx.currentTime + 0.12);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.23);

    setTimeout(() => {
      if (this.isMuted) return;
      const chimeOsc = ctx.createOscillator();
      const chimeGain = ctx.createGain();
      chimeOsc.type = 'triangle';
      chimeOsc.frequency.setValueAtTime(1174.66, ctx.currentTime); // D6
      chimeGain.gain.setValueAtTime(0.22, ctx.currentTime);
      chimeGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

      chimeOsc.connect(chimeGain);
      chimeGain.connect(ctx.destination);
      chimeOsc.start();
      chimeOsc.stop(ctx.currentTime + 0.36);
    }, 120);
  }

  /**
   * Gentle retry tone
   */
  public playGentleRetry(): void {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    [261.63, 246.94].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);

      const startTime = ctx.currentTime + idx * 0.12;
      gain.gain.setValueAtTime(0.12, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.14);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.15);
    });
  }

  /**
   * Full round completion fanfare
   */
  public playFanfare(): void {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const chords = [
      { time: 0, notes: [523.25, 659.25, 783.99] },
      { time: 0.18, notes: [587.33, 739.99, 880.0] },
      { time: 0.38, notes: [659.25, 830.61, 987.77] },
      { time: 0.62, notes: [783.99, 987.77, 1318.51] },
    ];

    chords.forEach(({ time, notes }) => {
      notes.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + time);

        gain.gain.setValueAtTime(0, ctx.currentTime + time);
        gain.gain.linearRampToValueAtTime(0.14, ctx.currentTime + time + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + time + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + time);
        osc.stop(ctx.currentTime + time + 0.36);
      });
    });
  }
}

export const audioManager = new AudioManager();
