Scriptname RHF_PlayersCommunication

Function HandleActivate(ObjectReference target, ObjectReference caster) global
  Actor player = caster As Actor
  Actor person = target As Actor
  if (!M.IsPlayer(target.GetFormId()))
    Return
  Endif
  M.BrowserSetFocused(player, true)
  interactionMenuOpen(player, person.GetFormID(), "offer")
EndFunction

Bool Function HandleCommand(Actor ac, String[] tokens) global
  String command = tokens[0]

  If command == "/InteractionMenuAction"
    If tokens.Length != 3
        Return False
    EndIf
    Int personId = M.StringToInt(tokens[1])
    Actor person = Game.GetForm(personId) As Actor
    String actionType = tokens[2]
    ; обработчик типа взаимодействия
    If actionType == "offer" ; обмен
      ObjectReferenceEx.SetStorageValueInt(person, "TradeOffer", ac.GetFormID())
      requestPanelShow(Game.GetFormEx(personId) as Actor, ac.GetDisplayName())
      Return True
    EndIf
    Return True
  ElseIf command == "/InteractionMenuClose"
    interactionMenuClose(ac)
    Return True
  EndIf
  Return False
EndFunction


Function interactionMenuOpen(Actor ac, Int personId, String actionType) global
  String[] values = new String[1]
  String[] keys = new String[1]
  values[0] = "personID"
  keys[0] = personId as String
  M.SendChatCommand(ac, RHF_Front_COMMUNICATE.interactionMenuShow(), RHF_UTILS.JsonObject(values, keys))
EndFunction

Function interactionMenuClose(Actor ac) global
  M.SendChatCommand(ac, RHF_Front_COMMUNICATE.interactionMenuHide(), "")
EndFunction

Function requestPanelShow(Actor ac, String playerName) global
  String[] values = new String[1]
  String[] keys = new String[1]
  values[0] = "title"
  keys[0] = StringUtilEx.Quotes(playerName + " предлагает обмен")
  M.SendChatCommand(ac, RHF_Front_COMMUNICATE.requestPanelShow(), RHF_UTILS.JsonObject(values, keys))
EndFunction

Function requestPanelHide(Actor ac) global
  M.SendChatCommand(ac, RHF_Front_COMMUNICATE.requestPanelHide(), "")
EndFunction

Bool Function AcceptTrade(Actor ac) global
  Int personId = ObjectReferenceEx.GetStorageValueInt(ac, "TradeOffer")
  if (personId || personId != 0)
    Actor person = Game.GetFormEx(personId) as Actor
    RHF_Trade.Send(ac, person)
    DeleteAndHide(ac)
    Return true
  EndIf
  Return false
EndFunction

Function DeleteAndHide(Actor ac) global
  ObjectReferenceEx.SetStorageValueInt(ac, "TradeOffer", 0)
  RHF_PlayersCommunication.requestPanelHide(ac)
EndFunction