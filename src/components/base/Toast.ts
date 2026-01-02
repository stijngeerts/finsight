import { Component } from '../../core/Component';
import type { EventBus } from '../../core/EventBus';
import { AppEvents, type ShowMessagePayload } from '../../types';
import { TOAST_DURATION_MS } from '../../constants';

export class Toast extends Component {
    private static instance: Toast | null = null;

    constructor(eventBus: EventBus) {
        super(eventBus);

        this.subscribe<ShowMessagePayload>(AppEvents.SHOW_MESSAGE, (payload) => {
            this.show(payload.message);
        });

        Toast.instance = this;
    }

    render(): HTMLElement {
        const toast = document.createElement('div');
        toast.className = 'message-toast';
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
            display: none;
        `;
        return toast;
    }

    show(message: string): void {
        if (!this.element) return;

        const existing = document.querySelector('.message-toast');
        if (existing && existing !== this.element) {
            existing.remove();
        }

        this.element.textContent = message;
        this.element.style.display = 'block';

        if (!this.element.parentNode) {
            document.body.appendChild(this.element);
        }

        setTimeout(() => {
            if (this.element) {
                this.element.style.display = 'none';
            }
        }, TOAST_DURATION_MS);
    }

    static showMessage(message: string): void {
        if (Toast.instance) {
            Toast.instance.show(message);
        }
    }
}
