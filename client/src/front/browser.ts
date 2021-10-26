/* eslint-disable no-spaced-func */
import {
	browser,
	on,
	once,
	Input,
	printConsole,
	settings,
	Ui,
	Menu,
	DxScanCode,
	BrowserMessageEvent,
} from 'skyrimPlatform';
import { printConsoleServer } from './console';

type BindingKey = DxScanCode[];
type BindingValue = () => void;

export const dispatch = (commandType: string, data: Record<string, unknown> | Record<string, unknown>[] = {}): void => {
	const src: string[] = [];
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
	const badMenus: Menu[] = [
		Menu.Barter,
		Menu.Book,
		Menu.Container,
		Menu.Crafting,
		Menu.Gift,
		Menu.Inventory,
		Menu.Journal,
		Menu.Lockpicking,
		Menu.Loading,
		Menu.Map,
		Menu.RaceSex,
		Menu.Stats,
		Menu.Tween,
		Menu.Console,
		Menu.Main,
	];

	let browserVisibleState = false;
	browser.setVisible(false);
	const setBrowserVisible = (state: boolean) => {
		browserVisibleState = state;
		browser.setVisible(state);
	};
	once('update', () => {
		browserVisibleState = true;
		browser.setVisible(true);
	});

	let browserFocusedState = false;
	const setBrowserFocused = (state: boolean) => {
		browserFocusedState = state;
		browser.setFocused(state);
	};

	let badMenuOpen = true;

	let lastBadMenuCheck = 0;
	on('update', () => {
		if (Date.now() - lastBadMenuCheck > 200) {
			lastBadMenuCheck = Date.now();
			badMenuOpen = badMenus.findIndex((menu) => Ui.isMenuOpen(menu)) !== -1;
			browser.setVisible(browserVisibleState && !badMenuOpen);
		}
	});

	let isInputFocused = false;
	on('browserMessage', (event: BrowserMessageEvent) => {
		if (!event.arguments.length) return;
		const e: { type: string; data: any } = event.arguments[0] as any;
		if (e.type === 'focusInputField') {
			// window.skyrimPlatform.sendMessage({ type: 'focusInputField', data: true/false });
			isInputFocused = e.data;
		} else if (e.type === 'browserFocused') {
			// window.skyrimPlatform.sendMessage({ type: 'browserFocused', data: true/false });
			setBrowserFocused(e.data);
		} else if (e.type === 'browserVisible') {
			// window.skyrimPlatform.sendMessage({ type: 'browserVisible', data: true/false });
			setBrowserVisible(e.data);
		}
	});

	const binding = new Map<BindingKey, BindingValue>([
		[[DxScanCode.F2], () => setBrowserVisible(!browserVisibleState)],
		[[DxScanCode.F6], () => setBrowserFocused(!browserFocusedState)],
		[[DxScanCode.Escape], () => (browserFocusedState ? setBrowserFocused(false) : undefined)],
		[
			[DxScanCode.UpArrow],
			() => {
				if (!browserFocusedState) return;
				dispatch('CHAT_UPDATE_HISTORY_STEP_UP');
			},
		],
		[
			[DxScanCode.DownArrow],
			() => {
				if (!browserFocusedState) return;
				dispatch('CHAT_UPDATE_HISTORY_STEP_DOWN');
			},
		],
		[
			[DxScanCode.U],
			() => {
				if (badMenuOpen || browserFocusedState || isInputFocused) return;
				setBrowserFocused(true);
				dispatch('ANIMLIST_SHOW');
			},
		],
		[
			[DxScanCode.Enter],
			() => {
				if (badMenuOpen || browserFocusedState) return;
				setBrowserFocused(true);
				dispatch('CHAT_SHOW');
			},
		],
		[
			[DxScanCode.LeftShift, DxScanCode.Tab],
			() => {
				if (badMenuOpen || browserFocusedState) return;
				setBrowserFocused(true);
				dispatch('FRAMETRANSLATOR_SHOW');
			},
		],
	]);

	let lastNumKeys = 0;
	on('update', () => {
		const numKeys = Input.getNumKeysPressed();

		if (lastNumKeys === numKeys) return;

		lastNumKeys = numKeys;

		binding.forEach((fn, keyCodes) => {
			if (keyCodes.every((key) => Input.isKeyPressed(key))) fn();
		});
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
