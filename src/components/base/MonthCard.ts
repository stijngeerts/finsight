import { Component } from '../../core/Component';
import type { EventBus } from '../../core/EventBus';
import { createElement } from '../../core/DOMHelpers';
import { formatNumberInput, parseFormattedNumber, formatToEuropean } from '../../utils/inputFormatters';

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
        this.input.type = 'text';
        this.input.placeholder = this.config.placeholder || 'Amount saved';

        if (this.config.value !== undefined && this.config.value !== 0) {
            this.input.value = this.config.value.toString();
        }

        // Apply number formatting
        formatNumberInput(this.input);

        this.input.addEventListener('input', () => {
            const value = parseFormattedNumber(this.input!.value);
            this.config.onChange(value);
        });

        card.appendChild(title);
        card.appendChild(this.input);

        return card;
    }

    setValue(value: number): void {
        if (this.input) {
            if (value > 0) {
                this.input.value = formatToEuropean(value);
            } else {
                this.input.value = '';
            }
        }
    }

    getValue(): number {
        return this.input ? parseFormattedNumber(this.input.value) : 0;
    }
}
