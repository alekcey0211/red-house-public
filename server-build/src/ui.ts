import Koa from 'koa';
import serve from 'koa-static';
import Router from 'koa-router';
import { createServer } from 'http';
import { Settings } from './settings';
// import proxy from 'koa-proxy';
// import * as http from 'http';
// import Axios from 'axios';
// import { AddressInfo } from 'net';

// eslint-disable-next-line
const createApp = (getOriginPort: () => number) => {
	const app = new Koa();
	const router = new Router();
	router.get(new RegExp('/coc/.*'), (ctx: any) => ctx.throw(403));
	router.get(new RegExp('/localization/.*'), (ctx: any) => ctx.throw(403));
	router.get(new RegExp('/modules/.*'), (ctx: any) => ctx.throw(403));
	router.get(new RegExp('/scripts/.*'), (ctx: any) => ctx.throw(403));
	router.get(new RegExp('/strings/.*'), (ctx: any) => ctx.throw(403));
	router.get(new RegExp('/xelib/.*'), (ctx: any) => ctx.throw(403));
	router.get(new RegExp('/properties/.*'), (ctx: any) => ctx.throw(403));
	router.get(new RegExp('/server-options.json'), (ctx: any) => ctx.throw(403));
	app.use(router.routes()).use(router.allowedMethods());
	app.use(serve('data'));
	return app;
};

export const main = (): void => {
	const settings = Settings.get();

	// const devServerPort = 1234;

	const uiPort = settings.port === 7777 ? 3000 : settings.port + 1;

	const app = createApp(() => uiPort);
	console.log(`Server resources folder is listening on ${uiPort}`);
	const server = createServer(app.callback());
	server.listen(uiPort);

	// Axios({
	// 	method: 'get',
	// 	url: `http://localhost:${devServerPort}`,
	// })
	// 	.then(() => {
	// 		console.log(`UI dev server has been detected on port ${devServerPort}`);

	// 		const state = { port: 0 };

	// 		const appStatic = createApp(() => state.port);
	// 		const srv = http.createServer(appStatic.callback());
	// 		srv.listen(0, () => {
	// 			const { port } = srv.address() as AddressInfo;
	// 			state.port = port;
	// 			const appProxy = new Koa();
	// 			appProxy.use(
	// 				proxy({
	// 					host: `http://localhost:${devServerPort}`,
	// 					map: (path: string) => {
	// 						const resultPath = path.match(/^\/ui\/.*/)
	// 							? `http://localhost:${devServerPort}` + path.substr(3)
	// 							: `http://localhost:${port}` + path;
	// 						console.log(`proxy ${path} => ${resultPath}`);
	// 						return resultPath;
	// 					},
	// 				})
	// 			);
	// 			console.log(`Server resources folder is listening on ${uiPort}`);
	// 			http.createServer(appProxy.callback()).listen(uiPort);
	// 		});
	// 	})
	// 	.catch(() => {
	// 		const app = createApp(() => uiPort);
	// 		console.log(`Server resources folder is listening on ${uiPort}`);
	// 		const server = require('http').createServer(app.callback());
	// 		server.listen(uiPort);
	// 	});
};
