import { Component } from '../../core/Component';
import type { EventBus } from '../../core/EventBus';
import type { StateManager } from '../../state/StateManager';
import { createElement } from '../../core/DOMHelpers';
import { StatCard } from '../base/StatCard';
import { formatCurrency } from '../../utils/formatters';
import { calculateCurrentWealth, calculateProjectedWealth } from '../../services/WealthService';
import { calculateSavingsYTD, calculateTotalSavings } from '../../services/SavingsService';
import { getCurrentMonthBalance, getYearEndBalance } from '../../services/LoanService';
import { calculateNetValue } from '../../services/RealEstateService';
import { AppEvents } from '../../types';

export class HomePage extends Component {
    private stateManager: StateManager;
    private currentWealthCard: StatCard;
    private projectedWealthCard: StatCard;
    private wealthGoalCard: StatCard;

    constructor(eventBus: EventBus, stateManager: StateManager) {
        super(eventBus);
        this.stateManager = stateManager;

        this.currentWealthCard = new StatCard(eventBus, { label: 'Current Wealth (Today)', value: formatCurrency(0), highlight: true });
        this.projectedWealthCard = new StatCard(eventBus, { label: 'Projected Year-End', value: formatCurrency(0), highlight: true });
        this.wealthGoalCard = new StatCard(eventBus, { label: 'Wealth Goal', value: formatCurrency(0), highlight: true });

        this.subscribe(AppEvents.SETTINGS_UPDATED, () => this.update());
        this.subscribe(AppEvents.SAVINGS_UPDATED, () => this.update());
        this.subscribe(AppEvents.REAL_ESTATE_UPDATED, () => this.update());
        this.subscribe(AppEvents.LOAN_UPDATED, () => this.update());
        this.subscribe(AppEvents.DATA_IMPORTED, () => this.update());
        this.subscribe(AppEvents.DATA_RESET, () => this.update());
    }

    render(): HTMLElement {
        const section = createElement('section', 'section');

        const title = createElement('h2', '', 'Wealth Overview');
        section.appendChild(title);

        const statsContainer = createElement('div', 'stats');
        this.currentWealthCard.mount(statsContainer);
        this.projectedWealthCard.mount(statsContainer);
        this.wealthGoalCard.mount(statsContainer);
        section.appendChild(statsContainer);

        section.appendChild(this.renderCurrentBreakdown());
        section.appendChild(this.renderProjectedBreakdown());

        this.update();

        return section;
    }

    private renderCurrentBreakdown(): HTMLElement {
        const container = createElement('div', '');
        const subtitle = createElement('h3', 'subsection-title', 'Current Wealth Breakdown');
        const breakdownGrid = createElement('div', 'breakdown-grid');
        breakdownGrid.id = 'currentBreakdown';

        const initialSavings = createElement('div', 'breakdown-item');
        initialSavings.innerHTML = `
            <span class="breakdown-label">Initial Savings</span>
            <span class="breakdown-value" id="initialSavings">€0.00</span>
        `;

        const savingsYTD = createElement('div', 'breakdown-item');
        savingsYTD.innerHTML = `
            <span class="breakdown-label">Savings YTD</span>
            <span class="breakdown-value" id="savingsYTD">€0.00</span>
        `;

        const netRealEstate = createElement('div', 'breakdown-item');
        netRealEstate.innerHTML = `
            <span class="breakdown-label">Net Real Estate Value</span>
            <span class="breakdown-value" id="netRealEstate">€0.00</span>
        `;

        breakdownGrid.appendChild(initialSavings);
        breakdownGrid.appendChild(savingsYTD);
        breakdownGrid.appendChild(netRealEstate);

        container.appendChild(subtitle);
        container.appendChild(breakdownGrid);
        return container;
    }

