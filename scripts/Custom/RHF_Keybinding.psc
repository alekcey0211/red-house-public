Scriptname RHF_Keybinding
{RHF_Keybinding}

Function HandleInput(Actor ac, Int[] keycodes) global
  If (!IsBind(keycodes))
    Return
  EndIf

  Bool BrowserFocused = M.BrowserGetFocused(ac)

  If (BrowserFocused)
    ; TODO: может все-таки закрывать интерфейс на хроме, но как-то не дублировать?
    Utility.Wait(0.3)
    DebugEx.DebugLog("BrowserSetFocused")
    M.BrowserSetFocused(ac, false)
    Return
  EndIf

  M.BrowserSetFocused(ac, true)

  If (keycodes[0] == GameEx.GetServerOptionsInt("keybindingAcceptTrade")) ; Принять запрос обмена
    If !RHF_PlayersCommunication.Accept(ac)
    M.BrowserSetFocused(ac, false)
    EndIf
  ElseIf (keycodes[0] == GameEx.GetServerOptionsInt("keybindingRejectTrade")) ; Отклонить запрос обмена
    RHF_PlayersCommunication.DeleteAndHide(ac)
    M.BrowserSetFocused(ac, false)
  endif
EndFunction

Bool Function IsBind(Int[] keycodes) global
  Int[] keys = Utility.CreateIntArray(0)
  keys = UtilityEx.PushIntArray(keys, GameEx.GetServerOptionsInt("keybindingAcceptTrade"))
  keys = UtilityEx.PushIntArray(keys, GameEx.GetServerOptionsInt("keybindingRejectTrade"))

  Return UtilityEx.ArrayIntFind(keys, keycodes[0]) >= 0
EndFunction

