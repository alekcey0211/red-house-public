import { wrapper as xelib } from 'xelib';
import * as fs from 'fs';
import * as util from 'util';
import * as path from 'path';
import { getCOBJ, getCookingCOBJ } from './cooking-COBJ';
import { getCocCoord } from './coc';

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const readdir = util.promisify(fs.readdir);

function secondsToTime(secs: number) {
	const hours = Math.floor(secs / (60 * 60));
	const divisor_for_minutes = secs % (60 * 60);
	const minutes = Math.floor(divisor_for_minutes / 60);
	const divisor_for_seconds = divisor_for_minutes % 60;
	const seconds = Math.ceil(divisor_for_seconds);
	return `${minutes}:${seconds}`;
}

(async () => {
	let start = Date.now();
	const file = './server/server-settings.json';
	const settings = JSON.parse(await readFile(file, 'utf8'));

	xelib.Initialize('./xelib/XEditLib.dll');
	xelib.SetGamePath('./server/');
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
	console.log(xelib.GetMessages());

	console.log('<===============================================>');

	console.log('Build references...');
	start = Date.now();
	xelib.BuildReferences(0, true);
	console.log('Time elaplsed', secondsToTime(Date.now() - start));
	console.log('References build successfully');

	console.log('<===============================================>');

	console.log('Find all COBJ record and write to file...');
	start = Date.now();
	await writeFile(
		path.join('server', settings.dataDir, 'xelib', 'COBJ.json'),
		JSON.stringify(getCOBJ(), null, 2),
		'utf8'
	);
	console.log('Time elaplsed', secondsToTime(Date.now() - start));
	console.log('COBJ record written successfully');

	console.log('<===============================================>');

	console.log('Find all cooking COBJ record and write to file...');
	start = Date.now();
	await writeFile(
		path.join('server', settings.dataDir, 'xelib', 'cooking-COBJ.json'),
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
				[xelib.GetValue(id, 'EDID')]: +`0x${xelib.GetHexFormID(id)}`,
			};
		} catch (err) {
			console.log('Ошибка', id.toString(16));
		}
	});
	await writeFile(path.join('server', settings.dataDir, 'xelib', 'KYWD.json'), JSON.stringify(kywds, null, 2), 'utf8');
	console.log('Time elaplsed', secondsToTime(Date.now() - start));
	console.log('KYWD record written successfully');

	console.log('<===============================================>');

	console.log('Start load COC Markers...');
	start = Date.now();
	const el = xelib.GetRecord(0, 0x32);
	// const cocs = xelib.GetReferencedBy(el);
	const cocsHex = xelib.GetReferencedBy(el).map((x) => +`0x${xelib.GetHexFormID(x)}`);
	let cells = {};
	cocsHex.forEach((id) => {
		try {
			cells = { ...cells, ...getCocCoord(id) };
		} catch (err) {
			console.log('Ошибка', id.toString(16));
		}
	});
	const cocJsonPath = path.join('server', settings.dataDir, 'xelib', 'coc-markers.json');
	await writeFile(cocJsonPath, JSON.stringify(cells, null, 2), 'utf8');
	console.log('Time elaplsed', secondsToTime(Date.now() - start));
	console.log('COC Markers loaded successfully');

	process.exit();
})();
