import { PapyrusObject, PapyrusValue } from '../types/mp';

export interface MMethods {
	GetActorsInStreamZone: (args: PapyrusValue[]) => PapyrusObject[];
	GetOnlinePlayers: () => PapyrusObject[];
	IsPlayer: (args: PapyrusValue[]) => boolean;
	BrowserSetVisible: (args: PapyrusValue[]) => void;
	BrowserSetFocused: (args: PapyrusValue[]) => void;
	BrowserSetModal: (args: PapyrusValue[]) => void;
	BrowserGetVisible: (args: PapyrusValue[]) => boolean;
	BrowserGetFocused: (args: PapyrusValue[]) => boolean;
	BrowserGetModal: (args: PapyrusValue[]) => boolean;
	GetGlobalStorageValue: (args: PapyrusValue[]) => PapyrusValue | undefined;
	SetGlobalStorageValue: (key: string, value: PapyrusValue) => void;
	ExecuteUiCommand: (args: PapyrusValue[]) => void;
}
