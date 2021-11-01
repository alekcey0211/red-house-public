/* eslint-disable */
type JsonSerializablePrimitive = boolean | string | number | null;
type JsonSerializable = JsonSerializablePrimitive | JsonSerializable[] | { [key: string]: JsonSerializable };

interface EspmField {
	readonly type: string;
	readonly data: Uint8Array;
}

interface EspmRecord {
	readonly id: number;
	readonly editorId: string;
	readonly type: string;
	readonly flags: number;
	readonly fields: EspmField[];
}

interface EspmLookupResult {
	readonly record: EspmRecord;
	readonly fileIndex: number;
	readonly toGlobalRecordId: (localRecordId: number) => number;
}

interface PapyrusObject {
	desc: string;
	type: 'form' | 'espm';
}

type PapyrusValue = null | PapyrusObject | string | number | boolean | PapyrusValue[];

interface Inventory {
	entries: InventoryItem[];
}
interface InventoryItem {
	baseId: number;
	count: number;
}
interface InventoryEq {
	entries: InventoryItemEq[];
}
interface InventoryItemEq {
	baseId: number;
	count: number;
	worn: boolean;
}
interface Equipment {
	inv: InventoryEq;
	numChanges: number;
}
interface Appearance {
	hairColor: number;
	headTextureSetId: number;
	headpartIds: number[];
	isFemale: boolean;
	name: string;
	options: number[];
	presets: number[];
	raceId: number;
	skinColor: number;
	tints: Tint[];
	weight: number;
}

interface Mp {
	/**
	 * Returns the actual value of a specified property. If there is no value, then
	 * `undefined` returned.
	 * @param formId A number representing ID of MpActor or MpObjectReference.
	 * @param propertyName Name of the property we are reading.
	 */
	// get(formId: number, propertyName: string): JsonSerializable | undefined;
	get<T = JsonSerializable>(formId: number, propertyName: string): T | undefined;
	get(formId: number, propertyName: 'neighbors'): number[];
	get(formId: number, propertyName: 'type'): 'MpActor' | 'MpObjectReference';
	get(formId: number, propertyName: 'appearance'): Appearance;
	get(formId: number, propertyName: 'pos' | 'angle'): [number, number, number];
	get(formId: number, propertyName: 'worldOrCellDesc'): string;
	get(formId: number, propertyName: 'inventory'): Inventory;
	get(formId: number, propertyName: 'equipment'): Equipment;
	get(formId: number, propertyName: 'baseDesc'): string;
	get(formId: number, propertyName: 'formDesc'): string;
	get(formId: 0, propertyName: 'onlinePlayers'): number[];
	get(formId: number, propertyName: 'isDisabled'): boolean;
	get(formId: number, propertyName: 'isOpen'): boolean;
	get(formId: number, propertyName: 'isOnline'): boolean;

	/**
	 * Modifies value of the specified property.
	 * @param formId A number representing ID of MpActor or MpObjectReference.
	 * @param propertyName Name of the property we are modifying.
	 * @param newValue A new value for the property.
	 */
	// set(formId: number, propertyName: string, newValue: JsonSerializable): void;
	set<T = JsonSerializable>(formId: number, propertyName: string, newValue: T): void;
	set(formId: number, propertyName: 'inventory', newValue: Inventory): void;
	set(formId: number, propertyName: 'pos' | 'angle', newValue: [number, number, number]): void;
	set(formId: number, propertyName: 'isDisabled', newValue: boolean): void;
	set(formId: number, propertyName: 'isOpen', newValue: boolean): void;
	set(formId: number, propertyName: 'worldOrCellDesc', newValue: string): void;

	/**
	 * Sends a message to the user's in-game browser using WebSocket.
	 * @param formId A number representing ID of MpActor or MpObjectReference.
	 * @param message JSON-serializable object representing a message.
	 */
	sendUiMessage(formId: number, message: { [key: string]: JsonSerializable }): void;

	lookupEspmRecordById(globalRecordId: number): EspmLookupResult | Partial<EspmLookupResult>;

	getEspmLoadOrder(): string[];

	getDescFromId(formId: number): string;

	getIdFromDesc(formDesc: string): number;

	place(globalRecordId: number): number;

	onDeath?: (pcFormId: number, killer: number | null) => void;
	onResurrect?: (pcFormId: number) => void;
	onActivate?: (target: number, pcFormId: number) => void;
	[key: string]: unknown;

	getServerSettings(): Record<string, any>;
	readDataDirectory(): string[];
	readDataFile(path: string): string;

	addJSModule: (module: IJSModule) => void;
}

declare const mp: Mp;

interface ServerOption {
	serverName: string;
	EnableDebug: boolean;

	CookingDuration: number;
	CookingActivationDistance: number;

	IsChooseSpawnEnable: boolean;
	SpawnTimeToRespawn: number;
	spawnTimeToRespawnNPC: number;
	spawnTimeById: string[];

	SatietyDefaultValue: number;
	SatietyDelay: number;
	SatietyReduceValue: number;

	HitDamageMod: number;
	HitStaminaReduce: number;
	isPowerAttackMult: number;
	isBashAttackMult: number;
	isPowerAttackStaminaReduce: number;

	keybindingBrowserSetVisible: number;
	keybindingBrowserSetFocused: number;
	keybindingShowMenu: number;
	keybindingShowPerkTree: number;

	StartUpItemsAdd: string[];

	LocationsForBuying: number[];

	LocationsForBuyingValue: number[];

	TimeScale: number;

	showNickname: boolean;
	enableInterval: boolean;
	enableALCHeffect: boolean;
	adminPassword: string;
}

interface PapyrusObject {
	desc: string;
	type: 'form' | 'espm';
}

interface LvlObject {
	id: number;
	count: number;
	level: number;
}

