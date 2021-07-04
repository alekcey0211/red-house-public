Scriptname DebugEx
{RHF DebugEx.}

; ???
Function Notification(Actor ac, String msg) global native
; Show connected mods on the server.
Function ShowEspmLoad() global native
; Output all raw information in the form. If you enter a refId, you will get incomplete information.
Function AboutForm(Float formId) global native
; Ptint in client console msg
Function PrintConsole(String msg) global native
; Displays all readable information
Function About(Form form) global native

Function CenterOnCell(Actor ac, string asCellname) Native Global

; Уведомление на хроме
; msg - сообщение
; type - тип сообщений, сообщений с одиннаковые типом и содержимым будут складываться
; count - кол-во предметов, нужен для типа additem и deleteItem
; item - объект, нужен для типа additem и deleteItem
Function NotificationFront(Actor ac, String msg, String type = "default", Int count = 0, Form item = None) global
  String[] keys = Utility.CreateStringArray(0)
  String[] values = Utility.CreateStringArray(0)
  String typeLower = StringUtilEx.ToLower(type)
  keys = UtilityEx.PushStringArray(keys, "message")
  If (item && (typeLower == "additem" || typeLower == "deleteitem"))
    values = UtilityEx.PushStringArray(values, StringUtilEx.Quotes(item.GetName()))
  Else
    values = UtilityEx.PushStringArray(values, StringUtilEx.Quotes(msg))
  EndIf
  keys = UtilityEx.PushStringArray(keys, "type")
  values = UtilityEx.PushStringArray(values, StringUtilEx.Quotes(type))

  If (count > 0 && (typeLower == "additem" || typeLower == "deleteitem"))
    keys = UtilityEx.PushStringArray(keys, "count")
    values = UtilityEx.PushStringArray(values, count)
  EndIf

  If (item && (typeLower == "additem" || typeLower == "deleteitem"))
    keys = UtilityEx.PushStringArray(keys, "category")
    values = UtilityEx.PushStringArray(values, item.GetType())
  EndIf

  String result = RHF_Utils.JsonObject(keys, values)
  M.SendChatCommand(ac, RHF_Front_INFOBAR.addMessage(), result)
EndFunction

; Выводит, если включен дебаг
Function DebugNotificationFront(Actor ac, String msg) global
  If (RHF_Global.EnableDebug() == true)
    NotificationFront(ac, msg)
  EndIf
EndFunction

Function DebugLog(String log) global
  If (RHF_Global.EnableDebug() == true)
    M.Log(log)
  EndIf
EndFunction