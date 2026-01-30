import React from 'react';
import { ALPHABET } from '../constants/words';

export default function Keyboard({ onChar, onDelete, onEnter, usedKeys }) {
  return (
    // UPDATED: Reduced bottom padding from pb-6 to pb-1 to save huge space
    <div className="w-full max-w-lg mx-auto px-1 pb-1 select-none">

      {/* 1. The Letter Rows */}
      <div className="flex flex-col gap-2 mb-2">
        {ALPHABET.map((row, i) => (
          <div key={i} className="flex justify-center gap-1 w-full">
            {row.map((char) => {
              const status = usedKeys[char];

              let bgColor = 'bg-[#818384]';
              if (status === 'correct') bgColor = 'bg-[#6aaa64]';
              else if (status === 'present') bgColor = 'bg-[#c9b458]';
              else if (status === 'absent') bgColor = 'bg-[#3a3a3c]';

              return (
                <button
                  key={char}
                  onClick={() => onChar(char)}
                  // Slightly reduced height here too (h-14 -> h-12) to help mobile ratio
                  className={`${bgColor} flex-1 h-12 rounded font-bold text-white text-sm sm:text-base 
                    active:opacity-70 transition-colors duration-150 touch-manipulation`}
                >
                  {char}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* 2. The Action Row (Enter & Delete) */}
      <div className="flex gap-2 px-4">
        {/* ENTER BUTTON: Green Text (Чудаккха) */}
        <button
          onClick={onEnter}
          className="flex-1 h-12 bg-[#565758] rounded-lg font-bold text-xs sm:text-sm text-[#6aaa64] uppercase tracking-wider active:bg-[#404040] transition-colors"
        >
          Чудаккха
        </button>

        {/* DELETE BUTTON: Red Text (ДӀадайа) */}
        <button
          onClick={onDelete}
          className="flex-1 h-12 bg-[#565758] rounded-lg font-bold text-xs sm:text-sm text-red-500 uppercase tracking-wider active:bg-[#404040] transition-colors"
        >
          ДӀадайа
        </button>
      </div>

    </div>
  );
}