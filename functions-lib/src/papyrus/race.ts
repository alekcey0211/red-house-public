import { EspmLookupResult, EspmRecord, Mp } from '../types/mp';
import { float32, uint32 } from '../utils/helper';

export const getRaceId = (mp: Mp, pcFormId: number, rec: EspmRecord): number | undefined => {
	if (pcFormId >= 0xff000000) {
		try {
			const appearance = mp.get(pcFormId, 'appearance');
			return appearance?.raceId ?? 0;
		} catch (error) {}
	}

	const rnam = rec.fields.find((x) => x.type === 'RNAM')?.data;
	if (!rnam) return;

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
export const getRaceHealthRate = (espmRecord: EspmLookupResult): number | undefined =>
	getRaceFloat32DataValue(espmRecord, 84);
export const getRaceMagicka = (espmRecord: EspmLookupResult): number | undefined =>
	getRaceFloat32DataValue(espmRecord, 40);
export const getRaceMagickaRate = (espmRecord: EspmLookupResult): number | undefined =>
	getRaceFloat32DataValue(espmRecord, 88);
export const getRaceStamina = (espmRecord: EspmLookupResult): number | undefined =>
	getRaceFloat32DataValue(espmRecord, 44);
export const getRaceStaminaRate = (espmRecord: EspmLookupResult): number | undefined =>
	getRaceFloat32DataValue(espmRecord, 92);
