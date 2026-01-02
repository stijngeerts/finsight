import { Component } from '../../core/Component';
import type { EventBus } from '../../core/EventBus';
import type { StateManager } from '../../state/StateManager';
import { createElement } from '../../core/DOMHelpers';
import { formatNumberInput, parseFormattedNumber, formatToEuropean } from '../../utils/inputFormatters';
import { MONTHS } from '../../constants';
import { AppEvents } from '../../types';

export class IncomeGrid extends Component {
    private stateManager: StateManager;

    constructor(eventBus: EventBus, stateManager: StateManager) {
        super(eventBus);
        this.stateManager = stateManager;

        this.subscribe(AppEvents.DATA_IMPORTED, () => this.updateGrid());
        this.subscribe(AppEvents.DATA_RESET, () => this.updateGrid());
        this.subscribe(AppEvents.SETTINGS_UPDATED, () => this.updateGrid());
        this.subscribe(AppEvents.INCOME_UPDATED, () => this.updateGrid());
    }

    render(): HTMLElement {
        const grid = createElement('div', 'income-grid');
        grid.id = 'incomeGrid';

        const person1Income = this.stateManager.getIncome('person1');
        const person2Income = this.stateManager.getIncome('person2');
        const settings = this.stateManager.getSettings();

        MONTHS.forEach((month) => {
            const card = createElement('div', 'income-card');
            const title = createElement('h3', '', month);
            card.appendChild(title);

            const inputsDiv = createElement('div', 'income-inputs');

            const p1Group = createElement('div', 'input-group');
            const p1Label = createElement('label', '', settings.person1Name);
            const p1Input = document.createElement('input');
            p1Input.type = 'text';
            p1Input.id = `person1Income${month}`;
            p1Input.placeholder = '0,00';
            const p1Value = person1Income[month] || 0;
            if (p1Value > 0) p1Input.value = p1Value.toString();
            formatNumberInput(p1Input);

            p1Group.appendChild(p1Label);
            p1Group.appendChild(p1Input);

            const p2Group = createElement('div', 'input-group');
            const p2Label = createElement('label', '', settings.person2Name);
            const p2Input = document.createElement('input');
            p2Input.type = 'text';
            p2Input.id = `person2Income${month}`;
            p2Input.placeholder = '0,00';
            const p2Value = person2Income[month] || 0;
            if (p2Value > 0) p2Input.value = p2Value.toString();
            formatNumberInput(p2Input);

            p2Group.appendChild(p2Label);
            p2Group.appendChild(p2Input);

            inputsDiv.appendChild(p1Group);
            inputsDiv.appendChild(p2Group);
            card.appendChild(inputsDiv);

            p1Input.addEventListener('input', () => {
                const value = parseFormattedNumber(p1Input.value);
                this.stateManager.updateIncome('person1', month, value);
            });

            p2Input.addEventListener('input', () => {
                const value = parseFormattedNumber(p2Input.value);
                this.stateManager.updateIncome('person2', month, value);
            });

            grid.appendChild(card);
        });

        return grid;
    }

    private updateGrid(): void {
        if (!this.element) return;

        const person1Income = this.stateManager.getIncome('person1');
        const person2Income = this.stateManager.getIncome('person2');
        const settings = this.stateManager.getSettings();

        MONTHS.forEach((month) => {
            const p1Input = document.getElementById(`person1Income${month}`) as HTMLInputElement;
            const p2Input = document.getElementById(`person2Income${month}`) as HTMLInputElement;
            const p1Label = p1Input?.parentElement?.querySelector('label');
            const p2Label = p2Input?.parentElement?.querySelector('label');

            if (p1Label) p1Label.textContent = settings.person1Name;
            if (p2Label) p2Label.textContent = settings.person2Name;

            if (p1Input) {
                const value = person1Income[month];
                if (value !== undefined && value !== null) {
                    p1Input.value = value > 0 ? formatToEuropean(value) : '';
                }
            }
            if (p2Input) {
                const value = person2Income[month];
                if (value !== undefined && value !== null) {
                    p2Input.value = value > 0 ? formatToEuropean(value) : '';
                }
            }
        });
    }
}
