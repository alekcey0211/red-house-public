import { getForm } from '../papyrus/game';
import { getRespawnTimeById } from '../papyrus/objectReference';
import { actorValues, AttrAll } from '../properties/actor/actorValues/attributes';
import { EspmLookupResult, Mp, PapyrusObject } from '../types/mp';
import { FunctionInfo } from '../utils/functionInfo';
import {
	onAnimationEvent,
	onCellChange,
	onCloseRaceMenu,
	onCurrentCrosshairChange,
	onEffectStart,
	onEquip,
	onHit,
	onInput,
	onPrintConsole,
	onUiMenuToggle,
} from './functions';
import * as empty from './empty';
import { getFlags } from '../papyrus/activeMagicEffect';
import { getEquipment } from '../papyrus/actor/equip';
import * as position from '../papyrus/objectReference/position';
import { WeaponType } from '../papyrus/weapon/type';
import { getSelfId } from '../papyrus/form';
import { uint16, uint32 } from '../utils/helper';
import { Ctx } from '../types/ctx';
import { evalClient } from '../properties/eval';
import { getPerkEffectData } from '../papyrus/perk';
import { EffectFunctionType } from '../papyrus/perk/type';
import { serverOptionProvider } from '../..';
import { ServerOption } from '../papyrus/game/server-options';
import { Actor } from '../types/skyrimPlatform';
import {
	getRaceHealth,
	getRaceHealRate,
	getRaceId,
	getRaceMagicka,
	getRaceMagickaRate,
	getRaceStamina,
	getRaceStaminaRate,
	getRaceUnarmedDamage,
} from '../papyrus/race';
import { throwOutById } from '../papyrus/actor';

const getAttrFromRace = (mp: Mp, pcFormId: number): Partial<Record<AttrAll, number>> => {
	const defaultReturn: Partial<Record<AttrAll, number>> = {
		health: 100,
		healrate: 0,
		magicka: 100,
		magickarate: 0,
		stamina: 100,
		staminarate: 0,
	};

	const selfId = mp.getIdFromDesc(mp.get(pcFormId, 'baseDesc'));
	const rec = mp.lookupEspmRecordById(selfId).record;
	if (!rec) return defaultReturn;

	const acbs = rec.fields.find((x) => x.type === 'ACBS')?.data;
	const magickaOffset = acbs ? uint16(acbs.buffer, 4) : 0;
	const staminaOffset = acbs ? uint16(acbs.buffer, 6) : 0;
	const level = acbs ? uint16(acbs.buffer, 8) : 0;
	const healthOffset = acbs ? uint16(acbs.buffer, 20) : 0;

	// replace pcFormId with selfId
	// find race in base class
	const raceId = getRaceId(mp, selfId, rec);
	if (!raceId) return defaultReturn;

	mp.set(pcFormId, 'race', raceId);
	const espmRecord = mp.lookupEspmRecordById(raceId) as EspmLookupResult;

	return {
		health: (getRaceHealth(espmRecord) ?? 100) + healthOffset,
		healrate: getRaceHealRate(espmRecord) ?? 0,
		magicka: (getRaceMagicka(espmRecord) ?? 100) + magickaOffset,
		magickarate: getRaceMagickaRate(espmRecord) ?? 0,
		stamina: (getRaceStamina(espmRecord) ?? 100) + staminaOffset,
		staminarate: getRaceStaminaRate(espmRecord) ?? 0,
	};
};
export const initAVFromRace = (mp: Mp, pcFormId: number) => {
	if (mp.get(pcFormId, 'isDead') !== undefined) return;

	if (!mp.get(pcFormId, 'spawnTimeToRespawn')) {
		const time = getRespawnTimeById(mp, null, [pcFormId]);
		mp.set(pcFormId, 'spawnTimeToRespawn', time);
	}

	const raceAttr = getAttrFromRace(mp, pcFormId);

	actorValues.setDefaults(pcFormId, { force: true }, raceAttr);
};
const logExecuteTime = (startTime: number, eventName: string) => {
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
			initAVFromRace(mp, id);
		} catch (err) {
			console.log('[ERROR] initAVFromRace', err);
		}
	}
};

