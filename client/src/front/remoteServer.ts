/* eslint-disable no-constant-condition */
/* eslint-disable no-await-in-loop */
import {
	Game,
	once,
	TESModPlatform,
	Cell,
	WorldSpace,
	printConsole,
	Utility,
	storage,
	browser,
	ObjectReference,
	on,
	Ui,
	settings,
	Armor,
	Actor,
} from 'skyrimPlatform';
import * as sp from 'skyrimPlatform';
import * as networking from './networking';
import { FormModel, WorldModel } from './model';
import { MsgHandler } from './msgHandler';
import { ModelSource } from './modelSource';
import { SendTarget } from './sendTarget';
import * as messages from './messages';
import * as loadGameManager from './loadGameManager';
import { applyInventory, Inventory } from './components/inventory';
import { isBadMenuShown } from './components/equipment';
import { Movement } from './components/movement';
import { IdManager } from '../lib/idManager';
import { applyLookToPlayer } from './components/look';
import * as spSnippet from './spSnippet';
import { localIdToRemoteId, remoteIdToLocalId } from './view';
import * as updateOwner from './updateOwner';
import { setActorValuePercentage } from './components/actorvalues';

//
// eventSource system
//

const setupEventSource = (ctx: any) => {
	once('update', () => {
		try {
			ctx._fn(ctx);
			// printConsole(`'eventSources.${ctx._eventName}' - Added`);
		} catch (e) {
			// printConsole(`'eventSources.${ctx._eventName}' -`, e);
		}
	});
};

// Handle hot reload for eventSoucres
if (Array.isArray(storage.eventSourceContexts)) {
	storage.eventSourceContexts = storage.eventSourceContexts.filter((ctx: Record<string, unknown>) => !ctx._expired);
	(storage.eventSourceContexts as any).forEach((ctx: any) => {
		setupEventSource(ctx);
	});
}

let loggingStartMoment = 0;
const maxLoggingDelay = 5000;

on('tick', () => {
	if (loggingStartMoment && Date.now() - loggingStartMoment > maxLoggingDelay) {
		printConsole('Logging in failed. Reconnecting.');
		networking.reconnect();
		loggingStartMoment = 0;
	}
});

class SpawnTask {
	running = false;
}

const sendBrowserToken = () => {
	networking.send(
		{
			t: messages.MsgType.CustomPacket,
			content: {
				customPacketType: 'browserToken',
				token: browser.getToken(),
			},
		},
		true
	);
};

const loginWithSkympIoCredentials = () => {
	loggingStartMoment = Date.now();
	printConsole('Logging in as skymp.io user');
	networking.send(
		{
			t: messages.MsgType.CustomPacket,
			content: {
				customPacketType: 'loginWithSkympIo',
				gameData: settings['skymp5-client'].gameData,
			},
		},
		true
	);
};

export const getPcInventory = (): Inventory => {
	const res = storage.pcInv;
	if (typeof res === 'object' && (res as any).entries) {
		return res as unknown as Inventory;
	}
	return null as unknown as Inventory;
};

const setPcInventory = (inv: Inventory): void => {
	storage.pcInv = inv;
};

let pcInvLastApply = 0;
on('update', () => {
	if (isBadMenuShown()) return;
	if (Date.now() - pcInvLastApply > maxLoggingDelay) {
		const readonlyArray = [1, 2, 3] as const;
		pcInvLastApply = Date.now();
		const pcInv = getPcInventory();
		if (pcInv) applyInventory(Game.getPlayer() as Actor, pcInv, false, true);
	}
});

export class RemoteServer implements MsgHandler, ModelSource, SendTarget {
	setInventory(msg: messages.SetInventory): void {
		once('update', () => {
			setPcInventory(msg.inventory);
			pcInvLastApply = 0;
		});
	}

	openContainer(msg: messages.OpenContainer): void {
		once('update', async () => {
			await Utility.wait(0.1); // Give a chance to update inventory
			(ObjectReference.from(Game.getFormEx(msg.target)) as ObjectReference).activate(Game.getPlayer(), true);
			(async () => {
				while (!Ui.isMenuOpen('ContainerMenu')) await Utility.wait(0.1);
				while (Ui.isMenuOpen('ContainerMenu')) await Utility.wait(0.1);
				networking.send(
					{
						t: messages.MsgType.Activate,
						data: { caster: 0x14, target: msg.target },
					},
					true
				);
			})();
		});
	}

