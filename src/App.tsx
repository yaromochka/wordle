import './App.css';
import Grid from "./components/Grid/Grid";
import {useState} from "react";
import Keyboard from "./components/Keyboard/Keyboard";

function App() {
    const [onKeyPress, setOnKeyPress] = useState<(key: string) => void>(() => () => {});
    const [usedKeys, setUsedKeys] = useState<Record<string, string>>({});

    return (
        <>
            <div className="header">WORDLE</div>
            <div className="game">
                <Grid setOnKeyPress={setOnKeyPress} setUsedKeys={setUsedKeys} usedKeys={usedKeys} />
                <Keyboard onKeyPress={onKeyPress} usedLetters={usedKeys} />
            </div>
        </>
    );
}

export default App;
