export const conditionFunctions: string[] = [
	'GetWantBlocking',
	'GetDistance',
	'AddItem',
	'SetEssential',
	'Rotate',
	'GetLocked',
	'GetPos',
	'SetPos',
	'GetAngle',
	'SetAngle',
	'GetStartingPos',
	'GetStartingAngle',
	'GetSecondsPassed',
	'Activate',
	'GetActorValue',
	'SetActorValue',
	'ModActorValue',
	'SetAtStart',
	'GetCurrentTime',
	'PlayGroup',
	'LoopGroup',
	'SkipAnim',
	'StartCombat',
	'StopCombat',
	'GetScale',
	'IsMoving',
	'IsTurning',
	'GetLineOfSight',
	'AddSpell',
	'RemoveSpell',
	'Cast',
	'GetButtonPressed',
	'GetInSameCell',
	'Enable',
	'Disable',
	'GetDisabled',
	'MenuMode',
	'PlaceAtMe',
	'PlaySound',
	'GetDisease',
	'FailAllObjectives',
	'GetClothingValue',
	'SameFaction',
	'SameRace',
	'SameSex',
	'GetDetected',
	'GetDead',
	'GetItemCount',
	'GetGold',
	'GetSleeping',
	'GetTalkedToPC',
	'Say',
	'SayTo',
	'GetScriptVariable',
	'StartQuest',
	'StopQuest',
	'GetQuestRunning',
	'SetStage',
	'GetStage',
	'GetStageDone',
	'GetFactionRankDifference',
	'GetAlarmed',
	'IsRaining',
	'GetAttacked',
	'GetIsCreature',
	'GetLockLevel',
	'GetShouldAttack',
	'GetInCell',
	'GetIsClass',
	'GetIsRace',
	'GetIsSex',
	'GetInFaction',
	'GetIsID',
	'GetFactionRank',
	'GetGlobalValue',
	'IsSnowing',
	'FastTravel',
	'GetRandomPercent',
	'RemoveMusic',
	'GetQuestVariable',
	'GetLevel',
	'IsRotating',
	'RemoveItem',
	'GetLeveledEncounterValue',
	'GetDeadCount',
	'AddToMap',
	'StartConversation',
	'Drop',
	'AddTopic',
	'ShowMessage',
	'SetAlert',
	'GetIsAlerted',
	'Look',
	'StopLook',
	'EvaluatePackage',
	'SendAssaultAlarm',
	'EnablePlayerControls',
	'DisablePlayerControls',
	'GetPlayerControlsDisabled',
	'GetHeadingAngle',
	'PickIdle',
	'IsWeaponMagicOut',
	'IsTorchOut',
	'IsShieldOut',
	'CreateDetectionEvent',
	'IsActionRef',
	'IsFacingUp',
	'GetKnockedState',
	'GetWeaponAnimType',
	'IsWeaponSkillType',
	'GetCurrentAIPackage',
	'IsWaiting',
	'IsIdlePlaying',
	'CompleteQuest',
	'Lock',
	'UnLock',
	'IsIntimidatedbyPlayer',
	'IsPlayerInRegion',
	'GetActorAggroRadiusViolated',
	'GetCrimeKnown',
	'SetEnemy',
	'SetAlly',
	'GetCrime',
	'IsGreetingPlayer',
	'StartMisterSandMan',
	'IsGuard',
	'StartCannibal',
	'HasBeenEaten',
	'GetStaminaPercentage',
	'GetPCIsClass',
	'GetPCIsRace',
	'GetPCIsSex',
	'GetPCInFaction',
	'SameFactionAsPC',
	'SameRaceAsPC',
	'SameSexAsPC',
	'GetIsReference',
	'SetFactionRank',
	'ModFactionRank',
	'KillActor',
	'ResurrectActor',
	'IsTalking',
	'GetWalkSpeed',
	'GetCurrentAIProcedure',
	'GetTrespassWarningLevel',
	'IsTrespassing',
	'IsInMyOwnedCell',
	'GetWindSpeed',
	'GetCurrentWeatherPercent',
	'GetIsCurrentWeather',
	'IsContinuingPackagePCNear',
	'SetCrimeFaction',
	'GetIsCrimeFaction',
	'CanHaveFlames',
	'HasFlames',
	'AddFlames',
	'RemoveFlames',
	'GetOpenState',
	'MoveToMarker',
	'GetSitting',
	'GetFurnitureMarkerID',
	'GetIsCurrentPackage',
	'IsCurrentFurnitureRef',
	'IsCurrentFurnitureObj',
	'SetSize',
	'RemoveMe',
	'DropMe',
	'GetFactionReaction',
	'SetFactionReaction',
	'ModFactionReaction',
	'GetDayOfWeek',
	'IgnoreCrime',
	'GetTalkedToPCParam',
	'RemoveAllItems',
	'WakeUpPC',
	'IsPCSleeping',
	'IsPCAMurderer',
	'SetCombatStyle',
	'PlaySound3D',
	'SelectPlayerSpell',
	'HasSameEditorLocAsRef',
	'HasSameEditorLocAsRefAlias',
	'GetEquipped',
	'Wait',
	'StopWaiting',
	'IsSwimming',
	'ScriptEffectElapsedSeconds',
	'SetCellPublicFlag',
	'GetPCSleepHours',
	'SetPCSleepHours',
	'GetAmountSoldStolen',
	'ModAmountSoldStolen',
	'GetIgnoreCrime',
	'GetPCExpelled',
	'SetPCExpelled',
	'GetPCFactionMurder',
	'SetPCFactionMurder',
	'GetPCEnemyofFaction',
	'SetPCEnemyofFaction',
	'GetPCFactionAttack',
	'SetPCFactionAttack',
	'StartScene',
	'StopScene',
	'GetDestroyed',
	'SetDestroyed',
	'GetActionRef',
	'GetSelf',
	'GetContainer',
	'GetForceRun',
	'SetForceRun',
	'GetForceSneak',
	'SetForceSneak',
	'AdvancePCSkill',
	'AdvancePCLevel',
	'HasMagicEffect',
	'GetDefaultOpen',
	'SetDefaultOpen',
	'ShowClassMenu',
	'ShowRaceMenu',
	'GetAnimAction',
	'ShowNameMenu',
	'SetOpenState',
	'ResetReference',
	'IsSpellTarget',
	'GetVATSMode',
	'GetPersuasionNumber',
	'GetVampireFeed',
	'GetCannibal',
	'GetIsClassDefault',
	'GetClassDefaultMatch',
	'GetInCellParam',
	'UnusedFunction1',
	'GetCombatTarget',
	'GetPackageTarget',
	'ShowSpellMaking',
	'GetVatsTargetHeight',
	'SetGhost',
	'GetIsGhost',
	'EquipItem',
	'UnequipItem',
	'SetClass',
	'SetUnconscious',
	'GetUnconscious',
	'SetRestrained',
	'GetRestrained',
	'ForceFlee',
	'GetIsUsedItem',
	'GetIsUsedItemType',
	'IsScenePlaying',
	'IsInDialogueWithPlayer',
	'GetLocationCleared',
	'SetLocationCleared',
	'ForceRefIntoAlias',
	'EmptyRefAlias',
	'GetIsPlayableRace',
	'GetOffersServicesNow',
	'GetGameSetting',
	'StopCombatAlarmOnActor',
	'HasAssociationType',
	'HasFamilyRelationship',
	'SetWeather',
	'HasParentRelationship',
	'IsWarningAbout',
	'IsWeaponOut',
	'HasSpell',
	'IsTimePassing',
	'IsPleasant',
	'IsCloudy',
	'TrapUpdate',
	'ShowQuestObjectives',
	'ForceActorValue',
	'IncrementPCSkill',
	'DoTrap',
	'EnableFastTravel',
	'IsSmallBump',
	'GetParentRef',
	'PlayBink',
	'GetBaseActorValue',
	'IsOwner',
	'SetOwnership',
	'IsCellOwner',
	'SetCellOwnership',
	'IsHorseStolen',
	'SetCellFullName',
	'SetActorFullName',
	'IsLeftUp',
	'IsSneaking',
	'IsRunning',
	'GetFriendHit',
	'IsInCombat',
	'SetPackDuration',
	'PlayMagicShaderVisuals',
	'PlayMagicEffectVisuals',
	'StopMagicShaderVisuals',
	'StopMagicEffectVisuals',
	'ResetInterior',
	'IsAnimPlaying',
	'SetActorAlpha',
	'EnableLinkedPathPoints',
	'DisableLinkedPathPoints',
	'IsInInterior',
	'ForceWeather',
	'ToggleActorsAI',
	'IsActorsAIOff',
	'IsWaterObject',
	'GetPlayerAction',
	'IsActorUsingATorch',
	'SetLevel',
	'ResetFallDamageTimer',
	'IsXBox',
	'GetInWorldspace',
	'ModPCMiscStat',
	'GetPCMiscStat',
	'GetPairedAnimation',
	'IsActorAVictim',
	'GetTotalPersuasionNumber',
	'SetScale',
	'ModScale',
	'GetIdleDoneOnce',
	'KillAllActors',
	'GetNoRumors',
	'SetNoRumors',
	'Dispel',
	'GetCombatState',
	'TriggerHitShader',
	'GetWithinPackageLocation',
	'Reset3DState',
	'IsRidingHorse',
	'DispelAllSpells',
	'IsFleeing',
	'AddAchievement',
	'DuplicateAllItems',
	'IsInDangerousWater',
	'EssentialDeathReload',
	'SetShowQuestItems',
	'DuplicateNPCStats',
	'ResetHealth',
	'SetIgnoreFriendlyHits',
	'GetIgnoreFriendlyHits',
	'IsPlayersLastRiddenHorse',
	'SetActorRefraction',
	'SetItemValue',
	'SetRigidBodyMass',
	'ShowViewerStrings',
	'ReleaseWeatherOverride',
	'SetAllReachable',
	'SetAllVisible',
	'SetNoAvoidance',
	'SendTrespassAlarm',
	'SetSceneIsComplex',
	'Autosave',
	'StartMasterFileSeekData',
	'DumpMasterFileSeekData',
	'IsActor',
	'IsEssential',
	'PreloadMagicEffect',
	'ShowDialogSubtitles',
	'SetPlayerResistingArrest',
	'IsPlayerMovingIntoNewSpace',
	'GetInCurrentLoc',
	'GetInCurrentLocAlias',
	'GetTimeDead',
	'HasLinkedRef',
	'GetLinkedRef',
	'DamageObject',
	'IsChild',
	'GetStolenItemValueNoCrime',
	'GetLastPlayerAction',
	'IsPlayerActionActive',
	'SetTalkingActivatorActor',
	'IsTalkingActivatorActor',
	'ShowBarterMenu',
	'IsInList',
	'GetStolenItemValue',
	'AddPerk',
	'GetCrimeGoldViolent',
	'GetCrimeGoldNonviolent',
	'ShowRepairMenu',
	'HasShout',
	'AddNote',
	'RemoveNote',
	'GetHasNote',
	'AddToFaction',
	'RemoveFromFaction',
	'DamageActorValue',
	'RestoreActorValue',
	'TriggerHUDShudder',
	'GetObjectiveFailed',
	'SetObjectiveFailed',
	'SetGlobalTimeMultiplier',
	'GetHitLocation',
	'IsPC1stPerson',
	'PurgeCellBuffers',
	'PushActorAway',
	'SetActorsAI',
	'ClearOwnership',
	'GetCauseofDeath',
	'IsLimbGone',
	'IsWeaponInList',
	'PlayIdle',
	'ApplyImageSpaceModifier',
	'RemoveImageSpaceModifier',
	'IsBribedbyPlayer',
	'GetRelationshipRank',
	'SetRelationshipRank',
	'SetCellImageSpace',
	'ShowChargenMenu',
	'GetVATSValue',
	'IsKiller',
	'IsKillerObject',
	'GetFactionCombatReaction',
	'UseWeapon',
	'EvaluateSpellConditions',
	'ToggleMotionBlur',
	'Exists',
	'GetGroupMemberCount',
	'GetGroupTargetCount',
	'SetObjectiveCompleted',
	'SetObjectiveDisplayed',
	'GetObjectiveCompleted',
	'GetObjectiveDisplayed',
	'SetImageSpace',
	'PipboyRadio',
	'RemovePerk',
	'DisableAllActors',
	'GetIsFormType',
	'GetIsVoiceType',
	'GetPlantedExplosive',
	'CompleteAllObjectives',
	'IsScenePackageRunning',
	'GetHealthPercentage',
	'SetAudioMultithreading',
	'GetIsObjectType',
	'ShowChargenMenuParams',
	'GetDialogueEmotion',
	'GetDialogueEmotionValue',
	'ExitGame',
	'GetIsCreatureType',
	'PlayerCreatePotion',
	'PlayerEnchantObject',
	'ShowWarning',
	'EnterTrigger',
	'MarkForDelete',
	'SetPlayerAIDriven',
	'GetInCurrentLocFormList',
	'GetInZone',
	'GetVelocity',
	'GetGraphVariableFloat',
	'HasPerk',
	'GetFactionRelation',
	'IsLastIdlePlayed',
	'SetNPCRadio',
	'SetPlayerTeammate',
	'GetPlayerTeammate',
	'GetPlayerTeammateCount',
	'OpenActorContainer',
	'ClearFactionPlayerEnemyFlag',
	'ClearActorsFactionsPlayerEnemyFlag',
	'GetActorCrimePlayerEnemy',
	'GetCrimeGold',
	'SetCrimeGold',
	'ModCrimeGold',
	'GetPlayerGrabbedRef',
	'IsPlayerGrabbedRef',
	'PlaceLeveledActorAtMe',
	'GetKeywordItemCount',
	'ShowLockpickMenu',
	'GetBroadcastState',
	'SetBroadcastState',
	'StartRadioConversation',
	'GetDestructionStage',
	'ClearDestruction',
	'CastImmediateOnSelf',
	'GetIsAlignment',
	'ResetQuest',
	'SetQuestDelay',
	'IsProtected',
	'GetThreatRatio',
	'MatchFaceGeometry',
	'GetIsUsedItemEquipType',
	'GetPlayerName',
	'FireWeapon',
	'PayCrimeGold',
	'UnusedFunction2',
	'MatchRace',
	'SetPCYoung',
	'SexChange',
	'IsCarryable',
	'GetConcussed',
	'SetZoneRespawns',
	'SetVATSTarget',
	'GetMapMarkerVisible',
	'ResetInventory',
	'PlayerKnows',
	'GetPermanentActorValue',
	'GetKillingBlowLimb',
	'GoToJail',
	'CanPayCrimeGold',
	'ServeTime',
	'GetDaysInJail',
	'EPAlchemyGetMakingPoison',
	'EPAlchemyEffectHasKeyword',
	'ShowAllMapMarkers',
	'GetAllowWorldInteractions',
	'ResetAI',
	'SetRumble',
	'SetNoActivationSound',
	'ClearNoActivationSound',
	'GetLastHitCritical',
	'AddMusic',
	'UnusedFunction3',
	'UnusedFunction4',
	'SetPCToddler',
	'IsCombatTarget',
	'TriggerScreenBlood',
	'GetVATSRightAreaFree',
	'GetVATSLeftAreaFree',
	'GetVATSBackAreaFree',
	'GetVATSFrontAreaFree',
	'GetIsLockBroken',
	'IsPS3',
	'IsWin32',
	'GetVATSRightTargetVisible',
	'GetVATSLeftTargetVisible',
	'GetVATSBackTargetVisible',
	'GetVATSFrontTargetVisible',
	'AttachAshPile',
	'SetCriticalStage',
	'IsInCriticalStage',
	'RemoveFromAllFactions',
	'GetXPForNextLevel',
	'ShowLockpickMenuDebug',
	'ForceSave',
	'GetInfamy',
	'GetInfamyViolent',
	'GetInfamyNonViolent',
	'UnusedFunction5',
	'Sin',
	'Cos',
	'Tan',
	'Sqrt',
	'Log',
	'Abs',
	'GetQuestCompleted',
	'UnusedFunction6',
	'PipBoyRadioOff',
	'AutoDisplayObjectives',
	'IsGoreDisabled',
	'FadeSFX',
	'SetMinimalUse',
	'IsSceneActionComplete',
	'ShowQuestStages',
	'GetSpellUsageNum',
	'ForceRadioStationUpdate',
	'GetActorsInHigh',
	'HasLoaded3D',
	'DisableAllMines',
	'SetLastExtDoorActivated',
	'KillQuestUpdates',
	'IsImageSpaceActive',
	'HasKeyword',
	'HasRefType',
	'LocationHasKeyword',
	'LocationHasRefType',
	'CreateEvent',
	'GetIsEditorLocation',
	'GetIsAliasRef',
	'GetIsEditorLocAlias',
	'IsSprinting',
	'IsBlocking',
	'HasEquippedSpell',
	'GetCurrentCastingType',
	'GetCurrentDeliveryType',
	'EquipSpell',
	'GetAttackState',
	'GetAliasedRef',
	'GetEventData',
	'IsCloserToAThanB',
	'EquipShout',
	'GetEquippedShout',
	'IsBleedingOut',
	'UnlockWord',
	'TeachWord',
	'AddToContainer',
	'GetRelativeAngle',
	'SendAnimEvent',
	'Shout',
	'AddShout',
	'RemoveShout',
	'GetMovementDirection',
	'IsInScene',
	'GetRefTypeDeadCount',
	'GetRefTypeAliveCount',
	'ApplyHavokImpulse',
	'GetIsFlying',
	'IsCurrentSpell',
	'SpellHasKeyword',
	'GetEquippedItemType',
	'GetLocationAliasCleared',
	'SetLocationAliasCleared',
	'GetLocAliasRefTypeDeadCount',
	'GetLocAliasRefTypeAliveCount',
	'IsWardState',
	'IsInSameCurrentLocAsRef',
	'IsInSameCurrentLocAsRefAlias',
	'LocAliasIsLocation',
	'GetKeywordDataForLocation',
	'SetKeywordDataForLocation',
	'GetKeywordDataForAlias',
	'SetKeywordDataForAlias',
	'LocAliasHasKeyword',
	'IsNullPackageData',
	'GetNumericPackageData',
	'IsFurnitureAnimType',
	'IsFurnitureEntryType',
	'GetHighestRelationshipRank',
	'GetLowestRelationshipRank',
	'HasAssociationTypeAny',
	'HasFamilyRelationshipAny',
	'GetPathingTargetOffset',
	'GetPathingTargetAngleOffset',
	'GetPathingTargetSpeed',
	'GetPathingTargetSpeedAngle',
	'GetMovementSpeed',
	'GetInContainer',
	'IsLocationLoaded',
	'IsLocAliasLoaded',
	'IsDualCasting',
	'DualCast',
	'GetVMQuestVariable',
	'GetVMScriptVariable',
	'IsEnteringInteractionQuick',
	'IsCasting',
	'GetFlyingState',
	'SetFavorState',
	'IsInFavorState',
	'HasTwoHandedWeaponEquipped',
	'IsExitingInstant',
	'IsInFriendStatewithPlayer',
	'GetWithinDistance',
	'GetActorValuePercent',
	'IsUnique',
	'GetLastBumpDirection',
	'CameraShake',
	'IsInFurnitureState',
	'GetIsInjured',
	'GetIsCrashLandRequest',
	'GetIsHastyLandRequest',
	'UpdateQuestInstanceGlobal',
	'SetAllowFlying',
	'IsLinkedTo',
	'GetKeywordDataForCurrentLocation',
	'GetInSharedCrimeFaction',
	'GetBribeAmount',
	'GetBribeSuccess',
	'GetIntimidateSuccess',
	'GetArrestedState',
	'GetArrestingActor',
	'ClearArrestState',
	'EPTemperingItemIsEnchanted',
	'EPTemperingItemHasKeyword',
	'GetReceivedGiftValue',
	'GetGiftGivenValue',
	'ForceLocIntoAlias',
	'GetReplacedItemType',
	'SetHorseActor',
	'PlayReferenceEffect',
	'StopReferenceEffect',
	'PlayShaderParticleGeometry',
	'StopShaderParticleGeometry',
	'ApplyImageSpaceModifierCrossFade',
	'RemoveImageSpaceModifierCrossFade',
	'IsAttacking',
	'IsPowerAttacking',
	'IsLastHostileActor',
	'GetGraphVariableInt',
	'GetCurrentShoutVariation',
	'PlayImpactEffect',
	'ShouldAttackKill',
	'SendStealAlarm',
	'GetActivationHeight',
	'EPModSkillUsage_IsAdvanceSkill',
	'WornHasKeyword',
	'GetPathingCurrentSpeed',
	'GetPathingCurrentSpeedAngle',
	'KnockAreaEffect',
	'InterruptCast',
	'AddFormToFormList',
	'RevertFormList',
	'AddFormToLeveledList',
	'RevertLeveledList',
	'EPModSkillUsage_AdvanceObjectHasKeyword',
	'EPModSkillUsage_IsAdvanceAction',
	'EPMagic_SpellHasKeyword',
	'GetNoBleedoutRecovery',
	'SetNoBleedoutRecovery',
	'EPMagic_SpellHasSkill',
	'IsAttackType',
	'IsAllowedToFly',
	'HasMagicEffectKeyword',
	'IsCommandedActor',
	'IsStaggered',
	'IsRecoiling',
	'IsExitingInteractionQuick',
	'IsPathing',
	'GetShouldHelp',
	'HasBoundWeaponEquipped',
	'GetCombatTargetHasKeyword',
	'UpdateLevel',
	'GetCombatGroupMemberCount',
	'IsIgnoringCombat',
	'GetLightLevel',
	'SavePCFace',
	'SpellHasCastingPerk',
	'IsBeingRidden',
	'IsUndead',
	'GetRealHoursPassed',
	'UnequipAll',
	'IsUnlockedDoor',
	'IsHostileToActor',
	'GetTargetHeight',
	'IsPoison',
	'WornApparelHasKeywordCount',
	'GetItemHealthPercent',
	'EffectWasDualCast',
	'GetKnockStateEnum',
	'DoesNotExist',
];
