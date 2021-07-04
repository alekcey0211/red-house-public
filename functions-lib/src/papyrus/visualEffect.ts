import { Mp, PapyrusObject, PapyrusValue } from '../types/mp';
import { getNumber, getObject } from '../utils/papyrusArgs';

const _play = (mp: Mp, selfId: number, refId: number, duration: number, facingRefId: number): void => {
  const { n = 0 } = mp.get(refId, 'activeVisualEffect') ?? {};
  mp.set(refId, 'activeVisualEffect', { n: n + 1, id: selfId, duration, facingRefId });
  setTimeout(() => {
    mp.set(refId, 'activeVisualEffect', { n: n + 2 });
  }, 200);
};
export const play = (mp: Mp, self: PapyrusObject, args: PapyrusValue[]): void => {
  const selfId = mp.getIdFromDesc(self.desc);
  const ref = getObject(args, 0);
  const refId = mp.getIdFromDesc(ref.desc);
  const facingRef = getObject(args, 0);
  const facingRefId = mp.getIdFromDesc(facingRef.desc);
  const duration = getNumber(args, 1);
  _play(mp, selfId, refId, duration, facingRefId);
};
export const playEx = (mp: Mp, selfNull: null, args: PapyrusValue[]): void => {
  const self = getObject(args, 0);
  const selfId = mp.getIdFromDesc(self.desc);
  const ref = getObject(args, 1);
  const refId = mp.getIdFromDesc(ref.desc);
  const duration = getNumber(args, 2);
  const facingRef = getObject(args, 3);
  const facingRefId = mp.getIdFromDesc(facingRef.desc);
  _play(mp, selfId, refId, duration, facingRefId);
};

export const register = (mp: Mp) => {
  mp.registerPapyrusFunction('method', 'VisualEffect', 'Play', (self, args) => play(mp, self, args));
  mp.registerPapyrusFunction('global', 'VisualEffectEx', 'Play', (self, args) => playEx(mp, self, args));
  // mp.registerPapyrusFunction('method', 'EffectShader', 'Stop', (self) => getHitShader(mp, self));
};
