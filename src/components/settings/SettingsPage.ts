import { Component } from '../../core/Component';
import type { EventBus } from '../../core/EventBus';
import type { StateManager } from '../../state/StateManager';
import { createElement } from '../../core/DOMHelpers';
import { FormGroup } from '../base/FormGroup';
import { exportData, importData, convertImportToState } from '../../services/DataService';
import { ResetModal } from '../modals/ResetModal';
import { AppEvents, type Settings } from '../../types';
import { initialState } from '../../state/initialState';
import { MONTHS } from '../../constants';

export class SettingsPage extends Component {
    private stateManager: StateManager;
    private resetModal: ResetModal;

    constructor(eventBus: EventBus, stateManager: StateManager) {
        super(eventBus);
        this.stateManager = stateManager;

        this.resetModal = new ResetModal(eventBus, () => this.handleReset());
    }

    render(): HTMLElement {
        const section = createElement('section', 'section');
        const title = createElement('h2', '', 'Settings');
        section.appendChild(title);

        const settings = this.stateManager.getSettings();

        section.appendChild(this.renderFinancialGoals(settings));
        section.appendChild(this.renderCurrentStatus(settings));
        section.appendChild(this.renderExpectedIncome(settings));
        section.appendChild(this.renderPeopleIncome(settings));
        section.appendChild(this.renderAdditionalIncome(settings));
        section.appendChild(this.renderWorkingDays(settings));
        section.appendChild(this.renderDataManagement());

        this.resetModal.mount(section);

        return section;
    }

    private renderFinancialGoals(settings: Settings): HTMLElement {
        const subsection = createElement('div', '');
        const subtitle = createElement('h3', 'subsection-title', 'Financial Goals');
        const formRow = createElement('div', 'form-row');

        const wealthGoal = new FormGroup(this.eventBus, {
            label: 'Total Wealth Goal (€)',
            inputId: 'totalWealthGoal',
            inputType: 'number',
            value: settings.totalWealthGoal,
            placeholder: '500000',
            min: '0',
            step: '1000',
            onChange: (value) => this.stateManager.updateSettings({ totalWealthGoal: value as number })
        });

        const savingsGoal = new FormGroup(this.eventBus, {
            label: 'Savings Goal for 2026 (€)',
            inputId: 'savingsGoalYear',
            inputType: 'number',
            value: settings.savingsGoalYear,
            placeholder: '50000',
            min: '0',
            step: '1000',
            onChange: (value) => this.stateManager.updateSettings({ savingsGoalYear: value as number })
        });

        wealthGoal.mount(formRow);
        savingsGoal.mount(formRow);

        subsection.appendChild(subtitle);
        subsection.appendChild(formRow);
        return subsection;
    }

    private renderCurrentStatus(settings: Settings): HTMLElement {
        const subsection = createElement('div', '');
        const subtitle = createElement('h3', 'subsection-title', 'Current Financial Status');
        const formRow = createElement('div', 'form-row');

        const currentSavings = new FormGroup(this.eventBus, {
            label: 'Current Savings Amount (€)',
            inputId: 'currentSavingsAmount',
            inputType: 'number',
            value: settings.currentSavingsAmount,
            placeholder: '10000',
            min: '0',
            step: '100',
            onChange: (value) => this.stateManager.updateSettings({ currentSavingsAmount: value as number })
        });

        const totalLoan = new FormGroup(this.eventBus, {
            label: 'Total Loan Amount (€)',
            inputId: 'settingsTotalLoanAmount',
            inputType: 'number',
            value: settings.totalLoanAmount,
            placeholder: '200000',
            min: '0',
            step: '1000',
            onChange: (value) => {
                this.stateManager.updateSettings({ totalLoanAmount: value as number });
                this.stateManager.updateLoan({ totalLoaned: value as number });
            }
        });

        currentSavings.mount(formRow);
        totalLoan.mount(formRow);

        const formRow2 = createElement('div', 'form-row');

        const openCapital = new FormGroup(this.eventBus, {
            label: 'Current Open Capital (€)',
            inputId: 'currentOpenCapital',
            inputType: 'number',
            value: settings.currentOpenCapital,
            placeholder: '180000',
            min: '0',
            step: '1000',
            helpText: 'The current outstanding loan balance',
            onChange: (value) => this.stateManager.updateSettings({ currentOpenCapital: value as number })
        });

        openCapital.mount(formRow2);

        subsection.appendChild(subtitle);
        subsection.appendChild(formRow);
        subsection.appendChild(formRow2);
        return subsection;
    }

