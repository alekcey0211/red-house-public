import { IGame } from '../../..';
import { evalClient } from '../../properties/eval';
import { Ctx } from '../../types/ctx';
import { Mp, PapyrusValue, PapyrusObject } from '../../types/mp';
import { FunctionInfo } from '../../utils/functionInfo';
import { getNumber, getObject, getString } from '../../utils/papyrusArgs';
import { ServerOptionProvider } from './server-options';

export const getForm = (mp: Mp, self: null, args: PapyrusValue[]): PapyrusObject | undefined => {
	const formId = getNumber(args, 0);
	try {
		if (formId >= 0xff000000) {
			mp.get(formId, 'type');
			return {
				desc: mp.getDescFromId(formId),
				type: 'form',
			};
		}
		const espm = mp.lookupEspmRecordById(formId);
		if (!espm.record?.type) {
			console.log(`ESPM Record by id ${formId.toString(16)} not found`);
			return;
		}
		const obj: PapyrusObject = {
			desc: mp.getDescFromId(formId),
			type: ['REFR', 'ACHR'].includes(espm.record?.type) ? 'form' : 'espm',
		};
		return obj;
	} catch (err) {
		const regex = /Form with id.+doesn't exist/gm;
		if (regex.exec(err as string) !== null) {
			console.log(err);
			return;
		}
		console.log(err);
		throw err;
	}
};

const getDesc = (mp: Mp, formId: number, fileName: string): string | null => {
	const mods = mp.getEspmLoadOrder();
	const index = mods.findIndex((mod) => mod.toLowerCase() === fileName.toLowerCase());

	if (index === -1) return null;

	const desc = `${formId.toString(16)}:${mods[index]}`;
	return desc;
};

export const getFormFromFile = (mp: Mp, self: null, args: PapyrusValue[]): PapyrusObject | undefined => {
	const formId = getNumber(args, 0);
	const fileName = getString(args, 1);
	const desc = getDesc(mp, formId, fileName);

	if (!desc) return;

	try {
		return getForm(mp, null, [mp.getIdFromDesc(desc)]);
	} catch (error) {
		console.log(error);
	}
};

export const getFormFromFileEx = (mp: Mp, self: null, args: PapyrusValue[]): number | undefined => {
	const formId = getNumber(args, 0);
	const fileName = getString(args, 1);
	const desc = getDesc(mp, formId, fileName);

	if (!desc) return;

	try {
		return mp.getIdFromDesc(desc);
	} catch (error) {
		console.error(error);
	}
};

const forceThirdPerson = (mp: Mp, self: null, args: PapyrusValue[]) => {
	const ac = getObject(args, 0);
	const acId = mp.getIdFromDesc(ac.desc);

	const func = (ctx: Ctx) => {
		ctx.sp.once('update', () => {
			ctx.sp.Game.forceThirdPerson();
		});
	};
	evalClient(mp, acId, new FunctionInfo(func).getText({}));
};

const disablePlayerControls = (mp: Mp, self: null, args: PapyrusValue[]) => {
	const ac = getObject(args, 0);
	const acId = mp.getIdFromDesc(ac.desc);
	// const movement = getBoolean(args, 1);
	// const fighting = getBoolean(args, 2);
	// const camSwitch = getBoolean(args, 3);
	// const looking = getBoolean(args, 4);
	// const sneaking = getBoolean(args, 5);
	// const menu = getBoolean(args, 6);
	// const activate = getBoolean(args, 7);
	// const journaltabs = getBoolean(args, 8);
	// const disablePOV = getNumber(args, 9);

	const func = (ctx: Ctx) => {
		ctx.sp.once('update', () => {
			ctx.sp.Game.disablePlayerControls(false, false, false, true, false, false, false, false, 0);
		});
	};
	evalClient(mp, acId, new FunctionInfo(func).getText({}));
};

