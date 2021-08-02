Scriptname ObjectReferenceEx

Function SetCurrentDestructionStage(ObjectReference ref, Int Stage) global native

; ??
Function SetStorageValueString        (ObjectReference ref, String key, String value) global native
Function SetStorageValueStringArray   (ObjectReference ref, String key, String[] value) global native
Function SetStorageValueInt           (ObjectReference ref, String key, Int value) global native
Function SetStorageValueIntArray      (ObjectReference ref, String key, Int[] value) global native
Function SetStorageValueFloat         (ObjectReference ref, String key, Float value) global native
Function SetStorageValueFloatArray    (ObjectReference ref, String key, Float[] value) global native
Function SetStorageValueBool          (ObjectReference ref, String key, Bool value) global native
Function SetStorageValueBoolArray     (ObjectReference ref, String key, Bool[] value) global native
Function SetStorageValueFormArray     (ObjectReference ref, String key, Form[] value) global native
Function SetStorageValueForm     (ObjectReference ref, String key, Form value) global native

; ??
String      Function GetStorageValueString            (ObjectReference ref, String key) global native
String[]    Function GetStorageValueStringArray       (ObjectReference ref, String key) global native
Int         Function GetStorageValueInt               (ObjectReference ref, String key) global native
Int[]       Function GetStorageValueIntArray          (ObjectReference ref, String key) global native
Float       Function GetStorageValueFloat             (ObjectReference ref, String key) global native
Float[]     Function GetStorageValueFloatArray        (ObjectReference ref, String key) global native
Bool        Function GetStorageValueBool              (ObjectReference ref, String key) global native
Bool[]      Function GetStorageValueBoolArray         (ObjectReference ref, String key) global native
Form[]      Function GetStorageValueFormArray         (ObjectReference ref, String key) global native
Form        Function GetStorageValueForm              (ObjectReference ref, String key) global native

Int Function GetBaseObjectId(ObjectReference ref) global native

Bool Function SetDisplayName(Actor ac, ObjectReference ref, String name, Bool force = false) global native
; Возвращает id ссылок хранящихся в ObjectReference
Int[] Function GetLinkedReferenceId(ObjectReference ref) global Native
; Возвращает id ссылки соотнесенной с id keyword
Int Function GetLinkedReferenceIdByKeywordId(ObjectReference ref, Int keywordId) global Native
; Use if PlaceAtMe does not produce the desired result. Takes the coordinates of the spawn location from the esp-file. Return RefId.
Int Function PlaceObjectOnStatic(Int spawnPointId, Int spawnObjectId) global Native
; Return the associated locationRefId
Int Function GetLocationRef(Int ObjectReferenceId) global Native

; Возвращает ID внутренней локации, принимает внешнюю дверь
Int Function GetLinkedCellId(ObjectReference door) global native

; Телепортирует к связанной двери
Function TeleportToLinkedDoorMarker(ObjectReference doorRef, Actor ref) global native

; Выдает Id связанной двери
Int Function GetLinkedDoorId(ObjectReference door) global native

ObjectReference Function PlaceAtMe(ObjectReference ref, Int SpawnId, int aiCount = 1, bool abForcePersist = false, bool abInitiallyDisabled = false) global native
Int Function GetRespawnTime(Actor ac) global native
