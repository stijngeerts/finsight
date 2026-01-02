import type { LoanData, Settings } from '../types';
import { MONTHS } from '../constants';

export function getCurrentMonthBalance(loan: LoanData, settings: Settings, currentMonth: number): number {
    if (settings.currentOpenCapital > 0) {
        return settings.currentOpenCapital;
    }

    let balance = loan.totalLoaned;
    for (let i = 0; i <= currentMonth; i++) {
        const payment = loan.monthlyPayments[MONTHS[i]];
        if (payment && payment.principal) {
            balance -= payment.principal;
        }
    }
    return Math.max(0, balance);
}

export function getYearEndBalance(loan: LoanData, settings: Settings): number {
    // If currentOpenCapital is set, use it as the starting point
    // and only subtract payments from NEXT month onwards
    if (settings.currentOpenCapital > 0) {
        const currentDate = new Date();
        const currentMonthIndex = currentDate.getMonth();
        let balance = settings.currentOpenCapital;

        // Subtract principal payments from NEXT month to end of year
        // (currentOpenCapital already reflects the current month)
        for (let i = currentMonthIndex + 1; i < MONTHS.length; i++) {
            const payment = loan.monthlyPayments[MONTHS[i]];
            if (payment && payment.principal) {
                balance -= payment.principal;
            }
        }
        return Math.max(0, balance);
    }

    // Otherwise calculate from total loan amount
    let balance = loan.totalLoaned;
    MONTHS.forEach(month => {
        const payment = loan.monthlyPayments[month];
        if (payment && payment.principal) {
            balance -= payment.principal;
        }
    });
    return Math.max(0, balance);
}

export function calculateTotalRepaid(totalLoan: number, currentBalance: number): number {
    return Math.max(0, totalLoan - currentBalance);
}
