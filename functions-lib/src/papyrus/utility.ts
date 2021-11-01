import { Mp, PapyrusValue } from '../types/mp';
import { randomInRange } from '../utils/helper';
import {
	getBoolean,
	getNumber,
	getNumberArray,
	getObject,
	getObjectArray,
	getString,
	getStringArray,
} from '../utils/papyrusArgs';

const getAllIndexes = <T = any>(arr: T[], val: T): number[] => {
	const indexes: number[] = [];
	let i = -1;
	// eslint-disable-next-line no-cond-assign
	while ((i = arr.indexOf(val, i + 1)) !== -1) {
		indexes.push(i);
	}
	return indexes;
};

const createStringArray = (mp: Mp, self: null, args: PapyrusValue[]): string[] => {
	const size = getNumber(args, 0);
	const fill = getString(args, 1);
	return new Array<string>(size).fill(fill);
};
const createBoolArray = (mp: Mp, self: null, args: PapyrusValue[]): boolean[] => {
	const size = getNumber(args, 0);
	const fill = getBoolean(args, 1);
	return new Array<boolean>(size).fill(fill);
};
const createNumberArray = (mp: Mp, self: null, args: PapyrusValue[]): number[] => {
	const size = getNumber(args, 0);
	const fill = getNumber(args, 1);
	return new Array<number>(size).fill(fill);
};
const createFormArray = (mp: Mp, self: null, args: PapyrusValue[]): PapyrusValue[] => {
	const size = getNumber(args, 0);
	const fill = args[1] ? getObject(args, 1) : null;
	return new Array<PapyrusValue>(size).fill(fill);
};

const resizeStringArray = (mp: Mp, self: null, args: PapyrusValue[]): string[] => {
	const arr = getStringArray(args, 0);
	const size = getNumber(args, 1);
	if (arr.length > size) {
		arr.length = size;
	} else {
		const dif = size - arr.length;
		arr.length = size;
		arr.fill('', arr.length - dif, arr.length);
	}
	return arr;
};

const arrayStringFind = (mp: Mp, self: null, args: PapyrusValue[]) => {
	const array = getStringArray(args, 0);
	const find = getString(args, 1);

	return array.findIndex((x) => x === find);
};
const arrayNumberFind = (mp: Mp, self: null, args: PapyrusValue[]) => {
	const array = getNumberArray(args, 0);
	const find = getNumber(args, 1);

	return array.findIndex((x) => x === find);
};

const arrayStringFindAll = (mp: Mp, self: null, args: PapyrusValue[]): number[] => {
	const array = getStringArray(args, 0);
	const find = getString(args, 1);

	return getAllIndexes<string>(array, find);
};
const arrayNumberFindAll = (mp: Mp, self: null, args: PapyrusValue[]): number[] => {
	const array = getNumberArray(args, 0);
	const find = getNumber(args, 1);

	return getAllIndexes<number>(array, find);
};

const pushStringArray = (mp: Mp, self: null, args: PapyrusValue[]) => {
	const array = getStringArray(args, 0);
	if (array[0] === '') {
		array.splice(0, 1);
	}
	const newValue = getString(args, 1);
	return [...array, newValue];
};
const pushNumberArray = (mp: Mp, self: null, args: PapyrusValue[]) => {
	const array = getNumberArray(args, 0);
	const newValue = getNumber(args, 1);
	return [...array, newValue];
};
const pushFormArray = (mp: Mp, self: null, args: PapyrusValue[]) => {
	const array = getObjectArray(args, 0);
	const newValue = getObject(args, 1);
	return [...array, newValue];
};

const unshiftStringArray = (mp: Mp, self: null, args: PapyrusValue[]) => {
	const array = getStringArray(args, 0);
	const newValue = getString(args, 1);
	return [newValue, ...array];
};
const unshiftNumberArray = (mp: Mp, self: null, args: PapyrusValue[]) => {
	const array = getNumberArray(args, 0);
	const newValue = getNumber(args, 1);
	return [newValue, ...array];
};
const unshiftFormArray = (mp: Mp, self: null, args: PapyrusValue[]) => {
	const array = getObjectArray(args, 0);
	const newValue = getObject(args, 1);
	return [newValue, ...array];
};

const spliceStringArray = (mp: Mp, self: null, args: PapyrusValue[]) => {
	const array = getStringArray(args, 0);
	const index = getNumber(args, 1);
	const countDeleteElements = getNumber(args, 2) ?? 1;
	if (index >= array.length) {
		console.log('Index was outside the bounds of the array');
		return [];
	}
	array.splice(index, countDeleteElements);
	return array;
};
const spliceNumberArray = (mp: Mp, self: null, args: PapyrusValue[]) => {
	const array = getNumberArray(args, 0);
	const index = getNumber(args, 1);
	const countDeleteElements = getNumber(args, 2) ?? 1;
	if (index >= array.length) {
		console.log('Index was outside the bounds of the array');
		return [];
	}
	array.splice(index, countDeleteElements);
	return array;
};
const spliceFormArray = (mp: Mp, self: null, args: PapyrusValue[]) => {
	const array = getObjectArray(args, 0);
	const index = getNumber(args, 1);
	const countDeleteElements = getNumber(args, 2) ?? 1;
	if (index >= array.length) {
		console.log('Index was outside the bounds of the array');
		return [];
	}
	array.splice(index, countDeleteElements);
	return array;
};

