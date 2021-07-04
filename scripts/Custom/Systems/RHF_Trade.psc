Scriptname RHF_Trade
{Functions for trade}

; ???
Bool Function HandleCommand(Actor ac, String[] tokens) global
  String command = tokens[0]

  If command == "/TradePlayerAddItem"
    If tokens.Length != 4
      Return False
    EndIf
    Int personId = M.StringToInt(tokens[1])
    Int itemId = M.StringToInt(tokens[2])
    Int itemCountId = M.StringToInt(tokens[3])
    Actor person = Game.GetForm(personId) As Actor
    AddItem(person, itemId, itemCountId)
    return True

  ElseIf command == "/TradePlayerDeleteItem"
    If tokens.Length != 4
      Return False
    EndIf
    Int personId = M.StringToInt(tokens[1])
    Int itemId = M.StringToInt(tokens[2])
    Int itemCountId = M.StringToInt(tokens[3])
    Actor person = Game.GetForm(personId) As Actor
    DeleteItem(person, itemId, itemCountId)
    return True

  ElseIf command == "/TradePlayerLockActivate"
    If tokens.Length != 2
      Return False
    EndIf
    Int personId = M.StringToInt(tokens[1])
    Actor person = Game.GetForm(personId) As Actor
    M.SendChatCommand(person, RHF_Front_TRADE.activatePerson())
    return True

  ElseIf command == "/TradePlayerSubmit"
    If tokens.Length != 2
      Return False
    EndIf
    Int personId = M.StringToInt(tokens[1])
    Actor person = Game.GetForm(personId) As Actor
    M.SendChatCommand(person, RHF_Front_TRADE.acceptFromPerson())
    return True

  ElseIf command == "/TradePlayerCloseWindow"
    If tokens.Length != 2
      Return False
    EndIf
    Int personId = M.StringToInt(tokens[1])
    Actor person = Game.GetForm(personId) As Actor
    M.SendChatCommand(person, RHF_Front_TRADE.nullify())
    RHF_M.BrowserSetFocused(ac, false)
    RHF_M.BrowserSetFocused(person, false)
    return True

  ElseIf command == "/TradePlayerDelete"
    If tokens.Length != 3
      Return False
    EndIf
    Int[] idList = UtilityEx.StringArrayToIntArray(StringUtil.Split(tokens[1], ","))
    Int[] countList = UtilityEx.StringArrayToIntArray(StringUtil.Split(tokens[2], ","))

    int index = 0
    While (index < idList.Length)
      Form item = Game.GetForm(idList[index])
      ac.RemoveItem(item, countList[index])
      index += 1
    EndWhile

    return True

  ElseIf command == "/TradePlayerAdd"
    If tokens.Length != 3
      Return False
    EndIf
    Int[] idList = UtilityEx.StringArrayToIntArray(StringUtil.Split(tokens[1], ","))
    Int[] countList = UtilityEx.StringArrayToIntArray(StringUtil.Split(tokens[2], ","))

    int index = 0
    While (index < idList.Length)
      Form item = Game.GetForm(idList[index])
      ac.AddItem(item, countList[index], true)
      index += 1
    EndWhile

    return True

  EndIf
  Return False
EndFunction

; Перенесено в RHF_PlayersCommunication
; Function HandleActivate(ObjectReference target, ObjectReference caster) global
;   Actor player = caster As Actor
;   Actor person = target As Actor
;   if (!player || !person || player.getFormId() < M.StringToInt("4278190080") || person.getFormId() < M.StringToInt("4278190080"))
;     Return
;   Endif
;   Send(player, person)
; EndFunction

; ???
Function Send(Actor player, Actor person) global
  String[] values = new String[2]
  String[] keys = new String[2]
  keys[0] = "meta"
  keys[1] = "inventory"

  ; Отправляю инвентарь инициатора в трейд
  RHF_M.BrowserSetFocused(player, true)
  values[0] = GetMeta(player, person)
  values[1] = RHF_Inventory.GetJSON(player)
  M.SendChatCommand(player, RHF_Front_TRADE.addAllItems(), RHF_Utils.JsonObject(keys, values))

  ; Отправляю инвентарь цели в трейд
  RHF_M.BrowserSetFocused(person, true)
  values[0] = GetMeta(person, player)
  values[1] = RHF_Inventory.GetJSON(person)
  M.SendChatCommand(person, RHF_Front_TRADE.addAllItems(), RHF_Utils.JsonObject(keys, values))

  Debug.SendAnimationEvent(player, "IdleStop")
  Debug.SendAnimationEvent(person, "IdleStop")
EndFunction

; ???
String Function GetMeta(Actor player, Actor person) global
  String playerName = player.GetDisplayName()
  String personName = person.GetDisplayName()
  String[] metaData = new String[6]
  String[] value = new String[6]

  metaData[0] = "playerID"
  metaData[1] = "playerName"
  metaData[2] = "playerMoney"
  metaData[3] = "personID"
  metaData[4] = "personName"
  metaData[5] = "personMoney"

  value[0] = player.GetFormID()
  value[1] = StringUtilEx.Quotes(playerName)
  value[2] = player.GetItemCount(Game.GetForm(0xf))
  value[3] = person.GetFormID()
  value[4] = StringUtilEx.Quotes(personName)
  value[5] = person.GetItemCount(Game.GetForm(0xf))
  Return RHF_Utils.JsonObject(metaData, value)
EndFunction

; ???
Function AddItem(Actor ac, Int itemId, Int count) global
  M.SendChatCommand(ac, RHF_Front_TRADE.addPersonItem(), RHF_Inventory.GetItemJSON(Game.GetForm(itemId), count))
EndFunction

; ???
Function DeleteItem(Actor ac, Int itemId, Int count) global
  String[] keys = new String[4]
  String[] value = new String[4]

  keys[0] = "id"
  keys[1] = "count"

  value[0] = itemId
  value[1] = count
  M.SendChatCommand(ac, RHF_Front_TRADE.deletePersonItem(), RHF_Utils.JsonObject(keys, value))
EndFunction
