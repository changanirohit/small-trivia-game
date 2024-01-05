// QuizResult.js

function QuizResult(props) {
    return (
        <>
            <div className='show-score'>
                Your Score: {props.score} <br />
                Total Score: {props.totalScore}
            </div>
            <button id="next-button" style={{width:140}} onClick={props.tryAgain}>
                Try Again
            </button>
        </>
    );
}

export default QuizResult;
