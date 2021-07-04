import { Mp, PapyrusValue } from '../../types/mp';
import { getString } from '../../utils/papyrusArgs';

const defaultSettings: Record<string, PapyrusValue> = {
	serverName: 'Secret Project',
	EnableDebug: false,

	CookingDuration: 5,
	CookingActivationDistance: 55,

	IsChooseSpawnEnable: true,
	SpawnTimeToRespawn: 1,
	spawnTimeToRespawnNPC: 10,
	spawnTimeById: [],
	SpawnPointPosition: [227, 239, 53],
	SpawnPointAngle: [0, 0, 0],
	SpawnPointWorldOrCellDesc: 91559,

	SatietyDefaultValue: 95,
	SatietyDelay: 120,
	SatietyReduceValue: -1,

	HitDamageMod: -5,
	HitStaminaReduce: 5,
	isPowerAttackMult: 2,
	isBashAttackMult: 0.5,
	isPowerAttackStaminaReduce: 25,

	keybindingBrowserSetVisible: 60,
	keybindingBrowserSetFocused: 64,
	keybindingShowChat: 20,
	keybindingShowMenu: 21,
	keybindingShowAnimList: 22,
	keybindingShowPerkTree: 24,

	command1: '',
	command2: '',
	command3: '',
	command4: '',
	command5: '',
	command6: '',
	command7: '',
	command8: '',
	command9: '',
	command0: '',

	AVhealrate: 0,
	AVhealratemult: 0,
	AVstaminarate: 5,
	AVstaminaratemult: 100,
	AVmagickarate: 5,
	AVmagickaratemult: 100,

	StartUpItemsAdd: [
		'0x64b42;10',
		'0xf4314;10',
		'0x34cdf;30',
		'0x64b3f;30',
		'0x64b41;30',
		'0x669a5;30',
		'0x65c9f;30',
		'0x64b42;30',
		'0x34d22;30',
		'0x45c28;30',
		'0x65c9b;5',
		'0x65c99;10',
		'0x64b40;30',
		'0x65c9e;30',
		'0xf2011;30',
		'0x515def1;2',
		'0x515def2;2',
		'0x12eb7;1',
		'0x3eadd;50',
	],

	LocationsForBuying: [],

	LocationsForBuyingValue: [],

	TimeScale: 20,

	showNickname: false,
	enableInterval: true,
	enableALCHeffect: true,
};

const decomment = (jsonString: string) => {
	const regex = /\/\/.+/gm;
	return jsonString.replace(regex, '');
};

let serverOptions = '';

export const getServerOptions = (mp: Mp) => {
	const config = mp.getServerSettings();
	// const data = config.dataDir;
	const hotReload = config.isServerOptionsHotReloadEnabled;

	if (!serverOptions && !hotReload) {
		serverOptions = JSON.parse(decomment(mp.readDataFile('server-options.json')));
	}

	const settings = !hotReload ? serverOptions : JSON.parse(decomment(mp.readDataFile('server-options.json')));
	return settings;
};

export const getServerOptionsValue = (mp: Mp, args: PapyrusValue[]) => {
	const settings = getServerOptions(mp);
	const key =
		Object.keys(settings).find((x) => x.toLowerCase() === getString(args, 0).toLowerCase()) ??
		Object.keys(defaultSettings).find((x) => x.toLowerCase() === getString(args, 0).toLowerCase());
	if (!key) return;
	const value = settings[key] ?? defaultSettings[key];
	return value;
};
