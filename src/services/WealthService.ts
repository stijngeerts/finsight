import type { Settings, SavingsData, RealEstate, LoanData } from '../types';
import { calculateSavingsYTD, calculateTotalSavings } from './SavingsService';
import { getCurrentMonthBalance, getYearEndBalance } from './LoanService';
import { calculateNetValue } from './RealEstateService';

export function calculateCurrentWealth(
    settings: Settings,
    savings: SavingsData,
    realEstate: RealEstate | null,
    loan: LoanData,
    currentMonth: number
): number {
    const savingsYTD = calculateSavingsYTD(savings, currentMonth);
    const currentLoanBalance = getCurrentMonthBalance(loan, settings, currentMonth);
    const netRealEstateValue = calculateNetValue(realEstate, currentLoanBalance);

    return settings.currentSavingsAmount + savingsYTD + netRealEstateValue;
}

export function calculateProjectedWealth(
    settings: Settings,
    savings: SavingsData,
    realEstate: RealEstate | null,
    loan: LoanData
): number {
    const totalSavings = calculateTotalSavings(savings);
    const yearEndLoanBalance = getYearEndBalance(loan, settings);
    const netRealEstateValue = calculateNetValue(realEstate, yearEndLoanBalance);

    return settings.currentSavingsAmount
        + totalSavings
        + netRealEstateValue
        + settings.expectedDividends
        + settings.expectedDebtCollection;
}
