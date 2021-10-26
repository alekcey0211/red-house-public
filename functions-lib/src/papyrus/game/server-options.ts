import { Mp, PapyrusValue } from '../../types/mp';
import { getString } from '../../utils/papyrusArgs';

export interface ServerOption {
	serverName: string;
	EnableDebug: boolean;
	isVanillaSpawn: boolean;

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
	keybindingShowPerkTree: number;
	keybindingAcceptTrade: number;
	keybindingRejectTrade: number;

	SafeLocations: number[];

	StartUpItemsAdd: string[];
	StartUpItemsAddJSON: { desc: string; count: number }[];

	LocationsForBuying: number[];

	LocationsForBuyingValue: number[];

	TimeScale: number;

	showNickname: boolean;
	enableInterval: boolean;
	enableALCHeffect: boolean;
	adminPassword: string;

	debugAttrAll: boolean;
}
type ServerOptionKey = keyof ServerOption;

export class ServerOptionProvider {
	private serverOptions?: ServerOption;

	private defaultSettings: ServerOption = {
		serverName: 'Secret Project',
		EnableDebug: false,
		isVanillaSpawn: false,

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
		// keybindingShowMenu: 21,
		keybindingShowPerkTree: 24,
		keybindingAcceptTrade: 21,
		keybindingRejectTrade: 49,

		SafeLocations: [],

		StartUpItemsAdd: ['0x12eb7;1', '0x3eadd;50', '0x3eade;50'],
		StartUpItemsAddJSON: [
			{ desc: '0x12eb7:Skyrim.esm', count: 1 },
			{ desc: '0x3eadd:Skyrim.esm', count: 50 },
			{ desc: '0x3eade:Skyrim.esm', count: 50 },
		],

		LocationsForBuying: [],

		LocationsForBuyingValue: [],

		TimeScale: 20,

		showNickname: false,
		enableInterval: true,
		enableALCHeffect: true,
		adminPassword: '12345',

		debugAttrAll: false,
	};

	get data(): string {
		return this.mp.readDataFile('server-options.json');
	}

	get json(): any {
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

	getServerOptionsValue(args: PapyrusValue[]): any {
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
