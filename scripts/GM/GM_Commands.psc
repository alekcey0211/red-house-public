Scriptname GM_Commands
{The documentation string.}

Bool Function HandleCommand(Actor ac, String[] tokens) global
    String command = tokens[0]

    If RHF_Commands.HandleCommand(ac, tokens)
        Return True
    EndIf

    Return false
EndFunction