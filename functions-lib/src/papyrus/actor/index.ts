/* eslint-disable no-empty */
import { EspmLookupResult, Mp, PapyrusObject, PapyrusValue } from '../../types/mp';
import {
	setActorValue,
	getActorValue,
	damageActorValue,
	restoreActorValue,
	modActorValue,
	getActorValuePercentage,
} from './value';
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
import { getBaseObjectId, getDisplayName } from '../objectReference';
import { IActor } from '../../..';
import { getRaceHealth, getRaceStamina } from '../race';
import { uint32 } from '../../utils/helper';

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

	if (!raceId) {
		const baseId = getBaseObjectId(mp, null, [self]);

		if (baseId) {
			const espmRecord = mp.lookupEspmRecordById(baseId);
			const rnam = espmRecord.record?.fields.find((x) => x.type === 'RNAM')?.data;

			if (rnam) {
				const raceId = uint32(rnam.buffer, 0);
				return getForm(mp, null, [raceId]);
			}
		}

		return;
	}

	return getForm(mp, null, [raceId]);
};

const isHuman = (mp: Mp, self: PapyrusObject): boolean => {
	const race = getRace(mp, self);

	if (!race) return false;

	const raceId: number = mp.getIdFromDesc(race.desc);

	const humanRaces = [
		0x13740, 0x13741, 0x13742, 0x13743, 0x13744, 0x13745, 0x13746, 0x13747, 0x13748, 0x13749, 0x2c659, 0x2c65a, 0x2c65b,
		0x2c65c, 0x67cd8, 0x7eaf3, 0x88794, 0x8883a, 0x8883c, 0x8883d, 0x88840, 0x88844, 0x88845, 0x88846, 0x88884, 0x97a3d,
		0xa82b9, 0xa82ba,
	];

	return humanRaces.includes(raceId);
};

const setWorldOrCell = (mp: Mp, selfNull: null, args: PapyrusValue[]) => {
	const self = getObject(args, 0);
	const selfId = mp.getIdFromDesc(self.desc);
	const worldOrCell = getNumber(args, 1);

	mp.set(selfId, 'worldOrCellDesc', mp.getDescFromId(worldOrCell));
};

const kill = (mp: Mp, self: PapyrusObject, args: PapyrusValue[]) => {
	const selfId = mp.getIdFromDesc(self.desc);
	const killer = args[0] ? getObject(args, 0) : null;
	const killerId = killer ? mp.getIdFromDesc(killer.desc) : undefined;

	damageActorValue(mp, self, ['health', 99999]);
	mp.set(selfId, 'isDead', true);
	if (mp.onDeath) mp.onDeath(selfId, killerId);
};

const resurrect = (mp: Mp, self: PapyrusObject) => {
	const selfId = mp.getIdFromDesc(self.desc);
	restoreActorValue(mp, self, ['health', 99999]);
	restoreActorValue(mp, self, ['magicka', 99999]);
	restoreActorValue(mp, self, ['stamina', 99999]);

	mp.set(selfId, 'isDead', false);
	if (mp.onResurrect) mp.onResurrect(selfId);
};

