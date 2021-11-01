import { PapyrusObject, PapyrusValue } from '../types/mp';

export interface KeywordMethods {
	GetKeyword: (args: PapyrusValue[]) => PapyrusObject | undefined;
}
