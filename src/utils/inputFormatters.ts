/**
 * Formats a string value to European notation (1.000,00)
 * Handles partial input during typing
 */
export function formatToEuropeanString(value: string): string {
    if (!value || value.trim() === '') return '';

    // Remove existing formatting
    let cleaned = value.replace(/\./g, '').replace(/,/g, '.');

    // Split into integer and decimal parts
    const parts = cleaned.split('.');
    let integerPart = parts[0] || '0';
    let decimalPart = parts[1] || '';

    // Add thousands separator (dots) to integer part
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    // Build result
    if (decimalPart !== '') {
        return `${integerPart},${decimalPart}`;
    } else if (cleaned.includes('.')) {
        // User is typing decimal separator
        return `${integerPart},`;
    } else {
        return integerPart;
    }
}

/**
 * Formats a number to European notation (1.000,00)
 */
export function formatToEuropean(value: number): string {
    if (isNaN(value)) return '';

    const parts = value.toFixed(2).split('.');
    const integerPart = parts[0];
    const decimalPart = parts[1];

    // Add thousands separator (dots)
    const withThousands = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    // Return with comma as decimal separator
    return `${withThousands},${decimalPart}`;
}

/**
 * Parses European formatted number (1.000,00) to a JavaScript number
 */
export function parseFormattedNumber(value: string): number {
    if (!value || value.trim() === '') return 0;

    // Remove thousand separators (dots) and replace decimal separator (comma) with dot
    const normalized = value.replace(/\./g, '').replace(/,/g, '.');
    const parsed = parseFloat(normalized);

    return isNaN(parsed) ? 0 : parsed;
}

/**
 * Applies European number formatting to an input field
 * Formats in real-time while maintaining cursor position
 */
export function formatNumberInput(input: HTMLInputElement): void {
    const formatWithCursor = () => {
        const cursorPos = input.selectionStart || 0;
        const oldValue = input.value;
        const oldLength = oldValue.length;

        // Format the value
        const formatted = formatToEuropeanString(oldValue);

        if (formatted !== oldValue) {
            input.value = formatted;

            // Adjust cursor position based on length change
            const lengthDiff = formatted.length - oldLength;
            const newCursorPos = Math.max(0, cursorPos + lengthDiff);
            input.setSelectionRange(newCursorPos, newCursorPos);
        }
    };

    const finalFormat = () => {
        const numericValue = parseFormattedNumber(input.value);
        if (!isNaN(numericValue)) {
            if (numericValue === 0 && input.value.trim() === '') {
                // Empty field stays empty
                input.value = '';
            } else {
                // Always format with 2 decimals
                input.value = formatToEuropean(numericValue);
            }
        }
    };

    // Format as user types
    input.addEventListener('input', () => {
        formatWithCursor();
    });

    // Final format with 2 decimals on blur
    input.addEventListener('blur', () => {
        finalFormat();
    });

    // Format on initialization if there's a value
    if (input.value && input.value.trim() !== '') {
        const numericValue = parseFormattedNumber(input.value);
        if (!isNaN(numericValue)) {
            input.value = formatToEuropean(numericValue);
        }
    }
}
