export function createElement<K extends keyof HTMLElementTagNameMap>(
    tag: K,
    className?: string,
    textContent?: string
): HTMLElementTagNameMap[K] {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (textContent) element.textContent = textContent;
    return element;
}

export function setAttributes(element: HTMLElement, attributes: { [key: string]: string | number | boolean }): void {
    Object.entries(attributes).forEach(([key, value]) => {
        if (typeof value === 'boolean') {
            if (value) {
                element.setAttribute(key, '');
            }
        } else {
            element.setAttribute(key, String(value));
        }
    });
}

export function removeChildren(element: HTMLElement): void {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

export function querySelector<T extends HTMLElement>(selector: string, parent: Document | HTMLElement = document): T | null {
    return parent.querySelector<T>(selector);
}

export function querySelectorAll<T extends HTMLElement>(selector: string, parent: Document | HTMLElement = document): NodeListOf<T> {
    return parent.querySelectorAll<T>(selector);
}
