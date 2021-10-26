import { ServerOption } from '../papyrus/game/server-options';
import { PapyrusObject, PapyrusValue } from '../types/mp';

export interface GameMethods {
	GetForm: (args: PapyrusValue[]) => PapyrusObject | undefined;
	GetFormFromFile: (args: PapyrusValue[]) => PapyrusObject | undefined;
	ForceThirdPerson: (args: PapyrusValue[]) => void;
	DisablePlayerControls: (args: PapyrusValue[]) => void;
	EnablePlayerControls: (args: PapyrusValue[]) => void;
	GetCurrentCrosshairRef: (args: PapyrusValue[]) => PapyrusObject | undefined;
	GetServerOptionsValue: <T = any>(args: PapyrusValue[]) => T;
	GetServerOptions: () => ServerOption;
}
