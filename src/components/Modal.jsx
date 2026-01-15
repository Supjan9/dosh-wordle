import React, { useState, useEffect } from 'react';
import { X, Copy, Check } from 'lucide-react'; // Removed Share2, added Copy

export default function Modal({ isWon, solution, translation, turn, guesses, isVisible, onClose, nextDayTimestamp }) {
  const [shareText, setShareText] = useState('ДЕКЪА'); // "Share"
  const [timeLeft, setTimeLeft] = useState('');

  // --- COUNTDOWN TIMER ---
  useEffect(() => {
    if (!isVisible) return;
    const timer = setInterval(() => {
      const now = new Date();
      const diff = nextDayTimestamp - now;
      
      if (diff <= 0) {
        setTimeLeft('КИЙЧА!'); // "Ready!"
        clearInterval(timer);
      } else {
        const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const m = Math.floor((diff / 1000 / 60) % 60);
        const s = Math.floor((diff / 1000) % 60);
        setTimeLeft(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [isVisible, nextDayTimestamp]);

  if (!isVisible) return null;

  // --- SHARE LOGIC (FORCED COPY) ---
  const handleShare = async () => {
    // 1. Generate Emoji Grid
    const emojiGrid = guesses
      .slice(0, turn) 
      .map((row) => {
        return row.map((tile) => {
          if (tile.color === 'correct') return '🟩';
          if (tile.color === 'present') return '🟨';
          return '⬛';
        }).join('');
      })
      .join('\n');

    const title = `ДОШ ${isWon ? turn : 'X'}/6`;
    const textToShare = `${title}\n\n${emojiGrid}\n\nhttps://supjan9.github.io/dosh-wordle`;

    // 2. Copy to Clipboard (Directly)
    try {
      // Modern Copy Method (Works on HTTPS and Localhost)
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(textToShare);
        triggerCopyFeedback();
      } else {
        // Legacy Copy Method (For older browsers or HTTP)
        const textArea = document.createElement("textarea");
        textArea.value = textToShare;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
          document.execCommand('copy');
          triggerCopyFeedback();
        } catch (err) {
          alert("Copy failed. Please take a screenshot!");
        }
        
        document.body.removeChild(textArea);
      }
    } catch (err) {
      alert("Error copying to clipboard");
    }
  };

  const triggerCopyFeedback = () => {
    setShareText('СХЬАИЙЦИ!'); // "Copied!"
    setTimeout(() => setShareText('ДЕКЪА'), 2000); // Back to "Share"
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in px-4">
      <div className="bg-[#1e1e1f] border border-[#3a3a3c] p-6 rounded-xl shadow-2xl w-full max-w-sm text-center relative animate-slide-up">
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-3 right-4 text-[#565758] hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Title (Win/Loss) */}
        <h2 className="text-3xl font-black mb-1 text-white uppercase tracking-wide">
          {isWon ? 'ТОЛАМ!' : 'ЭШАМ...'}
        </h2>
        
        {/* Solution Display */}
        <div className="my-6 bg-[#121213] rounded-lg p-4 border border-[#3a3a3c] shadow-inner">
          <p className="text-[#818384] text-xs uppercase tracking-widest mb-2">ХӀара дош дара</p>
          <div className="text-3xl font-black tracking-wider text-white mb-1 uppercase">
            {solution}
          </div>
          <div className="text-lg text-[#6aaa64] font-serif italic border-t border-[#3a3a3c] pt-2 mt-2">
            "{translation}"
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex justify-center gap-8 mb-6">
          <div className="flex flex-col">
            <span className="text-3xl font-bold text-white">{turn}</span>
            <span className="text-[10px] text-[#818384] uppercase tracking-wider">ГIОРТАРШ</span>
          </div>
          <div className="flex flex-col">
            <span className="text-3xl font-bold text-white">{isWon ? '100%' : '0%'}</span>
            <span className="text-[10px] text-[#818384] uppercase tracking-wider">КХИАМ</span>
          </div>
        </div>

        {/* Footer: Timer & Share */}
        <div className="flex gap-4 border-t border-[#3a3a3c] pt-6">
          <div className="flex-1 flex flex-col justify-center items-center border-r border-[#3a3a3c] pr-4">
             <span className="text-[10px] font-bold text-[#818384] uppercase tracking-wider">Керла дош</span>
             <span className="text-xl font-mono text-white tracking-widest">{timeLeft}</span>
          </div>
          
          <button 
            onClick={handleShare}
            className={`
              flex-1 font-bold py-3 rounded-lg uppercase tracking-widest text-sm transition-all transform active:scale-95 flex items-center justify-center gap-2 shadow-lg
              ${shareText === 'СХЬАИЙЦИ!' ? 'bg-white text-black' : 'bg-[#538d4e] hover:bg-[#467a41] text-white'}
            `}
          >
            {/* UPDATED ICON: Uses Copy instead of Share2 */}
            {shareText === 'ДЕКЪА' && <Copy className="w-4 h-4" />}
            {shareText === 'СХЬАИЙЦИ!' && <Check className="w-4 h-4" />}
            {shareText}
          </button>
        </div>

      </div>
    </div>
  );
}