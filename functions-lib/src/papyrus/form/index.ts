import { Mp, PapyrusObject, PapyrusValue } from '../../types/mp';
import { uint32, uint8arrayToStringMethod } from '../../utils/helper';
import { getNumber, getObject, getString } from '../../utils/papyrusArgs';
import { StringLocalizationProvider } from '../../utils/stringLocalizationProvider';
import { getKeywords, getNthKeyword, getNumKeywords, hasKeyword, hasKeywordEx } from './keywords';
import { formType } from './type';

export const getSelfId = (mp: Mp, desc: string) => {
	let selfId = mp.getIdFromDesc(desc);
	if (selfId >= 0xff000000) {
		return mp.getIdFromDesc(mp.get(selfId, 'baseDesc'));
	}
	return selfId;
};

const getFormID = (mp: Mp, self: PapyrusObject): number => {
	return mp.getIdFromDesc(self.desc);
};

export const getName = (strings: StringLocalizationProvider, mp: Mp, self: PapyrusObject): string | null => {
	const selfId = getSelfId(mp, self.desc);

	const espmRecord = mp.lookupEspmRecordById(selfId);

	const full = espmRecord.record?.fields.find((x) => x.type === 'FULL')?.data;
	const tplt = espmRecord.record?.fields.find((x) => x.type === 'TPLT')?.data;

	if (!full && !tplt) return 'NOT_FOUND';

	if (!full && tplt) return getName(strings, mp, { type: 'form', desc: mp.getDescFromId(uint32(tplt.buffer, 0)) });

	if (full && full.length > 4) return new TextDecoder().decode(full);

	if (full) {
		const espName = self.desc.split(':')[1].split('.')[0].toLowerCase();
		const index = uint32(full.buffer, 0);
		return strings.getText(espName, index) ?? '';
	}

	return 'NOT_FOUND';

	// if (full) {
	// 	if (full.length > 4) {
	// 		console.log('TextDecoder', new TextDecoder().decode(full));
	// 		return new TextDecoder().decode(full);
	// 	} else {
	// 		const espName = self.desc.split(':')[1].split('.')[0].toLowerCase();
	// 		const index = uint32(full.buffer, 0);
	// 		return strings.getText(espName, index) ?? '';
	// 	}
	// } else if (tplt) {
	// 	return getName(strings, mp, { type: 'form', desc: mp.getDescFromId(uint32(tplt.buffer, 0)) });
	// }
	// return 'unknown';
};

const getNameEx = (
	strings: StringLocalizationProvider,
	mp: Mp,
	selfNull: null,
	args: PapyrusValue[]
): string | null => {
	const self = getObject(args, 0);
	return getName(strings, mp, self);
};

export const getDescription = (
	strings: StringLocalizationProvider,
	mp: Mp,
	selfNull: null,
	args: PapyrusValue[]
): string => {
	const self = getObject(args, 0);
	const selfId = getSelfId(mp, self.desc);
	const espName = self.desc.split(':')[1].split('.')[0].toLowerCase();
	const espmRecord = mp.lookupEspmRecordById(selfId);

	const desc = espmRecord.record?.fields.find((x) => x.type === 'DESC')?.data;
	if (desc) {
		const dataView = new DataView(desc.buffer);
		const index = dataView.getUint32(0, true);
		if (desc.length > 4) {
			return new TextDecoder().decode(desc);
		} else {
			return strings.getText(espName, index) ?? '';
		}
	}
	return '';
};

export const _getEditorId = (mp: Mp, selfId: number): string | undefined => {
	const espmRecord = mp.lookupEspmRecordById(selfId);
	const name = espmRecord.record?.fields.find((x) => x.type === 'NAME')?.data;
	if (!name) return;

	const dataView = new DataView(name.buffer);
	const baseId = dataView.getUint32(0, true);

	const espmRecordBase = mp.lookupEspmRecordById(baseId);

	const edid = espmRecordBase.record?.fields.find((x) => x.type === 'EDID')?.data;
	if (edid) {
		return uint8arrayToStringMethod(edid);
	}
	return '';
};
export const getEditorId = (mp: Mp, self: null, args: PapyrusValue[]): string | undefined => {
	return _getEditorId(mp, getSelfId(mp, getObject(args, 0).desc));
};
export const getEditorIdById = (mp: Mp, self: null, args: PapyrusValue[]): string | undefined => {
	return _getEditorId(mp, getNumber(args, 0));
};

