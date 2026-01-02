// Types
interface RealEstate {
    name: string;
    sellingPrice: number;
    brokerFeePercentage: number;
    earlyRepaymentFine: number;
}

interface LoanPayment {
    interest: number;
    principal: number;
}

interface LoanData {
    totalLoaned: number;
    monthlyPayments: { [month: string]: LoanPayment };
}

interface Settings {
    totalWealthGoal: number;
    savingsGoalYear: number;
    currentSavingsAmount: number;
    totalLoanAmount: number;
    currentOpenCapital: number;
    expectedDividends: number;
    expectedDebtCollection: number;
    workingDaysPerYear: number;
    holidays: number;
    person1Name: string;
    person2Name: string;
    person1MealVoucher: number;
    person2MealVoucher: number;
    person1DefaultIncome: number;
    person2DefaultIncome: number;
    rentIncome: number;
    utilitiesIncome: number;
    refinanceLoan: boolean;
}

interface SavingsData {
    [month: string]: number;
}

interface ExportData {
    settings: Settings;
    savings: SavingsData;
    realEstate: RealEstate | null;
    loan: LoanData;
    person1Income: { [month: string]: number };
    person2Income: { [month: string]: number };
    exportDate: string;
}

// Constants
const MONTHS: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

// Get current month index
const currentDate = new Date();
const currentMonthIndex = currentDate.getMonth();

// State
let settings: Settings = {
    totalWealthGoal: 0,
    savingsGoalYear: 0,
    currentSavingsAmount: 0,
    totalLoanAmount: 0,
    currentOpenCapital: 0,
    expectedDividends: 0,
    expectedDebtCollection: 0,
    workingDaysPerYear: 260,
    holidays: 20,
    person1Name: 'Person 1',
    person2Name: 'Person 2',
    person1MealVoucher: 0,
    person2MealVoucher: 0,
    person1DefaultIncome: 0,
    person2DefaultIncome: 0,
    rentIncome: 0,
    utilitiesIncome: 0,
    refinanceLoan: false
};

let savingsData: SavingsData = {};
let realEstate: RealEstate | null = null;
let loanData: LoanData = { totalLoaned: 0, monthlyPayments: {} };
let person1Income: { [month: string]: number } = {};
let person2Income: { [month: string]: number } = {};

