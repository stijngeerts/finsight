import { Component } from '../../core/Component';
import type { EventBus } from '../../core/EventBus';
import type { StateManager } from '../../state/StateManager';
import { MonthCard } from '../base/MonthCard';
import { MONTHS } from '../../constants';
import { AppEvents } from '../../types';

export class SavingsGrid extends Component {
    private stateManager: StateManager;
    private monthCards: MonthCard[] = [];

    constructor(eventBus: EventBus, stateManager: StateManager) {
        super(eventBus);
        this.stateManager = stateManager;

        this.subscribe(AppEvents.DATA_IMPORTED, () => this.updateGrid());
        this.subscribe(AppEvents.DATA_RESET, () => this.updateGrid());
    }

    render(): HTMLElement {
        const grid = document.createElement('div');
        grid.className = 'months-grid';
        grid.id = 'savingsGrid';

        const savingsData = this.stateManager.getSavingsData();

        MONTHS.forEach((month) => {
            const monthCard = new MonthCard(this.eventBus, {
                month,
                value: savingsData[month],
                placeholder: 'Amount saved',
                onChange: (value) => {
                    this.stateManager.updateSavings(month, value);
                }
            });

            monthCard.mount(grid);
            this.monthCards.push(monthCard);
        });

        return grid;
    }

    private updateGrid(): void {
        const savingsData = this.stateManager.getSavingsData();
        MONTHS.forEach((month, index) => {
            if (this.monthCards[index]) {
                this.monthCards[index].setValue(savingsData[month] || 0);
            }
        });
    }
}
