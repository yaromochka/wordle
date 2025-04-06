import './Box.css'

type Props = {
    letter: string
    status: string;
}

function Box( props: Props ) {
    return (
        <>
            <div className={`box ${props.status}`}>
                {props.letter}
            </div>
        </>
    )
}

export default Box;