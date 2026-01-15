// src/lib/gameLogic.js
import { WORDS } from '../constants/words';

// January 1, 2024
const EPOCH_DATE = new Date('2024-01-01T00:00:00');

export const getWordOfDay = () => {
    const now = new Date();
    
    // 1. Change msPerDay to msPerInterval (3 hours)
    const msPerInterval = 3 * 60 * 60 * 1000; 

    // 2. Calculate how many 3-hour intervals have passed
    const diff = now - EPOCH_DATE;
    const intervalIndex = Math.floor(diff / msPerInterval);

    // 3. Loop through words based on the interval index
    const index = intervalIndex % WORDS.length;

    return {
        solution: WORDS[index].word,
        translation: WORDS[index].translation,
        intervalIndex, // Formerly dayIndex
        // 4. Calculate the exact time the NEXT word appears
        nextDay: EPOCH_DATE.getTime() + (intervalIndex + 1) * msPerInterval
    };
};

export const saveGameState = (state) => {
    localStorage.setItem('chechenWordleState', JSON.stringify(state));
};

export const loadGameState = () => {
    const state = localStorage.getItem('chechenWordleState');
    if (!state) return null;

    const parsed = JSON.parse(state);
    const { solution } = getWordOfDay();

    // 5. IMPORTANT: If the word has changed since last visit, 
    // clear the saved progress so they can play the new word.
    if (parsed.solution !== solution) {
        localStorage.removeItem('chechenWordleState');
        return null;
    }

    return parsed;
};

export const isWordInDictionary = (guess) => {
    // Note: This matches the cleaned Cyrillic list perfectly now
    return WORDS.some(item => item.word.toUpperCase() === guess.toUpperCase());
};