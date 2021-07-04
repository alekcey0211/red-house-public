Scriptname RHF_Admin
{The documentation string.}

Bool Function HandleCommand(Actor ac, String[] tokens) global
  String command = tokens[0]
  String lowerCommand = StringUtilEx.ToLower(command)

  If lowerCommand == "/adminlogin"
    AdminLogin(ac, tokens)
    Return true
  EndIf

  If (!ActorIsAdmin(ac))
    Return false
  EndIf

  If lowerCommand == "/mute"
    Mute(ac, tokens)
    Return true  
  ElseIf lowerCommand == "/unmute"
    Mute(ac, tokens, false)
    Return true
  ElseIf lowerCommand == "/muteid"
    Mute(ac, tokens, true, true)
    Return true
  ElseIf lowerCommand == "/unmuteid"
    Mute(ac, tokens, false, true)
    Return true
  ElseIf lowerCommand == "/showplayers"
    ShowPlayers(ac)
    Return true
  ElseIf lowerCommand == "/teleport"
    Teleport(ac, tokens, true)
    Return true
  ElseIf lowerCommand == "/freeze"
    Freeze(ac, tokens)
    Return true
  ElseIf lowerCommand == "/unfreeze"
    UnFreeze(ac, tokens)
    Return true
  ElseIf lowerCommand == "/changename"
    ChangeName(ac, tokens)
    Return true
  ElseIf lowerCommand == "/Player.additem"
    PlayerAddItem(ac, tokens)
    Return true
  ElseIf lowerCommand == "/adminroom"
    TPToAdminRoom(ac, tokens)
    Return true
  ElseIf lowerCommand == "/ban"
    Ban(ac, tokens)
    Return true
  ElseIf lowerCommand == "/banid"
    Ban(ac, tokens, true, true)
    Return true
  ElseIf lowerCommand == "/unbanid"
    Ban(ac, tokens, false, true)
    Return true
  ElseIf lowerCommand == "/banlist"
    ShowBannedPlayers(ac)
    Return true
  EndIf
  Return False
EndFunction

Function AdminLogin(Actor ac, String[] tokens) global
  If (tokens[1] == "NieBanMenia")
    ObjectReferenceEx.SetStorageValueBool(ac, "isAdmin", true)
    M.SendChatMessage(ac, "Вы теперь админ")
  Else
    M.SendChatMessage(ac, "Неправильный пароль")
  EndIf
EndFunction

Bool Function ActorIsAdmin(Actor ac) global
  Return  ObjectReferenceEx.GetStorageValueBool(ac, "isAdmin")
EndFunction

Int Function GetPlayerId(Actor ac) global
  Return ac.GetFormID() - 0xff000000 + 1
EndFunction

Int Function GetPlayerFormID(Int playerId) global
  Return playerId - 1 + 0xff000000
EndFunction

Function ShowBannedPlayers(Actor ac) global

EndFunction

Function Ban(Actor ac, String[] tokens, Bool banned = true, Bool byPlayerId = false) global
  If tokens.Length < 2
    Return 
  EndIf
  String searchPhrase = tokens[1]
  Int timeInt = -1
  If tokens.Length == 3
    String time = tokens[2]
    timeInt = ParseTime(time)
  EndIf
  Actor playerToBan = GetActorBy(ac, searchPhrase, byPlayerId)
  If playerToBan != None
    String messageStr = "Вы "
    If banned
      messageStr = messageStr + "забанили "
    Else
      messageStr = messageStr + "разбанили "
    EndIF
    messageStr = messageStr + playerToBan.GetDisplayName()
    M.SendChatMessage(ac,messageStr)
    ObjectReferenceEx.SetStorageValueBool(playerToBan, "banned", banned)
    SetTimeLeftBanned(playerToBan, -1)
    If banned && timeInt != -1
      SetTimeLeftBanned(playerToBan, timeInt)
      M.Wait(timeInt, "RHF_Admin.UnbanAc", playerToBan)
    EndIf
    If banned
      Int index = 3
      If timeInt == -1
        index = index - 1
      EndIf
      String messageStr = "Вы забанены. "
      While index < tokens.Length
        messageStr = messageStr + " " + tokens[index]
        index = index + 1
      EndWhile
      M.SendChatMessage(playerToBan, messageStr)
      Utility.Wait(5)
      playerToBan.Disable()
    EndIf
  EndIf
  Return
EndFunction

Function UnbanAc(Actor ac) global
  ObjectReferenceEx.SetStorageValueBool(ac, "banned", False)
EndFunction


Function TPToAdminRoom(Actor ac, String[] tokens) global
  DebugEx.CenterOnCell(ac, "ThievesGuildHoldingCell")
EndFunction

Function PlayerAddItem(Actor ac, String[] tokens) global
  If tokens.Length < 3
    Return
  EndIf
  Form formToAdd = Game.GetFormEx(M.StringToInt(tokens[2]))
  Int count = 1
  If tokens.Length == 4
    Int count = M.StringToInt(tokens[3])
  EndIf
  Bool isSilent = False
  If tokens.Length == 5
    Int count = M.StringToInt(tokens[4])
  EndIf
  Actor acToAdd = GetActorBy(ac, tokens[1])
  If acToAdd != None
    acToAdd.AddItem(formToAdd, count, isSilent)
  EndIf
EndFunction


Function ChangeName(Actor ac, String[] tokens) global
  If tokens.Length != 3
    Return 
  EndIf
  Actor acToChange = GetActorBy(ac, tokens[1])
  If acToChange != None
    acToChange.SetDisplayName(tokens[2], true)
  EndIf
EndFunction

