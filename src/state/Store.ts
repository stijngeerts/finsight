import type { AppState } from '../types';
import type { EventBus } from '../core/EventBus';

export class Store {
    private state: AppState;
    private eventBus: EventBus;

    constructor(initialState: AppState, eventBus: EventBus) {
        this.state = initialState;
        this.eventBus = eventBus;
    }

    getState(): Readonly<AppState> {
        return this.state;
    }

    setState(partial: Partial<AppState>, eventName?: string): void {
        this.state = {
            ...this.state,
            ...partial
        };

        if (eventName) {
            this.eventBus.publish(eventName, this.state);
        }
    }

    updateSettings(settings: Partial<AppState['settings']>, eventName?: string): void {
        this.state = {
            ...this.state,
            settings: {
                ...this.state.settings,
                ...settings
            }
        };

        if (eventName) {
            this.eventBus.publish(eventName, this.state.settings);
        }
    }

    updateSavings(month: string, amount: number, eventName?: string): void {
        this.state = {
            ...this.state,
            savings: {
                ...this.state.savings,
                [month]: amount
            }
        };

        if (eventName) {
            this.eventBus.publish(eventName, { month, amount });
        }
    }

    updateRealEstate(realEstate: AppState['realEstate'], eventName?: string): void {
        this.state = {
            ...this.state,
            realEstate
        };

        if (eventName) {
            this.eventBus.publish(eventName, realEstate);
        }
    }

    updateLoan(loan: Partial<AppState['loan']>, eventName?: string): void {
        this.state = {
            ...this.state,
            loan: {
                ...this.state.loan,
                ...loan
            }
        };

        if (eventName) {
            this.eventBus.publish(eventName, this.state.loan);
        }
    }

    updateIncome(person: 'person1' | 'person2', month: string, amount: number, eventName?: string): void {
        this.state = {
            ...this.state,
            income: {
                ...this.state.income,
                [person]: {
                    ...this.state.income[person],
                    [month]: amount
                }
            }
        };

        if (eventName) {
            this.eventBus.publish(eventName, { person, month, amount });
        }
    }

    updateUI(ui: Partial<AppState['ui']>, eventName?: string): void {
        this.state = {
            ...this.state,
            ui: {
                ...this.state.ui,
                ...ui
            }
        };

        if (eventName) {
            this.eventBus.publish(eventName, this.state.ui);
        }
    }
}