const enablePlayerControls = (mp: Mp, self: null, args: PapyrusValue[]) => {
	const ac = getObject(args, 0);
	const acId = mp.getIdFromDesc(ac.desc);
	// const movement = args[1] ? getBoolean(args, 1) : true;
	// const fighting = args[2] ? getBoolean(args, 2) : true;
	// const camSwitch = args[3] ? getBoolean(args, 3) : true;
	// const looking = args[4] ? getBoolean(args, 4) : true;
	// const sneaking = args[5] ? getBoolean(args, 5) : true;
	// const menu = args[6] ? getBoolean(args, 6) : true;
	// const activate = args[7] ? getBoolean(args, 7) : true;
	// const journaltabs = args[8] ? getBoolean(args, 8) : true;
	// const disablePOV = args[9] ? getNumber(args, 9) : 0;

	const func = (ctx: Ctx) => {
		ctx.sp.once('update', () => {
			ctx.sp.Game.enablePlayerControls(true, true, true, true, true, true, true, true, 0);
		});
	};
	evalClient(mp, acId, new FunctionInfo(func).getText({}));
};

const getCurrentCrosshairRef = (mp: Mp, selfNull: null, args: PapyrusValue[]) => {
	const self = getObject(args, 0);
	const selfId = mp.getIdFromDesc(self.desc);
	const refId = mp.get<number>(selfId, 'CurrentCrosshairRef');
	if (!refId) return undefined;
	return getForm(mp, null, [refId]);
};

export const register = (mp: Mp, serverOptionProvider: ServerOptionProvider): void => {
	mp.registerPapyrusFunction('global', 'Game', 'GetForm', (self, args) => getForm(mp, self, args));
	mp.registerPapyrusFunction('global', 'Game', 'GetFormEx', (self, args) => getForm(mp, self, args));
	mp.registerPapyrusFunction('global', 'Game', 'GetFormFromFile', (self, args) => getFormFromFile(mp, self, args));

	mp.registerPapyrusFunction('global', 'GameEx', 'GetFormFromFile', (self, args) => getFormFromFileEx(mp, self, args));
	mp.registerPapyrusFunction('global', 'GameEx', 'ForceThirdPerson', (self, args) => forceThirdPerson(mp, self, args));
	mp.registerPapyrusFunction('global', 'GameEx', 'DisablePlayerControls', (self, args) =>
		disablePlayerControls(mp, self, args)
	);
	mp.registerPapyrusFunction('global', 'GameEx', 'EnablePlayerControls', (self, args) =>
		enablePlayerControls(mp, self, args)
	);
	mp.registerPapyrusFunction('global', 'GameEx', 'GetCurrentCrosshairRef', (self, args) =>
		getCurrentCrosshairRef(mp, self, args)
	);

	mp.registerPapyrusFunction('global', 'GameEx', 'GetServerOptionsString', (self, args) =>
		serverOptionProvider.getServerOptionsValue(args)
	);
	mp.registerPapyrusFunction('global', 'GameEx', 'GetServerOptionsStringArray', (self, args) =>
		serverOptionProvider.getServerOptionsValue(args)
	);
	mp.registerPapyrusFunction('global', 'GameEx', 'GetServerOptionsInt', (self, args) =>
		serverOptionProvider.getServerOptionsValue(args)
	);
	mp.registerPapyrusFunction('global', 'GameEx', 'GetServerOptionsIntArray', (self, args) =>
		serverOptionProvider.getServerOptionsValue(args)
	);
	mp.registerPapyrusFunction('global', 'GameEx', 'GetServerOptionsFloat', (self, args) =>
		serverOptionProvider.getServerOptionsValue(args)
	);
	mp.registerPapyrusFunction('global', 'GameEx', 'GetServerOptionsFloatArray', (self, args) =>
		serverOptionProvider.getServerOptionsValue(args)
	);
	mp.registerPapyrusFunction('global', 'GameEx', 'GetServerOptionsBool', (self, args) =>
		serverOptionProvider.getServerOptionsValue(args)
	);

	IGame.GetForm = (args: PapyrusValue[]) => getForm(mp, null, args);
	IGame.GetFormFromFile = (args: PapyrusValue[]) => getFormFromFile(mp, null, args);
	IGame.ForceThirdPerson = (args: PapyrusValue[]) => forceThirdPerson(mp, null, args);
	IGame.DisablePlayerControls = (args: PapyrusValue[]) => disablePlayerControls(mp, null, args);
	IGame.EnablePlayerControls = (args: PapyrusValue[]) => enablePlayerControls(mp, null, args);
	IGame.GetCurrentCrosshairRef = (args: PapyrusValue[]) => getCurrentCrosshairRef(mp, null, args);
	IGame.GetServerOptions = () => serverOptionProvider.getServerOptions();
	IGame.GetServerOptionsValue = (args: PapyrusValue[]) => serverOptionProvider.getServerOptionsValue(args);
};
