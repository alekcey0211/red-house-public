/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-use-before-define */
/* eslint-disable quotes */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types  */
import { Mp, PapyrusObject, PapyrusValue } from '../types/mp';

declare const mp: Mp;

const from = (func: string, obj: PapyrusObject): PapyrusObject | undefined | null => {
	try {
		return mp.callPapyrusFunction('global', 'RHF_Modules', func, null, [obj]) as PapyrusObject | undefined | null;
	} catch {
		return null;
	}
};

// #region Classes
import {
	IActor,
	IArmor,
	ICell,
	IConstructibleObject,
	IDebug,
	IForm,
	IGame,
	IKeyword,
	IM,
	IMagicEffect,
	IObjectReference,
	IOutfit,
	IPerk,
	IPotion,
	IRace,
	IWeapon,
	IWorldSpace,
	ILocation,
} from '../..';
import { ServerOption } from '../papyrus/game/server-options';
import { EventEmitter } from '../utils/event-emitter';
import { LvlObject } from '../papyrus/form/lvl-list';

// #region BaseClass
class BaseClass {
	public obj: PapyrusObject;

	constructor(obj: PapyrusObject) {
		this.obj = obj;
	}
}
// #endregion

// #region Form
export class Form extends BaseClass {
	constructor(obj: PapyrusObject) {
		super(obj);
		if (!IForm) throw new Error("the interface 'IForm' is not defined");
	}

	getLvlListObjects(): LvlObject[] {
		if (!IForm.GetLvlListObjects) throw new Error("the method 'GetLvlListObjects' is not implemented");
		return IForm.GetLvlListObjects(this.obj);
	}

	getFormID(): number {
		if (!IForm.GetFormID) throw new Error("the method 'GetFormID' is not implemented");
		return IForm.GetFormID(this.obj);
	}

	getGoldValue(): number {
		if (!IForm.GetGoldValue) throw new Error("the method 'GetGoldValue' is not implemented");
		return IForm.GetGoldValue(this.obj);
	}

	getName(): string {
		if (!IForm.GetName) throw new Error("the method 'GetName' is not implemented");
		return IForm.GetName(this.obj);
	}

	getKeywords(): Keyword[] {
		if (!IForm.GetKeywords) throw new Error("the method 'GetKeywords' is not implemented");
		const objArray = IForm.GetKeywords(this.obj);
		return objArray.map((obj) => new Keyword(obj));
	}

	getNthKeyword(index: number): Keyword | null {
		if (!IForm.GetNthKeyword) throw new Error("the method 'GetNthKeyword' is not implemented");
		const obj = IForm.GetNthKeyword(this.obj, [index]);
		if (!obj) return null;
		return new Keyword(obj);
	}

	getNumKeywords(): number {
		if (!IForm.GetNumKeywords) throw new Error("the method 'GetNumKeywords' is not implemented");
		return IForm.GetNumKeywords(this.obj);
	}

	hasKeyword(akKeyword: Keyword): boolean {
		if (!IForm.HasKeyword) throw new Error("the method 'HasKeyword' is not implemented");
		if (!akKeyword) throw new Error('akKeyword is not defined');
		return IForm.HasKeyword(this.obj, [akKeyword.obj]);
	}

	getType(): number {
		if (!IForm.GetType) throw new Error("the method 'GetType' is not implemented");
		return IForm.GetType(this.obj);
	}

	getWeight(): number {
		if (!IForm.GetWeight) throw new Error("the method 'GetWeight' is not implemented");
		return IForm.GetWeight(this.obj);
	}

	getWorldModelNthTextureSet(n: number): any {
		throw new Error("the method 'GetWorldModelNthTextureSet' is not implemented");
	}

	getWorldModelNumTextureSets(): number {
		throw new Error("the method 'GetWorldModelNumTextureSets' is not implemented");
	}

	getWorldModelPath(): string {
		throw new Error("the method 'GetWorldModelPath' is not implemented");
	}

	hasWorldModel(): boolean {
		throw new Error("the method 'HasWorldModel' is not implemented");
	}

	isPlayable(): boolean {
		throw new Error("the method 'IsPlayable' is not implemented");
	}

	playerKnows(): boolean {
		throw new Error("the method 'PlayerKnows' is not implemented");
	}

	sendModEvent(eventName: string, strArg: string, numArg: number): void {
		throw new Error("the method 'SendModEvent' is not implemented");
	}

	setGoldValue(value: number): void {
		throw new Error("the method 'SetGoldValue' is not implemented");
	}

	setName(name: string): void {
		throw new Error("the method 'SetName' is not implemented");
	}

	setPlayerKnows(knows: boolean): void {
		throw new Error("the method 'SetPlayerKnows' is not implemented");
	}

	setWeight(weight: number): void {
		throw new Error("the method 'SetWeight' is not implemented");
	}

	setWorldModelNthTextureSet(nSet: any, n: number): void {
		throw new Error("the method 'SetWorldModelNthTextureSet' is not implemented");
	}

	setWorldModelPath(path: string): void {
		throw new Error("the method 'SetWorldModelPath' is not implemented");
	}

	getEditorId(): string {
		if (!IForm.GetEditorID) throw new Error("the method 'GetEditorID' is not implemented");
		return IForm.GetEditorID(this.obj);
	}

	getSignature(): string {
		if (!IForm.GetSignature) throw new Error("the method 'GetSignature' is not implemented");
		return IForm.GetSignature(this.obj);
	}

	equalSignature(signature: string): boolean {
		if (!IForm.EqualSignature) throw new Error("the method 'EqualSignature' is not implemented");
		return IForm.EqualSignature(this.obj, [signature]);
	}
}
// #endregion

// #region ObjectReference
export class ObjectReference extends Form {
	constructor(obj: PapyrusObject) {
		super(obj);
		if (!IObjectReference) throw new Error("the interface 'IObjectReference' is not defined");
	}

	static from(papyrusObject: BaseClass): ObjectReference | null {
		if (!papyrusObject) return null;
		const obj = from('GetObjectReference', papyrusObject.obj);
		if (!obj) return null;
		return new ObjectReference(obj);
	}

	static get(id: number): ObjectReference | null {
		const form = Game.getForm(id);
		if (!form) return null;
		const objectReference = ObjectReference.from(form);
		if (!objectReference) return null;
		return objectReference;
	}

	activate(akActivator: ObjectReference | null, abDefaultProcessingOnly: boolean): boolean {
		throw new Error("the method 'Activate' is not implemented");
	}

	addDependentAnimatedObjectReference(akDependent: ObjectReference | null): boolean {
		throw new Error("the method 'AddDependentAnimatedObjectReference' is not implemented");
	}

	addInventoryEventFilter(akFilter: Form | null): void {
		throw new Error("the method 'AddInventoryEventFilter' is not implemented");
	}

	addItem(akItemToAdd: Form, aiCount: number = 1, abSilent: boolean = false): void {
		if (!IObjectReference.AddItem) throw new Error("the method 'AddItem' is not implemented");
		if (!akItemToAdd) throw new Error('ItemToAdd is not defined');
		return IObjectReference.AddItem(this.obj, [akItemToAdd.obj, aiCount, abSilent]);
	}

	addToMap(abAllowFastTravel: boolean): void {
		throw new Error("the method 'AddToMap' is not implemented");
	}

	applyHavokImpulse(afX: number, afY: number, afZ: number, afMagnitude: number): Promise<void> {
		throw new Error("the method 'ApplyHavokImpulse' is not implemented");
	}

	blockActivation(abBlocked: boolean = true): void {
		if (!IObjectReference.BlockActivation) throw new Error("the method 'BlockActivation' is not implemented");
		return IObjectReference.BlockActivation(this.obj, [abBlocked]);
	}

	calculateEncounterLevel(aiDifficulty: number): number {
		throw new Error("the method 'CalculateEncounterLevel' is not implemented");
	}

	canFastTravelToMarker(): boolean {
		throw new Error("the method 'CanFastTravelToMarker' is not implemented");
	}

	clearDestruction(): void {
		if (!IObjectReference.ClearDestruction) throw new Error("the method 'ClearDestruction' is not implemented");
		return IObjectReference.ClearDestruction(this.obj);
	}

	createDetectionEvent(akOwner: Actor | null, aiSoundLevel: number): void {
		throw new Error("the method 'CreateDetectionEvent' is not implemented");
	}

	createEnchantment(
		maxCharge: number,
		effects: PapyrusObject[] | null,
		magnitudes: number[] | null,
		areas: number[] | null,
		durations: number[] | null
	): void {
		throw new Error("the method 'CreateEnchantment' is not implemented");
	}

	damageObject(afDamage: number): void {
		if (!IObjectReference.DamageObject) throw new Error("the method 'DamageObject' is not implemented");
		return IObjectReference.DamageObject(this.obj, [afDamage]);
	}

	delete(): void {
		throw new Error("the method 'Delete' is not implemented");
	}

	disable(abFadeOut: boolean = false): void {
		if (!IObjectReference.Disable) throw new Error("the method 'Disable' is not implemented");
		return IObjectReference.Disable(this.obj, [abFadeOut]);
	}

	disableNoWait(abFadeOut: boolean = false): void {
		throw new Error("the method 'DisableNoWait' is not implemented");
	}

	dropObject(akObject: Form | null, aiCount: number): void {
		throw new Error("the method 'DropObject' is not implemented");
	}

	enable(abFadeIn: boolean): void {
		throw new Error("the method 'Enable' is not implemented");
	}

	enableFastTravel(abEnable: boolean): void {
		throw new Error("the method 'EnableFastTravel' is not implemented");
	}

	enableNoWait(abFadeIn: boolean): void {
		throw new Error("the method 'EnableNoWait' is not implemented");
	}

	forceAddRagdollToWorld(): void {
		throw new Error("the method 'ForceAddRagdollToWorld' is not implemented");
	}

	forceRemoveRagdollFromWorld(): void {
		throw new Error("the method 'ForceRemoveRagdollFromWorld' is not implemented");
	}

	getActorOwner(): void {
		throw new Error("the method 'GetActorOwner' is not implemented");
	}

	getAllForms(toFill: any | null): void {
		throw new Error("the method 'GetAllForms' is not implemented");
	}

	getAngleX(): number {
		if (!IObjectReference.GetAngleX) throw new Error("the method 'GetAngleX' is not implemented");
		return IObjectReference.GetAngleX(this.obj);
	}

	getAngleY(): number {
		if (!IObjectReference.GetAngleY) throw new Error("the method 'GetAngleY' is not implemented");
		return IObjectReference.GetAngleY(this.obj);
	}

	getAngleZ(): number {
		if (!IObjectReference.GetAngleZ) throw new Error("the method 'GetAngleZ' is not implemented");
		return IObjectReference.GetAngleZ(this.obj);
	}

	getAnimationVariableBool(arVariableName: string): boolean {
		throw new Error("the method 'GetAnimationVariableBool' is not implemented");
	}

	getAnimationVariableFloat(arVariableName: string): number {
		throw new Error("the method 'GetAnimationVariableFloat' is not implemented");
	}

	getAnimationVariableInt(arVariableName: string): number {
		throw new Error("the method 'GetAnimationVariableInt' is not implemented");
	}

	getBaseObject(): Form | null {
		if (!IObjectReference.GetBaseObject) throw new Error("the method 'GetBaseObject' is not implemented");
		const obj = IObjectReference.GetBaseObject(this.obj);
		if (!obj) return null;
		return new Form(obj);
	}

	getContainerForms(): Form[] {
		if (!IObjectReference.GetContainerForms) throw new Error("the method 'GetContainerForms' is not implemented");
		const objArray = IObjectReference.GetContainerForms(this.obj);
		return objArray.map((obj) => new Form(obj));
	}

	getCurrentDestructionStage(): number {
		if (!IObjectReference.GetCurrentDestructionStage) {
			throw new Error("the method 'GetCurrentDestructionStage' is not implemented");
		}
		return IObjectReference.GetCurrentDestructionStage(this.obj);
	}

	getCurrentLocation(): Location | null {
		throw new Error("the method 'GetCurrentLocation' is not implemented");
	}

	getCurrentScene(): any | null {
		throw new Error("the method 'GetCurrentScene' is not implemented");
	}

	getDisplayName(): string {
		if (!IObjectReference.GetDisplayName) throw new Error("the method 'GetDisplayName' is not implemented");
		return IObjectReference.GetDisplayName(this.obj);
	}

	getEditorLocation(): Location | null {
		throw new Error("the method 'GetEditorLocation' is not implemented");
	}

	getEnableParent(): ObjectReference | null {
		throw new Error("the method 'GetEnableParent' is not implemented");
	}

	getEnchantment(): any | null {
		throw new Error("the method 'GetEnchantment' is not implemented");
	}

	getFactionOwner(): any | null {
		throw new Error("the method 'GetFactionOwner' is not implemented");
	}

	getHeadingAngle(akOther: ObjectReference | null): number {
		throw new Error("the method 'GetHeadingAngle' is not implemented");
	}

	getHeight(): number {
		throw new Error("the method 'GetHeight' is not implemented");
	}

	getItemCharge(): number {
		throw new Error("the method 'GetItemCharge' is not implemented");
	}

	getItemCount(akItem: Form): number {
		if (!IObjectReference.GetItemCount) throw new Error("the method 'GetItemCount' is not implemented");
		if (!akItem) throw new Error('akItemisnot defined');
		return IObjectReference.GetItemCount(this.obj, [akItem.obj]);
	}

	getItemHealthPercent(): number {
		throw new Error("the method 'GetItemHealthPercent' is not implemented");
	}

	getItemMaxCharge(): number {
		throw new Error("the method 'GetItemMaxCharge' is not implemented");
	}

	getKey(): any | null {
		throw new Error("the method 'GetKey' is not implemented");
	}

	getLength(): number {
		throw new Error("the method 'GetLength' is not implemented");
	}

	getLinkedRef(apKeyword: Keyword | null): ObjectReference | null {
		throw new Error("the method 'GetLinkedRef' is not implemented");
	}

	getLockLevel(): number {
		throw new Error("the method 'GetLockLevel' is not implemented");
	}

	getMass(): number {
		throw new Error("the method 'GetMass' is not implemented");
	}

	getNthForm(index: number): Form | null {
		throw new Error("the method 'GetNthForm' is not implemented");
	}

	getNthLinkedRef(aiLinkedRef: number): ObjectReference | null {
		throw new Error("the method 'GetNthLinkedRef' is not implemented");
	}

	getNthReferenceAlias(n: number): any | null {
		throw new Error("the method 'GetNthReferenceAlias' is not implemented");
	}

	getNumItems(): number {
		throw new Error("the method 'GetNumItems' is not implemented");
	}

	getNumReferenceAliases(): number {
		throw new Error("the method 'GetNumReferenceAliases' is not implemented");
	}

	getOpenState(): number {
		throw new Error("the method 'GetOpenState' is not implemented");
	}

	getParentCell(): Cell | null {
		if (!IObjectReference.GetParentCell) throw new Error("the method 'GetParentCell' is not implemented");
		const obj = IObjectReference.GetParentCell(this.obj);
		if (!obj) return null;
		return new Cell(obj);
	}

