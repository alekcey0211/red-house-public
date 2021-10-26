import { Mp } from '../types/mp';

const hotReloadModule = (mp: Mp, data: Record<string, unknown>) => {
	const path = data.path as string;
	const modulePath = path.replace('data\\', '');
	const moduleName = path.replace('data\\modules\\', '').replace('\\index.js', '');

	console.log(`Reload module ${moduleName}...`);

	const changedModuleIndex = mp.modules.findIndex((x) => x.name === moduleName);

	mp.modules.splice(changedModuleIndex, 1);

	const success = mp.loadJSModule(modulePath);
	if (!success) return;

	mp.modules[mp.modules.length - 1].name = moduleName;

	console.log(`Reload module ${moduleName} success!`);

	console.log(mp.modules.map((x) => x.name));
};

export const handleServerMsg = (mp: Mp, pcFormId: number, data: Record<string, unknown>): void => {
	switch (data.action) {
		case 'disconnect':
			if (typeof mp.onDisconnect === 'function') mp.onDisconnect(pcFormId);
			break;

		case 'moduleHotReload':
			hotReloadModule(mp, data);
			break;

		default:
			break;
	}
};
