import { EspmLookupResult, Mp, PapyrusObject, PapyrusValue } from '../../types/mp';
import { setActorValue, getActorValue, damageActorValue, restoreActorValue, modActorValue } from './value';
import { addPerk, removePerk, hasPerk } from './perk';
import {
	isEquipped,
	equipItem,
	unequipItem,
	unequipAll,
	unequipItemSlot,
	getWornForms,
	getWornFormsId,
	getEquippedObject,
	getEquippedArmorInSlot,
	getEquippedShield,
	getEquippedWeapon,
	_getWornForms,
} from './equip';
import { getBoolean, getNumber, getObject } from '../../utils/papyrusArgs';
import { evalClient } from '../../properties/eval';
import { FunctionInfo } from '../../utils/functionInfo';
import { Ctx } from '../../types/ctx';
import { getForm } from '../game';
import { actorValues } from '../../properties/actor/actorValues/attributes';
import { getDisplayName } from '../objectReference';
import { getRaceHealth, getRaceStamina } from '../race';

const isWeaponDrawn = (mp: Mp, self: PapyrusObject) => !!mp.get(mp.getIdFromDesc(self.desc), 'isWeaponDrawn');
const isDead = (mp: Mp, self: PapyrusObject) => !!mp.get(mp.getIdFromDesc(self.desc), 'isDead');

const setOutfit = (mp: Mp, self: PapyrusObject, args: PapyrusValue[]) => {
	const selfId = mp.getIdFromDesc(self.desc);
	const outfit = getObject(args, 0);
	const outfitId = mp.getIdFromDesc(outfit.desc);

	// unequipAll(mp, self);
	const espmRecord = mp.lookupEspmRecordById(outfitId);
	const inam = espmRecord.record?.fields.find((x) => x.type === 'INAM')?.data;
	if (inam) {
		const dt = new DataView(inam.buffer);
		for (let index = 0; index < inam.length; index += 4) {
			const itemId = dt.getUint32(index, true);
			const form = getForm(mp, null, [itemId]);
			if (form) {
				const countExist = mp.callPapyrusFunction('method', 'ObjectReference', 'GetItemCount', self, [form]);
				if (countExist === 0) {
					mp.callPapyrusFunction('method', 'ObjectReference', 'AddItem', self, [form, 1, true]);
				}
				unequipItem(mp, self, [form, false, true]);
				equipItem(mp, self, [form, false, true]);
			}
		}
	}

	const sleepOutfit = getBoolean(args, 1);
	const func = (ctx: Ctx, outfitId: number, sleepOutfit: boolean) => {
		ctx.sp.once('update', async () => {
			if (!ctx.refr) return;
			const ac = ctx.sp.Actor.from(ctx.refr);
			if (!ac) return;
			const outfit = ctx.sp.Game.getForm(outfitId);
			if (!outfit) return;
			ac.setOutfit(ctx.sp.Outfit.from(outfit), sleepOutfit);
		});
	};
	evalClient(mp, selfId, new FunctionInfo(func).getText({ outfitId, sleepOutfit }), true);
};

const setRace = (mp: Mp, self: PapyrusObject, args: PapyrusValue[]) => {
	const selfId = mp.getIdFromDesc(self.desc);
	const race = getObject(args, 0);
	const raceId = mp.getIdFromDesc(race.desc);
	mp.set(selfId, 'race', raceId);
	const espmRecord = mp.lookupEspmRecordById(raceId) as EspmLookupResult;
	const hp = getRaceHealth(espmRecord);
	const stamina = getRaceStamina(espmRecord);
	actorValues.set(selfId, 'health', 'base', hp);
	actorValues.set(selfId, 'stamina', 'base', stamina);
};

const getRace = (mp: Mp, self: PapyrusObject) => {
	const selfId = mp.getIdFromDesc(self.desc);
	const raceId = mp.get<number>(selfId, 'race');
	if (!raceId) return;
	return getForm(mp, null, [raceId]);
};

const setWorldOrCell = (mp: Mp, selfNull: null, args: PapyrusValue[]) => {
	const self = getObject(args, 0);
	const selfId = mp.getIdFromDesc(self.desc);
	const worldOrCell = getNumber(args, 1);

	mp.set(selfId, 'worldOrCellDesc', mp.getDescFromId(worldOrCell));
};

const _throwOut = (mp: Mp, self: PapyrusObject) => {
	const selfId = mp.getIdFromDesc(self.desc);
	console.log('npc remove', selfId, getDisplayName(mp, self));
	throwOutById(mp, selfId);
};
const throwOut = (mp: Mp, selfNull: null, args: PapyrusValue[]) => {
	const self = getObject(args, 0);
	_throwOut(mp, self);
};
export const throwOutById = (mp: Mp, selfId: number) => {
	mp.set(selfId, 'pos', [-99_999, -99_999, -99_999]);
	mp.set(selfId, 'isDead', true);
	try {
		actorValues.set(selfId, 'health', 'base', 0);
	} catch {}
	if (selfId >= 0xff000000) {
		try {
			mp.set(selfId, 'isDisabled', true);
		} catch {}
	}
	mp.set(selfId, 'worldOrCellDesc', '0');
};

