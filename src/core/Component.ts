import type { EventBus } from './EventBus';
import type { EventCallback } from '../types';

export abstract class Component {
    protected eventBus: EventBus;
    protected element: HTMLElement | null = null;
    protected subscriptions: Array<() => void> = [];

    constructor(eventBus: EventBus) {
        this.eventBus = eventBus;
    }

    abstract render(): HTMLElement;

    mount(parent: HTMLElement | string): void {
        const container = typeof parent === 'string'
            ? document.querySelector<HTMLElement>(parent)
            : parent;

        if (!container) {
            throw new Error(`Container not found: ${parent}`);
        }

        this.element = this.render();
        container.appendChild(this.element);
    }

    unmount(): void {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
        this.cleanup();
    }

    update(_data?: any): void {
        // Override in subclasses if needed
    }

    protected subscribe<T = any>(event: string, callback: EventCallback<T>): void {
        const unsubscribe = this.eventBus.subscribe(event, callback);
        this.subscriptions.push(unsubscribe);
    }

    protected publish<T = any>(event: string, data?: T): void {
        this.eventBus.publish(event, data);
    }

    protected cleanup(): void {
        this.subscriptions.forEach(unsubscribe => unsubscribe());
        this.subscriptions = [];
    }
}
