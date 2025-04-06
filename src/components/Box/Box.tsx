import './Box.css'

type Props = {
    letter: string;
    status: string;
    hasFlip: boolean;
}

function Box( props: Props ) {
    return (
        <>
            <div className={`box ${props.status} ${props.hasFlip ? 'flip' : ''}`}>
                {props.letter}
            </div>
        </>
    )
}

export default Box;