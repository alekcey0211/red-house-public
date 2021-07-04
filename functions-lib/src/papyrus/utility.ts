import { Mp, PapyrusValue } from '../types/mp';
import { PapyrusObject } from '../types/skyrimPlatform';
import { randomInRange } from '../utils/helper';
import { getBoolean, getNumber, getNumberArray, getObject, getString, getStringArray } from '../utils/papyrusArgs';

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

const stringArrayToNumberArray = (mp: Mp, self: null, args: PapyrusValue[]) => getStringArray(args, 0).map((x) => +x);

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

  mp.registerPapyrusFunction('global', 'UtilityEx', 'StringArrayToIntArray', (self, args) =>
    stringArrayToNumberArray(mp, self, args)
  );
  mp.registerPapyrusFunction('global', 'UtilityEx', 'StringArrayToFloatArray', (self, args) =>
    stringArrayToNumberArray(mp, self, args)
  );

  mp.registerPapyrusFunction('global', 'UtilityEx', 'PushStringArray', (self, args) => pushStringArray(mp, self, args));
  mp.registerPapyrusFunction('global', 'UtilityEx', 'PushIntArray', (self, args) => pushNumberArray(mp, self, args));
  mp.registerPapyrusFunction('global', 'UtilityEx', 'PushFloatArray', (self, args) => pushNumberArray(mp, self, args));

  mp.registerPapyrusFunction('global', 'UtilityEx', 'UnshiftStringArray', (self, args) =>
    unshiftStringArray(mp, self, args)
  );
  mp.registerPapyrusFunction('global', 'UtilityEx', 'UnshiftIntArray', (self, args) =>
    unshiftNumberArray(mp, self, args)
  );
  mp.registerPapyrusFunction('global', 'UtilityEx', 'UnshiftFloatArray', (self, args) =>
    unshiftNumberArray(mp, self, args)
  );
};
