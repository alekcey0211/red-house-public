import { throwOrInit } from '.';
import { serverOptionProvider } from '../..';
import { Mp } from '../types/mp';
import { FunctionInfo } from '../utils/functionInfo';
import { sendPlayerPos } from './empty-functions';

export const register = (mp: Mp): void => {
	mp.makeEventSource('_empty01', new FunctionInfo(sendPlayerPos).body);

	if (mp.timer) {
		clearTimeout(mp.timer as number);
	}
	const serverOptions = serverOptionProvider.getServerOptions();

	if (serverOptions.enableInterval) {
		const interval = () => {
			mp.timer = setTimeout(() => {
				mp.get(0, 'onlinePlayers').forEach((id) => {
					const neighbors = mp.get(id, 'neighbors').filter((n) => mp.get(n, 'type') === 'MpActor');

					// if (serverOptions.showNickname) {
					// 	showNick(mp, id, neighbors);
					// }

					neighbors.forEach((n) => {
						if (!mp.get(n, 'spawnTimeToRespawn')) return;
						throwOrInit(mp, n, serverOptions);
					});
				});
				interval();
			}, 200);
		};
		interval();
	}
};
