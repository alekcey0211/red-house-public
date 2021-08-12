import { Mp, PapyrusObject } from '../types/mp';

export const handleServerMsg = (mp: Mp, pcFormId: number, data: Record<string, unknown>) => {
	switch (data.action) {
		case 'disconnect':
			console.log(pcFormId.toString(16), 'disconnect');
			const ac: PapyrusObject = { type: 'form', desc: mp.getDescFromId(pcFormId) };
			break;

		default:
			break;
	}
};
