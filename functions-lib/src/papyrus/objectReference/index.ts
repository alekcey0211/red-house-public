import { getBoolean, getNumber, getObject, getString } from '../../utils/papyrusArgs';
import { Mp, PapyrusValue, PapyrusObject, Inventory } from '../../types/mp';
import { getForm } from '../game';
import {
	getAngle,
	getDistance,
	getPosition,
	getEspPosition,
	setPosition,
	getPositionX,
	getPositionY,
	getPositionZ,
	setAngle,
	getAngleX,
	getAngleY,
	getAngleZ,
	getLinkedDoorId,
	getLinkedCellId,
} from './position';
import { Ctx } from '../../types/ctx';
import { evalClient } from '../../properties/eval';
import { FunctionInfo } from '../../utils/functionInfo';
import * as storage from './storage';
import * as position from './position';
import * as game from '../game';
import { isInterior } from '../cell';
import { uint32 } from '../../utils/helper';
import { CellItem, CellItemProps } from '../debug';
import { IObjectReference, serverOptionProvider } from '../../..';
import { _getStorageValue, _setStorageValue } from './storage';
import { throwOrInit } from '../../events/shared';

const setScale = (mp: Mp, self: PapyrusObject, args: PapyrusValue[]): void => {
	const selfId = mp.getIdFromDesc(self.desc);
	const scale = getNumber(args, 0);
	mp.set(selfId, 'scale', scale);
};

const getScale = (mp: Mp, self: PapyrusObject): number => {
	const selfId = mp.getIdFromDesc(self.desc);
	return mp.get<number>(selfId, 'scale') ?? 1;
};

// TODO: keepOwnership, removeQuestItems
const removeAllItems = (mp: Mp, self: PapyrusObject, args: PapyrusValue[]): void => {
	const selfId = mp.getIdFromDesc(self.desc);
	const transferTo = args[0] ? getObject(args, 0) : null;

	if (transferTo) {
		const transferToId = mp.getIdFromDesc(transferTo.desc);
		const transferToInv = mp.get(transferToId, 'inventory');
		const selfInv = mp.get(selfId, 'inventory');
		selfInv.entries.forEach((item) => {
			const same = transferToInv.entries.find((x) => x.baseId === item.baseId);
			if (same) {
				same.count += item.count;
			} else {
				transferToInv.entries.push(item);
			}
		});
		mp.set(transferToId, 'inventory', transferToInv);
	}

	const emptyInv: Inventory = { entries: [] };

	mp.set(selfId, 'inventory', emptyInv);
};

const getCurrentDestructionStage = (mp: Mp, self: PapyrusObject): number => {
	const selfId = mp.getIdFromDesc(self.desc);
	return mp.get(selfId, 'currentDestructionStage') ?? -1;
};

