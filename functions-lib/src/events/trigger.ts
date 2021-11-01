import * as m from '../modules';
import { Mp } from '../types/mp';

export const register = (mp: Mp): void => {
	mp.registerPapyrusFunction('global', 'RHF_Modules', 'OnTriggerEnter', (self, args) => onTriggerEnter(mp, args));
	mp.registerPapyrusFunction('global', 'RHF_Modules', 'OnTriggerLeave', (self, args) => onTriggerLeave(mp, args));
};

function onTriggerEnter(mp: Mp, args: any[]) {
	const triggerRef = args[0];
	mp.modules.forEach((module) => {
		try {
			if (!module.onTriggerEnter) return;
			module.onTriggerEnter(new m.Actor(triggerRef));
		} catch (err) {
			console.error(`error in module ${module.name} onTriggerEnter`, err);
		}
	});
}

function onTriggerLeave(mp: Mp, args: any[]) {
	const triggerRef = args[0];
	mp.modules.forEach((module) => {
		try {
			if (!module.onTriggerLeave) return;
			module.onTriggerLeave(new m.Actor(triggerRef));
		} catch (err) {
			console.error(`error in module ${module.name} onTriggerLeave`, err);
		}
	});
}
