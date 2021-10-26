import { IWeapon } from '../../..';
import { EspmLookupResult, Mp, PapyrusObject } from '../../types/mp';
import { uint16, uint32 } from '../../utils/helper';
import { WeaponLocation, WeaponType } from './type';

export const getWeaponTypeById = (
	mp: Mp,
	selfId: number,
	espmRecord?: EspmLookupResult | Partial<EspmLookupResult>
): any => {
	if (!espmRecord) espmRecord = mp.lookupEspmRecordById(selfId);

	const kwda = espmRecord.record?.fields.find((x) => x.type === 'KWDA')?.data;
	const keywords: number[] = [];
	if (!kwda) return WeaponType.Fists;

	const dataView = new DataView(kwda.buffer);
	for (let i = 0; i < dataView.byteLength; i += 4) {
		keywords.push(dataView.getUint32(i, true));
	}
	if (keywords.includes(0x1e711)) {
		return WeaponType.Swords;
	}
	if (keywords.includes(0x6d931)) {
		return WeaponType.Greatswords;
	}
	if (keywords.includes(0x1e713)) {
		return WeaponType.Daggers;
	}
	if (keywords.includes(0x6d932) || keywords.includes(0x6d930)) {
		return WeaponType.BattleaxesANDWarhammers;
	}
	if (keywords.includes(0x1e714)) {
		return WeaponType.Maces;
	}
	if (keywords.includes(0x1e712)) {
		return WeaponType.WarAxes;
	}
	if (keywords.includes(0x1e715)) {
		return WeaponType.Bows;
	}
	if (keywords.includes(0x1e716)) {
		return WeaponType.Staff;
	}
	if (keywords.includes(-1)) {
		// TODO: find crossbow keyword ID
		return WeaponType.Crossbows;
	}
};
export const getWeaponType = (mp: Mp, self: PapyrusObject): any => {
	const selfId = mp.getIdFromDesc(self.desc);
	return getWeaponTypeById(mp, selfId);
};

export const getBaseDamageById = (
	mp: Mp,
	selfId: number,
	espmRecord?: EspmLookupResult | Partial<EspmLookupResult>
): number => {
	if (!espmRecord) espmRecord = mp.lookupEspmRecordById(selfId);

	const data = espmRecord.record?.fields.find((x) => x.type === 'DATA')?.data;
	if (!data) return 0;

	const damage = uint16(data.buffer, 8);

	return damage;
};
export const getBaseDamage = (mp: Mp, self: PapyrusObject): number => {
	const selfId = mp.getIdFromDesc(self.desc);
	return getBaseDamageById(mp, selfId);
};

export const getLocationById = (
	mp: Mp,
	selfId: number,
	espmRecord?: EspmLookupResult | Partial<EspmLookupResult>
): WeaponLocation => {
	if (!espmRecord) espmRecord = mp.lookupEspmRecordById(selfId);

	const etype = espmRecord.record?.fields.find((x) => x.type === 'ETYP')?.data;
	if (!etype) return WeaponLocation.RightHand;

	const etypeId = mp.lookupEspmRecordById(uint32(etype.buffer, 0));
	if (!etypeId) return WeaponLocation.RightHand;

	const edidEquipSlot = etypeId.record?.editorId;
	if (edidEquipSlot === 'LeftHand') return WeaponLocation.LeftHand;
	// if (edidEquipSlot === 'RightHand') return WeaponLocation.RightHand;

	return WeaponLocation.RightHand;
};

export const register = (mp: Mp): void => {
	mp.registerPapyrusFunction('method', 'Weapon', 'GetWeaponType', (self) => getWeaponType(mp, self));
	mp.registerPapyrusFunction('method', 'Weapon', 'GetBaseDamage', (self) => getBaseDamage(mp, self));

	IWeapon.GetWeaponType = (self: PapyrusObject) => getWeaponType(mp, self);
	IWeapon.GetBaseDamage = (self: PapyrusObject) => getBaseDamage(mp, self);
};
