import { evalClient } from '../../properties/eval';
import { Ctx } from '../../types/ctx';
import { Mp, PapyrusObject, PapyrusValue } from '../../types/mp';
import { FunctionInfo } from '../../utils/functionInfo';
import { getObject, getBoolean, getNumber } from '../../utils/papyrusArgs';
import { getBaseArmorById, getSlotById } from '../armor';
import { getWeightById } from '../form';
import { getForm } from '../game';
import { getBaseDamageById, getLocationById, getWeaponTypeById } from '../weapon';
import { WeaponType } from '../weapon/type';

interface InventoryEq {
	entries: InventoryItemEq[];
}
interface InventoryItemEq {
	baseId: number;
	count: number;
	worn: boolean;
	weight?: number;
	slot?: number[];
	location?: number;
	type?: string;
	baseDamage?: number;
	weaponType?: WeaponType;
	baseArmor?: number;
}
interface Equipment {
	inv: InventoryEq;
	numChanges: number;
}

interface GetEquipmentOption {
	mapWEAP?: boolean;
	mapARMO?: boolean;
}

export const getEquipment = (
	mp: Mp,
	selfId: number,
	opt: GetEquipmentOption = { mapARMO: true, mapWEAP: true }
): Equipment | undefined => {
	if (opt.mapWEAP === undefined) opt.mapWEAP = true;
	if (opt.mapARMO === undefined) opt.mapARMO = true;

	const eq = mp.get(selfId, 'equipment') as Equipment;
	if (!eq) return;

	if (!opt.mapWEAP && !opt.mapARMO) return eq;

	eq.inv.entries = eq.inv.entries
		.filter((x) => x.worn)
		.map((x) => {
			const rec = mp.lookupEspmRecordById(x.baseId);
			if (!rec.record) return x;

			x.type = rec.record.type;
			x.weight = getWeightById(mp, x.baseId);

			switch (true) {
				case rec.record.type === 'WEAP' && opt.mapWEAP:
					x.location = getLocationById(mp, x.baseId, rec);
					x.baseDamage = getBaseDamageById(mp, x.baseId, rec);
					x.weaponType = getWeaponTypeById(mp, x.baseId, rec);
					break;

				case rec.record.type === 'ARMO' && opt.mapARMO:
					x.baseArmor = getBaseArmorById(mp, x.baseId, rec);
					x.slot = getSlotById(mp, x.baseId, rec);
					break;

				default:
					break;
			}
			return x;
		});

	return eq;
};

export const equipItem = (mp: Mp, self: PapyrusObject, args: PapyrusValue[]) => {
	const selfId = mp.getIdFromDesc(self.desc);
	const item = getObject(args, 0);
	const itemId = mp.getIdFromDesc(item.desc);
	const preventRemoval = getBoolean(args, 1);
	const silent = getBoolean(args, 2);

	const countExist = mp.callPapyrusFunction('method', 'ObjectReference', 'GetItemCount', self, [item]);

	if (countExist === 0) {
		// TODO: don`t work with default args
		// * mp.callPapyrusFunction('method', 'Actor', 'AddItem', self, [item]) don`t work
		mp.callPapyrusFunction('method', 'ObjectReference', 'AddItem', self, [item, 1, true]);
	}

	const func = (ctx: Ctx, itemId: number, preventRemoval: boolean, silent: boolean) => {
		(() => {
			if (!ctx.refr) return;
			const ac = ctx.sp.Actor.from(ctx.refr);
			const form = ctx.sp.Game.getFormEx(itemId);
			ac?.equipItem(form, preventRemoval, silent);
		})();
	};
	evalClient(mp, selfId, new FunctionInfo(func).getText({ itemId, preventRemoval, silent }));

	if (!silent) {
		//notification
	}
};

export const equipItemEx = (mp: Mp, self: PapyrusObject, args: PapyrusValue[]) => {
	const selfId = mp.getIdFromDesc(self.desc);
	const item = getObject(args, 0);
	const itemId = mp.getIdFromDesc(item.desc);
	const slot = args[1] ? getNumber(args, 1) : 0;
	const preventUnequip = args[2] ? getBoolean(args, 2) : false;
	const equipSound = args[3] ? getBoolean(args, 3) : true;

	const func = (ctx: Ctx, itemId: number, slot: number, preventUnequip: boolean, equipSound: boolean) => {
		ctx.sp.once('update', () => {
			if (!ctx.refr) return;
			const ac = ctx.sp.Actor.from(ctx.refr);
			const form = ctx.sp.Game.getFormEx(itemId);
			ac?.equipItemEx(form, slot, preventUnequip, equipSound);
		});
	};
	evalClient(mp, selfId, new FunctionInfo(func).getText({ itemId, slot, preventUnequip, equipSound }));

	if (!equipSound) {
		// sound
	}
};

export const equipItemById = (mp: Mp, self: PapyrusObject, args: PapyrusValue[]) => {};

// TODO: not correct work boolean return
export const isEquipped = (mp: Mp, self: PapyrusObject, args: PapyrusValue[]): boolean => {
	const selfId = mp.getIdFromDesc(self.desc);
	const item = getObject(args, 0);
	const itemId = mp.getIdFromDesc(item.desc);

	const eq = getEquipment(mp, selfId);
	if (!eq) return false;
	return eq.inv.entries.findIndex((item) => item.baseId === itemId && item.worn) >= 0;
};

