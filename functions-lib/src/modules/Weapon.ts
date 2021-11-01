import { WeaponType } from '../papyrus/weapon/type';
import { PapyrusObject } from '../types/mp';

export interface WeaponMethods {
	GetWeaponType: (self: PapyrusObject) => WeaponType | undefined;
	GetBaseDamage: (self: PapyrusObject) => number;
}