	getPoison(): Potion | null {
		throw new Error("the method 'GetPoison' is not implemented");
	}

	getPositionX(): number {
		if (!IObjectReference.GetPositionX) throw new Error("the method 'GetPositionX' is not implemented");
		return IObjectReference.GetPositionX(this.obj);
	}

	getPositionY(): number {
		if (!IObjectReference.GetPositionY) throw new Error("the method 'GetPositionY' is not implemented");
		return IObjectReference.GetPositionY(this.obj);
	}

	getPositionZ(): number {
		if (!IObjectReference.GetPositionZ) throw new Error("the method 'GetPositionZ' is not implemented");
		return IObjectReference.GetPositionZ(this.obj);
	}

	getReferenceAliases(): PapyrusObject[] | null {
		throw new Error("the method 'GetReferenceAliases' is not implemented");
	}

	getScale(): number {
		if (!IObjectReference.GetScale) throw new Error("the method 'GetScale' is not implemented");
		return IObjectReference.GetScale(this.obj);
	}

	getTotalArmorWeight(): number {
		throw new Error("the method 'GetTotalArmorWeight' is not implemented");
	}

	getTotalItemWeight(): number {
		throw new Error("the method 'GetTotalItemWeight' is not implemented");
	}

	getTriggerObjectCount(): number {
		throw new Error("the method 'GetTriggerObjectCount' is not implemented");
	}

	getVoiceType(): any | null {
		throw new Error("the method 'GetVoiceType' is not implemented");
	}

	getWidth(): number {
		throw new Error("the method 'GetWidth' is not implemented");
	}

	getWorldSpace(): WorldSpace | null {
		if (!IObjectReference.GetWorldSpace) throw new Error("the method 'GetWorldSpace' is not implemented");
		const obj = IObjectReference.GetWorldSpace(this.obj);
		if (!obj) return null;
		return new WorldSpace(obj);
	}

	hasEffectKeyword(akKeyword: Keyword | null): boolean {
		throw new Error("the method 'HasEffectKeyword' is not implemented");
	}

	hasNode(asNodeName: string): boolean {
		throw new Error("the method 'HasNode' is not implemented");
	}

	hasRefType(akRefType: any | null): boolean {
		throw new Error("the method 'HasRefType' is not implemented");
	}

	ignoreFriendlyHits(abIgnore: boolean): void {
		throw new Error("the method 'IgnoreFriendlyHits' is not implemented");
	}

	interruptCast(): void {
		throw new Error("the method 'InterruptCast' is not implemented");
	}

	is3DLoaded(): boolean {
		throw new Error("the method 'Is3DLoaded' is not implemented");
	}

	isActivateChild(akChild: ObjectReference | null): boolean {
		throw new Error("the method 'IsActivateChild' is not implemented");
	}

	isActivationBlocked(): boolean {
		throw new Error("the method 'IsActivationBlocked' is not implemented");
	}

	isDeleted(): boolean {
		throw new Error("the method 'IsDeleted' is not implemented");
	}

	isDisabled(): boolean {
		throw new Error("the method 'IsDisabled' is not implemented");
	}

	isFurnitureInUse(abIgnoreReserved: boolean): boolean {
		throw new Error("the method 'IsFurnitureInUse' is not implemented");
	}

	isFurnitureMarkerInUse(aiMarker: number, abIgnoreReserved: boolean): boolean {
		throw new Error("the method 'IsFurnitureMarkerInUse' is not implemented");
	}

	isHarvested(): boolean {
		throw new Error("the method 'IsHarvested' is not implemented");
	}

	isIgnoringFriendlyHits(): boolean {
		throw new Error("the method 'IsIgnoringFriendlyHits' is not implemented");
	}

	isInDialogueWithPlayer(): boolean {
		throw new Error("the method 'IsInDialogueWithPlayer' is not implemented");
	}

	isLockBroken(): boolean {
		throw new Error("the method 'IsLockBroken' is not implemented");
	}

	isLocked(): boolean {
		throw new Error("the method 'IsLocked' is not implemented");
	}

	isMapMarkerVisible(): boolean {
		throw new Error("the method 'IsMapMarkerVisible' is not implemented");
	}

	isOffLimits(): boolean {
		throw new Error("the method 'IsOffLimits' is not implemented");
	}

	knockAreaEffect(afMagnitude: number, afRadius: number): void {
		throw new Error("the method 'KnockAreaEffect' is not implemented");
	}

	lock(abLock: boolean, abAsOwner: boolean): void {
		throw new Error("the method 'Lock' is not implemented");
	}

	moveTo(
		akTarget: ObjectReference,
		afXOffset: number = 0,
		afYOffset: number = 0,
		afZOffset: number = 0,
		abMatchRotation: boolean = true
	): void {
		if (!IObjectReference.MoveTo) throw new Error("the method 'MoveTo' is not implemented");
		if (!akTarget) throw new Error('akTarget is not defined');
		return IObjectReference.MoveTo(this.obj, [akTarget.obj, afXOffset, afYOffset, afZOffset, abMatchRotation]);
	}

	moveToInteractionLocation(akTarget: ObjectReference | null): Promise<void> {
		throw new Error("the method 'MoveToInteractionLocation' is not implemented");
	}

	moveToMyEditorLocation(): Promise<void> {
		throw new Error("the method 'MoveToMyEditorLocation' is not implemented");
	}

	moveToNode(akTarget: ObjectReference | null, asNodeName: string): Promise<void> {
		throw new Error("the method 'MoveToNode' is not implemented");
	}

	placeActorAtMe(akActorToPlace: any | null, aiLevelMod: number, akZone: any | null): Actor | null {
		throw new Error("the method 'PlaceActorAtMe' is not implemented");
	}

	placeAtMe(
		akFormToPlace: Form | null,
		aiCount: number = 1,
		abForcePersist: boolean = false,
		abInitiallyDisabled: boolean = false
	): ObjectReference | null {
		if (!IObjectReference.PlaceAtMe) throw new Error("the method 'PlaceAtMe' is not implemented");
		if (!akFormToPlace) throw new Error('akFormToPlace is not defined');
		const obj = IObjectReference.PlaceAtMe(this.obj, [akFormToPlace.obj, aiCount, abForcePersist, abInitiallyDisabled]);
		if (!obj) return null;
		return new ObjectReference(obj);
	}

	playAnimation(asAnimation: string): boolean {
		throw new Error("the method 'PlayAnimation' is not implemented");
	}

	playAnimationAndWait(asAnimation: string, asEventName: string): Promise<boolean> {
		throw new Error("the method 'PlayAnimationAndWait' is not implemented");
	}

	playGamebryoAnimation(asAnimation: string, abStartOver: boolean, afEaseInTime: number): boolean {
		throw new Error("the method 'PlayGamebryoAnimation' is not implemented");
	}

	playImpactEffect(
		akImpactEffect: any | null,
		asNodeName: string,
		afPickDirX: number,
		afPickDirY: number,
		afPickDirZ: number,
		afPickLength: number,
		abApplyNodeRotation: boolean,
		abUseNodeLocalRotation: boolean
	): boolean {
		throw new Error("the method 'PlayImpactEffect' is not implemented");
	}

	playSyncedAnimationAndWaitSS(
		asAnimation1: string,
		asEvent1: string,
		akObj2: ObjectReference | null,
		asAnimation2: string,
		asEvent2: string
	): Promise<boolean> {
		throw new Error("the method 'PlaySyncedAnimationAndWaitSS' is not implemented");
	}

	playSyncedAnimationSS(asAnimation1: string, akObj2: ObjectReference | null, asAnimation2: string): boolean {
		throw new Error("the method 'PlaySyncedAnimationSS' is not implemented");
	}

	playTerrainEffect(asEffectModelName: string, asAttachBoneName: string): void {
		throw new Error("the method 'PlayTerrainEffect' is not implemented");
	}

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
	): void {
		throw new Error("the method 'ProcessTrapHit' is not implemented");
	}

	pushActorAway(akActorToPush: Actor | null, aiKnockbackForce: number): void {
		throw new Error("the method 'PushActorAway' is not implemented");
	}

	removeAllInventoryEventFilters(): void {
		throw new Error("the method 'RemoveAllInventoryEventFilters' is not implemented");
	}

	removeAllItems(
		akTransferTo: ObjectReference | null = null,
		abKeepOwnership: boolean = false,
		abRemoveQuestItems: boolean = false
	): void {
		if (!IObjectReference.RemoveAllItems) throw new Error("the method 'RemoveAllItems' is not implemented");
		return IObjectReference.RemoveAllItems(this.obj, [akTransferTo?.obj ?? null]);
	}

	removeDependentAnimatedObjectReference(akDependent: ObjectReference | null): boolean {
		throw new Error("the method 'RemoveDependentAnimatedObjectReference' is not implemented");
	}

	removeInventoryEventFilter(akFilter: Form | null): void {
		throw new Error("the method 'RemoveInventoryEventFilter' is not implemented");
	}

	removeItem(
		akItemToRemove: Form | null,
		aiCount: number = 1,
		abSilent: boolean = false,
		akOtherContainer: ObjectReference | null = null
	): void {
		if (!IObjectReference.RemoveItem) throw new Error("the method 'RemoveItem' is not implemented");
		if (!akItemToRemove) throw new Error('ItemToAdd is not defined');
		return IObjectReference.RemoveItem(this.obj, [
			akItemToRemove.obj,
			aiCount,
			abSilent,
			akOtherContainer?.obj ?? null,
		]);
	}

	reset(akTarget: ObjectReference | null): Promise<void> {
		throw new Error("the method 'Reset' is not implemented");
	}

	resetInventory(): void {
		throw new Error("the method 'ResetInventory' is not implemented");
	}

	say(akTopicToSay: any | null, akActorToSpeakAs: Actor | null, abSpeakInPlayersHead: boolean): void {
		throw new Error("the method 'Say' is not implemented");
	}

	sendStealAlarm(akThief: Actor | null): void {
		throw new Error("the method 'SendStealAlarm' is not implemented");
	}

	setActorCause(akActor: Actor | null): void {
		throw new Error("the method 'SetActorCause' is not implemented");
	}

	setActorOwner(akActorBase: any | null): void {
		throw new Error("the method 'SetActorOwner' is not implemented");
	}

	setAngle(afXAngle: number, afYAngle: number, afZAngle: number): void {
		if (!IObjectReference.SetAngle) throw new Error("the method 'SetAngle' is not implemented");
		return IObjectReference.SetAngle(this.obj, [afXAngle, afYAngle, afZAngle]);
	}

	setAnimationVariableBool(arVariableName: string, abNewValue: boolean): void {
		throw new Error("the method 'SetAnimationVariableBool' is not implemented");
	}

	setAnimationVariableFloat(arVariableName: string, afNewValue: number): void {
		throw new Error("the method 'SetAnimationVariableFloat' is not implemented");
	}

	setAnimationVariableInt(arVariableName: string, aiNewValue: number): void {
		throw new Error("the method 'SetAnimationVariableInt' is not implemented");
	}

	setDestroyed(abDestroyed: boolean): void {
		throw new Error("the method 'SetDestroyed' is not implemented");
	}

	setDisplayName(name: string, force: boolean = false): void {
		if (!IObjectReference.SetDisplayName) throw new Error("the method 'SetDisplayName' is not implemented");
		return IObjectReference.SetDisplayName(this.obj, [name, force]);
	}

	setEnchantment(source: any | null, maxCharge: number): void {
		throw new Error("the method 'SetEnchantment' is not implemented");
	}

	setFactionOwner(akFaction: any | null): void {
		throw new Error("the method 'SetFactionOwner' is not implemented");
	}

	setHarvested(harvested: boolean): void {
		throw new Error("the method 'SetHarvested' is not implemented");
	}

	setItemCharge(charge: number): void {
		throw new Error("the method 'SetItemCharge' is not implemented");
	}

	setItemHealthPercent(health: number): void {
		throw new Error("the method 'SetItemHealthPercent' is not implemented");
	}

	setItemMaxCharge(maxCharge: number): void {
		throw new Error("the method 'SetItemMaxCharge' is not implemented");
	}

	setLockLevel(aiLockLevel: number): void {
		throw new Error("the method 'SetLockLevel' is not implemented");
	}

	setMotionType(aeMotionType: any, abAllowActivate: boolean): Promise<void> {
		throw new Error("the method 'SetMotionType' is not implemented");
	}

	setNoFavorAllowed(abNoFavor: boolean): void {
		throw new Error("the method 'SetNoFavorAllowed' is not implemented");
	}

	setOpen(abOpen: boolean): void {
		throw new Error("the method 'SetOpen' is not implemented");
	}

	setPosition(afX: number, afY: number, afZ: number): void {
		if (!IObjectReference.SetPosition) throw new Error("the method 'SetPosition' is not implemented");
		return IObjectReference.SetPosition(this.obj, [afX, afY, afZ]);
	}

	setScale(afScale: number): void {
		if (!IObjectReference.SetScale) throw new Error("the method 'SetScale' is not implemented");
		return IObjectReference.SetScale(this.obj, [afScale]);
	}

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
	): void {
		throw new Error("the method 'SplineTranslateTo' is not implemented");
	}

	splineTranslateToRefNode(
		arTarget: ObjectReference | null,
		arNodeName: string,
		afTangentMagnitude: number,
		afSpeed: number,
		afMaxRotationSpeed: number
	): void {
		throw new Error("the method 'SplineTranslateToRefNode' is not implemented");
	}

	stopTranslation(): void {
		throw new Error("the method 'StopTranslation' is not implemented");
	}

	tetherToHorse(akHorse: ObjectReference | null): void {
		throw new Error("the method 'TetherToHorse' is not implemented");
	}

	translateTo(
		afX: number,
		afY: number,
		afZ: number,
		afXAngle: number,
		afYAngle: number,
		afZAngle: number,
		afSpeed: number,
		afMaxRotationSpeed: number
	): void {
		throw new Error("the method 'TranslateTo' is not implemented");
	}

	waitForAnimationEvent(asEventName: string): Promise<boolean> {
		throw new Error("the method 'WaitForAnimationEvent' is not implemented");
	}

	getDistance(akOther: ObjectReference | null): number {
		if (!IObjectReference.GetDistance) throw new Error("the method 'GetDistance' is not implemented");
		if (!akOther) throw new Error('akOther is not defined');
		return IObjectReference.GetDistance(this.obj, [akOther.obj]);
	}

	getStorageValue<T = any>(key: string): T | undefined {
		if (!IObjectReference.GetStorageValue) throw new Error("the method 'GetStorageValue' is not implemented");
		return IObjectReference.GetStorageValue<T>(this.obj, [key]);
	}

	setStorageValue(key: string, value: any): void {
		if (!IObjectReference.SetStorageValue) throw new Error("the method 'SetStorageValue' is not implemented");
		return IObjectReference.SetStorageValue(this.obj, [key, value]);
	}

	getRespawnTime(): number {
		if (!IObjectReference.GetRespawnTime) throw new Error("the method 'GetRespawnTime' is not implemented");
		return IObjectReference.GetRespawnTime([this.obj]);
	}

	getLinkedDoorId(): number {
		if (!IObjectReference.GetLinkedDoorId) throw new Error("the method 'GetLinkedDoorId' is not implemented");
		return IObjectReference.GetLinkedDoorId(this.obj);
	}

	getLinkedCellId(): number {
		if (!IObjectReference.GetLinkedCellId) throw new Error("the method 'GetLinkedCellId' is not implemented");
		return IObjectReference.GetLinkedCellId(this.obj);
	}
}
// #endregion