const getGoldValue = (mp: Mp, self: PapyrusObject) => {
	const selfId = getSelfId(mp, self.desc);
	const recordData = mp.lookupEspmRecordById(selfId);
	const data = recordData.record?.fields.find((x) => x.type === 'DATA')?.data;
	if (data) {
		const dataView = new DataView(data.buffer);
		return dataView.getUint32(0, true);
	}
	return -1;
};

export const getWeight = (mp: Mp, self: PapyrusObject): number | undefined => {
	const selfId = getSelfId(mp, self.desc);
	return getWeightById(mp, selfId);
};
export const getWeightById = (mp: Mp, selfId: number): number | undefined => {
	const recordData = mp.lookupEspmRecordById(selfId);
	const data = recordData.record?.fields.find((x) => x.type === 'DATA')?.data;
	if (!data) return;
	const dataView = new DataView(data.buffer);
	return dataView.getFloat32(4, true);
};

const getType = (mp: Mp, self: PapyrusObject) => {
	const selfId = getSelfId(mp, self.desc);
	const data = mp.lookupEspmRecordById(selfId);
	return data.record?.type && formType[data.record?.type] ? formType[data.record?.type] : 0;
};

const getSignature = (mp: Mp, self: null, args: PapyrusValue[]) => {
	const espmRecord = mp.lookupEspmRecordById(getNumber(args, 0));
	const type = espmRecord.record?.type;
	return type;
};

const equalSignature = (mp: Mp, self: null, args: PapyrusValue[]) => {
	const espmRecord = mp.lookupEspmRecordById(getNumber(args, 0));
	const isType = getString(args, 1);
	const type = espmRecord.record?.type;
	if (isType === type) return true;
	return false;
};

export const register = (mp: Mp, strings: StringLocalizationProvider): void => {
	mp.registerPapyrusFunction('method', 'Form', 'GetFormID', (self) => getFormID(mp, self));

	mp.registerPapyrusFunction('method', 'Form', 'GetName', (self) => getName(strings, mp, self));
	mp.registerPapyrusFunction('method', 'Form', 'GetType', (self) => getType(mp, self));
	mp.registerPapyrusFunction('method', 'Form', 'GetGoldValue', (self) => getGoldValue(mp, self));
	mp.registerPapyrusFunction('method', 'Form', 'GetWeight', (self) => getWeight(mp, self));

	mp.registerPapyrusFunction('method', 'Form', 'GetKeywords', (self) => getKeywords(mp, self));
	mp.registerPapyrusFunction('method', 'Form', 'GetNumKeywords', (self) => getNumKeywords(mp, self));
	mp.registerPapyrusFunction('method', 'Form', 'GetNthKeyword', (self, args) => getNthKeyword(mp, self, args));
	mp.registerPapyrusFunction('method', 'Form', 'HasKeyword', (self, args) => hasKeyword(mp, self, args));

	mp.registerPapyrusFunction('global', 'FormEx', 'GetName', (self, args) => getNameEx(strings, mp, self, args));
	mp.registerPapyrusFunction('global', 'FormEx', 'GetEditorID', (self, args) => getEditorId(mp, self, args));
	mp.registerPapyrusFunction('global', 'FormEx', 'GetDescription', (self, args) =>
		getDescription(strings, mp, self, args)
	);
	mp.registerPapyrusFunction('global', 'FormEx', 'HasKeyword', (self, args) => hasKeywordEx(mp, self, args));
	mp.registerPapyrusFunction('global', 'FormEx', 'GetSignature', (self, args) => getSignature(mp, self, args));
	mp.registerPapyrusFunction('global', 'FormEx', 'EqualSignature', (self, args) => equalSignature(mp, self, args));
};
