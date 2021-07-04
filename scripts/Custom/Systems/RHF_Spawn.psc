Scriptname RHF_Spawn 
{RHF_Spawn functions.}

Form[] Function GetShrines() global
  Form[] Shrines = Utility.CreateFormArray(5)
  Shrines[0] = game.GetForm(0x1B1F1) ; Вайтран
  Shrines[1] = game.GetForm(0x1C389) ; Маркарт
  Shrines[2] = game.GetForm(0x101D9E) ; Сольтьюд
  Shrines[3] = game.GetForm(0x42284) ; Рифтен
  Shrines[4] = game.GetForm(0x55FCB) ; Виндхельм
  return Shrines
EndFunction

float[] Function GetShrinePosAndAngle(int index) global
  if (index == 0)
    float[] WhiterunShrine = Utility.CreateFloatArray(7)

    WhiterunShrine[0] = 220.78
    WhiterunShrine[1] = 254.51
    WhiterunShrine[2] = 54.33
    WhiterunShrine[3] = 0
    WhiterunShrine[4] = 0
    WhiterunShrine[5] = 90
    WhiterunShrine[6] = 91559
    return WhiterunShrine
  elseif(index == 1)
    float[] MarkathShrine = Utility.CreateFloatArray(7)

    MarkathShrine[0] = -1876.33
    MarkathShrine[1] = 786.07
    MarkathShrine[2] = 77.53
    MarkathShrine[3] = 0
    MarkathShrine[4] = 0
    MarkathShrine[5] = 180
    MarkathShrine[6] = 93683
    return MarkathShrine
  elseif (index == 2)
    float[] SolitudeShrine = Utility.CreateFloatArray(7)

    SolitudeShrine[0] = 1679.43
    SolitudeShrine[1] = 1468.99
    SolitudeShrine[2] = 0.35
    SolitudeShrine[3] = 0
    SolitudeShrine[4] = 0
    SolitudeShrine[5] = 180
    SolitudeShrine[6] = 92674
    return SolitudeShrine
  elseif (index == 3)
    float[] RiftenShrine = Utility.CreateFloatArray(7)

    RiftenShrine[0] = -1406.05
    RiftenShrine[1] = 179.12
    RiftenShrine[2] = 64.35
    RiftenShrine[3] = 0
    RiftenShrine[4] = 0
    RiftenShrine[5] = 0
    RiftenShrine[6] = 93143
    return RiftenShrine
  elseif(index == 4)
    float[] WindhelmShrine = Utility.CreateFloatArray(7)

    WindhelmShrine[0] = -1
    WindhelmShrine[1] = -2737.13
    WindhelmShrine[2] = 48.39
    WindhelmShrine[3] = 0
    WindhelmShrine[4] = 0
    WindhelmShrine[5] = 180
    WindhelmShrine[6] = 92037
    return WindhelmShrine
  endif
EndFunction

Function HandleActivate(ObjectReference caster, ObjectReference target) global
  Actor ac = caster As Actor

  Form LinkedDoor = game.GetForm(ObjectReferenceEx.GetLinkedDoorId(target) as int)

  Int currentCellId = ObjectReferenceEx.GetLinkedCellId(LinkedDoor as ObjectReference) as Int
  
  if (currentCellId == 60)
    ObjectReferenceEx.SetStorageValueForm(ac, "TamrielDoor", target)
  endif
EndFunction

Function HandleInput(Actor ac, Int[] keycodes) global
  If (keycodes.Length == 0)
    Return
  EndIf

  If (keycodes[0] == 0x07)
    DebugEx.NotificationFront(ac, ac.GetWorldSpace().GetFormID()  + " - локация игрока") 
    DebugEx.NotificationFront(ac, ObjectReferenceEx.GetStorageValueForm(ac, "TamrielDoor")  + " - Последняя локация") 
  endif

  If (keycodes[0] == 0x09)
    float[] Distances = Utility.CreatefloatArray(4)
    Distances[0] = 1.6 
    Distances[1] = 1.2 
    Distances[2] = 1.3
    Distances[3] = 1.4

    DebugEx.NotificationFront(ac, Distances)
    DebugEx.NotificationFront(ac, MathEx.Min(Distances)  + "MIN")
  endif
EndFunction

