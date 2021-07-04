Scriptname RHF_Register
{RHF register handler.}

Function onRegisterHandler() global
  M.Log("Hello RHF project!")
  DebugEx.ShowEspmLoad()
  M.Wait(0, "RHF_Register.OnlineCount")
  M.Wait(0, "RHF_Register.UpdateHUD")
EndFunction

Function OnlineCount() global
  Actor[] players = M.GetOnlinePlayers()
  int index = 0
  String[] values = new String[1]
  String[] keys = new String[1]
  keys[0] = "playersOnline"
  values[0] = players.Length
  While (index < players.Length)
    M.SendChatCommand(players[index], RHF_Front_WATERMARK.updatePlayersOnline(), RHF_Utils.JsonObject(keys, values))
    index += 1
  EndWhile
  Utility.Wait(5)
  OnlineCount()
EndFunction

Function UpdateHUD() global
  Actor[] players = M.GetOnlinePlayers()
  int index = 0
  While (index < players.Length)
    String[] values = new String[1]
    String[] keys = new String[1]
    keys[0] = "playerID"
    values[0] = players[index].GetFormID() - 0xfeffffff
    M.SendChatCommand(players[index], RHF_Front_WATERMARK.updatePlayerId(), RHF_Utils.JsonObject(keys, values))
    index += 1
  EndWhile
  Utility.Wait(1)
  UpdateHUD()
EndFunction