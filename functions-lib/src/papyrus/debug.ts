import { Mp, PapyrusValue } from '../types/mp';
import { getObject, getString, getNumber } from '../utils/papyrusArgs';
import { Ctx } from '../types/ctx';
import { evalClient } from '../properties/eval';
import { FunctionInfo } from '../utils/functionInfo';
import { IDebug } from '../..';
import { isPlayer } from './multiplayer';

export type CellItemProps = 'pos' | 'angle' | 'worldOrCellDesc';
export interface CellItem {
	pos: [number, number, number];
	angle: [number, number, number];
	worldOrCellDesc: string;
}

export interface CellList {
	[key: string]: CellItem;
}

let cocMarkers: CellList | null = null;
const centerOnCell = (mp: Mp, selfNull: null, args: PapyrusValue[]): void => {
	const self = getObject(args, 0);
	const selfId = mp.getIdFromDesc(self.desc);
	const cellName = getString(args, 1).toLowerCase();
	const cellList: CellList = JSON.parse(mp.readDataFile('coc/cell.json'));
	if (!cocMarkers) {
		cocMarkers = JSON.parse(mp.readDataFile('xelib/coc-markers.json')) as CellList;
	}
	if (!cellList || !cocMarkers) return;

	const targetCellFromFile =
		Object.keys(cocMarkers).find((x) => x.toLowerCase() === cellName) ??
		Object.keys(cellList).find((x) => x.toLowerCase() === cellName);

	if (!targetCellFromFile) return;

	const targetPoint = cocMarkers[targetCellFromFile] ?? cellList[targetCellFromFile];

	Object.keys(targetPoint).forEach((key) => {
		const propName = key as CellItemProps;
		mp.set(selfId, propName, targetPoint[propName]);
	});
};

const notification = (mp: Mp, self: null, args: PapyrusValue[]): void => {
	const ac = getObject(args, 0);
	const acId = mp.getIdFromDesc(ac.desc);
	const msg = getString(args, 1);
	const func = (ctx: Ctx, msg: string) => {
		ctx.sp.once('update', () => {
			ctx.sp.Debug.notification(msg);
		});
	};
	evalClient(mp, acId, new FunctionInfo(func).getText({ msg }));
};

const quitGame = (mp: Mp, self: null, args: PapyrusValue[]): void => {
	const ac = getObject(args, 0);

	const acId = mp.getIdFromDesc(ac.desc);
	if (!isPlayer(mp, [acId])) return;

	const func = (ctx: Ctx) => {
		ctx.sp.once('update', () => {
			ctx.sp.Debug.quitGame();
		});
	};
	evalClient(mp, acId, new FunctionInfo(func).getText());
	evalClient(mp, acId, '');
};

const toggleCollisions = (mp: Mp, self: null, args: PapyrusValue[]): void => {
	const ac = getObject(args, 0);

	const acId = mp.getIdFromDesc(ac.desc);
	if (!isPlayer(mp, [acId])) return;

	const func = (ctx: Ctx) => {
		ctx.sp.once('update', () => {
			ctx.sp.Debug.toggleCollisions();
		});
	};
	evalClient(mp, acId, new FunctionInfo(func).getText());
};

const showEspList = (mp: Mp): void => {
	const listEsp: string[] = mp.getEspmLoadOrder();
	console.log(JSON.stringify(listEsp));
};

export const getNumberEspmLoad = (mp: Mp): number => {
	const listEsp: string[] = mp.getEspmLoadOrder();
	return listEsp?.length;
};

const aboutForm = (mp: Mp, self: null, args: PapyrusValue[]) => {
	const formId = getNumber(args, 0);

	const data = mp.lookupEspmRecordById(formId).record;
	console.log(`AboutForm: ${JSON.stringify(data, null, 2)}`);
};

const about = (mp: Mp, self: null, args: PapyrusValue[]) => {
	console.log(`About: ${JSON.stringify(getObject(args, 0), null, 2)}`);
};

const sendClientConsole = (mp: Mp, self: null, args: PapyrusValue[]) => {
	if (!args) return;
	const message = args.toString();
	const func = (ctx: Ctx) => {
		ctx.sp.once('update', () => {
			ctx.sp.printConsole(message);
		});
	};
	evalClient(mp, 0xff000000, new FunctionInfo(func).getText({ message }));
};

export const register = (mp: Mp): void => {
	mp.registerPapyrusFunction('global', 'DebugEx', 'CenterOnCell', (self, args) => centerOnCell(mp, self, args));
	mp.registerPapyrusFunction('global', 'DebugEx', 'Notification', (self, args) => notification(mp, self, args));
	mp.registerPapyrusFunction('global', 'DebugEx', 'ShowEspmLoad', () => showEspList(mp));
	mp.registerPapyrusFunction('global', 'DebugEx', 'AboutForm', (self, args) => aboutForm(mp, self, args));
	mp.registerPapyrusFunction('global', 'DebugEx', 'About', (self, args) => about(mp, self, args));
	mp.registerPapyrusFunction('global', 'DebugEx', 'PrintConsole', (self, args) => sendClientConsole(mp, self, args));

	IDebug.CenterOnCell = (args: PapyrusValue[]) => centerOnCell(mp, null, args);
	IDebug.Notification = (args: PapyrusValue[]) => notification(mp, null, args);
	IDebug.QuitGame = (args: PapyrusValue[]) => quitGame(mp, null, args);
	IDebug.ToggleCollisions = (args: PapyrusValue[]) => toggleCollisions(mp, null, args);
	IDebug.SendAnimationEvent = (args: PapyrusValue[]) =>
		mp.callPapyrusFunction('global', 'Debug', 'SendAnimationEvent', null, args);
};
