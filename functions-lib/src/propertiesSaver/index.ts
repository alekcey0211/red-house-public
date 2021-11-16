import { Mp } from '../types/mp';
import { checkAndCreatePropertyExist } from '../papyrus/multiplayer/functions';

type Property = {
	formId: number;
	prop: string;
	value: unknown;
};

const ignoreProperties: string[] = [
	'pos',
	'worldOrCellDesc',
	'angle',
	'inventory',
	'eval',
	'uiOpened',
	'browserFocused',
	'browserVisible',
	'browserModal',
	'isBlocking',
	'isWeaponDrawn',
	'isFlying',
	'isSprinting',
	'communicationId',
	'actionType',
	'party',
	'leader',
	'groupMembers',
	'chromeInputFocus',
	'isDead',
	'staminaNumChanges',
	'lastAnimation',
	'CurrentCrosshairRef',
];

let properties: Property[] = [];

export const addToQueue = (formId: number, prop: string, value: unknown): void => {
	const property: Property = {
		formId,
		prop,
		value,
	};

	properties.push(property);
};

export const runPropertiesSaver = (mp: Mp): void => {
	setTimeout(() => {
		console.debug('Saving properties');

		properties.forEach((property) => {
			try {
				saveProperty(mp, property);
			} catch {}
		});

		properties = [];

		runPropertiesSaver(mp);
	}, 60 * 1000);
};

const saveProperty = (mp: Mp, property: Property): void => {
	if (ignoreProperties.includes(property.prop)) return;

	try {
		const fileName = `properties\\${property.formId}.json`;
		const data = mp.readDataFile(fileName);
		const jsonFromFile: Record<string, unknown> = data ? JSON.parse(data) : {};

		jsonFromFile[property.prop] = property.value;

		const jsonToSave = JSON.stringify(jsonFromFile);

		mp.writeDataFile(fileName, jsonToSave);
	} catch {}
};

export const getAllPropsFromData = (mp: Mp): void => {
	const files = mp.readDataDirectory().filter((name) => {
		return name.includes('properties\\') && name.includes('.json');
	});

	files.forEach((file) => {
		try {
			const props = JSON.parse(mp.readDataFile(file));

			const id: number = parseInt(file.slice(11, -5), 10);

			Object.entries(props).forEach(([propName, propValue]) => {
				if (ignoreProperties.includes(propName)) return;

				checkAndCreatePropertyExist(mp, id, propName);

				try {
					mp.set(id, propName, propValue);
				} catch (e) {
					console.debug(e);
				}
			});
		} catch {}
	});
};
