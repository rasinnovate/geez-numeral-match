# Ge'ez Numeral Match (የግዕዝ ቁጥሮች ማዛመጃ)

An interactive, pedagogical Ethiopian Ge'ez numeral learning mini-app designed for children (ages 6–8) in the **Ras Kids** educational mini-app ecosystem.

Built with **React 19**, **Vite**, **TypeScript**, and **Tailwind CSS**.

---

## 🌟 Key Features

- **Level 1 — Single Numeral Recognition (፩ እስከ ፲, 1–10):**
  - **Learn Studio:** Visual representation, quantity dot counting, and authentic native Amharic audio pronunciation for every number.
  - **Game Modes:**
    - `ምልክት ➜ ብዛት` (Symbol to Quantity)
    - `ብዛት ➜ ምልክት` (Quantity to Symbol)
    - `ድምፅ ➜ ምልክት` (Sound to Symbol - listen and pick the correct Ge'ez numeral)
- **Level 2 — Additive Combinations (፲ እስከ ፺፱ & ፻, 10–99 & 100):**
  - **Learn Tens:** Master all tens (፲, ፳, ፴, ፵, ፶, ፷, ፸, ፹, ፺) and hundred (**፻**).
  - **Interactive Combination Studio:** Learn how Ge'ez combines additively (e.g., ፳ + ፫ = ፳፫ / 20 + 3 = 23).
  - **Combination Quizzes:** Tens recognition, two-step additive building, and component decomposition.
- **Child-Friendly Pedagogy:**
  - **Zero Arabic digits or written text on quiz cards** to foster genuine symbol-quantity visual and auditory recognition.
  - Continuous native Amharic spoken number pronunciation.
  - Resilient audio manager with Howler.js, automatic Web Audio unlock, and HTML5 audio fallback.
- **Discovery Moments:**
  - "The Secret of Zero" (የዜሮ ምስጢር) — an engaging story explaining why the Ge'ez numeral system has no dedicated zero symbol.
- **Ras Kids Ecosystem Integration:**
  - Gelada mascot with responsive emotional feedback and encouragement.
  - Consistent typography, emerald/cream design tokens, streak tracking, stars, and parent progress dashboard with local persistence.

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/rasinnovate/geez-numeral-match.git
cd geez-numeral-match

# Install dependencies
npm install
```

### Development Server

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

### Run Tests

```bash
node node_modules/tsx/dist/cli.mjs src/data/geezNumerals.test.ts
```

### Build for Production

```bash
npm run build
```

---

## 📁 Project Structure

```text
geez-numeral-match/
├── public/
│   ├── audio/am/              # Native studio Amharic audio recordings (1-109, 100)
│   ├── audio/am_phrases/      # Celebration audio phrases
│   └── mascot-avatar.png      # Gelada mascot asset
├── src/
│   ├── components/            # UI screens, studios, cards, navigation, and modals
│   │   ├── ExploreLanding.tsx # Hub screen with Learn and Game paths
│   │   ├── Level1LearnScreen.tsx
│   │   ├── Level1Screen.tsx   # Level 1 quizzes (symbol, dots, sound)
│   │   ├── Level2LearnScreen.tsx # Tens studio & interactive combiner
│   │   ├── Level2Screen.tsx   # Level 2 additive quizzes
│   │   ├── QuantityDotCard.tsx
│   │   ├── MascotGelada.tsx
│   │   ├── HeaderNav.tsx
│   │   └── ...
│   ├── data/
│   │   ├── geezNumerals.ts    # Centralized Ge'ez numerals dataset
│   │   └── geezNumerals.test.ts # Unit tests for numeral data and generators
│   ├── lib/
│   │   ├── audioManager.ts    # Multi-tier resilient audio engine
│   │   ├── questionGenerator.ts
│   │   └── storageService.ts  # LocalStorage persistence & bridge stubs
│   ├── types/
│   ├── App.tsx
│   └── main.tsx
└── package.json
```

---

## 📜 License

Private & Proprietary — Ras Kids Educational Ecosystem.
