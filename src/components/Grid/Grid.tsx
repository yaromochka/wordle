import {useEffect, useState} from 'react';
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
    const [gameOver, setGameOver] = useState(false); // Статус игры (игра закончена или нет)
    const [wordGuessed, setWordGuessed] = useState(false); // Статус, угадано ли слово
    const [shake, setShake] = useState(false); // Статус анимации "тряски"

    const checkWord = (word: string) => {
        if (!fiveLetterWords.includes(word)) {
            return [];
        }

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
        if (gameOver || wordGuessed) return;

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
            } else if (key === 'Enter') {
                if (currentWord.length === wordLength) {
                    const currentResult = checkWord(currentWord);

                    if (currentResult.length > 0 && fiveLetterWords.includes(currentWord)) {
                        // Если слово существует в fiveLetterWords, обновляем результат
                        const updatedResult = [...result];
                        updatedResult[currentRow] = currentResult;
                        setResult(updatedResult);

                        // Если угадано, заканчиваем игру
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
                        // Если слово не существует, включаем анимацию "тряски" и не двигаемся на следующую строку
                        setShake(true);
                        setTimeout(() => setShake(false), 500); // Тряска длится 500ms
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
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentWord, currentRow, letters, result, gameOver, wordGuessed]);

    return (
        <div className={`grid ${shake ? 'shake' : ''}`}>
            {letters.map((letter, index) => {
                const row = Math.floor(index / wordLength);
                const status = result[row]?.[index % wordLength] || 'empty'; // Получаем статус для текущей ячейки
                const hasFlip = status === 'right' || status === 'wrong'; // Условие для переворота
                return (
                    <Box
                        key={index}
                        letter={letter}
                        status={status}
                        hasFlip={hasFlip} // Передаем флаг переворота
                    />
                );
            })}
            {gameOver && (
                <div className="game-over">
                    {wordGuessed ? "Вы угадали слово!" : "Попытки закончились!"}
                </div>
            )}
        </div>
    )
}

export default Grid;