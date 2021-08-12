import { serverOptionProvider } from '../..';
import { throwOutById } from '../papyrus/actor';
import { ServerOption } from '../papyrus/game/server-options';
import { getRespawnTimeById } from '../papyrus/objectReference';
import { getAttr } from '../papyrus/race';
import { actorValues as av } from '../properties/actor/actorValues/attributes';
import { evalClient } from '../properties/eval';
import { Ctx } from '../types/ctx';
import { Mp } from '../types/mp';
import { FunctionInfo } from '../utils/functionInfo';

export const initAVFromRace = (mp: Mp, pcFormId: number, serverOptions?: ServerOption) => {
	if (mp.get(pcFormId, 'isDead') !== undefined) return;

	if (!mp.get(pcFormId, 'spawnTimeToRespawn')) {
		const time = getRespawnTimeById(mp, null, [pcFormId]);
		mp.set(pcFormId, 'spawnTimeToRespawn', time);
	}

	const raceAttr = getAttr(mp, pcFormId);

	av.setDefaults(pcFormId, { force: true }, raceAttr);
};

export const logExecuteTime = (startTime: number, eventName: string) => {
	if (Date.now() - startTime > 10) {
		console.log('[PERFOMANCE]', `Event ${eventName}: `, Date.now() - startTime);
	}
};

export const throwOrInit = (mp: Mp, id: number, serverOptions?: ServerOption) => {
	if (!serverOptions) serverOptions = serverOptionProvider.getServerOptions();
	if (id < 0x5000000 && mp.get(id, 'worldOrCellDesc') !== '0' && !serverOptions.isVanillaSpawn) {
		throwOutById(mp, id);
	} else if (!mp.get(id, 'spawnTimeToRespawn')) {
		try {
			initAVFromRace(mp, id, serverOptions);
		} catch (err) {
			console.log('[ERROR] initAVFromRace', err);
		}
	}
};

export const overrideNotify = (mp: Mp, formId: number) => {
	const func = (ctx: Ctx) => {
		ctx.sp.once('update', () => {
			const notify = (msg: string) => {
				const src: string[] = [];
				const countRegex = /(\d+)/;
				const countRemoveRegex = /[(].+[)]$/gm;
				const typeRemoveRegex = /^[+-]\s/gm;
				const getType = (msg: string) => {
					if (msg.startsWith('+')) return 'additem';
					if (msg.startsWith('-')) return 'deleteitem';
					return 'default';
				};
				const type = getType(msg);
				const match = msg.match(countRegex) ?? [];
				const count = +match[0];
				const message = msg.replace(countRemoveRegex, '').replace(typeRemoveRegex, '');

				const data = { message, type, count };
				src.push(`
				window.storage.dispatch({
					type: 'COMMAND',
					data: {
						commandType: 'INFOBAR_ADD_MESSAGE',
						alter: ['${JSON.stringify(data)}']
					}
				})
				`);
				ctx.sp.browser.executeJavaScript(src.join('\n'));
			};
			ctx.sp.Debug.notification = notify;
			ctx.sp.printConsole = (...argumets: any[]) => {
				const s: any = ctx.sp.storage._api_onPrintConsole;
				if (s?.callback) s.callback(...argumets);
			};
		});
	};
	evalClient(mp, formId, new FunctionInfo(func).getText({}), false, true);
};
