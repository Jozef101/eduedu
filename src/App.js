import React, {useState} from 'react';
import './App.css'; // If you still have some global background or resets
import MathGame from './components/MathGame';
import EnglishLesson from './components/EnglishLesson';
import Toolbar from './components/Toolbar';

function App() {
  const [showMathGame, setShowMathGame] = useState(false);
  const [showEnglishLesson, setShowEnglishLesson] = useState(false);

  return (
    <div className="App">
      <Toolbar 
        setShowMathGame={setShowMathGame}
        setShowEnglishLesson={setShowEnglishLesson}
      />
      {/* <SubjectComponent /> */}
      {showMathGame && <MathGame />}
      {showEnglishLesson && <EnglishLesson />}
      <EnglishLesson />
    </div>
  );
}

export default App;
