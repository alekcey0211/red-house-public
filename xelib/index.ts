import { wrapper as xelib } from 'xelib';
import * as fs from 'fs';
import * as util from 'util';
import * as path from 'path';
import { getCOBJ, getCookingCOBJ } from './cooking-COBJ';

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
// const readdir = util.promisify(fs.readdir);

function secondsToTime(secs: number) {
	var hours = Math.floor(secs / (60 * 60));
	var divisor_for_minutes = secs % (60 * 60);
	var minutes = Math.floor(divisor_for_minutes / 60);
	var divisor_for_seconds = divisor_for_minutes % 60;
	var seconds = Math.ceil(divisor_for_seconds);
	return minutes + ':' + seconds;
}

const serverPath = '../server';

(async () => {
	let start = Date.now();
	const file = serverPath + '/server-settings.json';
	const settings = JSON.parse(await readFile(file, 'utf8'));

	xelib.Initialize('./XEditLib.dll');
	xelib.SetGamePath(serverPath + '/');
	xelib.SetGameMode(xelib.gmSSE);
	console.log('Load plugins...');
	xelib.LoadPlugins(settings.loadOrder.join('\n'));

	await new Promise((reject) => {
		setInterval(() => {
			const status = xelib.GetLoaderStatus();
			if (status === 2) {
				reject(status);
			}
		}, 500);
	});
	console.log('Plugins loaded successfully');
	console.log(xelib.GetActivePlugins());

	console.log('<===============================================>');

	console.log('Find all COBJ record and write to file...');
	start = Date.now();
	await writeFile(
		path.join(serverPath, settings.dataDir, 'xelib', 'COBJ.json'),
		JSON.stringify(getCOBJ(), null, 2),
		'utf8'
	);
	console.log('Time elaplsed', secondsToTime(Date.now() - start));
	console.log('COBJ record written successfully');

	console.log('<===============================================>');

	console.log('Find all cooking COBJ record and write to file...');
	start = Date.now();
	await writeFile(
		path.join(serverPath, settings.dataDir, 'xelib', 'cooking-COBJ.json'),
		JSON.stringify(getCookingCOBJ(), null, 2),
		'utf8'
	);
	console.log('Time elaplsed', secondsToTime(Date.now() - start));
	console.log('cooking COBJ record written successfully');

	console.log('<===============================================>');

	console.log('Find all KYWD record and write to file...');
	start = Date.now();
	let kywds = {};
	xelib.GetRecords(0, 'KYWD').forEach((id) => {
		try {
			kywds = {
				...kywds,
				[xelib.GetValue(id, 'EDID')]: +('0x' + xelib.GetHexFormID(id)),
			};
		} catch (err) {
			console.log('Ошибка', id.toString(16));
		}
	});
	await writeFile(
		path.join(serverPath, settings.dataDir, 'xelib', 'KYWD.json'),
		JSON.stringify(kywds, null, 2),
		'utf8'
	);
	console.log('Time elaplsed', secondsToTime(Date.now() - start));
	console.log('KYWD record written successfully');

	process.exit();
})();
