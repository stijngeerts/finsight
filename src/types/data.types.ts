import type { Settings } from './settings.types';
import type { RealEstate, LoanData } from './financial.types';

export interface SavingsData {
    [month: string]: number;
}

export interface IncomeData {
    [month: string]: number;
}

export interface ExportData {
    settings: Settings;
    savings: SavingsData;
    realEstate: RealEstate | null;
    loan: LoanData;
    person1Income: IncomeData;
    person2Income: IncomeData;
    exportDate: string;
}

export interface AppState {
    settings: Settings;
    savings: SavingsData;
    realEstate: RealEstate | null;
    loan: LoanData;
    income: {
        person1: IncomeData;
        person2: IncomeData;
    };
    ui: {
        currentTab: string;
        currentMonth: number;
    };
}
