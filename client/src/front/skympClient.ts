import { on, once, printConsole, storage, settings, Game, Ui, Utility, Actor } from 'skyrimPlatform';
import { WorldView, getViewFromStorage, localIdToRemoteId, remoteIdToLocalId } from './view';
import { getMovement } from './components/movement';
import { getLook } from './components/look';
import { AnimationSource, Animation, setupHooks } from './components/animation';
import { getEquipment } from './components/equipment';
import { getDiff, getInventory, Inventory } from './components/inventory';
import { MsgType, HostStartMessage, HostStopMessage } from './messages';
import { MsgHandler } from './msgHandler';
import { ModelSource } from './modelSource';
import { RemoteServer, getPcInventory } from './remoteServer';
import { SendTarget } from './sendTarget';
import * as networking from './networking';
import * as sp from 'skyrimPlatform';
import * as loadGameManager from './loadGameManager';
import * as deathSystem from './deathSystem';
import { setUpConsoleCommands } from './console';
import { nextHostAttempt } from './hostAttempts';
import * as updateOwner from './updateOwner';

interface AnyMessage {
	type?: string;
	t?: number;
}
const handleMessage = (msgAny: AnyMessage, handler_: MsgHandler) => {
	const msgType: string = msgAny.type || (MsgType as any)[msgAny.t as any];
	const handler = handler_ as unknown as Record<string, (m: AnyMessage) => void>;
	const f = handler[msgType];
	/*if (msgType !== "UpdateMovement") {
    printConsole();
    for (const key in msgAny) {
      const v = (msgAny as Record<string, any>)[key];
      printConsole(`${key}=${JSON.stringify(v)}`);
    }
  }*/

	if (msgType === 'hostStart') {
		const msg = msgAny as HostStartMessage;
		const target = msg.target;
		printConsole('hostStart', target.toString(16));

		let hosted = storage['hosted'];
		if (typeof hosted !== typeof []) {
			// if you try to switch to Set checkout .concat usage.
			// concat compiles but doesn't work as expected
			hosted = new Array<number>();
			storage['hosted'] = hosted;
		}

		if (!(hosted as Array<unknown>).includes(target)) {
			(hosted as Array<unknown>).push(target);
		}
	}

	if (msgType === 'hostStop') {
		const msg = msgAny as HostStopMessage;
		const target = msg.target;
		printConsole('hostStop', target.toString(16));

		const hosted = storage['hosted'] as Array<number>;
		if (typeof hosted === typeof []) {
			storage['hosted'] = hosted.filter((x) => x !== target);
		}
	}

	if (f && typeof f === 'function') handler[msgType](msgAny);
};

for (let i = 0; i < 100; ++i) printConsole();
printConsole('Hello Multiplayer');
printConsole('settings:', settings['skymp5-client']);

const targetIp = settings['skymp5-client']['server-ip'] as string;
const targetPort = settings['skymp5-client']['server-port'] as number;

if (storage.targetIp !== targetIp || storage.targetPort !== targetPort) {
	storage.targetIp = targetIp;
	storage.targetPort = targetPort;

	printConsole(`Connecting to ${storage.targetIp}:${storage.targetPort}`);
	networking.connect(targetIp, targetPort);
} else {
	printConsole('Reconnect is not required');
}

