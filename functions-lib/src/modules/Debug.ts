import { PapyrusValue } from '../types/mp';

export interface DebugMethods {
	CenterOnCell: (args: PapyrusValue[]) => void;
	SendAnimationEvent: (args: PapyrusValue[]) => PapyrusValue;
	Notification: (args: PapyrusValue[]) => void;
	QuitGame: (args: PapyrusValue[]) => void;
	ToggleCollisions: (args: PapyrusValue[]) => void;
}
