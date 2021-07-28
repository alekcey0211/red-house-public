Scriptname RHF_Spawn 
{RHF_Spawn functions.}

Function HandleDeath(Actor ac) global
  Int time = ObjectReferenceEx.GetRespawnTime(ac)

  If (time == -1)
    Utility.Wait(2)
    ActorEx.ThrowOut(ac)
    Return
  EndIf

  Utility.Wait(time)

  ac.RestoreAV("health", 99999.0)
  ac.RestoreAV("magicka", 99999.0)
  ac.RestoreAV("stamina", 99999.0)

  ObjectReferenceEx.SetStorageValueBool(ac, "isDead", false)
  DebugEx.DebugLog(ac.GetFormID() + " respawns")
EndFunction