// #region Actor
export class Actor extends ObjectReference {
	constructor(obj: PapyrusObject) {
		super(obj);
		if (!IActor) throw new Error("the interface 'IActor' is not defined");
	}

	static from(papyrusObject: BaseClass): Actor | null {
		if (!papyrusObject) return null;
		const obj = from('GetActor', papyrusObject.obj);
		if (!obj) return null;
		return new Actor(obj);
	}

	static get(id: number): Actor | null {
		const form = Game.getForm(id);
		if (!form) return null;
		const actor = Actor.from(form);
		if (!actor) return null;
		return actor;
	}

	addPerk(akPerk: Perk): void {
		if (!IActor.AddPerk) throw new Error("the method 'AddPerk' is not implemented");
		if (!akPerk) throw new Error('akPerk is not defined');
		return IActor.AddPerk(this.obj, [akPerk.obj]);
	}

	addShout(akShout: any | null): boolean {
		throw new Error("the method 'AddShout' is not implemented");
	}

	addSpell(akSpell: any | null, abVerbose: boolean): boolean {
		throw new Error("the method 'AddSpell' is not implemented");
	}

	allowBleedoutDialogue(abCanTalk: boolean): void {
		throw new Error("the method 'AllowBleedoutDialogue' is not implemented");
	}

	allowPCDialogue(abTalk: boolean): void {
		throw new Error("the method 'AllowPCDialogue' is not implemented");
	}

	attachAshPile(akAshPileBase: Form | null): void {
		throw new Error("the method 'AttachAshPile' is not implemented");
	}

	canFlyHere(): boolean {
		throw new Error("the method 'CanFlyHere' is not implemented");
	}

	changeHeadPart(hPart: any | null): void {
		throw new Error("the method 'ChangeHeadPart' is not implemented");
	}

	clearArrested(): void {
		throw new Error("the method 'ClearArrested' is not implemented");
	}

	clearExpressionOverride(): void {
		throw new Error("the method 'ClearExpressionOverride' is not implemented");
	}

	clearExtraArrows(): void {
		throw new Error("the method 'ClearExtraArrows' is not implemented");
	}

	clearForcedMovement(): void {
		throw new Error("the method 'ClearForcedMovement' is not implemented");
	}

	clearKeepOffsetFromActor(): void {
		throw new Error("the method 'ClearKeepOffsetFromActor' is not implemented");
	}

	clearLookAt(): void {
		throw new Error("the method 'ClearLookAt' is not implemented");
	}

	damageActorValue(asValueName: string, afDamage: number): void {
		if (!IActor.DamageActorValue) throw new Error("the method 'DamageActorValue' is not implemented");
		return IActor.DamageActorValue(this.obj, [asValueName, afDamage]);
	}

	dismount(): boolean {
		throw new Error("the method 'Dismount' is not implemented");
	}

	dispelAllSpells(): void {
		throw new Error("the method 'DispelAllSpells' is not implemented");
	}

	dispelSpell(akSpell: any | null): boolean {
		throw new Error("the method 'DispelSpell' is not implemented");
	}

	doCombatSpellApply(akSpell: any | null, akTarget: ObjectReference | null): void {
		throw new Error("the method 'DoCombatSpellApply' is not implemented");
	}

	drawWeapon(): void {
		throw new Error("the method 'DrawWeapon' is not implemented");
	}

	enableAI(abEnable: boolean): void {
		throw new Error("the method 'EnableAI' is not implemented");
	}

	endDeferredKill(): void {
		throw new Error("the method 'EndDeferredKill' is not implemented");
	}

	equipItem(akItem: Form, abPreventRemoval: boolean = false, abSilent: boolean = false): void {
		if (!IActor.EquipItem) throw new Error("the method 'EquipItem' is not implemented");
		if (!akItem) throw new Error('akItem is not defined');
		return IActor.EquipItem(this.obj, [akItem.obj, abPreventRemoval, abSilent]);
	}

	equipItemById(
		item: Form | null,
		itemId: number,
		equipSlot: number,
		preventUnequip: boolean,
		equipSound: boolean
	): void {
		throw new Error("the method 'EquipItemById' is not implemented");
	}

	equipItemEx(item: Form | null, equipSlot: number, preventUnequip: boolean, equipSound: boolean): void {
		throw new Error("the method 'EquipItemEx' is not implemented");
	}

	equipShout(akShout: any | null): void {
		throw new Error("the method 'EquipShout' is not implemented");
	}

	equipSpell(akSpell: any | null, aiSource: number): void {
		throw new Error("the method 'EquipSpell' is not implemented");
	}

	evaluatePackage(): void {
		throw new Error("the method 'EvaluatePackage' is not implemented");
	}

	forceActorValue(asValueName: string, afNewValue: number): void {
		throw new Error("the method 'ForceActorValue' is not implemented");
	}

	forceMovementDirection(afXAngle: number, afYAngle: number, afZAngle: number): void {
		throw new Error("the method 'ForceMovementDirection' is not implemented");
	}

	forceMovementDirectionRamp(afXAngle: number, afYAngle: number, afZAngle: number, afRampTime: number): void {
		throw new Error("the method 'ForceMovementDirectionRamp' is not implemented");
	}

	forceMovementRotationSpeed(afXMult: number, afYMult: number, afZMult: number): void {
		throw new Error("the method 'ForceMovementRotationSpeed' is not implemented");
	}

	forceMovementRotationSpeedRamp(afXMult: number, afYMult: number, afZMult: number, afRampTime: number): void {
		throw new Error("the method 'ForceMovementRotationSpeedRamp' is not implemented");
	}

	forceMovementSpeed(afSpeedMult: number): void {
		throw new Error("the method 'ForceMovementSpeed' is not implemented");
	}

	forceMovementSpeedRamp(afSpeedMult: number, afRampTime: number): void {
		throw new Error("the method 'ForceMovementSpeedRamp' is not implemented");
	}

	forceTargetAngle(afXAngle: number, afYAngle: number, afZAngle: number): void {
		throw new Error("the method 'ForceTargetAngle' is not implemented");
	}

	forceTargetDirection(afXAngle: number, afYAngle: number, afZAngle: number): void {
		throw new Error("the method 'ForceTargetDirection' is not implemented");
	}

	forceTargetSpeed(afSpeed: number): void {
		throw new Error("the method 'ForceTargetSpeed' is not implemented");
	}

	getActorValue(asValueName: string): number {
		if (!IActor.GetActorValue) throw new Error("the method 'GetActorValue' is not implemented");
		return IActor.GetActorValue(this.obj, [asValueName]);
	}

	getActorValueMax(asValueName: string): number {
		throw new Error("the method 'GetActorValueMax' is not implemented");
	}

	getActorValuePercentage(asValueName: string): number {
		if (!IActor.GetActorValuePercentage) throw new Error("the method 'GetActorValuePercentage' is not implemented");
		return IActor.GetActorValuePercentage(this.obj, [asValueName]);
	}

	getBaseActorValue(asValueName: string): number {
		throw new Error("the method 'GetBaseActorValue' is not implemented");
	}

	getBribeAmount(): number {
		throw new Error("the method 'GetBribeAmount' is not implemented");
	}

	getCombatState(): number {
		throw new Error("the method 'GetCombatState' is not implemented");
	}

	getCombatTarget(): Actor | null {
		throw new Error("the method 'GetCombatTarget' is not implemented");
	}

	getCrimeFaction(): any | null {
		throw new Error("the method 'GetCrimeFaction' is not implemented");
	}

	getCurrentPackage(): any | null {
		throw new Error("the method 'GetCurrentPackage' is not implemented");
	}

	getDialogueTarget(): Actor | null {
		throw new Error("the method 'GetDialogueTarget' is not implemented");
	}

	getEquippedArmorInSlot(aiSlot: number): Armor | null {
		throw new Error("the method 'GetEquippedArmorInSlot' is not implemented");
	}

	getEquippedItemId(Location: number): number {
		throw new Error("the method 'GetEquippedItemId' is not implemented");
	}

	getEquippedItemType(aiHand: number): number {
		throw new Error("the method 'GetEquippedItemType' is not implemented");
	}

	getEquippedObject(Location: number): Form | null {
		if (!IActor.GetEquippedObject) throw new Error("the method 'GetEquippedObject' is not implemented");
		const obj = IActor.GetEquippedObject(this.obj, [Location]);
		if (!obj) return null;
		return new Form(obj);
	}

	getEquippedShield(): Armor | null {
		if (!IActor.GetEquippedShield) throw new Error("the method 'GetEquippedShield' is not implemented");
		const obj = IActor.GetEquippedShield(this.obj);
		if (!obj) return null;
		return new Armor(obj);
	}

	getEquippedShout(): any | null {
		throw new Error("the method 'GetEquippedShout' is not implemented");
	}

	getEquippedSpell(aiSource: number): any | null {
		throw new Error("the method 'GetEquippedSpell' is not implemented");
	}

	getEquippedWeapon(abLeftHand: boolean): Weapon | null {
		if (!IActor.GetEquippedWeapon) throw new Error("the method 'GetEquippedWeapon' is not implemented");
		const obj = IActor.GetEquippedWeapon(this.obj, [abLeftHand]);
		if (!obj) return null;
		return new Weapon(obj);
	}

	getFactionRank(akFaction: any | null): number {
		throw new Error("the method 'GetFactionRank' is not implemented");
	}

	getFactionReaction(akOther: Actor | null): number {
		throw new Error("the method 'GetFactionReaction' is not implemented");
	}

	getFactions(minRank: number, maxRank: number): PapyrusObject[] | null {
		throw new Error("the method 'GetFactions' is not implemented");
	}

	getFlyingState(): number {
		throw new Error("the method 'GetFlyingState' is not implemented");
	}

	getForcedLandingMarker(): ObjectReference | null {
		throw new Error("the method 'GetForcedLandingMarker' is not implemented");
	}

	getFurnitureReference(): ObjectReference | null {
		throw new Error("the method 'GetFurnitureReference' is not implemented");
	}

	getGoldAmount(): number {
		throw new Error("the method 'GetGoldAmount' is not implemented");
	}

	getHighestRelationshipRank(): number {
		throw new Error("the method 'GetHighestRelationshipRank' is not implemented");
	}

	getKiller(): Actor | null {
		throw new Error("the method 'GetKiller' is not implemented");
	}

	getLevel(): number {
		throw new Error("the method 'GetLevel' is not implemented");
	}

	getLeveledActorBase(): any | null {
		throw new Error("the method 'GetLeveledActorBase' is not implemented");
	}

	getLightLevel(): number {
		throw new Error("the method 'GetLightLevel' is not implemented");
	}

	getLowestRelationshipRank(): number {
		throw new Error("the method 'GetLowestRelationshipRank' is not implemented");
	}

	getNoBleedoutRecovery(): boolean {
		throw new Error("the method 'GetNoBleedoutRecovery' is not implemented");
	}

	getNthSpell(n: number): any | null {
		throw new Error("the method 'GetNthSpell' is not implemented");
	}

	getPlayerControls(): boolean {
		throw new Error("the method 'GetPlayerControls' is not implemented");
	}

	getRace(): Race | null {
		if (!IActor.GetRace) throw new Error("the method 'GetRace' is not implemented");
		const obj = IActor.GetRace(this.obj);
		if (!obj) return null;
		return new Race(obj);
	}

	getRelationshipRank(akOther: Actor | null): number {
		throw new Error("the method 'GetRelationshipRank' is not implemented");
	}

	getSitState(): number {
		throw new Error("the method 'GetSitState' is not implemented");
	}

	getSleepState(): number {
		throw new Error("the method 'GetSleepState' is not implemented");
	}

	getSpellCount(): number {
		throw new Error("the method 'GetSpellCount' is not implemented");
	}

	getVoiceRecoveryTime(): number {
		throw new Error("the method 'GetVoiceRecoveryTime' is not implemented");
	}

	getWarmthRating(): number {
		throw new Error("the method 'GetWarmthRating' is not implemented");
	}

	getWornForm(slotMask: number): Form | null {
		throw new Error("the method 'GetWornForm' is not implemented");
	}

	getWornItemId(slotMask: number): number {
		throw new Error("the method 'GetWornItemId' is not implemented");
	}

	hasAssociation(akAssociation: any | null, akOther: Actor | null): boolean {
		throw new Error("the method 'HasAssociation' is not implemented");
	}

	hasFamilyRelationship(akOther: Actor | null): boolean {
		throw new Error("the method 'HasFamilyRelationship' is not implemented");
	}

	hasLOS(akOther: ObjectReference | null): boolean {
		throw new Error("the method 'HasLOS' is not implemented");
	}

	hasMagicEffect(akEffect: MagicEffect | null): boolean {
		throw new Error("the method 'HasMagicEffect' is not implemented");
	}

	hasMagicEffectWithKeyword(akKeyword: Keyword | null): boolean {
		throw new Error("the method 'HasMagicEffectWithKeyword' is not implemented");
	}

	hasParentRelationship(akOther: Actor | null): boolean {
		throw new Error("the method 'HasParentRelationship' is not implemented");
	}

	hasPerk(akPerk: Perk): boolean {
		if (!IActor.HasPerk) throw new Error("the method 'HasPerk' is not implemented");
		if (!akPerk) throw new Error('akPerk is not defined');
		return IActor.HasPerk(this.obj, [akPerk.obj]);
	}

	hasSpell(akForm: Form | null): boolean {
		throw new Error("the method 'HasSpell' is not implemented");
	}

	isAIEnabled(): boolean {
		throw new Error("the method 'IsAIEnabled' is not implemented");
	}

	isAlarmed(): boolean {
		throw new Error("the method 'IsAlarmed' is not implemented");
	}

	isAlerted(): boolean {
		throw new Error("the method 'IsAlerted' is not implemented");
	}

	isAllowedToFly(): boolean {
		throw new Error("the method 'IsAllowedToFly' is not implemented");
	}

	isArrested(): boolean {
		throw new Error("the method 'IsArrested' is not implemented");
	}

	isArrestingTarget(): boolean {
		throw new Error("the method 'IsArrestingTarget' is not implemented");
	}

	isBeingRidden(): boolean {
		throw new Error("the method 'IsBeingRidden' is not implemented");
	}

	isBleedingOut(): boolean {
		throw new Error("the method 'IsBleedingOut' is not implemented");
	}

	isBribed(): boolean {
		throw new Error("the method 'IsBribed' is not implemented");
	}

	isChild(): boolean {
		throw new Error("the method 'IsChild' is not implemented");
	}

	isCommandedActor(): boolean {
		throw new Error("the method 'IsCommandedActor' is not implemented");
	}