// Helper functions
function formatCurrency(amount: number): string {
    return `€${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function getCurrentMonthBalance(): number {
    // If we have a current open capital set in settings, use that as base
    if (settings.currentOpenCapital > 0) {
        return settings.currentOpenCapital;
    }

    // Otherwise calculate from loan amount and payments
    let balance = loanData.totalLoaned;
    for (let i = 0; i <= currentMonthIndex; i++) {
        const payment = loanData.monthlyPayments[MONTHS[i]];
        if (payment && payment.principal) {
            balance -= payment.principal;
        }
    }
    return Math.max(0, balance);
}

function getYearEndBalance(): number {
    let balance = loanData.totalLoaned;
    MONTHS.forEach(month => {
        const payment = loanData.monthlyPayments[month];
        if (payment && payment.principal) {
            balance -= payment.principal;
        }
    });
    return Math.max(0, balance);
}

function getSavingsYTD(): number {
    let total = 0;
    for (let i = 0; i <= currentMonthIndex; i++) {
        total += savingsData[MONTHS[i]] || 0;
    }
    return total;
}

function getTotalSavings(): number {
    return Object.values(savingsData).reduce((sum, val) => sum + (val || 0), 0);
}

function getNetRealEstateValue(useFutureBalance: boolean = false): number {
    if (!realEstate) return 0;
    const loanBalance = useFutureBalance ? getYearEndBalance() : getCurrentMonthBalance();
    return realEstate.sellingPrice - (realEstate.sellingPrice * realEstate.brokerFeePercentage * 1.21) - realEstate.earlyRepaymentFine - loanBalance;
}

function getTotalMealVouchers(): number {
    const workingDays = settings.workingDaysPerYear - settings.holidays;
    return workingDays * (settings.person1MealVoucher + settings.person2MealVoucher);
}

// Tab switching
function switchTab(tabName: string): void {
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => content.classList.remove('active'));

    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => tab.classList.remove('active'));

    const selectedTab = document.getElementById(`${tabName}-tab`);
    if (selectedTab) selectedTab.classList.add('active');

    const clickedTab = Array.from(tabs).find(tab =>
        tab.getAttribute('onclick')?.includes(tabName)
    );
    if (clickedTab) clickedTab.classList.add('active');
}

// Initialize Home Page
function updateHomePage(): void {
    // Current Wealth
    const currentWealth = settings.currentSavingsAmount + getSavingsYTD() + getNetRealEstateValue(false);
    const currentWealthEl = document.getElementById('currentWealth');
    if (currentWealthEl) currentWealthEl.textContent = formatCurrency(currentWealth);

    // Projected Year End
    const projectedWealth = settings.currentSavingsAmount + getTotalSavings() + getNetRealEstateValue(true) + settings.expectedDividends + settings.expectedDebtCollection;
    const projectedWealthEl = document.getElementById('projectedWealth');
    if (projectedWealthEl) projectedWealthEl.textContent = formatCurrency(projectedWealth);

    // Wealth Goal
    const wealthGoalEl = document.getElementById('wealthGoal');
    if (wealthGoalEl) wealthGoalEl.textContent = formatCurrency(settings.totalWealthGoal);

    // Current Breakdown
    const initialSavingsEl = document.getElementById('initialSavings');
    const savingsYTDEl = document.getElementById('savingsYTD');
    const netRealEstateEl = document.getElementById('netRealEstate');

    if (initialSavingsEl) initialSavingsEl.textContent = formatCurrency(settings.currentSavingsAmount);
    if (savingsYTDEl) savingsYTDEl.textContent = formatCurrency(getSavingsYTD());
    if (netRealEstateEl) netRealEstateEl.textContent = formatCurrency(getNetRealEstateValue(false));

    // Projected Breakdown
    const projInitialEl = document.getElementById('projInitialSavings');
    const projTotalSavingsEl = document.getElementById('projTotalSavings');
    const projNetRealEstateEl = document.getElementById('projNetRealEstate');
    const projBusinessIncome = document.getElementById('projBusinessIncome');

    if (projInitialEl) projInitialEl.textContent = formatCurrency(settings.currentSavingsAmount);
    if (projTotalSavingsEl) projTotalSavingsEl.textContent = formatCurrency(getTotalSavings());
    if (projNetRealEstateEl) projNetRealEstateEl.textContent = formatCurrency(getNetRealEstateValue(true));
    if (projBusinessIncome) projBusinessIncome.textContent = formatCurrency(settings.expectedDividends + settings.expectedDebtCollection);
}

// Initialize Savings
function initializeSavings(): void {
    const grid = document.getElementById('savingsGrid');
    if (!grid) return;
    grid.innerHTML = '';

    MONTHS.forEach((month, index) => {
        const card = document.createElement('div');
        card.className = 'month-card';
        card.innerHTML = `
      <h3>${month}</h3>
      <input type="number" id="savings${index}" placeholder="Amount saved" min="0" step="0.01">
    `;
        grid.appendChild(card);

        const input = document.getElementById(`savings${index}`) as HTMLInputElement;
        if (input) {
            input.value = savingsData[month]?.toString() || '';
            input.addEventListener('input', () => {
                const value = parseFloat(input.value);
                savingsData[month] = isNaN(value) ? 0 : value;
                updateSavingsStats();
                updateHomePage();
            });
        }
    });
    updateSavingsStats();
}

function updateSavingsStats(): void {
    const goalEl = document.getElementById('savingsGoalStat');
    const savedEl = document.getElementById('totalSavedStat');
    const remainingEl = document.getElementById('remainingStat');
    const progressEl = document.getElementById('progressStat');

    const total = getTotalSavings();
    const remaining = Math.max(0, settings.savingsGoalYear - total);
    const progress = settings.savingsGoalYear > 0 ? (total / settings.savingsGoalYear) * 100 : 0;

    if (goalEl) goalEl.textContent = formatCurrency(settings.savingsGoalYear);
    if (savedEl) savedEl.textContent = formatCurrency(total);
    if (remainingEl) remainingEl.textContent = formatCurrency(remaining);
    if (progressEl) progressEl.textContent = `${progress.toFixed(1)}%`;
}

// Initialize Real Estate
function initializeRealEstate(): void {
    const nameInput = document.getElementById('realEstateName') as HTMLInputElement;
    const sellingInput = document.getElementById('sellingPrice') as HTMLInputElement;
    const brokerInput = document.getElementById('brokerFeePercentage') as HTMLInputElement;
    const fineInput = document.getElementById('earlyRepaymentFine') as HTMLInputElement;

    // Set initial values if realEstate exists
    if (realEstate) {
        if (nameInput) nameInput.value = realEstate.name;
        if (sellingInput) sellingInput.value = realEstate.sellingPrice.toString();
        if (brokerInput) brokerInput.value = realEstate.brokerFeePercentage.toString();
        if (fineInput) fineInput.value = realEstate.earlyRepaymentFine.toString();
    }

    const updateRE = () => {
        if (nameInput && nameInput.value) {
            realEstate = {
                name: nameInput.value,
                sellingPrice: parseFloat(sellingInput?.value || '0') || 0,
                brokerFeePercentage: parseFloat(brokerInput?.value || '0') || 0,
                earlyRepaymentFine: parseFloat(fineInput?.value || '0') || 0
            };
        } else {
            realEstate = null;
        }
        updateRealEstateStats();
        updateHomePage();
    };

    if (nameInput) nameInput.addEventListener('input', updateRE);
    if (sellingInput) sellingInput.addEventListener('input', updateRE);
    if (brokerInput) brokerInput.addEventListener('input', updateRE);
    if (fineInput) fineInput.addEventListener('input', updateRE);

    updateRealEstateStats();
}

function updateRealEstateStats(): void {
    const netProceedsEl = document.getElementById('netProceeds');
    if (netProceedsEl) {
        netProceedsEl.textContent = formatCurrency(getNetRealEstateValue(false));
    }
}

// Initialize Loan
function initializeLoan(): void {
    const grid = document.getElementById('loanGrid');
    if (!grid) return;
    grid.innerHTML = '';

    MONTHS.forEach((month, index) => {
        const card = document.createElement('div');
        card.className = 'loan-card';
        card.innerHTML = `
      <h3>${month}</h3>
      <div class="loan-inputs">
        <div class="input-group">
          <label>Interest (€)</label>
          <input type="number" id="loanInterest${index}" placeholder="0.00" min="0.00" step="0.01">
        </div>
        <div class="input-group">
          <label>Principal (€)</label>
          <input type="number" id="loanPrincipal${index}" placeholder="0.00" min="0.00" step="0.01">
        </div>
      </div>
    `;
        grid.appendChild(card);

        const interestInput = document.getElementById(`loanInterest${index}`) as HTMLInputElement;
        const principalInput = document.getElementById(`loanPrincipal${index}`) as HTMLInputElement;

        // Initialize payment object if doesn't exist
        if (!loanData.monthlyPayments[month]) {
            loanData.monthlyPayments[month] = { interest: 0.00, principal: 0.00 };
        }

        if (interestInput) interestInput.value = loanData.monthlyPayments[month].interest.toString();
        if (principalInput) principalInput.value = loanData.monthlyPayments[month].principal.toString();

        const updateLoan = () => {
            const interest = parseFloat(interestInput?.value || '0.00') || 0;
            const principal = parseFloat(principalInput?.value || '0.00') || 0;

            loanData.monthlyPayments[month].interest = interest;
            loanData.monthlyPayments[month].principal = principal;

            updateLoanStats();
            updateRealEstateStats();
            updateHomePage();
        };

        if (interestInput) interestInput.addEventListener('input', updateLoan);
        if (principalInput) principalInput.addEventListener('input', updateLoan);

        updateLoan();
    });

    updateLoanStats();
}

function updateLoanStats(): void {
    const totalLoanEl = document.getElementById('totalLoanAmount');
    const currentBalanceEl = document.getElementById('currentLoanBalance');
    const totalRepaidEl = document.getElementById('totalRepaid');

    const totalLoan = loanData.totalLoaned;
    const currentBalance = getCurrentMonthBalance();
    const totalRepaid = totalLoan - currentBalance;

    if (totalLoanEl) totalLoanEl.textContent = formatCurrency(totalLoan);
    if (currentBalanceEl) currentBalanceEl.textContent = formatCurrency(currentBalance);
    if (totalRepaidEl) totalRepaidEl.textContent = formatCurrency(Math.max(0, totalRepaid));
}

// Initialize Income
function initializeIncome(): void {
    const grid = document.getElementById('incomeGrid');
    if (!grid) return;
    grid.innerHTML = '';

    MONTHS.forEach((month, index) => {
        const card = document.createElement('div');
        card.className = 'income-card';
        card.innerHTML = `
      <h3>${month}</h3>
      <div class="income-inputs">
        <div class="input-group">
          <label>${settings.person1Name}</label>
          <input type="number" id="person1Income${index}" placeholder="0.00" min="0" step="0.01">
        </div>
        <div class="input-group">
          <label>${settings.person2Name}</label>
          <input type="number" id="person2Income${index}" placeholder="0.00" min="0" step="0.01">
        </div>
      </div>
    `;
        grid.appendChild(card);

        const p1Input = document.getElementById(`person1Income${index}`) as HTMLInputElement;
        const p2Input = document.getElementById(`person2Income${index}`) as HTMLInputElement;

        // Use existing value or default from settings (only if default is not 0)
        const p1Value = person1Income[month] !== undefined ? person1Income[month] : (settings.person1DefaultIncome || 0);
        const p2Value = person2Income[month] !== undefined ? person2Income[month] : (settings.person2DefaultIncome || 0);

        // Only set if there's a value
        if (p1Value > 0 || person1Income[month] !== undefined) {
            person1Income[month] = p1Value;
        }
        if (p2Value > 0 || person2Income[month] !== undefined) {
            person2Income[month] = p2Value;
        }

        if (p1Input) {
            p1Input.value = (person1Income[month] !== undefined && person1Income[month] > 0) ? person1Income[month].toString() : '';
            p1Input.addEventListener('input', () => {
                person1Income[month] = parseFloat(p1Input.value) || 0;
                updateIncomeStats();
            });
        }

        if (p2Input) {
            p2Input.value = (person2Income[month] !== undefined && person2Income[month] > 0) ? person2Income[month].toString() : '';
            p2Input.addEventListener('input', () => {
                person2Income[month] = parseFloat(p2Input.value) || 0;
                updateIncomeStats();
            });
        }
    });

    updateIncomeStats();
}

function updateIncomeStats(): void {
    const totalAnnualEl = document.getElementById('totalAnnualIncome');
    const avgMonthlyEl = document.getElementById('avgMonthlyIncome');
    const mealVouchersEl = document.getElementById('totalMealVouchers');
    const extraIncomeEl = document.getElementById('totalExtraIncome');

    const p1Total = Object.values(person1Income).reduce((sum, val) => sum + (val || 0), 0);
    const p2Total = Object.values(person2Income).reduce((sum, val) => sum + (val || 0), 0);
    const rentTotal = settings.rentIncome * 12;
    const utilitiesTotal = settings.utilitiesIncome * 12;
    const mealVouchers = getTotalMealVouchers();
    const extraIncome = rentTotal + utilitiesTotal;
    const total = p1Total + p2Total + rentTotal + utilitiesTotal + mealVouchers;
    const avg = total / 12;

    if (totalAnnualEl) totalAnnualEl.textContent = formatCurrency(total);
    if (avgMonthlyEl) avgMonthlyEl.textContent = formatCurrency(avg);
    if (mealVouchersEl) mealVouchersEl.textContent = formatCurrency(mealVouchers);
    if (extraIncomeEl) extraIncomeEl.textContent = formatCurrency(extraIncome);
}

// Initialize Settings
function initializeSettings(): void {
    const inputs = {
        totalWealthGoal: document.getElementById('totalWealthGoal') as HTMLInputElement,
        savingsGoalYear: document.getElementById('savingsGoalYear') as HTMLInputElement,
        currentSavingsAmount: document.getElementById('currentSavingsAmount') as HTMLInputElement,
        totalLoanAmount: document.getElementById('settingsTotalLoanAmount') as HTMLInputElement,
        currentOpenCapital: document.getElementById('currentOpenCapital') as HTMLInputElement,
        expectedDividends: document.getElementById('expectedDividends') as HTMLInputElement,
        expectedDebtCollection: document.getElementById('expectedDebtCollection') as HTMLInputElement,
        workingDaysPerYear: document.getElementById('workingDaysPerYear') as HTMLInputElement,
        holidays: document.getElementById('holidays') as HTMLInputElement,
        person1Name: document.getElementById('person1Name') as HTMLInputElement,
        person2Name: document.getElementById('person2Name') as HTMLInputElement,
        person1MealVoucher: document.getElementById('person1MealVoucher') as HTMLInputElement,
        person2MealVoucher: document.getElementById('person2MealVoucher') as HTMLInputElement,
        person1DefaultIncome: document.getElementById('person1DefaultIncome') as HTMLInputElement,
        person2DefaultIncome: document.getElementById('person2DefaultIncome') as HTMLInputElement,
        rentIncome: document.getElementById('rentIncome') as HTMLInputElement,
        utilitiesIncome: document.getElementById('utilitiesIncome') as HTMLInputElement,
    };

    const refinanceCheckbox = document.getElementById('refinanceLoan') as HTMLInputElement;

    // Set values from settings to inputs
    Object.keys(inputs).forEach(key => {
        const input = inputs[key as keyof typeof inputs];
        if (input) {
            const settingValue = settings[key as keyof Settings];
            input.value = settingValue.toString();

            // Read current value from input (in case it was set before initialization)
            if (input.value && input.value !== '0') {
                (settings as any)[key] = input.type === 'text' ? input.value : (parseFloat(input.value) || 0);

                if (key === 'totalLoanAmount') {
                    loanData.totalLoaned = parseFloat(input.value) || 0;
                }
            }

            input.addEventListener('input', () => {
                const value = input.type === 'text' ? input.value : (parseFloat(input.value) || 0);
                (settings as any)[key] = value;

                // Update loan total when total loan amount changes
                if (key === 'totalLoanAmount') {
                    loanData.totalLoaned = value as number;
                    updateLoanStats();
                }

                // Update default incomes in the income tracker
                if (key === 'person1DefaultIncome' || key === 'person2DefaultIncome') {
                    // Apply defaults to months that haven't been customized
                    MONTHS.forEach(month => {
                        if (key === 'person1DefaultIncome' && !person1Income[month]) {
                            person1Income[month] = settings.person1DefaultIncome;
                        }
                        if (key === 'person2DefaultIncome' && !person2Income[month]) {
                            person2Income[month] = settings.person2DefaultIncome;
                        }
                    });
                }

                updateLoanStats();
                updateSavingsStats();
                updateIncomeStats();
                updateRealEstateStats();
                updateHomePage();

                if (key.includes('person') && key.includes('Name')) {
                    initializeIncome();
                }
            });
        }
    });

    // Handle refinance checkbox
    if (refinanceCheckbox) {
        refinanceCheckbox.checked = settings.refinanceLoan;
        refinanceCheckbox.addEventListener('change', () => {
            settings.refinanceLoan = refinanceCheckbox.checked;
            updateHomePage();
        });
    }

    // IMPORTANT: Sync loanData.totalLoaned with settings value
    loanData.totalLoaned = settings.totalLoanAmount;
}

// Export/Import
function exportData(): void {
    const data: ExportData = {
        settings,
        savings: savingsData,
        realEstate,
        loan: loanData,
        person1Income,
        person2Income,
        exportDate: new Date().toISOString()
    };

    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `financial-dashboard-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showMessage('Data exported successfully!');
}

