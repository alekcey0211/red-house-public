/* eslint-disable */
const { readdirSync, existsSync } = require('fs');
const Bundler = require('parcel-bundler');
const Path = require('path');
const args = require('node-args-parser')(process.argv);

// const serverModules = readdirSync(Path.join(__dirname, '../server', 'data', 'modules'), (err) => {
// 	console.error(err);
// });
// for (const module of serverModules) {
// 	unlinkSync(Path.join(__dirname, '../server', 'data', 'modules', module), (err) => {
// 		if (err) throw err;
// 	});
// }

const modules = readdirSync(Path.join(__dirname, 'modules'), (err) => {
	console.error(err);
});
(async () => {
	const isWatch = args.watch === 'true';
	for (let i = 0; i < modules.length; i++) {
		const module = modules[i];

		const options = {
			outDir: Path.join(__dirname, '../server', 'data', 'modules', module),
			watch: isWatch,
			cache: false,
			contentHash: false,
			minify: false,
			scopeHoist: false,
			target: 'node',
			bundleNodeModules: false,
			sourceMaps: false,
			detailedReport: false,
			autoInstall: true,
		};

		const jsPath = Path.join(__dirname, 'modules', module, 'index.js');
		const tsPath = Path.join(__dirname, 'modules', module, 'index.ts');

		const jsPathExists = existsSync(jsPath);
		const tsPathExists = existsSync(tsPath);
		if (!jsPathExists && !tsPathExists) continue;

		const bundler = new Bundler(jsPathExists ? jsPath : tsPath, options);
		const bundle = await bundler.bundle();
	}
	if (!isWatch) process.exit();
})();
