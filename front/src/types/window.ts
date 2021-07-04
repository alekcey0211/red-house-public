type EventName = 'open' | 'close' | 'message' | 'error';
export interface WindowSkymp {
	mp: {
		send: (type: string, data: any) => void;
	};
	skymp: {
		send: (message: any) => void;
		on: (event: EventName, handler: Function) => void;
	};
	storage: any;
	connection: WebSocket;
	// isWebsocketOpen: () => boolean;
}
