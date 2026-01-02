import { EventBus } from './core/EventBus';
import { Store } from './state/Store';
import { StateManager } from './state/StateManager';
import { Application } from './app/Application';
import { initialState } from './state/initialState';

document.addEventListener('DOMContentLoaded', () => {
    const eventBus = new EventBus();
    const store = new Store(initialState, eventBus);
    const stateManager = new StateManager(store);
    const app = new Application(eventBus, stateManager);

    app.initialize();
});
