import { browser, on, Input, printConsole, settings, Ui } from 'skyrimPlatform';
import { DXScanCodes } from '../lib/dx-scan-codes';
import { EventEmitter } from '../lib/event-emitter';
import { printConsoleServer } from './console';

const dispatch = (commandType: string, data: Record<string, unknown> | Record<string, unknown>[] = {}) => {
	let src: string[] = [];
	src.push(`
				window.storage.dispatch({
					type: 'COMMAND',
					data: {
						commandType: '${commandType}',
						alter: ['${JSON.stringify(data)}']
					}
				})
			`);
	try {
		browser.executeJavaScript(src.join('\n'));
	} catch (error) {
		printConsoleServer(error);
	}
};

export const main = (): void => {
	const badMenus = [
		'BarterMenu',
		'Book Menu',
		'ContainerMenu',
		'Crafting Menu',
		'GiftMenu',
		'InventoryMenu',
		'Journal Menu',
		'Lockpicking Menu',
		'Loading Menu',
		'MapMenu',
		'RaceSex Menu',
		'StatsMenu',
		'TweenMenu',
	];

	// on('update', () => {
	// 	if (Date.now() - lastBadMenuCheck > 200) {
	// 		lastBadMenuCheck = Date.now();
	// 		noBadMenuOpen = badMenus.findIndex((menu) => Ui.isMenuOpen(menu)) === -1;
	// 	}
	// });

	const emitter = new EventEmitter();

	let noBadMenuOpen = true;
	let lastBadMenuCheck = 0;
	const inputChangeEvent = 'event:input-change';
	const keyState: { num: number } = { num: 0 };
	on('update', () => {
		const numKeys = Input.getNumKeysPressed();

		if (keyState.num !== numKeys) {
			keyState.num = numKeys;
			const keyCodes = Array(numKeys)
				.fill(null)
				.map((x, i) => Input.getNthKeyPressed(i));
			emitter.emit(inputChangeEvent, keyCodes);
		}

		if (Date.now() - lastBadMenuCheck > 200) {
			lastBadMenuCheck = Date.now();
			noBadMenuOpen = badMenus.findIndex((menu) => Ui.isMenuOpen(menu)) === -1;
		}
	});

	let localBrowserFocused = false;
	const browserSetFocused = (state: boolean) => {
		localBrowserFocused = state;
		browser.setFocused(state);
	};

	const singleBindings: Record<number, () => void> = {
		[DXScanCodes.F6]: () => browserSetFocused(!localBrowserFocused),
		[DXScanCodes.Escape]: () => (localBrowserFocused ? browserSetFocused(false) : undefined),
		[DXScanCodes.U]: () => {
			if (!noBadMenuOpen || localBrowserFocused) return;
			browserSetFocused(true);
			dispatch('ANIMLIST_SHOW');
		},
		[DXScanCodes.Enter]: () => {
			if (!noBadMenuOpen || localBrowserFocused) return;
			browserSetFocused(true);
			dispatch('CHAT_SHOW');
		},
	};
	emitter.subscribe(inputChangeEvent, (data) => {
		if (!Array.isArray(data)) return;

		const keycodes: number[] = data;
		if (keycodes.length === 0) return;

		const single: number = keycodes[0];
		if (!singleBindings[single]) return;

		singleBindings[single]();
	});

	const cfg = {
		ip: settings['skymp5-client']['server-ip'],
		port: settings['skymp5-client']['server-port'],
	};

	printConsole({ cfg });

	const uiPort = cfg.port === 7777 ? 3000 : (cfg.port as number) + 1;

	const url = `http://${cfg.ip}:${uiPort}/ui/index.html`;
	printConsole(`loading url ${url}`);
	browser.loadUrl(url);
};
