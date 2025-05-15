import React from 'react';
import './Hint.css'
import {Attempt, getTopWords} from "../../helpers/solver";

interface HintProps {
    attempts: Attempt[];
}

const Hint: React.FC<HintProps> = ({ attempts }) => {
    const topWords = getTopWords(attempts);

    return (
        <div className="hint-box">
            <h3>Подсказки:</h3>
            {topWords.length === 0 ? (
                <p>Недостаточно данных для подсказки...</p>
            ) : (
                <ul>
                    {topWords.map(({ word }, idx) => (
                        <li key={idx}>
                            <strong>{word}</strong> — энтропия: {1}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Hint;
