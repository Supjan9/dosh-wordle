import React, { useState, useEffect } from 'react';

export default function Modal({ isWon, solution, translation, turn, guesses, isVisible, onClose, nextDayTimestamp }) {
  const [shareText, setShareText] = useState('SHARE');
  const [timeLeft, setTimeLeft] = useState('');

  // Countdown Timer
  useEffect(() => {
    if (!isVisible) return;
    const timer = setInterval(() => {
      const now = new Date();
      const diff = nextDayTimestamp - now;
      if (diff <= 0) {
        setTimeLeft('READY!');
        clearInterval(timer);
      } else {
        const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const m = Math.floor((diff / 1000 / 60) % 60);
        const s = Math.floor((diff / 1000) % 60);
        setTimeLeft(`${h}h ${m}m ${s}s`);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [isVisible, nextDayTimestamp]);

  if (!isVisible) return null;

  // --- THE ROBUST SHARE LOGIC ---
  const handleShare = async () => {
    // 1. Generate the Text
    const emojiGrid = guesses
      .slice(0, turn + (isWon ? 1 : 0)) 
      .map((row) => {
        return row.map((tile) => {
          if (tile.color === 'correct') return '🟩';
          if (tile.color === 'present') return '🟨';
          return '⬛';
        }).join('');
      })
      .join('\n');

    const title = `Chechen Wordle ${isWon ? turn + 1 : 'X'}/6`;
    const textToShare = `${title}\n\n${emojiGrid}`;

    // 2. Try Native Share (Mobile)
    if (navigator.share) {
      try {
        await navigator.share({ text: textToShare });
        return; // If successful, stop here
      } catch (err) {
        console.log('User cancelled share or failed, falling back to clipboard');
      }
    }

    // 3. Try Clipboard (Desktop/Fallback)
    try {
      // Method A: Modern API (Works on HTTPS / Localhost)
      await navigator.clipboard.writeText(textToShare);
      triggerCopyFeedback();
    } catch (err) {
      // Method B: Legacy Fallback (Works on HTTP / Local IPs)
      // This creates a hidden text box and manually copies from it
      const textArea = document.createElement("textarea");
      textArea.value = textToShare;
      
      // Ensure it's not visible but part of the DOM
      textArea.style.top = "0";
      textArea.style.left = "0";
      textArea.style.position = "fixed";

      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        document.execCommand('copy');
        triggerCopyFeedback();
      } catch (err2) {
        alert("Unable to copy. Please take a screenshot!");
      }

      document.body.removeChild(textArea);
    }
  };

  const triggerCopyFeedback = () => {
    setShareText('COPIED!');
    setTimeout(() => setShareText('SHARE'), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in px-4">
      <div className="bg-[#121213] border border-[#3a3a3c] p-6 rounded-xl shadow-2xl w-full max-w-sm text-center relative animate-slide-up">
        
        <button onClick={onClose} className="absolute top-3 right-4 text-[#565758] hover:text-white text-2xl">
          &times;
        </button>

        <h2 className="text-3xl font-black mb-1 text-white uppercase tracking-wide">
          {isWon ? 'You Won!' : 'Game Over'}
        </h2>
        
        {/* Solution */}
        <div className="my-6 bg-[#1a1a1b] rounded-lg p-4 border border-[#3a3a3c]">
          <p className="text-[#818384] text-xs uppercase tracking-widest mb-1">The word was</p>
          <div className="text-3xl font-black tracking-wider text-white mb-1">{solution}</div>
          <div className="text-lg text-[#6aaa64] font-serif italic border-t border-[#3a3a3c] pt-2 mt-2">"{translation}"</div>
        </div>

        {/* Stats Row */}
        <div className="flex justify-center gap-8 mb-6">
          <div className="flex flex-col">
            <span className="text-3xl font-bold text-white">{turn + (isWon ? 1 : 0)}</span>
            <span className="text-xs text-[#818384]">GUESSES</span>
          </div>
          <div className="flex flex-col">
            <span className="text-3xl font-bold text-white">100%</span>
            <span className="text-xs text-[#818384]">ACCURACY</span>
          </div>
        </div>

        {/* Footer: Timer & Share */}
        <div className="flex gap-4 border-t border-[#3a3a3c] pt-6">
          <div className="flex-1 flex flex-col justify-center border-r border-[#3a3a3c] pr-4">
             <span className="text-xs font-bold text-white uppercase">Next Word</span>
             <span className="text-xl font-mono text-white">{timeLeft}</span>
          </div>
          
          <button 
            onClick={handleShare}
            className={`flex-1 font-bold py-3 rounded-lg uppercase tracking-widest text-sm transition-colors flex items-center justify-center gap-2
              ${shareText === 'COPIED!' ? 'bg-white text-black' : 'bg-[#538d4e] hover:bg-[#467a41] text-white'}
            `}
          >
            {shareText === 'SHARE' && <span>📤</span>}
            {shareText === 'COPIED!' && <span>📋</span>}
            {shareText}
          </button>
        </div>

      </div>
    </div>
  );
}