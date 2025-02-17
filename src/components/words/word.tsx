import "./word.css"
import {Tale} from "../tales/tale";
import {useEffect, useState} from "react";

export function Word({ word }: { word: string }) {
    const [letters, setLetters] = useState<string[]>([]);

    useEffect(() => {
        let index = 0;
        const interval = setInterval(() => {
            if (index < word.length) {
                setLetters((prev) => [...prev, word[index]]);
                index++;
            } else {
                clearInterval(interval);
            }
        }, 300);
        return () => clearInterval(interval);
    }, [word]);

    return (
        <div className="word">
            {Array.from({ length: 5 }).map((_, i) => (
                <Tale key={i} letter={letters[i] || ""} />
            ))}
        </div>
    );
}