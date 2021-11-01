import { getForm } from '../papyrus/game';
import { actorValues } from '../properties/actor/actorValues/attributes';
import { Mp, PapyrusObject } from '../types/mp';
import { FunctionInfo } from '../utils/functionInfo';
import {
	onAnimationEvent,
	onCellChange,
	onCurrentCrosshairChange,
	onEffectStart,
	onEquip,
	onHit,
	onInput,
	onLoad,
	onPrintConsole,
	onUiMenuToggle,
} from './functions';
import * as empty from './empty';
import { getFlags } from '../papyrus/activeMagicEffect';
import { getEquipment } from '../papyrus/actor/equip';
import * as position from '../papyrus/objectReference/position';
import { serverOptionProvider } from '../..';
import * as m from '../modules';
import { initAVFromRace, throwOrInit, logExecuteTime } from './shared';
import * as _onHit from './_onHit';
import { handleServerMsg } from './server-msg';
import { CrosshairChange, EffectStart, HitEvent } from '../types/event';
import { checkAndCreatePropertyExist } from '../papyrus/multiplayer/functions';
import { getLocation } from '../papyrus/cell';
import { getParent } from '../papyrus/location';
import { getWorldSpace } from '../papyrus/objectReference';

const loadedPc: Record<number, number> = {};
export const register = (mp: Mp): void => {
	mp.makeEventSource('_onLoadGame', new FunctionInfo(onLoad).body);

	mp._onLoadGame = (pcFormId: number) => {
		const start = Date.now();
		// onLoad raised twice when show race menu
		if (loadedPc[pcFormId]) {
			console.debug(`${pcFormId.toString(16)} has already been loaded`);
			return;
		}
		loadedPc[pcFormId] = Date.now();
		console.debug('_onLoadGame', pcFormId.toString(16));
		if (!pcFormId) return console.log('Plz reconnect');
		const ac: PapyrusObject = { type: 'form', desc: mp.getDescFromId(pcFormId) };

		mp.set(pcFormId, 'browserVisible', true);
		mp.set(pcFormId, 'browserModal', false);

		const serverOptions = serverOptionProvider.getServerOptions();
		initAVFromRace(mp, pcFormId);
		const neighbors = mp.get(pcFormId, 'neighbors');
		neighbors
			.filter((n) => mp.get(n, 'type') === 'MpActor')
			.forEach((id) => {
				throwOrInit(mp, id, serverOptions);
			});

		const isFirstLoad = mp.get(pcFormId, 'isFirstLoad');
		if (isFirstLoad !== false) {
			mp.set(pcFormId, 'isFirstLoad', !isFirstLoad);
		}

		mp.callPapyrusFunction('global', 'GM_Main', '_OnLoadGame', null, [ac]);
		mp.modules.forEach((module) => {
			try {
				if (!module.onLoadGame) return;
				const s = Date.now();
				module.onLoadGame(new m.Actor(ac));
				logExecuteTime(s, `${module.name}.onLoadGame`);
			} catch (err) {
				console.error(`error in module ${module.name} onLoadGame`, err);
			}
		});
		logExecuteTime(start, '_onLoadGame');
	};

	mp.onActivate = (target: number, pcFormId: number) => {
		const start = Date.now();
		if (!pcFormId) return console.log('Plz reconnect');

		const casterRef: PapyrusObject = { type: 'form', desc: mp.getDescFromId(pcFormId) };
		const targetRef: PapyrusObject = { type: 'form', desc: mp.getDescFromId(target) };

		// try {
		// 	console.debug('blockActivationState', mp.get(target, 'blockActivationState'));
		// 	if (mp.get(target, 'blockActivationState')) return false;
		// } catch (err) {
		// 	console.error(err);
		// }
		// return true;
		const activation = mp.callPapyrusFunction('global', 'GM_Main', '_onActivate', null, [targetRef, casterRef]);

		let activationFromModule = true;
		mp.modules.forEach((module) => {
			if (!module.onActivate) return;
			const s = Date.now();
			try {
				const ret = module.onActivate(new m.ObjectReference(targetRef), new m.ObjectReference(casterRef));
				if (!ret) {
					activationFromModule = false;
					console.debug(`${module.name} cancel activation.`);
				}
			} catch (err) {
				console.error(`error in module ${module.name} onActivate`, err);
			}
			logExecuteTime(s, `${module.name}.onActivate`);
		});

		logExecuteTime(start, 'onActivate');

		return activation && activationFromModule;
	};

	mp.makeEventSource('_onCellChange', new FunctionInfo(onCellChange).body);

	mp._onCellChange = (pcFormId: number, event: { prevCell: number; currentCell: number }) => {
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

		// Safe Zone add prop
		checkAndCreatePropertyExist(mp, pcFormId, 'isInSafeLocation');
		try {
			mp.set(pcFormId, 'isInSafeLocation', false);
		} catch (err) {
			console.log(err);
		}

		// Safe Zone get
		const worldSpace = getWorldSpace(mp, ac);
		let location: PapyrusObject | null = getLocation(mp, null, [{ type: 'espm', desc: currentCell.desc }]);
		if (!location && worldSpace) {
			location = getLocation(mp, null, [{ type: 'espm', desc: worldSpace.desc }]);
		}
		const safeLocations: number[] = serverOptions.SafeLocations;

		// Safe Zone set
		if (location) {
			if (safeLocations.includes(mp.getIdFromDesc(location.desc))) {
				mp.set(pcFormId, 'isInSafeLocation', true);
			} else {
				const parentLocation: PapyrusObject | null = getParent(mp, location);
				if (parentLocation) {
					if (safeLocations.includes(mp.getIdFromDesc(parentLocation.desc))) {
						mp.set(pcFormId, 'isInSafeLocation', true);
					} else {
						const parentOfParentLocation: PapyrusObject | null = getParent(mp, parentLocation);
						if (parentOfParentLocation) {
							if (safeLocations.includes(mp.getIdFromDesc(parentOfParentLocation.desc))) {
								mp.set(pcFormId, 'isInSafeLocation', true);
							}
						}
					}
				}
			}
		}

		mp.set(pcFormId, 'cellDesc', currentCell.desc);
		mp.callPapyrusFunction('global', 'GM_Main', '_onCellChange', null, [ac, prevCell, currentCell]);
		mp.modules.forEach((module) => {
			try {
				if (!module.onCellChange) return;
				const s = Date.now();
				module.onCellChange(new m.Actor(ac), new m.Cell(prevCell), new m.Cell(currentCell));
				logExecuteTime(s, `${module.name}.onCellChange`);
			} catch (err) {
				console.error(`error in module ${module.name} onCellChange`, err);
			}
		});

		logExecuteTime(start, '_onCellChange');
	};

	mp.onDeath = (pcFormId: number, agressorFormId: number | null = null) => {
		const start = Date.now();
		const ac: PapyrusObject = { type: 'form', desc: mp.getDescFromId(pcFormId) };

		let agressor: PapyrusObject | null = null;

		if (agressorFormId) {
			agressor = { type: 'form', desc: mp.getDescFromId(agressorFormId) };
		}

		console.log(`${pcFormId.toString(16)} died`);
		mp.set(pcFormId, 'isDead', true);
		mp.callPapyrusFunction('global', 'GM_Main', '_onDeath', null, [ac]);
		mp.modules.forEach((module) => {
			try {
				if (!module.onDeath) return;
				const s = Date.now();
				module.onDeath(new m.Actor(ac), agressor ? new m.Actor(agressor) : null);
				logExecuteTime(s, `${module.name}.onDeath`);
			} catch (err) {
				console.error(`error in module ${module.name} onDeath`, err);
			}
		});
		logExecuteTime(start, 'onDeath');
	};

	mp.onResurrect = (pcFormId: number) => {
		const start = Date.now();
		const ac: PapyrusObject = { type: 'form', desc: mp.getDescFromId(pcFormId) };
		console.log(`${pcFormId.toString(16)} respawns`);
		mp.set(pcFormId, 'isDead', false);

		mp.callPapyrusFunction('global', 'GM_Main', '_onResurrect', null, [ac]);
		mp.modules?.forEach((module) => {
			try {
				if (!module.onResurrect) return;
				const s = Date.now();
				module.onResurrect(new m.Actor(ac));
				logExecuteTime(s, `${module.name}.onResurrect`);
			} catch (err) {
				console.error(`error in module ${module.name} onResurrect`, err);
			}
		});
		logExecuteTime(start, 'onResurrect');
	};

	mp.makeEventSource('_onHitStatic', new FunctionInfo(onHit).getText({ isHitStatic: true }));

	mp._onHitStatic = (pcFormId: number, event: HitEvent) => {
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
		mp.modules.forEach((module) => {
			try {
				if (!module.onHit) return;
				const s = Date.now();
				module.onHit(
					new m.Actor(target),
					new m.Actor(agressor),
					event.isPowerAttack,
					event.isSneakAttack,
					event.isBashAttack,
					event.isHitBlocked
				);
				logExecuteTime(s, `${module.name}.onHit`);
			} catch (err) {
				console.error(`error in module ${module.name} onHit`, err);
			}
		});
		logExecuteTime(start, '_onHitStatic');
	};

	mp.makeEventSource('_onEquip', new FunctionInfo(onEquip).tryCatch());

	mp._onEquip = (pcFormId: number, event: { actor: number; target: number; player: number }) => {
		const start = Date.now();
		if (!pcFormId) return console.log('Plz reconnect');

		if (event.actor === 0x14) {
			event.actor = pcFormId;
		}

		const ac: PapyrusObject = { type: 'form', desc: mp.getDescFromId(event.actor) };
		const target: PapyrusObject = { type: 'espm', desc: mp.getDescFromId(event.target) };

		// if (serverOptionProvider.getServerOptionsValue(['enableALCHeffect'])) {
		// 	const rec = mp.lookupEspmRecordById(event.target).record;
		// 	if (rec && rec?.type === 'ALCH') {
		// 		const mges = getObjectArray([potion.getMagicEffects(mp, target)], 0);
		// 		mges.forEach((m) => {
		// 			const id = mp.getIdFromDesc(m.desc);
		// 			const f = getForm(mp, null, [id]);
		// 			if (!f) return;
		// 			const hitShader = magicEffect.getHitShader(mp, f);
		// 			if (!hitShader) return;
		// 			effectShader.play(mp, hitShader, [ac, 5]);
		// 		});

		// 		// console.log('ALCHeffect', pcFormId, event.actor);
		// 		// if (pcFormId === event.actor) {
		// 		//   const f = getForm(mp, null, [event.target]);
		// 		//   if (f) equipItem(mp, ac, [event.target]);
		// 		//   // potion.equip(mp, ac, [event.target]);
		// 		// }
		// 	}
		// }

		mp.callPapyrusFunction('global', 'GM_Main', '_onEquip', null, [ac, target]);
		mp.modules.forEach((module) => {
			try {
				if (!module.onEquip) return;
				const s = Date.now();
				module.onEquip(new m.Actor(ac), new m.Form(target));
				logExecuteTime(s, `${module.name}.onEquip`);
			} catch (err) {
				console.error(`error in module ${module.name} onEquip`, err);
			}
		});
		logExecuteTime(start, '_onEquip');
	};

	mp.onUiEvent = (pcFormId: number, uiEvent: Record<string, unknown>) => {
		const start = Date.now();
		// Server sometimes pass 0, I think serverside hot reload breaks something

		const ac: PapyrusObject = { type: 'form', desc: mp.getDescFromId(pcFormId) };

		switch (uiEvent.type) {
			case 'cef::chat:send': {
				if (!pcFormId) return console.log('Plz reconnect');

				const text = uiEvent.data;

				if (typeof text === 'string') {
					const tokens = text.split(' ');

					if (tokens[0].startsWith('/')) {
						const commandExists = mp.modules.some((module) => {
							try {
								if (!module.onChatCommand) return false;
								const s = Date.now();
								const exists = module.onChatCommand(new m.Actor(ac), tokens[0].toLowerCase(), tokens.slice(1));
								// if (exists) console.debug(`${module.name} raise ${tokens[0]} cmd.`);
								logExecuteTime(s, `${module.name}.onChatCommand`);
								return exists;
							} catch (err) {
								console.error(`error in module ${module.name} onChatCommand`, err);
								return false;
							}
						});

						if (commandExists) return logExecuteTime(start, 'onUiEvent');
					} else {
						mp.modules.forEach((module) => {
							try {
								if (!module.onChatInput) return;
								const s = Date.now();
								module.onChatInput(new m.Actor(ac), tokens);
								logExecuteTime(s, `${module.name}.onChatInput`);
							} catch (err) {
								console.error(`error in module ${module.name} onChatInput`, err);
							}
						});
					}

					mp.callPapyrusFunction('global', 'GM_Main', '_OnChatInput', null, [ac, text]);
				}
				break;
			}
			case 'server::msg:send': {
				handleServerMsg(mp, pcFormId, uiEvent.data as Record<string, unknown>);
			}
		}

		mp.modules
			?.filter((module) => module.onUiEvent)
			.forEach((module) => {
				try {
					if (!module.onUiEvent) return;
					const s = Date.now();
					module.onUiEvent(new m.Actor(ac), uiEvent);
					logExecuteTime(s, `${module.name}.onUiEvent`);
				} catch (err) {
					console.error(`error in module ${module.name} onUiEvent`, err);
				}
			});
		logExecuteTime(start, 'onUiEvent');
	};

	mp.makeEventSource('_onInput', new FunctionInfo(onInput).tryCatch());

	mp._onInput = (pcFormId: number, keycodes: number[]) => {
		const start = Date.now();
		if (!pcFormId) return console.log('Plz reconnect');
		const ac: PapyrusObject = { type: 'form', desc: mp.getDescFromId(pcFormId) };
		mp.callPapyrusFunction('global', 'GM_Main', '_OnInput', null, [ac, keycodes]);

		const {
			keybindingBrowserSetVisible,
			// keybindingBrowserSetFocused,
		} = serverOptionProvider.getServerOptions();

		if (!mp.get(pcFormId, 'browserModal')) {
			if (keycodes.length === 1 && keycodes[0] === keybindingBrowserSetVisible) {
				// mp.callPapyrusFunction('global', 'M', 'BrowserSetVisible', null, [
				// 	ac,
				// 	!mp.get(pcFormId, 'browserVisible') ?? true,
				// ]);
			}
			// if (keycodes.length === 1 && keycodes[0] === keybindingBrowserSetFocused) {
			// 	mp.callPapyrusFunction('global', 'M', 'BrowserSetFocused', null, [
			// 		ac,
			// 		!mp.get(pcFormId, 'browserFocused') ?? true,
			// 	]);
			// }
		}

		if (keycodes.length === 1 && keycodes[0] === 0x04) {
			// const func = (ctx: Ctx) => {
			// 	ctx.sp.once('update', async () => {
			// 		const ac = ctx.refr;
			// 		if (!ac) return;
			// 		// ctx.sp.printConsole(ctx.sp.findConsoleCommand('fov').numArgs);
			// 		const id = ctx.getFormIdInServerFormat(ac.getFormID());
			// 		ctx.sp.printConsole([id, 50]);
			// 		ctx.sp.findConsoleCommand('additem').execute([id, 0x12eb7, 1]);
			// 	});
			// };
			// evalClient(mp, pcFormId, new FunctionInfo(func).getText({}), true);
		}
		if (keycodes.length === 1 && keycodes[0] === 0x05) {
			// const func = (ctx: Ctx) => {
			// 	ctx.sp.once('update', async () => {
			// 		const f = ctx.sp.Game.getFormEx(0x500999b);
			// 		if (!f) return;
			// 		const r = ctx.sp.ObjectReference.from(f);
			// 		ctx.sp.printConsole(0x500999b);
			// 		if (!r) return;
			// 		const b = r.getBaseObject();
			// 		if (!b) return;
			// 		ctx.sp.printConsole(b.getFormID().toString(16));
			// 		const cont = ctx.sp.getContainer(b.getFormID()).map((x) => x.baseId.toString(16));
			// 		ctx.sp.printConsole(JSON.stringify(cont));
			// 	});
			// };
			// evalClient(mp, pcFormId, new FunctionInfo(func).getText({}), true);
		}

		mp.modules.forEach((module) => {
			try {
				if (!module.onInput) return;
				const s = Date.now();
				module.onInput(new m.Actor(ac), keycodes);
				logExecuteTime(s, `${module.name}.onInput`);
			} catch (err) {
				console.error(`error in module ${module.name} onInput`, err);
			}
		});
		logExecuteTime(start, '_onInput');
	};

	mp.makeEventSource('_onAnimationEvent', new FunctionInfo(onAnimationEvent).tryCatch());

	mp._onAnimationEvent = (pcFormId: number, animationEvent: { current: string; previous: string }) => {
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
				if (weap[0].weight) HitStaminaReduce = weap[0].weight;
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
			// TODO: BUG when you jumped and not land, then enter location you damage HP
			const startZCoord = mp.get<number>(pcFormId, 'startZCoord');
			if (startZCoord) {
				const diff = startZCoord - position.getPositionZ(mp, ac);
				if (diff > 300) {
					const damage = actorValues.get(pcFormId, 'health', 'damage');
					console.debug('isJumpLand', diff / 100, startZCoord);
					const newDamageModValue = damage - diff / 100;
					actorValues.set(pcFormId, 'health', 'damage', newDamageModValue);

					const wouldDie = actorValues.getMaximum(pcFormId, 'health') + newDamageModValue <= 0;
					if (wouldDie && !mp.get(pcFormId, 'isDead')) {
						if (mp.onDeath) mp.onDeath(pcFormId);
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
		mp.modules.forEach((module) => {
			try {
				if (!module.onAnimationEvent) return;
				const s = Date.now();
				module.onAnimationEvent(
					new m.Actor(ac),
					animationEvent.current,
					animationEvent.previous,
					isAttack,
					isJump,
					isFall,
					isJumpLand,
					isChangeHp
				);
				logExecuteTime(s, `${module.name}.onAnimationEvent`);
			} catch (err) {
				console.error(`error in module ${module.name} onAnimationEvent`, err);
			}
		});
		logExecuteTime(start, '_onAnimationEvent');
	};

	mp.makeEventSource('_onUiMenuToggle', new FunctionInfo(onUiMenuToggle).tryCatch());

	mp._onUiMenuToggle = (pcFormId: number, menuOpen: boolean) => {
		const start = Date.now();
		if (!pcFormId) return console.log('Plz reconnect');
		mp.set(pcFormId, 'uiOpened', menuOpen);
		mp.set(pcFormId, 'browserVisible', !menuOpen);
		logExecuteTime(start, '_onUiMenuToggle');
	};

	mp.makeEventSource('_onEffectStart', new FunctionInfo(onEffectStart).tryCatch());

	mp._onEffectStart = (pcFormId: number, event: EffectStart) => {
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
		mp.modules.forEach((module) => {
			try {
				if (!module.onEffectStart) return;
				const s = Date.now();
				module.onEffectStart(
					new m.ObjectReference(caster),
					new m.ObjectReference(target),
					new m.MagicEffect(effect),
					event.mag * (isDetrimental ? -1 : 1)
				);
				logExecuteTime(s, `${module.name}.onEffectStart`);
			} catch (err) {
				console.error(`error in module ${module.name} onEffectStart`, err);
			}
		});
		logExecuteTime(start, '_onEffectStart');
	};

	mp.makeEventSource('_onCurrentCrosshairChange', new FunctionInfo(onCurrentCrosshairChange).tryCatch());

	mp._onCurrentCrosshairChange = (pcFormId: number, event: CrosshairChange) => {
		const start = Date.now();
		if (!pcFormId) return console.log('Plz reconnect');

		const ac: PapyrusObject = { type: 'form', desc: mp.getDescFromId(pcFormId) };
		const crosshairRefId = event.crosshairRefId;

		const target = crosshairRefId ? getForm(mp, null, [crosshairRefId]) ?? null : null;
		mp.set(pcFormId, 'CurrentCrosshairRef', target ? crosshairRefId : null);

		mp.callPapyrusFunction('global', 'GM_Main', '_onCurrentCrosshairChange', null, [ac, target]);
		mp.modules.forEach((module) => {
			try {
				if (!module.onCurrentCrosshairChange) return;
				const s = Date.now();
				module.onCurrentCrosshairChange(new m.Actor(ac), target ? new m.ObjectReference(target) : null);
				logExecuteTime(s, `${module.name}.onCurrentCrosshairChange`);
			} catch (err) {
				console.error(`error in module ${module.name} onCurrentCrosshairChange`, err);
			}
		});

		logExecuteTime(start, '_onCurrentCrosshairChange');
	};

	mp.makeEventSource('_onPrintConsole', new FunctionInfo(onPrintConsole).tryCatch());
	mp._onPrintConsole = (pcFormId: number, event: any) => {
		console.log('[client]', '\x1b[33m', ...event, '\x1b[0m');
	};

	mp.onDisconnect = (pcFormId: number) => {
		if (!pcFormId) return;

		console.log(pcFormId.toString(16), 'disconnect');
		const ac: PapyrusObject = { type: 'form', desc: mp.getDescFromId(pcFormId) };
		loadedPc[pcFormId] = 0;

		mp.callPapyrusFunction('global', 'GM_Main', '_onDisconnect', null, [ac]);
		mp.modules.forEach((module) => {
			try {
				if (!module.onDisconnect) return;
				const s = Date.now();
				module.onDisconnect(new m.Actor(ac));
				logExecuteTime(s, `${module.name}.onDisconnect`);
			} catch (err) {
				console.error(`error in module ${module.name} onDisconnect`, err);
			}
		});
	};

	_onHit.register(mp);
	empty.register(mp);
};
