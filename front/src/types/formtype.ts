export enum FormType {
	kFormType_None, //	NONE
	kFormType_TES4, //	TES4
	kFormType_Group, //	GRUP
	kFormType_GMST, //	GMST
	kFormType_Keyword, //	KYWD	BGSKeyword
	kFormType_LocationRef, //	LCRT	BGSLocationRefType
	kFormType_Action, //	AACT	BGSAction
	kFormType_TextureSet, //	TXST	BGSTextureSet
	kFormType_MenuIcon, //	MICN	BGSMenuIcon
	kFormType_Global, //	GLOB	TESGlobal
	kFormType_Class, //	CLAS	TESClass
	kFormType_Faction, //	FACT	TESFaction
	kFormType_HeadPart, //	HDPT	BGSHeadPart
	kFormType_Eyes, //	EYES	TESEyes
	kFormType_Race, //	RACE	TESRace
	kFormType_Sound, //	SOUN	TESSound
	kFormType_AcousticSpace, //	ASPC	BGSAcousticSpace
	kFormType_Skill, //	SKIL	<missing>
	kFormType_EffectSetting, //	MGEF	EffectSetting
	kFormType_Script, //	SCPT	Script
	kFormType_LandTexture, //	LTEX	TESLandTexture
	kFormType_Enchantment, //	ENCH	EnchantmentItem
	kFormType_Spell, //	SPEL	SpellItem
	kFormType_ScrollItem, //	SCRL	ScrollItem
	kFormType_Activator, //	ACTI	TESObjectACTI
	kFormType_TalkingActivator, //	TACT	BGSTalkingActivator
	kFormType_Armor, //	ARMO	TESObjectARMO
	kFormType_Book, //	BOOK	TESObjectBOOK
	kFormType_Container, //	CONT	TESObjectCONT
	kFormType_Door, //	DOOR	TESObjectDOOR
	kFormType_Ingredient, //	INGR	IngredientItem
	kFormType_Light, //	LIGH	TESObjectLIGH
	kFormType_Misc, //	MISC	TESObjectMISC
	kFormType_Apparatus, //	APPA	BGSApparatus
	kFormType_Static, //	STAT	TESObjectSTAT
	kFormType_StaticCollection, //	SCOL	BGSStaticCollection
	kFormType_MovableStatic, //	MSTT	BGSMovableStatic
	kFormType_Grass, //	GRAS	TESGrass
	kFormType_Tree, //	TREE	TESObjectTREE
	kFormType_Flora, //	FLOR	TESFlora
	kFormType_Furniture, //	FURN	TESFurniture
	kFormType_Weapon, //	WEAP	TESObjectWEAP
	kFormType_Ammo, //	AMMO	TESAmmo
	kFormType_NPC, //	NPC_	TESNPC
	kFormType_LeveledCharacter, //	LVLN	TESLevCharacter
	kFormType_Key, //	KEYM	TESKey
	kFormType_Potion, //	ALCH	AlchemyItem
	kFormType_IdleMarker, //	IDLM	BGSIdleMarker / BGSDefaultObjectManager? strange
	kFormType_Note, //	NOTE	BGSNote
	kFormType_ConstructibleObject, //	COBJ	BGSConstructibleObject
	kFormType_Projectile, //	PROJ	BGSProjectile
	kFormType_Hazard, //	HAZD	BGSHazard
	kFormType_SoulGem, //	SLGM	TESSoulGem
	kFormType_LeveledItem, //	LVLI	TESLevItem
	kFormType_Weather, //	WTHR	TESWeather
	kFormType_Climate, //	CLMT	TESClimate
	kFormType_SPGD, //	SPGD	BGSShaderParticleGeometryData
	kFormType_ReferenceEffect, //	RFCT	BGSReferenceEffect
	kFormType_Region, //	REGN	TESRegion
	kFormType_NAVI, //	NAVI	NavMeshInfoMap
	kFormType_Cell, //	CELL	TESObjectCELL
	kFormType_Reference, //	REFR	TESObjectREFR / Actor
	kFormType_Character, //	ACHR	Character / PlayerCharacter
	kFormType_Missile, //	PMIS	MissileProjectile
	kFormType_Arrow, //	PARW	ArrowProjectile
	kFormType_Grenade, //	PGRE	GrenadeProjectile
	kFormType_BeamProj, //	PBEA	BeamProjectile
	kFormType_FlameProj, //	PFLA	FlameProjectile
	kFormType_ConeProj, //	PCON	ConeProjectile
	kFormType_BarrierProj, //	PBAR	BarrierProjectile
	kFormType_PHZD, //	PHZD	Hazard
	kFormType_WorldSpace, //	WRLD	TESWorldSpace
	kFormType_Land, //	LAND	TESObjectLAND
	kFormType_NAVM, //	NAVM	NavMesh
	kFormType_TLOD, //	TLOD	?
	kFormType_Topic, //	DIAL	TESTopic
	kFormType_TopicInfo, //	INFO	TESTopicInfo
	kFormType_Quest, //	QUST	TESQuest
	kFormType_Idle, //	IDLE	TESIdleForm
	kFormType_Package, //	PACK	TESPackage
	kFormType_CombatStyle, //	CSTY	TESCombatStyle
	kFormType_LoadScreen, //	LSCR	TESLoadScreen
	kFormType_LeveledSpell, //	LVSP	TESLevSpell
	kFormType_ANIO, //	ANIO	TESObjectANIO
	kFormType_Water, //	WATR	TESWaterForm
	kFormType_EffectShader, //	EFSH	TESEffectShader
	kFormType_TOFT, //	TOFT	?
	kFormType_Explosion, //	EXPL	BGSExplosion
	kFormType_Debris, //	DEBR	BGSDebris
	kFormType_ImageSpace, //	IMGS	TESImageSpace
	kFormType_ImageSpaceMod, //	IMAD	TESImageSpaceModifier
	kFormType_List, //	FLST	BGSListForm
	kFormType_Perk, //	PERK	BGSPerk
	kFormType_BodyPartData, //	BPTD	BGSBodyPartData
	kFormType_AddonNode, //	ADDN	BGSAddonNode
	kFormType_ActorValueInfo, //	AVIF	ActorValueInfo
	kFormType_CameraShot, //	CAMS	BGSCameraShot
	kFormType_CameraPath, //	CPTH	BGSCameraPath
	kFormType_VoiceType, //	VTYP	BGSVoiceType
	kFormType_MaterialType, //	MATT	BGSMaterialType
	kFormType_ImpactData, //	IPCT	BGSImpactData
	kFormType_ImpactDataSet, //	IPDS	BGSImpactDataSet
	kFormType_ARMA, //	ARMA	TESObjectARMA
	kFormType_EncounterZone, //	ECZN	BGSEncounterZone
	kFormType_Location, //	LCTN	BGSLocation
	kFormType_Message, //	MESH	BGSMessage
	kFormType_Ragdoll, //	RGDL	BGSRagdoll
	kFormType_DOBJ, //	DOBJ	? (used for default objects, custom loader)
	kFormType_LightingTemplate, //	LGTM	BGSLightingTemplate
	kFormType_MusicType, //	MUSC	BGSMusicType
	kFormType_Footstep, //	FSTP	BGSFootstep
	kFormType_FootstepSet, //	FSTS	BGSFootstepSet
	kFormType_StoryBranchNode, //	SMBN	BGSStoryManagerBranchNode
	kFormType_StoryQuestNode, //	SMQN	BGSStoryManagerQuestNode
	kFormType_StoryEventNode, //	SMEN	BGSStoryManagerEventNode
	kFormType_DialogueBranch, //	DLBR	BGSDialogueBranch
	kFormType_MusicTrack, //	MUST	BGSMusicTrackFormWrapper
	kFormType_DLVW, //	DLVW	?
	kFormType_WordOfPower, //	WOOP	TESWordOfPower
	kFormType_Shout, //	SHOU	TESShout
	kFormType_EquipSlot, //	EQUP	BGSEquipSlot
	kFormType_Relationship, //	RELA	BGSRelationship
	kFormType_Scene, //	SCEN	BGSScene
	kFormType_AssociationType, //	ASTP	BGSAssociationType
	kFormType_Outfit, //	OTFT	BGSOutfit
	kFormType_Art, //	ARTO	BGSArtObject
	kFormType_Material, //	MATO	BGSMaterialObject
	kFormType_MovementType, //	MOVT	BGSMovementType
	kFormType_SoundDescriptor, //	SNDR	BGSSoundDescriptorForm
	kFormType_DualCastData, //	DUAL	BGSDualCastData
	kFormType_SoundCategory, //	SNCT	BGSSoundCategory
	kFormType_SoundOutput, //	SOPM	BGSSoundOutput
	kFormType_CollisionLayer, //	COLL	BGSCollisionLayer
	kFormType_ColorForm, //	CLFM	BGSColorForm
	kFormType_ReverbParam, //	REVB	BGSReverbParameters
	kFormType_LensFlare, //
	kFormType_Unk88,
	kFormType_VolumetricLighting, //
	kFormType_Unk8A,
	kFormType_Alias, //			BGSBaseAlias
	kFormType_ReferenceAlias, //			BGSRefAlias
	kFormType_LocationAlias, //			BGSLocAlias
	kFormType_ActiveMagicEffect, //			ActiveMagicEffect

	kFormType_Max = kFormType_VolumetricLighting, // max of standard types
	FkFormType_All, //Для инвентаря - вкладка "Все"
	FkFormType_Eat, // Для инвентаря - вкладка "Еда"
}
