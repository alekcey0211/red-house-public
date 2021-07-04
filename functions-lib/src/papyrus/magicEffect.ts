import { Mp, PapyrusObject, PapyrusValue } from '../types/mp';
import { uint32 } from '../utils/helper';
import { getObject } from '../utils/papyrusArgs';
import { getForm } from './game';

export const getHitShaderId = (mp: Mp, selfNull: null, args: PapyrusValue[]): number | null => {
  const self = getObject(args, 0);
  const selfId = mp.getIdFromDesc(self.desc);

  const rec = mp.lookupEspmRecordById(selfId).record;
  if (!rec) return null;

  const data = rec.fields.find((x) => x.type === 'DATA')?.data;
  if (!data) return null;

  return uint32(data.buffer, 0x20);
};

export const getHitShader = (mp: Mp, self: PapyrusObject): PapyrusObject | null => {
  const hitShaderId = getHitShaderId(mp, null, [self]);
  if (!hitShaderId) return null;

  return getForm(mp, null, [hitShaderId]) ?? null;
};

export const register = (mp: Mp) => {
  mp.registerPapyrusFunction('method', 'MagicEffect', 'GetHitShader', (self) => getHitShader(mp, self));
  mp.registerPapyrusFunction('global', 'MagicEffectEx', 'GetHitShaderId', (self, args) =>
    getHitShaderId(mp, self, args)
  );
};
