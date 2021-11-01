import { ObjectReference } from '../../modules';
import { Mp, PapyrusObject } from '../../types/mp';

export interface LvlObject {
	id: number;
	count: number;
	level: number;
}

export interface CntoObject {
	id: number;
	count: number;
}

let lvlLists: Record<number, LvlObject[]> | null = null;
let lvlNpcLists: Record<number, LvlObject[]> | null = null;
let cntoLists: Record<number, CntoObject[]> | null = null;
// let outfitLists: Record<number, number[]> | null = null;

export const getLvlListObjects = (mp: Mp, self: PapyrusObject): LvlObject[] => {
	const selfId = mp.getIdFromDesc(self.desc);

	const lvlListId = getLvlListId(mp, selfId);

	checkAndLoadLists(mp);

	const lvlListArray: LvlObject[] = [];

	lvlListArray.push(...getLvlListFromBaseId(mp, selfId));

	lvlListArray.push(...getLvlListFromTemplate(mp, selfId));

	lvlListArray.push(...getLvlListFromId(mp, lvlListId));

	lvlListArray.push(...getLvlListFromId(mp, selfId));

	return lvlListArray;
};

const getLvlListFromId = (mp: Mp, id: number): LvlObject[] => {
	if (id === 0) return [];

	const lvlListArray: LvlObject[] = [];

	if (lvlLists![id]) {
		lvlLists![id].forEach((element) => {
			if (lvlLists![element.id]) {
				const itemChance = getLvlListChance(mp, element.id) / 100;
				const elementLvlList = getLvlListFromId(mp, element.id);

				if (!elementLvlList) return [];

				elementLvlList.forEach((value) => {
					const chance = Math.random();

					if (chance < itemChance) {
						lvlListArray.push(value);
					}
				});
			} else {
				lvlListArray.push(element);
			}
		});
	} else if (lvlNpcLists![id]) {
		lvlNpcLists![id].forEach((element) => {
			lvlListArray.push(...getLvlListFromId(mp, element.id));
		});
	} else if (!lvlLists![id] && !lvlNpcLists![id]) {
		lvlListArray.push(...getLvlListFromBaseId(mp, id));
		lvlListArray.push(...getLvlListFromTemplate(mp, id));

		if (lvlListArray === []) lvlListArray.push({ id, count: 1, level: 1 });

		if (cntoLists![id]) {
			cntoLists![id].forEach((value) => {
				const lvlObj: LvlObject = {
					id: value.id,
					count: value.count,
					level: 1,
				};

				lvlListArray.push(lvlObj);
			});
		}

		// const outfitId = getOutfitId(mp, id);

		// if (outfitLists![outfitId]) {
		// 	outfitLists![outfitId].forEach((outfit) => {
		// 		const lvlOutfit: LvlObject[] = getLvlListFromId(mp, outfit);
		// 		lvlListArray.push(...lvlOutfit);
		// 	});
		// }
	}

	return lvlListArray;
};

// const getOutfitId = (mp: Mp, id: number) => {
// 	const espmRecord = mp.lookupEspmRecordById(id);
// 	const doft = espmRecord.record?.fields.find((x) => x.type === 'DOFT')?.data;
//
// 	if (doft) {
// 		const dataView = new DataView(doft.buffer);
// 		const outfitId = dataView.getUint32(0, true);
//
// 		return outfitId;
// 	}
//
// 	return 0;
// };

const getLvlListFromBaseId = (mp: Mp, id: number): LvlObject[] => {
	const baseId = ObjectReference.get(id)?.getBaseObject()?.getFormID();

	if (!baseId) return [];

	const lvlListId = getLvlListId(mp, baseId);

	const lvlList: LvlObject[] = [];

	lvlList.push(...getLvlListFromId(mp, baseId));
	lvlList.push(...getLvlListFromId(mp, lvlListId));

	return lvlList;
};

const getLvlListFromTemplate = (mp: Mp, id: number): LvlObject[] => {
	if (id === 0) return [];

	const templateId = getTemplate(mp, id);

	const lvlListArray: LvlObject[] = [];

	if (lvlNpcLists![templateId]) {
		lvlNpcLists![templateId].forEach((value) => {
			lvlListArray.push(...getLvlListFromId(mp, getLvlListId(mp, value.id)));
		});
	}

	const lvlListId = getLvlListId(mp, templateId);

	lvlListArray.push(...getLvlListFromId(mp, templateId));
	lvlListArray.push(...getLvlListFromId(mp, lvlListId));

	return lvlListArray ?? [];
};

const getTemplate = (mp: Mp, id: number): number => {
	const object: PapyrusObject = { type: 'form', desc: mp.getDescFromId(id) };
	const espmRecord = mp.lookupEspmRecordById(mp.getIdFromDesc(object.desc));
	const tplt = espmRecord.record?.fields.find((x) => x.type === 'TPLT')?.data;

	if (tplt) {
		const dataView = new DataView(tplt.buffer);
		const templateId = dataView.getUint32(0, true);

		return templateId;
	}

	return 0;
};

const getLvlListId = (mp: Mp, id: number): number => {
	const espmRecord = mp.lookupEspmRecordById(id);
	const inam = espmRecord.record?.fields.find((x) => x.type === 'INAM')?.data;
	if (inam) {
		const dataView = new DataView(inam.buffer);
		const lvlListId = dataView.getUint32(0, true);
		return lvlListId;
	}

	return 0;
};

const getLvlListChance = (mp: Mp, id: number) => {
	const espmRecord = mp.lookupEspmRecordById(id);
	const lvld = espmRecord.record?.fields.find((x) => x.type === 'LVLD')?.data;
	if (lvld) {
		const dataView = new DataView(lvld.buffer);
		const chance = dataView.getUint8(0);

		return chance === 0 ? 100 / lvlLists![id].length : chance / lvlLists![id].length;
	}

	return 0;
};

const checkAndLoadLists = (mp: Mp) => {
	if (!lvlLists) {
		lvlLists = JSON.parse(mp.readDataFile('xelib/lvl-list.json')) as Record<number, LvlObject[]>;
	}

	if (!lvlNpcLists) {
		lvlNpcLists = JSON.parse(mp.readDataFile('xelib/lvl-npc-list.json')) as Record<number, LvlObject[]>;
	}

	if (!cntoLists) {
		cntoLists = JSON.parse(mp.readDataFile('xelib/cnto-npc_.json')) as Record<number, LvlObject[]>;
	}

	// if (!outfitLists) {
	// 	outfitLists = JSON.parse(mp.readDataFile('xelib/outfits.json')) as Record<number, number[]>;
	// }
};
