import { Mp, PapyrusValue, PapyrusObject } from '../../types/mp';
import { getBoolean, getNumber, getObject, getString, getStringArray } from '../../utils/papyrusArgs';
import {
	getGlobalStorageValue,
	setGlobalStorageValueString,
	setGlobalStorageValueStringArray,
	setGlobalStorageValueNumber,
	setGlobalStorageValueNumberArray,
	setGlobalStorageValue,
} from './globalStorage';

const executeUiCommand = (mp: Mp, self: null, args: PapyrusValue[]): void => {
	const actor = getObject(args, 0);
	const commandType = getString(args, 1);
	const argumentNames = getStringArray(args, 2);
	const tokens = getStringArray(args, 3);
	const alter = getString(args, 4);

	const actorId = mp.getIdFromDesc(actor.desc);
	mp.sendUiMessage(actorId, {
		type: 'COMMAND',
		data: {
			commandType: commandType,
			commandArgs: {
				argumentNames: argumentNames,
				tokens: tokens,
			},
			alter: alter.split('\n'),
		},
	});
};

const log = (mp: Mp, self: null, args: PapyrusValue[]): void => {
	const text = getString(args, 0);
	console.log('[GM]', '\x1b[34m', text, '\x1b[0m');
};

const getText = (localization: Localization, mp: Mp, self: null, args: PapyrusValue[]): string => {
	const msgId = getString(args, 0);
	return localization.getText(msgId);
};

const getActorsInStreamZone = (mp: Mp, self: null, args: PapyrusValue[]) => {
	const actor = getObject(args, 0);
	const actorId = mp.getIdFromDesc(actor.desc);

	const res = new Array<PapyrusObject>();
	mp.get(actorId, 'neighbors').forEach((formId) => {
		if (mp.get(formId, 'type') === 'MpActor') {
			res.push({ type: 'form', desc: mp.getDescFromId(formId) });
		}
	});
	return res;
};

const getOnlinePlayers = (mp: Mp): PapyrusObject[] => {
	const res = new Array<PapyrusObject>();
	mp.get(0, 'onlinePlayers').forEach((formId) => {
		res.push({ type: 'form', desc: mp.getDescFromId(formId) });
	});
	return res;
};

const isPlayer = (mp: Mp, args: PapyrusValue[]): boolean =>
	mp.get(0, 'onlinePlayers').findIndex((x) => x === getNumber(args, 0)) !== -1;

const asConvert = (mp: Mp, self: null, args: PapyrusValue[]): PapyrusValue => getObject(args, 0);

const stringToInt = (mp: Mp, self: null, args: PapyrusValue[]): number => +getString(args, 0);

const wait = (mp: Mp, self: null, args: PapyrusValue[]) => {
	const sec = getNumber(args, 0);
	const name = getString(args, 1);
	const ac = args[2] ? getObject(args, 2) : undefined;
	const target = args[3] ? getObject(args, 3) : undefined;
	const targetId = getNumber(args, 4);
	const params: PapyrusValue[] = [];

	if (ac) {
		params.push(ac);
	}
	if (target) {
		params.push(target);
	}
	if (targetId !== -1) {
		params.push(targetId);
	}

	if (name.split('.').length !== 2) {
		console.log('Неправильное название функции. Требуется указать имя скрипта и функцию. Например M.GetText');
		return;
	}

	setTimeout(() => {
		mp.callPapyrusFunction('global', name.split('.')[0], name.split('.')[1], null, params);
	}, sec * 1000);
};

const browserSetVisible = (mp: Mp, self: null, args: PapyrusValue[]) => {
	const ac = getObject(args, 0);
	const visible = getBoolean(args, 1);
	mp.set(mp.getIdFromDesc(ac.desc), 'browserVisible', visible);
	if (!visible) {
		mp.set(mp.getIdFromDesc(ac.desc), 'browserModal', false);
	}
};
const browserGetVisible = (mp: Mp, self: null, args: PapyrusValue[]): boolean =>
	!!mp.get(mp.getIdFromDesc(getObject(args, 0).desc), 'browserVisible');

const browserSetFocused = (mp: Mp, self: null, args: PapyrusValue[]) => {
	const ac = getObject(args, 0);
	const acId = mp.getIdFromDesc(ac.desc);
	const focused = getBoolean(args, 1);
	mp.set(acId, 'browserFocused', focused);
	if (!focused) {
		mp.set(acId, 'browserModal', false);
		mp.set(acId, 'chromeInputFocus', false);
	}
};
const browserGetFocused = (mp: Mp, self: null, args: PapyrusValue[]): boolean =>
	!!mp.get(mp.getIdFromDesc(getObject(args, 0).desc), 'browserFocused');

const browserSetModal = (mp: Mp, self: null, args: PapyrusValue[]) => {
	const ac = getObject(args, 0);
	const modal = getBoolean(args, 1);
	mp.set(mp.getIdFromDesc(ac.desc), 'browserModal', modal);
};
const browserGetModal = (mp: Mp, self: null, args: PapyrusValue[]): boolean =>
	!!mp.get(mp.getIdFromDesc(getObject(args, 0).desc), 'browserModal');

