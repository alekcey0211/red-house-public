import { Mp, PapyrusValue } from '../types/mp';
import { getNumber, getNumberArray } from '../utils/papyrusArgs';

export const sqrt = (mp: Mp, self: null, args: PapyrusValue[]): number => Math.sqrt(getNumber(args, 0));

export const pow = (mp: Mp, self: null, args: PapyrusValue[]): number => getNumber(args, 0) ** getNumber(args, 1);

export const min = (mp: Mp, self: null, args: PapyrusValue[]): number => Math.min(...getNumberArray(args, 0));

export const max = (mp: Mp, self: null, args: PapyrusValue[]): number => Math.max(...getNumberArray(args, 0));

export const floor = (mp: Mp, self: null, args: PapyrusValue[]): number => Math.floor(getNumber(args, 0));

export const ceil = (mp: Mp, self: null, args: PapyrusValue[]): number => Math.ceil(getNumber(args, 0));

export const register = (mp: Mp): void => {
	mp.registerPapyrusFunction('global', 'Math', 'sqrt', (self, args) => sqrt(mp, self, args));
	mp.registerPapyrusFunction('global', 'Math', 'pow', (self, args) => pow(mp, self, args));
	mp.registerPapyrusFunction('global', 'Math', 'Floor', (self, args) => floor(mp, self, args));
	mp.registerPapyrusFunction('global', 'Math', 'Ceiling', (self, args) => ceil(mp, self, args));
	mp.registerPapyrusFunction('global', 'MathEx', 'min', (self, args) => min(mp, self, args));
	mp.registerPapyrusFunction('global', 'MathEx', 'max', (self, args) => max(mp, self, args));
};
