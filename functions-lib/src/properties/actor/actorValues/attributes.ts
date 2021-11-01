import { statePropFactory } from '../../../papyrus/multiplayer/functions';
import { Mp } from '../../../types/mp';
import { updateAttributeCommon, updateAttributeSimple } from './attributes-func';

export type Mult = 'speedmult' | 'weaponspeedmult';

export type Attr = 'health' | 'magicka' | 'stamina';

export type AttrUppercase = 'Health' | 'Magicka' | 'Stamina';

export type AttrRate = 'healrate' | 'magickarate' | 'staminarate';

export type AttrRateMult = 'healratemult' | 'magickaratemult' | 'staminaratemult';

export type AttrDrain = 'mp_healthdrain' | 'mp_magickadrain' | 'mp_staminadrain';

export type AttrRelated = 'healthNumChanges' | 'magickaNumChanges' | 'staminaNumChanges';

export type AttrAll = Attr | AttrRate | AttrRateMult | AttrDrain;

export type Modifier = 'base' | 'permanent' | 'temporary' | 'damage';

export type Skill =
	| 'oneHanded'
	| 'twoHanded'
	| 'marksman'
	| 'block'
	| 'smithing'
	| 'heavyArmor'
	| 'lightArmor'
	| 'pickpocket'
	| 'lockpicking'
	| 'sneak'
	| 'alchemy'
	| 'speechcraft'
	| 'alteration'
	| 'conjuration'
	| 'destruction'
	| 'illusion'
	| 'restoration'
	| 'enchanting';

export type ModifierValue = {
	[name in Modifier]?: number;
};

export interface SecondsMatched {
	[key: number]: number;
}

export interface DefaultOptions {
	force: boolean;
}

export interface ActorValues {
	/**
	 * set value of parameter
	 * @param formId actor id
	 * @param avName parameter name
	 * @param modifierName modification name
	 * @param newValue new value of parameter
	 */
	set: (formId: number, avName: AttrAll, modifierName: Modifier, newValue: any) => void;

	/**
	 * get value of parameter
	 * @param formId actor id
	 * @param avName parameter name
	 * @param modifierName modification name
	 */
	get: (formId: number, avName: AttrAll, modifierName: Modifier) => number;

	/**
	 * get maximum value of parameter
	 * @param formId actor id
	 * @param avName parameter name
	 */
	getMaximum: (formId: number, avName: Attr) => number;

	/**
	 * get current value of parameter
	 * @param formId actor id
	 * @param avName parameter name
	 */
	getCurrent: (formId: number, avName: Attr) => number;

	/**
	 * ???
	 * @param formId actor id
	 * @param avName parameter name
	 */
	flushRegen: (formId: number, avName: Attr) => void;

	/**
	 * Set default parametrs of Actor
	 * @param formId actor id
	 * @param options options
	 */
	setDefaults: (formId: number, options?: DefaultOptions, base?: Partial<Record<AttrAll | Skill, number>>) => void;
}
export interface AvOps {
	parent?: AvOps;
	set: (formId: number, avName: AttrAll, modifierName: Modifier, newValue: any) => void;
	get: (formId: number, avName: AttrAll, modifierName: Modifier) => number;
	applyRegenerationToParent?: (formId: number) => void;
	secondsMatched?: SecondsMatched;
	getSecondsMatched?: (formId: number) => number;
	setSecondsMatched?: (formId: number, secondsMatched: any) => void;
	multiplyDamage?: (formId: number, avName: AttrAll, k: number) => void;
}

const avs: AttrAll[] = [
	'healrate',
	'healratemult',
	'staminarate',
	'staminaratemult',
	'magickarate',
	'magickaratemult',
	'mp_healthdrain',
	'mp_magickadrain',
	'mp_staminadrain',
];
const relatedPropNames: AttrRelated[] = ['healthNumChanges', 'magickaNumChanges', 'staminaNumChanges'];

const getAvMaximum = (avOps: AvOps, formId: number, avName: AttrAll) => {
	let sum = 0;
	(['base', 'permanent', 'temporary'] as Modifier[]).forEach((modifierName) => {
		sum += avOps.get(formId, avName, modifierName);
	});

	return sum;
};

const getAvCurrent = (avOps: AvOps, formId: number, avName: AttrAll) => {
	let res = getAvMaximum(avOps, formId, avName);
	res += avOps.get(formId, avName, 'damage');
	return res;
};

