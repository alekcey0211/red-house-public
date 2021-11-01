import { PapyrusObject, PapyrusValue } from '../types/mp';
import { LvlObject } from '../papyrus/form/lvl-list';

export interface FormMethods {
	GetLvlListObjects: (self: PapyrusObject) => LvlObject[];
	GetFormID: (self: PapyrusObject) => number;
	GetName: (self: PapyrusObject) => string | 'NOT__FOUND';
	GetType: (self: PapyrusObject) => number;
	GetGoldValue: (self: PapyrusObject) => number;
	GetWeight: (self: PapyrusObject) => number;
	GetKeywords: (self: PapyrusObject) => PapyrusObject[];
	GetNumKeywords: (self: PapyrusObject) => number;
	GetNthKeyword: (self: PapyrusObject, args: PapyrusValue[]) => PapyrusObject | undefined;
	HasKeyword: (self: PapyrusObject, args: PapyrusValue[]) => boolean;
	GetEditorID: (self: PapyrusObject) => string;
	GetDescription: (self: PapyrusObject) => string;
	GetSignature: (self: PapyrusObject) => string;
	EqualSignature: (self: PapyrusObject, args: PapyrusValue[]) => boolean;
}