function importData(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
        try {
            const data = JSON.parse(e.target?.result as string) as ExportData;

            if (data.settings) settings = data.settings;
            if (data.savings) savingsData = data.savings;
            if (data.realEstate) realEstate = data.realEstate;
            if (data.loan) loanData = data.loan;
            if (data.person1Income) person1Income = data.person1Income;
            if (data.person2Income) person2Income = data.person2Income;

            // Reinitialize all sections
            initializeSettings();
            initializeSavings();
            initializeRealEstate();
            initializeLoan();
            initializeIncome();
            updateHomePage();

            showMessage('Data imported successfully!');
        } catch (error) {
            showMessage('Error importing data. Please check the file format.');
            console.error('Import error:', error);
        }
    };
    reader.readAsText(file);
    target.value = '';
}

// Reset
function resetAll(): void {
    const modal = document.getElementById('resetModal');
    if (modal) modal.classList.add('active');
}

function closeResetModal(): void {
    const modal = document.getElementById('resetModal');
    if (modal) modal.classList.remove('active');
}

function confirmReset(): void {
    settings = {
        totalWealthGoal: 0,
        savingsGoalYear: 0,
        currentSavingsAmount: 0,
        totalLoanAmount: 0,
        currentOpenCapital: 0,
        expectedDividends: 0,
        expectedDebtCollection: 0,
        workingDaysPerYear: 260,
        holidays: 20,
        person1Name: 'Person 1',
        person2Name: 'Person 2',
        person1MealVoucher: 10,
        person2MealVoucher: 6,
        person1DefaultIncome: 0,
        person2DefaultIncome: 0,
        rentIncome: 0,
        utilitiesIncome: 0,
        refinanceLoan: false
    };
    savingsData = {};
    realEstate = null;
    loanData = { totalLoaned: 0, monthlyPayments: {} };
    person1Income = {};
    person2Income = {};

    initializeSettings();
    initializeSavings();
    initializeRealEstate();
    initializeLoan();
    initializeIncome();
    updateHomePage();
    closeResetModal();
    showMessage('All data has been reset!');
}

function showMessage(message: string): void {
    const existing = document.querySelector('.message-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'message-toast';
    toast.textContent = message;
    toast.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: #28a745;
    color: white;
    padding: 15px 30px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    z-index: 2000;
    font-weight: 500;
  `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// Make functions global
(window as any).switchTab = switchTab;
(window as any).exportData = exportData;
(window as any).resetAll = resetAll;
(window as any).closeResetModal = closeResetModal;
(window as any).confirmReset = confirmReset;

// File input
const fileInput = document.getElementById('fileInput') as HTMLInputElement;
if (fileInput) fileInput.addEventListener('change', importData);

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initializeSettings();
    initializeSavings();
    initializeRealEstate();
    initializeLoan();
    initializeIncome();
    updateHomePage();

    // Ensure loan stats are displayed after initialization
    updateLoanStats();
});