import { EventEmitter } from 'events';
import { ServerInterface } from '../serverInterface';

export interface SystemContext {
	svr: ServerInterface;
	gm: EventEmitter;
}

export interface System {
	systemName: string;
	initAsync?: (ctx: SystemContext) => Promise<void>;
	updateAsync?: (ctx: SystemContext) => Promise<void>;
	connect?: (userId: number, ctx: SystemContext) => void;
	disconnect?: (userId: number, ctx: SystemContext) => void;
	customPacket?: (userId: number, type: string, content: Content, ctx: SystemContext) => void;
}

export type Content = Record<string, any>;
export type Log = (...args: any) => void;
