import type { EventBus } from '../core/EventBus';
import type { StateManager } from '../state/StateManager';
import { TabNavigation } from '../components/navigation/TabNavigation';
import { HomePage } from '../components/home/HomePage';
import { SavingsPage } from '../components/savings/SavingsPage';
import { RealEstatePage } from '../components/realEstate/RealEstatePage';
import { LoanPage } from '../components/loan/LoanPage';
import { IncomePage } from '../components/income/IncomePage';
import { SettingsPage } from '../components/settings/SettingsPage';
import { Toast } from '../components/base/Toast';

export class Application {
    private eventBus: EventBus;
    private stateManager: StateManager;
    private toast: Toast;

    constructor(eventBus: EventBus, stateManager: StateManager) {
        this.eventBus = eventBus;
        this.stateManager = stateManager;
        this.toast = new Toast(eventBus);
    }

    initialize(): void {
        new TabNavigation(this.eventBus, this.stateManager).render();

        const homeTab = document.getElementById('home-tab');
        if (homeTab) {
            homeTab.innerHTML = '';
            new HomePage(this.eventBus, this.stateManager).mount(homeTab);
        }

        const savingsTab = document.getElementById('savings-tab');
        if (savingsTab) {
            savingsTab.innerHTML = '';
            new SavingsPage(this.eventBus, this.stateManager).mount(savingsTab);
        }

        const realEstateTab = document.getElementById('real-estate-tab');
        if (realEstateTab) {
            realEstateTab.innerHTML = '';
            new RealEstatePage(this.eventBus, this.stateManager).mount(realEstateTab);
        }

        const loanTab = document.getElementById('loan-tab');
        if (loanTab) {
            loanTab.innerHTML = '';
            new LoanPage(this.eventBus, this.stateManager).mount(loanTab);
        }

        const incomeTab = document.getElementById('income-tab');
        if (incomeTab) {
            incomeTab.innerHTML = '';
            new IncomePage(this.eventBus, this.stateManager).mount(incomeTab);
        }

        const settingsTab = document.getElementById('settings-tab');
        if (settingsTab) {
            settingsTab.innerHTML = '';
            new SettingsPage(this.eventBus, this.stateManager).mount(settingsTab);
        }

        this.toast.render();
        document.body.appendChild(this.toast.render());
    }
}