declare class JSModule {
	name: string;
	onRegister?(): void;
	onLoadGame?(actor: Actor): void;
	onDisconnect?(actor: Actor): void;
	onActivate?(targetReference: ObjectReference, casterReference: ObjectReference): boolean;
	onCellChange?(actor: Actor, prevCell: Cell, currentCell: Cell): void;
	onHit?(
		targetReference: ObjectReference,
		agressorReference: ObjectReference,
		isPowerAttack: boolean,
		isSneakAttack: boolean,
		isBashAttack: boolean,
		isHitBlocked: boolean
	): void;
	onDeath?(actor: Actor, killer: Actor | null): void;
	onHitStatic?(
		targetReference: ObjectReference,
		agressorReference: ObjectReference,
		isPowerAttack: boolean,
		isSneakAttack: boolean,
		isBashAttack: boolean,
		isHitBlocked: boolean
	): void;
	onEquip?(actor: Actor, targetForm: Form): void;
	onInput?(actor: Actor, keycodes: number[]): void;
	onAnimationEvent?(
		actor: Actor,
		currentAnimation: string,
		previousAnimation: string,
		isAttack: boolean,
		isJump: boolean,
		isFall: boolean,
		isJumpLand: boolean,
		isChangeHp: boolean
	): void;
	onEffectStart?(
		casterReference: ObjectReference,
		targetReference: ObjectReference,
		magicEffect: MagicEffect,
		mag: number
	): void;
	onCurrentCrosshairChange?(actor: Actor, targetReference: ObjectReference | null): void;
	onUiEvent?(actor: Actor, event: Record<string, unknown>): void;
	onChatInput?(actor: Actor, tokens: string[]): void;
	onChatCommand?(actor: Actor, cmd: string, tokens: string[]): boolean;
	onTriggerLeave?(triggerRef: Actor): void;
	onTriggerEnter?(triggerRef: Actor): void;

	onResurrect?(actor: Actor): void;
}

//#region Classes

//#region BaseClass
declare class BaseClass {
	public obj: PapyrusObject;
	constructor(obj: PapyrusObject) {
		this.obj = obj;
	}
}
//#endregion

//#region Form
declare class Form extends BaseClass {
	getLvlListObjects(): LvlObject[];
	getFormID(): number;
	getGoldValue(): number;
	getName(): string;
	getKeywords(): Keyword[];
	getNthKeyword(index: number): Keyword | undefined;
	getNumKeywords(): number;
	hasKeyword(akKeyword: Keyword): boolean;
	getType(): number;
	getWeight(): number;
	getWorldModelNthTextureSet(n: number): any;
	getWorldModelNumTextureSets(): number;
	getWorldModelPath(): string;
	hasWorldModel(): boolean;
	isPlayable(): boolean;
	playerKnows(): boolean;
	sendModEvent(eventName: string, strArg: string, numArg: number): void;
	setGoldValue(value: number): void;
	setName(name: string): void;
	setPlayerKnows(knows: boolean): void;
	setWeight(weight: number): void;
	setWorldModelNthTextureSet(nSet: any, n: number): void;
	setWorldModelPath(path: string): void;
	getEditorId(): string;
	getSignature(): string;
	equalSignature(signature: string): boolean;
}
//#endregion

