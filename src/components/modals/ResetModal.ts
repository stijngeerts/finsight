import { Component } from '../../core/Component';
import type { EventBus } from '../../core/EventBus';
import { createElement } from '../../core/DOMHelpers';

export class ResetModal extends Component {
    private onConfirm: () => void;

    constructor(eventBus: EventBus, onConfirm: () => void) {
        super(eventBus);
        this.onConfirm = onConfirm;
    }

    render(): HTMLElement {
        const modal = createElement('div', 'modal');
        modal.id = 'resetModal';

        const modalContent = createElement('div', 'modal-content');

        const title = createElement('h3', '', '⚠️ Reset All Data');
        const message = createElement('p', '', 'Are you sure you want to reset all data? This cannot be undone.');

        const buttonsDiv = createElement('div', 'modal-buttons');

        const cancelBtn = createElement('button', 'modal-btn modal-btn-cancel', 'Cancel');
        cancelBtn.addEventListener('click', () => this.close());

        const confirmBtn = createElement('button', 'modal-btn modal-btn-confirm', 'Reset');
        confirmBtn.addEventListener('click', () => {
            this.onConfirm();
            this.close();
        });

        buttonsDiv.appendChild(cancelBtn);
        buttonsDiv.appendChild(confirmBtn);

        modalContent.appendChild(title);
        modalContent.appendChild(message);
        modalContent.appendChild(buttonsDiv);
        modal.appendChild(modalContent);

        return modal;
    }

    open(): void {
        if (this.element) {
            this.element.classList.add('active');
        }
    }

    close(): void {
        if (this.element) {
            this.element.classList.remove('active');
        }
    }
}