Function Freeze(Actor ac, String[] tokens) global
  If tokens.Length != 2
    Return 
  EndIf
  Actor acToFreeze = GetActorBy(ac, tokens[1])
  If acToFreeze != None
    GameEx.ForceThirdPerson(acToFreeze)
    GameEx.DisablePlayerControls(acToFreeze)
  EndIf
EndFunction

Function Unfreeze(Actor ac, String[] tokens) global
  If tokens.Length != 2
    Return 
  EndIf
  Actor acToUnfreeze = GetActorBy(ac, tokens[1])
  If acToUnfreeze != None
    GameEx.ForceThirdPerson(acToUnfreeze)
    GameEx.EnablePlayerControls(acToUnfreeze)
  EndIf
EndFunction


Function Teleport(Actor ac, String[] tokens, Bool byPlayerId = false) global
  If tokens.Length != 3
    Return 
  EndIf
  Actor acToTeleport = GetActorBy(ac, tokens[1], byPlayerId)
  If acToTeleport == None
    Return
  EndIf
  DebugEx.CenterOnCell(acToTeleport, tokens[2])
  String messageStr = "Вас переместил " + ac.GetDisplayName()
  M.SendChatMessage(acToTeleport, messageStr)
EndFunction

Function ShowPlayers(Actor ac) global
  Actor[] players = M.GetOnlinePlayers()
  Int index = 0
  M.SendChatMessage(ac, "Имя   ID")
  While index < players.Length
    Actor pl =players[index]
    String name = pl.GetDisplayName()
    Int playerID = GetPlayerId(pl)
    String messageStr = "" + name + " " + playerID
    M.SendChatMessage(ac, messageStr)
    index += 1
  EndWhile
EndFunction

Actor Function GetActorBy(Actor admin, String searchPhrase, Bool byPlayerId = false) global
  If byPlayerId
    Return Game.GetForm(GetPlayerFormID(M.StringToInt(searchPhrase))) As Actor
  EndIf
  Actor[] players = M.GetOnlinePlayers()
  Int index = 0
  Actor playerToInteract = None
  Int count = 0
  While index < players.Length
    Actor pl =players[index]
    String name = pl.GetDisplayName()
    If name == searchPhrase
      playerToInteract = pl
      count = count + 1
    EndIf
    index += 1
  EndWhile
  If count == 1
    Return playerToInteract
  EndIF
  If count == 0
    M.SendChatMessage(admin, "Игрок не найден")
    Return None
  EndIF
  M.SendChatMessage(admin, "Попробуйте найти игрока по айди")
  Return None
EndFunction

Bool Function Mute(Actor ac, String[] tokens, Bool muted = true, Bool byPlayerId = false) global
  If tokens.Length < 2
    Return False
  EndIf
  String searchPhrase = tokens[1]
  Int timeInt = -1
  If tokens.Length == 3
    String time = tokens[2]
    timeInt = ParseTime(time)
  EndIf
  Actor playerToMute = GetActorBy(ac, searchPhrase, byPlayerId)
  If playerToMute != None
    String messageStr = "Вы "
    If muted
      messageStr = messageStr + "замутили "
    Else
      messageStr = messageStr + "размутили "
    EndIF
    messageStr = messageStr + playerToMute.GetDisplayName()
    M.SendChatMessage(ac,messageStr)
    ObjectReferenceEx.SetStorageValueBool(playerToMute, "muted", muted)
    SetTimeLeftMuted(playerToMute, -1)
    If muted && timeInt != -1
      SetTimeLeftMuted(playerToMute, timeInt)
      M.Wait(timeInt, "RHF_Admin.UnmuteAc", playerToMute)
    EndIf
  EndIf
  Return True
EndFunction

Function SendTimeLeft(Actor ac) global
  Int timeInt = ObjectReferenceEx.GetStorageValueInt(ac, "mutedTime")
  IF timeInt == -1
    M.SendChatMessage(ac, "Вы перманентно замучены на этом сервере")
    Return
  EndIf
  String messageStr = "Вы замучены на этом сервере еще "
  If timeInt < 3600
    Int minutes = timeInt/60
    messageStr = messageStr + minutes + " м."
  ElseIf timeInt < 3600*24
    Int hours = timeInt/(3600)
    messageStr = messageStr + hours + " ч."
  Else
    Int days = timeInt/(3600*24)
    messageStr = messageStr + days + " д."
  EndIf
  M.SendChatMessage(ac, messageStr)
EndFunction

Function SetTimeLeftMuted(Actor ac, Int timeInt) global
  ObjectReferenceEx.SetStorageValueInt(ac, "mutedTime", timeInt)
  M.Wait(60, "RHF_Admin.SetTimeLeftMuted", ac, None, timeInt-60)
EndFunction

Function SetTimeLeftBanned(Actor ac, Int timeInt) global
  ObjectReferenceEx.SetStorageValueInt(ac, "bannedTime", timeInt)
  M.Wait(60, "RHF_Admin.SetTimeLeftBanned", ac, None, timeInt-60)
EndFunction


Function UnmuteAc(Actor ac) global
  ObjectReferenceEx.SetStorageValueBool(ac, "muted", False)
EndFunction

Int Function ParseTime(String str) global
  Int time = M.StringToInt(StringUtil.Substring(str, 0, StringUtil.GetLength(str)-1))
  String type = StringUtil.GetNthChar(str, StringUtil.GetLength(str)-1)
  If type == "m"
    Return time*60
  ElseIf type == "h"
    Return time*60*60
  ElseIf type == "d"
    Return time*60*60*24
  EndIf
  Return -1
EndFunction 