export const unequipItem = (mp: Mp, self: PapyrusObject, args: PapyrusValue[]) => {
	const selfId = mp.getIdFromDesc(self.desc);
	const item = getObject(args, 0);
	const itemId = mp.getIdFromDesc(item.desc);
	const preventRemoval = args[1] ? getBoolean(args, 1) : false;
	const silent = args[2] ? getBoolean(args, 2) : false;

	const func = (ctx: Ctx, itemId: number, preventRemoval: boolean, silent: boolean) => {
		ctx.sp.once('update', () => {
			if (!ctx.refr) return;
			const ac = ctx.sp.Actor.from(ctx.refr);
			const form = ctx.sp.Game.getFormEx(itemId);
			ac?.unequipItem(form, preventRemoval, silent);
		});
	};
	evalClient(mp, selfId, new FunctionInfo(func).getText({ itemId, preventRemoval, silent }));

	if (!silent) {
		//notification
	}
};

export const unequipItemEx = (mp: Mp, self: PapyrusObject, args: PapyrusValue[]) => {
	const selfId = mp.getIdFromDesc(self.desc);
	const item = getObject(args, 0);
	const itemId = mp.getIdFromDesc(item.desc);
	const slot = args[1] ? getNumber(args, 1) : 0;
	const preventEquip = args[2] ? getBoolean(args, 2) : false;

	const func = (ctx: Ctx, itemId: number, slot: number, preventEquip: boolean) => {
		ctx.sp.once('update', () => {
			if (!ctx.refr) return;
			const ac = ctx.sp.Actor.from(ctx.refr);
			const form = ctx.sp.Game.getFormEx(itemId);
			ac?.unequipItemEx(form, slot, preventEquip);
		});
	};
	evalClient(mp, selfId, new FunctionInfo(func).getText({ itemId, slot, preventEquip }));
};

export const unequipAll = (mp: Mp, self: PapyrusObject) => {
	const selfId = mp.getIdFromDesc(self.desc);

	const func = (ctx: Ctx) => {
		ctx.sp.once('update', () => {
			if (!ctx.refr) return;
			const ac = ctx.sp.Actor.from(ctx.refr);
			ac?.unequipAll();
		});
	};
	evalClient(mp, selfId, new FunctionInfo(func).getText());
};

export const unequipItemSlot = (mp: Mp, self: PapyrusObject, args: PapyrusValue[]) => {
	const selfId = mp.getIdFromDesc(self.desc);
	const slotId = getNumber(args, 0);

	const func = (ctx: Ctx, slotId: number) => {
		ctx.sp.once('update', () => {
			if (!ctx.refr) return;
			const ac = ctx.sp.Actor.from(ctx.refr);
			ac?.unequipItemSlot(slotId);
		});
	};
	evalClient(mp, selfId, new FunctionInfo(func).getText({ slotId }));
};

export const getEquippedItemType = (mp: Mp, self: PapyrusObject, args: PapyrusValue[]) => {
	const selfId = mp.getIdFromDesc(self.desc);
	const hand = getNumber(args, 0);
};

export const _getWornForms = (mp: Mp, self: PapyrusObject): PapyrusObject[] => {
	const selfId = mp.getIdFromDesc(self.desc);
	const eq = getEquipment(mp, selfId);
	return eq?.inv.entries
		.filter((x) => x.worn)
		.map((x) => getForm(mp, null, [x.baseId]))
		.filter((x) => x) as PapyrusObject[];
};
export const getWornForms = (mp: Mp, selfNull: null, args: PapyrusValue[]): PapyrusObject[] => {
	const self = getObject(args, 0);
	return _getWornForms(mp, self);
};

export const getWornFormsId = (mp: Mp, selfNull: null, args: PapyrusValue[]): number[] | undefined => {
	const selfId = mp.getIdFromDesc(getObject(args, 0).desc);
	const eq = getEquipment(mp, selfId);
	return eq?.inv.entries.filter((x) => x.worn).map((x) => x.baseId);
};

export const getEquippedObject = (mp: Mp, self: PapyrusObject, args: PapyrusValue[]): PapyrusObject | undefined => {
	const selfId = mp.getIdFromDesc(self.desc);
	const loc = getNumber(args, 0);
	const eq = getEquipment(mp, selfId, { mapARMO: false });
	const baseId = eq?.inv.entries.find((x) => x.location === loc)?.baseId;
	if (baseId) return getForm(mp, null, [baseId]);
};

export const getEquippedArmorInSlot = (
	mp: Mp,
	self: PapyrusObject,
	args: PapyrusValue[]
): PapyrusObject | undefined => {
	const selfId = mp.getIdFromDesc(self.desc);
	const slot = getNumber(args, 0);
	const eq = getEquipment(mp, selfId, { mapWEAP: false });
	const baseId = eq?.inv.entries.find((x) => x.slot?.includes(slot))?.baseId;
	if (baseId) return getForm(mp, null, [baseId]);
};

export const getEquippedShield = (mp: Mp, self: PapyrusObject): PapyrusObject | undefined => {
	const selfId = mp.getIdFromDesc(self.desc);
	const eq = getEquipment(mp, selfId, { mapWEAP: false });
	const baseId = eq?.inv.entries.find((x) => x.slot?.includes(39))?.baseId;
	if (baseId) return getForm(mp, null, [baseId]);
};

export const getEquippedWeapon = (mp: Mp, self: PapyrusObject, args: PapyrusValue[]): PapyrusObject | undefined => {
	const selfId = mp.getIdFromDesc(self.desc);
	const isLeftHand = getBoolean(args, 0);
	const loc = isLeftHand ? 0 : 1;
	const eq = getEquipment(mp, selfId, { mapARMO: false });
	const baseId = eq?.inv.entries.find((x) => x.location === loc)?.baseId;
	if (baseId) return getForm(mp, null, [baseId]);
};