//#region ObjectReference
declare class ObjectReference extends Form {
	static from(papyrusObject: BaseClass): ObjectReference | null;
	static get(id: number): ObjectReference | null;
	activate(akActivator: ObjectReference | null, abDefaultProcessingOnly: boolean): boolean;
	addDependentAnimatedObjectReference(akDependent: ObjectReference | null): boolean;
	addInventoryEventFilter(akFilter: Form | null): void;
	addItem(akItemToAdd: Form, aiCount: number = 1, abSilent: boolean = false): void;
	addToMap(abAllowFastTravel: boolean): void;
	applyHavokImpulse(afX: number, afY: number, afZ: number, afMagnitude: number): Promise<void>;
	blockActivation(abBlocked: boolean = true): void;
	calculateEncounterLevel(aiDifficulty: number): number;
	canFastTravelToMarker(): boolean;
	clearDestruction(): void;
	createDetectionEvent(akOwner: Actor | null, aiSoundLevel: number): void;
	createEnchantment(
		maxCharge: number,
		effects: PapyrusObject[] | null,
		magnitudes: number[] | null,
		areas: number[] | null,
		durations: number[] | null
	): void;
	damageObject(afDamage: number): void;
	delete(): void;
	disable(abFadeOut: boolean = false): void;
	disableNoWait(abFadeOut: boolean = false): void;
	dropObject(akObject: Form | null, aiCount: number): void;
	enable(abFadeIn: boolean): void;
	enableFastTravel(abEnable: boolean): void;
	enableNoWait(abFadeIn: boolean): void;
	forceAddRagdollToWorld(): void;
	forceRemoveRagdollFromWorld(): void;
	getActorOwner(): void;
	getAllForms(toFill: any | null): void;
	getAngleX(): number;
	getAngleY(): number;
	getAngleZ(): number;
	getAnimationVariableBool(arVariableName: string): boolean;
	getAnimationVariableFloat(arVariableName: string): number;
	getAnimationVariableInt(arVariableName: string): number;
	getBaseObject(): Form | null;
	getContainerForms(): Form[];
	getCurrentDestructionStage(): number;
	getCurrentLocation(): Location | null;
	getCurrentScene(): any | null;
	getDisplayName(): string;
	getEditorLocation(): Location | null;
	getEnableParent(): ObjectReference | null;
	getEnchantment(): any | null;
	getFactionOwner(): any | null;
	getHeadingAngle(akOther: ObjectReference | null): number;
	getHeight(): number;
	getItemCharge(): number;
	getItemCount(akItem: Form): number;
	getItemHealthPercent(): number;
	getItemMaxCharge(): number;
	getKey(): any | null;
	getLength(): number;
	getLinkedRef(apKeyword: Keyword | null): ObjectReference | null;
	getLockLevel(): number;
	getMass(): number;
	getNthForm(index: number): Form | null;
	getNthLinkedRef(aiLinkedRef: number): ObjectReference | null;
	getNthReferenceAlias(n: number): any | null;
	getNumItems(): number;
	getNumReferenceAliases(): number;
	getOpenState(): number;
	getParentCell(): Cell | null;
	getPoison(): Potion | null;
	getPositionX(): number;
	getPositionY(): number;
	getPositionZ(): number;
	getReferenceAliases(): PapyrusObject[] | null;
	getScale(): number;
	getTotalArmorWeight(): number;
	getTotalItemWeight(): number;
	getTriggerObjectCount(): number;
	getVoiceType(): any | null;
	getWidth(): number;
	getWorldSpace(): WorldSpace | null;
	hasEffectKeyword(akKeyword: Keyword | null): boolean;
	hasNode(asNodeName: string): boolean;
	hasRefType(akRefType: any | null): boolean;
	ignoreFriendlyHits(abIgnore: boolean): void;
	interruptCast(): void;
	is3DLoaded(): boolean;
	isActivateChild(akChild: ObjectReference | null): boolean;
	isActivationBlocked(): boolean;
	isDeleted(): boolean;
	isDisabled(): boolean;
	isFurnitureInUse(abIgnoreReserved: boolean): boolean;
	isFurnitureMarkerInUse(aiMarker: number, abIgnoreReserved: boolean): boolean;
	isHarvested(): boolean;
	isIgnoringFriendlyHits(): boolean;
	isInDialogueWithPlayer(): boolean;
	isLockBroken(): boolean;
	isLocked(): boolean;
	isMapMarkerVisible(): boolean;
	isOffLimits(): boolean;
	knockAreaEffect(afMagnitude: number, afRadius: number): void;
	lock(abLock: boolean, abAsOwner: boolean): void;
	moveTo(
		akTarget: ObjectReference,
		afXOffset: number = 0,
		afYOffset: number = 0,
		afZOffset: number = 0,
		abMatchRotation: boolean = true
	): void;
	moveToInteractionLocation(akTarget: ObjectReference | null): Promise<void>;
	moveToMyEditorLocation(): Promise<void>;
	moveToNode(akTarget: ObjectReference | null, asNodeName: string): Promise<void>;
	placeActorAtMe(akActorToPlace: any | null, aiLevelMod: number, akZone: any | null): Actor | null;
	placeAtMe(
		akFormToPlace: Form | null,
		aiCount: number = 1,
		abForcePersist: boolean = false,
		abInitiallyDisabled: boolean = false
	): ObjectReference | null;
	placeObjectOnStatic(spawnPointId: number, spawnObjectId: number): ObjectReference | null;
	playAnimation(asAnimation: string): boolean {
		throw `the method 'PlayAnimation' is not implemented`;
	}
	playAnimationAndWait(asAnimation: string, asEventName: string): Promise<boolean>;
	playGamebryoAnimation(asAnimation: string, abStartOver: boolean, afEaseInTime: number): boolean;
	playImpactEffect(
		akImpactEffect: any | null,
		asNodeName: string,
		afPickDirX: number,
		afPickDirY: number,
		afPickDirZ: number,
		afPickLength: number,
		abApplyNodeRotation: boolean,
		abUseNodeLocalRotation: boolean
	): boolean;
	playSyncedAnimationAndWaitSS(
		asAnimation1: string,
		asEvent1: string,
		akObj2: ObjectReference | null,
		asAnimation2: string,
		asEvent2: string
	): Promise<boolean>;
	playSyncedAnimationSS(asAnimation1: string, akObj2: ObjectReference | null, asAnimation2: string): boolean;
	playTerrainEffect(asEffectModelName: string, asAttachBoneName: string): void;
	processTrapHit(
		akTrap: ObjectReference | null,
		afDamage: number,
		afPushback: number,
		afXVel: number,
		afYVel: number,
		afZVel: number,
		afXPos: number,
		afYPos: number,
		afZPos: number,
		aeMaterial: number,
		afStagger: number
	): void;
	pushActorAway(akActorToPush: Actor | null, aiKnockbackForce: number): void;
	removeAllInventoryEventFilters(): void;
	removeAllItems(
		akTransferTo: ObjectReference | null = null,
		abKeepOwnership: boolean = false,
		abRemoveQuestItems: boolean = false
	): void;
	removeDependentAnimatedObjectReference(akDependent: ObjectReference | null): boolean;
	removeInventoryEventFilter(akFilter: Form | null): void;
	removeItem(
		akItemToRemove: Form | null,
		aiCount: number,
		abSilent: boolean = false,
		akOtherContainer: ObjectReference | null = null
	): void;
	reset(akTarget: ObjectReference | null): Promise<void>;
	resetInventory(): void;
	say(akTopicToSay: any | null, akActorToSpeakAs: Actor | null, abSpeakInPlayersHead: boolean): void;
	sendStealAlarm(akThief: Actor | null): void;
	setActorCause(akActor: Actor | null): void;
	setActorOwner(akActorBase: any | null): void;
	setAngle(afXAngle: number, afYAngle: number, afZAngle: number): void;
	setAnimationVariableBool(arVariableName: string, abNewValue: boolean): void;
	setAnimationVariableFloat(arVariableName: string, afNewValue: number): void;
	setAnimationVariableInt(arVariableName: string, aiNewValue: number): void;
	setDestroyed(abDestroyed: boolean): void;
	setDisplayName(name: string, force: boolean = false): void;
	setEnchantment(source: any | null, maxCharge: number): void;
	setFactionOwner(akFaction: any | null): void;
	setHarvested(harvested: boolean): void;
	setItemCharge(charge: number): void;
	setItemHealthPercent(health: number): void;
	setItemMaxCharge(maxCharge: number): void;
	setLockLevel(aiLockLevel: number): void;
	setMotionType(aeMotionType: any, abAllowActivate: boolean): Promise<void>;
	setNoFavorAllowed(abNoFavor: boolean): void;
	setOpen(abOpen: boolean): void;
	setPosition(afX: number, afY: number, afZ: number): void;
	setScale(afScale: number): void;
	splineTranslateTo(
		afX: number,
		afY: number,
		afZ: number,
		afXAngle: number,
		afYAngle: number,
		afZAngle: number,
		afTangentMagnitude: number,
		afSpeed: number,
		afMaxRotationSpeed: number
	): void;
	splineTranslateToRefNode(
		arTarget: ObjectReference | null,
		arNodeName: string,
		afTangentMagnitude: number,
		afSpeed: number,
		afMaxRotationSpeed: number
	): void;
	stopTranslation(): void;
	tetherToHorse(akHorse: ObjectReference | null): void;
	translateTo(
		afX: number,
		afY: number,
		afZ: number,
		afXAngle: number,
		afYAngle: number,
		afZAngle: number,
		afSpeed: number,
		afMaxRotationSpeed: number
	): void;
	waitForAnimationEvent(asEventName: string): Promise<boolean>;
	getDistance(akOther: ObjectReference | null): number;
	getRespawnTime(): number;
	getStorageValue<T = any>(key: string): T | undefined;
	setStorageValue(key: string, value: any): void;
	getLinkedDoorId(): number;
	getLinkedCellId(): number;
}
//#endregion

