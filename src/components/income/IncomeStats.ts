import { Component } from '../../core/Component';
import type { EventBus } from '../../core/EventBus';
import type { StateManager } from '../../state/StateManager';
import { StatCard } from '../base/StatCard';
import { createElement } from '../../core/DOMHelpers';
import { formatCurrency } from '../../utils/formatters';
import { calculateTotalIncome, calculateAverageMonthly, calculateMealVouchers, calculateExtraIncome } from '../../services/IncomeService';
import { AppEvents } from '../../types';

export class IncomeStats extends Component {
    private stateManager: StateManager;
    private totalAnnualCard: StatCard;
    private avgMonthlyCard: StatCard;
    private mealVouchersCard: StatCard;
    private extraIncomeCard: StatCard;

    constructor(eventBus: EventBus, stateManager: StateManager) {
        super(eventBus);
        this.stateManager = stateManager;

        this.totalAnnualCard = new StatCard(eventBus, { label: 'Total Annual Income', value: formatCurrency(0) });
        this.avgMonthlyCard = new StatCard(eventBus, { label: 'Average Monthly', value: formatCurrency(0) });
        this.mealVouchersCard = new StatCard(eventBus, { label: 'Total Meal Vouchers', value: formatCurrency(0) });
        this.extraIncomeCard = new StatCard(eventBus, { label: 'Total Extra Income', value: formatCurrency(0) });

        this.subscribe(AppEvents.INCOME_UPDATED, () => this.updateStats());
        this.subscribe(AppEvents.SETTINGS_UPDATED, () => this.updateStats());
    }

    render(): HTMLElement {
        const container = createElement('div', 'stats stats-3-col');

        this.totalAnnualCard.mount(container);
        this.avgMonthlyCard.mount(container);
        this.mealVouchersCard.mount(container);
        this.extraIncomeCard.mount(container);

        this.updateStats();

        return container;
    }

    private updateStats(): void {
        const person1Income = this.stateManager.getIncome('person1');
        const person2Income = this.stateManager.getIncome('person2');
        const settings = this.stateManager.getSettings();

        const total = calculateTotalIncome(person1Income, person2Income, settings);
        const avg = calculateAverageMonthly(total);
        const mealVouchers = calculateMealVouchers(settings);
        const extraIncome = calculateExtraIncome(settings);

        this.totalAnnualCard.updateValue(formatCurrency(total));
        this.avgMonthlyCard.updateValue(formatCurrency(avg));
        this.mealVouchersCard.updateValue(formatCurrency(mealVouchers));
        this.extraIncomeCard.updateValue(formatCurrency(extraIncome));
    }
}