export class SkympClient {
	constructor() {
		this.resetView();
		this.resetRemoteServer();
		setupHooks();
		updateOwner.setup();

		sp.printConsole('SkympClient ctor');

		networking.on('connectionFailed', () => {
			printConsole('Connection failed');
		});

		networking.on('connectionDenied', (err: Record<string, any> | string) => {
			printConsole('Connection denied: ', err);
		});

		networking.on('connectionAccepted', () => {
			this.msgHandler.handleConnectionAccepted();
		});

		networking.on('disconnect', () => {
			this.msgHandler.handleDisconnect();
		});

		networking.on('message', (msgAny: Record<string, unknown> | string) => {
			handleMessage(msgAny as Record<string, unknown>, this.msgHandler as MsgHandler);
		});

		on('update', () => {
			if (!this.singlePlayer) {
				this.sendInputs();
			}
		});

		let lastInv: Inventory;

		once('update', () => {
			const send = (msg: Record<string, unknown>) => {
				this.sendTarget.send(msg, true);
			};
			const localIdToRemoteId = (localId: number) => {
				return this.localIdToRemoteId(localId);
			};
			setUpConsoleCommands(send, localIdToRemoteId);
		});

		on('activate', (e) => {
			lastInv = getInventory(Game.getPlayer() as Actor);
			let caster = e.caster ? e.caster.getFormID() : 0;
			let target = e.target ? e.target.getFormID() : 0;

			if (!target || !caster) return;

			// Actors never have non-ff ids locally in skymp
			if (caster !== 0x14 && caster < 0xff000000) return;

			target = this.localIdToRemoteId(target);
			if (!target) return printConsole('localIdToRemoteId returned 0 (target)');

			caster = this.localIdToRemoteId(caster);
			if (!caster) return printConsole('localIdToRemoteId returned 0 (caster)');

			const openState = e.target.getOpenState();
			const enum OpenState {
				None,
				Open,
				Opening,
				Closed,
				Closing,
			}
			if (openState === OpenState.Opening || openState === OpenState.Closing) return;

			this.sendTarget.send({ t: MsgType.Activate, data: { caster, target } }, true);
			printConsole('sendActi', { caster, target });
		});

		type FurnitureId = number;
		const furnitureStreak = new Map<FurnitureId, Inventory>();

		// sync craft items
		on('containerChanged', (e) => {
			const oldContainerId = e.oldContainer?.getFormID() ?? 0;
			const newContainerId = e.newContainer?.getFormID() ?? 0;
			const baseObjId = e.baseObj?.getFormID() ?? 0;

			if (oldContainerId !== 0x14 && newContainerId !== 0x14) return;

			const player = Game.getPlayer();
			const furnitureRef = player.getFurnitureReference();
			if (!furnitureRef) return;

			const furnitureId = furnitureRef.getFormID();

			if (oldContainerId === 0x14 && newContainerId === 0) {
				let craftInputObjects = furnitureStreak.get(furnitureId);

				if (!craftInputObjects) craftInputObjects = { entries: [] };

				craftInputObjects.entries.push({
					baseId: baseObjId,
					count: e.numItems,
				});

				furnitureStreak.set(furnitureId, craftInputObjects);

				printConsole(`Adding ${baseObjId.toString(16)} (${e.numItems}) to recipe`);
			} else if (oldContainerId === 0 && newContainerId === 0x14) {
				printConsole('Flushing recipe');

				const craftInputObjects = furnitureStreak.get(furnitureId);
				if (!craftInputObjects?.entries.length) return;

				furnitureStreak.delete(furnitureId);

				const workbench = this.localIdToRemoteId(furnitureId);
				if (!workbench) return printConsole('localIdToRemoteId returned 0');

				this.sendTarget.send(
					{
						t: MsgType.CraftItem,
						data: { workbench, craftInputObjects, resultObjectId: baseObjId },
					},
					true
				);

				printConsole('sendCraft', {
					workbench,
					craftInputObjects,
					resultObjectId: baseObjId,
				});
			}
		});

		// ??? sync what
		on('containerChanged', (e) => {
			if (!e.oldContainer || !e.newContainer) return;
			if (e.oldContainer.getFormID() !== 0x14 && e.newContainer.getFormID() !== 0x14) return;

			if (!lastInv) lastInv = getPcInventory();
			if (!lastInv) return;

			const player = Game.getPlayer();
			const newInv = getInventory(player);

			// It seems that 'ignoreWorn = false' fixes this:
			// https://github.com/skyrim-multiplayer/issue-tracker/issues/43
			// For some reason excess diff is produced when 'ignoreWorn = true'
			// I thought that it would be vice versa but that's how it works
			const ignoreWorn = false;
			const diff = getDiff(lastInv, newInv, ignoreWorn);

			printConsole('diff:');
			for (let i = 0; i < diff.entries.length; ++i) {
				printConsole(`[${i}] ${JSON.stringify(diff.entries[i])}`);
			}

			// TODO: check this code
			// maybe need return msg in map function
			// or add array.filter(entry => entry.count === 0)
			const msgs = diff.entries.map((entry) => {
				if (entry.count === 0) return;

				const msg = JSON.parse(JSON.stringify(entry));
				delete msg['name']; // Extra name works too strange
				msg['t'] = entry.count > 0 ? MsgType.PutItem : MsgType.TakeItem;
				msg['count'] = Math.abs(msg['count']);
				msg['target'] = e.oldContainer.getFormID() === 0x14 ? e.newContainer.getFormID() : e.oldContainer.getFormID();
				return msg;
			});

			msgs.forEach((msg) => this.sendTarget.send(msg, true));
		});

		const playerFormId = 0x14;
		on('equip', (e) => {
			if (!e.actor || !e.baseObj) return;
			if (e.actor.getFormID() === playerFormId) {
				this.equipmentChanged = true;
				this.sendTarget.send({ t: MsgType.OnEquip, baseId: e.baseObj.getFormID() }, false);
			}
		});

		on('unequip', (e) => {
			if (!e.actor || !e.baseObj) return;
			if (e.actor.getFormID() === playerFormId) {
				this.equipmentChanged = true;
			}
		});

		on('loadGame', () => {
			// Currently only armor is equipped after relogging (see remoteServer.ts)
			// This hack forces sending /equipment without weapons/ back to the server
			Utility.wait(3).then(() => (this.equipmentChanged = true));
		});

		loadGameManager.addLoadGameListener((e: loadGameManager.GameLoadEvent) => {
			if (!e.isCausedBySkyrimPlatform && !this.singlePlayer) {
				sp.Debug.messageBox('Save has been loaded in multiplayer, switching to the single-player mode');
				networking.close();
				this.singlePlayer = true;
				Game.setInChargen(false, false, false);
			}
		});

		on('update', () => deathSystem.update());
	}

