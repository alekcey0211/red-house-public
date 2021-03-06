import { IJSModule } from '../modules';

export interface MakePropertyOptions {
	/**
	 * If set to false, `updateOwner` would never be invoked
	 * Player's client wouldn't see it's own value of this property
	 * Reasonable for passwords and other secret values.
	 */
	isVisibleByOwner: boolean;

	/**
	 * If set to false, `updateNeighbor` would never be invoked.
	 * Player's client wouldn't see values of neighbor Actors/ObjectReferences.
	 */
	isVisibleByNeighbors: boolean;

	/**
	 * Body of the function that would be invoked on client every update
	 * for the PlayerCharacter.
	 */
	updateOwner: string;

	/**
	 * Body of the function that would be invoked on client every update
	 * for each synchronized Actor/ObjectReference.
	 */
	updateNeighbor: string;
}

export type JsonSerializablePrimitive = boolean | string | number | null;
export type JsonSerializable = JsonSerializablePrimitive | JsonSerializable[] | { [key: string]: JsonSerializable };
// | Record<string, JsonSerializable>;

export interface EspmField {
	readonly type: string;
	readonly data: Uint8Array;
}

export interface EspmRecord {
	readonly id: number;
	readonly editorId: string;
	readonly type: string;
	readonly flags: number;
	readonly fields: EspmField[];
}

export interface EspmLookupResult {
	readonly record: EspmRecord;
	readonly fileIndex: number;
	readonly toGlobalRecordId: (localRecordId: number) => number;
}

export interface PapyrusObject {
	desc: string;
	type: 'form' | 'espm';
}

export type PapyrusValue = null | PapyrusObject | string | number | boolean | PapyrusValue[];

export type PapyrusMethod = (
	self: PapyrusObject,
	args: PapyrusValue[]
) => PapyrusValue | Promise<PapyrusValue> | void | Promise<void>;

export type PapyrusGlobalFunction = (
	self: null,
	args: PapyrusValue[]
) => PapyrusValue | Promise<PapyrusValue> | void | Promise<void>;

export interface InventoryItem {
	baseId: number;
	count: number;
}

export interface Inventory {
	entries: InventoryItem[];
}

export interface InventoryItemEq {
	baseId: number;
	count: number;
	worn: boolean;
}

export interface InventoryEq {
	entries: InventoryItemEq[];
}

export interface Equipment {
	inv: InventoryEq;
	numChanges: number;
}

export interface Appearance {
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

export interface Mp {
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
	 * Creates a new property that would be attached to all instances of
	 * `MpActor` and `MpObjectReference`. Values are saved to database automatically.
	 * @param propertyName A unique name for the property being created.
	 * @param options Property options.
	 */
	makeProperty(propertyName: string, options: MakePropertyOptions): void;

	/**
	 * Creates a new event source allowing you to catch specific game
	 * situations and pass them to a server as events.
	 * @param eventName A unique name for the event being created.
	 * @param functionBody Body of the function that will be used to initialize event
	 * source on client.
	 */
	makeEventSource(eventName: string, functionBody: string): void;

	/**
	 * Clears added properties and event sources.
	 */
	clear(): void;

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

	registerPapyrusFunction(callType: 'method', className: string, functionName: string, f: PapyrusMethod): void;
	registerPapyrusFunction(callType: 'global', className: string, functionName: string, f: PapyrusGlobalFunction): void;

	callPapyrusFunction(
		callType: 'method',
		className: string,
		functionName: string,
		self: PapyrusObject,
		args: PapyrusValue[]
	): PapyrusValue;

	callPapyrusFunction(
		callType: 'global',
		className: string,
		functionName: string,
		self: null,
		args: PapyrusValue[]
	): PapyrusValue;

	onDeath?: (pcFormId: number, killer?: number) => void;
	onResurrect?: (actor: number) => void;

	onActivate?: (target: number, pcFormId: number) => void;
	[key: string]: unknown;

	getServerSettings(): Record<string, PapyrusValue>;
	readDataDirectory(): string[];
	readDataFile(path: string): string;
	writeDataFile(path: string, content: string): void;

	modules: IJSModule[];
	addJSModule: (module: IJSModule) => void;
	loadJSModule: (modulePath: string) => boolean;
	reloot: (formId: number) => void;
}