	isDead(): boolean {
		if (!IActor.IsDead) throw new Error("the method 'IsDead' is not implemented");
		return IActor.IsDead(this.obj);
	}

	isDetectedBy(akOther: Actor | null): boolean {
		throw new Error("the method 'IsDetectedBy' is not implemented");
	}

	isDoingFavor(): boolean {
		throw new Error("the method 'IsDoingFavor' is not implemented");
	}

	isEquipped(akItem: Form | null): boolean {
		if (!IActor.IsEquipped) throw new Error("the method 'IsEquipped' is not implemented");
		if (!akItem) throw new Error('akItem is not defined');
		return IActor.IsEquipped(this.obj, [akItem.obj]);
	}

	isEssential(): boolean {
		throw new Error("the method 'IsEssential' is not implemented");
	}

	isFlying(): boolean {
		throw new Error("the method 'IsFlying' is not implemented");
	}

	isGhost(): boolean {
		throw new Error("the method 'IsGhost' is not implemented");
	}

	isGuard(): boolean {
		throw new Error("the method 'IsGuard' is not implemented");
	}

	isHostileToActor(akActor: Actor | null): boolean {
		throw new Error("the method 'IsHostileToActor' is not implemented");
	}

	isHuman(): boolean {
		if (!IActor.IsHuman) throw new Error("the method 'IsEquipped' is not implemented");
		return IActor.IsHuman(this.obj);
	}

	isInCombat(): boolean {
		throw new Error("the method 'IsInCombat' is not implemented");
	}

	isInFaction(akFaction: any | null): boolean {
		throw new Error("the method 'IsInFaction' is not implemented");
	}

	isInKillMove(): boolean {
		throw new Error("the method 'IsInKillMove' is not implemented");
	}

	isIntimidated(): boolean {
		throw new Error("the method 'IsIntimidated' is not implemented");
	}

	isOnMount(): boolean {
		throw new Error("the method 'IsOnMount' is not implemented");
	}

	isOverEncumbered(): boolean {
		throw new Error("the method 'IsOverEncumbered' is not implemented");
	}

	isPlayerTeammate(): boolean {
		throw new Error("the method 'IsPlayerTeammate' is not implemented");
	}

	isPlayersLastRiddenHorse(): boolean {
		throw new Error("the method 'IsPlayersLastRiddenHorse' is not implemented");
	}

	isRunning(): boolean {
		throw new Error("the method 'IsRunning' is not implemented");
	}

	isSneaking(): boolean {
		throw new Error("the method 'IsSneaking' is not implemented");
	}

	isSprinting(): boolean {
		throw new Error("the method 'IsSprinting' is not implemented");
	}

	isSwimming(): boolean {
		throw new Error("the method 'IsSwimming' is not implemented");
	}

	isTrespassing(): boolean {
		throw new Error("the method 'IsTrespassing' is not implemented");
	}

	isUnconscious(): boolean {
		throw new Error("the method 'IsUnconscious' is not implemented");
	}

	isWeaponDrawn(): boolean {
		if (!IActor.IsWeaponDrawn) throw new Error("the method 'IsWeaponDrawn' is not implemented");
		return IActor.IsWeaponDrawn(this.obj);
	}

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
	): void {
		throw new Error("the method 'KeepOffsetFromActor' is not implemented");
	}

	kill(akKiller: Actor | null): void {
		if (!IActor.Kill) throw new Error("the method 'Kill' is not implemented");
		return IActor.Kill(this.obj, [akKiller?.obj ?? null]);
	}

	killSilent(akKiller: Actor | null): void {
		throw new Error("the method 'KillSilent' is not implemented");
	}

	modActorValue(asValueName: string, afAmount: number): void {
		if (!IActor.ModActorValue) throw new Error("the method 'ModActorValue' is not implemented");
		return IActor.ModActorValue(this.obj, [asValueName, afAmount]);
	}

	modAV(asValueName: string, afAmount: number): void {
		return this.modActorValue(asValueName, afAmount);
	}

	modFactionRank(akFaction: any | null, aiMod: number): void {
		throw new Error("the method 'ModFactionRank' is not implemented");
	}

	moveToPackageLocation(): Promise<void> {
		throw new Error("the method 'MoveToPackageLocation' is not implemented");
	}

	openInventory(abForceOpen: boolean): void {
		throw new Error("the method 'OpenInventory' is not implemented");
	}

	pathToReference(aTarget: ObjectReference | null, afWalkRunPercent: number): Promise<boolean> {
		throw new Error("the method 'PathToReference' is not implemented");
	}

	playIdle(akIdle: any | null): boolean {
		throw new Error("the method 'PlayIdle' is not implemented");
	}

	playIdleWithTarget(akIdle: any | null, akTarget: ObjectReference | null): boolean {
		throw new Error("the method 'PlayIdleWithTarget' is not implemented");
	}

	playSubGraphAnimation(asEventName: string): void {
		throw new Error("the method 'PlaySubGraphAnimation' is not implemented");
	}

	queueNiNodeUpdate(): void {
		throw new Error("the method 'QueueNiNodeUpdate' is not implemented");
	}

	regenerateHead(): void {
		throw new Error("the method 'RegenerateHead' is not implemented");
	}

	removeFromAllFactions(): void {
		throw new Error("the method 'RemoveFromAllFactions' is not implemented");
	}

	removeFromFaction(akFaction: any | null): void {
		throw new Error("the method 'RemoveFromFaction' is not implemented");
	}

	removePerk(akPerk: Perk): void {
		if (!IActor.RemovePerk) throw new Error("the method 'RemovePerk' is not implemented");
		if (!akPerk) throw new Error('akPerk is not defined');
		return IActor.RemovePerk(this.obj, [akPerk.obj]);
	}

	removeShout(akShout: any | null): boolean {
		throw new Error("the method 'RemoveShout' is not implemented");
	}

	removeSpell(akSpell: any | null): boolean {
		throw new Error("the method 'RemoveSpell' is not implemented");
	}

	replaceHeadPart(oPart: any | null, newPart: any | null): void {
		throw new Error("the method 'ReplaceHeadPart' is not implemented");
	}

	resetAI(): void {
		throw new Error("the method 'ResetAI' is not implemented");
	}

	resetExpressionOverrides(): void {
		throw new Error("the method 'ResetExpressionOverrides' is not implemented");
	}

	resetHealthAndLimbs(): void {
		throw new Error("the method 'ResetHealthAndLimbs' is not implemented");
	}

	restoreActorValue(asValueName: string, afAmount: number): void {
		if (!IActor.RestoreActorValue) throw new Error("the method 'RestoreActorValue' is not implemented");
		return IActor.RestoreActorValue(this.obj, [asValueName, afAmount]);
	}

	restoreAV(asValueName: string, afAmount: number): void {
		return this.restoreActorValue(asValueName, afAmount);
	}

	async resurrect(): Promise<void> {
		if (!IActor.Resurrect) throw new Error("the method 'Resurrect' is not implemented");
		return IActor.Resurrect(this.obj);
	}

	sendAssaultAlarm(): void {
		throw new Error("the method 'SendAssaultAlarm' is not implemented");
	}

	sendLycanthropyStateChanged(abIsWerewolf: boolean): void {
		throw new Error("the method 'SendLycanthropyStateChanged' is not implemented");
	}

	sendTrespassAlarm(akCriminal: Actor | null): void {
		throw new Error("the method 'SendTrespassAlarm' is not implemented");
	}

	sendVampirismStateChanged(abIsVampire: boolean): void {
		throw new Error("the method 'SendVampirismStateChanged' is not implemented");
	}

	setActorValue(asValueName: string, afValue: number): void {
		if (!IActor.SetActorValue) throw new Error("the method 'SetActorValue' is not implemented");
		return IActor.SetActorValue(this.obj, [asValueName, afValue]);
	}

	setAlert(abAlerted: boolean): void {
		throw new Error("the method 'SetAlert' is not implemented");
	}

	setAllowFlying(abAllowed: boolean): void {
		throw new Error("the method 'SetAllowFlying' is not implemented");
	}

	setAllowFlyingEx(abAllowed: boolean, abAllowCrash: boolean, abAllowSearch: boolean): void {
		throw new Error("the method 'SetAllowFlyingEx' is not implemented");
	}

	setAlpha(afTargetAlpha: number, abFade: boolean): void {
		throw new Error("the method 'SetAlpha' is not implemented");
	}

	setAttackActorOnSight(abAttackOnSight: boolean): void {
		throw new Error("the method 'SetAttackActorOnSight' is not implemented");
	}

	setBribed(abBribe: boolean): void {
		throw new Error("the method 'SetBribed' is not implemented");
	}

	setCrimeFaction(akFaction: any | null): void {
		throw new Error("the method 'SetCrimeFaction' is not implemented");
	}

	setCriticalStage(aiStage: number): void {
		throw new Error("the method 'SetCriticalStage' is not implemented");
	}

	setDoingFavor(abDoingFavor: boolean): void {
		throw new Error("the method 'SetDoingFavor' is not implemented");
	}

	setDontMove(abDontMove: boolean): void {
		throw new Error("the method 'SetDontMove' is not implemented");
	}

	setExpressionModifier(index: number, value: number): void {
		throw new Error("the method 'SetExpressionModifier' is not implemented");
	}

	setExpressionOverride(aiMood: number, aiStrength: number): void {
		throw new Error("the method 'SetExpressionOverride' is not implemented");
	}

	setExpressionPhoneme(index: number, value: number): void {
		throw new Error("the method 'SetExpressionPhoneme' is not implemented");
	}

	setEyeTexture(akNewTexture: any | null): void {
		throw new Error("the method 'SetEyeTexture' is not implemented");
	}

	setFactionRank(akFaction: any | null, aiRank: number): void {
		throw new Error("the method 'SetFactionRank' is not implemented");
	}

	setForcedLandingMarker(aMarker: ObjectReference | null): void {
		throw new Error("the method 'SetForcedLandingMarker' is not implemented");
	}

	setGhost(abIsGhost: boolean): void {
		throw new Error("the method 'SetGhost' is not implemented");
	}

	setHeadTracking(abEnable: boolean): void {
		throw new Error("the method 'SetHeadTracking' is not implemented");
	}

	setIntimidated(abIntimidate: boolean): void {
		throw new Error("the method 'SetIntimidated' is not implemented");
	}

	setLookAt(akTarget: ObjectReference | null, abPathingLookAt: boolean): void {
		throw new Error("the method 'SetLookAt' is not implemented");
	}

	setNoBleedoutRecovery(abAllowed: boolean): void {
		throw new Error("the method 'SetNoBleedoutRecovery' is not implemented");
	}

	setNotShowOnStealthMeter(abNotShow: boolean): void {
		throw new Error("the method 'SetNotShowOnStealthMeter' is not implemented");
	}

	setOutfit(akOutfit: Outfit | null, abSleepOutfit: boolean): void {
		if (!IActor.SetOutfit) throw new Error("the method 'SetOutfit' is not implemented");
		if (!akOutfit) throw new Error('akOutfit is not defined');
		return IActor.SetOutfit(this.obj, [akOutfit.obj, abSleepOutfit]);
	}

	setPlayerControls(abControls: boolean): void {
		throw new Error("the method 'SetPlayerControls' is not implemented");
	}

	setPlayerResistingArrest(): void {
		throw new Error("the method 'SetPlayerResistingArrest' is not implemented");
	}

	setPlayerTeammate(abTeammate: boolean, abCanDoFavor: boolean): void {
		throw new Error("the method 'SetPlayerTeammate' is not implemented");
	}

	setRace(akRace: Race | null): void {
		if (!IActor.SetRace) throw new Error("the method 'SetRace' is not implemented");
		if (!akRace) throw new Error('akRace is not defined');
		return IActor.SetRace(this.obj, [akRace.obj]);
	}

	setRelationshipRank(akOther: Actor | null, aiRank: number): void {
		throw new Error("the method 'SetRelationshipRank' is not implemented");
	}

	setRestrained(abRestrained: boolean): void {
		throw new Error("the method 'SetRestrained' is not implemented");
	}

	setSubGraphFloatVariable(asVariableName: string, afValue: number): void {
		throw new Error("the method 'SetSubGraphFloatVariable' is not implemented");
	}

	setUnconscious(abUnconscious: boolean): void {
		throw new Error("the method 'SetUnconscious' is not implemented");
	}

	setVehicle(akVehicle: ObjectReference | null): void {
		throw new Error("the method 'SetVehicle' is not implemented");
	}

	setVoiceRecoveryTime(afTime: number): void {
		throw new Error("the method 'SetVoiceRecoveryTime' is not implemented");
	}

	sheatheWeapon(): void {
		throw new Error("the method 'SheatheWeapon' is not implemented");
	}

	showBarterMenu(): void {
		throw new Error("the method 'ShowBarterMenu' is not implemented");
	}

	showGiftMenu(
		abGivingGift: boolean,
		apFilterList: any | null,
		abShowStolenItems: boolean,
		abUseFavorPoints: boolean
	): Promise<number> {
		throw new Error("the method 'ShowGiftMenu' is not implemented");
	}

	startCannibal(akTarget: Actor | null): void {
		throw new Error("the method 'StartCannibal' is not implemented");
	}

	startCombat(akTarget: Actor | null): void {
		throw new Error("the method 'StartCombat' is not implemented");
	}

	startDeferredKill(): void {
		throw new Error("the method 'StartDeferredKill' is not implemented");
	}

	startSneaking(): void {
		throw new Error("the method 'StartSneaking' is not implemented");
	}

	startVampireFeed(akTarget: Actor | null): void {
		throw new Error("the method 'StartVampireFeed' is not implemented");
	}

	stopCombat(): void {
		throw new Error("the method 'StopCombat' is not implemented");
	}

	stopCombatAlarm(): void {
		throw new Error("the method 'StopCombatAlarm' is not implemented");
	}

	trapSoul(akTarget: Actor | null): boolean {
		throw new Error("the method 'TrapSoul' is not implemented");
	}

	unLockOwnedDoorsInCell(): void {
		throw new Error("the method 'UnLockOwnedDoorsInCell' is not implemented");
	}

	unequipAll(): void {
		if (!IActor.UnequipAll) throw new Error("the method 'UnequipAll' is not implemented");
		return IActor.UnequipAll(this.obj);
	}

	unequipItem(akItem: Form, abPreventEquip: boolean = false, abSilent: boolean = false): void {
		if (!IActor.UnequipItem) throw new Error("the method 'UnequipItem' is not implemented");
		if (!akItem) throw new Error('akItem is not defined');
		return IActor.UnequipItem(this.obj, [akItem.obj, abPreventEquip, abSilent]);
	}

	unequipItemEx(item: Form | null, equipSlot: number, preventEquip: boolean): void {
		throw new Error("the method 'UnequipItemEx' is not implemented");
	}

	unequipItemSlot(aiSlot: number): void {
		if (!IActor.UnequipItemSlot) throw new Error("the method 'UnequipItemSlot' is not implemented");
		return IActor.UnequipItemSlot(this.obj, [aiSlot]);
	}

	unequipShout(akShout: any | null): void {
		throw new Error("the method 'UnequipShout' is not implemented");
	}

	unequipSpell(akSpell: any | null, aiSource: number): void {
		throw new Error("the method 'UnequipSpell' is not implemented");
	}

	updateWeight(neckDelta: number): void {
		throw new Error("the method 'UpdateWeight' is not implemented");
	}

	willIntimidateSucceed(): boolean {
		throw new Error("the method 'WillIntimidateSucceed' is not implemented");
	}

	wornHasKeyword(akKeyword: Keyword | null): boolean {
		throw new Error("the method 'WornHasKeyword' is not implemented");
	}

	setWorldSpace(id: number): void {
		if (!IActor.SetWorldOrCell) throw new Error("the method SetWorldOrCell' is not implemented");
		return IActor.SetWorldOrCell([this.obj, id]);
	}

	throwOut(): void {
		if (!IActor.ThrowOut) throw new Error("the method 'ThrowOut' is not implemented");
		return IActor.ThrowOut(this.obj);
	}
}
// #endregion

