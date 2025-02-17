import "./tale.css"


export function Tale({ letter }: { letter: string }) {
    return (
        <>
            <div className="tale">
                { letter.toUpperCase() }
            </div>
        </>
    )
}