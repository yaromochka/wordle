// Grid.tsx
import {useCallback, useEffect, useState} from 'react';
import Box from "../Box/Box";
import words from 'russian-words';
import './Grid.css';
import {Attempt} from "../../helpers/solver";

export const fiveLetterWords = words.filter((word: string) => word.length === 5 && /^[а-яё]+$/i.test(word));
export let secret = ''

function getRandomWord() {
    return fiveLetterWords[Math.floor(Math.random() * fiveLetterWords.length)];
}

function setTargetWord(word: string) {
    secret = word
}

function isRussianLetter(key: string) {
    return /^[а-яА-ЯёЁ]$/.test(key);
}

function Grid({
                  setOnKeyPress,
                  usedKeys,
                  setUsedKeys,
                  setAttempts
              }: {
    setOnKeyPress: (fn: (key: string) => void) => void;
    usedKeys: Record<string, string>;
    setUsedKeys: (map: Record<string, string>) => void;
    setAttempts: React.Dispatch<React.SetStateAction<Attempt[]>>;
}) {
    const totalRows = 6;
    const wordLength = 5;
    const totalBoxes = totalRows * wordLength;

    const [letters, setLetters] = useState(Array(totalBoxes).fill(''));
    const [currentRow, setCurrentRow] = useState(0);
    const [currentWord, setCurrentWord] = useState('');
    const [result, setResult] = useState<Array<string[]>>(new Array(totalRows).fill([]));
    const [gameOver, setGameOver] = useState(false);
    const [wordGuessed, setWordGuessed] = useState(false);
    const [shake, setShake] = useState(false);

    useEffect(() => {
        setTargetWord(getRandomWord());
    }, []);

    const checkWord = (word: string) => {
        if (!fiveLetterWords.includes(word)) {
            return [];
        }

        const rowResult = Array(wordLength).fill('empty');
        let secretCopy = secret.split('');

        for (let i = 0; i < wordLength; i++) {
            if (word[i] === secret[i]) {
                rowResult[i] = 'right';
                secretCopy[i] = '';
            }
        }

        for (let i = 0; i < wordLength; i++) {
            if (rowResult[i] !== 'right' && secretCopy.includes(word[i])) {
                rowResult[i] = 'wrong';
                secretCopy[secretCopy.indexOf(word[i])] = '';
            }
        }

        return rowResult;
    };

    const updateUsedKeys = (word: string, statuses: string[]) => {
        const updated = { ...usedKeys };
        for (let i = 0; i < word.length; i++) {
            const letter = word[i];
            const status = statuses[i];
            if (
                updated[letter] !== 'right' &&
                (updated[letter] !== 'wrong' || status === 'right') &&
                status !== 'empty'
            ) {
                updated[letter] = status;
            } else if (!updated[letter]) {
                updated[letter] = status;
            }
        }
        setUsedKeys(updated);
    };

    const handleKeyPress = useCallback((key: string) => {
        if (gameOver || wordGuessed) return;

        if (isRussianLetter(key)) {
            let newWord = currentWord;
            if (currentWord.length < wordLength) {
                newWord += key;
            } else {
                newWord = currentWord.slice(0, wordLength - 1) + key;
            }

            const updatedLetters = [...letters];
            const startIdx = currentRow * wordLength;
            for (let i = 0; i < wordLength; i++) {
                updatedLetters[startIdx + i] = newWord[i] || '';
            }

            setLetters(updatedLetters);
            setCurrentWord(newWord);
        } else if (key === 'Enter') {
            if (currentWord.length === wordLength) {
                const currentResult = checkWord(currentWord);

                if (currentResult.length > 0 && fiveLetterWords.includes(currentWord)) {
                    // Добавляем попытку
                    const newAttempt: Attempt = {
                        word: currentWord,
                        result: currentResult
                    };
                    setAttempts(prev => [...prev, newAttempt]);

                    const updatedResult = [...result];
                    updatedResult[currentRow] = currentResult;
                    setResult(updatedResult);

                    updateUsedKeys(currentWord, currentResult);

                    if (currentWord === secret) {
                        setWordGuessed(true);
                        setGameOver(true);
                    }

                    if (currentRow < totalRows - 1) {
                        setCurrentRow(currentRow + 1);
                        setCurrentWord('');
                    } else {
                        setGameOver(true);
                    }
                } else {
                    setShake(true);
                    setTimeout(() => setShake(false), 500);
                }
            }
        } else if (key === 'Backspace') {
            if (currentWord.length > 0) {
                const newWord = currentWord.slice(0, -1);
                const updatedLetters = [...letters];
                const startIdx = currentRow * wordLength;
                for (let i = 0; i < wordLength; i++) {
                    updatedLetters[startIdx + i] = newWord[i] || '';
                }
                setLetters(updatedLetters);
                setCurrentWord(newWord);
            }
        }
    }, [currentRow, currentWord, letters]);

    useEffect(() => {
        setOnKeyPress(() => handleKeyPress);
    }, [handleKeyPress]);

    useEffect(() => {
        const keyDownHandler = (e: KeyboardEvent) => handleKeyPress(e.key);
        window.addEventListener('keydown', keyDownHandler);
        return () => window.removeEventListener('keydown', keyDownHandler);
    }, [handleKeyPress]);

    return (
        <div className={`grid ${shake ? 'shake' : ''}`}>
            {letters.map((letter, index) => {
                const row = Math.floor(index / wordLength);
                const status = result[row]?.[index % wordLength] || 'empty';
                return <Box key={index} letter={letter} status={status} hasFlip={false}/>;
            })}
        </div>
    );
}

export default Grid;
