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
import { Ctx } from '../types/ctx';
import { serverOptionProvider } from '../..';
import { overrideNotify, initAVFromRace, throwOrInit, logExecuteTime } from './shared';
import * as _onHit from './_onHit';
import { handleServerMsg } from './server-msg';

const loadedPc: Record<string, number> = {};
export const register = (mp: Mp): void => {
	mp.makeEventSource('_onLoadGame', new FunctionInfo(onLoad).body);

	mp['_onLoadGame'] = (pcFormId: number) => {
		const start = Date.now();
		// onLoad raised twice when show race menu
		if (start - loadedPc.pcFormId < 1000) {
			console.debug(`${pcFormId.toString(16)} has already been loaded`);
			return;
		}
		loadedPc.pcFormId = Date.now();
		console.debug('_onLoadGame', pcFormId.toString(16));
		if (!pcFormId) return console.log('Plz reconnect');
		const ac: PapyrusObject = { type: 'form', desc: mp.getDescFromId(pcFormId) };

		overrideNotify(mp, pcFormId);

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

		mp.callPapyrusFunction('global', 'GM_Main', '_OnLoadGame', null, [ac]);

		mp.set(pcFormId, 'isFirstLoad', true);
		logExecuteTime(start, '_onLoadGame');
	};

	mp['onActivate'] = (target: number, pcFormId: number) => {
		const start = Date.now();
		if (!pcFormId) return console.log('Plz reconnect');

		const casterRef: PapyrusObject = { type: 'form', desc: mp.getDescFromId(pcFormId) };
		const targetRef: PapyrusObject = { type: 'form', desc: mp.getDescFromId(target) };

		const activation = mp.callPapyrusFunction('global', 'GM_Main', '_onActivate', null, [targetRef, casterRef]) ?? true;

		logExecuteTime(start, 'onActivate');

		return activation;
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

		const ac: PapyrusObject = { type: 'form', desc: mp.getDescFromId(pcFormId) };

		switch (uiEvent.type) {
			case 'cef::chat:send': {
				if (!pcFormId) return console.log('Plz reconnect');

				const text = uiEvent.data;

				if (typeof text === 'string') {
					mp.callPapyrusFunction('global', 'GM_Main', '_OnChatInput', null, [ac, text]);
				}
			}
			case 'server::msg:send': {
				handleServerMsg(mp, pcFormId, uiEvent.data as Record<string, unknown>);
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
			(mp['onUiEvent'] as any)(pcFormId, { type: 'cef::chat:send', data: command });
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
			// FIXME: BUG when you jumped and not land, then enter location you damage HP
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

	_onHit.register(mp);
	empty.register(mp);
};