// #region Armor
export class Armor extends Form {
	constructor(obj: PapyrusObject) {
		super(obj);
		if (!IArmor) throw new Error("the interface 'IArmor' is not defined");
	}

	static from(papyrusObject: BaseClass): Armor | null {
		if (!papyrusObject) return null;
		const obj = from('GetArmor', papyrusObject.obj);
		if (!obj) return null;
		return new Armor(obj);
	}

	static get(id: number): Armor | null {
		const form = Game.getForm(id);
		if (!form) return null;
		const armor = Armor.from(form);
		if (!armor) return null;
		return armor;
	}

	addSlotToMask(slotMask: number): number {
		throw new Error("the method 'AddSlotToMask' is not implemented");
	}

	getArmorRating(): number {
		if (!IArmor.GetArmorRating) throw new Error("the method 'GetArmorRating' is not implemented");
		return IArmor.GetArmorRating(this.obj);
	}

	getEnchantment(): any | null {
		throw new Error("the method 'GetEnchantment' is not implemented");
	}

	getIconPath(bFemalePath: boolean): string {
		throw new Error("the method 'GetIconPath' is not implemented");
	}

	getMessageIconPath(bFemalePath: boolean): string {
		throw new Error("the method 'GetMessageIconPath' is not implemented");
	}

	getModelPath(bFemalePath: boolean): string {
		throw new Error("the method 'GetModelPath' is not implemented");
	}

	getNthArmorAddon(n: number): any | null {
		throw new Error("the method 'GetNthArmorAddon' is not implemented");
	}

	getNumArmorAddons(): number {
		throw new Error("the method 'GetNumArmorAddons' is not implemented");
	}

	getSlotMask(): number {
		throw new Error("the method 'GetSlotMask' is not implemented");
	}

	getWarmthRating(): number {
		throw new Error("the method 'GetWarmthRating' is not implemented");
	}

	getWeightClass(): number {
		throw new Error("the method 'GetWeightClass' is not implemented");
	}

	modArmorRating(modBy: number): void {
		throw new Error("the method 'ModArmorRating' is not implemented");
	}

	removeSlotFromMask(slotMask: number): number {
		throw new Error("the method 'RemoveSlotFromMask' is not implemented");
	}

	setArmorRating(armorRating: number): void {
		throw new Error("the method 'SetArmorRating' is not implemented");
	}

	setEnchantment(e: any | null): void {
		throw new Error("the method 'SetEnchantment' is not implemented");
	}

	setIconPath(path: string, bFemalePath: boolean): void {
		throw new Error("the method 'SetIconPath' is not implemented");
	}

	setMessageIconPath(path: string, bFemalePath: boolean): void {
		throw new Error("the method 'SetMessageIconPath' is not implemented");
	}

	setModelPath(path: string, bFemalePath: boolean): void {
		throw new Error("the method 'SetModelPath' is not implemented");
	}

	setSlotMask(slotMask: number): void {
		throw new Error("the method 'SetSlotMask' is not implemented");
	}

	setWeightClass(weightClass: number): void {
		throw new Error("the method 'SetWeightClass' is not implemented");
	}
}
// #endregion

// #region Cell
export class Cell extends Form {
	constructor(obj: PapyrusObject) {
		super(obj);
		if (!ICell) throw new Error("the interface 'ICell' is not defined");
	}

	static from(papyrusObject: BaseClass): Cell | null {
		if (!papyrusObject) return null;
		const obj = from('GetCell', papyrusObject.obj);
		if (!obj) return null;
		return new Cell(obj);
	}

	static get(id: number): Cell | null {
		const form = Game.getForm(id);
		if (!form) return null;
		const cell = Cell.from(form);
		if (!cell) return null;
		return cell;
	}

	getActorOwner(): any | null {
		throw new Error("the method 'GetActorOwner' is not implemented");
	}

	getFactionOwner(): any | null {
		throw new Error("the method 'GetFactionOwner' is not implemented");
	}

	getLocation(): Location | null {
		if (!ICell.GetLocation) throw new Error("the method 'GetLocation' is not implemented");

		const location = ICell.GetLocation(this.obj);

		if (!location) return null;

		return new Location(location);
	}

	getNthRef(n: number, formTypeFilter: number): ObjectReference | null {
		throw new Error("the method 'GetNthRef' is not implemented");
	}

	getNumRefs(formTypeFilter: number): number {
		throw new Error("the method 'GetNumRefs' is not implemented");
	}

	getWaterLevel(): number {
		throw new Error("the method 'GetWaterLevel' is not implemented");
	}

	isAttached(): boolean {
		throw new Error("the method 'IsAttached' is not implemented");
	}

	isInterior(): boolean {
		if (!ICell.IsInterior) throw new Error("the method 'IsInterior' is not implemented");
		return ICell.IsInterior(this.obj);
	}

	reset(): void {
		throw new Error("the method 'Reset' is not implemented");
	}

	setActorOwner(akActor: any | null): void {
		throw new Error("the method 'SetActorOwner' is not implemented");
	}

	setFactionOwner(akFaction: any | null): void {
		throw new Error("the method 'SetFactionOwner' is not implemented");
	}

	setFogColor(
		aiNearRed: number,
		aiNearGreen: number,
		aiNearBlue: number,
		aiFarRed: number,
		aiFarGreen: number,
		aiFarBlue: number
	): void {
		throw new Error("the method 'SetFogColor' is not implemented");
	}

	setFogPlanes(afNear: number, afFar: number): void {
		throw new Error("the method 'SetFogPlanes' is not implemented");
	}

	setFogPower(afPower: number): void {
		throw new Error("the method 'SetFogPower' is not implemented");
	}

	setPublic(abPublic: boolean): void {
		throw new Error("the method 'SetPublic' is not implemented");
	}
}
// #endregion

// #region ConstructibleObject
export class ConstructibleObject extends Form {
	constructor(obj: PapyrusObject) {
		super(obj);
		if (!IConstructibleObject) throw new Error("the interface 'IConstructibleObject' is not defined");
	}

	static from(papyrusObject: BaseClass): ConstructibleObject | null {
		if (!papyrusObject) return null;
		const obj = from('GetConstructibleObject', papyrusObject.obj);
		if (!obj) return null;
		return new ConstructibleObject(obj);
	}

	static get(id: number): ConstructibleObject | null {
		const form = Game.getForm(id);
		if (!form) return null;
		const constructibleObject = ConstructibleObject.from(form);
		if (!constructibleObject) return null;
		return constructibleObject;
	}

	getNthIngredient(n: number): Form | null {
		if (!IConstructibleObject.GetNthIngredient) throw new Error("the method 'getNthIngredient' is not implemented");
		const obj = IConstructibleObject.GetNthIngredient(this.obj, [n]);
		if (!obj) return null;
		return new Form(obj);
	}

	getNthIngredientQuantity(n: number): number {
		if (!IConstructibleObject.GetNthIngredientQuantity) {
			throw new Error("the method 'getNthIngredientQuantity' is not implemented");
		}
		return IConstructibleObject.GetNthIngredientQuantity(this.obj, [n]);
	}

	getNumIngredients(): number {
		if (!IConstructibleObject.GetNumIngredients) throw new Error("the method 'GetNumIngredients' is not implemented");
		return IConstructibleObject.GetNumIngredients(this.obj);
	}

	getResult(): Form | null {
		if (!IConstructibleObject.GetResult) throw new Error("the method 'GetResult' is not implemented");
		const obj = IConstructibleObject.GetResult(this.obj);
		if (!obj) return null;
		return new Form(obj);
	}

	getResultQuantity(): number {
		throw new Error("the method 'GetResultQuantity' is not implemented");
	}

	getWorkbenchKeyword(): Keyword | null {
		if (!IConstructibleObject.GetWorkbenchKeyword) {
			throw new Error("the method 'getWorkbenchKeyword' is not implemented");
		}
		const obj = IConstructibleObject.GetWorkbenchKeyword(this.obj);
		if (!obj) return null;
		return new Keyword(obj);
	}

	setNthIngredient(required: Form | null, n: number): void {
		throw new Error("the method 'SetNthIngredient' is not implemented");
	}

	setNthIngredientQuantity(value: number, n: number): void {
		throw new Error("the method 'SetNthIngredientQuantity' is not implemented");
	}

	setResult(result: Form | null): void {
		throw new Error("the method 'SetResult' is not implemented");
	}

	setResultQuantity(quantity: number): void {
		throw new Error("the method 'SetResultQuantity' is not implemented");
	}

	setWorkbenchKeyword(aKeyword: Keyword | null): void {
		throw new Error("the method 'SetWorkbenchKeyword' is not implemented");
	}
}
// #endregion

// #region Location
export class Location extends Form {
	constructor(obj: PapyrusObject) {
		super(obj);
		if (!ILocation) throw new Error("the interface 'ILocation' is not defined");
	}

	static from(papyrusObject: BaseClass): Location | null {
		if (!papyrusObject) return null;
		const obj = from('GetLocation', papyrusObject.obj);
		if (!obj) return null;
		return new Location(obj);
	}

	static get(id: number): Location | null {
		const form = Game.getForm(id);
		if (!form) return null;
		const location = Location.from(form);
		if (!location) return null;
		return location;
	}

	getKeywordData(akKeyword: Keyword): number {
		throw new Error("the method 'GetKeywordData' is not implemented");
	}

	// getRefTypeAliveCount(akRefType: LocationRefType): number {
	// 	throw new Error("the method 'GetRefTypeAliveCount' is not implemented");
	// }

	// getRefTypeDeadCount(akRefType: LocationRefType): number {
	// 	throw new Error("the method 'GetRefTypeDeadCount' is not implemented");
	// }

	hasCommonParent(akOther: Location, akFilter: Keyword): boolean {
		throw new Error("the method 'HasCommonParent' is not implemented");
	}

	// hasRefType(akRefType: LocationRefType): boolean {
	// 	throw new Error("the method 'HasRefType' is not implemented");
	// }

	isCleared(): boolean {
		throw new Error("the method 'IsCleared' is not implemented");
	}

	isLoaded(): boolean {
		throw new Error("the method 'IsLoaded' is not implemented");
	}

	isSameLocation(akOtherLocation: Location, akKeyword: Keyword): boolean {
		throw new Error("the method 'IsSameLocation' is not implemented");
	}

	setKeywordData(akKeyword: Keyword, afData: number): void {
		throw new Error("the method 'SetKeywordData' is not implemented");
	}

	setCleared(abCleared: boolean = true): void {
		throw new Error("the method 'SetCleared' is not implemented");
	}

	getParent(): Location | null {
		if (!ILocation.GetParent) throw new Error("the method 'GetParent' is not implemented");
		const parent = ILocation.GetParent(this.obj);
		if (!parent) return null;
		return new Location(parent);
	}
}
// #endregion

// #region Keyword
export class Keyword extends Form {
	constructor(obj: PapyrusObject) {
		super(obj);
		if (!IKeyword) throw new Error("the interface 'IKeyword' is not defined");
	}

	static from(papyrusObject: BaseClass): Keyword | null {
		if (!papyrusObject) return null;
		const obj = from('GetKeyword', papyrusObject.obj);
		if (!obj) return null;
		return new Keyword(obj);
	}

	static get(id: number): Keyword | null {
		const form = Game.getForm(id);
		if (!form) return null;
		const keyword = Keyword.from(form);
		if (!keyword) return null;
		return keyword;
	}

	static getKeyword(key: string): Keyword | null {
		if (!IKeyword.GetKeyword) throw new Error("the method 'GetKeyword' is not implemented");
		const obj = IKeyword.GetKeyword([key]);
		if (!obj) return null;
		return new Keyword(obj);
	}
}
// #endregion

// #region MagicEffect
export class MagicEffect extends Form {
	constructor(obj: PapyrusObject) {
		super(obj);
		if (!IMagicEffect) throw new Error("the interface 'IMagicEffect' is not defined");
	}

	static from(papyrusObject: BaseClass): MagicEffect | null {
		if (!papyrusObject) return null;
		const obj = from('GetMagicEffect', papyrusObject.obj);
		if (!obj) return null;
		return new MagicEffect(obj);
	}

	static get(id: number): MagicEffect | null {
		const form = Game.getForm(id);
		if (!form) return null;
		const magicEffect = MagicEffect.from(form);
		if (!magicEffect) return null;
		return magicEffect;
	}

	clearEffectFlag(flag: number): void {
		throw new Error("the method 'ClearEffectFlag' is not implemented");
	}

	getArea(): number {
		throw new Error("the method 'GetArea' is not implemented");
	}

	getAssociatedSkill(): Promise<string> {
		throw new Error("the method 'GetAssociatedSkill' is not implemented");
	}

	getBaseCost(): number {
		throw new Error("the method 'GetBaseCost' is not implemented");
	}

	getCastTime(): number {
		throw new Error("the method 'GetCastTime' is not implemented");
	}

	getCastingArt(): any | null {
		throw new Error("the method 'GetCastingArt' is not implemented");
	}

	getCastingType(): number {
		throw new Error("the method 'GetCastingType' is not implemented");
	}

	getDeliveryType(): number {
		throw new Error("the method 'GetDeliveryType' is not implemented");
	}

	getEnchantArt(): any | null {
		throw new Error("the method 'GetEnchantArt' is not implemented");
	}

	getEnchantShader(): any | null {
		throw new Error("the method 'GetEnchantShader' is not implemented");
	}

	getEquipAbility(): any | null {
		throw new Error("the method 'GetEquipAbility' is not implemented");
	}

	getExplosion(): any | null {
		throw new Error("the method 'GetExplosion' is not implemented");
	}

	getHitEffectArt(): any | null {
		throw new Error("the method 'GetHitEffectArt' is not implemented");
	}

	getHitShader(): any | null {
		throw new Error("the method 'GetHitShader' is not implemented");
	}

	getImageSpaceMod(): any | null {
		throw new Error("the method 'GetImageSpaceMod' is not implemented");
	}

	getImpactDataSet(): any | null {
		throw new Error("the method 'GetImpactDataSet' is not implemented");
	}

	getLight(): any | null {
		throw new Error("the method 'GetLight' is not implemented");
	}

