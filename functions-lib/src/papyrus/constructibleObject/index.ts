import { Mp, PapyrusObject, PapyrusValue } from '../../types/mp';
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
      const dataView = new DataView(rec.data.buffer);
      return dataView.getUint32(0, true);
    });
  }

  return;
};

const getRecipeCraftItem = (mp: Mp, self: null, args: PapyrusValue[]): number | undefined => {
  const id = getNumber(args, 0);
  const espmRecord = mp.lookupEspmRecordById(id);
  const cnam = espmRecord.record?.fields.find((x) => x.type === 'CNAM')?.data;

  if (cnam) {
    const dataView = new DataView(cnam.buffer);
    return dataView.getUint32(0, true);
  }
  return;
};

const getRecipeItemCount = (mp: Mp, self: null, args: PapyrusValue[]): number | undefined => {
  const id = getNumber(args, 0);
  const itemId = getNumber(args, 1);
  const espmRecord = mp.lookupEspmRecordById(id);
  const cntoRecords = espmRecord.record?.fields.filter((x) => x.type === 'CNTO');

  if (cntoRecords && cntoRecords.length > 0) {
    const findItem = cntoRecords.find((rec) => {
      const dataView = new DataView(rec.data.buffer);
      return dataView.getUint32(0, true) === itemId;
    });
    if (findItem) {
      const dataView = new DataView(findItem.data.buffer);
      return dataView.getUint32(4, true);
    }
  }

  return;
};

const getResult = (mp: Mp, self: PapyrusObject): PapyrusObject | undefined => {
  const selfId = mp.getIdFromDesc(self.desc);
  const espmRecord = mp.lookupEspmRecordById(selfId);
  const cnam = espmRecord.record?.fields.find((x) => x.type === 'CNAM')?.data;

  if (cnam) {
    const dataView = new DataView(cnam.buffer);
    return getForm(mp, null, [dataView.getUint32(0, true)]);
  }
  return;
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

  if (cntoRecords && cntoRecords.length > 0) {
    if (index >= cntoRecords.length) return;

    const dataView = new DataView(cntoRecords[index].data.buffer);
    return getForm(mp, null, [dataView.getUint32(0, true)]);
  }

  return;
};

const getNthIngredientQuantity = (mp: Mp, self: PapyrusObject, args: PapyrusValue[]): number | undefined => {
  const selfId = mp.getIdFromDesc(self.desc);
  const index = getNumber(args, 0);
  const espmRecord = mp.lookupEspmRecordById(selfId);
  const cntoRecords = espmRecord.record?.fields.filter((x) => x.type === 'CNTO');

  if (cntoRecords && cntoRecords.length > 0) {
    if (index >= cntoRecords.length) return;

    const dataView = new DataView(cntoRecords[index].data.buffer);
    return dataView.getUint32(4, true);
  }

  return;
};

const getWorkbenchKeyword = (mp: Mp, self: PapyrusObject): PapyrusObject | undefined => {
  const selfId = mp.getIdFromDesc(self.desc);
  const espmRecord = mp.lookupEspmRecordById(selfId);
  const bnam = espmRecord.record?.fields.find((x) => x.type === 'BNAM')?.data;

  if (bnam) {
    const dataView = new DataView(bnam.buffer);
    return getForm(mp, null, [dataView.getUint32(0, true)]);
  }

  return;
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
