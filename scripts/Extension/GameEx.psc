Scriptname GameEx

Function ForceThirdPerson(Actor actor) global native

; Function DisablePlayerControlsEx(Actor actor, bool abMovement = true, bool abFighting = true, bool abCamSwitch = false, bool abLooking = false, bool abSneaking = false, bool abMenu = true, bool abActivate = true, bool abJournalTabs = false, int aiDisablePOVType = 0) global native
Function DisablePlayerControls(Actor actor) global native
; Function EnablePlayerControlsEx(Actor actor, bool abMovement = true, bool abFighting = true, bool abCamSwitch = true, bool abLooking = true, bool abSneaking = true, bool abMenu = true, bool abActivate = true, bool abJournalTabs = true, int aiDisablePOVType = 0) global native
Function EnablePlayerControls(Actor actor) global native

; ???
ObjectReference Function GetCurrentCrosshairRef(Actor actor) global native

String Function GetServerOptionsString(String key) global native
String[] Function GetServerOptionsStringArray(String key) global native
Int Function GetServerOptionsInt(String key) global native
Float Function GetServerOptionsFloat(String key) global native
Float[] Function GetServerOptionsFloatArray(String key) global native
Int[] Function GetServerOptionsIntArray(String key) global native
Bool Function GetServerOptionsBool(String key) global native
Int Function GetFormFromFile(int aiFormID, string asFilename) Native Global
