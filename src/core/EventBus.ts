import type { EventCallback } from '../types';

export class EventBus {
    private listeners: Map<string, Set<EventCallback>>;

    constructor() {
        this.listeners = new Map();
    }

    subscribe<T = any>(event: string, callback: EventCallback<T>): () => void {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }

        const eventListeners = this.listeners.get(event)!;
        eventListeners.add(callback as EventCallback);

        return () => {
            eventListeners.delete(callback as EventCallback);
            if (eventListeners.size === 0) {
                this.listeners.delete(event);
            }
        };
    }

    publish<T = any>(event: string, data?: T): void {
        const eventListeners = this.listeners.get(event);
        if (eventListeners) {
            eventListeners.forEach(callback => callback(data));
        }
    }

    unsubscribeAll(event?: string): void {
        if (event) {
            this.listeners.delete(event);
        } else {
            this.listeners.clear();
        }
    }
}
