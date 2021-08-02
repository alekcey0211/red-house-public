import { Mp, PapyrusObject, PapyrusValue } from '../../types/mp';
import { uint32 } from '../../utils/helper';
import { getNumber } from '../../utils/papyrusArgs';
import { getForm } from '../game';

let recipes: number[] | null = null;
let cookingRecipe: number[] | null = null;
const getRecipes = (mp: Mp, self: null): number[] => {
	if (!recipes) {
		recipes = JSON.parse(mp.readDataFile('xelib/COBJ.json')) as number[];
	}
	return recipes;
};
const getCookingRecipes = (mp: Mp, self: null) => {
	if (!cookingRecipe) {
		cookingRecipe = JSON.parse(mp.readDataFile('xelib/cooking-COBJ.json')) as number[];
	}
	return cookingRecipe;
};

const getRecipeItems = (mp: Mp, self: null, args: PapyrusValue[]): number[] | undefined => {
	const id = getNumber(args, 0);
	const espmRecord = mp.lookupEspmRecordById(id);

	const cntoRecords = espmRecord.record?.fields.filter((x) => x.type === 'CNTO');
	if (cntoRecords && cntoRecords.length > 0) {
		return cntoRecords.map((rec) => {
			return uint32(rec.data.buffer, 0);
		});
	}

	return;
};

const getRecipeCraftItem = (mp: Mp, self: null, args: PapyrusValue[]): number | undefined => {
	const id = getNumber(args, 0);
	const espmRecord = mp.lookupEspmRecordById(id);
	const cnam = espmRecord.record?.fields.find((x) => x.type === 'CNAM')?.data;

	if (!cnam) return;

	return uint32(cnam.buffer, 0);
};

const getRecipeItemCount = (mp: Mp, self: null, args: PapyrusValue[]): number | undefined => {
	const id = getNumber(args, 0);
	const itemId = getNumber(args, 1);
	const espmRecord = mp.lookupEspmRecordById(id);
	const cntoRecords = espmRecord.record?.fields.filter((x) => x.type === 'CNTO');

	if (!cntoRecords || cntoRecords.length === 0) return;

	const findItem = cntoRecords.find((rec) => {
		return uint32(rec.data.buffer, 0) === itemId;
	});
	if (findItem) {
		return uint32(findItem.data.buffer, 4);
	}
};

const getResult = (mp: Mp, self: PapyrusObject): PapyrusObject | undefined => {
	const selfId = mp.getIdFromDesc(self.desc);
	const espmRecord = mp.lookupEspmRecordById(selfId);
	const cnam = espmRecord.record?.fields.find((x) => x.type === 'CNAM')?.data;

	if (!cnam) return;

	const formid = uint32(cnam.buffer, 0);
	return getForm(mp, null, [formid]);
};

const getNumIngredients = (mp: Mp, self: PapyrusObject): number => {
	const selfId = mp.getIdFromDesc(self.desc);
	const espmRecord = mp.lookupEspmRecordById(selfId);
	const cntoRecords = espmRecord.record?.fields.filter((x) => x.type === 'CNTO');

	return cntoRecords?.length ?? 0;
};

const getNthIngredient = (mp: Mp, self: PapyrusObject, args: PapyrusValue[]): PapyrusObject | undefined => {
	const selfId = mp.getIdFromDesc(self.desc);
	const index = getNumber(args, 0);
	const espmRecord = mp.lookupEspmRecordById(selfId);
	const cntoRecords = espmRecord.record?.fields.filter((x) => x.type === 'CNTO');

	if (!cntoRecords || cntoRecords.length === 0) return;
	if (index >= cntoRecords.length) return;

	const formid = uint32(cntoRecords[index].data.buffer, 0);
	return getForm(mp, null, [formid]);
};

const getNthIngredientQuantity = (mp: Mp, self: PapyrusObject, args: PapyrusValue[]): number => {
	const selfId = mp.getIdFromDesc(self.desc);
	const index = getNumber(args, 0);
	const espmRecord = mp.lookupEspmRecordById(selfId);
	const cntoRecords = espmRecord.record?.fields.filter((x) => x.type === 'CNTO');

	if (!cntoRecords || cntoRecords.length === 0) return 0;
	if (index >= cntoRecords.length) return 0;

	return uint32(cntoRecords[index].data.buffer, 4);
};

const getWorkbenchKeyword = (mp: Mp, self: PapyrusObject): PapyrusObject | undefined => {
	const selfId = mp.getIdFromDesc(self.desc);
	const espmRecord = mp.lookupEspmRecordById(selfId);
	const bnam = espmRecord.record?.fields.find((x) => x.type === 'BNAM')?.data;

	if (!bnam) return;

	const formid = uint32(bnam.buffer, 0);
	return getForm(mp, null, [formid]);
};

export const register = (mp: Mp): void => {
	mp.registerPapyrusFunction('method', 'ConstructibleObject', 'GetResult', (self) => getResult(mp, self));
	mp.registerPapyrusFunction('method', 'ConstructibleObject', 'GetNumIngredients', (self) =>
		getNumIngredients(mp, self)
	);
	mp.registerPapyrusFunction('method', 'ConstructibleObject', 'GetNthIngredient', (self, args) =>
		getNthIngredient(mp, self, args)
	);
	mp.registerPapyrusFunction('method', 'ConstructibleObject', 'GetNthIngredientQuantity', (self, args) =>
		getNthIngredientQuantity(mp, self, args)
	);
	mp.registerPapyrusFunction('method', 'ConstructibleObject', 'GetWorkbenchKeyword', (self) =>
		getWorkbenchKeyword(mp, self)
	);

	mp.registerPapyrusFunction('global', 'ConstructibleObjectEx', 'GetRecipeItems', (self, args) =>
		getRecipeItems(mp, self, args)
	);
	mp.registerPapyrusFunction('global', 'ConstructibleObjectEx', 'GetRecipeCraftItem', (self, args) =>
		getRecipeCraftItem(mp, self, args)
	);
	mp.registerPapyrusFunction('global', 'ConstructibleObjectEx', 'GetRecipeItemCount', (self, args) =>
		getRecipeItemCount(mp, self, args)
	);
	mp.registerPapyrusFunction('global', 'ConstructibleObjectEx', 'GetRecipes', (self) => getRecipes(mp, self));
	mp.registerPapyrusFunction('global', 'ConstructibleObjectEx', 'GetCookingRecipes', (self) =>
		getCookingRecipes(mp, self)
	);
};
