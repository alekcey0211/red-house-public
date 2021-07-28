import { Mp, PapyrusValue } from '../../types/mp';
import { getString } from '../../utils/papyrusArgs';

export interface ServerOption {
	serverName: string;
	EnableDebug: boolean;

	CookingDuration: number;
	CookingActivationDistance: number;

	IsChooseSpawnEnable: boolean;
	SpawnTimeToRespawn: number;
	spawnTimeToRespawnNPC: number;
	spawnTimeById: string[];

	SatietyDefaultValue: number;
	SatietyDelay: number;
	SatietyReduceValue: number;

	HitDamageMod: number;
	HitStaminaReduce: number;
	isPowerAttackMult: number;
	isBashAttackMult: number;
	isPowerAttackStaminaReduce: number;

	keybindingBrowserSetVisible: number;
	keybindingBrowserSetFocused: number;
	keybindingShowChat: number;
	keybindingShowMenu: number;
	keybindingShowAnimList: number;
	keybindingShowPerkTree: number;

	command1: string;
	command2: string;
	command3: string;
	command4: string;
	command5: string;
	command6: string;
	command7: string;
	command8: string;
	command9: string;
	command0: string;

	StartUpItemsAdd: string[];

	LocationsForBuying: number[];

	LocationsForBuyingValue: number[];

	TimeScale: number;

	showNickname: boolean;
	enableInterval: boolean;
	enableALCHeffect: boolean;
	adminPassword: string;
}
type ServerOptionKey = keyof ServerOption;

export class ServerOptionProvider {
	private serverOptions?: ServerOption;
	private defaultSettings: ServerOption = {
		serverName: 'Secret Project',
		EnableDebug: false,

		CookingDuration: 5,
		CookingActivationDistance: 55,

		IsChooseSpawnEnable: true,
		SpawnTimeToRespawn: 1,
		spawnTimeToRespawnNPC: 10,
		spawnTimeById: [],

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
		adminPassword: '12345',
	};

	get data() {
		return this.mp.readDataFile('server-options.json');
	}
	get json() {
		const data = JSON.parse(this.decomment(this.data));
		Object.keys(this.defaultSettings).forEach((k) => {
			if (data[k] === undefined) data[k] = this.defaultSettings[k as ServerOptionKey];
		});
		return data;
	}

	constructor(private mp: Mp, private hotReload: boolean) {
		if (!this.hotReload) this.serverOptions = this.json;
	}

	getServerOptions(): ServerOption {
		return this.serverOptions ?? this.json;
	}

	getServerOptionsValue(args: PapyrusValue[]): PapyrusValue {
		const settings = this.getServerOptions();
		const key: ServerOptionKey | undefined =
			(Object.keys(settings).find((x) => x.toLowerCase() === getString(args, 0).toLowerCase()) as ServerOptionKey) ??
			(Object.keys(this.defaultSettings).find(
				(x) => x.toLowerCase() === getString(args, 0).toLowerCase()
			) as ServerOptionKey);
		if (!key) return null;
		const value = settings[key] ?? this.defaultSettings[key];
		return value;
	}

	private decomment(jsonString: string) {
		const regex = /\/\/.+/gm;
		return jsonString.replace(regex, '');
	}
}