export const register = (mp: Mp): void => {
	mp['_onLoadGame'] = (pcFormId: number) => {
		const start = Date.now();
		console.log('_onLoadGame', pcFormId);
		if (!pcFormId) return console.log('Plz reconnect');
		const ac: PapyrusObject = { type: 'form', desc: mp.getDescFromId(pcFormId) };

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
			});
		};
		evalClient(mp, pcFormId, new FunctionInfo(func).getText({}), true);

		mp.set(pcFormId, 'browserVisible', true);
		mp.set(pcFormId, 'browserModal', false);

		const serverOptions = serverOptionProvider.getServerOptions();
		initAVFromRace(mp, pcFormId, serverOptions);
		const neighbors = mp.get(pcFormId, 'neighbors');
		neighbors
			.filter((n) => mp.get(n, 'type') === 'MpActor')
			.forEach((id) => {
				throwOrInit(mp, id, serverOptions);
			});

		mp.callPapyrusFunction('global', 'GM_Main', '_OnLoadGame', null, [ac]);
		logExecuteTime(start, '_onLoadGame');
	};

	mp['onActivate'] = (target: number, pcFormId: number) => {
		const start = Date.now();
		if (!pcFormId) return console.log('Plz reconnect');

		const casterRef: PapyrusObject = { type: 'form', desc: mp.getDescFromId(pcFormId) };
		const targetRef: PapyrusObject = { type: 'form', desc: mp.getDescFromId(target) };

		try {
			if (mp.get(target, 'blockActivationState')) return false;
		} catch {}
		const actiovation = mp.callPapyrusFunction('global', 'GM_Main', '_onActivate', null, [targetRef, casterRef]);

		logExecuteTime(start, 'onActivate');

		return actiovation ?? true;
	};

	mp.makeEventSource('_onCellChange', new FunctionInfo(onCellChange).body);

	mp['_onCellChange'] = (pcFormId: number, event: any) => {
		const start = Date.now();
		if (!pcFormId) return console.log('Plz reconnect');
		const ac: PapyrusObject = { type: 'form', desc: mp.getDescFromId(pcFormId) };
		const prevCell: PapyrusObject = { type: 'espm', desc: mp.getDescFromId(event.prevCell) };
		const currentCell: PapyrusObject = { type: 'espm', desc: mp.getDescFromId(event.currentCell) };

		const neighbors = mp.get(pcFormId, 'neighbors');
		const serverOptions = serverOptionProvider.getServerOptions();
		neighbors
			.filter((n) => mp.get(n, 'type') === 'MpActor')
			.forEach((id) => {
				throwOrInit(mp, id, serverOptions);
			});

		mp.set(pcFormId, 'cellDesc', currentCell.desc);
		mp.callPapyrusFunction('global', 'GM_Main', '_onCellChange', null, [ac, prevCell, currentCell]);

		logExecuteTime(start, '_onCellChange');
	};

	mp.makeEventSource('_onHit', new FunctionInfo(onHit).getText({ isHitStatic: false }));

	mp['_onHit'] = (pcFormId: number, event: any) => {
		const start = Date.now();

		if (!pcFormId) return console.log('Plz reconnect');

		if (event.target === 0x14) {
			event.target = pcFormId;
		}
		if (event.agressor === 0x14) {
			event.agressor = pcFormId;
		}

		const { HitDamageMod, isPowerAttackMult, isBashAttackMult } = serverOptionProvider.getServerOptions();

		const target: PapyrusObject = { type: 'form', desc: mp.getDescFromId(event.target) };
		const agressor: PapyrusObject = { type: 'form', desc: mp.getDescFromId(event.agressor) };

		let damageMod: number = HitDamageMod;
		const raceId = mp.get<number>(pcFormId, 'race');
		if (raceId) {
			const espmRecord = mp.lookupEspmRecordById(raceId) as EspmLookupResult;
			const unarmedDamage = getRaceUnarmedDamage(espmRecord);
			unarmedDamage && (damageMod = -unarmedDamage);
		}

		// TODO: optimize
		const eq = getEquipment(mp, event.agressor);
		const eq1 = getEquipment(mp, event.target);

		const weap = eq?.inv.entries.filter((x) => x.type === 'WEAP');
		const arm = eq1?.inv.entries.filter((x) => x.type === 'ARMO');
		let isHammer = false;

		// TODO: нужно учитывать оружие в левой руке
		// * BUG: оружие в левой руке не учитывается в свойстве equipment
		if (weap && weap.length > 0) {
			const baseDmg = weap[0].baseDamage;
			baseDmg && (damageMod = baseDmg * -1);
			const type = weap[0].weaponType;
			if (type === WeaponType.BattleaxesANDWarhammers || type === WeaponType.Maces) isHammer = true;
		}

		// класс брони противника
		if (arm && arm.length > 0) {
			arm.forEach((x) => {
				if (!x.baseArmor) return;
				// если оружение это булава, то броню уменьшаю на 25%
				if (isHammer) x.baseArmor * 0.75;

				// снижаю урон от кол-ва брони (12 брони снизит урон на 1.2% или 0.012)
				const percent = 1 - x.baseArmor / 1000;
				damageMod = damageMod * percent;
			});
		}

		if (event.isPowerAttack) {
			damageMod = damageMod * isPowerAttackMult;
		}
		if (event.isBashAttack) {
			damageMod = damageMod * isBashAttackMult;
		}
		const calcPerks = false;

		// TODO: optimize
		if (calcPerks) {
			const targetId = getSelfId(mp, agressor.desc);
			const rec = mp.lookupEspmRecordById(targetId).record;
			const prkr = rec?.fields.filter((x) => x.type === 'PRKR').map((x) => x.data);
			try {
				prkr?.forEach((p) => {
					const perkId = uint32(p.buffer, 0);
					const effectData = getPerkEffectData(mp, perkId);
					effectData?.forEach((eff) => {
						if (!eff) return;
						if (eff.effectType === 0x23 && eff.functionType === EffectFunctionType.MultiplyValue) {
							if (!eff.conditionFunction || !weap || weap.length === 0) return;
							const conditionResult = eff.conditionFunction(weap[0].baseId);
							if (!conditionResult) return;
							if (eff.effectValue) {
								damageMod *= eff.effectValue;
							}
						}
					});
				});
			} catch (error) {
				console.log('Perk effect ERROR', error);
			}
		}

		// const isBlocking = mp.get(pcFormId, 'isBlocking') ?? false;
		if (event.isHitBlocked) {
			damageMod *= 0.5;
		}

		console.log('[HIT]', damageMod);

		const avName = 'health';

		const damage = actorValues.get(event.target, avName, 'damage');
		const newDamageModValue = damage + damageMod;

		// TODO: optimize
		actorValues.set(event.target, avName, 'damage', newDamageModValue);

		// TODO: optimize
		const wouldDie = actorValues.getMaximum(event.target, avName) + newDamageModValue <= 0;

		if (wouldDie && !mp.get(event.target, 'isDead')) {
			mp.onDeath && mp.onDeath(event.target);
		}

		mp.callPapyrusFunction('global', 'GM_Main', '_onHit', null, [
			target,
			agressor,
			event.isPowerAttack,
			event.isSneakAttack,
			event.isBashAttack,
			event.isHitBlocked,
		]);

		logExecuteTime(start, '_onHit');
	};

	mp['onDeath'] = (pcFormId: number) => {
		const start = Date.now();
		const ac: PapyrusObject = { type: 'form', desc: mp.getDescFromId(pcFormId) };
		console.log(`${pcFormId.toString(16)} died`);
		mp.set(pcFormId, 'isDead', true);
		mp.callPapyrusFunction('global', 'GM_Main', '_onDeath', null, [ac]);
		logExecuteTime(start, 'onDeath');
	};

	mp.makeEventSource('_onHitStatic', new FunctionInfo(onHit).getText({ isHitStatic: true }));

	mp['_onHitStatic'] = (pcFormId: number, event: any) => {
		const start = Date.now();
		if (!pcFormId) return console.log('Plz reconnect');

		if (event.target === 0x14) {
			event.target = pcFormId;
		}
		if (event.agressor === 0x14) {
			event.agressor = pcFormId;
		}

		const target: PapyrusObject = { type: 'espm', desc: mp.getDescFromId(event.target) };
		const agressor: PapyrusObject = { type: 'form', desc: mp.getDescFromId(event.agressor) };

		mp.callPapyrusFunction('global', 'GM_Main', '_onHitStatic', null, [
			target,
			agressor,
			event.isPowerAttack,
			event.isSneakAttack,
			event.isBashAttack,
			event.isHitBlocked,
		]);
		logExecuteTime(start, '_onHitStatic');
	};

	mp.makeEventSource('_onEquip', new FunctionInfo(onEquip).tryCatch());

	mp['_onEquip'] = (pcFormId: number, event: { actor: number; target: number; player: number }) => {
		const start = Date.now();
		if (!pcFormId) return console.log('Plz reconnect');

		if (event.actor === 0x14) {
			event.actor = pcFormId;
		}

		const ac: PapyrusObject = { type: 'form', desc: mp.getDescFromId(event.actor) };
		const target: PapyrusObject = { type: 'espm', desc: mp.getDescFromId(event.target) };

		mp.callPapyrusFunction('global', 'GM_Main', '_onEquip', null, [ac, target]);
		logExecuteTime(start, '_onEquip');
	};

	mp['onUiEvent'] = (pcFormId: number, uiEvent: Record<string, unknown>) => {
		const start = Date.now();
		// Server sometimes pass 0, I think serverside hot reload breaks something
		if (!pcFormId) return console.log('Plz reconnect');

		switch (uiEvent.type) {
			case 'cef::chat:send': {
				const text = uiEvent.data;
				if (typeof text === 'string') {
					const ac: PapyrusObject = { type: 'form', desc: mp.getDescFromId(pcFormId) };
					mp.callPapyrusFunction('global', 'GM_Main', '_OnChatInput', null, [ac, text]);
				}
			}
		}
		logExecuteTime(start, 'onUiEvent');
	};

	mp.makeEventSource('_onInput', new FunctionInfo(onInput).tryCatch());

	mp['_onInput'] = (pcFormId: number, keycodes: number[]) => {
		const start = Date.now();
		if (!pcFormId) return console.log('Plz reconnect');
		const ac: PapyrusObject = { type: 'form', desc: mp.getDescFromId(pcFormId) };
		mp.callPapyrusFunction('global', 'GM_Main', '_OnInput', null, [ac, keycodes]);

		const {
			keybindingBrowserSetVisible,
			keybindingBrowserSetFocused,
			command1,
			command2,
			command3,
			command4,
			command5,
			command0,
			command6,
			command7,
			command8,
			command9,
		} = serverOptionProvider.getServerOptions();

		if (!mp.get(pcFormId, 'browserModal')) {
			if (keycodes.length === 1 && keycodes[0] === keybindingBrowserSetVisible) {
				mp.callPapyrusFunction('global', 'M', 'BrowserSetVisible', null, [
					ac,
					!mp.get(pcFormId, 'browserVisible') ?? true,
				]);
			}
			if (keycodes.length === 1 && keycodes[0] === keybindingBrowserSetFocused) {
				mp.callPapyrusFunction('global', 'M', 'BrowserSetFocused', null, [
					ac,
					!mp.get(pcFormId, 'browserFocused') ?? true,
				]);
			}
		}

		const getCommand = () => {
			if (keycodes.includes(56) && keycodes.includes(0x02)) {
				return command1;
			} else if (keycodes.includes(56) && keycodes.includes(0x03)) {
				return command2;
			} else if (keycodes.includes(56) && keycodes.includes(0x04)) {
				return command3;
			} else if (keycodes.includes(56) && keycodes.includes(0x05)) {
				return command4;
			} else if (keycodes.includes(56) && keycodes.includes(0x06)) {
				return command5;
			} else if (keycodes.includes(56) && keycodes.includes(0x07)) {
				return command6;
			} else if (keycodes.includes(56) && keycodes.includes(0x08)) {
				return command7;
			} else if (keycodes.includes(56) && keycodes.includes(0x09)) {
				return command8;
			} else if (keycodes.includes(56) && keycodes.includes(0x0a)) {
				return command9;
			} else if (keycodes.includes(56) && keycodes.includes(0x0b)) {
				return command0;
			}
			return;
		};

		const command = getCommand();
		if (command) {
			mp.callPapyrusFunction('global', 'GM_Main', '_OnChatInput', null, [ac, command]);
		}

		logExecuteTime(start, '_onInput');
	};

	mp.makeEventSource('_onAnimationEvent', new FunctionInfo(onAnimationEvent).tryCatch());

	mp['_onAnimationEvent'] = (pcFormId: number, animationEvent: { current: string; previous: string }) => {
		const start = Date.now();
		// console.log(animationEvent);
		if (!pcFormId) return console.log('Plz reconnect');
		const ac: PapyrusObject = { type: 'form', desc: mp.getDescFromId(pcFormId) };

		const isFall = ['JumpFallDirectional', 'JumpFall'].includes(animationEvent.current);
		const isJump = ['JumpDirectionalStart', 'JumpStandingStart'].includes(animationEvent.current);
		const isJumpLand = animationEvent.current.startsWith('JumpLand');
		const isAttack = animationEvent.current.toLowerCase().startsWith('attack');
		// ? remove isAttackPower because when power attack actor do two simple attack and reduce stamina twice
		// const isAttackPower = animationEvent.current.toLowerCase().startsWith('attackpower');
		let isChangeHp = false;

		mp.set(pcFormId, 'isBlocking', animationEvent.current === 'blockStart');

		const stamina = 'stamina';
		if (isAttack) {
			let { HitStaminaReduce } = serverOptionProvider.getServerOptions();
			const eq = getEquipment(mp, pcFormId);
			const weap = eq?.inv.entries.filter((x) => x.type === 'WEAP');

			if (weap && weap.length > 0) {
				weap[0].weight && (HitStaminaReduce = weap[0].weight);
			}

			if (HitStaminaReduce > 0) {
				const damage = actorValues.get(pcFormId, stamina, 'damage');
				const newDamageModValue = damage - HitStaminaReduce;
				actorValues.set(pcFormId, stamina, 'damage', newDamageModValue);
			}
		}

		if (isJump) {
			const damage = actorValues.get(pcFormId, stamina, 'damage');
			actorValues.set(pcFormId, stamina, 'damage', damage - 5);
		}

		if (isFall || isJump) {
			mp.set(pcFormId, 'startZCoord', position.getPositionZ(mp, ac));
		}

		if (isJumpLand) {
			const startZCoord = mp.get<number>(pcFormId, 'startZCoord');
			if (startZCoord) {
				const diff = startZCoord - position.getPositionZ(mp, ac);
				if (diff > 300) {
					const damage = actorValues.get(pcFormId, 'health', 'damage');
					const newDamageModValue = damage - diff / 100;
					actorValues.set(pcFormId, 'health', 'damage', newDamageModValue);

					const wouldDie = actorValues.getMaximum(pcFormId, 'health') + newDamageModValue <= 0;
					if (wouldDie && !mp.get(pcFormId, 'isDead')) {
						mp.onDeath && mp.onDeath(pcFormId);
					}

					isChangeHp = true;
				}
			}
		}

		mp.set(pcFormId, 'lastAnimation', animationEvent.current);
		mp.callPapyrusFunction('global', 'GM_Main', '_onAnimationEvent', null, [
			ac,
			animationEvent.current,
			animationEvent.previous,
			isAttack,
			isJump,
			isFall,
			isJumpLand,
			isChangeHp,
		]);
		logExecuteTime(start, '_onAnimationEvent');
	};

	mp.makeEventSource('_onUiMenuToggle', new FunctionInfo(onUiMenuToggle).tryCatch());

	mp['_onUiMenuToggle'] = (pcFormId: number, menuOpen: boolean) => {
		const start = Date.now();
		if (!pcFormId) return console.log('Plz reconnect');
		mp.set(pcFormId, 'uiOpened', menuOpen);
		mp.set(pcFormId, 'browserVisible', !menuOpen);
		logExecuteTime(start, '_onUiMenuToggle');
	};

	mp.makeEventSource('_onEffectStart', new FunctionInfo(onEffectStart).tryCatch());

	mp['_onEffectStart'] = (pcFormId: number, event: any) => {
		const start = Date.now();
		if (!pcFormId) return console.log('Plz reconnect');

		if (event.target === 0x14) {
			event.target = pcFormId;
		}
		if (event.caster === 0x14) {
			event.caster = pcFormId;
		}

		const caster: PapyrusObject = { type: 'form', desc: mp.getDescFromId(event.caster) };
		const target: PapyrusObject = { type: 'form', desc: mp.getDescFromId(event.target) };
		const effect: PapyrusObject = { type: 'espm', desc: mp.getDescFromId(event.effect) };

		const isDetrimental = getFlags(mp, null, [event.effect]).includes(0x4);

		mp.callPapyrusFunction('global', 'GM_Main', '_onEffectStart', null, [
			caster,
			target,
			effect,
			event.mag * (isDetrimental ? -1 : 1),
		]);
		mp.callPapyrusFunction('global', 'GM_Main', '_onEffectStart2', null, [
			caster,
			target,
			event.effect,
			event.mag * (isDetrimental ? -1 : 1),
		]);
		logExecuteTime(start, '_onEffectStart');
	};

	mp.makeEventSource('_onCurrentCrosshairChange', new FunctionInfo(onCurrentCrosshairChange).tryCatch());

	mp['_onCurrentCrosshairChange'] = (pcFormId: number, event: any) => {
		const start = Date.now();
		if (!pcFormId) return console.log('Plz reconnect');

		const ac: PapyrusObject = { type: 'form', desc: mp.getDescFromId(pcFormId) };
		const crosshairRefId = event.crosshairRefId;

		const target = crosshairRefId && getForm(mp, null, [crosshairRefId]);
		mp.set(pcFormId, 'CurrentCrosshairRef', target ? crosshairRefId : null);
		mp.callPapyrusFunction('global', 'GM_Main', '_onCurrentCrosshairChange', null, [ac, target]);
		logExecuteTime(start, '_onCurrentCrosshairChange');
	};

	mp.makeEventSource('_onPrintConsole', new FunctionInfo(onPrintConsole).tryCatch());
	mp['_onPrintConsole'] = (pcFormId: number, event: any) => {
		console.log('[client]', '\x1b[33m', ...event, '\x1b[0m');
	};

	mp.makeEventSource('_onCloseRaceMenu', new FunctionInfo(onCloseRaceMenu).tryCatch());
	mp['_onCloseRaceMenu'] = (pcFormId: number) => {
		console.debug('_onCloseRaceMenu', pcFormId);
		(mp['_onLoadGame'] as any)(pcFormId);
	};

	mp['onDisconnectEvent'] = (pcFormId: number) => {
		console.log('disconnect', pcFormId);
	};

	empty.register(mp);
};
