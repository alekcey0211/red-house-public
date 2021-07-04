import { createStore } from 'redux';
import { WindowSkymp } from '../types/window';

import { rootReducer } from './rootReducer';

declare global {
	interface Window extends WindowSkymp {}
}

export const store = createStore(rootReducer);

window.storage = store;
