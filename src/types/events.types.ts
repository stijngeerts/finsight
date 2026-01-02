import type { Settings } from './settings.types';
import type { RealEstate, LoanData } from './financial.types';

export const AppEvents = {
    SETTINGS_UPDATED: 'settings:updated',
    SAVINGS_UPDATED: 'savings:updated',
    REAL_ESTATE_UPDATED: 'realEstate:updated',
    LOAN_UPDATED: 'loan:updated',
    INCOME_UPDATED: 'income:updated',
    TAB_CHANGED: 'tab:changed',
    DATA_EXPORTED: 'data:exported',
    DATA_IMPORTED: 'data:imported',
    DATA_RESET: 'data:reset',
    WEALTH_CALCULATED: 'wealth:calculated',
    SHOW_MESSAGE: 'message:show',
} as const;

export interface SettingsUpdatedPayload {
    settings: Partial<Settings>;
}

export interface SavingsUpdatedPayload {
    month: string;
    amount: number;
}

export interface RealEstateUpdatedPayload {
    realEstate: RealEstate | null;
}

export interface LoanUpdatedPayload {
    loan: Partial<LoanData>;
}

export interface IncomeUpdatedPayload {
    person: 'person1' | 'person2';
    month: string;
    amount: number;
}

export interface TabChangedPayload {
    tabName: string;
}

export interface ShowMessagePayload {
    message: string;
}

export type EventCallback<T = any> = (data: T) => void;