	teleport(msg: messages.Teleport): void {
		once('update', () => {
			printConsole('Teleporting...', msg.pos, 'cell/world is', msg.worldOrCell.toString(16));
			const worldOrCell = Game.getFormEx(msg.worldOrCell);
			TESModPlatform.moveRefrToPosition(
				Game.getPlayer(),
				Cell.from(worldOrCell),
				WorldSpace.from(worldOrCell),
				msg.pos[0],
				msg.pos[1],
				msg.pos[2],
				msg.rot[0],
				msg.rot[1],
				msg.rot[2]
			);
			Utility.wait(0.2).then(() => {
				(Game.getPlayer() as Actor).setAngle(msg.rot[0], msg.rot[1], msg.rot[2]);
			});
		});
	}

	createActor(msg: messages.CreateActorMessage): void {
		loggingStartMoment = 0;

		const i = this.getIdManager().allocateIdFor(msg.idx);
		if (this.worldModel.forms.length <= i) this.worldModel.forms.length = i + 1;

		let movement: Movement = null as unknown as Movement;
		if ((msg.refrId as number) >= 0xff000000) {
			movement = {
				pos: msg.transform.pos,
				rot: msg.transform.rot,
				worldOrCell: msg.transform.worldOrCell,
				runMode: 'Standing',
				direction: 0,
				isInJumpState: false,
				isSneaking: false,
				isBlocking: false,
				isWeapDrawn: false,
				healthPercentage: 1.0,
			};
		}

		this.worldModel.forms[i] = {
			idx: msg.idx,
			movement,
			numMovementChanges: 0,
			numLookChanges: 0,
			baseId: msg.baseId,
			refrId: msg.refrId,
		};
		if (msg.isMe) {
			updateOwner.setOwnerModel(this.worldModel.forms[i]);
		}

		if (msg.look) {
			this.worldModel.forms[i].look = msg.look;
		}

		if (msg.equipment) {
			this.worldModel.forms[i].equipment = msg.equipment;
		}

		if (msg.props) {
			Object.keys(msg.props).forEach((propName) => {
				const i = this.getIdManager().getId(msg.idx);
				(this.worldModel.forms[i] as Record<string, unknown>)[propName] = msg.props[propName];
			});
		}

		if (msg.isMe) this.worldModel.playerCharacterFormIdx = i;

		if (msg.props && msg.props.isRaceMenuOpen && msg.isMe) {
			this.setRaceMenuOpen({ type: 'setRaceMenuOpen', open: true });
		}

		const applyPcInv = () => {
			applyInventory(
				Game.getPlayer() as Actor,
				msg.equipment
					? {
							entries: msg.equipment.inv.entries.filter((x) => !!Armor.from(Game.getFormEx(x.baseId))),
					  }
					: { entries: [] },
				false
			);
			if (msg.props && msg.props.inventory) {
				this.setInventory({
					type: 'setInventory',
					inventory: (msg.props as any).inventory as Inventory,
				});
			}
		};

		if (msg.isMe) {
			const task = new SpawnTask();
			once('update', () => {
				if (!task.running) {
					task.running = true;
					printConsole('Using moveRefrToPosition to spawn player');
					const worldOrCell = Game.getFormEx(msg.transform.worldOrCell);
					TESModPlatform.moveRefrToPosition(
						Game.getPlayer(),
						Cell.from(worldOrCell),
						WorldSpace.from(worldOrCell),
						msg.transform.pos[0],
						msg.transform.pos[1],
						msg.transform.pos[2],
						msg.transform.rot[0],
						msg.transform.rot[1],
						msg.transform.rot[2]
					);
					// Unfortunatelly it requires two calls to work
					Utility.wait(1).then(applyPcInv);
					Utility.wait(1.3).then(applyPcInv);
				}

				if (msg.props) {
					const baseActorValues = new Map<string, unknown>([
						['healRate', msg.props.healRate],
						['healRateMult', msg.props.healRateMult],
						['health', msg.props.health],
						['magickaRate', msg.props.magickaRate],
						['magickaRateMult', msg.props.magickaRateMult],
						['magicka', msg.props.magicka],
						['staminaRate', msg.props.staminaRate],
						['staminaRateMult', msg.props.staminaRateMult],
						['stamina', msg.props.stamina],
						['healthPercentage', msg.props.healthPercentage],
						['staminaPercentage', msg.props.staminaPercentage],
						['magickaPercentage', msg.props.magickaPercentage],
					]);

					const player = Game.getPlayer();
					if (player) {
						baseActorValues.forEach((value, key) => {
							if (typeof value === 'number') {
								if (key.includes('Percentage')) {
									const subKey = key.replace('Percentage', '');
									const subValue = baseActorValues.get(subKey);
									if (typeof subValue === 'number') {
										setActorValuePercentage(player, subKey, value);
									}
								} else {
									player.setActorValue(key, value);
								}
							}
						});
					}
				}
			});
			once('tick', () => {
				once('tick', () => {
					if (!task.running) {
						task.running = true;
						printConsole('Using loadGame to spawn player');
						printConsole('skinColorFromServer:', msg.look ? msg.look.skinColor.toString(16) : undefined);
						loadGameManager.loadGame(
							msg.transform.pos,
							msg.transform.rot,
							msg.transform.worldOrCell,
							msg.look
								? {
										name: msg.look.name,
										raceId: msg.look.raceId,
										face: {
											hairColor: msg.look.hairColor,
											bodySkinColor: msg.look.skinColor,
											headTextureSetId: msg.look.headTextureSetId,
											headPartIds: msg.look.headpartIds,
											presets: msg.look.presets,
										},
								  }
								: undefined
						);
						once('update', () => {
							applyPcInv();
							Utility.wait(0.3).then(applyPcInv);
							if (msg.look) {
								applyLookToPlayer(msg.look);
								if (msg.look.isFemale) {
									// Fix gender-specific walking anim
									(Game.getPlayer() as Actor).resurrect();
								}
							}
						});
					}
				});
			});
		}
	}