	getPerk(): any | null {
		throw new Error("the method 'GetPerk' is not implemented");
	}

	getProjectile(): any | null {
		throw new Error("the method 'GetProjectile' is not implemented");
	}

	getResistance(): string {
		throw new Error("the method 'GetResistance' is not implemented");
	}

	getSkillLevel(): number {
		throw new Error("the method 'GetSkillLevel' is not implemented");
	}

	getSkillUsageMult(): number {
		throw new Error("the method 'GetSkillUsageMult' is not implemented");
	}

	getSounds(): PapyrusObject[] | null {
		throw new Error("the method 'GetSounds' is not implemented");
	}

	isEffectFlagSet(flag: number): boolean {
		throw new Error("the method 'IsEffectFlagSet' is not implemented");
	}

	setArea(area: number): void {
		throw new Error("the method 'SetArea' is not implemented");
	}

	setAssociatedSkill(skill: string): void {
		throw new Error("the method 'SetAssociatedSkill' is not implemented");
	}

	setBaseCost(cost: number): void {
		throw new Error("the method 'SetBaseCost' is not implemented");
	}

	setCastTime(castTime: number): void {
		throw new Error("the method 'SetCastTime' is not implemented");
	}

	setCastingArt(obj: any | null): void {
		throw new Error("the method 'SetCastingArt' is not implemented");
	}

	setEffectFlag(flag: number): void {
		throw new Error("the method 'SetEffectFlag' is not implemented");
	}

	setEnchantArt(obj: any | null): void {
		throw new Error("the method 'SetEnchantArt' is not implemented");
	}

	setEnchantShader(obj: any | null): void {
		throw new Error("the method 'SetEnchantShader' is not implemented");
	}

	setEquipAbility(obj: any | null): void {
		throw new Error("the method 'SetEquipAbility' is not implemented");
	}

	setExplosion(obj: any | null): void {
		throw new Error("the method 'SetExplosion' is not implemented");
	}

	setHitEffectArt(obj: any | null): void {
		throw new Error("the method 'SetHitEffectArt' is not implemented");
	}

	setHitShader(obj: any | null): void {
		throw new Error("the method 'SetHitShader' is not implemented");
	}

	setImageSpaceMod(obj: any | null): void {
		throw new Error("the method 'SetImageSpaceMod' is not implemented");
	}

	setImpactDataSet(obj: any | null): void {
		throw new Error("the method 'SetImpactDataSet' is not implemented");
	}

	setLight(obj: any | null): void {
		throw new Error("the method 'SetLight' is not implemented");
	}

	setPerk(obj: any | null): void {
		throw new Error("the method 'SetPerk' is not implemented");
	}

	setProjectile(obj: any | null): void {
		throw new Error("the method 'SetProjectile' is not implemented");
	}

	setResistance(skill: string): void {
		throw new Error("the method 'SetResistance' is not implemented");
	}

	setSkillLevel(level: number): void {
		throw new Error("the method 'SetSkillLevel' is not implemented");
	}

	setSkillUsageMult(usageMult: number): void {
		throw new Error("the method 'SetSkillUsageMult' is not implemented");
	}
}
// #endregion

// #region Outfit
export class Outfit extends Form {
	constructor(obj: PapyrusObject) {
		super(obj);
		if (!IOutfit) throw new Error("the interface 'IOutfit' is not defined");
	}

	static from(papyrusObject: BaseClass): Outfit | null {
		if (!papyrusObject) return null;
		const obj = from('GetOutfit', papyrusObject.obj);
		if (!obj) return null;
		return new Outfit(obj);
	}

	static get(id: number): Outfit | null {
		const form = Game.getForm(id);
		if (!form) return null;
		const outfit = Outfit.from(form);
		if (!outfit) return null;
		return outfit;
	}
}
// #endregion

// #region Perk
export class Perk extends Form {
	constructor(obj: PapyrusObject) {
		super(obj);
		if (!IPerk) throw new Error("the interface 'IPerk' is not defined");
	}

	static from(papyrusObject: BaseClass): Perk | null {
		if (!papyrusObject) return null;
		const obj = from('GetPerk', papyrusObject.obj);
		if (!obj) return null;
		return new Perk(obj);
	}

	static get(id: number): Perk | null {
		const form = Game.getForm(id);
		if (!form) return null;
		const perk = Perk.from(form);
		if (!perk) return null;
		return perk;
	}
}
// #endregion

// #region Potion
export class Potion extends Form {
	constructor(obj: PapyrusObject) {
		super(obj);
		if (!IPotion) throw new Error("the interface 'IPotion' is not defined");
	}

	static from(papyrusObject: BaseClass): Potion | null {
		if (!papyrusObject) return null;
		const obj = from('GetPotion', papyrusObject.obj);
		if (!obj) return null;
		return new Potion(obj);
	}

	static get(id: number): Potion | null {
		const form = Game.getForm(id);
		if (!form) return null;
		const potion = Potion.from(form);
		if (!potion) return null;
		return potion;
	}

	getCostliestEffectIndex(): number {
		throw new Error("the method 'GetCostliestEffectIndex' is not implemented");
	}

	getEffectAreas(): number[] {
		if (!IPotion.GetEffectAreas) throw new Error("the method 'GetEffectAreas' is not implemented");
		return IPotion.GetEffectAreas(this.obj);
	}

	getEffectDurations(): number[] {
		if (!IPotion.GetEffectDurations) throw new Error("the method 'GetEffectDurations' is not implemented");
		return IPotion.GetEffectDurations(this.obj);
	}

	getEffectMagnitudes(): number[] {
		if (!IPotion.GetEffectMagnitudes) throw new Error("the method 'GetEffectMagnitudes' is not implemented");
		return IPotion.GetEffectMagnitudes(this.obj);
	}

	getMagicEffects(): MagicEffect[] {
		if (!IPotion.GetMagicEffects) throw new Error("the method 'GetMagicEffects' is not implemented");
		const objArray = IPotion.GetMagicEffects(this.obj);
		return objArray.map((obj) => new MagicEffect(obj));
	}

	getNthEffectArea(index: number): number {
		if (!IPotion.GetNthEffectArea) throw new Error("the method 'GetNthEffectArea' is not implemented");
		return IPotion.GetNthEffectArea(this.obj, [index]);
	}

	getNthEffectDuration(index: number): number {
		if (!IPotion.GetNthEffectDuration) throw new Error("the method 'GetNthEffectDuration' is not implemented");
		return IPotion.GetNthEffectDuration(this.obj, [index]);
	}

	getNthEffectMagicEffect(index: number): MagicEffect | null {
		if (!IPotion.GetNthEffectMagicEffect) throw new Error("the method 'GetNthEffectMagicEffect' is not implemented");
		const obj = IPotion.GetNthEffectMagicEffect(this.obj, [index]);
		if (!obj) return null;
		return new MagicEffect(obj);
	}

	getNthEffectMagnitude(index: number): number {
		if (!IPotion.GetNthEffectMagnitude) throw new Error("the method 'GetNthEffectMagnitude' is not implemented");
		return IPotion.GetNthEffectMagnitude(this.obj, [index]);
	}

	getNumEffects(): number {
		if (!IPotion.GetNumEffects) throw new Error("the method 'GetNumEffects' is not implemented");
		return IPotion.GetNumEffects(this.obj);
	}

	getUseSound(): any | null {
		throw new Error("the method 'GetUseSound' is not implemented");
	}

	isFood(): boolean {
		if (!IPotion.IsFood) throw new Error("the method 'IsFood' is not implemented");
		return IPotion.IsFood(this.obj);
	}

	isHostile(): boolean {
		throw new Error("the method 'IsHostile' is not implemented");
	}

	isPoison(): boolean {
		if (!IPotion.IsPoison) throw new Error("the method 'IsPoison' is not implemented");
		return IPotion.IsPoison(this.obj);
	}

	setNthEffectArea(index: number, value: number): void {
		throw new Error("the method 'SetNthEffectArea' is not implemented");
	}

	setNthEffectDuration(index: number, value: number): void {
		throw new Error("the method 'SetNthEffectDuration' is not implemented");
	}

	setNthEffectMagnitude(index: number, value: number): void {
		throw new Error("the method 'SetNthEffectMagnitude' is not implemented");
	}
}
// #endregion

// #region Race
export class Race extends Form {
	constructor(obj: PapyrusObject) {
		super(obj);
		if (!IRace) throw new Error("the interface 'IRace' is not defined");
	}

	static from(papyrusObject: BaseClass): Race | null {
		if (!papyrusObject) return null;
		const obj = from('GetRace', papyrusObject.obj);
		if (!obj) return null;
		return new Race(obj);
	}

	static get(id: number): Race | null {
		const form = Game.getForm(id);
		if (!form) return null;
		const race = Race.from(form);
		if (!race) return null;
		return race;
	}
}
// #endregion

// #region Weapon
export class Weapon extends Form {
	constructor(obj: PapyrusObject) {
		super(obj);
		if (!IWeapon) throw new Error("the interface 'IWeapon' is not defined");
	}

	static from(papyrusObject: BaseClass): Weapon | null {
		if (!papyrusObject) return null;
		const obj = from('GetWeapon', papyrusObject.obj);
		if (!obj) return null;
		return new Weapon(obj);
	}

	static get(id: number): Weapon | null {
		const form = Game.getForm(id);
		if (!form) return null;
		const weapon = Weapon.from(form);
		if (!weapon) return null;
		return weapon;
	}

	fire(akSource: ObjectReference | null, akAmmo: any | null): void {
		throw new Error("the method 'Fire' is not implemented");
	}

	getBaseDamage(): number {
		if (!IWeapon.GetBaseDamage) throw new Error("the method 'GetBaseDamage' is not implemented");
		return IWeapon.GetBaseDamage(this.obj);
	}

	getCritDamage(): number {
		throw new Error("the method 'GetCritDamage' is not implemented");
	}

	getCritEffect(): any | null {
		throw new Error("the method 'GetCritEffect' is not implemented");
	}

	getCritEffectOnDeath(): boolean {
		throw new Error("the method 'GetCritEffectOnDeath' is not implemented");
	}

	getCritMultiplier(): number {
		throw new Error("the method 'GetCritMultiplier' is not implemented");
	}

	getEnchantment(): any | null {
		throw new Error("the method 'GetEnchantment' is not implemented");
	}

	getEnchantmentValue(): number {
		throw new Error("the method 'GetEnchantmentValue' is not implemented");
	}

	getEquipType(): any | null {
		throw new Error("the method 'GetEquipType' is not implemented");
	}

	getEquippedModel(): any | null {
		throw new Error("the method 'GetEquippedModel' is not implemented");
	}

	getIconPath(): string {
		throw new Error("the method 'GetIconPath' is not implemented");
	}

	getMaxRange(): number {
		throw new Error("the method 'GetMaxRange' is not implemented");
	}

	getMessageIconPath(): string {
		throw new Error("the method 'GetMessageIconPath' is not implemented");
	}

	getMinRange(): number {
		throw new Error("the method 'GetMinRange' is not implemented");
	}

	getModelPath(): string {
		throw new Error("the method 'GetModelPath' is not implemented");
	}

	getReach(): number {
		throw new Error("the method 'GetReach' is not implemented");
	}

	getResist(): string {
		throw new Error("the method 'GetResist' is not implemented");
	}

	getSkill(): string {
		throw new Error("the method 'GetSkill' is not implemented");
	}

	getSpeed(): number {
		throw new Error("the method 'GetSpeed' is not implemented");
	}

	getStagger(): number {
		throw new Error("the method 'GetStagger' is not implemented");
	}

	getTemplate(): Weapon | null {
		throw new Error("the method 'GetTemplate' is not implemented");
	}

	getWeaponType(): number {
		if (!IWeapon.GetWeaponType) throw new Error("the method 'GetWeaponType' is not implemented");
		return IWeapon.GetWeaponType(this.obj) as number;
	}

	setBaseDamage(damage: number): void {
		throw new Error("the method 'SetBaseDamage' is not implemented");
	}

	setCritDamage(damage: number): void {
		throw new Error("the method 'SetCritDamage' is not implemented");
	}

	setCritEffect(ce: any | null): void {
		throw new Error("the method 'SetCritEffect' is not implemented");
	}

	setCritEffectOnDeath(ceod: boolean): void {
		throw new Error("the method 'SetCritEffectOnDeath' is not implemented");
	}

	setCritMultiplier(crit: number): void {
		throw new Error("the method 'SetCritMultiplier' is not implemented");
	}

	setEnchantment(e: any | null): void {
		throw new Error("the method 'SetEnchantment' is not implemented");
	}

	setEnchantmentValue(value: number): void {
		throw new Error("the method 'SetEnchantmentValue' is not implemented");
	}

	setEquipType(type: any | null): void {
		throw new Error("the method 'SetEquipType' is not implemented");
	}

	setEquippedModel(model: any | null): void {
		throw new Error("the method 'SetEquippedModel' is not implemented");
	}

	setIconPath(path: string): void {
		throw new Error("the method 'SetIconPath' is not implemented");
	}

	setMaxRange(maxRange: number): void {
		throw new Error("the method 'SetMaxRange' is not implemented");
	}

	setMessageIconPath(path: string): void {
		throw new Error("the method 'SetMessageIconPath' is not implemented");
	}

	setMinRange(minRange: number): void {
		throw new Error("the method 'SetMinRange' is not implemented");
	}

	setModelPath(path: string): void {
		throw new Error("the method 'SetModelPath' is not implemented");
	}

	setReach(reach: number): void {
		throw new Error("the method 'SetReach' is not implemented");
	}

	setResist(resist: string): void {
		throw new Error("the method 'SetResist' is not implemented");
	}

	setSkill(skill: string): void {
		throw new Error("the method 'SetSkill' is not implemented");
	}

	setSpeed(speed: number): void {
		throw new Error("the method 'SetSpeed' is not implemented");
	}

	setStagger(stagger: number): void {
		throw new Error("the method 'SetStagger' is not implemented");
	}

	setWeaponType(type: number): void {
		throw new Error("the method 'SetWeaponType' is not implemented");
	}
}
// #endregion

// #region WorldSpace
export class WorldSpace extends Form {
	constructor(obj: PapyrusObject) {
		super(obj);
		if (!IWorldSpace) throw new Error("the interface 'IWorldSpace' is not defined");
	}

	static from(papyrusObject: BaseClass): WorldSpace | null {
		if (!papyrusObject) return null;
		const obj = from('GetWorldSpace', papyrusObject.obj);
		if (!obj) return null;
		return new WorldSpace(obj);
	}

	static get(id: number): WorldSpace | null {
		const form = Game.getForm(id);
		if (!form) return null;
		const worldSpace = WorldSpace.from(form);
		if (!worldSpace) return null;
		return worldSpace;
	}
}
// #endregion

// #region Debug
export class Debug {
	constructor() {
		if (!IDebug) throw new Error("the interface 'IDebug' is not defined");
	}

	static centerOnCell(target: Actor, asCellname: string): void {
		if (!IDebug.CenterOnCell) throw new Error("the method 'CenterOnCell' is not implemented");
		if (!target) throw new Error('target is not defined');
		return IDebug.CenterOnCell([target.obj, asCellname]);
	}

