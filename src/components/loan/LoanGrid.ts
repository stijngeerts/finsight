import { Component } from '../../core/Component';
import type { EventBus } from '../../core/EventBus';
import type { StateManager } from '../../state/StateManager';
import { createElement } from '../../core/DOMHelpers';
import { formatNumberInput } from '../../utils/inputFormatters';
import { MONTHS } from '../../constants';
import { AppEvents } from '../../types';

export class LoanGrid extends Component {
    private stateManager: StateManager;

    constructor(eventBus: EventBus, stateManager: StateManager) {
        super(eventBus);
        this.stateManager = stateManager;

        this.subscribe(AppEvents.DATA_IMPORTED, () => this.updateGrid());
        this.subscribe(AppEvents.DATA_RESET, () => this.updateGrid());
    }

    render(): HTMLElement {
        const grid = createElement('div', 'loan-grid');
        grid.id = 'loanGrid';

        const loan = this.stateManager.getLoanData();

        MONTHS.forEach((month) => {
            const card = createElement('div', 'loan-card');
            const title = createElement('h3', '', month);
            card.appendChild(title);

            const inputsDiv = createElement('div', 'loan-inputs');

            const interestGroup = createElement('div', 'input-group');
            const interestLabel = createElement('label', '', 'Interest (€)');
            const interestInput = document.createElement('input');
            interestInput.type = 'number';
            interestInput.id = `loanInterest${month}`;
            interestInput.placeholder = '0.00';
            interestInput.min = '0.00';
            interestInput.step = '0.01';
            interestInput.value = (loan.monthlyPayments[month]?.interest || 0).toString();
            formatNumberInput(interestInput);

            interestGroup.appendChild(interestLabel);
            interestGroup.appendChild(interestInput);

            const principalGroup = createElement('div', 'input-group');
            const principalLabel = createElement('label', '', 'Principal (€)');
            const principalInput = document.createElement('input');
            principalInput.type = 'number';
            principalInput.id = `loanPrincipal${month}`;
            principalInput.placeholder = '0.00';
            principalInput.min = '0.00';
            principalInput.step = '0.01';
            principalInput.value = (loan.monthlyPayments[month]?.principal || 0).toString();
            formatNumberInput(principalInput);

            principalGroup.appendChild(principalLabel);
            principalGroup.appendChild(principalInput);

            inputsDiv.appendChild(interestGroup);
            inputsDiv.appendChild(principalGroup);
            card.appendChild(inputsDiv);

            interestInput.addEventListener('input', () => {
                const interest = parseFloat(interestInput.value) || 0;
                const principal = parseFloat(principalInput.value) || 0;
                this.stateManager.updateLoan({
                    monthlyPayments: {
                        ...loan.monthlyPayments,
                        [month]: { interest, principal }
                    }
                });
            });

            principalInput.addEventListener('input', () => {
                const interest = parseFloat(interestInput.value) || 0;
                const principal = parseFloat(principalInput.value) || 0;
                this.stateManager.updateLoan({
                    monthlyPayments: {
                        ...loan.monthlyPayments,
                        [month]: { interest, principal }
                    }
                });
            });

            grid.appendChild(card);
        });

        return grid;
    }

    private updateGrid(): void {
        if (!this.element) return;

        const loan = this.stateManager.getLoanData();
        MONTHS.forEach((month) => {
            const interestInput = document.getElementById(`loanInterest${month}`) as HTMLInputElement;
            const principalInput = document.getElementById(`loanPrincipal${month}`) as HTMLInputElement;

            if (interestInput) {
                interestInput.value = (loan.monthlyPayments[month]?.interest || 0).toString();
            }
            if (principalInput) {
                principalInput.value = (loan.monthlyPayments[month]?.principal || 0).toString();
            }
        });
    }
}