    private renderExpectedIncome(settings: Settings): HTMLElement {
        const subsection = createElement('div', '');
        const subtitle = createElement('h3', 'subsection-title', 'Expected Income');
        const formRow = createElement('div', 'form-row');

        const dividends = new FormGroup(this.eventBus, {
            label: 'Expected Dividends (€)',
            inputId: 'expectedDividends',
            inputType: 'number',
            value: settings.expectedDividends,
            placeholder: '5000',
            min: '0',
            step: '100',
            onChange: (value) => this.stateManager.updateSettings({ expectedDividends: value as number })
        });

        const debtCollection = new FormGroup(this.eventBus, {
            label: 'Expected Debt Collection (€)',
            inputId: 'expectedDebtCollection',
            inputType: 'number',
            value: settings.expectedDebtCollection,
            placeholder: '2000',
            min: '0',
            step: '100',
            onChange: (value) => this.stateManager.updateSettings({ expectedDebtCollection: value as number })
        });

        dividends.mount(formRow);
        debtCollection.mount(formRow);

        subsection.appendChild(subtitle);
        subsection.appendChild(formRow);
        return subsection;
    }

    private renderPeopleIncome(settings: Settings): HTMLElement {
        const subsection = createElement('div', '');
        const subtitle = createElement('h3', 'subsection-title', 'People & Income');

        const person1Row = createElement('div', 'form-row');
        const p1Name = new FormGroup(this.eventBus, {
            label: 'Person 1 Name',
            inputId: 'person1Name',
            inputType: 'text',
            value: settings.person1Name,
            placeholder: 'Person 1',
            onChange: (value) => this.stateManager.updateSettings({ person1Name: value as string })
        });

        const p1Income = new FormGroup(this.eventBus, {
            label: 'Person 1 Monthly Income (€)',
            inputId: 'person1DefaultIncome',
            inputType: 'number',
            value: settings.person1DefaultIncome,
            placeholder: '3000',
            min: '0',
            step: '100',
            onChange: (value) => {
                const oldDefault = this.stateManager.getSettings().person1DefaultIncome;
                this.stateManager.updateSettings({ person1DefaultIncome: value as number });
                const numValue = value as number;
                MONTHS.forEach(month => {
                    const current = this.stateManager.getIncome('person1')[month];
                    if (current === undefined || current === null || current === 0 || current === oldDefault) {
                        this.stateManager.updateIncome('person1', month, numValue);
                    }
                });
            }
        });

        const p1Voucher = new FormGroup(this.eventBus, {
            label: 'Person 1 Meal Voucher (€/day)',
            inputId: 'person1MealVoucher',
            inputType: 'number',
            value: settings.person1MealVoucher,
            placeholder: '10',
            min: '0',
            step: '0.50',
            onChange: (value) => this.stateManager.updateSettings({ person1MealVoucher: value as number })
        });

        p1Name.mount(person1Row);
        p1Income.mount(person1Row);
        p1Voucher.mount(person1Row);

        const person2Row = createElement('div', 'form-row');
        const p2Name = new FormGroup(this.eventBus, {
            label: 'Person 2 Name',
            inputId: 'person2Name',
            inputType: 'text',
            value: settings.person2Name,
            placeholder: 'Person 2',
            onChange: (value) => this.stateManager.updateSettings({ person2Name: value as string })
        });

        const p2Income = new FormGroup(this.eventBus, {
            label: 'Person 2 Monthly Income (€)',
            inputId: 'person2DefaultIncome',
            inputType: 'number',
            value: settings.person2DefaultIncome,
            placeholder: '2500',
            min: '0',
            step: '100',
            onChange: (value) => {
                const oldDefault = this.stateManager.getSettings().person2DefaultIncome;
                this.stateManager.updateSettings({ person2DefaultIncome: value as number });
                const numValue = value as number;
                MONTHS.forEach(month => {
                    const current = this.stateManager.getIncome('person2')[month];
                    if (current === undefined || current === null || current === 0 || current === oldDefault) {
                        this.stateManager.updateIncome('person2', month, numValue);
                    }
                });
            }
        });

        const p2Voucher = new FormGroup(this.eventBus, {
            label: 'Person 2 Meal Voucher (€/day)',
            inputId: 'person2MealVoucher',
            inputType: 'number',
            value: settings.person2MealVoucher,
            placeholder: '6',
            min: '0',
            step: '0.50',
            onChange: (value) => this.stateManager.updateSettings({ person2MealVoucher: value as number })
        });

        p2Name.mount(person2Row);
        p2Income.mount(person2Row);
        p2Voucher.mount(person2Row);

        subsection.appendChild(subtitle);
        subsection.appendChild(person1Row);
        subsection.appendChild(person2Row);
        return subsection;
    }