	// May return null
	private getInputOwner(_refrId?: number) {
		return _refrId ? Actor.from(Game.getFormEx(this.remoteIdToLocalId(_refrId))) : Game.getPlayer();
	}

	private sendMovement(_refrId?: number) {
		const owner = this.getInputOwner(_refrId);
		if (!owner) return;

		const refrIdStr = `${_refrId}`;
		const sendMovementRateMs = 130;
		const now = Date.now();
		const last = this.lastSendMovementMoment.get(refrIdStr);
		if (!last || now - last > sendMovementRateMs) {
			this.sendTarget.send(
				{
					t: MsgType.UpdateMovement,
					data: getMovement(owner),
					_refrId,
				},
				false
			);
			this.lastSendMovementMoment.set(refrIdStr, now);
		}
	}

	private sendAnimation(_refrId?: number) {
		const owner = this.getInputOwner(_refrId);
		if (!owner) return;

		// Extermly important that it's a local id since AnimationSource depends on it
		const refrIdStr = owner.getFormID().toString(16);

		let animSource = this.playerAnimSource.get(refrIdStr);
		if (!animSource) {
			animSource = new AnimationSource(owner);
			this.playerAnimSource.set(refrIdStr, animSource);
		}
		const anim = animSource.getAnimation();

		const lastAnimationSent = this.lastAnimationSent.get(refrIdStr);
		if (!lastAnimationSent || anim.numChanges !== lastAnimationSent.numChanges) {
			if (anim.animEventName !== '') {
				this.lastAnimationSent.set(refrIdStr, anim);
				this.sendTarget.send({ t: MsgType.UpdateAnimation, data: anim, _refrId }, false);
				if (
					(storage as Record<string, any>)._api_onAnimationEvent &&
					(storage as Record<string, any>)._api_onAnimationEvent.callback
				) {
					try {
						(storage as Record<string, any>)._api_onAnimationEvent.callback(
							_refrId ? _refrId : 0x14,
							anim.animEventName
						);
					} catch (e) {
						printConsole("'_api_onAnimationEvent' -", e);
					}
				}
			}
		}
	}

