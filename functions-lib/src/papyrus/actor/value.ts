import { actorValues as av } from '../../properties/actor/actorValues/attributes';
import { Mp, PapyrusObject, PapyrusValue } from '../../types/mp';
import { getString, getNumber } from '../../utils/papyrusArgs';
import { Attr } from '../../properties/actor/actorValues/attributes';

export const setActorValue = (mp: Mp, self: PapyrusObject, args: PapyrusValue[]) => {
	const selfId = mp.getIdFromDesc(self.desc);
	const avName = getString(args, 0) as Attr;
	const avValue = getNumber(args, 1);

	av.set(selfId, avName, 'base', avValue);
};

export const getActorValue = (mp: Mp, self: PapyrusObject, args: PapyrusValue[]) => {
	const selfId = mp.getIdFromDesc(self.desc);
	const avName = getString(args, 0) as Attr;
	return av.getCurrent(selfId, avName);
};

export const damageActorValue = (mp: Mp, self: PapyrusObject, args: PapyrusValue[]) => {
	const selfId = mp.getIdFromDesc(self.desc);
	const avName = getString(args, 0) as Attr;
	const avValue = getNumber(args, 1);
	const damage = av.get(selfId, avName, 'damage');
	av.set(selfId, avName, 'damage', damage - avValue);
};

export const restoreActorValue = (mp: Mp, self: PapyrusObject, args: PapyrusValue[]) => {
	const selfId = mp.getIdFromDesc(self.desc);
	const avName = getString(args, 0) as Attr;
	const avValue = getNumber(args, 1);
	const damage = av.get(selfId, avName, 'damage');
	av.set(selfId, avName, 'damage', damage + avValue > 0 ? 0 : damage + avValue);
};

// TODO: what if player has modAV?
export const modActorValue = (mp: Mp, self: PapyrusObject, args: PapyrusValue[]) => {
	const selfId = mp.getIdFromDesc(self.desc);
	const avName = getString(args, 0) as Attr;
	const avValue = getNumber(args, 1);
	av.set(selfId, avName, 'temporary', avValue);
};
