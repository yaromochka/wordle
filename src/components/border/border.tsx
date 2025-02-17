import "./border.css"
import {Word} from "../words/word";

const WORD = 'Океан'

export function Border() {
    return (
        <>
            <div className="border">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Word key={i} word={""} />
                ))}

            </div>
        </>
    )
}