	destroyActor(msg: messages.DestroyActorMessage): void {
		const i = this.getIdManager().getId(msg.idx);
		this.worldModel.forms[i] = null as unknown as FormModel;

		// Shrink to fit
		while (1) {
			const length = this.worldModel.forms.length;
			if (!length) break;
			if (this.worldModel.forms[length - 1]) break;
			this.worldModel.forms.length = length - 1;
		}

		if (this.worldModel.playerCharacterFormIdx === i) {
			this.worldModel.playerCharacterFormIdx = -1;

			// TODO: move to a separate module
			once('update', () => Game.quitToMainMenu());
		}

		this.getIdManager().freeIdFor(msg.idx);
	}

	UpdateMovement(msg: messages.UpdateMovementMessage): void {
		const i = this.getIdManager().getId(msg.idx);
		this.worldModel.forms[i].movement = msg.data;
		if (!this.worldModel.forms[i].numMovementChanges) {
			this.worldModel.forms[i].numMovementChanges = 0;
		}
		(this.worldModel.forms[i].numMovementChanges as number)++;
	}

	UpdateAnimation(msg: messages.UpdateAnimationMessage): void {
		const i = this.getIdManager().getId(msg.idx);
		this.worldModel.forms[i].animation = msg.data;
	}

	UpdateLook(msg: messages.UpdateLookMessage): void {
		const i = this.getIdManager().getId(msg.idx);
		this.worldModel.forms[i].look = msg.data;
		if (!this.worldModel.forms[i].numLookChanges) {
			this.worldModel.forms[i].numLookChanges = 0;
		}
		(this.worldModel.forms[i].numLookChanges as number)++;
	}

	UpdateEquipment(msg: messages.UpdateEquipmentMessage): void {
		const i = this.getIdManager().getId(msg.idx);
		this.worldModel.forms[i].equipment = msg.data;
	}

	UpdateProperty(msg: messages.UpdatePropertyMessage): void {
		const i = this.getIdManager().getId(msg.idx);
		(this.worldModel.forms[i] as Record<string, unknown>)[msg.propName] = msg.data;
	}

	handleConnectionAccepted(): void {
		this.worldModel.forms = [];
		this.worldModel.playerCharacterFormIdx = -1;

		loginWithSkympIoCredentials();
		sendBrowserToken();
	}

	handleDisconnect(): void {}

	ChangeValues(msg: messages.ChangeValuesMessage): void {
		const ac = Game.getPlayer();
		if (!ac) return;
		setActorValuePercentage(ac, 'health', msg.data.health);
		setActorValuePercentage(ac, 'stamina', msg.data.stamina);
		setActorValuePercentage(ac, 'magicka', msg.data.magicka);
	}

	setRaceMenuOpen(msg: messages.SetRaceMenuOpenMessage): void {
		if (msg.open) {
			const visualTeleportingBugDelay = 0.3;
			once('update', () =>
				Utility.wait(visualTeleportingBugDelay).then(() => {
					const ironHelment = Armor.from(Game.getFormEx(0x00012e4d));
					(Game.getPlayer() as Actor).unequipItem(ironHelment, false, true);
					Game.showRaceMenu();
				})
			);
		} else {
			// TODO: Implement closeMenu in SkyrimPlatform
		}
	}

