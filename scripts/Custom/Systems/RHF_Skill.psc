Scriptname RHF_Skill
{Functions for skill system}

; ???
Function Init(Actor ac) global
  ; инициализация скиллов
  ; добавить массив скиллов вместо name
  String name = "cooking"
  Int cur = ObjectReferenceEx.GetStorageValueInt(ac, "skill_" + name)
  Int curExp = ObjectReferenceEx.GetStorageValueInt(ac, "skill_" + name + "_exp")
  If (!cur)
    ObjectReferenceEx.SetStorageValueInt(ac, "skill_" + name, 1)
  EndIf
  If (!curExp)
    ObjectReferenceEx.SetStorageValueInt(ac, "skill_" + name + "_exp", 0)
  EndIf
  Send(ac, name)
EndFunction

; ???
Function AddExp(Actor ac, String name, Int exp = 0) global
  Float curExp = ObjectReferenceEx.GetStorageValueFloat(ac, "skill_" + name + "_exp")
  Float newExp = curExp + exp
  ObjectReferenceEx.SetStorageValueFloat(ac, "skill_" + name + "_exp", newExp)
  If (newExp >= 100)
    ObjectReferenceEx.SetStorageValueFloat(ac, "skill_" + name + "_exp", 0)
    Float cur = ObjectReferenceEx.GetStorageValueFloat(ac, "skill_" + name)
    ObjectReferenceEx.SetStorageValueFloat(ac, "skill_" + name, cur + 1)
  Else
    ObjectReferenceEx.SetStorageValueFloat(ac, "skill_" + name + "_exp", newExp)
  EndIf

  Send(ac, name)
EndFunction

; ???
Function Print(Actor ac, String name) global
  Int cur = ObjectReferenceEx.GetStorageValueInt(ac, "skill_" + name)
  Float curExp = ObjectReferenceEx.GetStorageValueFloat(ac, "skill_" + name + "_exp")
EndFunction

; ???
Function Send(Actor ac, String name) global
  String[] keys = new String[3]
  String[] value = new String[3]

  keys[0] = "name"
  keys[1] = "level"
  keys[2] = "progress"

  value[0] = StringUtilEx.Quotes(M.GetText(name))
  value[1] = ObjectReferenceEx.GetStorageValueFloat(ac, "skill_" + name)
  value[2] = ObjectReferenceEx.GetStorageValueFloat(ac, "skill_" + name + "_exp") + ""

  M.SendChatCommand(ac, RHF_Front_SKILL.update(), RHF_Utils.JsonObject(keys, value))
EndFunction