    private renderProjectedBreakdown(): HTMLElement {
        const container = createElement('div', '');
        const subtitle = createElement('h3', 'subsection-title', 'Projected Year-End Breakdown');
        const breakdownGrid = createElement('div', 'breakdown-grid');
        breakdownGrid.id = 'projectedBreakdown';

        const projInitial = createElement('div', 'breakdown-item');
        projInitial.innerHTML = `
            <span class="breakdown-label">Initial Savings</span>
            <span class="breakdown-value" id="projInitialSavings">€0.00</span>
        `;

        const projTotal = createElement('div', 'breakdown-item');
        projTotal.innerHTML = `
            <span class="breakdown-label">Total Savings (Full Year)</span>
            <span class="breakdown-value" id="projTotalSavings">€0.00</span>
        `;

        const projNet = createElement('div', 'breakdown-item');
        projNet.innerHTML = `
            <span class="breakdown-label">Net Real Estate (Year-End)</span>
            <span class="breakdown-value" id="projNetRealEstate">€0.00</span>
        `;

        const projBusiness = createElement('div', 'breakdown-item');
        projBusiness.innerHTML = `
            <span class="breakdown-label">Income From Business</span>
            <span class="breakdown-value" id="projectedBusinessIncome">€0.00</span>
        `;

        breakdownGrid.appendChild(projInitial);
        breakdownGrid.appendChild(projTotal);
        breakdownGrid.appendChild(projNet);
        breakdownGrid.appendChild(projBusiness);

        container.appendChild(subtitle);
        container.appendChild(breakdownGrid);
        return container;
    }

    update(): void {
        const settings = this.stateManager.getSettings();
        const savings = this.stateManager.getSavingsData();
        const realEstate = this.stateManager.getRealEstate();
        const loan = this.stateManager.getLoanData();
        const currentMonth = this.stateManager.getCurrentMonth();

        const currentWealth = calculateCurrentWealth(settings, savings, realEstate, loan, currentMonth);
        const projectedWealth = calculateProjectedWealth(settings, savings, realEstate, loan);

        this.currentWealthCard.updateValue(formatCurrency(currentWealth));
        this.projectedWealthCard.updateValue(formatCurrency(projectedWealth));
        this.wealthGoalCard.updateValue(formatCurrency(settings.totalWealthGoal));

        this.updateBreakdowns(settings, savings, realEstate, loan, currentMonth);
    }

    private updateBreakdowns(settings: any, savings: any, realEstate: any, loan: any, currentMonth: number): void {
        const savingsYTD = calculateSavingsYTD(savings, currentMonth);
        const totalSavings = calculateTotalSavings(savings);
        const currentLoanBalance = getCurrentMonthBalance(loan, settings, currentMonth);
        const yearEndLoanBalance = getYearEndBalance(loan, settings);
        const currentNetRE = calculateNetValue(realEstate, currentLoanBalance);
        const projectedNetRE = calculateNetValue(realEstate, yearEndLoanBalance);

        const initialSavingsEl = document.getElementById('initialSavings');
        const savingsYTDEl = document.getElementById('savingsYTD');
        const netRealEstateEl = document.getElementById('netRealEstate');
        const projInitialEl = document.getElementById('projInitialSavings');
        const projTotalSavingsEl = document.getElementById('projTotalSavings');
        const projNetRealEstateEl = document.getElementById('projNetRealEstate');
        const projBusinessEl = document.getElementById('projectedBusinessIncome');

        if (initialSavingsEl) initialSavingsEl.textContent = formatCurrency(settings.currentSavingsAmount);
        if (savingsYTDEl) savingsYTDEl.textContent = formatCurrency(savingsYTD);
        if (netRealEstateEl) netRealEstateEl.textContent = formatCurrency(currentNetRE);
        if (projInitialEl) projInitialEl.textContent = formatCurrency(settings.currentSavingsAmount);
        if (projTotalSavingsEl) projTotalSavingsEl.textContent = formatCurrency(totalSavings);
        if (projNetRealEstateEl) projNetRealEstateEl.textContent = formatCurrency(projectedNetRE);
        if (projBusinessEl) projBusinessEl.textContent = formatCurrency(settings.expectedDividends + settings.expectedDebtCollection);
    }
}
