import { getBoolean, getNumber, getObject, getString } from '../../utils/papyrusArgs';
import { Mp, PapyrusValue, PapyrusObject, Inventory } from '../../types/mp';
import { getForm } from '../game';
import { getAngle, getDistance, getPosition, getEspPosition, setPosition } from './position';
import { Ctx } from '../../types/ctx';
import { evalClient } from '../../properties/eval';
import { FunctionInfo } from '../../utils/functionInfo';
import * as storage from './storage';
import * as position from './position';
import * as game from '../game';
import { isInterior } from '../cell';
import { uint32 } from '../../utils/helper';
import { throwOrInit } from '../../events';
import { CellItem, CellItemProps } from '../debug';
import { serverOptionProvider } from '../../..';

const setScale = (mp: Mp, self: PapyrusObject, args: PapyrusValue[]): void => {
	const scale = getNumber(args, 0);
	const selfId = mp.getIdFromDesc(self.desc);
	// ...
};

// TODO: use transferTo, keepOwnership, removeQuestItems
const removeAllItems = (mp: Mp, self: PapyrusObject, args: PapyrusValue[]): void => {
	const selfId = mp.getIdFromDesc(self.desc);
	const transferTo = args[0] ? getObject(args, 0) : null;
	const keepOwnership = args[1] ? getBoolean(args, 1) : false;
	const removeQuestItems = args[2] ? getBoolean(args, 2) : false;

	const emptyInv: Inventory = { entries: [] };

	mp.set(selfId, 'inventory', emptyInv);
};

const getCurrentDestructionStage = (mp: Mp, self: PapyrusObject): number => {
	const selfId = mp.getIdFromDesc(self.desc);
	return mp.get(selfId, 'currentDestructionStage') ?? -1;
};

const setCurrentDestructionStage = (mp: Mp, self: null, args: PapyrusValue[]) => {
	const ref = getObject(args, 0);
	const refId = mp.getIdFromDesc(ref.desc);
	const stage = getNumber(args, 1);
	mp.set(refId, 'currentDestructionStage', stage);
};

const damageObject = (mp: Mp, self: PapyrusObject, args: PapyrusValue[]): void => {
	const selfId = mp.getIdFromDesc(self.desc);
	const damage = getNumber(args, 0);

	const func = (ctx: Ctx, selfId: number, damage: number) => {
		ctx.sp.once('update', () => {
			const form = ctx.sp.Game.getFormEx(selfId);
			if (!form) return;
			const ref = ctx.sp.ObjectReference.from(form);
			if (!ref) return;
			ref.damageObject(damage);
		});
	};

	// console.log(damage);

	evalClient(mp, 0xff000000, new FunctionInfo(func).getText({ selfId, damage }));
};

const clearDestruction = (mp: Mp, self: PapyrusObject): void => {
	const selfId = mp.getIdFromDesc(self.desc);

	const func = (ctx: Ctx, selfId: number) => {
		ctx.sp.once('update', () => {
			const form = ctx.sp.Game.getFormEx(selfId);
			if (!form) return;
			const ref = ctx.sp.ObjectReference.from(form);
			if (!ref) return;
			ref.clearDestruction();
		});
	};
	evalClient(mp, 0xff000000, new FunctionInfo(func).getText({ selfId }), true);
};

const getContainerForms = (mp: Mp, self: PapyrusObject, args: PapyrusValue[]): PapyrusObject[] => {
	const selfId = mp.getIdFromDesc(self.desc);
	return mp
		.get(selfId, 'inventory')
		.entries.map((item) => {
			return getForm(mp, null, [item.baseId]);
		})
		.filter((item) => item) as PapyrusObject[];
};

const blockActivation = (mp: Mp, self: PapyrusObject, args: PapyrusValue[]) => {
	const selfId = mp.getIdFromDesc(self.desc);
	const state = getBoolean(args, 0);

	mp.set(selfId, 'blockActivationState', state);
};

const moveTo = (mp: Mp, self: PapyrusObject, args: PapyrusValue[]) => {
	const selfId = mp.getIdFromDesc(self.desc);
	const target = getObject(args, 0);
	const xoffset = getNumber(args, 1);
	const yoffset = getNumber(args, 2);
	const zoffset = getNumber(args, 3);
	const matchRotation = getBoolean(args, 4);

	const [x, y, z] = getPosition(mp, target);

	mp.set(selfId, 'pos', [x + xoffset, y + yoffset, z + zoffset]);
	if (matchRotation) {
		mp.set(selfId, 'angle', getAngle(mp, target));
	}
};

