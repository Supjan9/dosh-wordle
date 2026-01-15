import React from 'react';

export default function Grid({ guesses, currentGuess, turn, isShaking }) {
  return (
    // UPDATED CONTAINER:
    // 1. max-h-full: Ensures it NEVER overlaps the keyboard/header.
    // 2. aspect-[5/6]: Locks the shape so it shrinks proportionally (5 cols, 6 rows).
    // 3. mx-auto: Centers it horizontally.
    <div className="grid grid-rows-6 gap-1.5 w-full max-w-[350px] max-h-full aspect-[5/6] mx-auto">
      {guesses.map((guess, i) => {
        if (turn === i) {
          return <Row key={i} currentGuess={currentGuess} isShaking={isShaking} />;
        }
        else if (guess) {
           return <Row key={i} guess={guess} isRevealed={true} />;
        }
        else {
           return <Row key={i} guess={null} isRevealed={false} />;
        }
      })}
    </div>
  );
}

function Row({ guess, currentGuess, isRevealed, isShaking }) {
  let tiles = [];
  
  if (isRevealed && guess) {
    tiles = guess;
  } else if (currentGuess) {
    tiles = currentGuess.split('');
  }
  
  const emptyTiles = Array(5 - tiles.length).fill('');

  return (
    // UPDATED ROW:
    // Removed 'aspect-square' logic here. The parent grid controls the height now.
    // h-full w-full ensures it fills the grid cell.
    <div className={`grid grid-cols-5 gap-1.5 w-full h-full ${isShaking ? 'animate-shake' : ''}`}>
      
      {tiles.map((char, i) => {
        const letter = isRevealed ? char.key : char;
        const color = isRevealed ? char.color : null;
        
        let colorHex = '#3a3a3c'; 
        if (color === 'correct') colorHex = '#6aaa64';
        if (color === 'present') colorHex = '#c9b458';

        const animationDelay = `${i * 0.2}s`;

        return (
          <div
            key={i}
            style={{ 
              '--correct-color': colorHex, 
              animationDelay: isRevealed ? animationDelay : '0s' 
            }}
            // UPDATED TILE:
            // 1. Removed 'aspect-square' (The parent Aspect Ratio handles this now).
            // 2. Uses h-full w-full to fill the slot.
            // 3. Font size adjusts automatically based on the box size effectively.
            className={`
              w-full h-full border-2 flex items-center justify-center 
              text-2xl sm:text-3xl font-bold uppercase text-white select-none
              ${isRevealed ? 'animate-flip' : 'border-[#565758] animate-pop'}
              ${!isRevealed && 'border-[#818384]'}
            `}
          >
            {letter}
          </div>
        );
      })}

      {emptyTiles.map((_, i) => (
        <div
          key={`empty-${i}`}
          className="w-full h-full border-2 border-[#3a3a3c] flex items-center justify-center"
        />
      ))}
    </div>
  );
}