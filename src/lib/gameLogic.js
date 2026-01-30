// src/lib/gameLogic.js
import { WORDS } from '../constants/words';

// By NOT adding 'Z' or a timezone, this is interpreted as 
// Jan 1st, 2024 at 00:00:00 in the USER'S local time.
const EPOCH_DATE = new Date('2024-01-01T00:00:00');

export const getWordOfDay = () => {
    const now = new Date();
    const msPerDay = 86400000; // 24 * 60 * 60 * 1000

    // .setHours(0,0,0,0) effectively "rounds down" to the start of the current day
    // This makes the math much cleaner for "one per day" logic
    const todayStart = new Date(now).setHours(0, 0, 0, 0);
    const epochStart = new Date(EPOCH_DATE).setHours(0, 0, 0, 0);

    const diff = todayStart - epochStart;
    const intervalIndex = Math.floor(diff / msPerDay);
    const index = intervalIndex % WORDS.length;

    return {
        solution: WORDS[index].word.trim().toUpperCase(),
        translation: WORDS[index].translation,
        intervalIndex,
        // The exact millisecond the user's clock hits midnight tonight
        nextDay: todayStart + msPerDay 
    };
};

export const saveGameState = (state) => {
    localStorage.setItem('chechenWordleState', JSON.stringify(state));
};

export const loadGameState = () => {
    const state = localStorage.getItem('chechenWordleState');
    if (!state) return null;

    const parsed = JSON.parse(state);
    const currentData = getWordOfDay();

    // Reset board if the stored solution doesn't match today's solution
    if (parsed.solution !== currentData.solution) {
        localStorage.removeItem('chechenWordleState');
        return null;
    }

    return parsed;
};