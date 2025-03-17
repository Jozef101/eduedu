import React, { useState, useEffect, useRef } from 'react';
import vocabularyData from '../data/vocabularyData.json';
import './EnglishLesson.css';

// Shuffle array using Fisher-Yates
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function EnglishLesson() {
  // -- State & refs
  const [selectedUnit, setSelectedUnit] = useState(vocabularyData.units[0].id);
  const [shuffledWords, setShuffledWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // User input & feedback
  const [userAnswer, setUserAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState(null);

  // Counters
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);

  // Final summary
  const [isFinished, setIsFinished] = useState(false);
  const [wrongAnswers, setWrongAnswers] = useState([]);

  // Refs for auto-focus
  const vocabInputRef = useRef(null);
  const buttonRef = useRef(null);

  // Get unit data from JSON
  const currentUnitData = vocabularyData.units.find((u) => u.id === selectedUnit);

  // -- Shuffle & reset each time unit changes
  useEffect(() => {
    if (!currentUnitData) return;
    const shuffled = shuffleArray(currentUnitData.words);

    setShuffledWords(shuffled);
    setCurrentIndex(0);
    setUserAnswer("");
    setIsCorrect(null);
    setCorrectCount(0);
    setWrongCount(0);
    setWrongAnswers([]);
    setIsFinished(false);

    // Auto-focus input
    setTimeout(() => {
      vocabInputRef.current?.focus();
    }, 0);
  }, [currentUnitData]);

  // -- Focus the button after user has answered (for double Enter)
  useEffect(() => {
    if (isCorrect !== null) {
      buttonRef.current?.focus();
    }
  }, [isCorrect]);

  // -- Handlers
  const handleUnitChange = (e) => {
    const newUnit = parseInt(e.target.value, 10);
    setSelectedUnit(newUnit);
  };

  const resetUnit = () => {
    if (!currentUnitData) return;
    const shuffled = shuffleArray(currentUnitData.words);

    setShuffledWords(shuffled);
    setCurrentIndex(0);
    setUserAnswer("");
    setIsCorrect(null);
    setCorrectCount(0);
    setWrongCount(0);
    setWrongAnswers([]);
    setIsFinished(false);

    setTimeout(() => {
      vocabInputRef.current?.focus();
    }, 0);
  };

  // Single form submission: first Enter => check correctness, second Enter => next word or summary
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentUnitData) return;

    const currentWord = shuffledWords[currentIndex];
    if (!currentWord) return;

    if (isCorrect === null) {
      // Check correctness
      const correctEnglish = currentWord.en.trim().toLowerCase();
      const userEnglish = userAnswer.trim().toLowerCase();

      if (userEnglish === correctEnglish) {
        setIsCorrect(true);
        setCorrectCount((prev) => prev + 1);
      } else {
        setIsCorrect(false);
        setWrongCount((prev) => prev + 1);
        setWrongAnswers((prev) => [...prev, currentWord.en]);
      }
    } else {
      // Move to next word or final summary
      const totalWords = currentUnitData.words.length;
      const isLastWord = currentIndex === totalWords - 1;

      if (isLastWord) {
        setIsFinished(true);
      } else {
        setCurrentIndex((prev) => prev + 1);
        setUserAnswer("");
        setIsCorrect(null);
        setTimeout(() => {
          vocabInputRef.current?.focus();
        }, 0);
      }
    }
  };

  // -- Conditional renders
  if (!currentUnitData) {
    return (
      <div className="card english-lesson-card">
        <h2 className="lesson-title">vocabulary</h2>
        <p>Žiadne dáta pre zvolenú jednotku.</p>
      </div>
    );
  }

  if (isFinished) {
    // Final summary
    const totalWords = currentUnitData.words.length;
    return (
      <div className="card english-lesson-card">
        <div className="lesson-header">
          <h2 className="lesson-title">Anglické slovíčka</h2>
          <div className="unit-selector">
            <label htmlFor="unitSelect">UNIT:</label>
            <select
              id="unitSelect"
              onChange={handleUnitChange}
              value={selectedUnit}
            >
              {vocabularyData.units.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  Unit {unit.id}
                </option>
              ))}
            </select>
          </div>
        </div>

        <p className="summary-text">Dokončil(a) si všetky slová v tejto jednotke!</p>

        <div className="lesson-stats final-stats">
          <div className="stat-box correct-box">
            <p>Správne</p>
            <h3>{correctCount}</h3>
          </div>
          <div className="stat-box wrong-box">
            <p>Nesprávne</p>
            <h3>{wrongCount}</h3>
          </div>
          <div className="stat-box total-box">
            <p>Spolu</p>
            <h3>{totalWords}</h3>
          </div>
        </div>

        {wrongAnswers.length > 0 ? (
          <div className="incorrect-words">
            <p>Nesprávne zodpovedané anglické slová:</p>
            <ul>
              {wrongAnswers.map((word, idx) => (
                <li key={idx}>{word.toUpperCase()}</li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="all-correct">Všetko bolo zodpovedané správne!</p>
        )}

        <button className="retry-btn" onClick={resetUnit}>
          Ešte raz túto jednotku
        </button>
      </div>
    );
  }

  const totalWords = currentUnitData.words.length;
  const currentWord = shuffledWords[currentIndex];
  if (!currentWord) {
    // Edge case: no words
    return (
      <div className="card english-lesson-card">
        <h2 className="lesson-title">Anglické slovíčka</h2>
        <p>Táto jednotka nemá žiadne slovíčka.</p>
      </div>
    );
  }

  const isLastWord = currentIndex === totalWords - 1;
  const wordsLeft = totalWords - currentIndex - 1;

  // Decide button text
  let buttonText = "Skontrolovať";
  if (isCorrect !== null) {
    buttonText = isLastWord ? "Zobraziť výsledky" : "Ďalšie slovíčko";
  } else if (isLastWord) {
    buttonText = "Vyhodnotenie";
  }

  return (
    <div className="card english-lesson-card">
      <div className="lesson-header">
        <h2 className="lesson-title">Anglické slovíčka</h2>
        <div className="unit-selector">
          <label htmlFor="unitSelect">Unit:</label>
          <select
            id="unitSelect"
            onChange={handleUnitChange}
            value={selectedUnit}
          >
            {vocabularyData.units.map((unit) => (
              <option key={unit.id} value={unit.id}>
                Unit {unit.id}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="lesson-stats">
        <div className="stat-box correct-box">
          <p>Správne</p>
          <h3>{correctCount}</h3>
        </div>
        <div className="stat-box wrong-box">
          <p>Nesprávne</p>
          <h3>{wrongCount}</h3>
        </div>
      </div>

      <div className="lesson-progress">
        <p>Slovíčko: {currentIndex + 1} / {totalWords}</p>
        <p>Zostáva slov: {wordsLeft}</p>
      </div>

      <div className="word-prompt">
        <p>{currentWord.sk}</p>
      </div>

      <form onSubmit={handleSubmit} className="lesson-form">
        <input
          ref={vocabInputRef}
          type="text"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder="Tvoja odpoveď"
          required
          disabled={isCorrect !== null}
        />
        <button type="submit" ref={buttonRef}>
          {buttonText}
        </button>
      </form>

      {isCorrect === true && (
        <p className="feedback correct">✔️ Správne!</p>
      )}
      {isCorrect === false && (
        <p className="feedback wrong">
          ❌ Nesprávne!
          <br />
          Správna odpoveď je {currentWord.en.toUpperCase()}
        </p>
      )}
    </div>
  );
}

export default EnglishLesson;