// Regen
const regen = (
	avOps: AvOps,
	avNameTarget: Attr,
	avNameRate: AttrRate,
	avNameRateMult: AttrRateMult,
	avNameDrain: AttrDrain
): AvOps => {
	return {
		parent: avOps,
		set(formId: number, avName: AttrAll, modifierName: Modifier, newValue: any) {
			let dangerousAvNames = [avNameTarget, avNameRate, avNameRateMult, avNameDrain];
			dangerousAvNames = dangerousAvNames.map((x) => x.toLowerCase() as AttrAll);
			if (dangerousAvNames.indexOf(avName.toLowerCase() as AttrAll) !== -1 && this.applyRegenerationToParent) {
				this.applyRegenerationToParent(formId);
			}
			this.parent?.set(formId, avName, modifierName, newValue);
		},
		get(formId: number, avName: AttrAll, modifierName: Modifier) {
			if (!this.parent || !this.getSecondsMatched) {
				return 0;
			}

			const drain = getAvCurrent(this.parent, formId, avNameDrain);
			const realValue = this.parent.get(formId, avName, modifierName);
			if (avName.toLowerCase() === avNameTarget.toLowerCase()) {
				if (modifierName === 'damage') {
					const avMax = getAvMaximum(this.parent, formId, avName);
					const regenDuration = timeSource.getSecondsPassed() - this.getSecondsMatched(formId);
					const rate = getAvCurrent(this.parent, formId, avNameRate);
					const rateMult = getAvCurrent(this.parent, formId, avNameRateMult);
					let damageMod = realValue;
					if (drain) {
						damageMod += regenDuration * drain;
					} else {
						damageMod += regenDuration * rate * rateMult * 0.01 * avMax * 0.01;
					}
					return Math.min(0, damageMod);
				}
			}
			return realValue;
		},
		getSecondsMatched(formId: number) {
			return (this.secondsMatched && this.secondsMatched[formId]) || 0;
		},
		setSecondsMatched(formId: number, secondsMatched: any) {
			if (!this.secondsMatched) {
				this.secondsMatched = {};
			}
			this.secondsMatched[formId] = secondsMatched;
		},
		applyRegenerationToParent(formId: number) {
			// ? Не уверен в проверке !this.getSecondsMatched
			if (!this.parent || !this.setSecondsMatched) {
				return 0;
			}

			const damageAfterRegen = this.get(formId, avNameTarget, 'damage');
			this.parent.set(formId, avNameTarget, 'damage', damageAfterRegen);
			this.setSecondsMatched(formId, timeSource.getSecondsPassed());
		},
	};
};

const timeSource = {
	startMoment: Date.now(),
	getSecondsPassed(): number {
		if (!this.startMoment) {
			this.startMoment = Date.now();
		}
		return (+Date.now() - +this.startMoment) / 1000.0;
	},
};

// eslint-disable-next-line import/no-mutable-exports
export let actorValues: ActorValues;

