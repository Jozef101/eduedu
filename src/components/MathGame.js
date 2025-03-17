import React, { useState, useEffect, useRef } from 'react';
import './MathGame.css'; // Import the separate CSS file

function MathGame() {
  // State variables
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);

  // User answer & feedback
  const [userAnswer, setUserAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState(null); // null => not answered yet

  // Streak
  const [streak, setStreak] = useState(0);

  // Keep track of the last correct result for feedback if needed
  const [lastCorrectResult, setLastCorrectResult] = useState(null);

  // Refs for focusing the input & button
  const inputRef = useRef(null);
  const buttonRef = useRef(null);

  // Generate two random 3-digit numbers, ensuring num1 > num2
  function generateNumbers() {
    let first = Math.floor(Math.random() * 400) + 100; // 100-999
    let second = Math.floor(Math.random() * 400) + 100;
    while (second >= first) {
      second = Math.floor(Math.random() * 400) + 100;
    }
    setNum1(first);
    setNum2(second);
  }

  // On component mount, generate the first set of numbers & focus input
  useEffect(() => {
    generateNumbers();
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  }, []);

  // After we set isCorrect (answer submitted), if user has answered,
  // we auto-focus the button so the second Enter can proceed
  useEffect(() => {
    if (isCorrect !== null) {
      buttonRef.current?.focus();
    }
  }, [isCorrect]);

  // Single form submission:
  //  - If isCorrect === null => check correctness
  //  - Else => go to next question
  function handleSubmit(e) {
    e.preventDefault();
    if (isCorrect === null) {
      // Check correctness
      const correctResult = num1 + num2;
      setLastCorrectResult(correctResult);

      if (parseInt(userAnswer, 10) === correctResult) {
        setStreak((prev) => prev + 1);
        setIsCorrect(true);
      } else {
        setStreak(0);
        setIsCorrect(false);
      }
    } else {
      // If user already answered => next question
      generateNumbers();
      setUserAnswer("");
      setIsCorrect(null);
      setLastCorrectResult(null);

      // Focus input for the new question
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  }

  // Decide the button text
  let buttonText = "Potvrdiť";
  if (isCorrect !== null) {
    buttonText = "Pokračovať";
  }

  return (
    <div className="card math-game-card">
      <div className="math-header">
        <h2 className="math-title">odčítavanie</h2>
      </div>

      <div className="math-stats">
        <div className="stat-box">
          <p>Séria</p>
          <h3>{streak}</h3>
        </div>
      </div>

      {/* The math prompt */}
      <div className="math-prompt">
        <p>{num1} + {num2} = ?</p>
      </div>

      {/* Single form approach */}
      <form onSubmit={handleSubmit} className="math-form">
        <input
          ref={inputRef}
          type="number"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder="Odpoveď"
          required
          disabled={isCorrect !== null}
        />
        <button type="submit" ref={buttonRef}>
          {buttonText}
        </button>
      </form>

      {/* Feedback after user answers */}
      {isCorrect === true && (
        <p className="feedback correct">✔️ Správne!</p>
      )}
      {isCorrect === false && (
        <p className="feedback wrong">
          ❌ Nesprávne! Správna odpoveď je {lastCorrectResult}
        </p>
      )}

      {/* "Skvelé!" if streak >= 10 */}
      {streak >= 10 && (
        <p className="math-congrats">Skvelé!</p>
      )}
    </div>
  );
}

export default MathGame;
