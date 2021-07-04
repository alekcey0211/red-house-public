import { EspmField, Mp, PapyrusObject, PapyrusValue } from '../../types/mp';
import { uint32, float32 } from '../../utils/helper';
import { getNumber } from '../../utils/papyrusArgs';
import { getForm } from '../game';

const FLG_ManualCalc = 0x00001;
const FLG_Food = 0x00002;
const FLG_Medicine = 0x10000;
const FLG_Poison = 0x20000;

const flagExists = (mp: Mp, self: PapyrusObject, flag: number) => {
  const selfId = mp.getIdFromDesc(self.desc);
  const espmRecord = mp.lookupEspmRecordById(selfId);

  const enit = espmRecord.record?.fields.find((x) => x.type === 'ENIT')?.data;
  if (!enit) return false;

  const flags = uint32(enit.buffer, 4);
  return !!(flags & flag);
};

export const isFood = (mp: Mp, self: PapyrusObject): boolean => flagExists(mp, self, FLG_Food);
export const isPoison = (mp: Mp, self: PapyrusObject): boolean => flagExists(mp, self, FLG_Poison);

export const getNumEffects = (mp: Mp, self: PapyrusObject): number => {
  const selfId = mp.getIdFromDesc(self.desc);
  const espmRecord = mp.lookupEspmRecordById(selfId);
  return espmRecord.record?.fields.filter((x) => x.type === 'EFID')?.length ?? 0;
};

export const getEffectInfo = (mp: Mp, self: PapyrusObject): [EspmField[], EspmField[]] | [] => {
  const selfId = mp.getIdFromDesc(self.desc);
  const espmRecord = mp.lookupEspmRecordById(selfId);
  const efit = espmRecord.record?.fields.filter((x) => x.type === 'EFIT');
  const efid = espmRecord.record?.fields.filter((x) => x.type === 'EFID');

  if (!efit || efit.length === 0 || !efid || efid.length === 0) return [];

  return [efid, efit];
};

export const getNthEffectInfo = (mp: Mp, self: PapyrusObject, args: PapyrusValue[]): [EspmField, EspmField] | [] => {
  const selfId = mp.getIdFromDesc(self.desc);
  const index = getNumber(args, 0);
  const espmRecord = mp.lookupEspmRecordById(selfId);
  const efit = espmRecord.record?.fields.filter((x) => x.type === 'EFIT');
  const efid = espmRecord.record?.fields.filter((x) => x.type === 'EFID');

  if (!efit || efit.length <= index || !efid || efid.length <= index) return [];

  return [efid[index], efit[index]];
};

export const getNthEffectMagnitude = (mp: Mp, self: PapyrusObject, args: PapyrusValue[]): number => {
  const [_, efit] = getNthEffectInfo(mp, self, args);
  return efit ? float32(efit.data.buffer, 0) : 0;
};
export const getNthEffectArea = (mp: Mp, self: PapyrusObject, args: PapyrusValue[]): number => {
  const [_, efit] = getNthEffectInfo(mp, self, args);
  return efit ? uint32(efit.data.buffer, 4) : 0;
};
export const getNthEffectDuration = (mp: Mp, self: PapyrusObject, args: PapyrusValue[]): number => {
  const [_, efit] = getNthEffectInfo(mp, self, args);
  return efit ? uint32(efit.data.buffer, 8) : 0;
};
export const getNthEffectMagicEffect = (
  mp: Mp,
  self: PapyrusObject,
  args: PapyrusValue[]
): PapyrusObject | undefined => {
  const [efid, _] = getNthEffectInfo(mp, self, args);
  return efid && getForm(mp, null, [uint32(efid.data.buffer, 0)]);
};

export const getEffectMagnitudes = (mp: Mp, self: PapyrusObject): number[] | null => {
  const [_, efit] = getEffectInfo(mp, self);
  return efit ? efit.map((x) => float32(x.data.buffer, 0)) : null;
};
export const getEffectAreas = (mp: Mp, self: PapyrusObject): number[] | null => {
  const [_, efit] = getEffectInfo(mp, self);
  return efit ? efit.map((x) => uint32(x.data.buffer, 4)) : null;
};
export const getEffectDurations = (mp: Mp, self: PapyrusObject): number[] | null => {
  const [_, efit] = getEffectInfo(mp, self);
  return efit ? efit.map((x) => uint32(x.data.buffer, 8)) : null;
};
export const getMagicEffects = (mp: Mp, self: PapyrusObject): PapyrusValue => {
  const [efid, _] = getEffectInfo(mp, self);
  return efid ? efid.map((x) => getForm(mp, null, [uint32(x.data.buffer, 0)]) ?? null) : null;
};
export const equip = (mp: Mp, self: PapyrusObject, args: PapyrusValue[]): void => {
  const selfId = mp.getIdFromDesc(self.desc);
  const potionId = getNumber(args, 0);
  const { n = 0 } = mp.get(selfId, 'ALCHequipped') ?? {};
  mp.set(selfId, 'ALCHequipped', { n: n + 1, id: potionId });
};

export const register = (mp: Mp): void => {
  mp.registerPapyrusFunction('method', 'Potion', 'IsFood', (self) => isFood(mp, self));
  mp.registerPapyrusFunction('method', 'Potion', 'IsPoison', (self) => isPoison(mp, self));

  mp.registerPapyrusFunction('method', 'Potion', 'GetNumEffects', (self) => getNumEffects(mp, self));
  mp.registerPapyrusFunction('method', 'Potion', 'GetNthEffectMagnitude', (self, args) =>
    getNthEffectMagnitude(mp, self, args)
  );
  mp.registerPapyrusFunction('method', 'Potion', 'GetNthEffectArea', (self, args) => getNthEffectArea(mp, self, args));
  mp.registerPapyrusFunction('method', 'Potion', 'GetNthEffectDuration', (self, args) =>
    getNthEffectDuration(mp, self, args)
  );
  mp.registerPapyrusFunction('method', 'Potion', 'GetNthEffectMagicEffect', (self, args) =>
    getNthEffectMagicEffect(mp, self, args)
  );
  // mp.registerPapyrusFunction('method', 'Potion', 'GetCostliestEffectIndex', (self, args) =>
  //   getCostliestEffectIndex(mp, self, args)
  // );
  mp.registerPapyrusFunction('method', 'Potion', 'GetEffectMagnitudes', (self) => getEffectMagnitudes(mp, self));
  mp.registerPapyrusFunction('method', 'Potion', 'GetEffectAreas', (self) => getEffectAreas(mp, self));
  mp.registerPapyrusFunction('method', 'Potion', 'GetEffectDurations', (self) => getEffectDurations(mp, self));
  mp.registerPapyrusFunction('method', 'Potion', 'GetMagicEffects', (self) => getMagicEffects(mp, self));
};
