import { IKeyword } from '../../..';
import { Mp, PapyrusObject, PapyrusValue } from '../../types/mp';
import { getString } from '../../utils/papyrusArgs';

let keywordAll: Record<string, number> | null = null;
export const getKeyword = (mp: Mp, self: null, args: PapyrusValue[]): PapyrusObject | undefined => {
	const editorId = getString(args, 0);

	if (!keywordAll) {
		keywordAll = JSON.parse(mp.readDataFile('xelib/KYWD.json')) as Record<string, number>;
	}

	const id = keywordAll[editorId];
	if (typeof id === 'number') {
		return {
			desc: mp.getDescFromId(id),
			type: 'espm',
		};
	}
};

export const getIdKeyword = (mp: Mp, self: null, args: PapyrusValue[]): PapyrusValue | undefined => {
	const editorId = getString(args, 0);

	if (!keywordAll) {
		keywordAll = JSON.parse(mp.readDataFile('xelib/KYWD.json')) as Record<string, number>;
	}

	const id = keywordAll[editorId];
	if (typeof id === 'number') {
		return id;
	}
};

export const register = (mp: Mp): void => {
	mp.registerPapyrusFunction('global', 'Keyword', 'GetKeyword', (self, args) => getKeyword(mp, self, args));
	mp.registerPapyrusFunction('global', 'KeywordEx', 'GetKeyword', (self, args) => getKeyword(mp, self, args));
	mp.registerPapyrusFunction('global', 'KeywordEx', 'GetIdKeyword', (self, args) => getIdKeyword(mp, self, args));

	IKeyword.GetKeyword = (args: PapyrusValue[]) => getKeyword(mp, null, args);
};