//#region Actor
declare class Actor extends ObjectReference {
	static from(papyrusObject: BaseClass): Actor | null;
	static get(id: number): Actor | null;
	addPerk(akPerk: Perk): void;
	addShout(akShout: any | null): boolean;
	addSpell(akSpell: any | null, abVerbose: boolean): boolean;
	allowBleedoutDialogue(abCanTalk: boolean): void;
	allowPCDialogue(abTalk: boolean): void;
	attachAshPile(akAshPileBase: Form | null): void;
	canFlyHere(): boolean;
	changeHeadPart(hPart: any | null): void;
	clearArrested(): void;
	clearExpressionOverride(): void;
	clearExtraArrows(): void;
	clearForcedMovement(): void;
	clearKeepOffsetFromActor(): void;
	clearLookAt(): void;
	damageActorValue(asValueName: string, afDamage: number): void;
	dismount(): boolean;
	dispelAllSpells(): void;
	dispelSpell(akSpell: any | null): boolean;
	doCombatSpellApply(akSpell: any | null, akTarget: ObjectReference | null): void;
	drawWeapon(): void;
	enableAI(abEnable: boolean): void;
	endDeferredKill(): void;
	equipItem(akItem: Form, abPreventRemoval: boolean = false, abSilent: boolean = false): void;
	equipItemById(
		item: Form | null,
		itemId: number,
		equipSlot: number,
		preventUnequip: boolean,
		equipSound: boolean
	): void;
	equipItemEx(item: Form | null, equipSlot: number, preventUnequip: boolean, equipSound: boolean): void;
	equipShout(akShout: any | null): void;
	equipSpell(akSpell: any | null, aiSource: number): void;
	evaluatePackage(): void;
	forceActorValue(asValueName: string, afNewValue: number): void;
	forceMovementDirection(afXAngle: number, afYAngle: number, afZAngle: number): void;
	forceMovementDirectionRamp(afXAngle: number, afYAngle: number, afZAngle: number, afRampTime: number): void;
	forceMovementRotationSpeed(afXMult: number, afYMult: number, afZMult: number): void;
	forceMovementRotationSpeedRamp(afXMult: number, afYMult: number, afZMult: number, afRampTime: number): void;
	forceMovementSpeed(afSpeedMult: number): void;
	forceMovementSpeedRamp(afSpeedMult: number, afRampTime: number): void;
	forceTargetAngle(afXAngle: number, afYAngle: number, afZAngle: number): void;
	forceTargetDirection(afXAngle: number, afYAngle: number, afZAngle: number): void;
	forceTargetSpeed(afSpeed: number): void;
	getActorValue(asValueName: string): number;
	getActorValueMax(asValueName: string): number;
	getActorValuePercentage(asValueName: string): number;
	getBaseActorValue(asValueName: string): number;
	getBribeAmount(): number;
	getCombatState(): number;
	getCombatTarget(): Actor | null;
	getCrimeFaction(): any | null;
	getCurrentPackage(): any | null;
	getDialogueTarget(): Actor | null;
	getEquippedArmorInSlot(aiSlot: number): Armor | null;
	getEquippedItemId(Location: number): number;
	getEquippedItemType(aiHand: number): number;
	getEquippedObject(Location: number): Form | null;
	getEquippedShield(): Armor | null;
	getEquippedShout(): any | null;
	getEquippedSpell(aiSource: number): any | null;
	getEquippedWeapon(abLeftHand: boolean): Weapon | null;
	getFactionRank(akFaction: any | null): number;
	getFactionReaction(akOther: Actor | null): number;
	getFactions(minRank: number, maxRank: number): PapyrusObject[] | null;
	getFlyingState(): number;
	getForcedLandingMarker(): ObjectReference | null;
	getFurnitureReference(): ObjectReference | null;
	getGoldAmount(): number;
	getHighestRelationshipRank(): number;
	getKiller(): Actor | null;
	getLevel(): number;
	getLeveledActorBase(): any | null;
	getLightLevel(): number;
	getLowestRelationshipRank(): number;
	getNoBleedoutRecovery(): boolean;
	getNthSpell(n: number): any | null;
	getPlayerControls(): boolean;
	getRace(): Race | null;
	getRelationshipRank(akOther: Actor | null): number;
	getSitState(): number;
	getSleepState(): number;
	getSpellCount(): number;
	getVoiceRecoveryTime(): number;
	getWarmthRating(): number;
	getWornForm(slotMask: number): Form | null;
	getWornItemId(slotMask: number): number;
	hasAssociation(akAssociation: any | null, akOther: Actor | null): boolean;
	hasFamilyRelationship(akOther: Actor | null): boolean;
	hasLOS(akOther: ObjectReference | null): boolean;
	hasMagicEffect(akEffect: MagicEffect | null): boolean;
	hasMagicEffectWithKeyword(akKeyword: Keyword | null): boolean;
	hasParentRelationship(akOther: Actor | null): boolean;
	hasPerk(akPerk: Perk): boolean;
	hasSpell(akForm: Form | null): boolean;
	isAIEnabled(): boolean;
	isAlarmed(): boolean;
	isAlerted(): boolean;
	isAllowedToFly(): boolean;
	isArrested(): boolean;
	isArrestingTarget(): boolean;
	isBeingRidden(): boolean;
	isBleedingOut(): boolean;
	isBribed(): boolean;
	isChild(): boolean;
	isCommandedActor(): boolean;
	isDead(): boolean;
	isDetectedBy(akOther: Actor | null): boolean;
	isDoingFavor(): boolean;
	isEquipped(akItem: Form | null): boolean;
	isEssential(): boolean;
	isFlying(): boolean;
	isGhost(): boolean;
	isGuard(): boolean;
	isHostileToActor(akActor: Actor | null): boolean;
	isHuman(): boolean;
	isInCombat(): boolean;
	isInFaction(akFaction: any | null): boolean;
	isInKillMove(): boolean;
	isIntimidated(): boolean;
	isOnMount(): boolean;
	isOverEncumbered(): boolean;
	isPlayerTeammate(): boolean;
	isPlayersLastRiddenHorse(): boolean;
	isRunning(): boolean;
	isSneaking(): boolean;
	isSprinting(): boolean;
	isSwimming(): boolean;
	isTrespassing(): boolean;
	isUnconscious(): boolean;
	isWeaponDrawn(): boolean;
	keepOffsetFromActor(
		arTarget: Actor | null,
		afOffsetX: number,
		afOffsetY: number,
		afOffsetZ: number,
		afOffsetAngleX: number,
		afOffsetAngleY: number,
		afOffsetAngleZ: number,
		afCatchUpRadius: number,
		afFollowRadius: number
	): void;

