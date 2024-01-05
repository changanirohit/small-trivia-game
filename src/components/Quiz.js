// Quiz.js
import React, { useState, useEffect, useRef } from 'react';
import QuizResult from './QuizResult';
import axios from 'axios';
import './styles.css';

function Quiz() {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const isMounted = useRef(true);
    const [clickedOption, setClickedOption] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [quizData, setQuizData] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [state, setState] = useState(true);

    // api fatch
    console.log(quizData, 'datasubmit');
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
        if (String(clickedOption) !== '0' && !submitted) {
            updateScore();
            setSubmitted(true);
        } else if (String(clickedOption) === '0') {
            setErrorMessage('Please select an answer before submitting.');
            showFlashMessage('error', 'Please select an answer before submitting.'); // Display flash message
        }
    };

    //showFlashMessage 
    const showFlashMessage = (type, message) => {
        if (type === 'success') {
            setSuccessMessage(message);
            setTimeout(() => setSuccessMessage(''), 2500); // Hide success message after 3.5 seconds
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
        console.log("selected: " + selectedOption);
        console.log("correct: " + correctAnswer);
        console.log(selectedOption === correctAnswer);
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
            showFlashMessage('success', 'Correct the answer ');
        } else {
            // Incorrect answer
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
                    <QuizResult score={score} totalScore={quizData.length} tryAgain={resetAll} />
                ) : (
                    <>
                        <div className="question">
                            <span id="question-number">{currentQuestion + 1}. </span>
                            <span id="question-txt">{quizData[currentQuestion]?.question}</span>
                        </div>
                        <div className="option-container">
                            {quizData[currentQuestion]?.type === 'multiple' && Array.isArray(quizData[currentQuestion]?.incorrect_answers) && quizData[currentQuestion]?.incorrect_answers.length > 0 ? (
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
                                // boolean value true false input value pass
                            ) : quizData[currentQuestion]?.type === 'boolean' ? (
                                ['True', 'False'].map((option, i) => (
                                    <label key={i} className={`option-label ${clickedOption === i + 1 ? 'checked' : ''}`} onClick={() => setClickedOption(i + 1)}>
                                        <input
                                            type="radio"
                                            className="option-radio"
                                            name="quizOption"
                                            checked={clickedOption === i + 1}
                                            readOnly // Make the input read-only to prevent manual changes
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
