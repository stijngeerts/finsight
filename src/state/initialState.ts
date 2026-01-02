import type { AppState } from '../types';
import { DEFAULT_WORKING_DAYS_PER_YEAR, DEFAULT_HOLIDAYS } from '../constants';
import { getCurrentMonthIndex } from '../utils/dateHelpers';

export const initialState: AppState = {
    settings: {
        totalWealthGoal: 0,
        savingsGoalYear: 0,
        currentSavingsAmount: 0,
        totalLoanAmount: 0,
        currentOpenCapital: 0,
        expectedDividends: 0,
        expectedDebtCollection: 0,
        workingDaysPerYear: DEFAULT_WORKING_DAYS_PER_YEAR,
        holidays: DEFAULT_HOLIDAYS,
        person1Name: 'Person 1',
        person2Name: 'Person 2',
        person1MealVoucher: 0,
        person2MealVoucher: 0,
        person1DefaultIncome: 0,
        person2DefaultIncome: 0,
        rentIncome: 0,
        utilitiesIncome: 0,
    },
    savings: {},
    realEstate: null,
    loan: {
        totalLoaned: 0,
        monthlyPayments: {}
    },
    income: {
        person1: {},
        person2: {}
    },
    ui: {
        currentTab: 'home',
        currentMonth: getCurrentMonthIndex()
    }
};
