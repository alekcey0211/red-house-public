Scriptname RHF_onLoad
{RHF onload handler.}

; ???
Function HandleOnLoad(Actor ac) global
  If (!ObjectReferenceEx.GetStorageValueInt(ac, "firstLoad"))
    ObjectReferenceEx.SetStorageValueInt(ac, "firstLoad", 1)
    FirstLoad(ac)
  EndIf

  If (ObjectReferenceEx.GetStorageValueBool(ac, "banned"))
    ac.Disable()
  EndIF

  RHF_Skill.Init(ac)

  M.SendChatCommand(ac, RHF_Front_WATERMARK.updatePlayerId(), GetPlayerID(ac))
  M.SendChatCommand(ac, RHF_Front_WATERMARK.updateServerName(), GetServerName())
EndFunction

; ???
Function FirstLoad(Actor ac) global
  ac.UnequipAll()
  ac.RemoveAllItems()

  Int[] clothesList = RHF_Global.CLOTHES()
  Int clothesId = clothesList[Utility.RandomInt(0, 7)]
  Form clothes = Game.GetForm(clothesId)

  Int[] shoesList = RHF_Global.SHOES()
  Int shoesId = shoesList[Utility.RandomInt(0, 3)]
  Form shoes = Game.GetForm(shoesId)

  Int[] hatsList = RHF_Global.HATS()
  Int hatsId = hatsList[Utility.RandomInt(0, 1)]
  Form hats = Game.GetForm(hatsId)

  ac.EquipItem(clothes, false, true)
  ac.EquipItem(shoes, false, true)
  ac.EquipItem(hats, false, true)

  String[] items = GameEx.GetServerOptionsStringArray("StartUpItemsAdd")

  int i = 0
  While (i < items.Length)
    String item = items[i]
    String[] splitData = StringUtil.Split(item, ";")
    String[] splitId = StringUtil.Split(splitData[0], ":")
    Int id = M.StringToInt(splitId[0])
    String plugin = "Skyrim.esm"
    If (splitId.Length > 1)
      plugin = splitId[1]
    EndIf
    Form itemForm = Game.GetFormFromFile(id, plugin)
    ac.AddItem(itemForm, splitData[1] As Int, true)
    i += 1
  EndWhile

  M.SendChatMessage(ac, "Добро пожаловать на сервер" + " " + GameEx.GetServerOptionsBool("serverName") + "!")

  ObjectReferenceEx.SetStorageValueBool(ac, "isAdmin", false)
EndFunction

; Get current player id
; Return JsonObject "{"playerID": 1}"
String Function GetPlayerID(Actor ac) global
  String[] values = new String[1]
  String[] keys = new String[1]
  keys[0] = "playerID"
  values[0] = ac.GetFormID() - 0xfeffffff
  return RHF_Utils.JsonObject(keys, values)
EndFunction

; Get server name from server options
; Return JsonObject "{"name": "Project name"}"
String Function GetServerName() global
  String[] values = new String[1]
  String[] keys = new String[1]
  keys[0] = "name"
  values[0] = StringUtilEx.Quotes(GameEx.GetServerOptionsString("serverName"))
  return RHF_Utils.JsonObject(keys, values)
EndFunction