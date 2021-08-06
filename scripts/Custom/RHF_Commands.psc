Scriptname RHF_Commands
{The documentation string.}

; ???
Bool Function HandleCommand(Actor ac, String[] tokens) global
    String command = tokens[0]
    String lowerCommand = StringUtilEx.ToLower(command)

    If RHF_Trade.HandleCommand(ac, tokens)
      DebugEx.DebugLog("RHF_Trade.HandleCommand")
      Return True

    ElseIf RHF_PlayersCommunication.HandleCommand(ac, tokens)
      DebugEx.DebugLog("RHF_PlayersCommunication.HandleCommand")
      Return True

    ElseIf RHF_SelectBox.HandleCommand(ac, tokens)
      DebugEx.DebugLog("RHF_SelectBox.HandleCommand")
      Return True

    ElseIf RHF_Chat.HandleCommand(ac, tokens)
      DebugEx.DebugLog("RHF_Chat.HandleCommand")
      Return True

    ElseIf RHF_Admin.HandleCommand(ac, tokens)
      DebugEx.DebugLog("RHF_Admin.HandleCommand")
      Return True

    ElseIf lowerCommand == "/additem"
      If tokens.Length < 2
          Return false
      EndIf
      Form formToAdd = Game.GetFormEx(M.StringToInt(tokens[1]))
      
      If tokens.Length == 4
          Int count = M.StringToInt(tokens[2])
          Bool isSilent = False
          If (tokens[3] == "true")
              isSilent = True
          EndIf
          ac.AddItem(formToAdd, count, isSilent)
          Return true
      EndIf

      If tokens.Length == 3
          Int count = M.StringToInt(tokens[2])
          ac.AddItem(formToAdd, count)
          Return true
      EndIf

      ac.AddItem(formToAdd)

      Return true

  ElseIf lowerCommand == "/online"
      Int onlineCount = M.GetOnlinePlayers().Length
      M.SendChatMessage(ac, M.GetText("count online players") + ": " + onlineCount as String)
      Return true

  ElseIf lowerCommand == "/anim"
      If tokens.Length != 3
          Return false
      EndIf
      Debug.SendAnimationEvent(ac, tokens[1])
      Return true

  ElseIf lowerCommand == "/addperk"
      If tokens.Length != 2
          Return false
      EndIf
      Form p = Game.GetFormEx(M.StringToInt(tokens[1]))
      If (p != None)
          ac.AddPerk(M.AsPerk(p))
      EndIf
      Return true

  ElseIf lowerCommand == "/id"
      M.SendChatMessage(ac, M.GetText("your id") + ": " + ac.GetFormID() as String)
      Return true

  ElseIf lowerCommand == "/coc"
      If tokens.Length != 2
          Return false
      EndIf
      VisualEffectEx.Play(Game.GetForm(0x107D96), ac, 1, ac)
      Utility.Wait(1.2)
      DebugEx.CenterOnCell(ac, tokens[1])
      Return true

  ElseIf lowerCommand == "/race"
      Race r = M.AsRace(Game.GetForm(M.StringToInt(tokens[1])))
      ac.SetRace(r)
      Return true

  ElseIf command == "/browserVisible"
      If (tokens[1] == "true")
          RHF_M.BrowserSetVisible(ac, True)
      ElseIf (tokens[1] == "false")
          RHF_M.BrowserSetVisible(ac, False)
          RHF_M.BrowserSetFocused(ac, False)
      EndIf
      Return true

  ElseIf command == "/browserFocused"
      If (tokens[1] == "true")
          RHF_M.BrowserSetFocused(ac, True)
      ElseIf (tokens[1] == "false")
          RHF_M.BrowserSetFocused(ac, False)
      EndIf
      Return true

  ElseIf command == "/focusInputField"
      If (tokens[1] == "true")
          ObjectReferenceEx.SetStorageValueBool(ac, "chromeInputFocus", true)
      ElseIf (tokens[1] == "false")
          ObjectReferenceEx.SetStorageValueBool(ac, "chromeInputFocus", false)
      EndIf
      Return true

    ElseIf lowerCommand == "/animlist"
      If tokens.Length != 3
          Return False
      EndIf
      Debug.SendAnimationEvent(ac, tokens[1])
      Return True

    ElseIf lowerCommand == "/damageav"
      If (tokens.Length != 3)
        Return False
      EndIf
      String AvName = tokens[1]
      Int Value = M.StringToInt(tokens[2])
      ac.DamageAV(AvName, Value)
      Return True

    ElseIf lowerCommand == "/kill"
      RHF_M.Kill(ac)
      Return True

    ElseIf lowerCommand == "/killall"
      Actor[] actors = M.GetActorsInStreamZone(ac)
      int index = 0
      While (index < actors.Length)
        Actor item = actors[index]
        M.Wait(0, "RHF_M.Kill", item)
        index += 1
      EndWhile
      Return True

    ElseIf lowerCommand == "/killnpc"
      Actor[] actors = M.GetActorsInStreamZone(ac)
      int index = 0
      While (index < actors.Length)
        Actor item = actors[index]
        If (ObjectReferenceEx.GetBaseObjectId(item) != 7)
          M.Wait(0, "RHF_M.Kill", item)
        EndIf
        index += 1
      EndWhile
      Return True

    ElseIf lowerCommand == "/thrownpc"
      Actor[] actors = M.GetActorsInStreamZone(ac)
      int index = 0
      While (index < actors.Length)
        Actor item = actors[index]
        If (ObjectReferenceEx.GetBaseObjectId(item) != 7 && item.IsDead())
          M.Wait(0, "ActorEx.ThrowOut", item)
        EndIf
        index += 1
      EndWhile
      Return True

    ElseIf lowerCommand == "/placeatme"
      If tokens.Length < 2
          Return false
      EndIf
      ObjectReferenceEx.PlaceAtMe(ac, M.StringToInt(tokens[1]), 1)
      Return true

    ElseIf command == "/browserFocused"
      Return true

    ElseIf command == "/speedmult"
      If tokens.Length < 2
        Return false
      EndIf
      Int mult = tokens[1] as Int
      ac.setAV("speedmult", mult)
      Return true

    ElseIf command == "/weaponspeedmult"
      If tokens.Length < 2
        Return false
      EndIf
      Int mult = tokens[1] as Int
      ac.setAV("weaponspeedmult", mult)
      Return true
      
    ElseIf command == "/delete"
      If tokens.Length < 2
        Return false
      EndIf
      Int personId = M.StringToInt(tokens[1])
      Actor person = Game.GetForm(personId) As Actor
      ActorEx.ThrowOut(person)
      Return true

    EndIf

    Return false
EndFunction