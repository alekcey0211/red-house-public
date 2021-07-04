import { evalClient } from '../properties/eval';
import { Ctx } from '../types/ctx';
import { Mp, PapyrusObject, PapyrusValue } from '../types/mp';
import { FunctionInfo } from '../utils/functionInfo';
import { getNumber, getObject } from '../utils/papyrusArgs';

const _play = (mp: Mp, selfId: number, refId: number, duration: number): void => {
  const { n = 0 } = mp.get(refId, 'activeShader') ?? {};
  mp.set(refId, 'activeShader', { n: n + 1, id: selfId, duration });
  setTimeout(() => {
    mp.set(refId, 'activeShader', { n: n + 2 });
  }, 200);
};
export const play = (mp: Mp, self: PapyrusObject, args: PapyrusValue[]): void => {
  const selfId = mp.getIdFromDesc(self.desc);
  const ref = getObject(args, 0);
  const refId = mp.getIdFromDesc(ref.desc);
  const duration = getNumber(args, 1);
  _play(mp, selfId, refId, duration);
};

export const register = (mp: Mp) => {
  mp.registerPapyrusFunction('method', 'EffectShader', 'Play', (self, args) => play(mp, self, args));
  // mp.registerPapyrusFunction('method', 'EffectShader', 'Stop', (self) => getHitShader(mp, self));
};
