import { SkympClient } from './skympClient';
import { blockConsole } from './console';
import * as browser from './browser';
import * as loadGameManager from './loadGameManager';
import { Game, Utility, on, once, GlobalVariable, Weather } from 'skyrimPlatform';
import { verifyVersion } from './version';
import { updateWc } from './worldCleaner';

new SkympClient();

const enforceLimitations = () => {
	Game.setInChargen(true, true, false);
};

once('update', enforceLimitations);
loadGameManager.addLoadGameListener(enforceLimitations);

once('update', () => {
	Utility.setINIBool('bAlwaysActive:General', true);
});
on('update', () => {
	Utility.setINIInt('iDifficulty:GamePlay', 5);
	Game.enableFastTravel(false);
});

browser.main();
blockConsole();

once('update', verifyVersion);

on('update', () => updateWc());

let lastTimeUpd = 0;
on('update', () => {
	if (Date.now() - lastTimeUpd <= 2000) return;
	lastTimeUpd = Date.now();

	// Also update weather to be always clear
	const w = Weather.findWeather(0);
	if (w) w.setActive(false, false);

	const gameHourId = 0x38;
	const gameHour = GlobalVariable.from(Game.getFormEx(gameHourId)) as GlobalVariable;
	const gameDayId = 0x37;
	const gameDay = GlobalVariable.from(Game.getFormEx(gameDayId)) as GlobalVariable;
	const gameMonthId = 0x36;
	const gameMonth = GlobalVariable.from(Game.getFormEx(gameMonthId)) as GlobalVariable;
	const gameYearId = 0x35;
	const gameYear = GlobalVariable.from(Game.getFormEx(gameYearId)) as GlobalVariable;
	const timeScaleId = 0x3a;
	const timeScale = GlobalVariable.from(Game.getFormEx(timeScaleId)) as GlobalVariable;

	const d = new Date();
	const hour = d.getUTCHours();
	const mm = d.getUTCMinutes() / 60;
	const ss = d.getUTCSeconds() / 60 / 60;
	const mss = d.getUTCMilliseconds() / 60 / 60 / 1000;

	gameHour.setValue(hour + mm + ss + mss);

	gameDay.setValue(d.getUTCDate());
	gameMonth.setValue(d.getUTCMonth());
	gameYear.setValue(d.getUTCFullYear() - 2020 + 199);
	timeScale.setValue(1);
});

// let riftenUnlocked = false;
// on("update", () => {
//   if (riftenUnlocked) return;
//   const refr = ObjectReference.from(Game.getFormEx(0x42284));
//   if (!refr) return;
//   refr.lock(false, false);
//   riftenUnlocked = true;
// });

// const n = 10;
// let k = 0;
// let zeroKMoment = 0;
// let lastFps = 0;
// on("update", () => {
//   ++k;
//   if (k == n) {
//     k = 0;
//     if (zeroKMoment) {
//       const timePassed = (Date.now() - zeroKMoment) * 0.001;
//       const fps = Math.round(n / timePassed);
//       if (lastFps != fps) {
//         lastFps = fps;
//         //printConsole(`Current FPS is ${fps}`);
//       }
//     }
//     zeroKMoment = Date.now();
//   }
// });
