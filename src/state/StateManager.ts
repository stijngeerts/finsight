import type { Store } from './Store';
import type { Settings, RealEstate, LoanData, SavingsData, IncomeData } from '../types';
import { AppEvents } from '../types';

export class StateManager {
    private store: Store;

    constructor(store: Store) {
        this.store = store;
    }

    getSettings(): Settings {
        return this.store.getState().settings;
    }

    updateSettings(settings: Partial<Settings>): void {
        this.store.updateSettings(settings, AppEvents.SETTINGS_UPDATED);
    }

    getSavingsData(): SavingsData {
        return this.store.getState().savings;
    }

    updateSavings(month: string, amount: number): void {
        this.store.updateSavings(month, amount, AppEvents.SAVINGS_UPDATED);
    }

    getRealEstate(): RealEstate | null {
        return this.store.getState().realEstate;
    }

    updateRealEstate(realEstate: RealEstate | null): void {
        this.store.updateRealEstate(realEstate, AppEvents.REAL_ESTATE_UPDATED);
    }

    getLoanData(): LoanData {
        return this.store.getState().loan;
    }

    updateLoan(loan: Partial<LoanData>): void {
        this.store.updateLoan(loan, AppEvents.LOAN_UPDATED);
    }

    getIncome(person: 'person1' | 'person2'): IncomeData {
        return this.store.getState().income[person];
    }

    updateIncome(person: 'person1' | 'person2', month: string, amount: number): void {
        this.store.updateIncome(person, month, amount, AppEvents.INCOME_UPDATED);
    }

    setCurrentTab(tabName: string): void {
        this.store.updateUI({ currentTab: tabName }, AppEvents.TAB_CHANGED);
    }

    getCurrentMonth(): number {
        return this.store.getState().ui.currentMonth;
    }

    getFullState(): Readonly<ReturnType<Store['getState']>> {
        return this.store.getState();
    }

    resetState(newState: ReturnType<Store['getState']>): void {
        this.store.setState(newState, AppEvents.DATA_RESET);
    }
}