    private renderAdditionalIncome(settings: Settings): HTMLElement {
        const subsection = createElement('div', '');
        const subtitle = createElement('h3', 'subsection-title', 'Additional Income');
        const formRow = createElement('div', 'form-row');

        const rentIncome = new FormGroup(this.eventBus, {
            label: 'Monthly Rent Income (€)',
            inputId: 'rentIncome',
            inputType: 'number',
            value: settings.rentIncome,
            placeholder: '500',
            min: '0',
            step: '50',
            helpText: 'Rent received per month',
            onChange: (value) => this.stateManager.updateSettings({ rentIncome: value as number })
        });

        const utilitiesIncome = new FormGroup(this.eventBus, {
            label: 'Monthly Utilities Income (€)',
            inputId: 'utilitiesIncome',
            inputType: 'number',
            value: settings.utilitiesIncome,
            placeholder: '150',
            min: '0',
            step: '10',
            helpText: 'Utilities reimbursement per month',
            onChange: (value) => this.stateManager.updateSettings({ utilitiesIncome: value as number })
        });

        rentIncome.mount(formRow);
        utilitiesIncome.mount(formRow);

        subsection.appendChild(subtitle);
        subsection.appendChild(formRow);
        return subsection;
    }

    private renderWorkingDays(settings: Settings): HTMLElement {
        const subsection = createElement('div', '');
        const subtitle = createElement('h3', 'subsection-title', 'Working Days');
        const formRow = createElement('div', 'form-row');

        const workingDays = new FormGroup(this.eventBus, {
            label: 'Working Days Per Year',
            inputId: 'workingDaysPerYear',
            inputType: 'number',
            value: settings.workingDaysPerYear,
            placeholder: '260',
            min: '0',
            step: '1',
            onChange: (value) => this.stateManager.updateSettings({ workingDaysPerYear: value as number })
        });

        const holidays = new FormGroup(this.eventBus, {
            label: 'Holidays',
            inputId: 'holidays',
            inputType: 'number',
            value: settings.holidays,
            placeholder: '20',
            min: '0',
            step: '1',
            onChange: (value) => this.stateManager.updateSettings({ holidays: value as number })
        });

        workingDays.mount(formRow);
        holidays.mount(formRow);

        subsection.appendChild(subtitle);
        subsection.appendChild(formRow);
        return subsection;
    }

    private renderDataManagement(): HTMLElement {
        const subsection = createElement('div', '');
        const subtitle = createElement('h3', 'subsection-title', 'Data Management');
        const actionsBar = createElement('div', 'actions-bar');

        const exportBtn = createElement('button', 'action-btn export-btn', 'Export Data');
        exportBtn.addEventListener('click', () => this.handleExport());

        const importBtn = createElement('button', 'action-btn import-btn', 'Import Data');
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.json';
        fileInput.style.display = 'none';
        fileInput.id = 'fileInput';
        fileInput.addEventListener('change', (e) => this.handleImport(e));
        importBtn.addEventListener('click', () => fileInput.click());

        const resetBtn = createElement('button', 'reset-btn', 'Reset All');
        resetBtn.addEventListener('click', () => this.resetModal.open());

        actionsBar.appendChild(exportBtn);
        actionsBar.appendChild(importBtn);
        actionsBar.appendChild(resetBtn);

        subsection.appendChild(subtitle);
        subsection.appendChild(actionsBar);
        subsection.appendChild(fileInput);
        return subsection;
    }

    private handleExport(): void {
        const state = this.stateManager.getFullState();
        exportData(state);
        this.publish(AppEvents.SHOW_MESSAGE, { message: 'Data exported successfully!' });
    }

    private async handleImport(event: Event): Promise<void> {
        const target = event.target as HTMLInputElement;
        const file = target.files?.[0];
        if (!file) return;

        try {
            const imported = await importData(file);
            const currentState = this.stateManager.getFullState();
            const newState = convertImportToState(imported, currentState);
            this.stateManager.resetState(newState);
            this.publish(AppEvents.SHOW_MESSAGE, { message: 'Data imported successfully!' });
            this.publish(AppEvents.DATA_IMPORTED);
        } catch (error) {
            this.publish(AppEvents.SHOW_MESSAGE, { message: 'Error importing data. Please check the file format.' });
        }

        target.value = '';
    }

    private handleReset(): void {
        this.stateManager.resetState(initialState);
        this.publish(AppEvents.SHOW_MESSAGE, { message: 'All data has been reset!' });
    }
}
