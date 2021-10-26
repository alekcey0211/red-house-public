import { IForm } from '../../..';
import { Mp, PapyrusObject, PapyrusValue } from '../../types/mp';
import { float32, uint32 } from '../../utils/helper';
import { getNumber, getObject, getString } from '../../utils/papyrusArgs';
import { StringLocalizationProvider } from '../../utils/stringLocalizationProvider';
import { getKeywords, getNthKeyword, getNumKeywords, hasKeyword, hasKeywordEx } from './keywords';
import { formType } from './type';
import { getLvlListObjects } from './lvl-list';

export const getSelfId = (mp: Mp, desc: string): number => {
	const selfId = mp.getIdFromDesc(desc);
	if (selfId >= 0xff000000) {
		return mp.getIdFromDesc(mp.get(selfId, 'baseDesc'));
	}
	return selfId;
};

const getFormID = (mp: Mp, self: PapyrusObject): number => mp.getIdFromDesc(self.desc);

export const getName = (strings: StringLocalizationProvider, mp: Mp, self: PapyrusObject): string | 'NOT_FOUND' => {
	const selfId = getSelfId(mp, self.desc);

	const espmRecord = mp.lookupEspmRecordById(selfId);

	const full = espmRecord.record?.fields.find((x) => x.type === 'FULL')?.data;
	const tplt = espmRecord.record?.fields.find((x) => x.type === 'TPLT')?.data;

	if (!full && !tplt) return 'NOT_FOUND';

	if (!full && tplt) return getName(strings, mp, { type: 'form', desc: mp.getDescFromId(uint32(tplt.buffer, 0)) });

	if (full && full.length > 4) return new TextDecoder().decode(full);

	if (full && self.desc) {
		const espName = self.desc.split(':')[1].split('.')[0].toLowerCase();
		const index = uint32(full.buffer, 0);
		return strings.getText(espName, index) ?? '';
	}

	return 'NOT_FOUND';
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
		}
		return strings.getText(espName, index) ?? '';
	}
	return '';
};

export const _getEditorId = (mp: Mp, selfId: number): string => {
	const espmRecord = mp.lookupEspmRecordById(selfId);
	const rec = espmRecord.record;
	if (!rec) return '';

	const name = rec.fields.find((x) => x.type === 'NAME')?.data;
	if (!name) return rec.editorId;

	const dataView = new DataView(name.buffer);
	const baseId = dataView.getUint32(0, true);

	const recBase = mp.lookupEspmRecordById(baseId).record;
	if (!recBase) return '';

	return recBase.editorId;

	// const edid = recBase.fields.find((x) => x.type === 'EDID')?.data;
	// if (!edid) return '';

	// return uint8arrayToStringMethod(edid);
};
export const getEditorId = (mp: Mp, self: null, args: PapyrusValue[]): string =>
	_getEditorId(mp, getSelfId(mp, getObject(args, 0).desc));
export const getEditorIdById = (mp: Mp, self: null, args: PapyrusValue[]): string =>
	_getEditorId(mp, getNumber(args, 0));

const getGoldValue = (mp: Mp, self: PapyrusObject) => {
	const selfId = getSelfId(mp, self.desc);
	const recordData = mp.lookupEspmRecordById(selfId);
	const data = recordData.record?.fields.find((x) => x.type === 'DATA')?.data;
	if (!data) return -1;

	const dataView = new DataView(data.buffer);
	return dataView.getUint32(0, true);
};

export const getWeightById = (mp: Mp, selfId: number): number => {
	const recordData = mp.lookupEspmRecordById(selfId);

	if (recordData.record?.type === 'NPC_') {
		const nam7 = recordData.record?.fields.find((x) => x.type === 'NAM7')?.data;
		if (!nam7) return 0;

		return float32(nam7.buffer);
	}

	const data = recordData.record?.fields.find((x) => x.type === 'DATA')?.data;
	if (!data) return 0;

	return float32(data.buffer, 4);
};
export const getWeight = (mp: Mp, self: PapyrusObject): number => {
	const selfId = getSelfId(mp, self.desc);
	return getWeightById(mp, selfId);
};

const getType = (mp: Mp, self: PapyrusObject) => {
	const selfId = getSelfId(mp, self.desc);
	const data = mp.lookupEspmRecordById(selfId);
	return data.record?.type && formType[data.record?.type] ? formType[data.record?.type] : 0;
};

const _getSignature = (mp: Mp, selfId: number) => {
	const espmRecord = mp.lookupEspmRecordById(selfId);
	return espmRecord.record?.type ?? '';
};
const getSignature = (mp: Mp, self: PapyrusObject) => _getSignature(mp, getSelfId(mp, self.desc));
const getSignatureEx = (mp: Mp, self: null, args: PapyrusValue[]) => _getSignature(mp, getNumber(args, 0));

const _equalSignature = (mp: Mp, selfId: number, type: string) => {
	const espmRecord = mp.lookupEspmRecordById(selfId);
	if (espmRecord.record?.type === type) return true;
	return false;
};
const equalSignature = (mp: Mp, self: PapyrusObject, args: PapyrusValue[]) =>
	_equalSignature(mp, getSelfId(mp, self.desc), getString(args, 0));
const equalSignatureEx = (mp: Mp, self: null, args: PapyrusValue[]) =>
	_equalSignature(mp, getNumber(args, 0), getString(args, 1));

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
	mp.registerPapyrusFunction('method', 'Form', 'GetSignature', (self) => getSignature(mp, self));
	mp.registerPapyrusFunction('method', 'Form', 'EqualSignature', (self, args) => equalSignature(mp, self, args));

	mp.registerPapyrusFunction('global', 'FormEx', 'GetName', (self, args) => getNameEx(strings, mp, self, args));
	mp.registerPapyrusFunction('global', 'FormEx', 'GetEditorID', (self, args) => getEditorId(mp, self, args));
	mp.registerPapyrusFunction('global', 'FormEx', 'GetDescription', (self, args) =>
		getDescription(strings, mp, self, args)
	);
	mp.registerPapyrusFunction('global', 'FormEx', 'HasKeyword', (self, args) => hasKeywordEx(mp, self, args));
	mp.registerPapyrusFunction('global', 'FormEx', 'GetSignature', (self, args) => getSignatureEx(mp, self, args));
	mp.registerPapyrusFunction('global', 'FormEx', 'EqualSignature', (self, args) => equalSignatureEx(mp, self, args));

	IForm.GetFormID = (self) => getFormID(mp, self);
	IForm.GetName = (self) => getName(strings, mp, self);
	IForm.GetType = (self) => getType(mp, self);
	IForm.GetGoldValue = (self) => getGoldValue(mp, self);
	IForm.GetWeight = (self) => getWeight(mp, self);
	IForm.GetKeywords = (self) => getKeywords(mp, self);
	IForm.GetNumKeywords = (self) => getNumKeywords(mp, self);
	IForm.GetNthKeyword = (self, args) => getNthKeyword(mp, self, args);
	IForm.HasKeyword = (self, args) => hasKeyword(mp, self, args);
	IForm.GetEditorID = (self) => getEditorId(mp, null, [self]);
	IForm.GetDescription = (self) => getDescription(strings, mp, null, [self]);
	IForm.GetSignature = (self) => getSignature(mp, self);
	IForm.EqualSignature = (self, args) => equalSignature(mp, self, args);
	IForm.GetLvlListObjects = (self) => getLvlListObjects(mp, self);
};
