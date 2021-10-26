/* eslint-disable no-dupe-class-members */
/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
let scampNativeNode;

import * as fs from 'fs';

const skympNativeNodeFileName = 'scamp_native.node';

if (fs.existsSync(`${process.cwd()}/${skympNativeNodeFileName}`)) {
	console.log(`Using ${skympNativeNodeFileName} from server's dir`);
	scampNativeNode = require(`${process.cwd()}/${skympNativeNodeFileName}`);
} else {
	const config = !process.env.NODE_ENV || process.env.NODE_ENV === 'development' ? 'Debug' : 'Release';
	console.log(`Using scamp_native config ${config}`);
	scampNativeNode = require(`../build/${config}/${skympNativeNodeFileName}`);
}

export declare interface Bot {
	destroy(): void;
	send(msg: Record<string, unknown>): void;
}

export type SendChatMessageFn = (formId: number, message: Record<string, unknown>) => void;

export declare class ScampServer {
	constructor(serverPort: number, maxPlayers: number);

	on(event: 'connect', handler: (userId: number) => void): void;

	on(event: 'disconnect', handler: (userId: number) => void): void;

	on(event: 'customPacket', handler: (userId: number, content: string) => void): void;

	attachSaveStorage(): void;

	tick(): void;

	createActor(formId: number, pos: number[], angleZ: number, cellOrWorld: number): number;

	destroyActor(formId: number): void;

	setUserActor(userId: number, actorFormId: number): void;

	getUserActor(userId: number): number;

	getActorName(actorId: number): string;

	getActorPos(actorId: number): number[];

	getActorCellOrWorld(actorId: number): number;

	setRaceMenuOpen(formId: number, open: boolean): void;

	sendCustomPacket(userId: number, jsonContent: string): void;

	setEnabled(actorId: number, enabled: boolean): void;

	getActorsByProfileId(profileId: number): number[];

	createBot(): Bot;

	getUserByActor(formId: number): number;

	// getMpApi(): Record<string, unknown>;
	executeJavaScriptOnChakra(src: string): void;

	setSendUiMessageImplementation(fn: SendChatMessageFn): void;

	onUiEvent(formId: number, msg: Record<string, unknown>): void;

	clear(): void;
}

module.exports.ScampServer = scampNativeNode.ScampServer;
