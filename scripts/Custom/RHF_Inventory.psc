Scriptname RHF_Inventory
{Functions for inventory}

; ???
String[] Function Get(Actor ac) global
  Form[] forms = ac.GetContainerForms()
  String[] resultForms = Utility.CreateStringArray(0)
  int index = 0
  While index < forms.Length
    String jsonItem = GetItemJSON(forms[index], ac.GetItemCount(forms[index]))
    resultForms = UtilityEx.PushStringArray(resultForms, jsonItem)
    index += 1
  EndWhile

  Return resultForms
EndFunction

; ???
String Function GetItemJSON(Form item, Int count = 1) global
  String[] keys = Utility.CreateStringArray(0)
  String[] values = Utility.CreateStringArray(0)

  keys = UtilityEx.PushStringArray(keys, "id")
  keys = UtilityEx.PushStringArray(keys, "name")
  keys = UtilityEx.PushStringArray(keys, "category")
  keys = UtilityEx.PushStringArray(keys, "count")

  values = UtilityEx.PushStringArray(values, item.GetFormID())
  values = UtilityEx.PushStringArray(values, StringUtilEx.Quotes(item.GetName()))
  values = UtilityEx.PushStringArray(values, item.GetType())
  values = UtilityEx.PushStringArray(values, count)

  If (item As Potion)
    Return HandlePotion(item As Potion, keys, values)
  ElseIf (item As Weapon)
    Return HandleWeapon(item As Weapon, keys, values)
  EndIf

  Return RHF_Utils.JsonObject(keys, values)
EndFunction

; Does the player have an object.
; Нужен что бы было проще делать условные выражения
Bool Function HasItem(ObjectReference ac, Int itemId, Int count = 1) global
  return (ac.GetItemCount(Game.GetFormEx(itemId)) >= count)
EndFunction

; ???
String Function GetJSON(Actor ac) global
  Return "[" + StringUtilEx.Join(Get(ac), ",") + "]"
EndFunction

; ???
Function Send(Actor ac) global
  M.SendChatCommand(ac, "GET_FULL_INVENTORY", GetJSON(ac))
EndFunction

; ???
String Function HandlePotion(Potion pot, String[] keys, String[] values) global
  keys = UtilityEx.PushStringArray(keys, "isFood")
  If (pot.IsFood())
    values = UtilityEx.PushStringArray(values, "true")
  Else
    values = UtilityEx.PushStringArray(values, "false")
  EndIf

  Return RHF_Utils.JsonObject(keys, values)
EndFunction

; ???
String Function HandleWeapon(Weapon weap, String[] keys, String[] values) global
  keys = UtilityEx.PushStringArray(keys, "damage")
  values = UtilityEx.PushStringArray(values, weap.GetBaseDamage())

  Return RHF_Utils.JsonObject(keys, values)
EndFunction
