import { Mp, PapyrusObject, PapyrusValue } from '../../types/mp';
import {
	getBoolean,
	getBooleanArray,
	getNumber,
	getNumberArray,
	getObject,
	getObjectArray,
	getString,
	getStringArray,
} from '../../utils/papyrusArgs';
import { checkAndCreatePropertyExist } from '../multiplayer/functions';

export const _getStorageValue = (mp: Mp, self: PapyrusObject, args: PapyrusValue[]): PapyrusValue | undefined => {
	const refId = mp.getIdFromDesc(self.desc);
	const key = getString(args, 0);
	checkAndCreatePropertyExist(mp, refId, key);
	let val: PapyrusValue | undefined;
	try {
		val = mp.get<PapyrusValue>(refId, key);
	} catch (err) {
		console.log(err);
	}
	return val;
};
export const getStorageValue = (mp: Mp, self: null, args: PapyrusValue[]): PapyrusValue | undefined => {
	const ref = getObject(args, 0);
	const key = getString(args, 1);
	return _getStorageValue(mp, ref, [key]);
};
export const getStorageValueString = (mp: Mp, self: null, args: PapyrusValue[]): string => {
	const val = getStorageValue(mp, self, args);
	return val === null || val === undefined ? '' : getString([val], 0);
};
export const getStorageValueStringArray = (mp: Mp, self: null, args: PapyrusValue[]): string[] => {
	const val = getStorageValue(mp, self, args);
	return val === null || val === undefined ? [] : getStringArray([val], 0);
};
export const getStorageValueNumber = (mp: Mp, self: null, args: PapyrusValue[]): number => {
	const val = getStorageValue(mp, self, args);
	return val === null || val === undefined ? 0 : getNumber([val], 0);
};
export const getStorageValueNumberArray = (mp: Mp, self: null, args: PapyrusValue[]): number[] => {
	const val = getStorageValue(mp, self, args);
	return val === null || val === undefined ? [] : getNumberArray([val], 0);
};
export const getStorageValueBool = (mp: Mp, self: null, args: PapyrusValue[]): boolean | null => {
	const val = getStorageValue(mp, self, args);
	return val === null || val === undefined ? null : getBoolean([val], 0);
};
export const getStorageValueBoolArray = (mp: Mp, self: null, args: PapyrusValue[]): boolean[] => {
	const val = getStorageValue(mp, self, args);
	return val === null || val === undefined ? [] : getBooleanArray([val], 0);
};
export const getStorageValueForm = (mp: Mp, self: null, args: PapyrusValue[]): any => {
	const val = getStorageValue(mp, self, args);
	return val === null || val === undefined ? null : getObject([val], 0);
};
export const getStorageValueFormArray = (mp: Mp, self: null, args: PapyrusValue[]): any[] => {
	const val = getStorageValue(mp, self, args);
	return val === null || val === undefined ? [] : getObjectArray([val], 0);
};

export const setStorageValueString = (mp: Mp, self: null, args: PapyrusValue[]): void =>
	setStorageValue(mp, args, getString(args, 2));
export const setStorageValueStringArray = (mp: Mp, self: null, args: PapyrusValue[]): void =>
	setStorageValue(mp, args, getStringArray(args, 2));
export const setStorageValueNumber = (mp: Mp, self: null, args: PapyrusValue[]): void =>
	setStorageValue(mp, args, getNumber(args, 2));
export const setStorageValueNumberArray = (mp: Mp, self: null, args: PapyrusValue[]): void =>
	setStorageValue(mp, args, getNumberArray(args, 2));
export const setStorageValueBool = (mp: Mp, self: null, args: PapyrusValue[]): void =>
	setStorageValue(mp, args, getBoolean(args, 2));
export const setStorageValueBoolArray = (mp: Mp, self: null, args: PapyrusValue[]): void =>
	setStorageValue(mp, args, getBooleanArray(args, 2));
export const setStorageValueForm = (mp: Mp, self: null, args: PapyrusValue[]): void =>
	setStorageValue(mp, args, getObject(args, 2));
export const setStorageValueFormArray = (mp: Mp, self: null, args: PapyrusValue[]): void =>
	setStorageValue(mp, args, getObjectArray(args, 2));