export const localizationDefault: Localization = { getText: (x) => x };

export const register = (mp: Mp, localization: Localization = localizationDefault): void => {
	for (const className of ['Multiplayer', 'M']) {
		mp.registerPapyrusFunction('global', className, 'ExecuteUiCommand', (self, args) =>
			executeUiCommand(mp, self, args)
		);

		mp.registerPapyrusFunction('global', className, 'Log', (self, args) => log(mp, self, args));

		mp.registerPapyrusFunction('global', className, 'GetText', (self, args) => getText(localization, mp, self, args));

		mp.registerPapyrusFunction('global', className, 'GetActorsInStreamZone', (self, args) =>
			getActorsInStreamZone(mp, self, args)
		);

		mp.registerPapyrusFunction('global', className, 'GetOnlinePlayers', () => getOnlinePlayers(mp));
		mp.registerPapyrusFunction('global', className, 'IsPlayer', (self, args) => isPlayer(mp, args));

		mp.registerPapyrusFunction('global', className, 'AsPerk', (self, args) => asConvert(mp, self, args));
		mp.registerPapyrusFunction('global', className, 'AsOutfit', (self, args) => asConvert(mp, self, args));
		mp.registerPapyrusFunction('global', className, 'AsRace', (self, args) => asConvert(mp, self, args));
		mp.registerPapyrusFunction('global', className, 'AsMagicEffect', (self, args) => asConvert(mp, self, args));
		mp.registerPapyrusFunction('global', className, 'AsVisualEffect', (self, args) => asConvert(mp, self, args));

		mp.registerPapyrusFunction('global', className, 'StringToInt', (self, args) => stringToInt(mp, self, args));

		mp.registerPapyrusFunction('global', className, 'Wait', (self, args) => wait(mp, self, args));

		mp.registerPapyrusFunction('global', className, 'BrowserSetVisible', (self, args) =>
			browserSetVisible(mp, self, args)
		);
		mp.registerPapyrusFunction('global', className, 'BrowserSetFocused', (self, args) =>
			browserSetFocused(mp, self, args)
		);
		mp.registerPapyrusFunction('global', className, 'BrowserSetModal', (self, args) => browserSetModal(mp, self, args));

		mp.registerPapyrusFunction('global', className, 'BrowserGetVisible', (self, args) =>
			browserGetVisible(mp, self, args)
		);
		mp.registerPapyrusFunction('global', className, 'BrowserGetFocused', (self, args) =>
			browserGetFocused(mp, self, args)
		);
		mp.registerPapyrusFunction('global', className, 'BrowserGetModal', (self, args) => browserGetModal(mp, self, args));

		mp.registerPapyrusFunction('global', className, 'GetGlobalStorageValueString', (self, args) =>
			getGlobalStorageValue(mp, self, args)
		);
		mp.registerPapyrusFunction('global', className, 'GetGlobalStorageValueStringArray', (self, args) =>
			getGlobalStorageValue(mp, self, args)
		);
		mp.registerPapyrusFunction('global', className, 'GetGlobalStorageValueInt', (self, args) =>
			getGlobalStorageValue(mp, self, args)
		);
		mp.registerPapyrusFunction('global', className, 'GetGlobalStorageValueIntArray', (self, args) =>
			getGlobalStorageValue(mp, self, args)
		);
		mp.registerPapyrusFunction('global', className, 'GetGlobalStorageValueFloat', (self, args) =>
			getGlobalStorageValue(mp, self, args)
		);
		mp.registerPapyrusFunction('global', className, 'GetGlobalStorageValueFloatArray', (self, args) =>
			getGlobalStorageValue(mp, self, args)
		);

		mp.registerPapyrusFunction('global', className, 'SetGlobalStorageValueString', (self, args) =>
			setGlobalStorageValueString(mp, self, args)
		);
		mp.registerPapyrusFunction('global', className, 'SetGlobalStorageValueStringArray', (self, args) =>
			setGlobalStorageValueStringArray(mp, self, args)
		);
		mp.registerPapyrusFunction('global', className, 'SetGlobalStorageValueInt', (self, args) =>
			setGlobalStorageValueNumber(mp, self, args)
		);
		mp.registerPapyrusFunction('global', className, 'SetGlobalStorageValueIntArray', (self, args) =>
			setGlobalStorageValueNumberArray(mp, self, args)
		);
		mp.registerPapyrusFunction('global', className, 'SetGlobalStorageValueFloat', (self, args) =>
			setGlobalStorageValueNumber(mp, self, args)
		);
		mp.registerPapyrusFunction('global', className, 'SetGlobalStorageValueFloatArray', (self, args) =>
			setGlobalStorageValueNumberArray(mp, self, args)
		);
	}
};

export interface Localization {
	getText(msgId: string): string;
}
