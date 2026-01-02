import { Component } from '../../core/Component';
import type { EventBus } from '../../core/EventBus';
import { createElement } from '../../core/DOMHelpers';
import { formatNumberInput } from '../../utils/inputFormatters';

export interface MonthCardConfig {
    month: string;
    value?: number;
    placeholder?: string;
    onChange: (value: number) => void;
}

export class MonthCard extends Component {
    private config: MonthCardConfig;
    private input: HTMLInputElement | null = null;

    constructor(eventBus: EventBus, config: MonthCardConfig) {
        super(eventBus);
        this.config = config;
    }

    render(): HTMLElement {
        const card = createElement('div', 'month-card');

        const title = createElement('h3', '', this.config.month);
        this.input = document.createElement('input');
        this.input.type = 'number';
        this.input.placeholder = this.config.placeholder || 'Amount saved';
        this.input.min = '0';
        this.input.step = '0.01';

        if (this.config.value !== undefined && this.config.value !== 0) {
            this.input.value = this.config.value.toString();
        }

        // Apply number formatting
        formatNumberInput(this.input);

        this.input.addEventListener('input', () => {
            const value = parseFloat(this.input!.value);
            this.config.onChange(isNaN(value) ? 0 : value);
        });

        card.appendChild(title);
        card.appendChild(this.input);

        return card;
    }

    setValue(value: number): void {
        if (this.input) {
            this.input.value = value > 0 ? value.toString() : '';
        }
    }

    getValue(): number {
        return this.input ? (parseFloat(this.input.value) || 0) : 0;
    }
}
