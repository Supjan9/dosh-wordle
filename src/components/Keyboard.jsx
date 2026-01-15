import React from 'react';
import { ALPHABET } from '../constants/words';

export default function Keyboard({ onChar, onDelete, onEnter, usedKeys }) {
  return (
    <div className="w-full max-w-lg mx-auto px-1 pb-6 select-none">
      
      {/* 1. The Letter Rows */}
      <div className="flex flex-col gap-2 mb-3">
        {ALPHABET.map((row, i) => (
          <div key={i} className="flex justify-center gap-1 w-full">
            {row.map((char) => {
              const status = usedKeys[char]; 
              
              let bgColor = 'bg-[#818384]'; // Default Grey
              if (status === 'correct') bgColor = 'bg-[#6aaa64]'; // Green
              else if (status === 'present') bgColor = 'bg-[#c9b458]'; // Yellow
              else if (status === 'absent') bgColor = 'bg-[#3a3a3c]'; // Dark Grey

              return (
                <button
                  key={char}
                  onClick={() => onChar(char)}
                  className={`${bgColor} flex-1 h-14 rounded font-bold text-white text-sm sm:text-base 
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
        <button
          onClick={onEnter}
          className="flex-1 h-14 bg-[#565758] rounded-lg font-bold text-xs sm:text-sm text-white uppercase tracking-wider active:bg-[#404040] transition-colors"
        >
          ENTER
        </button>
        <button
          onClick={onDelete}
          className="flex-1 h-14 bg-[#565758] rounded-lg font-bold text-xs sm:text-sm text-white uppercase tracking-wider active:bg-[#404040] transition-colors"
        >
          DELETE
        </button>
      </div>

    </div>
  );
}