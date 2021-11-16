import { skillList } from '../../properties/actor/actorValues/skillList';
import { Mp, PapyrusValue } from '../../types/mp';
import { getNumber, getObject, getString } from '../../utils/papyrusArgs';
import { getForm } from '../game';

const getActorValueInfoByName = (mp: Mp, self: null, args: PapyrusValue[]) => {
	const name = getString(args, 0);
	if (skillList[name]) {
		return getActorValueInfoByID(mp, self, [skillList[name]]);
	}
};

const getActorValueInfoByID = (mp: Mp, self: null, args: PapyrusValue[]): PapyrusValue => {
	const formId = getNumber(args, 0);
	return { type: 'espm', desc: mp.getDescFromId(formId) };
};

// const addSkillExperience = (mp: Mp, self: PapyrusObject, args: PapyrusValue[]) => {
// const selfId = mp.getIdFromDesc(self.desc);
// TODO: don`t use 0xff000000, should be the current actor
// const acId = 0xff000000;
// const exp = getNumber(args, 0);
// TODO: get name from self ActorValueInfo
// const avName = 'OneHanded';
// const currentExp = mp.get(acId, `av${avName}Exp`);
// mp.set(acId, `av${avName}Exp`, currentExp + exp);
// if (currentExp + exp >= 100) {
//   const currentAvValue = mp.get(acId, `av${avName}`);
//   mp.set(acId, `av${avName}`, currentAvValue + 1);
//   mp.set(acId, `av${avName}Exp`, 0);
// }
// };

interface SkillItem {
	name?: string;
	desc?: string;
	tree?: PerkTreeItem[];
}
interface PerkTreeItem {
	p?: { id: number; name: string } | null;
	x?: number;
	y?: number;
	h?: number;
	v?: number;
	i?: number;
	c?: number[];
}
export const getPerkTree = (mp: Mp, self: null, args: PapyrusValue[]): string => {
	const skill = getObject(args, 0);
	const skillId = mp.getIdFromDesc(skill.desc);
	const espmRecord = mp.lookupEspmRecordById(skillId);
	if (!espmRecord.record) return '';

	const espmFields = espmRecord.record.fields;
	const perkTree = [];

	let index1 = 0;
	let index2 = 0;
	while (index1 !== -1 && index2 !== -1) {
		index1 = espmFields.findIndex((x) => x.type === 'PNAM');
		index2 = espmFields.findIndex((x) => x.type === 'INAM');
		if (index1 !== -1 && index2 !== -1) {
			const obj: PerkTreeItem = {};
			const fields = espmFields.splice(index1, index2 - index1 + 1);

			const getInt = (n: string) => {
				const d = fields.find((x) => x.type === n)?.data;
				return d && new DataView(d.buffer).getUint32(0, true);
			};
			const getFloat = (n: string) => {
				const d = fields.find((x) => x.type === n)?.data;
				return d && new DataView(d.buffer).getFloat32(0, true);
			};

			const perkId = getInt('PNAM');
			const perk = perkId && getForm(mp, null, [perkId]);
			const perkName = perk && mp.callPapyrusFunction('global', 'FormEx', 'GetName', null, [perk]);
			if (perkId === 0) {
				obj.p = null;
			} else {
				obj.p = { id: perkId ?? -1, name: perkName?.toString() ?? '' };
			}
			obj.x = getInt('XNAM');
			obj.y = getInt('YNAM');
			obj.h = getFloat('HNAM');
			obj.v = getFloat('VNAM');
			obj.i = getInt('INAM');
			obj.c = fields.filter((x) => x.type === 'CNAM').map((x) => new DataView(x.data.buffer).getUint32(0, true));

			perkTree.push(obj);
		}
	}

	const skillItem: SkillItem = {
		name: mp.callPapyrusFunction('global', 'FormEx', 'GetName', null, [skill])?.toString(),
		desc: mp.callPapyrusFunction('global', 'FormEx', 'GetDescription', null, [skill])?.toString(),
		tree: perkTree,
	};
	return JSON.stringify(skillItem);
};

export const register = (mp: Mp): void => {
	mp.registerPapyrusFunction('global', 'ActorValueInfo', 'GetActorValueInfoByID', (self, args) =>
		getActorValueInfoByID(mp, self, args)
	);
	mp.registerPapyrusFunction('global', 'ActorValueInfo', 'GetAVIByID', (self, args) =>
		getActorValueInfoByID(mp, self, args)
	);
	mp.registerPapyrusFunction('global', 'ActorValueInfo', 'GetActorValueInfoByName', (self, args) =>
		getActorValueInfoByName(mp, self, args)
	);
	mp.registerPapyrusFunction('global', 'ActorValueInfo', 'GetAVIByName', (self, args) =>
		getActorValueInfoByName(mp, self, args)
	);

	// mp.registerPapyrusFunction('method', 'ActorValueInfo', 'AddSkillExperience', (self, args) =>
	// addSkillExperience(mp, self, args)
	// );

	mp.registerPapyrusFunction('global', 'ActorValueInfoEx', 'GetPerkTree', (self, args) => getPerkTree(mp, self, args));
};
