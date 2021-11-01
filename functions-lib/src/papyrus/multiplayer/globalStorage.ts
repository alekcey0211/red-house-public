import { Mp, PapyrusValue } from '../../types/mp';
import { getNumber, getNumberArray, getString, getStringArray } from '../../utils/papyrusArgs';
import { checkAndCreatePropertyExist } from './functions';

const globalId = 0xff000000;

export const getGlobalStorageValue = (mp: Mp, self: null, args: PapyrusValue[]): PapyrusValue | undefined => {
	const key = getString(args, 0);
	checkAndCreatePropertyExist(mp, globalId, key);
	try {
		return mp.get<PapyrusValue>(globalId, key);
	} catch (err) {
		console.log(err);
	}
};

export const setGlobalStorageValueString = (mp: Mp, self: null, args: PapyrusValue[]): void => {
	const key = getString(args, 0);
	const value = getString(args, 1);
	setGlobalStorageValue(mp, key, value);
};

export const setGlobalStorageValueStringArray = (mp: Mp, self: null, args: PapyrusValue[]): void => {
	const key = getString(args, 0);
	const value = getStringArray(args, 1);
	setGlobalStorageValue(mp, key, value);
};

export const setGlobalStorageValueNumber = (mp: Mp, self: null, args: PapyrusValue[]): void => {
	const key = getString(args, 0);
	const value = getNumber(args, 1);
	setGlobalStorageValue(mp, key, value);
};

export const setGlobalStorageValueNumberArray = (mp: Mp, self: null, args: PapyrusValue[]): void => {
	const key = getString(args, 0);
	const value = getNumberArray(args, 1);
	setGlobalStorageValue(mp, key, value);
};

export const setGlobalStorageValue = (mp: Mp, key: string, value: PapyrusValue): void => {
	checkAndCreatePropertyExist(mp, globalId, key);
	try {
		mp.set(globalId, key, value);
	} catch (err) {
		console.log(err);
	}
};
