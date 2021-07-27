import { actorValues } from '../../properties/actor/actorValues/attributes';
import { Mp, PapyrusObject, PapyrusValue } from '../../types/mp';
import { getString, getNumber, getObject } from '../../utils/papyrusArgs';
import { Attr } from '../../properties/actor/actorValues/attributes';

export const setActorValue = (mp: Mp, self: PapyrusObject, args: PapyrusValue[]) => {
	const selfId = mp.getIdFromDesc(self.desc);
	const avName = getString(args, 0) as Attr;
	const avValue = getNumber(args, 1);

	actorValues.set(selfId, avName, 'base', avValue);
};

export const getActorValue = (mp: Mp, self: PapyrusObject, args: PapyrusValue[]) => {
	const selfId = mp.getIdFromDesc(self.desc);
	const avName = getString(args, 0) as Attr;
	// actorValues.getCurrent(selfId, avName)
	// const base = actorValues.get(selfId, avName, 'base') ?? 100;
	// const damage = actorValues.get(selfId, avName, 'damage') ?? 0;

	return actorValues.getCurrent(selfId, avName);
};

export const damageActorValue = (mp: Mp, self: PapyrusObject, args: PapyrusValue[]) => {
	const selfId = mp.getIdFromDesc(self.desc);
	const avName = getString(args, 0) as Attr;
	const avValue = getNumber(args, 1);

	const damage = actorValues.get(selfId, avName, 'damage');
	actorValues.set(selfId, avName, 'damage', damage - avValue);
};

export const restoreActorValue = (mp: Mp, self: PapyrusObject, args: PapyrusValue[]) => {
	const selfId = mp.getIdFromDesc(self.desc);
	const avName = getString(args, 0) as Attr;
	const avValue = getNumber(args, 1);

	const damage = actorValues.get(selfId, avName, 'damage');
	actorValues.set(selfId, avName, 'damage', damage + avValue > 0 ? 0 : damage + avValue);
};

export const addSkillExperience = (mp: Mp, self: null, args: PapyrusValue[]) => {
	const ac = getObject(args, 0);
	const acId = mp.getIdFromDesc(ac.desc);
	// TODO: get name from self ActorValueInfo
	const avName = getString(args, 1);
	const exp = getNumber(args, 2);

	// const currentAvValue = mp.get(acId, `av${avName}`);
	// const currentExp = mp.get(acId, `av${avName}Exp`);

	// // const formula = () => 100;
	// const formula = () => (65 * currentAvValue ** 1.19 + 1925) * 1;

	// if (currentExp + exp >= formula()) {
	// 	mp.set(acId, `av${avName}`, currentAvValue + 1);
	// 	mp.set(acId, `av${avName}Exp`, currentExp + exp - 100);
	// } else {
	// 	mp.set(acId, `av${avName}Exp`, currentExp + exp);
	// }
};
