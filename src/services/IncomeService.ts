import type { IncomeData, Settings } from '../types';

export function calculateTotalIncome(
    person1Income: IncomeData,
    person2Income: IncomeData,
    settings: Settings
): number {
    const p1Total = Object.values(person1Income).reduce((sum, val) => sum + (val || 0), 0);
    const p2Total = Object.values(person2Income).reduce((sum, val) => sum + (val || 0), 0);
    const rentTotal = settings.rentIncome * 12;
    const utilitiesTotal = settings.utilitiesIncome * 12;
    const mealVouchers = calculateMealVouchers(settings);

    return p1Total + p2Total + rentTotal + utilitiesTotal + mealVouchers;
}

export function calculateAverageMonthly(total: number): number {
    return total / 12;
}

export function calculateMealVouchers(settings: Settings): number {
    const workingDays = settings.workingDaysPerYear - settings.holidays;
    return workingDays * (settings.person1MealVoucher + settings.person2MealVoucher);
}

export function calculateExtraIncome(settings: Settings): number {
    const rentTotal = settings.rentIncome * 12;
    const utilitiesTotal = settings.utilitiesIncome * 12;
    return rentTotal + utilitiesTotal;
}
