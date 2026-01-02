import type { SavingsData } from '../types';
import { MONTHS } from '../constants';

export function calculateSavingsYTD(savingsData: SavingsData, currentMonth: number): number {
    let total = 0;
    for (let i = 0; i <= currentMonth; i++) {
        total += savingsData[MONTHS[i]] || 0;
    }
    return total;
}

export function calculateTotalSavings(savingsData: SavingsData): number {
    return Object.values(savingsData).reduce((sum, val) => sum + (val || 0), 0);
}

export function calculateSavingsProgress(saved: number, goal: number): number {
    return goal > 0 ? (saved / goal) * 100 : 0;
}

export function calculateRemaining(saved: number, goal: number): number {
    return Math.max(0, goal - saved);
}
