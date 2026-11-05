import asyncio
import os
import sys
import edge_tts

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

UNITS = {
    1: 'አንድ',
    2: 'ሁለት',
    3: 'ሦስት',
    4: 'አራት',
    5: 'አምስት',
    6: 'ስድስት',
    7: 'ሰባት',
    8: 'ስምንት',
    9: 'ዘጠኝ'
}

TENS = {
    10: 'አሥር',
    20: 'ሃያ',
    30: 'ሠላሳ',
    40: 'አርባ',
    50: 'ኃምሳ',
    60: 'ስድሳ',
    70: 'ሰባ',
    80: 'ሰማንያ',
    90: 'ዘጠና'
}

def get_amharic_number_name(n: int) -> str:
    if n in UNITS:
        return UNITS[n]
    if n in TENS:
        return TENS[n]
    if 11 <= n <= 19:
        return f"አሥራ {UNITS[n - 10]}"
    t = (n // 10) * 10
    u = n % 10
    return f"{TENS[t]} {UNITS[u]}"

# Target numbers to ensure are generated: all tens 30..90 and all curated Level 2 combinations
NUMBERS_TO_GENERATE = [
    30, 40, 50, 60, 70, 80, 90,
    21, 22, 23, 24, 25, 26, 27, 28, 29,
    31, 32, 33, 34, 35, 36, 37, 38, 39,
    41, 42, 44, 45, 47,
    52, 55, 58,
    63, 66, 67,
    72, 75, 77,
    81, 84, 88,
    93, 95, 99
]

async def main():
    os.makedirs('public/audio/am', exist_ok=True)
    for num in NUMBERS_TO_GENERATE:
        path = f"public/audio/am/{num}.mp3"
        if not os.path.exists(path):
            text = get_amharic_number_name(num)
            print(f"Generating AM: {num} -> {text}")
            comm = edge_tts.Communicate(text, voice='am-ET-MekdesNeural')
            await comm.save(path)
    print("Done generating Amharic number audio!")

if __name__ == '__main__':
    asyncio.run(main())

