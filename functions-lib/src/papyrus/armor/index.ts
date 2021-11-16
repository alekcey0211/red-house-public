import { IArmor } from '../../..';
import { EspmLookupResult, Mp, PapyrusObject } from '../../types/mp';
import { uint32 } from '../../utils/helper';
import { equipSlotMap } from './types';

export const getBaseArmorById = (
	mp: Mp,
	selfId: number,
	espmRecord?: EspmLookupResult | Partial<EspmLookupResult>
): number => {
	if (!espmRecord) espmRecord = mp.lookupEspmRecordById(selfId);

	const dnam = espmRecord.record?.fields.find((x) => x.type === 'DNAM')?.data;
	if (!dnam) return 0;

	return uint32(dnam.buffer, 0) / 100;
};
export const getArmorRating = (mp: Mp, self: PapyrusObject): number => {
	const selfId = mp.getIdFromDesc(self.desc);
	return getBaseArmorById(mp, selfId);
};

export const getSlotById = (
	mp: Mp,
	selfId: number,
	espmRecord?: EspmLookupResult | Partial<EspmLookupResult>
): number[] => {
	if (!espmRecord) espmRecord = mp.lookupEspmRecordById(selfId);

	const b2 = espmRecord.record?.fields.find((x) => x.type === 'BOD2')?.data;
	if (!b2) return [];

	const slot = uint32(b2.buffer, 0);
	if (!slot) return [];

	return Object.keys(equipSlotMap)
		.filter((k) => slot && +k)
		.map((k) => equipSlotMap[+k]);
};
export const getSlot = (mp: Mp, self: PapyrusObject): number[] => {
	const selfId = mp.getIdFromDesc(self.desc);
	return getSlotById(mp, selfId);
};

export const register = (mp: Mp): void => {
	mp.registerPapyrusFunction('method', 'Armor', 'GetArmorRating', (self) => getArmorRating(mp, self));
	mp.registerPapyrusFunction('method', 'Armor', 'GetAR', (self) => getArmorRating(mp, self));
	mp.registerPapyrusFunction('method', 'Armor', 'GetSlot', (self) => getSlot(mp, self));

	IArmor.GetArmorRating = (self: PapyrusObject) => getArmorRating(mp, self);
	IArmor.GetSlot = (self: PapyrusObject) => getSlot(mp, self);
};
