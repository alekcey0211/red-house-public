import { PapyrusObject } from '../types/mp';

export interface ArmorMethods {
	GetArmorRating: (self: PapyrusObject) => number;
	GetSlot: (self: PapyrusObject) => number[];
}
