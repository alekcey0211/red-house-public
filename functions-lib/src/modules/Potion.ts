import { PapyrusObject, PapyrusValue } from '../types/mp';

export interface PotionMethods {
	IsFood: (self: PapyrusObject) => boolean;
	IsPoison: (self: PapyrusObject) => boolean;
	GetNumEffects: (self: PapyrusObject) => number;
	GetNthEffectMagnitude: (self: PapyrusObject, args: PapyrusValue[]) => number;
	GetNthEffectArea: (self: PapyrusObject, args: PapyrusValue[]) => number;
	GetNthEffectDuration: (self: PapyrusObject, args: PapyrusValue[]) => number;
	GetNthEffectMagicEffect: (self: PapyrusObject, args: PapyrusValue[]) => PapyrusObject | undefined;
	GetEffectMagnitudes: (self: PapyrusObject) => number[];
	GetEffectAreas: (self: PapyrusObject) => number[];
	GetEffectDurations: (self: PapyrusObject) => number[];
	GetMagicEffects: (self: PapyrusObject) => PapyrusObject[];
}
