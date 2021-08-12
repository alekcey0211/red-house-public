type EventEmitterFunction = <T = unknown>(data: T) => void;

export class EventEmitter {
	private events: Record<string, EventEmitterFunction[]>;

	constructor() {
		this.events = {};
	}

	emit(eventName: string, data: unknown) {
		const event = this.events[eventName];
		if (!event) return;

		event.forEach((fn: EventEmitterFunction) => {
			fn.call(null, data);
		});
	}

	subscribe(eventName: string, fn: EventEmitterFunction) {
		if (!this.events[eventName]) {
			this.events[eventName] = [];
		}

		this.events[eventName].push(fn);
		return () => {
			this.events[eventName] = this.events[eventName].filter((eventFn) => fn !== eventFn);
		};
	}
}
