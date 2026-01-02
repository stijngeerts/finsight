import { Component } from '../../core/Component';
import type { EventBus } from '../../core/EventBus';
import type { StateManager } from '../../state/StateManager';
import { StatCard } from '../base/StatCard';
import { createElement } from '../../core/DOMHelpers';
import { formatCurrency } from '../../utils/formatters';
import { getCurrentMonthBalance, calculateTotalRepaid } from '../../services/LoanService';
import { AppEvents } from '../../types';

export class LoanStats extends Component {
    private stateManager: StateManager;
    private totalLoanCard: StatCard;
    private currentBalanceCard: StatCard;
    private totalRepaidCard: StatCard;

    constructor(eventBus: EventBus, stateManager: StateManager) {
        super(eventBus);
        this.stateManager = stateManager;

        this.totalLoanCard = new StatCard(eventBus, { label: 'Total Loan Amount', value: formatCurrency(0) });
        this.currentBalanceCard = new StatCard(eventBus, { label: 'Current Balance', value: formatCurrency(0) });
        this.totalRepaidCard = new StatCard(eventBus, { label: 'Total Repaid', value: formatCurrency(0) });

        this.subscribe(AppEvents.LOAN_UPDATED, () => this.updateStats());
        this.subscribe(AppEvents.SETTINGS_UPDATED, () => this.updateStats());
    }

    render(): HTMLElement {
        const container = createElement('div', 'stats');

        this.totalLoanCard.mount(container);
        this.currentBalanceCard.mount(container);
        this.totalRepaidCard.mount(container);

        this.updateStats();

        return container;
    }

    private updateStats(): void {
        const loan = this.stateManager.getLoanData();
        const settings = this.stateManager.getSettings();
        const currentMonth = this.stateManager.getCurrentMonth();

        const currentBalance = getCurrentMonthBalance(loan, settings, currentMonth);
        const totalRepaid = calculateTotalRepaid(loan.totalLoaned, currentBalance);

        this.totalLoanCard.updateValue(formatCurrency(loan.totalLoaned));
        this.currentBalanceCard.updateValue(formatCurrency(currentBalance));
        this.totalRepaidCard.updateValue(formatCurrency(totalRepaid));
    }
}
