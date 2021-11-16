import { Mp, PapyrusObject } from '../types/mp';
import { FunctionInfo } from '../utils/functionInfo';
import { onEquip, onUnequip } from './functions';
import * as m from '../modules';
import { logExecuteTime } from './shared';
import { WeaponType } from '../papyrus/weapon/type';
import { getBaseArmorById, getSlotById } from '../papyrus/armor';
import { getBaseDamageById, getWeaponTypeById } from '../papyrus/weapon';
import { _getSignature } from '../papyrus/form/index';

const addArmor = (mp: Mp, actor: number, target: number): void => {
	const targetArmorValue: number = getBaseArmorById(mp, target);

	if (!targetArmorValue || targetArmorValue === 0) return;

	const oldArmorValue = mp.get<number>(actor, 'armorValue') ?? 0;
	const armorValue = (oldArmorValue > 0 ? oldArmorValue : 0) + targetArmorValue;

	mp.set(actor, 'armorValue', armorValue);

	if (getSlotById(mp, target).includes(39)) {
		mp.set(actor, 'shieldValue', targetArmorValue);
	}
};

const removeArmor = (mp: Mp, actor: number, target: number): void => {
	const targetArmorValue: number = getBaseArmorById(mp, target);

	if (!targetArmorValue || targetArmorValue === 0) return;

	const armorValue = (mp.get<number>(actor, 'armorValue') ?? 0) - targetArmorValue;

	mp.set(actor, 'armorValue', armorValue);

	if (getSlotById(mp, target).includes(39)) {
		mp.set(actor, 'shieldValue', 0);
	}
};

const addWeapon = (mp: Mp, actor: number, target: number): void => {
	const targetWeaponDamage: number = getBaseDamageById(mp, target);

	if (!targetWeaponDamage || targetWeaponDamage === 0) return;

	mp.set(actor, 'weaponDamage', targetWeaponDamage);
	mp.set(actor, 'weaponType', 'other');

	const weaponType: WeaponType = getWeaponTypeById(mp, target);

	if (weaponType === WeaponType.BattleaxesANDWarhammers || weaponType === WeaponType.Maces) {
		mp.set(actor, 'weaponType', 'hammer');
	}

	/*
	const weaponEquipment: Equipment | undefined = getEquipment(mp, actor);

	if (!weaponEquipment) {
		mp.set(actor, 'weaponDamage', 0);
		mp.set(actor, 'weaponType', 'hands');
		return;
	}

	const weapon: InventoryItemEq[] = weaponEquipment?.inv.entries.filter(
		(item: InventoryItemEq) => item.type && item.type === 'WEAP'
	);

	if (!weapon || weapon === [] || !weapon[0]) {
		mp.set(actor, 'weaponDamage', 0);
		mp.set(actor, 'weaponType', 'hands');
		return;
	}

	// Урон
	const weaponDamage = weapon[0].baseDamage ?? 4;

	mp.set(actor, 'weaponDamage', weaponDamage);
	mp.set(actor, 'weaponType', 'other');

	if (weapon[0].weaponType === WeaponType.BattleaxesANDWarhammers || weapon[0].weaponType === WeaponType.Maces) {
		mp.set(actor, 'weaponType', 'hammer');
	}

	*/
};

const removeWeapon = (mp: Mp, actor: number): void => {
	mp.set(actor, 'weaponDamage', 0);
	mp.set(actor, 'weaponType', 'hands');
};

