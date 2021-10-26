import { PapyrusObject, PapyrusValue } from '../types/mp';

export interface ConstructibleObjectMethods {
	GetResult: (self: PapyrusObject) => PapyrusObject | undefined;
	GetNumIngredients: (self: PapyrusObject) => number;
	GetNthIngredient: (self: PapyrusObject, args: PapyrusValue[]) => PapyrusObject | undefined;
	GetNthIngredientQuantity: (self: PapyrusObject, args: PapyrusValue[]) => number;
	GetWorkbenchKeyword: (self: PapyrusObject) => PapyrusObject | undefined;
}
