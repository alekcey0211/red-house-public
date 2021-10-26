import { serverOptionProvider } from '../..';
import { Form, Game, Actor } from '../modules';
import { throwOutById } from '../papyrus/actor';
import { getLvlListObjects, LvlObject } from '../papyrus/form/lvl-list';
import { ServerOption } from '../papyrus/game/server-options';
import { getRespawnTimeById } from '../papyrus/objectReference';
import { getAttr, raceDefaultAttr } from '../papyrus/race';
import { actorValues as av } from '../properties/actor/actorValues/attributes';
import { evalClient } from '../properties/eval';
import { Ctx } from '../types/ctx';
import { Mp, PapyrusObject } from '../types/mp';
import { FunctionInfo } from '../utils/functionInfo';

export const initAVFromRace = (mp: Mp, pcFormId: number, serverOptions?: ServerOption): void => {
	if (mp.get(pcFormId, 'isDead') !== undefined) return;

	if (!mp.get(pcFormId, 'spawnTimeToRespawn')) {
		const time = getRespawnTimeById(mp, null, [pcFormId]);
		mp.set(pcFormId, 'spawnTimeToRespawn', time);
	}

	const raceAttr = serverOptions?.debugAttrAll ? raceDefaultAttr : getAttr(mp, pcFormId);

	av.setDefaults(
		pcFormId,
		{ force: true },
		{
			...raceAttr,
			oneHanded: 1,
			twoHanded: 1,
			marksman: 1,
			block: 1,
			smithing: 100,
			heavyArmor: 1,
			lightArmor: 1,
			pickpocket: 1,
			lockpicking: 1,
			sneak: 1,
			alchemy: 1,
			speechcraft: 1,
			alteration: 1,
			conjuration: 1,
			destruction: 1,
			illusion: 1,
			restoration: 1,
			enchanting: 1,
		}
	);
};

export const logExecuteTime = (startTime: number, eventName: string): void => {
	if (Date.now() - startTime > 10) {
		console.log('[PERFOMANCE]', `Event ${eventName}: `, Date.now() - startTime);
	}
};

export const throwOrInit = (mp: Mp, id: number, serverOptions?: ServerOption): void => {
	if (!serverOptions) serverOptions = serverOptionProvider.getServerOptions();
	if (id < 0x5000000 && mp.get(id, 'worldOrCellDesc') !== '0' && !serverOptions.isVanillaSpawn) {
		throwOutById(mp, id);
	} else if (!mp.get(id, 'spawnTimeToRespawn')) {
		// #region Add loot to mob

		try {
			const mob: PapyrusObject = { type: 'form', desc: mp.getDescFromId(id) };
			const mobActor: Actor = Actor.get(id)!;

			// Check actor is not a human
			if (!mobActor.isHuman()) {
				// Get Lvl-List
				const lvlObjects: LvlObject[] = getLvlListObjects(mp, mob);

				// Set level for mob
				const lvl = Math.floor(Math.random() * 60);

				// Adding items
				lvlObjects.forEach((item) => {
					const itemToAdd: Form = Game.getForm(item.id)!;

					if (!(mobActor.getItemCount(itemToAdd) > 0) && itemToAdd.getName() !== 'NOT_FOUND' && item.level < lvl) {
						mobActor.addItem(itemToAdd, item.count);
					}
				});
			} else if (id < 0x5000000) {
				throwOutById(mp, id);
			}
		} catch (err) {
			console.log('[ERROR] add lvl list items 1');
		}

		// #endregion

		try {
			initAVFromRace(mp, id, serverOptions);
		} catch (err) {
			console.log('[ERROR] initAVFromRace', err);
		}
	}
};

export const overrideNotify = (mp: Mp, formId: number): void => {
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
			// ctx.sp.printConsole = (...argumets: any[]) => {
			// 	const s: any = ctx.sp.storage._api_onPrintConsole;
			// 	if (s?.callback) s.callback(...argumets);
			// };
		});
	};
	evalClient(mp, formId, new FunctionInfo(func).getText({}), false, true);
};
