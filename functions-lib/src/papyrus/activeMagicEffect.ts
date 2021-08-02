import { Mp, PapyrusValue } from '../types/mp';
import { getNumber } from '../utils/papyrusArgs';

const MGEF_FLGS: Record<string, number> = {
	Hostile: 0x00000001,
	Recover: 0x00000002,
	Detrimental: 0x00000004,
	'Snap to Navmesh': 0x00000008,
	'No Hit Event': 0x00000010,
	'Dispel Effects (toggle keywords to dispel type?)': 0x00000100,
	'No Duration': 0x00000200,
	'No Magnitude': 0x00000400,
	'No Area': 0x00000800,
	'FX Persist': 0x00001000,
	'Gory Visual': 0x00004000,
	'Hide in UI': 0x00008000,
	'No Recast': 0x00020000,
	'Power Affects Magnitude': 0x00200000,
	'Power Affects Duration': 0x00400000,
	Painless: 0x04000000,
	'No Hit Effect': 0x08000000,
	'No Death Dispel': 0x10000000,
};

// const getMagnitude = (mp: Mp, self: PapyrusObject, args: PapyrusValue[]): number => {
//   const selfId = mp.getIdFromDesc(self.desc);
//   const espmRecord = mp.lookupEspmRecordById(selfId);

//   console.log(espmRecord.record?.fields);

//   return 0;
// };

// const getMagnitudeEx = (mp: Mp, self: null, args: PapyrusValue[]): number => {
//   const obj = getObject(args, 0);
//   const objId = mp.getIdFromDesc(obj.desc);
//   const espmRecord = mp.lookupEspmRecordById(objId);

//   console.log(espmRecord.record?.fields);

//   return 0;
// };

export const getFlags = (mp: Mp, self: null, args: PapyrusValue[]): number[] => {
	const id = getNumber(args, 0);
	const espmRecord = mp.lookupEspmRecordById(id);
	const d = espmRecord.record?.fields.find((x) => x.type === 'DATA')?.data;
	const flgs = [];
	if (d) {
		const dv = new DataView(d.buffer);
		let fl = dv.getUint32(0, true);
		for (const k of Object.keys(MGEF_FLGS).reverse()) {
			if (fl - MGEF_FLGS[k] >= 0) {
				flgs.push(MGEF_FLGS[k]);
				fl = fl - MGEF_FLGS[k];
			}
		}
	}
	return flgs;
};

export const register = (mp: Mp): void => {
	// mp.registerPapyrusFunction('method', 'ActiveMagicEffect', 'GetMagnitude', (self, args) =>
	//   getMagnitude(mp, self, args)
	// );
	// mp.registerPapyrusFunction('global', 'ActiveMagicEffectEx', 'GetMagnitude', (self, args) =>
	//   getMagnitudeEx(mp, self, args)
	// );
};