	customPacket(msg: messages.CustomPacket): void {
		switch (msg.content.customPacketType) {
			case 'loginRequired':
				loginWithSkympIoCredentials();
				break;
		}
	}

	spSnippet(msg: messages.SpSnippet): void {
		once('update', async () => {
			spSnippet
				.run(msg)
				.then((res) => {
					if (res === undefined) res = null;
					this.send(
						{
							t: messages.MsgType.FinishSpSnippet,
							returnValue: res,
							snippetIdx: msg.snippetIdx,
						},
						true
					);
				})
				.catch((e) => printConsole('!!! SpSnippet failed', e));
		});
	}

	private updateGamemodeUpdateFunctions(storageVar: string, functionSources: Record<string, string>): void {
		storage[storageVar] = JSON.parse(JSON.stringify(functionSources));

		Object.keys(functionSources).forEach((propName) => {
			try {
				(storage[storageVar] as any)[propName] = new Function('ctx', (storage[storageVar] as any)[propName]);
				const emptyFunction = functionSources[propName] === '';
				if (emptyFunction) {
					delete (storage[storageVar] as any)[propName];
					// printConsole(`'${storageVar}.${propName}' -`, 'Added empty');
				} else {
					// printConsole(`'${storageVar}.${propName}' -`, 'Added');
				}
			} catch (e) {
				printConsole(`'${storageVar}.${propName}' -`, e);
			}
		});

		storage[`${storageVar}_keys`] = Object.keys(storage[storageVar] as any);
	}

	updateGamemodeData(msg: messages.UpdateGamemodeDataMessage): void {
		storage._api_onAnimationEvent = { callback() {} };
		//
		// updateOwnerFunctions/updateNeighborFunctions
		//
		storage.updateNeighborFunctions = undefined;
		storage.updateOwnerFunctions = undefined;

		this.updateGamemodeUpdateFunctions('updateNeighborFunctions', msg.updateNeighborFunctions || {});
		this.updateGamemodeUpdateFunctions('updateOwnerFunctions', msg.updateOwnerFunctions || {});

		//
		// EventSource
		//
		if (!Array.isArray(storage.eventSourceContexts)) {
			storage.eventSourceContexts = [];
		} else {
			storage.eventSourceContexts.forEach((ctx: Record<string, unknown>) => {
				ctx.sendEvent = () => {};
				ctx._expired = true;
			});
		}
		const eventNames = Object.keys(msg.eventSources);
		eventNames.forEach((eventName) => {
			try {
				const fn = new Function('ctx', msg.eventSources[eventName]);
				const ctx = {
					sp,
					sendEvent: (...args: unknown[]) => {
						this.send(
							{
								t: messages.MsgType.CustomEvent,
								args,
								eventName,
							},
							true
						);
					},
					getFormIdInServerFormat: (clientsideFormId: number) => {
						return localIdToRemoteId(clientsideFormId);
					},
					getFormIdInClientFormat: (serversideFormId: number) => {
						return remoteIdToLocalId(serversideFormId);
					},
					_fn: fn,
					_eventName: eventName,
					state: {},
				};
				(storage.eventSourceContexts as Record<string, any>).push(ctx);
				setupEventSource(ctx);
			} catch (e) {
				printConsole(`'eventSources.${eventName}' -`, e);
			}
		});
	}

	/** Packet handlers end * */

	getWorldModel(): WorldModel {
		return this.worldModel;
	}

	getMyActorIndex(): number {
		return this.worldModel.playerCharacterFormIdx;
	}

	send(msg: Record<string, unknown>, reliable: boolean): void {
		if (this.worldModel.playerCharacterFormIdx === -1) return;

		const refrId = msg._refrId as number | undefined;

		const idxInModel = refrId
			? this.worldModel.forms.findIndex((f) => f && f.refrId === refrId)
			: this.worldModel.playerCharacterFormIdx;
		msg.idx = this.worldModel.forms[idxInModel].idx;

		delete msg._refrId;
		networking.send(msg, reliable);
	}

	private getIdManager() {
		if (!this.idManager_) this.idManager_ = new IdManager();
		return this.idManager_;
	}

	private worldModel: WorldModel = { forms: [], playerCharacterFormIdx: -1 };
	private idManager_ = new IdManager();
}
