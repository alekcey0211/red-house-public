Scriptname RHF_Keybinding
{RHF_Keybinding}

Function HandleInput(Actor ac, Int[] keycodes) global
  If (!IsBind(keycodes))
    Return
  EndIf

  Bool BrowserFocused = M.BrowserGetFocused(ac)

  If (BrowserFocused)
    Utility.Wait(0.3)
    DebugEx.DebugLog("BrowserSetFocused")
    M.BrowserSetFocused(ac, false)
    Return
  EndIf

  M.BrowserSetFocused(ac, true)

  If (keycodes[0] == GameEx.GetServerOptionsInt("keybindingShowChat"))
    M.SendChatCommand(ac, RHF_Front_CHAT.show())
  ElseIf (keycodes[0] == GameEx.GetServerOptionsInt("keybindingShowAnimList"))
    M.SendChatCommand(ac, RHF_Front_ANIMLIST.show())
  ElseIf (keycodes[0] == GameEx.GetServerOptionsInt("keybindingAcceptTrade") && !RHF_PlayersCommunication.AcceptTrade(ac)) ; Принять запрос обмена
    M.BrowserSetFocused(ac, false)
  ElseIf (keycodes[0] == GameEx.GetServerOptionsInt("keybindingRejectTrade")) ; Отклонить запрос обмена
    RHF_PlayersCommunication.DeleteAndHide(ac)
    M.BrowserSetFocused(ac, false)
  endif
EndFunction

Bool Function IsBind(Int[] keycodes) global
  Int[] keys = Utility.CreateIntArray(0)
  keys = UtilityEx.PushIntArray(keys, GameEx.GetServerOptionsInt("keybindingShowChat"))
  keys = UtilityEx.PushIntArray(keys, GameEx.GetServerOptionsInt("keybindingShowAnimList"))
  keys = UtilityEx.PushIntArray(keys, GameEx.GetServerOptionsInt("keybindingAcceptTrade"))
  keys = UtilityEx.PushIntArray(keys, GameEx.GetServerOptionsInt("keybindingRejectTrade"))
  Return UtilityEx.ArrayIntFind(keys, keycodes[0]) >= 0
EndFunction

