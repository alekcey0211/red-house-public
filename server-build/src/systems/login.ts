/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Axios from 'axios';
import { System, Log, Content, SystemContext } from './system';
import { getMyPublicIp } from '../publicIp';

export class Login implements System {
	systemName = 'Login';

	private userProfileIds = new Array<undefined | number>();

	private myAddr?: string;

	constructor(
		private log: Log,
		private maxPlayers: number,
		private masterUrl: string | null,
		private serverPort: number,
		private ip: string,
		private local: boolean = false
	) {}

	private async getUserProfileId(session: string): Promise<any> {
		const a = await Axios.get(`${this.masterUrl}/api/servers/${this.myAddr}/sessions/${session}`).catch((err) => {
			console.error('error when get profile id');
		});

		return a;
	}

	async initAsync(ctx: SystemContext): Promise<void> {
		this.userProfileIds.length = this.maxPlayers;
		this.userProfileIds.fill(undefined);

		if (this.ip && this.ip !== 'null') this.myAddr = `${this.ip}:${this.serverPort}`;
		else this.myAddr = `${await getMyPublicIp()}:${this.serverPort}`;
		this.log(`Login system assumed that ${this.myAddr} is our address on master`);
	}

	disconnect(userId: number): void {
		this.userProfileIds[userId] = undefined;
	}

	customPacket(userId: number, type: string, content: Content, ctx: SystemContext): void {
		if (type !== 'loginWithSkympIo') return;

		if (this.local) {
			const fakeId = userId + 20;

			ctx.gm.emit('spawnAllowed', userId, fakeId);
			this.log(`${userId} logged as ${fakeId}`);

			return;
		}

		const gameData = content.gameData;
		if (!gameData?.session) {
			this.log('No credentials found in gameData:', gameData);
			return;
		}
		this.getUserProfileId(gameData.session).then((res) => {
			if (!res?.data?.user?.id) {
				this.log('Bad master answer');
				return;
			}
			console.log('getUserProfileId', res.data);
			this.userProfileIds[userId] = res.data.user.id;
			ctx.gm.emit('spawnAllowed', userId, res.data.user.id);
			this.log(`Logged as ${res.data.user.id}`);
		});
	}
}
