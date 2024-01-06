// Quiz.js
import React, { useState, useEffect, useRef } from 'react';
import QuizResult from './QuizResult';
import axios from 'axios';
import './styles.css';

function Quiz() {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [incorrectCount, setIncorrectCount] = useState(0);
    const [clickedOption, setClickedOption] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [quizData, setQuizData] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [state, setState] = useState(true);
    const isMounted = useRef(true);

    // api fatch
    useEffect(() => {
        const fetchTriviaData = async () => {
            if (state && isMounted.current) {
                try {
                    const response = await axios.get('https://opentdb.com/api.php?amount=10');
                    setState(false);
                    setQuizData(response.data.results);
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            }
        };

        fetchTriviaData();
    }, [state]);

    // changeQuestion screen
    const changeQuestion = () => {
        if (submitted) {
            // Reset state for the next question
            setSubmitted(false);
            setClickedOption(0);
            setErrorMessage('');
            // Move to the next question
            if (currentQuestion < quizData.length - 1) {
                setCurrentQuestion(currentQuestion + 1);
            } else {
                setShowResult(true);
            }
        } else {
            setErrorMessage('Please submit your answer before moving to the next question.');
        }
    };


    // submitAnswer screen
    const submitAnswer = () => {
        if (!submitted) {
            updateScore();
            setSubmitted(true);
        } 
    };

    //showFlashMessage 
    const showFlashMessage = (type, message) => {
        if (type === 'success') {
            setSuccessMessage(message);
            setTimeout(() => setSuccessMessage(''), 2000); // Hide success message after 3.5 seconds
        } else if (type === 'error') {
            const options = [...quizData[currentQuestion]?.incorrect_answers, quizData[currentQuestion]?.correct_answer];
            const correctAnswerIndex = options.indexOf(quizData[currentQuestion]?.correct_answer);
    
            setErrorMessage(
                <div className="flash__body error">
                <span style={{ fontWeight: 'bold', color: 'red' }}>Oops! Your answer is wrong.</span><br />
                <span style={{ fontWeight: 'bold', color: 'green' }}><span style={{ fontWeight: 'bold', color: 'black' }}>Correct answer is:</span> {options[correctAnswerIndex]}</span>
            </div>
            );
            setTimeout(() => setErrorMessage(''), 2500); // Hide error message after 3.5 seconds
        }
    };


    //correct answer and select option match value
    const isOptionCorrect = (selectedOption) => {
        const correctAnswer = quizData[currentQuestion]?.correct_answer;
        return selectedOption === correctAnswer;
    };



    //result score functionality 
    const updateScore = () => {
        const options = [...quizData[currentQuestion]?.incorrect_answers, quizData[currentQuestion]?.correct_answer];
        const selectedOption = options[clickedOption - 1];
        const correctAnswerIndex = options.indexOf(quizData[currentQuestion]?.correct_answer);

        if (isOptionCorrect(selectedOption)) {
            // Correct answer
            setScore(score + 1);
            showFlashMessage('success', 'Your answer is Correct');
        } else {
            // Incorrect answer
            setIncorrectCount(incorrectCount + 1);
            showFlashMessage('error', `Oops! Your answer is wrong. Correct answer: ${options[correctAnswerIndex]}`);
        }
    };

    const resetAll = () => {
        setShowResult(false);
        setCurrentQuestion(0);
        setClickedOption(0);
        setScore(0);
        setSuccessMessage('');
        setErrorMessage('');
    };

    return (
        <div>
            <p className="heading-txt">Quiz APP</p>
            <div className="container">
                {showResult ? (
                    <QuizResult score={score} incorrectCount={incorrectCount} totalScore={quizData.length} tryAgain={resetAll} />
                ) : (
                    <>
                        <div className="question">
                            <span id="question-number">{currentQuestion + 1}. </span>
                            <span id="question-txt">{quizData[currentQuestion]?.question}</span>
                        </div>
                        <div className="option-container">
                            {Array.isArray(quizData[currentQuestion]?.incorrect_answers) && quizData[currentQuestion]?.incorrect_answers.length > 0 ? (
                                // Render options for multiple-choice questions
                                [...quizData[currentQuestion]?.incorrect_answers, quizData[currentQuestion]?.correct_answer].map((option, i) => (
                                    <label key={i} className={`option-label ${clickedOption === i + 1 ? 'checked' : ''}`}>
                                        <input
                                            type="radio"
                                            className="option-radio"
                                            name="quizOption"
                                            checked={clickedOption === i + 1}
                                            onChange={() => setClickedOption(i + 1)}
                                        />
                                        {option}
                                    </label>
                                ))
                            ) : (
                                // Handle other question types, missing options, or incorrect options array
                                <p>Invalid question type, missing options, or incorrect options array.</p>
                            )}
                        </div>

                        {/* errorMessage show */}
                        <div className={`message-container ${successMessage || errorMessage ? 'show' : ''}`}>
                            {successMessage && <div className="flash__body" style={{ color: 'green', fontWeight: 'bold' }}>{successMessage}</div>}
                            {errorMessage && <div className="flash__body">{errorMessage}</div>}
                        </div>
                        {/* change input value button condition  */}
                        {!submitted ? (
                            <input
                                type="button"
                                value="Submit"
                                id="submit-button"
                                onClick={submitAnswer}
                                className={`submit-button ${clickedOption === 0 || submitted ? 'disabled' : 'enabled'}`}
                                disabled={clickedOption === 0 || submitted}
                            />
                        ) : (
                            <input
                                type="button"
                                value="Next"
                                id="next-button"
                                onClick={changeQuestion}
                                className={`next-button ${!submitted ? 'disabled' : 'enabled'}`}
                                disabled={!submitted}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default Quiz;
