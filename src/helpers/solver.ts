import words from 'russian-words';

export type Feedback = 'right' | 'wrong' | 'empty';
export type Attempt = { word: string; result: Feedback[] };

const allWords = words.filter((w: string | any[]) => w.length === 5 && /^[а-яё]+$/i.test(<string>w));

function getFeedback(guess: string, solution: string): Feedback[] {
    const result: Feedback[] = Array(5).fill('empty');
    const used = Array(5).fill(false);

    for (let i = 0; i < 5; i++) {
        if (guess[i] === solution[i]) {
            result[i] = 'right';
            used[i] = true;
        }
    }

    for (let i = 0; i < 5; i++) {
        if (result[i] === 'right') continue;
        for (let j = 0; j < 5; j++) {
            if (!used[j] && guess[i] === solution[j]) {
                result[i] = 'wrong';
                used[j] = true;
                break;
            }
        }
    }

    return result;
}

function filterWords(words: string[], attempts: Attempt[]): string[] {
    return words.filter(word => {
        return attempts.every(({ word: guess, result }) => {
            const actualFeedback = getFeedback(guess, word);
            return actualFeedback.join() === result.join();
        });
    });
}

function countLetterFrequencies(words: string[]): number[][] {
    const ALPHABET = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя';
    const freq = Array.from({ length: 5 }, () => Array(ALPHABET.length).fill(0));

    for (const word of words) {
        for (let i = 0; i < 5; i++) {
            const char = word[i];
            const index = ALPHABET.indexOf(char);
            if (index >= 0) freq[i][index]++;
        }
    }

    return freq;
}

function scoreWord(word: string, freq: number[][]): number {
    const ALPHABET = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя';
    let score = 0;
    const seen = new Set<string>(); // Для учета уникальных букв (опционально)
    for (let i = 0; i < 5; i++) {
        const char = word[i];
        if (!seen.has(char)) {
            const index = ALPHABET.indexOf(char);
            if (index >= 0) {
                score += freq[i][index];
                seen.add(char);
            }
        }
    }
    return score;
}

function calculateEntropy(candidate: string, possibleWords: string[]): number {
    const patternCount: Record<string, number> = {};

    for (const solution of possibleWords) {
        const feedback = getFeedback(candidate, solution).join('');
        patternCount[feedback] = (patternCount[feedback] || 0) + 1;
    }

    const total = possibleWords.length;
    let entropy = 0;

    for (const count of Object.values(patternCount)) {
        const p = count / total;
        entropy -= p * Math.log2(p);
    }

    return entropy;
}

export function getTopWords(attempts: Attempt[], topN = 5): { word: string; entropy: number }[] {
    const filtered = filterWords(allWords, attempts);

    if (filtered.length > 1000) {
        // Частотный анализ — быстро, score — сумма частот букв
        const freq = countLetterFrequencies(filtered);
        const scored = filtered.map(word => ({
            word,
            entropy: scoreWord(word, freq), // тут entropy — сумма частот
        }));
        return scored.sort((a, b) => b.entropy - a.entropy).slice(0, topN);
    } else {
        // Энтропия — точнее, но дольше
        const scored = filtered.map(word => ({
            word,
            entropy: calculateEntropy(word, filtered),
        }));
        return scored.sort((a, b) => b.entropy - a.entropy).slice(0, topN);
    }
}