	kill(akKiller: Actor | null = null): void;

	killSilent(akKiller: Actor | null): void;
	modActorValue(asValueName: string, afAmount: number): void;
	modAV(asValueName: string, afAmount: number): void;
	modFactionRank(akFaction: any | null, aiMod: number): void;
	moveToPackageLocation(): Promise<void>;
	openInventory(abForceOpen: boolean): void;
	pathToReference(aTarget: ObjectReference | null, afWalkRunPercent: number): Promise<boolean>;
	playIdle(akIdle: any | null): boolean {
		throw `the method 'PlayIdle' is not implemented`;
	}
	playIdleWithTarget(akIdle: any | null, akTarget: ObjectReference | null): boolean;
	playSubGraphAnimation(asEventName: string): void;
	queueNiNodeUpdate(): void;
	regenerateHead(): void;
	removeFromAllFactions(): void;
	removeFromFaction(akFaction: any | null): void;
	removePerk(akPerk: Perk): void;
	removeShout(akShout: any | null): boolean;
	removeSpell(akSpell: any | null): boolean;
	replaceHeadPart(oPart: any | null, newPart: any | null): void;
	resetAI(): void;
	resetExpressionOverrides(): void;
	resetHealthAndLimbs(): void;
	restoreActorValue(asValueName: string, afAmount: number): void;
	restoreAV(asValueName: string, afAmount: number): void;
	resurrect(): Promise<void>;
	sendAssaultAlarm(): void;
	sendLycanthropyStateChanged(abIsWerewolf: boolean): void;
	sendTrespassAlarm(akCriminal: Actor | null): void;
	sendVampirismStateChanged(abIsVampire: boolean): void;
	setActorValue(asValueName: string, afValue: number): void;
	setAlert(abAlerted: boolean): void;
	setAllowFlying(abAllowed: boolean): void;
	setAllowFlyingEx(abAllowed: boolean, abAllowCrash: boolean, abAllowSearch: boolean): void;
	setAlpha(afTargetAlpha: number, abFade: boolean): void;
	setAttackActorOnSight(abAttackOnSight: boolean): void;
	setBribed(abBribe: boolean): void;
	setCrimeFaction(akFaction: any | null): void;
	setCriticalStage(aiStage: number): void;
	setDoingFavor(abDoingFavor: boolean): void;
	setDontMove(abDontMove: boolean): void;
	setExpressionModifier(index: number, value: number): void;
	setExpressionOverride(aiMood: number, aiStrength: number): void;
	setExpressionPhoneme(index: number, value: number): void;
	setEyeTexture(akNewTexture: any | null): void;
	setFactionRank(akFaction: any | null, aiRank: number): void;
	setForcedLandingMarker(aMarker: ObjectReference | null): void;
	setGhost(abIsGhost: boolean): void;
	setHeadTracking(abEnable: boolean): void;
	setIntimidated(abIntimidate: boolean): void;
	setLookAt(akTarget: ObjectReference | null, abPathingLookAt: boolean): void;
	setNoBleedoutRecovery(abAllowed: boolean): void;
	setNotShowOnStealthMeter(abNotShow: boolean): void;
	setOutfit(akOutfit: Outfit | null, abSleepOutfit: boolean): void;
	setPlayerControls(abControls: boolean): void;
	setPlayerResistingArrest(): void;
	setPlayerTeammate(abTeammate: boolean, abCanDoFavor: boolean): void;
	setRace(akRace: Race | null): void;
	setRelationshipRank(akOther: Actor | null, aiRank: number): void;
	setRestrained(abRestrained: boolean): void;
	setSubGraphFloatVariable(asVariableName: string, afValue: number): void;
	setUnconscious(abUnconscious: boolean): void;
	setVehicle(akVehicle: ObjectReference | null): void;
	setVoiceRecoveryTime(afTime: number): void;
	sheatheWeapon(): void;
	showBarterMenu(): void;
	showGiftMenu(
		abGivingGift: boolean,
		apFilterList: any | null,
		abShowStolenItems: boolean,
		abUseFavorPoints: boolean
	): Promise<number>;
	startCannibal(akTarget: Actor | null): void;
	startCombat(akTarget: Actor | null): void;
	startDeferredKill(): void;
	startSneaking(): void;
	startVampireFeed(akTarget: Actor | null): void;
	stopCombat(): void;
	stopCombatAlarm(): void;
	trapSoul(akTarget: Actor | null): boolean;
	unLockOwnedDoorsInCell(): void;
	unequipAll(): void;
	unequipItem(akItem: Form, abPreventEquip: boolean = false, abSilent: boolean = false): void;
	unequipItemEx(item: Form | null, equipSlot: number, preventEquip: boolean): void;
	unequipItemSlot(aiSlot: number): void;
	unequipShout(akShout: any | null): void;
	unequipSpell(akSpell: any | null, aiSource: number): void;
	updateWeight(neckDelta: number): void;
	willIntimidateSucceed(): boolean;
	wornHasKeyword(akKeyword: Keyword | null): boolean;
	setWorldSpace(id: number): void;
	throwOut(): void;
}
//#endregion

//#region Armor
declare class Armor extends Form {
	static from(papyrusObject: BaseClass): Armor | null;
	static get(id: number): Armor | null;
	addSlotToMask(slotMask: number): number;
	getArmorRating(): number;
	getEnchantment(): any | null;
	getIconPath(bFemalePath: boolean): string;
	getMessageIconPath(bFemalePath: boolean): string;
	getModelPath(bFemalePath: boolean): string;
	getNthArmorAddon(n: number): any | null;
	getNumArmorAddons(): number;
	getSlotMask(): number;
	getWarmthRating(): number;
	getWeightClass(): number;
	modArmorRating(modBy: number): void;
	removeSlotFromMask(slotMask: number): number;
	setArmorRating(armorRating: number): void;
	setEnchantment(e: any | null): void;
	setIconPath(path: string, bFemalePath: boolean): void;
	setMessageIconPath(path: string, bFemalePath: boolean): void;
	setModelPath(path: string, bFemalePath: boolean): void;
	setSlotMask(slotMask: number): void;
	setWeightClass(weightClass: number): void;
}
//#endregion