const _getBaseObject = (mp: Mp, selfId: number): PapyrusObject | undefined => {
	if (selfId >= 0xff000000) {
		selfId = mp.getIdFromDesc(mp.get(selfId, 'baseDesc'));
		return getForm(mp, null, [selfId]);
	}

	const espmRecord = mp.lookupEspmRecordById(selfId);

	const name = espmRecord.record?.fields.find((x) => x.type === 'NAME')?.data;
	if (name) {
		const dataView = new DataView(name.buffer);
		return getForm(mp, null, [dataView.getUint32(0, true)]);
	}
	return;
};
const getBaseObject = (mp: Mp, self: PapyrusObject): PapyrusObject | undefined => {
	const selfId = mp.getIdFromDesc(self.desc);
	return _getBaseObject(mp, selfId);
};
export const getBaseObjectId = (mp: Mp, self: null, args: PapyrusValue[]): number | undefined => {
	const selfId = mp.getIdFromDesc(getObject(args, 0).desc);
	const base = _getBaseObject(mp, selfId);
	if (base) {
		return mp.getIdFromDesc(base.desc);
	}
	return;
};
export const getBaseObjectIdById = (mp: Mp, self: null, args: PapyrusValue[]): number | undefined => {
	const selfId = getNumber(args, 0);
	const base = _getBaseObject(mp, selfId);
	if (base) {
		return mp.getIdFromDesc(base.desc);
	}
	return;
};

export const placeObjectOnStatic = (mp: Mp, self: null, args: PapyrusValue[]): number | undefined => {
	const placeId = getNumber(args, 0);
	const whatSpawnId = getNumber(args, 1);
	const sRefId = mp.place(whatSpawnId);
	const sRef: PapyrusObject = {
		type: 'form',
		desc: mp.getDescFromId(sRefId),
	};
	setPosition(mp, sRef, getEspPosition(mp, placeId));
	throwOrInit(mp, sRefId);
	return sRefId;
};
export const placeAtMeEx = (mp: Mp, selfNull: null, args: PapyrusValue[]): PapyrusValue => {
	const self = getObject(args, 0);
	const selfId = mp.getIdFromDesc(self.desc);
	const spawnId = getNumber(args, 1);
	const sRefId = mp.place(spawnId);
	const sRef: PapyrusObject = {
		type: 'form',
		desc: mp.getDescFromId(sRefId),
	};
	const targetPoint: CellItem = {
		pos: mp.get<[number, number, number]>(selfId, 'pos') ?? [0, 0, 0],
		angle: [0, 0, 0],
		worldOrCellDesc: mp.get(selfId, 'worldOrCellDesc'),
	};
	for (const key of Object.keys(targetPoint)) {
		const propName = key as CellItemProps;
		mp.set(sRefId, propName, targetPoint[propName]);
	}
	throwOrInit(mp, sRefId);
	return sRef;
};

const getLinkedReferenceId = (mp: Mp, self: null, args: PapyrusValue[]): number[] | undefined => {
	const base = mp.getIdFromDesc(getObject(args, 0).desc);
	const espmRecord = mp.lookupEspmRecordById(base);
	const links = espmRecord.record?.fields.find((x) => x.type === 'XLKR')?.data;
	if (links) {
		const dataView = new DataView(links.buffer);
		let keywordsId: Array<number> = [];
		for (let i = 4; i + 4 <= links.length; i += 8) {
			keywordsId.push(dataView.getUint32(i, true));
		}
		return keywordsId;
	}
	return;
};

const getLinkedReferenceIdByKeywordId = (mp: Mp, self: null, args: PapyrusValue[]): number | undefined => {
	const base = mp.getIdFromDesc(getObject(args, 0).desc);
	const keywordId = getNumber(args, 1);
	const espmRecord = mp.lookupEspmRecordById(base);
	const links = espmRecord.record?.fields.find((x) => x.type === 'XLKR')?.data;
	if (links) {
		const dataView = new DataView(links.buffer);
		for (let i = 0; i + 4 <= dataView.byteLength; i += 8) {
			if (dataView.getUint32(i, true) == keywordId) {
				return dataView.getUint32(i + 4, true);
			}
		}
	}
	return;
};

