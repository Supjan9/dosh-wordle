// src/components/Intro.jsx
import React from 'react';

export default function Intro({ onStart, isGameFinished }) {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-[#121213] text-white p-4 text-center animate-fade-in relative">
      
      <div className="mb-6 text-6xl">🏔️</div>

      <h1 className="text-5xl font-black tracking-[0.2em] mb-4 uppercase">ДОШ</h1>
      <p className="text-[#818384] mb-12 uppercase tracking-widest text-xs font-bold">The Daily Chechen Wordle</p>
      
      {!isGameFinished ? (
        <div className="max-w-xs text-sm text-[#d7dadc] mb-12 space-y-4 leading-relaxed">
          <p>Guess the <span className="font-bold text-white">hidden word</span> in 6 tries.</p>
          <p>A new word is available every day!</p>
        </div>
      ) : (
        <div className="mb-12 p-4 bg-[#1a1a1b] rounded-lg border border-[#3a3a3c]">
          <p className="text-white font-bold mb-1">You have played today's game.</p>
          <p className="text-gray-400 text-sm">Come back tomorrow for a new word.</p>
        </div>
      )}

      <button 
        onClick={onStart}
        className={`${isGameFinished ? 'bg-[#538d4e]' : 'bg-white text-black'} 
          hover:opacity-90 font-bold py-4 px-12 rounded-full text-lg tracking-widest 
          transition-all active:scale-95 shadow-lg uppercase`}
      >
        {isGameFinished ? 'See Results' : 'Play'}
      </button>

      <div className="absolute bottom-8 text-xs text-[#565758]">
        No. {new Date().toLocaleDateString()}
      </div>
    </div>
  );
}