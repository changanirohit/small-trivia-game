// QuizResult.js

function QuizResult(props) {
    return (
        <>
        <div>
            <div className='show-score'>
                Total Correct Questions: {props.score} <br />
                Total Incorrect Questions: {props.incorrectCount} <br />
                Total Questions Served: {props.totalScore}
            <button id="next-button" style={{width:165}} onClick={props.tryAgain}>
                Try Again
            </button>
            </div>

        </div>
        </>
    );
}


export default QuizResult;
