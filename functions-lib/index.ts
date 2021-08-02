import { Mp, PapyrusGlobalFunction, PapyrusMethod } from './src/types/mp';

declare const mp: Mp;

const log = console.log;
// console.log = (...data: any[]) => {
// 	log('[GM]', '\x1b[32m', data, '\x1b[0m');
// };
console.debug = (...data: any[]) => {
	log('[DEBUG]', '\x1b[36m', ...data, '\x1b[0m');
};
console.error = (...data: any[]) => {
	log('[ERROR]', '\x1b[31m', ...data, '\x1b[0m');
};

console.log('gamemode.js starts...');

const register = mp.registerPapyrusFunction;
mp.registerPapyrusFunction = (
	callType: 'method' | 'global',
	className: string,
	functionName: string,
	f: PapyrusMethod | PapyrusGlobalFunction
): void => {
	const diff = 2;
	if (callType === 'method') {
		register(callType, className, functionName, (self, args) => {
			const start = Date.now();
			const result = (f as PapyrusMethod)(self, args);
			if (Date.now() - start > diff) {
				console.log(`PapyrusFunction ${className}.${functionName}: `, Date.now() - start);
			}

			return result;
		});
	} else if (callType === 'global') {
		register(callType, className, functionName, (self, args) => {
			const start = Date.now();
			const result = (f as PapyrusGlobalFunction)(self, args);
			if (Date.now() - start > diff) {
				console.log(`PapyrusFunction ${className}.${functionName}: `, Date.now() - start);
			}
			return result;
		});
	}
};

// import * as fs from 'fs';
// import * as path from 'path';
// mp.getServerSettings = (): Record<string, any> => {
//   if (!mp.serverSettings) {
//     const content = fs.readFileSync('server-settings.json', { encoding: 'utf-8' });
//     mp.serverSettings = JSON.parse(content);
//   }
//   return mp.serverSettings as Record<string, any>;
// };
// mp.readDataDirectory = (): string[] => {
//   const { dataDir } = mp.getServerSettings();
//   return fs.readdirSync(dataDir);
// };
// mp.readDataFile = (filePath: string): string => {
//   const { dataDir } = mp.getServerSettings();
//   const readPath = path.join(dataDir, filePath);
//   const content = fs.readFileSync(readPath, { encoding: 'utf-8' });
//   return content;
// };

import * as events from './src/events';
import * as synchronization from './src/synchronization';

import * as multiplayer from './src/papyrus/multiplayer';
import * as stringUtil from './src/papyrus/stringUtil';
import * as actor from './src/papyrus/actor';
import * as objectReference from './src/papyrus/objectReference';
import * as utility from './src/papyrus/utility';
import * as game from './src/papyrus/game';
import * as debug from './src/papyrus/debug';
import * as form from './src/papyrus/form';
import * as actorValueInfo from './src/papyrus/actorValueInfo';
import * as weapon from './src/papyrus/weapon';
import * as globalVariable from './src/papyrus/globalVariable';
import * as constructibleObject from './src/papyrus/constructibleObject';
import * as activeMagicEffect from './src/papyrus/activeMagicEffect';
import * as potion from './src/papyrus/potion';
import * as perk from './src/papyrus/perk';
import * as keyword from './src/papyrus/keyword';
import * as cell from './src/papyrus/cell';
import * as math from './src/papyrus/math';
import * as magicEffect from './src/papyrus/magicEffect';
import * as effectShader from './src/papyrus/effectShader';
import * as visualEffect from './src/papyrus/visualEffect';

import * as perkProp from './src/properties/perks';
import * as evalProp from './src/properties/eval';
import * as browserProp from './src/properties/browser';
import * as activatorProp from './src/properties/activator';
import * as actorProp from './src/properties/actor';
import * as inputProp from './src/properties/input';
import * as objectReferenceProp from './src/properties/objectReference';
import * as spawnProp from './src/properties/spawn';
import * as animProp from './src/properties/anim';

import { LocalizationProvider } from './src/utils/localizationProvider';
import { StringLocalizationProvider } from './src/utils/stringLocalizationProvider';
import { ServerOptionProvider } from './src/papyrus/game/server-options';

const config = mp.getServerSettings();
const locale = config.locale;
const data = config.dataDir;
const isPapyrusHotReloadEnabled = config.isPapyrusHotReloadEnabled;
const isServerOptionsHotReloadEnabled = config.isServerOptionsHotReloadEnabled;
const stringsPath = config.stringsPath ?? 'strings';
const gamemodePath = config.gamemodePath ?? 'gamemode.js';

const localizationProvider = new LocalizationProvider(
	mp,
	'localization/' + locale + '.json',
	isPapyrusHotReloadEnabled ? 'hotreload' : 'once'
);

const stringLocalizationProvider = new StringLocalizationProvider(
	mp,
	mp.readDataFile('localization/' + locale + '.json'),
	locale
);

export const serverOptionProvider = new ServerOptionProvider(mp, isServerOptionsHotReloadEnabled);

// TODO: clear?
mp.clear();

perkProp.register(mp);
evalProp.register(mp);
actorProp.register(mp);
browserProp.register(mp);
objectReferenceProp.register(mp);
inputProp.register(mp);
activatorProp.register(mp);
spawnProp.register(mp);
animProp.register(mp);

events.register(mp);
synchronization.register(mp);

form.register(mp, stringLocalizationProvider);
multiplayer.register(mp, localizationProvider);
stringUtil.register(mp);
actor.register(mp);
actorValueInfo.register(mp);
objectReference.register(mp);
utility.register(mp);
game.register(mp, serverOptionProvider);
debug.register(mp);
weapon.register(mp);
globalVariable.register(mp);
constructibleObject.register(mp);
activeMagicEffect.register(mp);
potion.register(mp);
perk.register(mp);
keyword.register(mp);
cell.register(mp);
math.register(mp);
magicEffect.register(mp);
effectShader.register(mp);
visualEffect.register(mp);

setTimeout(() => {
	mp.callPapyrusFunction('global', 'GM_Main', '_OnPapyrusRegister', null, []);
}, 0);