export const register = (mp: Mp): void => {
	(['health', 'magicka', 'stamina'] as Attr[]).forEach((attr) => {
		mp.makeProperty(`av_${attr}`, {
			isVisibleByOwner: true,
			isVisibleByNeighbors: attr === 'health',
			updateNeighbor: updateAttributeCommon(attr, false),
			updateOwner: updateAttributeCommon(attr, true),
		});
	});
	(
		[
			'oneHanded',
			'twoHanded',
			'marksman',
			'block',
			'smithing',
			'heavyArmor',
			'lightArmor',
			'pickpocket',
			'lockpicking',
			'sneak',
			'alchemy',
			'speechcraft',
			'alteration',
			'conjuration',
			'destruction',
			'illusion',
			'restoration',
			'enchanting',
		] as Skill[]
	).forEach((attr) => {
		mp.makeProperty(`av_${attr}`, {
			isVisibleByOwner: true,
			isVisibleByNeighbors: false,
			updateNeighbor: updateAttributeSimple(attr),
			updateOwner: updateAttributeSimple(attr),
		});
	});

	avs.forEach((avName) => {
		statePropFactory(mp, `av_${avName}`, true);
	});

	relatedPropNames.forEach((propName) => {
		statePropFactory(mp, propName, true);
	});

	(['speedmult', 'weaponspeedmult'] as Mult[]).forEach((mult) => {
		mp.makeProperty(`av_${mult}`, {
			isVisibleByOwner: true,
			isVisibleByNeighbors: true,
			updateOwner: updateAttributeSimple(mult),
			updateNeighbor: updateAttributeSimple(mult),
		});
	});

	// Basic
	let avOps: AvOps = {
		set(formId: number, avName: AttrAll, modifierName: Modifier, newValue: number) {
			const propName = `av_${avName.toLowerCase()}`;
			const value = mp.get<ModifierValue>(formId, propName);
			if (!value) return;
			value[modifierName] = newValue;
			mp.set(formId, propName, value);
			if (['health', 'magicka', 'stamina'].indexOf(avName.toLowerCase()) !== -1) {
				const propName = `${avName.toLowerCase()}NumChanges`;
				const numChanges = mp.get<number>(formId, propName) ?? 0;
				mp.set(formId, propName, 1 + numChanges);
			}
		},
		get(formId: number, avName: AttrAll, modifierName: Modifier) {
			const propName = `av_${avName.toLowerCase()}`;
			const propValue = mp.get<ModifierValue>(formId, propName);
			if (propValue === undefined) {
				const s = `[av] '${propName}' was undefined for ${formId.toString(16)}`;
				throw new Error(s);
			}
			return propValue[modifierName] || 0;
		},
	};

	// Damage limit
	avOps = {
		parent: avOps,
		set(formId: number, avName: AttrAll, modifierName: Modifier, newValue: number) {
			if (!this.parent) {
				return;
			}

			if (modifierName === 'damage') {
				if (newValue > 0) {
					newValue = 0;
				} else if (newValue < -getAvMaximum(this.parent, formId, avName)) {
					newValue = -getAvMaximum(this.parent, formId, avName);
				}
			}
			this.parent.set(formId, avName, modifierName, newValue);
		},
		get(formId: number, avName: AttrAll, modifierName: Modifier) {
			if (!this.parent) {
				return 0;
			}
			return this.parent.get(formId, avName, modifierName);
		},
	};

	avOps = regen(avOps, 'health', 'healrate', 'healratemult', 'mp_healthdrain');
	avOps = regen(avOps, 'magicka', 'magickarate', 'magickaratemult', 'mp_magickadrain');
	avOps = regen(avOps, 'stamina', 'staminarate', 'staminaratemult', 'mp_staminadrain');

	// Scaling
	avOps = {
		parent: avOps,
		set(formId: number, avName: AttrAll, modifierName: Modifier, newValue: any) {
			if (!this.parent) {
				return;
			}

			const oldMaximum: number = getAvMaximum(this.parent, formId, avName);
			const newMaximum: number = getAvMaximum(this.parent, formId, avName);

			this.parent.set(formId, avName, modifierName, newValue);

			const k = newMaximum / oldMaximum;
			if (Number.isFinite(k) && k !== 1 && this.multiplyDamage) {
				this.multiplyDamage(formId, avName, k);
			}
		},
		get(formId: number, avName: AttrAll, modifierName: Modifier) {
			// ? Не уверен в проверке !this.getSecondsMatched
			if (!this.parent) {
				return 0;
			}
			return this.parent.get(formId, avName, modifierName);
		},
		multiplyDamage(formId: number, avName: AttrAll, k: number) {
			if (!this.parent) {
				return;
			}
			const previousDamage: number = this.parent.get(formId, avName, 'damage');
			this.parent.set(formId, avName, 'damage', previousDamage * k);
		},
	};

	actorValues = {
		set: (formId: number, avName: AttrAll, modifierName: Modifier, newValue: any) =>
			avOps.set(formId, avName, modifierName, newValue),
		get: (formId: number, avName: AttrAll, modifierName: Modifier) => avOps.get(formId, avName, modifierName),
		getMaximum: (formId: number, avName: Attr) => getAvMaximum(avOps, formId, avName),
		getCurrent: (formId: number, avName: Attr) => getAvCurrent(avOps, formId, avName),
		flushRegen: (formId: number, avName: Attr) => {
			const damageModAfterRegen = avOps.get(formId, avName, 'damage');
			avOps.set(formId, avName, 'damage', damageModAfterRegen);
		},
		setDefaults: (
			formId: number,
			options?: DefaultOptions,
			base: Partial<Record<AttrAll | Mult | Skill, number>> = {}
		) => {
			console.log('[sync] setDefaults', formId.toString(16), base);
			const force = !!options?.force;
			if (mp.get(formId, 'type') === 'MpActor') {
				if (mp.get(formId, 'isDead') === undefined || force) {
					mp.set(formId, 'isDead', false);
				}

				(['health', 'magicka', 'stamina'] as Attr[]).forEach((avName) => {
					if (!mp.get(formId, `av_${avName}`) || force) {
						mp.set(formId, `av_${avName}`, { base: base[avName] ?? 100 });
					}
				});

				(['healrate', 'magickarate', 'staminarate'] as AttrRate[]).forEach((avName) => {
					if (!mp.get(formId, `av_${avName}`) || force) {
						mp.set(formId, `av_${avName}`, { base: base[avName] ?? 5 });
					}
				});

				(['healratemult', 'magickaratemult', 'staminaratemult'] as AttrRateMult[]).forEach((avName) => {
					if (!mp.get(formId, `av_${avName}`) || force) {
						mp.set(formId, `av_${avName}`, { base: base[avName] ?? 100 });
					}
				});

				(['mp_healthdrain', 'mp_magickadrain', 'mp_staminadrain'] as AttrDrain[]).forEach((avName) => {
					if (!mp.get(formId, `av_${avName}`) || force) {
						mp.set(formId, `av_${avName}`, { base: base[avName] ?? 0 });
					}
				});

				if (!mp.get(formId, 'av_speedmult') || force) {
					mp.set(formId, 'av_speedmult', { base: base.speedmult ?? 100 });
				}
				if (!mp.get(formId, 'av_weaponspeedmult') || force) {
					mp.set(formId, 'av_weaponspeedmult', { base: base.weaponspeedmult ?? 1 });
				}

				(
					[
						'oneHanded',
						'twoHanded',
						'marksman',
						'block',
						'smithing',
						'heavyArmor',
						'lightArmor',
						'pickpocket',
						'lockpicking',
						'sneak',
						'alchemy',
						'speechcraft',
						'alteration',
						'conjuration',
						'destruction',
						'illusion',
						'restoration',
						'enchanting',
					] as Skill[]
				).forEach((avName) => {
					if (!mp.get(formId, `av_${avName}`) || force) {
						mp.set(formId, `av_${avName}`, { base: base[avName] ?? 100 });
					}
				});
			}
		},
	};
};
