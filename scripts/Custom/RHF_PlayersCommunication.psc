Scriptname RHF_PlayersCommunication

Function HandleActivate(ObjectReference target, ObjectReference caster) global
  Actor player = caster As Actor
  Actor person = target As Actor
  if (!M.IsPlayer(target.GetFormId()))
    Return
  Endif
  ObjectReferenceEx.SetStorageValueForm(target, "caster", caster)
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
    ObjectReferenceEx.SetStorageValueInt(person, "TradeOffer", ac.GetFormID())
    ObjectReferenceEx.SetStorageValueString(person, "actionType", actionType)
    requestPanelShow(Game.GetFormEx(personId) as Actor, ac.GetDisplayName(), actionType)
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

Function requestPanelShow(Actor ac, String playerName, String actionType) global
  String[] values = new String[1]
  String[] keys = new String[1]
  values[0] = "title"
  if (actionType == "offer")
    keys[0] = StringUtilEx.Quotes(playerName + " предлагает обмен")
  endif
  M.SendChatCommand(ac, RHF_Front_COMMUNICATE.requestPanelShow(), RHF_UTILS.JsonObject(values, keys))
EndFunction

Function requestPanelHide(Actor ac) global
  M.SendChatCommand(ac, RHF_Front_COMMUNICATE.requestPanelHide(), "")
EndFunction

Bool Function Accept(Actor ac) global
  Int personId = ObjectReferenceEx.GetStorageValueInt(ac, "TradeOffer")
  String actionType = ObjectReferenceEx.GetStorageValueString(ac, "actionType")
	Bool result = false
  if (personId || personId != 0)
    if (actionType == "offer")
      Actor person = Game.GetFormEx(personId) as Actor
      RHF_Trade.Send(ac, person)
			result = true
    endif
  EndIf

	If (result)
		DeleteAndHide(ac)
	EndIf

  Return result
EndFunction

Function DeleteAndHide(Actor ac) global
  ObjectReferenceEx.SetStorageValueInt(ac, "TradeOffer", 0)
  ObjectReferenceEx.SetStorageValueString(ac, "actionType", "")
  RHF_PlayersCommunication.requestPanelHide(ac)
EndFunction
