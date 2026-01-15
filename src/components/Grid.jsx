import React from 'react';

export default function Grid({ guesses, currentGuess, turn, isShaking }) {
  return (
    <div className="flex flex-col gap-1.5 w-full max-w-[350px] px-2">
      {guesses.map((guess, i) => {
        if (turn === i) {
          // Pass the 'isShaking' prop ONLY to the current row
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
    <div className={`grid grid-cols-5 gap-1.5 ${isShaking ? 'animate-shake' : ''}`}>
      {/* ^ NOTICE: The 'animate-shake' class is applied to the ROW container 
         if 'isShaking' is true. This shakes the whole word together.
      */}
      
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
            className={`
              w-full aspect-square border-2 flex items-center justify-center 
              text-3xl font-bold uppercase text-white select-none
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
          className="w-full aspect-square border-2 border-[#3a3a3c] flex items-center justify-center"
        />
      ))}
    </div>
  );
}