export const getDisplayName = (mp: Mp, self: PapyrusObject): string => {
	const selfId = mp.getIdFromDesc(self.desc);
	const appearance = mp.get(selfId, 'appearance');

	// if (appearance?.name && typeof appearance.name === 'string') {
	//   return appearance.name;
	// }

	if (selfId >= 0xff000000) {
		const f = getForm(mp, null, [mp.getIdFromDesc(mp.get(selfId, 'baseDesc'))]);
		const n = f && mp.callPapyrusFunction('global', 'FormEx', 'GetName', null, [f]);
		return mp.get(selfId, 'displayName') ?? appearance?.name ?? n;
	}

	const espmRecord = mp.lookupEspmRecordById(selfId);

	const name = espmRecord.record?.fields.find((x) => x.type === 'NAME')?.data;
	if (!name) return '';

	const baseId = uint32(name.buffer, 0);

	const f = getForm(mp, null, [baseId]);
	const n = f && mp.callPapyrusFunction('global', 'FormEx', 'GetName', null, [f]);

	return mp.get(selfId, 'displayName') ?? appearance?.name ?? n;
};

const setDisplayName = (mp: Mp, self: PapyrusObject, args: PapyrusValue[]) => {
	const selfId = mp.getIdFromDesc(self.desc);
	const name = getString(args, 0);
	const force = getBoolean(args, 1);

	mp.set(selfId, 'displayName', name);
};

export const getWorldSpace = (mp: Mp, self: PapyrusObject) => {
	const selfId = mp.getIdFromDesc(self.desc);
	const worldOrCellId = mp.getIdFromDesc(mp.get(selfId, 'worldOrCellDesc'));
	return game.getForm(mp, null, [worldOrCellId]);
};

export const getParentCell = (mp: Mp, self: PapyrusObject) => {
	const selfId = mp.getIdFromDesc(self.desc);
	const cellDesc = mp.get<string>(selfId, 'cellDesc');
	if (!cellDesc) return;
	const cellId = mp.getIdFromDesc(cellDesc);
	return game.getForm(mp, null, [cellId]);
};

export const isInInterior = (mp: Mp, self: PapyrusObject): boolean => {
	const cell = getParentCell(mp, self);
	if (!cell) return false;
	return isInterior(mp, cell);
};

export const getLocationRef = (mp: Mp, self: null, args: PapyrusValue[]): number | undefined => {
	const espmRecord = mp.lookupEspmRecordById(getNumber(args, 0));
	const locationRef = espmRecord.record?.fields.find((x) => x.type === 'XLRT')?.data;
	if (!locationRef) return;
	const dataView = new DataView(locationRef.buffer);
	const locationRefId = dataView.getUint32(0, true);
	return locationRefId;
};

export const setOpen = (mp: Mp, self: PapyrusObject, args: PapyrusValue[]): void => {
	const selfId = mp.getIdFromDesc(self.desc);
	const openState = getBoolean(args, 0);
	console.log(selfId, openState);
	mp.set(selfId, 'openState', openState);
};
// export const getOpenState = (mp: Mp, self: PapyrusObject): boolean => {
//   const selfId = mp.getIdFromDesc(self.desc);
//   return mp.get(selfId, 'openState') ?? false;
// };

export const getRespawnTimeById = (mp: Mp, selfNull: null, args: PapyrusValue[]): number => {
	const selfId = getNumber(args, 0);
	const baseId = getBaseObjectIdById(mp, null, [selfId]);
	const spawnTimeById = serverOptionProvider.getServerOptionsValue(['spawnTimeById'])
	const timeById: { id: number; time: number }[] =
		Array.isArray(spawnTimeById) ? spawnTimeById.map((x: PapyrusValue) => {
			if (!x || typeof x !== 'string') return
			const xParse = x.split(':');
			if (xParse.length != 2) return;
			return {
				id: +xParse[0],
				time: +xParse[1],
			};
		}).filter(x => x) as { id: number; time: number }[] : [];
	const refTime = timeById.find((x) => x.id === selfId)?.time;
	const baseTime = timeById.find((x) => x.id === baseId)?.time;
	return refTime ?? baseTime ?? serverOptionProvider.getServerOptionsValue([baseId === 7 ? 'SpawnTimeToRespawn' : 'SpawnTimeToRespawnNPC']) as number ?? -1;
};