export const throwOutById = (mp: Mp, selfId: number): void => {
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
const _throwOut = (mp: Mp, self: PapyrusObject) => {
	const selfId = mp.getIdFromDesc(self.desc);
	console.log('npc remove', selfId, getDisplayName(mp, self));
	throwOutById(mp, selfId);
};
const throwOut = (mp: Mp, selfNull: null, args: PapyrusValue[]) => {
	const self = getObject(args, 0);
	_throwOut(mp, self);
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
	mp.registerPapyrusFunction('method', 'Actor', 'GetActorValuePercentage', (self, args) =>
		getActorValuePercentage(mp, self, args)
	);
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

	mp.registerPapyrusFunction('method', 'Actor', 'Kill', (self, args) => kill(mp, self, args));
	mp.registerPapyrusFunction('method', 'Actor', 'Resurrect', (self) => resurrect(mp, self));

	// TODO: temp solve, try to use ActorValueInfo
	// mp.registerPapyrusFunction('global', 'ActorEx', 'AddSkillExperience', (self, args) =>
	// 	addSkillExperience(mp, self, args)
	// );
	mp.registerPapyrusFunction('global', 'ActorEx', 'GetWornForms', (self, args) => getWornForms(mp, self, args));
	mp.registerPapyrusFunction('global', 'ActorEx', 'GetWornFormsId', (self, args) => getWornFormsId(mp, self, args));
	mp.registerPapyrusFunction('global', 'ActorEx', 'SetWorldOrCell', (self, args) => setWorldOrCell(mp, self, args));

	mp.registerPapyrusFunction('global', 'ActorEx', 'ThrowOut', (self, args) => throwOut(mp, self, args));

	IActor.AddPerk = (self: PapyrusObject, args: PapyrusValue[]) => addPerk(mp, self, args);
	IActor.RemovePerk = (self: PapyrusObject, args: PapyrusValue[]) => removePerk(mp, self, args);
	IActor.HasPerk = (self: PapyrusObject, args: PapyrusValue[]) => hasPerk(mp, self, args);
	IActor.IsEquipped = (self: PapyrusObject, args: PapyrusValue[]) => isEquipped(mp, self, args);
	IActor.IsHuman = (self: PapyrusObject) => isHuman(mp, self);
	IActor.EquipItem = (self: PapyrusObject, args: PapyrusValue[]) => equipItem(mp, self, args);
	IActor.UnequipItem = (self: PapyrusObject, args: PapyrusValue[]) => unequipItem(mp, self, args);
	IActor.UnequipAll = (self: PapyrusObject) => unequipAll(mp, self);
	IActor.UnequipItemSlot = (self: PapyrusObject, args: PapyrusValue[]) => unequipItemSlot(mp, self, args);
	IActor.GetEquippedObject = (self: PapyrusObject, args: PapyrusValue[]) => getEquippedObject(mp, self, args);
	IActor.GetEquippedShield = (self: PapyrusObject) => getEquippedShield(mp, self);
	IActor.GetEquippedWeapon = (self: PapyrusObject, args: PapyrusValue[]) => getEquippedWeapon(mp, self, args);
	IActor.SetActorValue = (self: PapyrusObject, args: PapyrusValue[]) => setActorValue(mp, self, args);
	IActor.GetActorValue = (self: PapyrusObject, args: PapyrusValue[]) => getActorValue(mp, self, args);
	IActor.GetActorValuePercentage = (self: PapyrusObject, args: PapyrusValue[]) =>
		getActorValuePercentage(mp, self, args);
	IActor.DamageActorValue = (self: PapyrusObject, args: PapyrusValue[]) => damageActorValue(mp, self, args);
	IActor.RestoreActorValue = (self: PapyrusObject, args: PapyrusValue[]) => restoreActorValue(mp, self, args);
	IActor.ModActorValue = (self: PapyrusObject, args: PapyrusValue[]) => modActorValue(mp, self, args);
	IActor.IsWeaponDrawn = (self: PapyrusObject) => isWeaponDrawn(mp, self);
	IActor.IsDead = (self: PapyrusObject) => isDead(mp, self);
	IActor.SetOutfit = (self: PapyrusObject, args: PapyrusValue[]) => setOutfit(mp, self, args);
	IActor.SetRace = (self: PapyrusObject, args: PapyrusValue[]) => setRace(mp, self, args);
	IActor.GetRace = (self: PapyrusObject) => getRace(mp, self);
	IActor.GetWornForms = (self: PapyrusObject) => _getWornForms(mp, self);
	// IActor.getWornFormsId = (self: PapyrusObject, args: PapyrusValue[]) => getWornFormsId(mp, self, args);
	IActor.SetWorldOrCell = (args: PapyrusValue[]) => setWorldOrCell(mp, null, args);
	IActor.ThrowOut = (self: PapyrusObject) => _throwOut(mp, self);
	IActor.Kill = (self: PapyrusObject, args: PapyrusValue[]) => kill(mp, self, args);
	IActor.Resurrect = (self: PapyrusObject) => resurrect(mp, self);
};
