import { Component } from '../../core/Component';
import type { EventBus } from '../../core/EventBus';
import type { StateManager } from '../../state/StateManager';
import { SavingsStats } from './SavingsStats';
import { SavingsGrid } from './SavingsGrid';
import { createElement } from '../../core/DOMHelpers';

export class SavingsPage extends Component {
    private stats: SavingsStats;
    private grid: SavingsGrid;

    constructor(eventBus: EventBus, stateManager: StateManager) {
        super(eventBus);

        this.stats = new SavingsStats(eventBus, stateManager);
        this.grid = new SavingsGrid(eventBus, stateManager);
    }

    render(): HTMLElement {
        const section = createElement('section', 'section');

        const title = createElement('h2', '', 'Savings Tracker');
        section.appendChild(title);

        this.stats.mount(section);

        const subtitle = createElement('h3', 'subsection-title', 'Monthly Savings');
        section.appendChild(subtitle);

        this.grid.mount(section);

        return section;
    }
}
