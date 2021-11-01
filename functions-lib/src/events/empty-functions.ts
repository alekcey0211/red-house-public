import { getForm } from '../papyrus/game';
import { getDisplayName } from '../papyrus/objectReference';
import { evalClient } from '../properties/eval';
import { Ctx } from '../types/ctx';
import { Mp } from '../types/mp';
import { FunctionInfo } from '../utils/functionInfo';

export const sendPlayerPos = (ctx: Ctx): void => {
	ctx.sp.on('update', () => {
		const player = ctx.sp.Game.getPlayer();
		if (!player) return;

		const [x, y, z] = [player.getPositionX(), player.getPositionY(), player.getPositionZ()];
		const [xF, yF, zF] = [x.toFixed(), y.toFixed(), z.toFixed()];

		if (xF === ctx.state.lastPosX && yF === ctx.state.lastPosY && zF === ctx.state.lastPosZ) return;

		const src = [];
		src.push(`window.playerPos = ${JSON.stringify([x, y, z])}`);

		try {
			ctx.sp.browser.executeJavaScript(src.join('\n'));
			// eslint-disable-next-line no-empty
		} catch (error) {}

		ctx.state.lastPosX = xF;
		ctx.state.lastPosY = yF;
		ctx.state.lastPosZ = zF;
	});
};

// ! Не использовал, потому что координаты не совпадают с реальными.
// ! Переписал на сервере и там координаты корректные
export const showNicknames = (ctx: Ctx): void => {
	ctx.sp.on('update', () => {
		const ac1 = ctx.sp.Actor.from(ctx.sp.Game.getFormEx(85837870));
		if (!ac1) return;
		const [x, y, z] = [ac1.getPositionX(), ac1.getPositionY(), ac1.getPositionZ()];
		const [[x1, y1, z1]] = ctx.sp.worldPointToScreenPoint([x, y, z]);
		const [xF, yF, zF] = [x1.toFixed(4), y1.toFixed(4), z1.toFixed(4)];

		if (xF === ctx.state.lastScreenPosX && yF === ctx.state.lastScreenPosY) return;

		ctx.sp.printConsole(x, y, z);
		ctx.sp.printConsole(x1, y1, z1);
		ctx.sp.printConsole(xF, yF, zF);
		ctx.sp.printConsole({
			text: ac1.getDisplayName(),
			posX: x1 * 100,
			posY: y1 * 100,
		});
		const nick = [
			{
				text: ac1.getDisplayName(),
				posX: x1 < 0 ? 0 : (x1 + 0) * 100,
				posY: y1 < 0 ? 0 : y1 * 100,
			},
		];

		const src: string[] = [];
		src.push(`
      window.storage.dispatch({
        type: 'COMMAND',
        data: {
          commandType: 'NICKNAMES_UPDATE',
          alter: ['${JSON.stringify(nick)}']
        }
      })
    `);

		try {
			ctx.sp.browser.executeJavaScript(src.join('\n'));
			// eslint-disable-next-line no-empty
		} catch (error) {}

		ctx.state.lastScreenPosX = xF;
		ctx.state.lastScreenPosY = yF;
	});
};

export const showNick = (mp: Mp, playerId: number, neighbors: number[]): void => {
	const func2 = (ctx: Ctx, itemsString: string) => {
		(() => {
			try {
				const items: { pos: number[]; text: string }[] = JSON.parse(itemsString);
				const nicks = items
					.map((i) => {
						const [[x, y, z]] = ctx.sp.worldPointToScreenPoint(i.pos);
						const ratio = (1 - z) * 20;
						return {
							text: i.text,
							posX: x * 100,
							posY: y * 100,
							posZ: z * 100,
							ratio,
						};
					})
					.filter(
						(x) =>
							x.posX >= 0 &&
							x.posX <= 100 &&
							x.posY >= 0 &&
							x.posY <= 100 &&
							x.posZ >= 0 &&
							x.posZ <= 100 &&
							x.ratio >= 0.25 &&
							x.ratio <= 0.9
					);

				const src: string[] = [];
				src.push(`
        window.storage.dispatch({
          type: 'COMMAND',
          data: {
            commandType: 'NICKNAMES_UPDATE',
            alter: ['${JSON.stringify(nicks)}']
          }
        })
        `);
				ctx.sp.browser.executeJavaScript(src.join('\n'));
			} catch (err) {
				ctx.sp.printConsole('error', err);
			}
		})();
	};

	const items = neighbors
		.filter((n) => mp.get(n, 'worldOrCellDesc') !== '0')
		.map((n) => {
			const pos = mp.get(n, 'pos');
			const nForm = getForm(mp, null, [n]);
			const text = nForm && getDisplayName(mp, nForm);
			return { pos, text };
		});
	evalClient(mp, playerId, new FunctionInfo(func2).getText({ itemsString: JSON.stringify(items) }), false, true);
};

// export const sendHp = (ctx: Ctx) => {
// 	ctx.sp.on('update', () => {
// 		const player = ctx.sp.Game.getPlayer();
// 		if (!player) return;

// 		const id = player.getFormID();
// 		const hp = player.getActorValue('Health');

// 		const data = [
// 			{
// 				id: id,
// 				health: hp,
// 			},
// 		];

// 		let obj: string[] = [];

// 		obj.push(`
//     window.storage.dispatch({
//       type: 'COMMAND',
//       data: {
//         commandType: 'PARTY_UPDATE_PLAYER',
//         alter: ['${JSON.stringify(data)}']
//       }
//     })
//   `);

// 		try {
// 			ctx.sp.browser.executeJavaScript(obj.join('\n'));
// 		} catch (error) {}
// 	});
// };
