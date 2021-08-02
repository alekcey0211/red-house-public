import {
	browser,
	on,
	once,
	Input,
	printConsole,
	settings,
	Ui,
} from "skyrimPlatform";

export const main = (): void => {
	const cfg = {
		ip: settings["skymp5-client"]["server-ip"],
		port: settings["skymp5-client"]["server-port"],
	};

	printConsole({ cfg });

	const uiPort = cfg.port === 7777 ? 3000 : cfg.port as number + 1;

	const url = `http://${cfg.ip}:${uiPort}/ui/index.html`;
	printConsole(`loading url ${url}`);
	browser.loadUrl(url);
};
