import { useEffect, useState } from 'react';
import './Grid.css';
import Box from "../Box/Box";
import words from 'russian-words';

// Фильтрация пятибуквенных слов
const fiveLetterWords = words.filter((word: string) => word.length === 5 && /^[а-яё]+$/i.test(word));
const secret = fiveLetterWords[Math.floor(Math.random() * fiveLetterWords.length)];

function isRussianLetter(key: string) {
    return /^[а-яА-ЯёЁ]$/.test(key); // Проверка на русскую букву
}

function Grid() {
    const totalRows = 6;
    const wordLength = 5;
    const totalBoxes = totalRows * wordLength;

    const [letters, setLetters] = useState(Array(totalBoxes).fill(''));
    const [currentRow, setCurrentRow] = useState(0);
    const [currentWord, setCurrentWord] = useState('');
    const [result, setResult] = useState<Array<string[]>>(new Array(totalRows).fill([])); // Массив для результатов проверки

    const checkWord = (word: string) => {
        const rowResult = Array(wordLength).fill('empty'); // Массив для результата текущего слова
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

    // Обработчик ввода с клавиатуры
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const key = e.key;

            // Ввод буквы
            if (isRussianLetter(key)) {
                let newWord = currentWord;
                if (currentWord.length < wordLength) {
                    newWord += key;
                } else {
                    // заменяем последнюю букву
                    newWord = currentWord.slice(0, wordLength - 1) + key;
                }

                const updatedLetters = [...letters];
                const startIdx = currentRow * wordLength;
                for (let i = 0; i < wordLength; i++) {
                    updatedLetters[startIdx + i] = newWord[i] || '';
                }

                setLetters(updatedLetters);
                setCurrentWord(newWord);
            }
            else if (key === 'Enter') {
                if (currentWord.length === wordLength) {
                    const currentResult = checkWord(currentWord);
                    const updatedResult = [...result];
                    updatedResult[currentRow] = currentResult;
                    setResult(updatedResult);

                    if (currentRow < totalRows - 1) {
                        setCurrentRow(currentRow + 1);
                        setCurrentWord('');
                    }
                }
            }
            else if (key === 'Backspace') {
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
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentWord, currentRow, letters, result]);

    return (
        <div className="grid">
            {letters.map((letter, index) => {
                const row = Math.floor(index / wordLength);
                const status = result[row]?.[index % wordLength] || 'empty'; // Получаем статус для текущей ячейки
                return (
                    <Box key={index} letter={letter} status={status} />
                );
            })}
        </div>
    );
}

export default Grid;