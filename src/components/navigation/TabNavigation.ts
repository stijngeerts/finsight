import { Component } from '../../core/Component';
import type { EventBus } from '../../core/EventBus';
import type { StateManager } from '../../state/StateManager';
import { querySelectorAll } from '../../core/DOMHelpers';

export class TabNavigation extends Component {
    private stateManager: StateManager;

    constructor(eventBus: EventBus, stateManager: StateManager) {
        super(eventBus);
        this.stateManager = stateManager;
    }

    render(): HTMLElement {
        const tabsContainer = document.querySelector<HTMLElement>('.tabs');
        if (!tabsContainer) {
            throw new Error('Tabs container not found');
        }

        const tabs = querySelectorAll<HTMLButtonElement>('.tab', tabsContainer);
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const onclick = tab.getAttribute('onclick');
                if (onclick) {
                    const match = onclick.match(/switchTab\('([^']+)'\)/);
                    if (match) {
                        this.switchTab(match[1]);
                    }
                }
            });
        });

        return tabsContainer as HTMLElement;
    }

    switchTab(tabName: string): void {
        const tabContents = querySelectorAll<HTMLElement>('.tab-content');
        tabContents.forEach(content => content.classList.remove('active'));

        const tabs = querySelectorAll<HTMLButtonElement>('.tab');
        tabs.forEach(tab => tab.classList.remove('active'));

        const selectedTab = document.getElementById(`${tabName}-tab`);
        if (selectedTab) selectedTab.classList.add('active');

        const clickedTab = Array.from(tabs).find(tab => {
            const onclick = tab.getAttribute('onclick');
            return onclick && onclick.includes(tabName);
        });
        if (clickedTab) clickedTab.classList.add('active');

        this.stateManager.setCurrentTab(tabName);
    }
}
