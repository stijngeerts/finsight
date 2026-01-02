import { Component } from '../../core/Component';
import type { EventBus } from '../../core/EventBus';
import type { StateManager } from '../../state/StateManager';
import { StatCard } from '../base/StatCard';
import { formatCurrency } from '../../utils/formatters';
import { calculateTotalSavings, calculateSavingsProgress, calculateRemaining } from '../../services/SavingsService';
import { AppEvents } from '../../types';

export class SavingsStats extends Component {
    private stateManager: StateManager;
    private goalCard: StatCard;
    private savedCard: StatCard;
    private remainingCard: StatCard;
    private progressCard: StatCard;

    constructor(eventBus: EventBus, stateManager: StateManager) {
        super(eventBus);
        this.stateManager = stateManager;

        this.goalCard = new StatCard(eventBus, { label: 'Savings Goal', value: formatCurrency(0) });
        this.savedCard = new StatCard(eventBus, { label: 'Total Saved', value: formatCurrency(0) });
        this.remainingCard = new StatCard(eventBus, { label: 'Remaining', value: formatCurrency(0) });
        this.progressCard = new StatCard(eventBus, { label: 'Progress', value: '0%' });

        this.subscribe(AppEvents.SAVINGS_UPDATED, () => this.updateStats());
        this.subscribe(AppEvents.SETTINGS_UPDATED, () => this.updateStats());
    }

    render(): HTMLElement {
        const container = document.createElement('div');
        container.className = 'stats';
        container.id = 'savingsStatsContainer';

        this.goalCard.mount(container);
        this.savedCard.mount(container);
        this.remainingCard.mount(container);
        this.progressCard.mount(container);

        this.updateStats();

        return container;
    }

    private updateStats(): void {
        const settings = this.stateManager.getSettings();
        const savingsData = this.stateManager.getSavingsData();

        const total = calculateTotalSavings(savingsData);
        const remaining = calculateRemaining(total, settings.savingsGoalYear);
        const progress = calculateSavingsProgress(total, settings.savingsGoalYear);

        this.goalCard.updateValue(formatCurrency(settings.savingsGoalYear));
        this.savedCard.updateValue(formatCurrency(total));
        this.remainingCard.updateValue(formatCurrency(remaining));
        this.progressCard.updateValue(`${progress.toFixed(1)}%`);
    }
}
