import { PapyrusObject } from '../types/mp';

export interface WorldSpaceMethods {
	GetLocation: (self: PapyrusObject) => PapyrusObject | undefined;
}
