import { PapyrusObject } from '../types/mp';

export interface LocationMethods {
	GetParent: (self: PapyrusObject) => PapyrusObject | undefined;
}
