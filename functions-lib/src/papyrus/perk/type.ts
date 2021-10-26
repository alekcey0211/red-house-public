/**
 * EqualTo = 0
 * NotEqualTo = 1
 * GreaterThan = 2
 * GreaterThanOrEqualTo = 3
 * LessThan = 4
 * LessThanOrEqualTo = 5
 */
export enum ConditionOperator {
	EqualTo,
	NotEqualTo,
	GreaterThan,
	GreaterThanOrEqualTo,
	LessThan,
	LessThanOrEqualTo,
}
/**
 * AND = 0x01
 * OR = 0x02
 */
export enum ConditionFlag {
	AND,
	OR,
}
/**
 * Subjec = 0
 * Targe = 1
 * Reference = 2
 * Combat = 3
 * Linked = 4
 * Quest = 5
 * Package = 6
 * Event = 7
 */
export enum ConditionRunOn {
	Subjec,
	Targe,
	Reference,
	Combat,
	Linked,
	Quest,
	Package,
	Event,
}

export enum EffectSection {
	Quest,
	Ability,
	Complex,
}

export enum EffectFunctionType {
	None,
	SetValue,
	AddValue,
	MultiplyValue,
	AddRangeToValue,
	AddActorValueMult,
	Absolute,
	NegativeABSValue,
	AddLevelList,
	AddActivateChoice,
	SelectSpell,
	SelectText,
	SetAVMult,
	MultiplyAVMult,
	Multiply1PlusAVMult,
	SetText,
}

export interface ConditionResult {
	flag: ConditionFlag;
	result: unknown;
}

export interface PerkEffectData {
	effectType: number;
	functionType: EffectFunctionType;
	conditionResult: boolean;
	effectValue: number;
	// conditionFields: EspmField[];
	conditionFunction?: (subjectId: number) => boolean;
}
