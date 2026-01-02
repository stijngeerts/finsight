import { Component } from '../../core/Component';
import type { EventBus } from '../../core/EventBus';
import type { StateManager } from '../../state/StateManager';
import { IncomeStats } from './IncomeStats';
import { IncomeGrid } from './IncomeGrid';
import { createElement } from '../../core/DOMHelpers';

export class IncomePage extends Component {
    private stats: IncomeStats;
    private grid: IncomeGrid;

    constructor(eventBus: EventBus, stateManager: StateManager) {
        super(eventBus);

        this.stats = new IncomeStats(eventBus, stateManager);
        this.grid = new IncomeGrid(eventBus, stateManager);
    }

    render(): HTMLElement {
        const section = createElement('section', 'section');

        const title = createElement('h2', '', 'Income Tracker');
        section.appendChild(title);

        this.stats.mount(section);

        const subtitle = createElement('h3', 'subsection-title', 'Monthly Income by Person');
        section.appendChild(subtitle);

        this.grid.mount(section);

        return section;
    }
}
