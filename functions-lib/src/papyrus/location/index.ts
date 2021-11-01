import { ILocation } from '../../..';
import { Mp, PapyrusObject } from '../../types/mp';

export const getParent = (mp: Mp, self: PapyrusObject): any => {
	const espmRecord = mp.lookupEspmRecordById(mp.getIdFromDesc(self.desc));
	const pnam = espmRecord.record?.fields.find((x) => x.type === 'PNAM')?.data;
	if (pnam) {
		const dataView = new DataView(pnam.buffer);

		return { type: 'espm', desc: mp.getDescFromId(dataView.getUint32(0, true)) };
	}

	return null;
};

export const register = (mp: Mp): void => {
	mp.registerPapyrusFunction('method', 'Location', 'GetParent', (self) => getParent(mp, self));

	ILocation.GetParent = (self: PapyrusObject) => getParent(mp, self);
};
