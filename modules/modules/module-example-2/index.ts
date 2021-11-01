import { HelloFrom } from '../../shared/example-shared';

export class TSModuleSample extends JSModule {
	constructor() {
		super();
		HelloFrom('TS SAMPLE');
	}

	onLoadGame(player: Actor): void {
		M.sendChatMessage(player, 'Hi from ts sample');
	}
}

mp.addJSModule(new TSModuleSample());
