import { Component } from '../../core/Component';
import type { EventBus } from '../../core/EventBus';
import { createElement } from '../../core/DOMHelpers';

export interface StatCardConfig {
    label: string;
    value: string;
    highlight?: boolean;
    additionalInfo?: string;
}

export class StatCard extends Component {
    private config: StatCardConfig;
    private valueElement: HTMLElement | null = null;

    constructor(eventBus: EventBus, config: StatCardConfig) {
        super(eventBus);
        this.config = config;
    }

    render(): HTMLElement {
        const card = createElement('div', `stat-card${this.config.highlight ? ' highlight' : ''}`);

        const label = createElement('div', 'stat-label', this.config.label);
        this.valueElement = createElement('div', 'stat-value', this.config.value);

        card.appendChild(label);
        card.appendChild(this.valueElement);

        if (this.config.additionalInfo) {
            const info = createElement('small', '', this.config.additionalInfo);
            info.style.cssText = 'color: rgba(255,255,255,0.8); margin-top: 8px; display: block;';
            card.appendChild(info);
        }

        return card;
    }

    updateValue(value: string): void {
        if (this.valueElement) {
            this.valueElement.textContent = value;
        }
    }

    updateLabel(label: string): void {
        this.config.label = label;
        if (this.element) {
            const labelElement = this.element.querySelector('.stat-label');
            if (labelElement) {
                labelElement.textContent = label;
            }
        }
    }
}
