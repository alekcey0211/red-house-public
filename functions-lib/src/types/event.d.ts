export interface HitEvent {
	target: number;
	agressor: number;
	// source: Form;
	// projectile: Projectile;
	isPowerAttack: boolean;
	isSneakAttack: boolean;
	isBashAttack: boolean;
	isHitBlocked: boolean;
}

export interface EffectStart {
	target: number;
	caster: number;
	effect: number;
	mag: number;
}

export interface CrosshairChange {
	crosshairRefId: number;
}
