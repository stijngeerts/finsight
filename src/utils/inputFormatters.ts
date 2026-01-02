export function formatNumberInput(input: HTMLInputElement): void {
    const formatValue = () => {
        const value = parseFloat(input.value);
        if (!isNaN(value)) {
            input.value = value.toFixed(2);
        }
    };

    // Format on blur (when user leaves the field)
    input.addEventListener('blur', () => {
        formatValue();
    });

    // Format on initialization if there's a value
    if (input.value) {
        formatValue();
    }
}

export function parseFormattedNumber(value: string): number {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
}
