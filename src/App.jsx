import React, { useState, useEffect } from 'react';
import Grid from './components/Grid';
import Keyboard from './components/Keyboard';
import Modal from './components/Modal';
import Intro from './components/Intro';
import { WORDS } from './constants/words';
import { getWordOfDay, loadGameState, saveGameState } from './lib/gameLogic';

export default function App() {
  // 1. Get Today's Word Data (Refreshes every 3 hours)
  const { solution, translation, intervalIndex, nextDay } = getWordOfDay();
  const SOLUTION = solution; 

  // 2. Initial State Setup
  const [gameStarted, setGameStarted] = useState(false);
  const [turn, setTurn] = useState(0);
  const [currentGuess, setCurrentGuess] = useState('');
  const [guesses, setGuesses] = useState(Array(6).fill(null));
  const [isCorrect, setIsCorrect] = useState(false);
  const [usedKeys, setUsedKeys] = useState({});
  const [isGameFinished, setIsGameFinished] = useState(false);

  // UI Variables
  const [showModal, setShowModal] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // 3. LOAD GAME ON STARTUP
  useEffect(() => {
    const saved = loadGameState();
    
    if (saved) {
      setGuesses(saved.guesses);
      setTurn(saved.turn);
      setIsCorrect(saved.isCorrect);
      setUsedKeys(saved.usedKeys);
      setIsGameFinished(saved.isGameFinished);
      
      if (saved.turn > 0 || saved.isGameFinished) {
        setGameStarted(true);
      }
    } 
  }, []); 

  // 4. SAVE GAME ON EVERY UPDATE
  useEffect(() => {
    if (turn > 0 || isGameFinished) {
      saveGameState({
        guesses,
        turn,
        isCorrect,
        usedKeys,
        isGameFinished,
        solution: SOLUTION 
      });
    }
  }, [guesses, turn, isCorrect, usedKeys, isGameFinished, SOLUTION]);

  // 5. AUTO-SHOW MODAL
  useEffect(() => {
    if (isGameFinished && gameStarted) {
      const timer = setTimeout(() => setShowModal(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [isGameFinished, gameStarted]);

  // 6. KEYBOARD LISTENER
  useEffect(() => {
    if (!gameStarted || isGameFinished) return; 

    const handlePhysicalKey = (e) => {
      if (e.key === 'Enter') onEnter();
      else if (e.key === 'Backspace') onDelete();
      else if (/^[а-яА-ЯёЁa-zA-Z1]$/.test(e.key) || e.key === 'I') {
        const char = e.key === '1' ? 'I' : e.key.toUpperCase();
        onChar(char);
      }
    };
    window.addEventListener('keydown', handlePhysicalKey);
    return () => window.removeEventListener('keydown', handlePhysicalKey);
  }, [currentGuess, turn, isCorrect, gameStarted, isGameFinished]);

  // --- GAMEPLAY ACTIONS ---

  const onChar = (char) => {
    if (currentGuess.length < 5 && turn < 6 && !isCorrect) {
      setCurrentGuess((prev) => prev + char);
    }
  };

  const onDelete = () => {
    setCurrentGuess((prev) => prev.slice(0, -1));
  };

  const triggerError = (msg) => {
    setIsShaking(true);
    setToastMessage(msg);
    setTimeout(() => setIsShaking(false), 600);
    setTimeout(() => setToastMessage(null), 2000);
  };

  const formatGuess = () => {
    let solArr = [...SOLUTION.trim().toUpperCase()];
    let formatted = [...currentGuess].map((l) => ({ key: l, color: 'absent' }));
    
    formatted.forEach((l, i) => {
      if (solArr[i] === l.key) {
        formatted[i].color = 'correct';
        solArr[i] = null;
      }
    });
    
    formatted.forEach((l, i) => {
      if (solArr.includes(l.key) && l.color !== 'correct') {
        formatted[i].color = 'present';
        solArr[solArr.indexOf(l.key)] = null;
      }
    });
    return formatted;
  };

  const onEnter = () => {
    if (turn >= 6 || isCorrect || isGameFinished) return;

    if (currentGuess.length !== 5) { 
      triggerError('Цхьа хIума гIалат ду'); 
      return; 
    }
    
    const normalizedGuess = currentGuess.trim().toUpperCase();
    const wordExists = WORDS.some(w => 
        w.word.trim().toUpperCase() === normalizedGuess
    );

    if (!wordExists) { 
      triggerError('Дош дацаре терра ду'); 
      return; 
    }

    const formatted = formatGuess();
    const newGuesses = [...guesses];
    newGuesses[turn] = formatted;
    setGuesses(newGuesses);

    const newUsedKeys = { ...usedKeys };
    formatted.forEach((l) => {
      const currentColor = newUsedKeys[l.key];
      if (l.color === 'correct') newUsedKeys[l.key] = 'correct';
      else if (l.color === 'present' && currentColor !== 'correct') newUsedKeys[l.key] = 'present';
      else if (l.color === 'absent' && currentColor !== 'correct' && currentColor !== 'present') newUsedKeys[l.key] = 'absent';
    });
    setUsedKeys(newUsedKeys);

    let won = (normalizedGuess === SOLUTION.trim().toUpperCase());
    let lost = (turn === 5 && !won);

    if (won) {
      setIsCorrect(true);
      setIsGameFinished(true);
    } else if (lost) {
      setIsGameFinished(true);
    }

    setTurn(prev => prev + 1);
    setCurrentGuess('');
  };

  // --- RENDER ---

  if (!gameStarted) {
    return <Intro 
      onStart={() => {
        setGameStarted(true);
      }} 
      isGameFinished={isGameFinished} 
    />;
  }

  return (
    <div className="flex flex-col h-[100dvh] w-full max-w-lg mx-auto overflow-hidden bg-[#121213] relative">
      
      {/* HEADER CHANGES: 
        1. Reduced top margin from mt-2 to mt-1.5 (~30% less)
        2. justify-end keeps stats icon on the right
      */}
      <header className="flex h-8 items-center justify-end px-4 shrink-0 mt-1.5">
         <button 
           onClick={() => { if(isGameFinished) setShowModal(true); }}
           className={`text-[#565758] hover:text-white transition-all p-2 -mr-2 ${isGameFinished ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
           aria-label="Show Stats"
         >
           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
             <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
           </svg>
         </button>
      </header>

      {toastMessage && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in">
          <div className="bg-white text-black font-bold px-4 py-3 rounded text-sm uppercase tracking-wide shadow-lg">
            {toastMessage}
          </div>
        </div>
      )}

      {/* MAIN: mb-4 creates the gap between Grid and Keyboard */}
      <main className="flex-grow flex flex-col items-center justify-center p-1 min-h-0 mb-4">
        <Grid guesses={guesses} currentGuess={currentGuess} turn={turn} isShaking={isShaking} />
      </main>

      {/* FOOTER CHANGES:
         1. Reduced padding-bottom from pb-8 to pb-6 (~25-30% less)
      */}
      <footer className="shrink-0 pb-6">
        <Keyboard onChar={onChar} onDelete={onDelete} onEnter={onEnter} usedKeys={usedKeys} />
      </footer>

      <Modal 
        isVisible={showModal} 
        isWon={isCorrect} 
        solution={SOLUTION} 
        translation={translation}
        guesses={guesses}
        turn={turn}
        nextDayTimestamp={nextDay}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
}