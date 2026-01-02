import { Component } from '../../core/Component';
import type { EventBus } from '../../core/EventBus';
import type { StateManager } from '../../state/StateManager';
import { LoanStats } from './LoanStats';
import { LoanGrid } from './LoanGrid';
import { createElement } from '../../core/DOMHelpers';

export class LoanPage extends Component {
    private stats: LoanStats;
    private grid: LoanGrid;

    constructor(eventBus: EventBus, stateManager: StateManager) {
        super(eventBus);

        this.stats = new LoanStats(eventBus, stateManager);
        this.grid = new LoanGrid(eventBus, stateManager);
    }

    render(): HTMLElement {
        const section = createElement('section', 'section');

        const title = createElement('h2', '', 'Loan Amortization Schedule');
        section.appendChild(title);

        this.stats.mount(section);

        const subtitle = createElement('h3', 'subsection-title', 'Monthly Payment Breakdown');
        section.appendChild(subtitle);

        this.grid.mount(section);

        return section;
    }
}
