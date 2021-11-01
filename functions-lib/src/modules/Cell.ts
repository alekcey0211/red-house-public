import { PapyrusObject } from '../types/mp';

export interface CellMethods {
	IsInterior: (self: PapyrusObject) => boolean;
	GetLocation: (self: PapyrusObject) => PapyrusObject | undefined;
}
