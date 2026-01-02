import type { ExportData, AppState } from '../types';

export function exportData(state: Readonly<AppState>): void {
    const data: ExportData = {
        settings: state.settings,
        savings: state.savings,
        realEstate: state.realEstate,
        loan: state.loan,
        person1Income: state.income.person1,
        person2Income: state.income.person2,
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
}

export async function importData(file: File): Promise<ExportData> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
            try {
                const data = JSON.parse(e.target?.result as string) as ExportData;
                resolve(data);
            } catch (error) {
                reject(new Error('Invalid file format'));
            }
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsText(file);
    });
}

export function convertImportToState(imported: ExportData, currentState: AppState): AppState {
    return {
        settings: imported.settings || currentState.settings,
        savings: imported.savings || currentState.savings,
        realEstate: imported.realEstate || currentState.realEstate,
        loan: imported.loan || currentState.loan,
        income: {
            person1: imported.person1Income || currentState.income.person1,
            person2: imported.person2Income || currentState.income.person2
        },
        ui: currentState.ui
    };
}