Function FindNearShrineAndSpawnPlayer(Actor ac) global
  Form[] Shrines = GetShrines()
  Float[] Distances = Utility.CreateFloatArray(5)
  Float[] pos = Utility.CreateFloatArray(3)
  Float[] posAndAngle = Utility.CreateFloatArray(6)
  Float[] ang = Utility.CreateFloatArray(3)
  Int worldOrCell

  if (ac.GetWorldSpace().GetFormID() == 60)
    DebugEx.NotificationFront(ac, "Мир")
    int index = 0
    While (index < Shrines.Length)
    
      Distances[index] = ac.GetDistance((Shrines[index] as ObjectReference))
      index += 1

      if (index == Shrines.Length) 
        float min = MathEx.min(Distances)
        int z = 0
        While (z < Distances.Length)
          if (min == Distances[z])
            posAndAngle = GetShrinePosAndAngle(z)
            pos[0] = posAndAngle[0]
            pos[1] = posAndAngle[1]
            pos[2] = posAndAngle[2]
            ang[0] = posAndAngle[3]
            ang[1] = posAndAngle[4]
            ang[2] = posAndAngle[5]
            worldOrCell = posAndAngle[6] as Int
            DebugEx.NotificationFront(ac, Shrines[z] + " - Нужный храм") 
            DebugEx.NotificationFront(ac, worldOrCell + " - ячейка") 
            ac.SetPosition(pos[0], pos[1], pos[2])
            ac.SetAngle(ang[0], ang[1], ang[2])
            ActorEx.SetWorldOrCell(ac, worldOrCell)
            ObjectReferenceEx.SetStorageValueForm(ac, "TamrielDoor", Shrines[z])
            DebugShrineName(ac, worldOrCell)
          endif
          z += 1
        EndWhile
      endif
    EndWhile
  else 
    DebugEx.NotificationFront(ac, "Лок")
    ObjectReference doorLoc = ObjectReferenceEx.GetStorageValueForm(ac, "TamrielDoor") as ObjectReference

    int index = 0
    While (index < Shrines.Length)
      Distances[index] = doorLoc.GetDistance((Shrines[index] as ObjectReference))
      index += 1

      if (index == Shrines.Length) 
        float min = MathEx.min(Distances)
        int z = 0
        While (z < Distances.Length)
          if (min == Distances[z])
            posAndAngle = GetShrinePosAndAngle(z)

            pos[0] = posAndAngle[0]
            pos[1] = posAndAngle[1]
            pos[2] = posAndAngle[2]
            ang[0] = posAndAngle[3]
            ang[1] = posAndAngle[4]
            ang[2] = posAndAngle[5]
            worldOrCell = posAndAngle[6] as Int

            ac.SetPosition(pos[0], pos[1], pos[2])
            ac.SetAngle(ang[0], ang[1], ang[2])
            ActorEx.SetWorldOrCell(ac, worldOrCell)
            DebugShrineName(ac, worldOrCell)

          endif
          z += 1
        EndWhile
      endif
    EndWhile
  endif
  
EndFunction

Function HandleDeath(Actor ac) global
  Utility.Wait(GameEx.GetServerOptionsInt("SpawnTimeToRespawn"))
  DebugEx.NotificationFront(ac, ac.GetWorldSpace().GetFormID() + " (*$!09481481240148194012480181048014841")
  FindNearShrineAndSpawnPlayer(ac)
  ac.RestoreAV("health", 9999.0)
  ac.RestoreAV("magicka", 9999.0)
  ac.RestoreAV("stamina", 9999.0)

  ObjectReferenceEx.SetStorageValueBool(ac, "isDead", false)
  Debug.SendAnimationEvent(ac, "GetUpBegin")
EndFunction

Float Function GetDist(float[] pos1, float[] pos2) global
  float dist = Math.sqrt(Math.pow(pos1[0] - pos2[0], 2) + Math.pow(pos1[1] - pos2[1], 2))
  return dist
endFunction

Function FirstSpawn(Actor ac) global
  ac.SetPosition(12512.0000  , -12656.0000, 8064.0000)
  ac.SetAngle(2.52, -0.00, 201.20)
  ActorEx.SetWorldOrCell(ac, 60)
EndFunction

Function DebugShrineName(Actor ac, int worldOrCell) global
  if (worldOrCell == 91559)
    DebugEx.NotificationFront(ac, "Вы возродились в Храме Кинарет в Вайтране")
  elseif (worldOrCell == 93683)
    DebugEx.NotificationFront(ac, "Вы возродились в Храме Дибеллы в Маркарте")
  elseif (worldOrCell == 92674)
    DebugEx.NotificationFront(ac, "Вы возродились в Храме Богов в Солитьюде")
  elseif (worldOrCell == 93143)
    DebugEx.NotificationFront(ac, "Вы возродились в Храме Мары в Рифтене")
  elseif (worldOrCell == 92037)
    DebugEx.NotificationFront(ac, "Вы возродились в Храме Талоса в Виндхельме")
  endif
EndFunction