export const register = (mp: Mp): void => {
	mp.makeEventSource('_onEquip', new FunctionInfo(onEquip).tryCatch());

	mp._onEquip = (pcFormId: number, event: { actor: number; target: number; player: number }) => {
		const start = Date.now();
		if (!pcFormId) return console.log('Plz reconnect');

		if (event.actor === 0x14) {
			event.actor = pcFormId;
		}

		if (event.actor === 0 || event.target === 0) return;

		const ac: PapyrusObject = { type: 'form', desc: mp.getDescFromId(event.actor) };
		const target: PapyrusObject = { type: 'espm', desc: mp.getDescFromId(event.target) };

		// if (serverOptionProvider.getServerOptionsValue(['enableALCHeffect'])) {
		// 	const rec = mp.lookupEspmRecordById(event.target).record;
		// 	if (rec && rec?.type === 'ALCH') {
		// 		const mges = getObjectArray([potion.getMagicEffects(mp, target)], 0);
		// 		mges.forEach((m) => {
		// 			const id = mp.getIdFromDesc(m.desc);
		// 			const f = getForm(mp, null, [id]);
		// 			if (!f) return;
		// 			const hitShader = magicEffect.getHitShader(mp, f);
		// 			if (!hitShader) return;
		// 			effectShader.play(mp, hitShader, [ac, 5]);
		// 		});

		// 		// console.log('ALCHeffect', pcFormId, event.actor);
		// 		// if (pcFormId === event.actor) {
		// 		//   const f = getForm(mp, null, [event.target]);
		// 		//   if (f) equipItem(mp, ac, [event.target]);
		// 		//   // potion.equip(mp, ac, [event.target]);
		// 		// }
		// 	}
		// }

		const signature = _getSignature(mp, event.target);
		if (signature === 'WEAP') {
			addWeapon(mp, event.actor, event.target);
		} else if (signature === 'ARMO') {
			addArmor(mp, event.actor, event.target);
		}

		mp.modules.forEach((module) => {
			try {
				if (!module.onEquip) return;
				const s = Date.now();
				module.onEquip(new m.Actor(ac), new m.Form(target));
				logExecuteTime(s, `${module.name}.onEquip`);
			} catch (err) {
				console.error(`error in module ${module.name} onEquip`, err);
			}
		});

		mp.callPapyrusFunction('global', 'GM_Main', '_onEquip', null, [ac, target]);

		logExecuteTime(start, '_onEquip');
	};

	mp.makeEventSource('_onUnequip', new FunctionInfo(onUnequip).tryCatch());

	mp._onUnequip = (pcFormId: number, event: { actor: number; target: number; player: number }) => {
		const start = Date.now();
		if (!pcFormId) return console.log('Plz reconnect');

		if (event.actor === 0x14) {
			event.actor = pcFormId;
		}

		if (event.actor === 0 || event.target === 0) return;

		// const ac: PapyrusObject = { type: 'form', desc: mp.getDescFromId(event.actor) };
		// const target: PapyrusObject = { type: 'espm', desc: mp.getDescFromId(event.target) };

		// if (serverOptionProvider.getServerOptionsValue(['enableALCHeffect'])) {
		// 	const rec = mp.lookupEspmRecordById(event.target).record;
		// 	if (rec && rec?.type === 'ALCH') {
		// 		const mges = getObjectArray([potion.getMagicEffects(mp, target)], 0);
		// 		mges.forEach((m) => {
		// 			const id = mp.getIdFromDesc(m.desc);
		// 			const f = getForm(mp, null, [id]);
		// 			if (!f) return;
		// 			const hitShader = magicEffect.getHitShader(mp, f);
		// 			if (!hitShader) return;
		// 			effectShader.play(mp, hitShader, [ac, 5]);
		// 		});

		// 		// console.log('ALCHeffect', pcFormId, event.actor);
		// 		// if (pcFormId === event.actor) {
		// 		//   const f = getForm(mp, null, [event.target]);
		// 		//   if (f) equipItem(mp, ac, [event.target]);
		// 		//   // potion.equip(mp, ac, [event.target]);
		// 		// }
		// 	}
		// }

		const signature = _getSignature(mp, event.target);
		if (signature === 'WEAP') {
			removeWeapon(mp, event.actor);
		} else if (signature === 'ARMO') {
			removeArmor(mp, event.actor, event.target);
		}

		// mp.modules.forEach((module) => {
		// 	try {
		// 		if (!module.onUnequip) return;
		// 		const s = Date.now();
		// 		module.onUnequip(new m.Actor(ac), new m.Form(target));
		// 		logExecuteTime(s, `${module.name}.onEquip`);
		// 	} catch (err) {
		// 		console.error(`error in module ${module.name} onEquip`, err);
		// 	}
		// });

		// mp.callPapyrusFunction('global', 'GM_Main', '_onUnquip', null, [ac, target]);

		logExecuteTime(start, '_onUnequip');
	};
};
