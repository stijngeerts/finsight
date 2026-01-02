import { Component } from '../../core/Component';
import type { EventBus } from '../../core/EventBus';
import type { StateManager } from '../../state/StateManager';
import { createElement } from '../../core/DOMHelpers';
import { FormGroup } from '../base/FormGroup';
import { StatCard } from '../base/StatCard';
import { formatCurrency } from '../../utils/formatters';
import { calculateNetValue } from '../../services/RealEstateService';
import { getCurrentMonthBalance } from '../../services/LoanService';
import { AppEvents } from '../../types';

export class RealEstatePage extends Component {
    private stateManager: StateManager;
    private netProceedsCard: StatCard;

    constructor(eventBus: EventBus, stateManager: StateManager) {
        super(eventBus);
        this.stateManager = stateManager;

        this.netProceedsCard = new StatCard(eventBus, {
            label: 'Net Proceeds',
            value: formatCurrency(0),
            highlight: true,
            additionalInfo: 'Selling Price - Broker Fee - Fine - Current Loan Balance'
        });

        this.subscribe(AppEvents.REAL_ESTATE_UPDATED, () => this.updateNetProceeds());
        this.subscribe(AppEvents.LOAN_UPDATED, () => this.updateNetProceeds());
        this.subscribe(AppEvents.SETTINGS_UPDATED, () => this.updateNetProceeds());
    }

    render(): HTMLElement {
        const section = createElement('section', 'section');
        const title = createElement('h2', '', 'Real Estate Registration');
        section.appendChild(title);

        const realEstate = this.stateManager.getRealEstate();

        const formRow1 = createElement('div', 'form-row');
        const propertyName = new FormGroup(this.eventBus, {
            label: 'Property Name',
            inputId: 'realEstateName',
            inputType: 'text',
            value: realEstate?.name || '',
            placeholder: 'My Apartment',
            onChange: (value) => this.updateRealEstate({ name: value as string })
        });

        const sellingPrice = new FormGroup(this.eventBus, {
            label: 'Selling Price (€)',
            inputId: 'sellingPrice',
            inputType: 'number',
            value: realEstate?.sellingPrice || 0,
            placeholder: '250000',
            min: '0',
            step: '100',
            onChange: (value) => this.updateRealEstate({ sellingPrice: value as number })
        });

        propertyName.mount(formRow1);
        sellingPrice.mount(formRow1);

        const formRow2 = createElement('div', 'form-row');
        const brokerFee = new FormGroup(this.eventBus, {
            label: 'Broker Fee (%)',
            inputId: 'brokerFeePercentage',
            inputType: 'number',
            value: realEstate?.brokerFeePercentage || 0,
            placeholder: '3',
            min: '0',
            max: '100',
            step: '0.1',
            onChange: (value) => this.updateRealEstate({ brokerFeePercentage: value as number })
        });

        const earlyFine = new FormGroup(this.eventBus, {
            label: 'Early Repayment Fine (€)',
            inputId: 'earlyRepaymentFine',
            inputType: 'number',
            value: realEstate?.earlyRepaymentFine || 0,
            placeholder: '5000',
            min: '0',
            step: '100',
            onChange: (value) => this.updateRealEstate({ earlyRepaymentFine: value as number })
        });

        brokerFee.mount(formRow2);
        earlyFine.mount(formRow2);

        section.appendChild(formRow1);
        section.appendChild(formRow2);

        const subtitle = createElement('h3', 'subsection-title', 'Net Proceeds Calculation');
        section.appendChild(subtitle);

        const statsContainer = createElement('div', 'stats');
        this.netProceedsCard.mount(statsContainer);
        section.appendChild(statsContainer);

        this.updateNetProceeds();

        return section;
    }

    private updateRealEstate(partial: Partial<{name: string, sellingPrice: number, brokerFeePercentage: number, earlyRepaymentFine: number}>): void {
        const current = this.stateManager.getRealEstate();

        if (partial.name !== undefined && !partial.name) {
            this.stateManager.updateRealEstate(null);
        } else {
            const updated = {
                name: partial.name ?? current?.name ?? '',
                sellingPrice: partial.sellingPrice ?? current?.sellingPrice ?? 0,
                brokerFeePercentage: partial.brokerFeePercentage ?? current?.brokerFeePercentage ?? 0,
                earlyRepaymentFine: partial.earlyRepaymentFine ?? current?.earlyRepaymentFine ?? 0
            };

            if (updated.name) {
                this.stateManager.updateRealEstate(updated);
            }
        }
    }

    private updateNetProceeds(): void {
        const realEstate = this.stateManager.getRealEstate();
        const loan = this.stateManager.getLoanData();
        const settings = this.stateManager.getSettings();
        const currentMonth = this.stateManager.getCurrentMonth();

        const loanBalance = getCurrentMonthBalance(loan, settings, currentMonth);
        const netValue = calculateNetValue(realEstate, loanBalance);

        this.netProceedsCard.updateValue(formatCurrency(netValue));
    }
}