// TODO: Convert As Perk don't work, user M.AsPerk in papyrus scripts
export const register = (mp: Mp): void => {
	// mp.registerPapyrusFunction('method', 'Actor', 'GetDisplayName', (self) => getDisplayName(mp, self));

	mp.registerPapyrusFunction('method', 'Actor', 'AddPerk', (self, args) => addPerk(mp, self, args));
	mp.registerPapyrusFunction('method', 'Actor', 'RemovePerk', (self, args) => removePerk(mp, self, args));
	mp.registerPapyrusFunction('method', 'Actor', 'HasPerk', (self, args) => hasPerk(mp, self, args));

	mp.registerPapyrusFunction('method', 'Actor', 'IsEquipped', (self, args) => isEquipped(mp, self, args));
	mp.registerPapyrusFunction('method', 'Actor', 'EquipItem', (self, args) => equipItem(mp, self, args));
	// mp.registerPapyrusFunction('method', 'Actor', 'EquipItemEx', (self, args) => equipItemEx(mp, self, args));
	// mp.registerPapyrusFunction('method', 'Actor', 'EquipItemById', (self, args) => equipItemById(mp, self, args));
	mp.registerPapyrusFunction('method', 'Actor', 'UnequipItem', (self, args) => unequipItem(mp, self, args));
	// mp.registerPapyrusFunction('method', 'Actor', 'UnequipItemEx', (self, args) => unequipItemEx(mp, self, args));
	mp.registerPapyrusFunction('method', 'Actor', 'UnequipAll', (self) => unequipAll(mp, self));
	mp.registerPapyrusFunction('method', 'Actor', 'UnequipItemSlot', (self, args) => unequipItemSlot(mp, self, args));
	// mp.registerPapyrusFunction('method', 'Actor', 'GetEquippedItemType', (self, args) => getEquippedItemType(mp, self, args));
	mp.registerPapyrusFunction('method', 'Actor', 'GetEquippedObject', (self, args) => getEquippedObject(mp, self, args));
	mp.registerPapyrusFunction('method', 'Actor', 'GetEquippedArmorInSlot', (self, args) =>
		getEquippedArmorInSlot(mp, self, args)
	);
	mp.registerPapyrusFunction('method', 'Actor', 'GetEquippedShield', (self) => getEquippedShield(mp, self));
	mp.registerPapyrusFunction('method', 'Actor', 'GetEquippedWeapon', (self, args) => getEquippedWeapon(mp, self, args));

	mp.registerPapyrusFunction('method', 'Actor', 'SetActorValue', (self, args) => setActorValue(mp, self, args));
	mp.registerPapyrusFunction('method', 'Actor', 'SetAV', (self, args) => setActorValue(mp, self, args));
	mp.registerPapyrusFunction('method', 'Actor', 'GetActorValue', (self, args) => getActorValue(mp, self, args));
	mp.registerPapyrusFunction('method', 'Actor', 'GetAV', (self, args) => getActorValue(mp, self, args));
	mp.registerPapyrusFunction('method', 'Actor', 'DamageActorValue', (self, args) => damageActorValue(mp, self, args));
	mp.registerPapyrusFunction('method', 'Actor', 'DamageAV', (self, args) => damageActorValue(mp, self, args));
	mp.registerPapyrusFunction('method', 'Actor', 'RestoreActorValue', (self, args) => restoreActorValue(mp, self, args));
	mp.registerPapyrusFunction('method', 'Actor', 'RestoreAV', (self, args) => restoreActorValue(mp, self, args));
	mp.registerPapyrusFunction('method', 'Actor', 'ModActorValue', (self, args) => modActorValue(mp, self, args));
	mp.registerPapyrusFunction('method', 'Actor', 'ModAV', (self, args) => modActorValue(mp, self, args));

	// mp.registerPapyrusFunction('method', 'Actor', 'DrawWeapon', (self) => drawWeapon(mp, self));
	mp.registerPapyrusFunction('method', 'Actor', 'IsWeaponDrawn', (self) => isWeaponDrawn(mp, self));
	mp.registerPapyrusFunction('method', 'Actor', 'IsDead', (self) => isDead(mp, self));
	// mp.registerPapyrusFunction('method', 'Actor', 'PlayIdle', (self, args) => playIdle(mp, self, args));
	mp.registerPapyrusFunction('method', 'Actor', 'SetOutfit', (self, args) => setOutfit(mp, self, args));
	mp.registerPapyrusFunction('method', 'Actor', 'SetRace', (self, args) => setRace(mp, self, args));
	mp.registerPapyrusFunction('method', 'Actor', 'GetRace', (self) => getRace(mp, self));

	mp.registerPapyrusFunction('global', 'ActorEx', 'GetWornForms', (self, args) => getWornForms(mp, self, args));
	mp.registerPapyrusFunction('global', 'ActorEx', 'GetWornFormsId', (self, args) => getWornFormsId(mp, self, args));
	mp.registerPapyrusFunction('global', 'ActorEx', 'SetWorldOrCell', (self, args) => setWorldOrCell(mp, self, args));

	mp.registerPapyrusFunction('global', 'ActorEx', 'ThrowOut', (self, args) => throwOut(mp, self, args));
};
