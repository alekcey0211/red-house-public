import { HelloFrom } from '../../shared/example-shared';

export class JSModuleSample extends JSModule {
	constructor() {
		super();
		HelloFrom('JS SAMPLE');
	}

	onLoadGame(player) {
		M.sendChatMessage(player, 'Hi from js sample');
	}
}

mp.addJSModule(new JSModuleSample());
