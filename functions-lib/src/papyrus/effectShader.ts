import { Mp, PapyrusObject, PapyrusValue } from '../types/mp';
import { getNumber, getObject } from '../utils/papyrusArgs';

interface ActiveShader {
	n: number;
	id: number;
	duration: number;
}

const _play = (mp: Mp, selfId: number, refId: number, duration: number): void => {
	const { n = 0 } = mp.get<ActiveShader>(refId, 'activeShader') ?? {};
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