//#region Cell
declare class Cell extends Form {
	static from(papyrusObject: BaseClass): Cell | null;
	static get(id: number): Cell | null;
	getActorOwner(): any | null;
	getFactionOwner(): any | null;
	getNthRef(n: number, formTypeFilter: number): ObjectReference | null;
	getNumRefs(formTypeFilter: number): number;
	getWaterLevel(): number;
	getLocation(): Location;
	isAttached(): boolean;
	isInterior(): boolean;
	reset(): void;
	setActorOwner(akActor: any | null): void;
	setFactionOwner(akFaction: any | null): void;
	setFogColor(
		aiNearRed: number,
		aiNearGreen: number,
		aiNearBlue: number,
		aiFarRed: number,
		aiFarGreen: number,
		aiFarBlue: number
	): void;
	setFogPlanes(afNear: number, afFar: number): void;
	setFogPower(afPower: number): void;
	setPublic(abPublic: boolean): void;
}
//#endregion

//#region ConstructibleObject
declare class ConstructibleObject extends Form {
	static from(papyrusObject: BaseClass): ConstructibleObject | null;
	static get(id: number): ConstructibleObject | null;
	getNthIngredient(n: number): Form | null;
	getNthIngredientQuantity(n: number): number;
	getNumIngredients(): number;
	getResult(): Form | null;
	getResultQuantity(): number;
	getWorkbenchKeyword(): Keyword | null;
	setNthIngredient(required: Form | null, n: number): void;
	setNthIngredientQuantity(value: number, n: number): void;
	setResult(result: Form | null): void;
	setResultQuantity(quantity: number): void;
	setWorkbenchKeyword(aKeyword: Keyword | null): void;
}
//#endregion

//#region Keyword
declare class Keyword extends Form {
	static from(papyrusObject: BaseClass): Keyword | null;
	static get(id: number): Keyword | null;
	static getKeyword(key: string): Keyword | null;
}
//#endregion

//#region Location
declare class Location extends Form {
	static from(papyrusObject: BaseClass): Location | null;
	static get(id: number): Location | null;
	getKeywordData(akKeyword: Keyword): number;
	hasCommonParent(akOther: Location, akFilter: Keyword): boolean;
	isCleared(): boolean;
	isLoaded(): boolean;
	isSameLocation(akOtherLocation: Location, akKeyword: Keyword): boolean;
	setKeywordData(akKeyword: Keyword, afData: number): void;
	setCleared(abCleared: boolean = true): void;
	getParent(): Location | null;
}
//#endregion

//#region MagicEffect
declare class MagicEffect extends Form {
	static from(papyrusObject: BaseClass): MagicEffect | null;
	static get(id: number): MagicEffect | null;
	clearEffectFlag(flag: number): void;
	getArea(): number;
	getAssociatedSkill(): Promise<string>;
	getBaseCost(): number;
	getCastTime(): number;
	getCastingArt(): any | null;
	getCastingType(): number;
	getDeliveryType(): number;
	getEnchantArt(): any | null;
	getEnchantShader(): any | null;
	getEquipAbility(): any | null;
	getExplosion(): any | null;
	getHitEffectArt(): any | null;
	getHitShader(): any | null;
	getImageSpaceMod(): any | null;
	getImpactDataSet(): any | null;
	getLight(): any | null;
	getPerk(): any | null;
	getProjectile(): any | null;
	getResistance(): string;
	getSkillLevel(): number;
	getSkillUsageMult(): number;
	getSounds(): PapyrusObject[] | null;
	isEffectFlagSet(flag: number): boolean;
	setArea(area: number): void;
	setAssociatedSkill(skill: string): void;
	setBaseCost(cost: number): void;
	setCastTime(castTime: number): void;
	setCastingArt(obj: any | null): void;
	setEffectFlag(flag: number): void;
	setEnchantArt(obj: any | null): void;
	setEnchantShader(obj: any | null): void;
	setEquipAbility(obj: any | null): void;
	setExplosion(obj: any | null): void;
	setHitEffectArt(obj: any | null): void;
	setHitShader(obj: any | null): void;
	setImageSpaceMod(obj: any | null): void;
	setImpactDataSet(obj: any | null): void;
	setLight(obj: any | null): void;
	setPerk(obj: any | null): void;
	setProjectile(obj: any | null): void;
	setResistance(skill: string): void;
	setSkillLevel(level: number): void;
	setSkillUsageMult(usageMult: number): void;
}
//#endregion

//#region Outfit
declare class Outfit extends Form {
	static from(papyrusObject: BaseClass): Outfit | null;
	static get(id: number): Outfit | null;
}
//#endregion

//#region Perk
declare class Perk extends Form {
	static from(papyrusObject: BaseClass): Perk | null;
	static get(id: number): Perk | null;
}
//#endregion

//#region Potion
declare class Potion extends Form {
	static from(papyrusObject: BaseClass): Potion | null;
	static get(id: number): Potion | null;
	getCostliestEffectIndex(): number;
	getEffectAreas(): number[];
	getEffectDurations(): number[];
	getEffectMagnitudes(): number[];
	getMagicEffects(): MagicEffect[];
	getNthEffectArea(index: number): number;
	getNthEffectDuration(index: number): number;
	getNthEffectMagicEffect(index: number): MagicEffect | null;
	getNthEffectMagnitude(index: number): number;
	getNumEffects(): number;
	getUseSound(): any | null;
	isFood(): boolean;
	isHostile(): boolean;
	isPoison(): boolean;
	setNthEffectArea(index: number, value: number): void;
	setNthEffectDuration(index: number, value: number): void;
	setNthEffectMagnitude(index: number, value: number): void;
}
//#endregion

//#region Race
declare class Race extends Form {
	static from(papyrusObject: BaseClass): Race | null;
	static get(id: number): Race | null;
}
//#endregion