const _setCurrentDestructionStage = (mp: Mp, self: PapyrusObject, args: PapyrusValue[]) => {
	const selfId = mp.getIdFromDesc(self.desc);
	const stage = getNumber(args, 0);
	mp.set(selfId, 'currentDestructionStage', stage);
};
const setCurrentDestructionStage = (mp: Mp, self: null, args: PapyrusValue[]) => {
	const ref = getObject(args, 0);
	const stage = getNumber(args, 1);
	_setCurrentDestructionStage(mp, ref, [stage]);
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

const getContainerForms = (mp: Mp, self: PapyrusObject): PapyrusObject[] => {
	const selfId = mp.getIdFromDesc(self.desc);
	return mp
		.get(selfId, 'inventory')
		.entries.map((item) => {
			return getForm(mp, null, [item.baseId]);
		})
		.filter((item) => item) as PapyrusObject[];
};

const blockActivation = (mp: Mp, self: PapyrusObject, args: PapyrusValue[]) => {
	const state = getBoolean(args, 0);

	mp.callPapyrusFunction('method', 'ObjectReference', 'BlockActivation', self, [state]);
};

const moveTo = (mp: Mp, self: PapyrusObject, args: PapyrusValue[]) => {
	const selfId = mp.getIdFromDesc(self.desc);
	const target = getObject(args, 0);
	const targetId = mp.getIdFromDesc(target.desc);
	const xoffset = getNumber(args, 1);
	const yoffset = getNumber(args, 2);
	const zoffset = getNumber(args, 3);
	const matchRotation = getBoolean(args, 4);

	const [x, y, z] = getPosition(mp, target);
	const w = mp.get(targetId, 'worldOrCellDesc');

	console.log(selfId, [x + xoffset, y + yoffset, z + zoffset]);
	mp.set(selfId, 'pos', [x + xoffset, y + yoffset, z + zoffset]);
	mp.set(selfId, 'worldOrCellDesc', w);
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
};
export const getBaseObjectIdById = (mp: Mp, self: null, args: PapyrusValue[]): number | undefined => {
	const selfId = getNumber(args, 0);
	const base = _getBaseObject(mp, selfId);
	if (base) {
		return mp.getIdFromDesc(base.desc);
	}
};

export const placeObjectOnStatic = (mp: Mp, self: null, args: PapyrusValue[]): PapyrusObject | null => {
	const placeId = getNumber(args, 0);
	const whatSpawnId = getNumber(args, 1);
	const sRefId = mp.place(whatSpawnId);
	const sRef = getForm(mp, null, [sRefId]);
	if (!sRef) return null;

	const targetPoint: CellItem = {
		pos: getEspPosition(mp, placeId),
		angle: [0, 0, 0],
		worldOrCellDesc: mp.get(placeId, 'worldOrCellDesc'),
	};

	Object.keys(targetPoint).forEach((key) => {
		const propName = key as CellItemProps;
		mp.set(sRefId, propName, targetPoint[propName]);
	});

	throwOrInit(mp, sRefId);
	return sRef;
};

const _placeAtMe = (mp: Mp, self: PapyrusObject, args: PapyrusValue[]): PapyrusObject | null => {
	const selfId = mp.getIdFromDesc(self.desc);
	const whatSpawnId = getNumber(args, 0);
	const count = getNumber(args, 1);
	const sRefResult: PapyrusObject[] = [];
	for (let i = 0; i < count; i++) {
		const sRefId = mp.place(whatSpawnId);
		const sRef = getForm(mp, null, [sRefId]);
		if (!sRef) return null;

		sRefResult.push(sRef);

		const targetPoint: CellItem = {
			pos: mp.get<[number, number, number]>(selfId, 'pos') ?? [0, 0, 0],
			angle: [0, 0, 0],
			worldOrCellDesc: mp.get(selfId, 'worldOrCellDesc'),
		};

		Object.keys(targetPoint).forEach((key) => {
			const propName = key as CellItemProps;
			mp.set(sRefId, propName, targetPoint[propName]);
		});

		throwOrInit(mp, sRefId);
	}
	if (sRefResult.length === 0) return null;
	return sRefResult[sRefResult.length - 1];
};
const placeAtMeObj = (mp: Mp, self: PapyrusObject, args: PapyrusValue[]): PapyrusObject | null => {
	const target = getObject(args, 0);
	const targetId = mp.getIdFromDesc(target.desc);
	const count = getNumber(args, 1);
	return _placeAtMe(mp, self, [targetId, count]);
};
export const placeAtMe = (mp: Mp, selfNull: null, args: PapyrusValue[]): PapyrusObject | null => {
	const self = getObject(args, 0);
	const targetId = getNumber(args, 1);
	const count = getNumber(args, 2);
	return _placeAtMe(mp, self, [targetId, count]);
};

const getLinkedReferenceId = (mp: Mp, self: null, args: PapyrusValue[]): number[] => {
	const base = mp.getIdFromDesc(getObject(args, 0).desc);
	const espmRecord = mp.lookupEspmRecordById(base);
	const links = espmRecord.record?.fields.find((x) => x.type === 'XLKR')?.data;
	if (!links) return [];

	const dataView = new DataView(links.buffer);
	const keywordsId: Array<number> = [];
	for (let i = 4; i + 4 <= links.length; i += 8) {
		keywordsId.push(dataView.getUint32(i, true));
	}
	return keywordsId;
};

const getLinkedReferenceIdByKeywordId = (mp: Mp, self: null, args: PapyrusValue[]): number | undefined => {
	const base = mp.getIdFromDesc(getObject(args, 0).desc);
	const keywordId = getNumber(args, 1);
	const espmRecord = mp.lookupEspmRecordById(base);
	const links = espmRecord.record?.fields.find((x) => x.type === 'XLKR')?.data;
	if (links) {
		const dataView = new DataView(links.buffer);
		for (let i = 0; i + 4 <= dataView.byteLength; i += 8) {
			if (dataView.getUint32(i, true) === keywordId) {
				return dataView.getUint32(i + 4, true);
			}
		}
	}
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

	mp.set(selfId, 'displayName', name);
};

export const getWorldSpace = (mp: Mp, self: PapyrusObject): PapyrusObject | undefined => {
	const selfId = mp.getIdFromDesc(self.desc);
	const worldOrCellId = mp.getIdFromDesc(mp.get(selfId, 'worldOrCellDesc'));
	return game.getForm(mp, null, [worldOrCellId]);
};

export const getParentCell = (mp: Mp, self: PapyrusObject): PapyrusObject | undefined => {
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
	const spawnTimeById = serverOptionProvider.getServerOptionsValue(['spawnTimeById']);
	const timeById: { id: number; time: number }[] = Array.isArray(spawnTimeById)
		? (spawnTimeById
				.map((x: PapyrusValue) => {
					if (!x || typeof x !== 'string') return;
					const xParse = x.split(':');
					if (xParse.length !== 2) return;
					return {
						id: +xParse[0],
						time: +xParse[1],
					};
				})
				.filter((x) => x) as { id: number; time: number }[])
		: [];
	const refTime = timeById.find((x) => x.id === selfId)?.time;
	const baseTime = timeById.find((x) => x.id === baseId)?.time;
	return (
		refTime ??
		baseTime ??
		(serverOptionProvider.getServerOptionsValue([
			baseId === 7 ? 'SpawnTimeToRespawn' : 'SpawnTimeToRespawnNPC',
		]) as number) ??
		-1
	);
};

export const getRespawnTime = (mp: Mp, selfNull: null, args: PapyrusValue[]): number => {
	const self = getObject(args, 0);
	const selfId = mp.getIdFromDesc(self.desc);
	return getRespawnTimeById(mp, null, [selfId]);
};

export const addItem = (mp: Mp, self: PapyrusObject, args: PapyrusValue[]): void => {
	const item = getObject(args, 0);
	const count = getNumber(args, 1);
	const silent = getBoolean(args, 2);
	mp.callPapyrusFunction('method', 'ObjectReference', 'AddItem', self, [item, count, silent]);
};
export const removeItem = (mp: Mp, self: PapyrusObject, args: PapyrusValue[]): void => {
	const item = getObject(args, 0);
	const count = getNumber(args, 1);
	const silent = getBoolean(args, 2);
	const other = args[3] ? getObject(args, 3) : null;
	mp.callPapyrusFunction('method', 'ObjectReference', 'RemoveItem', self, [item, count, silent, other]);
};
export const disable = (mp: Mp, self: PapyrusObject, args: PapyrusValue[]): void => {
	const abFadeOut = getBoolean(args, 0);
	mp.callPapyrusFunction('method', 'ObjectReference', 'Disable', self, [abFadeOut]);
};
export const getItemCount = (mp: Mp, self: PapyrusObject, args: PapyrusValue[]): number => {
	const item = getObject(args, 0);
	const itemCount = mp.callPapyrusFunction('method', 'ObjectReference', 'GetItemCount', self, [item]);
	if (!itemCount) return 0;
	return itemCount as number;
};

// export const disable = (mp: Mp, self: PapyrusObject) => {
// 	const selfId = mp.getIdFromDesc(self.desc);
// 	// mp.set(selfId, 'isDisabled', true);

// 	const func = (ctx: Ctx, selfId: number) => {
// 		ctx.sp.once('update', () => {
// 			const form = ctx.sp.Game.getFormEx(selfId);
// 			if (!form) return;
// 			const ref = ctx.sp.ObjectReference.from(form);
// 			if (!ref) return;
// 			ref.disable(true).then(() => {
// 				ref.setPosition(0, 0, 0);
// 			});
// 		});
// 	};

// 	evalClient(mp, 0xff000000, new FunctionInfo(func).getText({ selfId }));
// };

export const register = (mp: Mp): void => {
	mp.registerPapyrusFunction('method', 'ObjectReference', 'SetScale', (self, args) => setScale(mp, self, args));
	mp.registerPapyrusFunction('method', 'ObjectReference', 'GetScale', (self) => getScale(mp, self));
	mp.registerPapyrusFunction('method', 'ObjectReference', 'RemoveAllItems', (self, args) =>
		removeAllItems(mp, self, args)
	);
	mp.registerPapyrusFunction('method', 'ObjectReference', 'GetDistance', (self, args) => getDistance(mp, self, args));

	mp.registerPapyrusFunction('method', 'ObjectReference', 'MoveTo', (self, args) => moveTo(mp, self, args));

	mp.registerPapyrusFunction('method', 'ObjectReference', 'GetContainerForms', (self) => getContainerForms(mp, self));

	mp.registerPapyrusFunction('method', 'ObjectReference', 'GetCurrentDestructionStage', (self) =>
		getCurrentDestructionStage(mp, self)
	);
	mp.registerPapyrusFunction('method', 'ObjectReference', 'DamageObject', (self, args) => damageObject(mp, self, args));
	mp.registerPapyrusFunction('method', 'ObjectReference', 'ClearDestruction', (self) => clearDestruction(mp, self));
	mp.registerPapyrusFunction('global', 'ObjectReferenceEx', 'SetCurrentDestructionStage', (self, args) =>
		setCurrentDestructionStage(mp, self, args)
	);

	// mp.registerPapyrusFunction('method', 'ObjectReference', 'BlockActivation', (self, args) =>
	// 	blockActivation(mp, self, args)
	// );

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
	mp.registerPapyrusFunction('global', 'ObjectReferenceEx', 'PlaceAtMe', (self, args) => placeAtMe(mp, self, args));

	mp.registerPapyrusFunction('method', 'ObjectReference', 'GetDisplayName', (self) => getDisplayName(mp, self));
	mp.registerPapyrusFunction('method', 'ObjectReference', 'SetDisplayName', (self, args) =>
		setDisplayName(mp, self, args)
	);

	mp.registerPapyrusFunction('method', 'ObjectReference', 'GetWorldSpace', (self) => getWorldSpace(mp, self));
	// mp.registerPapyrusFunction('method', 'ObjectReference', 'Disable', (self) => disable(mp, self));
	mp.registerPapyrusFunction('method', 'ObjectReference', 'GetParentCell', (self) => getParentCell(mp, self));
	mp.registerPapyrusFunction('method', 'ObjectReference', 'IsInInterior', (self) => isInInterior(mp, self));
	mp.registerPapyrusFunction('method', 'ObjectReference', 'SetOpen', (self, args) => setOpen(mp, self, args));
	mp.registerPapyrusFunction('global', 'ObjectReferenceEx', 'GetLocationRef', (self, args) =>
		getLocationRef(mp, self, args)
	);
	mp.registerPapyrusFunction('global', 'ObjectReferenceEx', 'GetRespawnTime', (self, args) =>
		getRespawnTime(mp, self, args)
	);

	storage.register(mp);
	position.register(mp);

	IObjectReference.SetScale = (self: PapyrusObject, args: PapyrusValue[]) => setScale(mp, self, args);
	IObjectReference.GetScale = (self: PapyrusObject) => getScale(mp, self);
	IObjectReference.RemoveAllItems = (self: PapyrusObject, args: PapyrusValue[]) => removeAllItems(mp, self, args);
	IObjectReference.GetDistance = (self: PapyrusObject, args: PapyrusValue[]) => getDistance(mp, self, args);
	IObjectReference.MoveTo = (self: PapyrusObject, args: PapyrusValue[]) => moveTo(mp, self, args);
	IObjectReference.GetContainerForms = (self: PapyrusObject) => getContainerForms(mp, self);
	IObjectReference.GetCurrentDestructionStage = (self: PapyrusObject) => getCurrentDestructionStage(mp, self);
	IObjectReference.DamageObject = (self: PapyrusObject, args: PapyrusValue[]) => damageObject(mp, self, args);
	IObjectReference.ClearDestruction = (self: PapyrusObject) => clearDestruction(mp, self);
	IObjectReference.SetCurrentDestructionStage = (self: PapyrusObject, args: PapyrusValue[]) =>
		_setCurrentDestructionStage(mp, self, args);
	IObjectReference.BlockActivation = (self: PapyrusObject, args: PapyrusValue[]) => blockActivation(mp, self, args);
	IObjectReference.GetBaseObject = (self: PapyrusObject) => getBaseObject(mp, self);
	IObjectReference.PlaceAtMe = (self: PapyrusObject, args: PapyrusValue[]) => placeAtMeObj(mp, self, args);
	IObjectReference.GetDisplayName = (self: PapyrusObject) => getDisplayName(mp, self);
	IObjectReference.SetDisplayName = (self: PapyrusObject, args: PapyrusValue[]) => setDisplayName(mp, self, args);
	IObjectReference.GetWorldSpace = (self: PapyrusObject) => getWorldSpace(mp, self);
	IObjectReference.GetParentCell = (self: PapyrusObject) => getParentCell(mp, self);
	IObjectReference.IsInInterior = (self: PapyrusObject) => isInInterior(mp, self);
	IObjectReference.SetOpen = (self: PapyrusObject, args: PapyrusValue[]) => setOpen(mp, self, args);
	IObjectReference.GetStorageValue = (self: PapyrusObject, args: PapyrusValue[]) =>
		_getStorageValue(mp, self, args) as any;
	IObjectReference.SetStorageValue = (self: PapyrusObject, args: PapyrusValue[]) => _setStorageValue(mp, self, args);
	IObjectReference.SetPosition = (self: PapyrusObject, args: PapyrusValue[]) => setPosition(mp, self, args);
	IObjectReference.GetPositionX = (self: PapyrusObject) => getPositionX(mp, self);
	IObjectReference.GetPositionY = (self: PapyrusObject) => getPositionY(mp, self);
	IObjectReference.GetPositionZ = (self: PapyrusObject) => getPositionZ(mp, self);
	IObjectReference.SetAngle = (self: PapyrusObject, args: PapyrusValue[]) => setAngle(mp, self, args);
	IObjectReference.GetAngleX = (self: PapyrusObject) => getAngleX(mp, self);
	IObjectReference.GetAngleY = (self: PapyrusObject) => getAngleY(mp, self);
	IObjectReference.GetAngleZ = (self: PapyrusObject) => getAngleZ(mp, self);
	IObjectReference.AddItem = (self: PapyrusObject, args: PapyrusValue[]) => addItem(mp, self, args);
	IObjectReference.RemoveItem = (self: PapyrusObject, args: PapyrusValue[]) => removeItem(mp, self, args);
	IObjectReference.GetItemCount = (self: PapyrusObject, args: PapyrusValue[]) => getItemCount(mp, self, args);
	IObjectReference.GetRespawnTime = (args: PapyrusValue[]) => getRespawnTime(mp, null, args);
	IObjectReference.Disable = (self: PapyrusObject, args: PapyrusValue[]) => disable(mp, self, args);
	IObjectReference.GetLinkedDoorId = (self: PapyrusObject) => getLinkedDoorId(mp, null, [self]);
	IObjectReference.GetLinkedCellId = (self: PapyrusObject) => getLinkedCellId(mp, null, [self]);
};
