Scriptname M
{The documentation string.}

Function ExecuteUiCommand(Actor actor, String commandType, String[] argumentNames, String[] tokens, String alter) global native

Function Log(String text) global native

String Function GetText(String msgid) global native

String Function Format(String format, String[] tokens) global native

Actor[] Function GetActorsInStreamZone(Actor actor) global native

Bool Function IsOnline(Actor actor) global native

Actor[] Function GetOnlinePlayers() global native

Bool Function IsPlayer(Int PlayerId) global native

; ??
Function SetGlobalStorageValueString        (String key, String value) global native
Function SetGlobalStorageValueStringArray   (String key, String[] value) global native
Function SetGlobalStorageValueInt           (String key, Int value) global native
Function SetGlobalStorageValueIntArray      (String key, Int[] value) global native
Function SetGlobalStorageValueFloat         (String key, Float value) global native
Function SetGlobalStorageValueFloatArray    (String key, Float[] value) global native

; ??
String      Function GetGlobalStorageValueString            (String key) global native
String[]    Function GetGlobalStorageValueStringArray       (String key) global native
Int         Function GetGlobalStorageValueInt               (String key) global native
Int[]       Function GetGlobalStorageValueIntArray          (String key) global native
Float       Function GetGlobalStorageValueFloat             (String key) global native
Float[]     Function GetGlobalStorageValueFloatArray        (String key) global native

Function SendChatMessage(Actor ac, String msg) global
    String[] keys = new String[1]
    String[] values = new String[1]
    keys[0] = "message"
    values[0] = StringUtilEx.Quotes(msg)
    M.ExecuteUiCommand(ac, RHF_Front_CHAT.add(), None, None, RHF_UTILS.JsonObject(keys, values))
EndFunction

Function SendChatCommand(Actor ac, String command, String msg = "") global
    M.ExecuteUiCommand(ac, command, None, None, msg)
EndFunction

Perk Function AsPerk(Form form) global native
Outfit Function AsOutfit(Form form) global native
Race Function AsRace(Form form) global native
MagicEffect Function AsMagicEffect(Form form) global native
VisualEffect Function AsVisualEffect(Form form) global native

Int Function StringToInt(String number) global native

Function Wait(Float Seconds, String FunctionName, Actor actor = None, ObjectReference target = None, Int targetId = -1) global native

Function BrowserSetVisible(Actor ac, Bool visible) global native
Function BrowserSetFocused(Actor ac, Bool focused) global native
Function BrowserSetModal(Actor ac, Bool modal) global native

Function BrowserGetVisible(Actor ac) global native
Function BrowserGetFocused(Actor ac) global native
Function BrowserGetModal(Actor ac) global native
