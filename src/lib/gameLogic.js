// src/lib/gameLogic.js
import { WORDS } from '../constants/words';

const EPOCH_DATE = new Date('2024-01-01T00:00:00');

export const getWordOfDay = () => {
    const now = new Date();
    const msPerInterval = 3 * 60 * 60 * 1000; // 3 Hours

    const diff = now - EPOCH_DATE;
    const intervalIndex = Math.floor(diff / msPerInterval);
    const index = intervalIndex % WORDS.length;

    return {
        solution: WORDS[index].word.trim().toUpperCase(),
        translation: WORDS[index].translation,
        intervalIndex,
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
    const currentData = getWordOfDay();

    // Check if the saved game word matches today's 3-hour word
    // We use the word string itself as the "ID" for the round
    if (parsed.solution !== currentData.solution) {
        localStorage.removeItem('chechenWordleState');
        return null;
    }

    return parsed;
};