	private sendLook(_refrId?: number) {
		if (_refrId) return;
		const shown = Ui.isMenuOpen('RaceSex Menu');
		if (shown != this.isRaceSexMenuShown) {
			this.isRaceSexMenuShown = shown;
			if (!shown) {
				printConsole('Exited from race menu');

				const onCloseRaceMenu: { callback?: () => void } = storage._api_onCloseRaceMenu;
				if (onCloseRaceMenu?.callback) onCloseRaceMenu.callback();

				const look = getLook(Game.getPlayer() as Actor);
				this.sendTarget.send({ t: MsgType.UpdateLook, data: look, _refrId }, true);
			}
		}
	}

	private sendEquipment(_refrId?: number) {
		if (_refrId) return;
		if (this.equipmentChanged) {
			this.equipmentChanged = false;

			++this.numEquipmentChanges;

			const eq = getEquipment(Game.getPlayer() as Actor, this.numEquipmentChanges);
			this.sendTarget.send({ t: MsgType.UpdateEquipment, data: eq, _refrId }, true);
			printConsole({ eq });
		}
	}

	private sendHostAttempts() {
		const remoteId = nextHostAttempt();
		if (!remoteId) return;

		this.sendTarget.send({ t: MsgType.Host, remoteId }, false);
	}

	private sendInputs() {
		const hosted = typeof storage['hosted'] === typeof [] ? storage['hosted'] : [];
		const targets = [undefined].concat(hosted as any);
		//printConsole({ targets });
		targets.forEach((target) => {
			this.sendMovement(target);
			this.sendAnimation(target);
			this.sendLook(target);
			this.sendEquipment(target);
		});
		this.sendHostAttempts();
	}

	private resetRemoteServer() {
		const prevRemoteServer: RemoteServer = storage.remoteServer as RemoteServer;
		let rs: RemoteServer;

		if (prevRemoteServer && (prevRemoteServer.getWorldModel as unknown)) {
			rs = prevRemoteServer;
			printConsole('Restore previous RemoteServer');

			// Keep previous RemoteServer, but update func implementations
			const newObj: Record<string, unknown> = new RemoteServer() as unknown as Record<string, unknown>;
			const rsAny: Record<string, unknown> = rs as unknown as Record<string, unknown>;
			for (const key in newObj) {
				if (typeof newObj[key] === 'function') rsAny[key] = newObj[key];
			}
		} else {
			rs = new RemoteServer();
			printConsole('Creating RemoteServer');
		}

		this.sendTarget = rs;
		this.msgHandler = rs;
		this.modelSource = rs;
		storage.remoteServer = rs;
	}

	private resetView() {
		const prevView: WorldView = storage.view as WorldView;
		const view = new WorldView();
		once('update', () => {
			if (prevView?.destroy) {
				prevView.destroy();
				printConsole('Previous View destroyed');
			}
			storage.view = view;
		});
		on('update', () => {
			if (!this.singlePlayer) view.update((this.modelSource as ModelSource).getWorldModel());
		});
	}

	private getView(): WorldView | undefined {
		return getViewFromStorage();
	}

	private localIdToRemoteId(localFormId: number): number {
		return localIdToRemoteId(localFormId);
	}

	private remoteIdToLocalId(remoteFormId: number): number {
		return remoteIdToLocalId(remoteFormId);
	}

	private playerAnimSource = new Map<string, AnimationSource>();
	private lastSendMovementMoment = new Map<string, number>();
	private lastAnimationSent = new Map<string, Animation>();
	private msgHandler: MsgHandler = undefined as unknown as MsgHandler;
	private modelSource?: ModelSource;
	private sendTarget: SendTarget = undefined as unknown as SendTarget;
	private isRaceSexMenuShown = false;
	private singlePlayer = false;
	private equipmentChanged = false;
	private numEquipmentChanges = 0;
}

once('update', () => {
	// Is it racing with OnInit in Papyrus?
	(sp.TESModPlatform as any).blockPapyrusEvents(true);
});