	static centerOnCellAndWait(param1: string): Promise<number> {
		throw new Error("the method 'CenterOnCellAndWait' is not implemented");
	}

	static closeUserLog(param1: string): void {
		throw new Error("the method 'CloseUserLog' is not implemented");
	}

	static dBSendPlayerPosition(): void {
		throw new Error("the method 'DBSendPlayerPosition' is not implemented");
	}

	static debugChannelNotify(param1: string, param2: string): void {
		throw new Error("the method 'DebugChannelNotify' is not implemented");
	}

	static dumpAliasData(param1: any | null): void {
		throw new Error("the method 'DumpAliasData' is not implemented");
	}

	static getConfigName(): Promise<string> {
		throw new Error("the method 'GetConfigName' is not implemented");
	}

	static getPlatformName(): Promise<string> {
		throw new Error("the method 'GetPlatformName' is not implemented");
	}

	static getVersionNumber(): Promise<string> {
		throw new Error("the method 'GetVersionNumber' is not implemented");
	}

	static messageBox(param1: string): void {
		throw new Error("the method 'MessageBox' is not implemented");
	}

	static notification(target: Actor, msg: string): void {
		if (!IDebug.Notification) throw new Error("the method 'Notification' is not implemented");
		if (!target) throw new Error('target is not defined');
		return IDebug.Notification([target.obj, msg]);
	}

	static openUserLog(param1: string): boolean {
		throw new Error("the method 'OpenUserLog' is not implemented");
	}

	static playerMoveToAndWait(param1: string): Promise<number> {
		throw new Error("the method 'PlayerMoveToAndWait' is not implemented");
	}

	static quitGame(target: Actor): void {
		if (!IDebug.QuitGame) throw new Error("the method 'QuitGame' is not implemented");
		if (!target) throw new Error('target is not defined');
		return IDebug.QuitGame([target.obj]);
	}

	static sendAnimationEvent(arRef: ObjectReference, asEventName: string): void {
		if (!IDebug.SendAnimationEvent) throw new Error("the method 'SendAnimationEvent' is not implemented");
		if (!arRef) throw new Error('target is not defined');
		IDebug.SendAnimationEvent([arRef.obj, asEventName]);
	}

	static setFootIK(param1: boolean): void {
		throw new Error("the method 'SetFootIK' is not implemented");
	}

	static setGodMode(param1: boolean): void {
		throw new Error("the method 'SetGodMode' is not implemented");
	}

	static showRefPosition(arRef: ObjectReference | null): void {
		throw new Error("the method 'ShowRefPosition' is not implemented");
	}

	static startScriptProfiling(param1: string): void {
		throw new Error("the method 'StartScriptProfiling' is not implemented");
	}

	static startStackProfiling(): void {
		throw new Error("the method 'StartStackProfiling' is not implemented");
	}

	static stopScriptProfiling(param1: string): void {
		throw new Error("the method 'StopScriptProfiling' is not implemented");
	}

	static stopStackProfiling(): void {
		throw new Error("the method 'StopStackProfiling' is not implemented");
	}

	static takeScreenshot(param1: string): void {
		throw new Error("the method 'TakeScreenshot' is not implemented");
	}

	static toggleAI(): void {
		throw new Error("the method 'ToggleAI' is not implemented");
	}

	static toggleCollisions(target: Actor): void {
		if (!IDebug.ToggleCollisions) throw new Error("the method 'ToogleCollisions' is not implemented");
		if (!target) throw new Error('target is not defined');
		return IDebug.ToggleCollisions([target.obj]);
	}

	static toggleMenus(): void {
		throw new Error("the method 'ToggleMenus' is not implemented");
	}

	static trace(param1: string, param2: number): void {
		throw new Error("the method 'Trace' is not implemented");
	}

	static traceStack(param1: string, param2: number): void {
		throw new Error("the method 'TraceStack' is not implemented");
	}

	static traceUser(param1: string, param2: string, param3: number): boolean {
		throw new Error("the method 'TraceUser' is not implemented");
	}
}
// #endregion

// #region Game
export class Game {
	constructor() {
		if (!IGame) throw new Error("the interface 'IGame' is not defined");
	}

	static addAchievement(aiAchievementID: number): void {
		throw new Error("the method 'AddAchievement' is not implemented");
	}

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
	): Promise<boolean> {
		throw new Error("the method 'AddHavokBallAndSocketConstraint' is not implemented");
	}

	static addPerkPoints(aiPerkPoints: number): void {
		throw new Error("the method 'AddPerkPoints' is not implemented");
	}

	static advanceSkill(asSkillName: string, afMagnitude: number): void {
		throw new Error("the method 'AdvanceSkill' is not implemented");
	}

	static calculateFavorCost(aiFavorPrice: number): number {
		throw new Error("the method 'CalculateFavorCost' is not implemented");
	}

	static clearPrison(): void {
		throw new Error("the method 'ClearPrison' is not implemented");
	}

	static clearTempEffects(): void {
		throw new Error("the method 'ClearTempEffects' is not implemented");
	}

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
	): void {
		if (!IGame.DisablePlayerControls) throw new Error("the method 'DisablePlayerControls' is not implemented");
		if (!target) throw new Error('target is not defined');
		return IGame.DisablePlayerControls([
			target.obj,
			abMovement,
			abFighting,
			abCamSwitch,
			abLooking,
			abSneaking,
			abMenu,
			abActivate,
			abJournalTabs,
			aiDisablePOVType,
		]);
	}

	static enableFastTravel(abEnable: boolean): void {
		throw new Error("the method 'EnableFastTravel' is not implemented");
	}

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
	): void {
		if (!IGame.EnablePlayerControls) throw new Error("the method 'EnablePlayerControls' is not implemented");
		if (!target) throw new Error('target is not defined');
		return IGame.EnablePlayerControls([
			target.obj,
			abMovement,
			abFighting,
			abCamSwitch,
			abLooking,
			abSneaking,
			abMenu,
			abActivate,
			abJournalTabs,
			aiDisablePOVType,
		]);
	}

	static fadeOutGame(
		abFadingOut: boolean,
		abBlackFade: boolean,
		afSecsBeforeFade: number,
		afFadeDuration: number
	): void {
		throw new Error("the method 'FadeOutGame' is not implemented");
	}

	static fastTravel(akDestination: ObjectReference | null): void {
		throw new Error("the method 'FastTravel' is not implemented");
	}

	static findClosestActor(afX: number, afY: number, afZ: number, afRadius: number): Actor | null {
		throw new Error("the method 'FindClosestActor' is not implemented");
	}

	static findClosestReferenceOfAnyTypeInList(
		arBaseObjects: any | null,
		afX: number,
		afY: number,
		afZ: number,
		afRadius: number
	): ObjectReference | null {
		throw new Error("the method 'FindClosestReferenceOfAnyTypeInList' is not implemented");
	}

	static findClosestReferenceOfType(
		arBaseObject: Form | null,
		afX: number,
		afY: number,
		afZ: number,
		afRadius: number
	): ObjectReference | null {
		throw new Error("the method 'FindClosestReferenceOfType' is not implemented");
	}

	static findRandomActor(afX: number, afY: number, afZ: number, afRadius: number): Actor | null {
		throw new Error("the method 'FindRandomActor' is not implemented");
	}

	static findRandomReferenceOfAnyTypeInList(
		arBaseObjects: any | null,
		afX: number,
		afY: number,
		afZ: number,
		afRadius: number
	): ObjectReference | null {
		throw new Error("the method 'FindRandomReferenceOfAnyTypeInList' is not implemented");
	}

	static findRandomReferenceOfType(
		arBaseObject: Form | null,
		afX: number,
		afY: number,
		afZ: number,
		afRadius: number
	): ObjectReference | null {
		throw new Error("the method 'FindRandomReferenceOfType' is not implemented");
	}

	static forceFirstPerson(): void {
		throw new Error("the method 'forceFirstPerson' is not implemented");
	}

	static forceThirdPerson(target: Actor): void {
		if (!IGame.ForceThirdPerson) throw new Error("the method 'ForceThirdPerson' is not implemented");
		if (!target) throw new Error('target is not defined');
		return IGame.ForceThirdPerson([target.obj]);
	}

	static getCameraState(): number {
		throw new Error("the method 'GetCameraState' is not implemented");
	}

	static getCurrentConsoleRef(): ObjectReference | null {
		throw new Error("the method 'GetCurrentConsoleRef' is not implemented");
	}

	static getCurrentCrosshairRef(target: Actor): ObjectReference | null {
		if (!IGame.GetCurrentCrosshairRef) throw new Error("the method 'GetCurrentCrosshairRef' is not implemented");
		if (!target) throw new Error('target is not defined');
		const obj = IGame.GetCurrentCrosshairRef([target.obj]);
		if (!obj) return null;
		return new ObjectReference(obj);
	}

	static getDialogueTarget(): ObjectReference | null {
		throw new Error("the method 'GetDialogueTarget' is not implemented");
	}

	static getExperienceForLevel(currentLevel: number): number {
		throw new Error("the method 'GetExperienceForLevel' is not implemented");
	}

	static getForm(aiFormID: number): Form | null {
		if (!IGame.GetForm) throw new Error("the method 'GetForm' is not implemented");
		const obj = IGame.GetForm([aiFormID]);
		if (!obj) return null;
		return new Form(obj);
	}

	static getFormEx(formId: number): Form | null {
		if (!IGame.GetForm) throw new Error("the method 'GetForm' is not implemented");
		const obj = IGame.GetForm([formId]);
		if (!obj) return null;
		return new Form(obj);
	}

	static getFormFromFile(aiFormID: number, asFilename: string): Form | null {
		if (!IGame.GetFormFromFile) throw new Error("the method 'GetFormFromFile' is not implemented");
		const obj = IGame.GetFormFromFile([aiFormID, asFilename]);
		if (!obj) return null;
		return new Form(obj);
	}

	static getGameSettingFloat(asGameSetting: string): number {
		throw new Error("the method 'GetGameSettingFloat' is not implemented");
	}

	static getGameSettingInt(asGameSetting: string): number {
		throw new Error("the method 'GetGameSettingInt' is not implemented");
	}

	static getGameSettingString(asGameSetting: string): Promise<string> {
		throw new Error("the method 'GetGameSettingString' is not implemented");
	}

	static getHotkeyBoundObject(hotkey: number): Form | null {
		throw new Error("the method 'GetHotkeyBoundObject' is not implemented");
	}

	static getLightModAuthor(idx: number): string {
		throw new Error("the method 'GetLightModAuthor' is not implemented");
	}

	static getLightModByName(name: string): number {
		throw new Error("the method 'GetLightModByName' is not implemented");
	}

	static getLightModCount(): number {
		throw new Error("the method 'GetLightModCount' is not implemented");
	}

	static getLightModDependencyCount(idx: number): number {
		throw new Error("the method 'GetLightModDependencyCount' is not implemented");
	}

	static getLightModDescription(idx: number): string {
		throw new Error("the method 'GetLightModDescription' is not implemented");
	}

	static getLightModName(idx: number): string {
		throw new Error("the method 'GetLightModName' is not implemented");
	}

	static getModAuthor(modIndex: number): string {
		throw new Error("the method 'GetModAuthor' is not implemented");
	}

	static getModByName(name: string): number {
		throw new Error("the method 'GetModByName' is not implemented");
	}

	static getModCount(): number {
		throw new Error("the method 'GetModCount' is not implemented");
	}

	static getModDependencyCount(modIndex: number): number {
		throw new Error("the method 'GetModDependencyCount' is not implemented");
	}

	static getModDescription(modIndex: number): string {
		throw new Error("the method 'GetModDescription' is not implemented");
	}

	static getModName(modIndex: number): string {
		throw new Error("the method 'GetModName' is not implemented");
	}

	static getNthLightModDependency(modIdx: number, idx: number): number {
		throw new Error("the method 'GetNthLightModDependency' is not implemented");
	}

	static getNthTintMaskColor(n: number): number {
		throw new Error("the method 'GetNthTintMaskColor' is not implemented");
	}

	static getNthTintMaskTexturePath(n: number): string {
		throw new Error("the method 'GetNthTintMaskTexturePath' is not implemented");
	}

	static getNthTintMaskType(n: number): number {
		throw new Error("the method 'GetNthTintMaskType' is not implemented");
	}

	static getNumTintMasks(): number {
		throw new Error("the method 'GetNumTintMasks' is not implemented");
	}

	static getNumTintsByType(type: number): number {
		throw new Error("the method 'GetNumTintsByType' is not implemented");
	}

	static getPerkPoints(): number {
		throw new Error("the method 'GetPerkPoints' is not implemented");
	}

	static getPlayerExperience(): number {
		throw new Error("the method 'GetPlayerExperience' is not implemented");
	}

	static getPlayerGrabbedRef(): ObjectReference | null {
		throw new Error("the method 'GetPlayerGrabbedRef' is not implemented");
	}

	static getPlayerMovementMode(): boolean {
		throw new Error("the method 'GetPlayerMovementMode' is not implemented");
	}

	static getPlayersLastRiddenHorse(): Actor | null {
		throw new Error("the method 'GetPlayersLastRiddenHorse' is not implemented");
	}

	static getRealHoursPassed(): number {
		throw new Error("the method 'GetRealHoursPassed' is not implemented");
	}

	static getSunPositionX(): number {
		throw new Error("the method 'GetSunPositionX' is not implemented");
	}

	static getSunPositionY(): number {
		throw new Error("the method 'GetSunPositionY' is not implemented");
	}

	static getSunPositionZ(): number {
		throw new Error("the method 'GetSunPositionZ' is not implemented");
	}

	static getTintMaskColor(type: number, index: number): number {
		throw new Error("the method 'GetTintMaskColor' is not implemented");
	}

	static getTintMaskTexturePath(type: number, index: number): string {
		throw new Error("the method 'GetTintMaskTexturePath' is not implemented");
	}

	static hideTitleSequenceMenu(): void {
		throw new Error("the method 'HideTitleSequenceMenu' is not implemented");
	}

	static incrementSkill(asSkillName: string): void {
		throw new Error("the method 'IncrementSkill' is not implemented");
	}

	static incrementSkillBy(asSkillName: string, aiCount: number): void {
		throw new Error("the method 'IncrementSkillBy' is not implemented");
	}

	static incrementStat(asStatName: string, aiModAmount: number): void {
		throw new Error("the method 'IncrementStat' is not implemented");
	}

	static isActivateControlsEnabled(): boolean {
		throw new Error("the method 'IsActivateControlsEnabled' is not implemented");
	}

	static isCamSwitchControlsEnabled(): boolean {
		throw new Error("the method 'IsCamSwitchControlsEnabled' is not implemented");
	}

	static isFastTravelControlsEnabled(): boolean {
		throw new Error("the method 'IsFastTravelControlsEnabled' is not implemented");
	}

	static isFastTravelEnabled(): boolean {
		throw new Error("the method 'IsFastTravelEnabled' is not implemented");
	}

	static isFightingControlsEnabled(): boolean {
		throw new Error("the method 'IsFightingControlsEnabled' is not implemented");
	}

	static isJournalControlsEnabled(): boolean {
		throw new Error("the method 'IsJournalControlsEnabled' is not implemented");
	}

	static isLookingControlsEnabled(): boolean {
		throw new Error("the method 'IsLookingControlsEnabled' is not implemented");
	}

	static isMenuControlsEnabled(): boolean {
		throw new Error("the method 'IsMenuControlsEnabled' is not implemented");
	}

	static isMovementControlsEnabled(): boolean {
		throw new Error("the method 'IsMovementControlsEnabled' is not implemented");
	}

	static isObjectFavorited(Form: Form | null): boolean {
		throw new Error("the method 'IsObjectFavorited' is not implemented");
	}

	static isPlayerSungazing(): boolean {
		throw new Error("the method 'IsPlayerSungazing' is not implemented");
	}

	static isModuleInstalled(name: string): boolean {
		throw new Error("the method 'IsModuleInstalled' is not implemented");
	}

	static isSneakingControlsEnabled(): boolean {
		throw new Error("the method 'IsSneakingControlsEnabled' is not implemented");
	}

	static isWordUnlocked(akWord: any | null): boolean {
		throw new Error("the method 'IsWordUnlocked' is not implemented");
	}

	static loadGame(name: string): void {
		throw new Error("the method 'LoadGame' is not implemented");
	}

	static modPerkPoints(perkPoints: number): void {
		throw new Error("the method 'ModPerkPoints' is not implemented");
	}

	static playBink(
		asFilename: string,
		abInterruptible: boolean,
		abMuteAudio: boolean,
		abMuteMusic: boolean,
		abLetterbox: boolean
	): void {
		throw new Error("the method 'PlayBink' is not implemented");
	}

	static precacheCharGen(): void {
		throw new Error("the method 'PrecacheCharGen' is not implemented");
	}

	static precacheCharGenClear(): void {
		throw new Error("the method 'PrecacheCharGenClear' is not implemented");
	}

	static queryStat(asStat: string): number {
		throw new Error("the method 'QueryStat' is not implemented");
	}

	static quitToMainMenu(): void {
		throw new Error("the method 'QuitToMainMenu' is not implemented");
	}

	static removeHavokConstraints(
		arFirstRef: ObjectReference | null,
		arFirstRefNodeName: string,
		arSecondRef: ObjectReference | null,
		arSecondRefNodeName: string
	): Promise<boolean> {
		throw new Error("the method 'RemoveHavokConstraints' is not implemented");
	}

	static requestAutosave(): void {
		throw new Error("the method 'RequestAutosave' is not implemented");
	}

	static requestModel(asModelName: string): void {
		throw new Error("the method 'RequestModel' is not implemented");
	}

	static requestSave(): void {
		throw new Error("the method 'RequestSave' is not implemented");
	}

	static saveGame(name: string): void {
		throw new Error("the method 'SaveGame' is not implemented");
	}

	static sendWereWolfTransformation(): void {
		throw new Error("the method 'SendWereWolfTransformation' is not implemented");
	}

	static serveTime(): void {
		throw new Error("the method 'ServeTime' is not implemented");
	}

	static setAllowFlyingMountLandingRequests(abAllow: boolean): void {
		throw new Error("the method 'SetAllowFlyingMountLandingRequests' is not implemented");
	}

	static setBeastForm(abEntering: boolean): void {
		throw new Error("the method 'SetBeastForm' is not implemented");
	}

	static setCameraTarget(arTarget: Actor | null): void {
		throw new Error("the method 'SetCameraTarget' is not implemented");
	}

	static setGameSettingBool(setting: string, value: boolean): void {
		throw new Error("the method 'SetGameSettingBool' is not implemented");
	}

	static setGameSettingFloat(setting: string, value: number): void {
		throw new Error("the method 'SetGameSettingFloat' is not implemented");
	}

	static setGameSettingInt(setting: string, value: number): void {
		throw new Error("the method 'SetGameSettingInt' is not implemented");
	}

	static setGameSettingString(setting: string, value: string): void {
		throw new Error("the method 'SetGameSettingString' is not implemented");
	}

	static setHudCartMode(abSetCartMode: boolean): void {
		throw new Error("the method 'SetHudCartMode' is not implemented");
	}

	static setInChargen(
		abDisableSaving: boolean,
		abDisableWaiting: boolean,
		abShowControlsDisabledMessage: boolean
	): void {
		throw new Error("the method 'SetInChargen' is not implemented");
	}

	static setMiscStat(name: string, value: number): void {
		throw new Error("the method 'SetMiscStat' is not implemented");
	}

	static setNthTintMaskColor(n: number, color: number): void {
		throw new Error("the method 'SetNthTintMaskColor' is not implemented");
	}

	static setNthTintMaskTexturePath(path: string, n: number): void {
		throw new Error("the method 'SetNthTintMaskTexturePath' is not implemented");
	}

	static setPerkPoints(perkPoints: number): void {
		throw new Error("the method 'SetPerkPoints' is not implemented");
	}

	static setPlayerAIDriven(abAIDriven: boolean): void {
		throw new Error("the method 'SetPlayerAIDriven' is not implemented");
	}

	static setPlayerExperience(exp: number): void {
		throw new Error("the method 'SetPlayerExperience' is not implemented");
	}

	static setPlayerLevel(level: number): void {
		throw new Error("the method 'SetPlayerLevel' is not implemented");
	}

	static setPlayerReportCrime(abReportCrime: boolean): void {
		throw new Error("the method 'SetPlayerReportCrime' is not implemented");
	}

	static setPlayersLastRiddenHorse(horse: Actor | null): void {
		throw new Error("the method 'SetPlayersLastRiddenHorse' is not implemented");
	}

	static setSittingRotation(afValue: number): void {
		throw new Error("the method 'SetSittingRotation' is not implemented");
	}

	static setSunGazeImageSpaceModifier(apImod: any | null): void {
		throw new Error("the method 'SetSunGazeImageSpaceModifier' is not implemented");
	}

	static setTintMaskColor(color: number, type: number, index: number): void {
		throw new Error("the method 'SetTintMaskColor' is not implemented");
	}

	static setTintMaskTexturePath(path: string, type: number, index: number): void {
		throw new Error("the method 'SetTintMaskTexturePath' is not implemented");
	}

	static showFirstPersonGeometry(abShow: boolean): void {
		throw new Error("the method 'ShowFirstPersonGeometry' is not implemented");
	}

	static showLimitedRaceMenu(): void {
		throw new Error("the method 'ShowLimitedRaceMenu' is not implemented");
	}

	static showRaceMenu(): void {
		throw new Error("the method 'ShowRaceMenu' is not implemented");
	}

	static showTitleSequenceMenu(): void {
		throw new Error("the method 'ShowTitleSequenceMenu' is not implemented");
	}

	static showTrainingMenu(aTrainer: Actor | null): void {
		throw new Error("the method 'ShowTrainingMenu' is not implemented");
	}

	static startTitleSequence(asSequenceName: string): void {
		throw new Error("the method 'StartTitleSequence' is not implemented");
	}

	static teachWord(akWord: any | null): void {
		throw new Error("the method 'TeachWord' is not implemented");
	}

	static triggerScreenBlood(aiValue: number): void {
		throw new Error("the method 'TriggerScreenBlood' is not implemented");
	}

	static unbindObjectHotkey(hotkey: number): void {
		throw new Error("the method 'UnbindObjectHotkey' is not implemented");
	}

	static unlockWord(akWord: any | null): void {
		throw new Error("the method 'UnlockWord' is not implemented");
	}

	static updateHairColor(): void {
		throw new Error("the method 'UpdateHairColor' is not implemented");
	}

	static updateThirdPerson(): void {
		throw new Error("the method 'UpdateThirdPerson' is not implemented");
	}

	static updateTintMaskColors(): void {
		throw new Error("the method 'UpdateTintMaskColors' is not implemented");
	}

	static usingGamepad(): boolean {
		throw new Error("the method 'UsingGamepad' is not implemented");
	}

	static getPlayer(): Actor | null {
		throw new Error("the method 'GetPlayer' is not implemented");
	}

	static shakeCamera(akSource: ObjectReference | null, afStrength: number, afDuration: number): void {
		throw new Error("the method 'ShakeCamera' is not implemented");
	}

	static shakeController(afSmallMotorStrength: number, afBigMotorStreangth: number, afDuration: number): void {
		throw new Error("the method 'ShakeController' is not implemented");
	}

	static getServerOption(): ServerOption {
		if (!IGame.GetServerOptions) throw new Error("the method 'GetServerOptions' is not implemented");
		return IGame.GetServerOptions();
	}

	static getServerOptionValue(key: string): any {
		if (!IGame.GetServerOptionsValue) throw new Error("the method 'GetServerOptionsValue' is not implemented");
		return IGame.GetServerOptionsValue([key]);
	}
}
// #endregion