export const getRespawnTime = (mp: Mp, selfNull: null, args: PapyrusValue[]): number => {
	const self = getObject(args, 0);
	const selfId = mp.getIdFromDesc(self.desc);
	return getRespawnTimeById(mp, null, [selfId])
};


export const register = (mp: Mp): void => {
	mp.registerPapyrusFunction('method', 'ObjectReference', 'SetScale', (self, args) => setScale(mp, self, args));
	mp.registerPapyrusFunction('method', 'ObjectReference', 'RemoveAllItems', (self, args) =>
		removeAllItems(mp, self, args)
	);
	mp.registerPapyrusFunction('method', 'ObjectReference', 'GetDistance', (self, args) => getDistance(mp, self, args));

	mp.registerPapyrusFunction('method', 'ObjectReference', 'MoveTo', (self, args) => moveTo(mp, self, args));

	mp.registerPapyrusFunction('method', 'ObjectReference', 'GetContainerForms', (self, args) =>
		getContainerForms(mp, self, args)
	);

	mp.registerPapyrusFunction('method', 'ObjectReference', 'GetCurrentDestructionStage', (self) =>
		getCurrentDestructionStage(mp, self)
	);
	mp.registerPapyrusFunction('method', 'ObjectReference', 'DamageObject', (self, args) => damageObject(mp, self, args));
	mp.registerPapyrusFunction('method', 'ObjectReference', 'ClearDestruction', (self) => clearDestruction(mp, self));
	mp.registerPapyrusFunction('global', 'ObjectReferenceEx', 'SetCurrentDestructionStage', (self, args) =>
		setCurrentDestructionStage(mp, self, args)
	);

	mp.registerPapyrusFunction('method', 'ObjectReference', 'BlockActivation', (self, args) =>
		blockActivation(mp, self, args)
	);

	mp.registerPapyrusFunction('method', 'ObjectReference', 'GetBaseObject', (self) => getBaseObject(mp, self));
	mp.registerPapyrusFunction('global', 'ObjectReferenceEx', 'GetBaseObjectId', (self, args) =>
		getBaseObjectId(mp, self, args)
	);
	mp.registerPapyrusFunction('global', 'ObjectReferenceEx', 'GetLinkedReferenceId', (self, args) =>
		getLinkedReferenceId(mp, self, args)
	);
	mp.registerPapyrusFunction('global', 'ObjectReferenceEx', 'GetLinkedReferenceIdByKeywordId', (self, args) =>
		getLinkedReferenceIdByKeywordId(mp, self, args)
	);
	mp.registerPapyrusFunction('global', 'ObjectReferenceEx', 'PlaceObjectOnStatic', (self, args) =>
		placeObjectOnStatic(mp, self, args)
	);
	mp.registerPapyrusFunction('global', 'ObjectReferenceEx', 'PlaceAtMe', (self, args) => placeAtMeEx(mp, self, args));

	mp.registerPapyrusFunction('method', 'ObjectReference', 'GetDisplayName', (self) => getDisplayName(mp, self));
	mp.registerPapyrusFunction('method', 'ObjectReference', 'SetDisplayName', (self, args) =>
		setDisplayName(mp, self, args)
	);

	mp.registerPapyrusFunction('method', 'ObjectReference', 'GetWorldSpace', (self) => getWorldSpace(mp, self));
	mp.registerPapyrusFunction('method', 'ObjectReference', 'GetParentCell', (self) => getParentCell(mp, self));
	mp.registerPapyrusFunction('method', 'ObjectReference', 'IsInInterior', (self) => isInInterior(mp, self));
	mp.registerPapyrusFunction('method', 'ObjectReference', 'SetOpen', (self, args) => setOpen(mp, self, args));
	// mp.registerPapyrusFunction('method', 'ObjectReference', 'GetOpenState', (self) => getOpenState(mp, self));
	mp.registerPapyrusFunction('global', 'ObjectReferenceEx', 'GetLocationRef', (self, args) =>
		getLocationRef(mp, self, args)
	);
	mp.registerPapyrusFunction('global', 'ObjectReferenceEx', 'GetRespawnTime', (self, args) =>
		getRespawnTime(mp, self, args)
	);

	storage.register(mp);
	position.register(mp);
};
