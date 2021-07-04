Scriptname RHF_Main
{RHF main functions.}

; ???
Function _OnRHFRegister() global
    RHF_Register.onRegisterHandler()
EndFunction
    
; ???
Function _OnLoadGame(Actor ac) global
    RHF_onLoad.HandleOnLoad(ac)
EndFunction

; ???
Bool Function _onActivate(ObjectReference target, ObjectReference caster) global
    Actor ac = caster As Actor
    
    RHF_PlayersCommunication.HandleActivate(target, caster)
    RHF_Spawn.HandleActivate(caster, target)
    
    Return True
EndFunction

; ???
Function _onCellChange(Actor ac, Cell prevCell, Cell currentCell) global
EndFunction

; ???
Function _onHit(ObjectReference target, ObjectReference agressor, Bool isPowerAttack, Bool isSneakAttack, Bool isBashAttack, Bool isHitBlocked) global
EndFunction

; ???
Function _onHitStatic(ObjectReference target, ObjectReference agressor, Bool isPowerAttack, Bool isSneakAttack, Bool isBashAttack, Bool isHitBlocked) global
EndFunction

; ???
Function _onEquip(Actor ac, Form target) global
    Potion pot = target As Potion
    If (pot)
        MagicEffect[] mef = pot.GetMagicEffects()
        int i = 0
        While (i < mef.Length)
            Float mag = pot.GetNthEffectMagnitude(i)
            Float dur = pot.GetNthEffectDuration(i)
            If (mef[i].GetFormID() == Game.GetFormFromFile(0x3EB15, "skyrim.esm").GetFormID())
                ac.RestoreAV("health", mag)
            ElseIf (
                mef[i].GetFormID() == Game.GetFormFromFile(0x1058A2, "skyrim.esm").GetFormID() ||
                mef[i].GetFormID() == Game.GetFormFromFile(0x2287ab, "hive.esp").GetFormID()
                )
                Int steps = 2
                int j = 0
                Float diff = mag / dur
                While (j < diff * steps)
                    ac.RestoreAV("health", diff / steps)
                    Utility.Wait(1.0 / steps)
                    j += 1
                EndWhile
            EndIf
            i += 1
        EndWhile
    EndIf
EndFunction

; ???
Function _OnInput(Actor ac, Int[] keycodes) global
    If (keycodes.Length == 0)
        Return
    EndIf

    Bool uiOpened = ObjectReferenceEx.GetStorageValueBool(ac, "uiOpened")
    If (uiOpened)
        Return
    EndIf
    Bool chromeInputFocus = ObjectReferenceEx.GetStorageValueBool(ac, "chromeInputFocus")
    If (chromeInputFocus)
        Return
    EndIf


    RHF_Keybinding.HandleInput(ac, keycodes)
    RHF_Spawn.HandleInput(ac, keycodes)

    If (keycodes.Length != 1)
        Return
    EndIf

    If (keycodes[0] == 28)
    ElseIf (keycodes[0] == 0x01)
        if (ObjectReferenceEx.GetStorageValueBool(ac, "MainUiIsOpen") == false)
            M.BrowserSetFocused(ac, false)
            M.BrowserSetModal(ac, false)
        endif
    ElseIf (keycodes[0] == 0x03)
    ElseIf (keycodes[0] == 0x04)
    ElseIf (keycodes[0] == 0x05)
    EndIf
EndFunction

; ???
Function _onAnimationEvent(Actor ac, String current, String previous = "") global
EndFunction

; ???
Function _onEffectStart(ObjectReference caster, ObjectReference target, MagicEffect effect, Int mag) global
EndFunction

; ???
Function _onEffectStart2(ObjectReference caster, ObjectReference target, Int effect, Int mag) global
EndFunction

Function _onCurrentCrosshairChange(Actor ac, ObjectReference ref) global
EndFunction

Function _onDeath(Actor ac) global
    RHF_Spawn.HandleDeath(ac)
EndFunction


Function onTriggerleave(ObjectReference triggerRef) global
endFunction

Function onTriggerEnter(ObjectReference triggerRef) global
endFunction