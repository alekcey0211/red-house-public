Scriptname GM_Main
{The documentation string.}

Function _OnChatInput(Actor ac, String text)
    GM_Chat.OnChatInput(ac, text)
    RHF_Chat.OnChatInput(ac, text)
EndFunction

Function _OnPapyrusRegister()
    M.Log("Hello Papyrus")
    RHF_Main._OnRHFRegister()
EndFunction

Function _OnLoadGame(Actor ac) global
    RHF_Main._OnLoadGame(ac)
EndFunction

Bool Function _onActivate(ObjectReference target, ObjectReference caster) global
    If (!RHF_Main._onActivate(target, caster))
        Return False
    EndIf
    Return True
EndFunction

Function _onCellChange(Actor ac, Cell prevCell, Cell currentCell) global
    RHF_Main._onCellChange(ac, prevCell, currentCell)
EndFunction

Function _onHit(ObjectReference target, ObjectReference agressor, Bool isPowerAttack, Bool isSneakAttack, Bool isBashAttack, Bool isHitBlocked) global
    RHF_Main._onHit(target, agressor, isPowerAttack, isSneakAttack, isBashAttack, isHitBlocked)
EndFunction

Function _onHitStatic(ObjectReference target, ObjectReference agressor, Bool isPowerAttack, Bool isSneakAttack, Bool isBashAttack, Bool isHitBlocked) global
    RHF_Main._onHitStatic(target, agressor, isPowerAttack, isSneakAttack, isBashAttack, isHitBlocked)
EndFunction

Function _onEquip(Actor ac, Form target) global
    RHF_Main._onEquip(ac, target)
EndFunction

Function _OnInput(Actor ac, Int[] keycodes) global
    RHF_Main._OnInput(ac, keycodes)
EndFunction

Function _onAnimationEvent(Actor ac, String current, String previous = "") global
    RHF_Main._onAnimationEvent(ac, current, previous)
EndFunction

Function _onEffectStart(ObjectReference caster, ObjectReference target, MagicEffect effect, Int mag) global
    RHF_Main._onEffectStart(caster, target, effect, mag)
EndFunction

Function _onEffectStart2(ObjectReference caster, ObjectReference target, Int effect, Int mag) global
    RHF_Main._onEffectStart2(caster, target, effect, mag)
EndFunction

Function _onCurrentCrosshairChange(Actor ac, ObjectReference ref) global
    RHF_Main._onCurrentCrosshairChange(ac, ref)
EndFunction

Function _onDeath(Actor ac) global
    RHF_Main._onDeath(ac)
EndFunction