// #region M
export class M {
	constructor() {
		if (!IM) throw new Error("the interface 'IM' is not defined");
	}

	static getActorsInStreamZone(target: Actor): Actor[] {
		if (!IM.GetActorsInStreamZone) throw new Error("the method 'GetActorsInStreamZone' is not implemented");
		if (!target) throw new Error('target is not defined');
		const objArray = IM.GetActorsInStreamZone([target.obj]);
		return objArray.map((obj) => new Actor(obj));
	}

	static getOnlinePlayers(): Actor[] {
		if (!IM.GetOnlinePlayers) throw new Error("the method 'GetOnlinePlayers' is not implemented");
		const objArray = IM.GetOnlinePlayers();
		return objArray.map((obj) => new Actor(obj));
	}

	static isPlayer(id: number): boolean {
		if (!IM.IsPlayer) throw new Error("the method 'IsPlayer' is not implemented");
		if (!id) throw new Error('id is not defined');
		return IM.IsPlayer([id]);
	}

	static browserSetVisible(target: Actor, state: boolean): void {
		if (!IM.BrowserSetVisible) throw new Error("the method 'BrowserSetVisible' is not implemented");
		if (!target) throw new Error('target is not defined');
		return IM.BrowserSetVisible([target.obj, state]);
	}

	static browserSetFocused(target: Actor, state: boolean): void {
		if (!IM.BrowserSetFocused) throw new Error("the method 'BrowserSetFocused' is not implemented");
		if (!target) throw new Error('target is not defined');
		return IM.BrowserSetFocused([target.obj, state]);
	}

	static browserSetModal(target: Actor, state: boolean): void {
		if (!IM.BrowserSetModal) throw new Error("the method 'BrowserSetModal' is not implemented");
		if (!target) throw new Error('target is not defined');
		return IM.BrowserSetModal([target.obj, state]);
	}

	static browserGetVisible(target: Actor): boolean {
		if (!IM.BrowserGetVisible) throw new Error("the method 'BrowserGetVisible' is not implemented");
		if (!target) throw new Error('target is not defined');
		return IM.BrowserGetVisible([target.obj]);
	}

	static browserGetFocused(target: Actor): boolean {
		if (!IM.BrowserGetFocused) throw new Error("the method 'BrowserGetFocused' is not implemented");
		if (!target) throw new Error('target is not defined');
		return IM.BrowserGetFocused([target.obj]);
	}

	static browserGetModal(target: Actor): boolean {
		if (!IM.BrowserGetModal) throw new Error("the method 'BrowserGetModal' is not implemented");
		if (!target) throw new Error('target is not defined');
		return IM.BrowserGetModal([target.obj]);
	}

	static getGlobalStorageValue(key: string): PapyrusValue | undefined {
		if (!IM.GetGlobalStorageValue) throw new Error("the method 'GetGlobalStorageValue' is not implemented");
		if (!key) throw new Error('key is not defined');
		return IM.GetGlobalStorageValue([key]);
	}

	static setGlobalStorageValue(key: string, value: PapyrusValue): void {
		if (!IM.SetGlobalStorageValue) throw new Error("the method 'SetGlobalStorageValue' is not implemented");
		if (!key) throw new Error('key is not defined');
		return IM.SetGlobalStorageValue(key, value);
	}

	static sendChatMessage(target: Actor, message: string): void {
		if (!IM.ExecuteUiCommand) throw new Error("the method 'ExecuteUiCommand' is not implemented");
		if (!target) throw new Error('target is not defined');
		if (!message) throw new Error('message is not defined');
		return IM.ExecuteUiCommand([target.obj, 'CHAT_ADD_MESSAGE', null, null, JSON.stringify({ message })]);
	}

	static sendChatCommand(target: Actor, command: string, message: string): void {
		if (!IM.ExecuteUiCommand) throw new Error("the method 'ExecuteUiCommand' is not implemented");
		if (!target) throw new Error('target is not defined');
		if (message === undefined || message === null) throw new Error('message is not defined');
		return IM.ExecuteUiCommand([target.obj, command, null, null, message]);
	}
	// static executeUiCommand(target: Actor, command: string, msg: string): void {
	// 	if (!IM.ExecuteUiCommand) throw new Error(`the method 'ExecuteUiCommand' is not implemented`);
	// 	if (!target) throw new Error('target is not defined');
	// 	if (!command) throw new Error('command is not defined');
	// 	if (!msg) throw new Error('msg is not defined');
	// 	return IM.ExecuteUiCommand([target.obj, command, null, null, msg]);
	// }
}
// #endregion

// #region JSModule
class JSModule {}
export interface IJSModule {
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
	onResurrect?(actor: Actor): void;
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
	onChatInput?(actor: Actor, tokens: string[]): void;
	onChatCommand?(actor: Actor, cmd: string, tokens: string[]): boolean;
	onUiEvent?(actor: Actor, event: Record<string, unknown>): void;

	onTriggerLeave?(triggerRef: Actor): void;
	onTriggerEnter?(triggerRef: Actor): void;
}

// #endregion

// #endregion

export const init = (mp: Mp): void => {
	/** MODULES
	 * test system for js modules
	 */
	const emitter = new EventEmitter();
	mp.modules = [];
	mp.addJSModule = (module) => mp.modules.push(module);
	mp.loadJSModule = (modulePath: string) => {
		const moduleName = modulePath.replace('modules\\', '').replace('\\index.js', '');
		try {
			const moduleCode = mp.readDataFile(modulePath);
			if (!moduleCode.includes('mp.addJSModule')) {
				console.error(`error when initialize module ${moduleName}`, 'module doesn`t have "mp.addJSModule"');
				return false;
			}
			eval(mp.readDataFile(modulePath));
			return true;
		} catch (err) {
			console.error(`error when initialize module ${moduleName}`, err);
			return false;
		}
	};
	// find all modules from data dir
	const regex = /^modules\\.+index\.js$/;
	const modules = mp.readDataDirectory().filter((x) => x.trim().match(regex));
	console.log(`find ${modules.length} js modules`);
	setTimeout(() => {
		// initialize all modules
		modules.forEach((modulePath, i) => {
			const success = mp.loadJSModule(modulePath);
			if (!success) return;
			const moduleName = modulePath.replace('modules\\', '').replace('\\index.js', '');
			mp.modules[i].name = moduleName;
		});
	}, 0);
};
