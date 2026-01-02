import { Component } from '../../core/Component';
import type { EventBus } from '../../core/EventBus';
import { createElement } from '../../core/DOMHelpers';
import { formatNumberInput } from '../../utils/inputFormatters';

export interface FormGroupConfig {
    label: string;
    inputId: string;
    inputType: 'text' | 'number' | 'checkbox';
    value?: string | number | boolean;
    placeholder?: string;
    min?: string;
    max?: string;
    step?: string;
    helpText?: string;
    onChange: (value: string | number | boolean) => void;
}

export class FormGroup extends Component {
    private config: FormGroupConfig;
    private input: HTMLInputElement | null = null;

    constructor(eventBus: EventBus, config: FormGroupConfig) {
        super(eventBus);
        this.config = config;
    }

    render(): HTMLElement {
        const group = createElement('div', 'form-group');

        const label = createElement('label', '');
        label.setAttribute('for', this.config.inputId);
        label.textContent = this.config.label;

        this.input = document.createElement('input');
        this.input.type = this.config.inputType;
        this.input.id = this.config.inputId;

        if (this.config.inputType !== 'checkbox') {
            if (this.config.placeholder) this.input.placeholder = this.config.placeholder;
            if (this.config.min) this.input.min = this.config.min;
            if (this.config.max) this.input.max = this.config.max;
            if (this.config.step) this.input.step = this.config.step;

            if (this.config.value !== undefined) {
                this.input.value = this.config.value.toString();
            }

            // Apply number formatting for number inputs
            if (this.config.inputType === 'number') {
                formatNumberInput(this.input);
            }

            this.input.addEventListener('input', () => {
                const value = this.config.inputType === 'number'
                    ? (parseFloat(this.input!.value) || 0)
                    : this.input!.value;
                this.config.onChange(value);
            });
        } else {
            this.input.checked = this.config.value as boolean || false;
            this.input.addEventListener('change', () => {
                this.config.onChange(this.input!.checked);
            });
        }

        group.appendChild(label);
        group.appendChild(this.input);

        if (this.config.helpText) {
            const helpText = createElement('small', '', this.config.helpText);
            helpText.style.cssText = 'color: #718096; margin-top: 6px;';
            group.appendChild(helpText);
        }

        return group;
    }

    setValue(value: string | number | boolean): void {
        if (!this.input) return;

        if (this.config.inputType === 'checkbox') {
            this.input.checked = value as boolean;
        } else {
            this.input.value = value.toString();
        }
    }

    getValue(): string | number | boolean {
        if (!this.input) return this.config.inputType === 'checkbox' ? false : '';

        if (this.config.inputType === 'checkbox') {
            return this.input.checked;
        } else if (this.config.inputType === 'number') {
            return parseFloat(this.input.value) || 0;
        } else {
            return this.input.value;
        }
    }
}
