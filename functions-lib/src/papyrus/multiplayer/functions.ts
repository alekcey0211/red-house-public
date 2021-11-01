import { Mp } from '../../types/mp';

export const handleNotExistsProperty = (err: string): boolean => {
	const regex = /Property.+doesn't exist/gm;
	return regex.exec(err) !== null;
};

export const propertyExist = (mp: Mp, formId: number, key: string): boolean => {
	try {
		mp.get(formId, key);
		return true;
	} catch (err) {
		if (handleNotExistsProperty(err as string)) {
			return false;
		}
		console.log(err);
	}
	return false;
};

export const checkAndCreatePropertyExist = (mp: Mp, formId: number, key: string): void => {
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

export const statePropFactory = (mp: Mp, stateName: string, sync: boolean = false): void => {
	mp.makeProperty(stateName, {
		isVisibleByOwner: sync,
		isVisibleByNeighbors: sync,
		updateOwner: '',
		updateNeighbor: '',
	});
};
