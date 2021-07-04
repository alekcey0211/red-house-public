import { Mp } from '../../types/mp';

export const handleNotExistsProperty = (err: string) => {
	const regex = /Property.+doesn't exist/gm;
	return regex.exec(err) !== null;
};

export const propertyExist = (mp: Mp, formId: number, key: string) => {
	try {
		mp.get(formId, key);
		return true;
	} catch (err) {
		if (handleNotExistsProperty(err as string)) {
			return false;
		}
		console.log(err);
	}
};

export const checkAndCreatePropertyExist = (mp: Mp, formId: number, key: string) => {
	try {
		mp.get(formId, key);
	} catch (err) {
		if (handleNotExistsProperty(err as string)) {
			statePropFactory(mp, key);
			return;
		}
		console.log(err);
	}
};

export const statePropFactory = (mp: Mp, stateName: string, sync: boolean = false) => {
	mp.makeProperty(stateName, {
		isVisibleByOwner: sync,
		isVisibleByNeighbors: sync,
		updateOwner: '',
		updateNeighbor: '',
	});
};