export const _setStorageValue = (mp: Mp, self: PapyrusObject, args: PapyrusValue[]): void => {
	const refId = mp.getIdFromDesc(self.desc);
	const key = getString(args, 0);
	const value = args[1];
	checkAndCreatePropertyExist(mp, refId, key);
	try {
		mp.set(refId, key, value);
	} catch (err) {
		console.log(err);
	}
};
export const setStorageValue = (mp: Mp, args: PapyrusValue[], value: PapyrusValue): void => {
	const ref = getObject(args, 0);
	const refId = mp.getIdFromDesc(ref.desc);
	const key = getString(args, 1);
	checkAndCreatePropertyExist(mp, refId, key);
	try {
		mp.set(refId, key, value);
	} catch (err) {
		console.log(err);
	}
};

export const register = (mp: Mp): void => {
	mp.registerPapyrusFunction('global', 'ObjectReferenceEx', 'GetStorageValueString', (self, args) =>
		getStorageValueString(mp, self, args)
	);
	mp.registerPapyrusFunction('global', 'ObjectReferenceEx', 'GetStorageValueStringArray', (self, args) =>
		getStorageValueStringArray(mp, self, args)
	);
	mp.registerPapyrusFunction('global', 'ObjectReferenceEx', 'GetStorageValueInt', (self, args) =>
		getStorageValueNumber(mp, self, args)
	);
	mp.registerPapyrusFunction('global', 'ObjectReferenceEx', 'GetStorageValueIntArray', (self, args) =>
		getStorageValueNumberArray(mp, self, args)
	);
	mp.registerPapyrusFunction('global', 'ObjectReferenceEx', 'GetStorageValueFloat', (self, args) =>
		getStorageValueNumber(mp, self, args)
	);
	mp.registerPapyrusFunction('global', 'ObjectReferenceEx', 'GetStorageValueFloatArray', (self, args) =>
		getStorageValueNumberArray(mp, self, args)
	);
	mp.registerPapyrusFunction('global', 'ObjectReferenceEx', 'GetStorageValueBool', (self, args) =>
		getStorageValueBool(mp, self, args)
	);
	mp.registerPapyrusFunction('global', 'ObjectReferenceEx', 'GetStorageValueBoolArray', (self, args) =>
		getStorageValueBoolArray(mp, self, args)
	);
	mp.registerPapyrusFunction('global', 'ObjectReferenceEx', 'GetStorageValueForm', (self, args) =>
		getStorageValueForm(mp, self, args)
	);
	mp.registerPapyrusFunction('global', 'ObjectReferenceEx', 'GetStorageValueFormArray', (self, args) =>
		getStorageValueFormArray(mp, self, args)
	);

	mp.registerPapyrusFunction('global', 'ObjectReferenceEx', 'SetStorageValueString', (self, args) =>
		setStorageValueString(mp, self, args)
	);
	mp.registerPapyrusFunction('global', 'ObjectReferenceEx', 'SetStorageValueStringArray', (self, args) =>
		setStorageValueStringArray(mp, self, args)
	);
	mp.registerPapyrusFunction('global', 'ObjectReferenceEx', 'SetStorageValueInt', (self, args) =>
		setStorageValueNumber(mp, self, args)
	);
	mp.registerPapyrusFunction('global', 'ObjectReferenceEx', 'SetStorageValueIntArray', (self, args) =>
		setStorageValueNumberArray(mp, self, args)
	);
	mp.registerPapyrusFunction('global', 'ObjectReferenceEx', 'SetStorageValueFloat', (self, args) =>
		setStorageValueNumber(mp, self, args)
	);
	mp.registerPapyrusFunction('global', 'ObjectReferenceEx', 'SetStorageValueFloatArray', (self, args) =>
		setStorageValueNumberArray(mp, self, args)
	);
	mp.registerPapyrusFunction('global', 'ObjectReferenceEx', 'SetStorageValueBool', (self, args) =>
		setStorageValueBool(mp, self, args)
	);
	mp.registerPapyrusFunction('global', 'ObjectReferenceEx', 'SetStorageValueBoolArray', (self, args) =>
		setStorageValueBoolArray(mp, self, args)
	);
	mp.registerPapyrusFunction('global', 'ObjectReferenceEx', 'SetStorageValueForm', (self, args) =>
		setStorageValueForm(mp, self, args)
	);
	mp.registerPapyrusFunction('global', 'ObjectReferenceEx', 'SetStorageValueFormArray', (self, args) =>
		setStorageValueFormArray(mp, self, args)
	);
};