const stringArrayToNumberArray = (mp: Mp, self: null, args: PapyrusValue[]) => getStringArray(args, 0).map((x) => +x);
const formArrayToObjectReferenceArray = (mp: Mp, self: null, args: PapyrusValue[]) => getObjectArray(args, 0);
const formArrayToActorArray = (mp: Mp, self: null, args: PapyrusValue[]) => getObjectArray(args, 0);

const randomInt = (mp: Mp, self: null, args: PapyrusValue[]): number =>
	randomInRange(getNumber(args, 0), getNumber(args, 1));

export const register = (mp: Mp): void => {
	mp.registerPapyrusFunction('global', 'Utility', 'CreateStringArray', (self, args) =>
		createStringArray(mp, self, args)
	);
	mp.registerPapyrusFunction('global', 'Utility', 'CreateBoolArray', (self, args) => createBoolArray(mp, self, args));
	mp.registerPapyrusFunction('global', 'Utility', 'CreateFloatArray', (self, args) =>
		createNumberArray(mp, self, args)
	);
	mp.registerPapyrusFunction('global', 'Utility', 'CreateFormArray', (self, args) => createFormArray(mp, self, args));
	mp.registerPapyrusFunction('global', 'Utility', 'CreateIntArray', (self, args) => createNumberArray(mp, self, args));

	mp.registerPapyrusFunction('global', 'Utility', 'ResizeStringArray', (self, args) =>
		resizeStringArray(mp, self, args)
	);
	mp.registerPapyrusFunction('global', 'Utility', 'RandomInt', (self, args) => randomInt(mp, self, args));

	mp.registerPapyrusFunction('global', 'UtilityEx', 'ArrayStringFind', (self, args) => arrayStringFind(mp, self, args));
	mp.registerPapyrusFunction('global', 'UtilityEx', 'ArrayIntFind', (self, args) => arrayNumberFind(mp, self, args));
	mp.registerPapyrusFunction('global', 'UtilityEx', 'ArrayFloatFind', (self, args) => arrayNumberFind(mp, self, args));

	mp.registerPapyrusFunction('global', 'UtilityEx', 'ArrayStringFindAll', (self, args) =>
		arrayStringFindAll(mp, self, args)
	);
	mp.registerPapyrusFunction('global', 'UtilityEx', 'ArrayIntFindAll', (self, args) =>
		arrayNumberFindAll(mp, self, args)
	);
	mp.registerPapyrusFunction('global', 'UtilityEx', 'ArrayFloatFindAll', (self, args) =>
		arrayNumberFindAll(mp, self, args)
	);

	mp.registerPapyrusFunction('global', 'UtilityEx', 'StringArrayToIntArray', (self, args) =>
		stringArrayToNumberArray(mp, self, args)
	);
	mp.registerPapyrusFunction('global', 'UtilityEx', 'StringArrayToFloatArray', (self, args) =>
		stringArrayToNumberArray(mp, self, args)
	);
	mp.registerPapyrusFunction('global', 'UtilityEx', 'FormArrayToObjectReferenceArray', (self, args) =>
		formArrayToObjectReferenceArray(mp, self, args)
	);
	mp.registerPapyrusFunction('global', 'UtilityEx', 'FormArrayToActorArray', (self, args) =>
		formArrayToActorArray(mp, self, args)
	);

	mp.registerPapyrusFunction('global', 'UtilityEx', 'PushStringArray', (self, args) => pushStringArray(mp, self, args));
	mp.registerPapyrusFunction('global', 'UtilityEx', 'PushIntArray', (self, args) => pushNumberArray(mp, self, args));
	mp.registerPapyrusFunction('global', 'UtilityEx', 'PushFloatArray', (self, args) => pushNumberArray(mp, self, args));
	mp.registerPapyrusFunction('global', 'UtilityEx', 'PushFormArray', (self, args) => pushFormArray(mp, self, args));

	mp.registerPapyrusFunction('global', 'UtilityEx', 'UnshiftStringArray', (self, args) =>
		unshiftStringArray(mp, self, args)
	);
	mp.registerPapyrusFunction('global', 'UtilityEx', 'UnshiftIntArray', (self, args) =>
		unshiftNumberArray(mp, self, args)
	);
	mp.registerPapyrusFunction('global', 'UtilityEx', 'UnshiftFloatArray', (self, args) =>
		unshiftNumberArray(mp, self, args)
	);
	mp.registerPapyrusFunction('global', 'UtilityEx', 'UnshiftFormArray', (self, args) =>
		unshiftFormArray(mp, self, args)
	);

	mp.registerPapyrusFunction('global', 'UtilityEx', 'SpliceStringArray', (self, args) =>
		spliceStringArray(mp, self, args)
	);
	mp.registerPapyrusFunction('global', 'UtilityEx', 'SpliceIntArray', (self, args) =>
		spliceNumberArray(mp, self, args)
	);
	mp.registerPapyrusFunction('global', 'UtilityEx', 'SpliceFloatArray', (self, args) =>
		spliceNumberArray(mp, self, args)
	);
	mp.registerPapyrusFunction('global', 'UtilityEx', 'SpliceFormArray', (self, args) => spliceFormArray(mp, self, args));
};