//#region Weapon
declare class Weapon extends Form {
	static from(papyrusObject: BaseClass): Weapon | null;
	static get(id: number): Weapon | null;
	fire(akSource: ObjectReference | null, akAmmo: any | null): void;
	getBaseDamage(): number;
	getCritDamage(): number;
	getCritEffect(): any | null;
	getCritEffectOnDeath(): boolean;
	getCritMultiplier(): number;
	getEnchantment(): any | null;
	getEnchantmentValue(): number;
	getEquipType(): any | null;
	getEquippedModel(): any | null;
	getIconPath(): string;
	getMaxRange(): number;
	getMessageIconPath(): string;
	getMinRange(): number;
	getModelPath(): string;
	getReach(): number;
	getResist(): string;
	getSkill(): string;
	getSpeed(): number;
	getStagger(): number;
	getTemplate(): Weapon | null;
	getWeaponType(): number;
	setBaseDamage(damage: number): void;
	setCritDamage(damage: number): void;
	setCritEffect(ce: any | null): void;
	setCritEffectOnDeath(ceod: boolean): void;
	setCritMultiplier(crit: number): void;
	setEnchantment(e: any | null): void;
	setEnchantmentValue(value: number): void;
	setEquipType(type: any | null): void;
	setEquippedModel(model: any | null): void;
	setIconPath(path: string): void;
	setMaxRange(maxRange: number): void;
	setMessageIconPath(path: string): void;
	setMinRange(minRange: number): void;
	setModelPath(path: string): void;
	setReach(reach: number): void;
	setResist(resist: string): void;
	setSkill(skill: string): void;
	setSpeed(speed: number): void;
	setStagger(stagger: number): void;
	setWeaponType(type: number): void;
}
//#endregion

//#region WorldSpace
declare class WorldSpace extends Form {
	static from(papyrusObject: BaseClass): WorldSpace | null;
	static get(id: number): WorldSpace | null;
}
//#endregion

//#region Debug
class Debug {
	static centerOnCell(target: Actor, asCellname: string): void;
	static centerOnCellAndWait(param1: string): Promise<number>;
	static closeUserLog(param1: string): void;
	static dBSendPlayerPosition(): void;
	static debugChannelNotify(param1: string, param2: string): void;
	static dumpAliasData(param1: any | null): void;
	static getConfigName(): Promise<string>;
	static getPlatformName(): Promise<string>;
	static getVersionNumber(): Promise<string>;
	static messageBox(param1: string): void;
	static notification(target: Actor, msg: string): void;
	static openUserLog(param1: string): boolean;
	static playerMoveToAndWait(param1: string): Promise<number>;
	static quitGame(target: Actor): void;
	static sendAnimationEvent(arRef: ObjectReference, asEventName: string): void;
	static setFootIK(param1: boolean): void;
	static setGodMode(param1: boolean): void;
	static showRefPosition(arRef: ObjectReference | null): void;
	static startScriptProfiling(param1: string): void;
	static startStackProfiling(): void;
	static stopScriptProfiling(param1: string): void;
	static stopStackProfiling(): void;
	static takeScreenshot(param1: string): void;
	static toggleAI(): void;
	static toggleCollisions(target: Actor): void;
	static toggleMenus(): void;
	static trace(param1: string, param2: number): void;
	static traceStack(param1: string, param2: number): void;
	static traceUser(param1: string, param2: string, param3: number): boolean;
}
//#endregion

