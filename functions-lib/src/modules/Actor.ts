import { PapyrusObject, PapyrusValue } from '../types/mp';

export interface ActorMethods {
	AddPerk: (self: PapyrusObject, args: PapyrusValue[]) => void;
	RemovePerk: (self: PapyrusObject, args: PapyrusValue[]) => void;
	HasPerk: (self: PapyrusObject, args: PapyrusValue[]) => boolean;
	IsEquipped: (self: PapyrusObject, args: PapyrusValue[]) => boolean;
	EquipItem: (self: PapyrusObject, args: PapyrusValue[]) => void;
	UnequipItem: (self: PapyrusObject, args: PapyrusValue[]) => void;
	UnequipAll: (self: PapyrusObject) => void;
	UnequipItemSlot: (self: PapyrusObject, args: PapyrusValue[]) => void;
	GetEquippedObject: (self: PapyrusObject, args: PapyrusValue[]) => PapyrusObject | undefined;
	GetEquippedShield: (self: PapyrusObject) => PapyrusObject | undefined;
	GetEquippedWeapon: (self: PapyrusObject, args: PapyrusValue[]) => PapyrusObject | undefined;
	SetActorValue: (self: PapyrusObject, args: PapyrusValue[]) => void;
	GetActorValue: (self: PapyrusObject, args: PapyrusValue[]) => number;
	GetActorValuePercentage: (self: PapyrusObject, args: PapyrusValue[]) => number;
	DamageActorValue: (self: PapyrusObject, args: PapyrusValue[]) => void;
	RestoreActorValue: (self: PapyrusObject, args: PapyrusValue[]) => void;
	ModActorValue: (self: PapyrusObject, args: PapyrusValue[]) => void;
	IsWeaponDrawn: (self: PapyrusObject) => boolean;
	IsDead: (self: PapyrusObject) => boolean;
	IsHuman: (self: PapyrusObject) => boolean;
	SetOutfit: (self: PapyrusObject, args: PapyrusValue[]) => void;
	SetRace: (self: PapyrusObject, args: PapyrusValue[]) => void;
	GetRace: (self: PapyrusObject) => PapyrusObject | undefined;
	GetWornForms: (self: PapyrusObject) => PapyrusObject[];
	SetWorldOrCell: (args: PapyrusValue[]) => void;
	ThrowOut: (self: PapyrusObject) => void;
	Kill: (self: PapyrusObject, args: PapyrusValue[]) => void;
	Resurrect: (self: PapyrusObject) => void;
}
