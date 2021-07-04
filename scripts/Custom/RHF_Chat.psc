scriptname RHF_Chat
{RHF_Chat}

Function OnChatInput(Actor ac, String text) global
  
EndFunction

Bool Function HandleCommand(Actor ac, String[] tokens) global
  String command = tokens[0]
  String lowerCommand = StringUtilEx.ToLower(command)

  If lowerCommand == "/b"
    String msg = GM_Colors.NonRp() + "(( " + ac.GetDisplayName() + ": " + StringUtilEx.MergeStrings(tokens, 1) + " ))"
    GM_ChatSend.SendToPlayersNear(ac, msg, GM_Distances.ChatDistance())
    Return True

  ElseIf lowerCommand == "/me"
    String msg = RHF_Colors.MeDo() + ac.GetDisplayName() + " " + StringUtilEx.MergeStrings(tokens, 1)
    GM_ChatSend.SendToPlayersNear(ac, msg, GM_Distances.ChatDistance())
    Return True

  ElseIf lowerCommand == "/do"
    String msg = RHF_Colors.MeDo() + StringUtilEx.MergeStrings(tokens, 1) + "  (" + ac.GetDisplayName() + ")"
    GM_ChatSend.SendToPlayersNear(ac, msg, GM_Distances.ChatDistance())
    Return True

  ElseIf lowerCommand == "/try"
    If (Utility.RandomInt(0, 1) == 1)
      String msg = ac.GetDisplayName() + ": " + StringUtilEx.MergeStrings(tokens, 1) + "#{00FF00} (Удачно)"
      GM_ChatSend.SendToPlayersNear(ac, msg, GM_Distances.ChatDistance())  
    Else
      String msg = ac.GetDisplayName() + ": " + StringUtilEx.MergeStrings(tokens, 1) + "#{FF0000} (Неудачно)"
      GM_ChatSend.SendToPlayersNear(ac, msg, GM_Distances.ChatDistance())  
    EndIf
    Return True

  ElseIf lowerCommand == "/secret"
    String msg = StringUtilEx.MergeStrings(tokens, 1)
    GM_ChatSend.SendToAll(msg)
    Return True

  ElseIf command == "/chat-clear"
    M.SendChatCommand(ac, RHF_Front_CHAT.clear(), "")
    Return true
  EndIf

  Return false
EndFunction