//#region Game
class Game {
	static addAchievement(aiAchievementID: number): void;
	static addHavokBallAndSocketConstraint(
		arRefA: ObjectReference | null,
		arRefANode: string,
		arRefB: ObjectReference | null,
		arRefBNode: string,
		afRefALocalOffsetX: number,
		afRefALocalOffsetY: number,
		afRefALocalOffsetZ: number,
		afRefBLocalOffsetX: number,
		afRefBLocalOffsetY: number,
		afRefBLocalOffsetZ: number
	): Promise<boolean>;
	static addPerkPoints(aiPerkPoints: number): void;
	static advanceSkill(asSkillName: string, afMagnitude: number): void;
	static calculateFavorCost(aiFavorPrice: number): number;
	static clearPrison(): void;
	static clearTempEffects(): void;
	static disablePlayerControls(
		target: Actor,
		abMovement: boolean = true,
		abFighting: boolean = true,
		abCamSwitch: boolean = false,
		abLooking: boolean = false,
		abSneaking: boolean = false,
		abMenu: boolean = true,
		abActivate: boolean = true,
		abJournalTabs: boolean = false,
		aiDisablePOVType: number = 0
	): void;
	static enableFastTravel(abEnable: boolean): void;
	static enablePlayerControls(
		target: Actor,
		abMovement: boolean = true,
		abFighting: boolean = true,
		abCamSwitch: boolean = true,
		abLooking: boolean = true,
		abSneaking: boolean = true,
		abMenu: boolean = true,
		abActivate: boolean = true,
		abJournalTabs: boolean = true,
		aiDisablePOVType: number = 0
	): void;
	static fadeOutGame(
		abFadingOut: boolean,
		abBlackFade: boolean,
		afSecsBeforeFade: number,
		afFadeDuration: number
	): void;
	static fastTravel(akDestination: ObjectReference | null): void;
	static findClosestActor(afX: number, afY: number, afZ: number, afRadius: number): Actor | null;
	static findClosestReferenceOfAnyTypeInList(
		arBaseObjects: any | null,
		afX: number,
		afY: number,
		afZ: number,
		afRadius: number
	): ObjectReference | null;
	static findClosestReferenceOfType(
		arBaseObject: Form | null,
		afX: number,
		afY: number,
		afZ: number,
		afRadius: number
	): ObjectReference | null;
	static findRandomActor(afX: number, afY: number, afZ: number, afRadius: number): Actor | null;
	static findRandomReferenceOfAnyTypeInList(
		arBaseObjects: any | null,
		afX: number,
		afY: number,
		afZ: number,
		afRadius: number
	): ObjectReference | null;
	static findRandomReferenceOfType(
		arBaseObject: Form | null,
		afX: number,
		afY: number,
		afZ: number,
		afRadius: number
	): ObjectReference | null;
	static forceFirstPerson(): void;
	static forceThirdPerson(target: Actor): void;
	static getCameraState(): number;
	static getCurrentConsoleRef(): ObjectReference | null;
	static getCurrentCrosshairRef(target: Actor): ObjectReference | null;
	static getDialogueTarget(): ObjectReference | null;
	static getExperienceForLevel(currentLevel: number): number;
	static getForm(aiFormID: number): Form | null;
	static getFormEx(formId: number): Form | null;
	static getFormFromFile(aiFormID: number, asFilename: string): Form | null;
	static getGameSettingFloat(asGameSetting: string): number;
	static getGameSettingInt(asGameSetting: string): number;
	static getGameSettingString(asGameSetting: string): Promise<string>;
	static getHotkeyBoundObject(hotkey: number): Form | null;
	static getLightModAuthor(idx: number): string;
	static getLightModByName(name: string): number;
	static getLightModCount(): number;
	static getLightModDependencyCount(idx: number): number;
	static getLightModDescription(idx: number): string;
	static getLightModName(idx: number): string;
	static getModAuthor(modIndex: number): string;
	static getModByName(name: string): number;
	static getModCount(): number;
	static getModDependencyCount(modIndex: number): number;
	static getModDescription(modIndex: number): string;
	static getModName(modIndex: number): string;
	static getNthLightModDependency(modIdx: number, idx: number): number;
	static getNthTintMaskColor(n: number): number;
	static getNthTintMaskTexturePath(n: number): string;
	static getNthTintMaskType(n: number): number;
	static getNumTintMasks(): number;
	static getNumTintsByType(type: number): number;
	static getPerkPoints(): number;
	static getPlayerExperience(): number;
	static getPlayerGrabbedRef(): ObjectReference | null;
	static getPlayerMovementMode(): boolean;
	static getPlayersLastRiddenHorse(): Actor | null;
	static getRealHoursPassed(): number;
	static getSunPositionX(): number;
	static getSunPositionY(): number;
	static getSunPositionZ(): number;
	static getTintMaskColor(type: number, index: number): number;
	static getTintMaskTexturePath(type: number, index: number): string;
	static hideTitleSequenceMenu(): void;
	static incrementSkill(asSkillName: string): void;
	static incrementSkillBy(asSkillName: string, aiCount: number): void;
	static incrementStat(asStatName: string, aiModAmount: number): void;
	static isActivateControlsEnabled(): boolean;
	static isCamSwitchControlsEnabled(): boolean;
	static isFastTravelControlsEnabled(): boolean;
	static isFastTravelEnabled(): boolean;
	static isFightingControlsEnabled(): boolean;
	static isJournalControlsEnabled(): boolean;
	static isLookingControlsEnabled(): boolean;
	static isMenuControlsEnabled(): boolean;
	static isMovementControlsEnabled(): boolean;
	static isObjectFavorited(Form: Form | null): boolean;
	static isPlayerSungazing(): boolean;
	static isModuleInstalled(name: string): boolean;
	static isSneakingControlsEnabled(): boolean;
	static isWordUnlocked(akWord: any | null): boolean;
	static loadGame(name: string): void;
	static modPerkPoints(perkPoints: number): void;
	static playBink(
		asFilename: string,
		abInterruptible: boolean,
		abMuteAudio: boolean,
		abMuteMusic: boolean,
		abLetterbox: boolean
	): void;
	static precacheCharGen(): void;
	static precacheCharGenClear(): void;
	static queryStat(asStat: string): number;
	static quitToMainMenu(): void;
	static removeHavokConstraints(
		arFirstRef: ObjectReference | null,
		arFirstRefNodeName: string,
		arSecondRef: ObjectReference | null,
		arSecondRefNodeName: string
	): Promise<boolean>;
	static requestAutosave(): void;
	static requestModel(asModelName: string): void;
	static requestSave(): void;
	static saveGame(name: string): void;
	static sendWereWolfTransformation(): void;
	static serveTime(): void;
	static setAllowFlyingMountLandingRequests(abAllow: boolean): void;
	static setBeastForm(abEntering: boolean): void;
	static setCameraTarget(arTarget: Actor | null): void;
	static setGameSettingBool(setting: string, value: boolean): void;
	static setGameSettingFloat(setting: string, value: number): void;
	static setGameSettingInt(setting: string, value: number): void;
	static setGameSettingString(setting: string, value: string): void;
	static setHudCartMode(abSetCartMode: boolean): void;
	static setInChargen(
		abDisableSaving: boolean,
		abDisableWaiting: boolean,
		abShowControlsDisabledMessage: boolean
	): void;
	static setMiscStat(name: string, value: number): void;
	static setNthTintMaskColor(n: number, color: number): void;
	static setNthTintMaskTexturePath(path: string, n: number): void;
	static setPerkPoints(perkPoints: number): void;
	static setPlayerAIDriven(abAIDriven: boolean): void;
	static setPlayerExperience(exp: number): void;
	static setPlayerLevel(level: number): void;
	static setPlayerReportCrime(abReportCrime: boolean): void;
	static setPlayersLastRiddenHorse(horse: Actor | null): void;
	static setSittingRotation(afValue: number): void;
	static setSunGazeImageSpaceModifier(apImod: any | null): void;
	static setTintMaskColor(color: number, type: number, index: number): void;
	static setTintMaskTexturePath(path: string, type: number, index: number): void;
	static showFirstPersonGeometry(abShow: boolean): void;
	static showLimitedRaceMenu(): void;
	static showRaceMenu(): void;
	static showTitleSequenceMenu(): void;
	static showTrainingMenu(aTrainer: Actor | null): void;
	static startTitleSequence(asSequenceName: string): void;
	static teachWord(akWord: any | null): void;
	static triggerScreenBlood(aiValue: number): void;
	static unbindObjectHotkey(hotkey: number): void;
	static unlockWord(akWord: any | null): void;
	static updateHairColor(): void;
	static updateThirdPerson(): void;
	static updateTintMaskColors(): void;
	static usingGamepad(): boolean;
	static getPlayer(): Actor | null;
	static shakeCamera(akSource: ObjectReference | null, afStrength: number, afDuration: number): void;
	static shakeController(afSmallMotorStrength: number, afBigMotorStreangth: number, afDuration: number): void;
	static getServerOption(): ServerOption;
	static getServerOptionValue<T = any>(key: string): T;
}
//#endregion

//#region M
class M {
	static getActorsInStreamZone(target: Actor): Actor[];
	static getOnlinePlayers(): Actor[];
	static isPlayer(id: number): boolean;
	static browserSetVisible(target: Actor, state: boolean): void;
	static browserSetFocused(target: Actor, state: boolean): void;
	static browserSetModal(target: Actor, state: boolean): void;
	static browserGetVisible(target: Actor): boolean;
	static browserGetFocused(target: Actor): boolean;
	static browserGetModal(target: Actor): boolean;
	static getGlobalStorageValue(key: string): PapyrusValue | undefined;
	static setGlobalStorageValue(key: string, value: PapyrusValue): void;
	static sendChatMessage(target: Actor, message: string): void;
	static sendChatCommand(target: Actor, command: string, message: string): void;
}
//#endregion

//#endregion

type EventEmitterFunction = <T = unknown>(data: T) => void;

interface EventEmitter {
	emit(eventName: string, data: unknown);
	subscribe(eventName: string, fn: EventEmitterFunction);
}

declare const emitter: EventEmitter;
