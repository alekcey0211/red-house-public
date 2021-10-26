import { AttrAll, Skill } from '../properties/actor/actorValues/attributes';
import { EspmLookupResult, EspmRecord, Mp } from '../types/mp';
import { float32, uint16, uint32 } from '../utils/helper';

export const raceDefaultAttr: Partial<Record<AttrAll | Skill, number>> = {
	health: 100,
	healrate: 0,
	magicka: 100,
	magickarate: 100,
	stamina: 100,
	staminarate: 100,
};

export const getRaceId = (mp: Mp, pcFormId: number, rec: EspmRecord): number => {
	if (pcFormId >= 0xff000000) {
		try {
			const appearance = mp.get(pcFormId, 'appearance');
			return appearance?.raceId ?? 0;
			// eslint-disable-next-line no-empty
		} catch (error) {}
	}

	const rnam = rec.fields.find((x) => x.type === 'RNAM')?.data;
	if (!rnam) return 0;

	return uint32(rnam.buffer, 0);
};

const getRaceFloat32DataValue = (espmRecord: EspmLookupResult, offset: number) => {
	const raceData = espmRecord.record?.fields.find((x) => x.type === 'DATA')?.data;
	if (!raceData) return;
	return float32(raceData.buffer, offset);
};

export const getRaceUnarmedDamage = (espmRecord: EspmLookupResult): number | undefined =>
	getRaceFloat32DataValue(espmRecord, 96);

export const getRaceHealth = (espmRecord: EspmLookupResult): number | undefined =>
	getRaceFloat32DataValue(espmRecord, 36);
export const getRaceHealRate = (espmRecord: EspmLookupResult): number | undefined =>
	getRaceFloat32DataValue(espmRecord, 84);
export const getRaceMagicka = (espmRecord: EspmLookupResult): number | undefined =>
	getRaceFloat32DataValue(espmRecord, 40);
export const getRaceMagickaRate = (espmRecord: EspmLookupResult): number | undefined =>
	getRaceFloat32DataValue(espmRecord, 88);
export const getRaceStamina = (espmRecord: EspmLookupResult): number | undefined =>
	getRaceFloat32DataValue(espmRecord, 44);
export const getRaceStaminaRate = (espmRecord: EspmLookupResult): number | undefined =>
	getRaceFloat32DataValue(espmRecord, 92);

export const getAttr = (mp: Mp, pcFormId: number): Partial<Record<AttrAll, number>> => {
	const selfId = mp.getIdFromDesc(mp.get(pcFormId, 'baseDesc'));
	const rec = mp.lookupEspmRecordById(selfId).record;
	if (!rec) return raceDefaultAttr;

	const acbs = rec.fields.find((x) => x.type === 'ACBS')?.data;
	const magickaOffset = acbs ? uint16(acbs.buffer, 4) : 0;
	const staminaOffset = acbs ? uint16(acbs.buffer, 6) : 0;
	// const level = acbs ? uint16(acbs.buffer, 8) : 0;
	const healthOffset = acbs ? uint16(acbs.buffer, 20) : 0;

	const raceId = getRaceId(mp, selfId, rec);
	if (!raceId) return raceDefaultAttr;

	mp.set(pcFormId, 'race', raceId);
	const race = mp.lookupEspmRecordById(raceId) as EspmLookupResult;

	return {
		health: (getRaceHealth(race) ?? 100) + healthOffset,
		healrate: getRaceHealRate(race) ?? 0,
		magicka: (getRaceMagicka(race) ?? 100) + magickaOffset,
		magickarate: getRaceMagickaRate(race) ?? 0,
		stamina: (getRaceStamina(race) ?? 100) + staminaOffset,
		staminarate: getRaceStaminaRate(race) ?? 0,
	};
};
