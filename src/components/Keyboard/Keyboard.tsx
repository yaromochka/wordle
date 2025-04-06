import React from 'react';
import './Keyboard.css';

type Props = {
    onKeyPress: (key: string) => void;
    usedLetters: { [key: string]: string }; // статус каждой буквы
};

const rows = [
    'йцукенгшщзхъ',
    'фывапролджэ',
    'ячсмитьбю',
];

function Keyboard({ onKeyPress, usedLetters }: Props) {
    return (
        <div className="keyboard">
            {rows.map((row, rowIndex) => (
                <div className="keyboard-row" key={rowIndex}>
                    {row.split('').map((letter) => {
                        const status = usedLetters[letter];
                        return (
                            <button
                                key={letter}
                                className={`key ${status || ''}`}
                                onClick={() => onKeyPress(letter)}
                            >
                                {letter}
                            </button>
                        );
                    })}
                    {rowIndex === 2 && (
                        <>
                            <button className="key special" onClick={() => onKeyPress('Backspace')}>⌫</button>
                            <button className="key special" onClick={() => onKeyPress('Enter')}>Enter</button>
                        </>
                    )}
                </div>
            ))}
        </div>
    );
}

export default Keyboard;
