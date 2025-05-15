import words from 'russian-words';

export type Feedback = 'right' | 'wrong' | 'empty';
export type Attempt = { word: string; result: Feedback[] };

const allWords = words.filter((w: string | any[]) => w.length === 5 && /^[а-яё]+$/i.test(<string>w));

function getFeedback(guess: string, solution: string): Feedback[] {
    // твой оригинальный код
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

// Считаем частоты букв по позициям (или по всему слову)
function countLetterFrequencies(words: string[]): number[][] {
    // 33 буквы русского алфавита, но для упрощения
    // используем код 0..32 по буквам а-яё
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
    for (let i = 0; i < 5; i++) {
        const index = ALPHABET.indexOf(word[i]);
        if (index >= 0) score += freq[i][index];
    }
    return score;
}

export function getTopWords(attempts: Attempt[], topN = 5): { word: string; score: number }[] {
    const filtered = filterWords(allWords, attempts);

    // Если попыток ещё мало — считаем частоты по всему словарю, иначе по оставшимся
    const freq = countLetterFrequencies(filtered);

    const scored = filtered.map(word => ({
        word,
        score: scoreWord(word, freq),
    }));

    return scored.sort((a, b) => b.score - a.score).slice(0, topN);
}
