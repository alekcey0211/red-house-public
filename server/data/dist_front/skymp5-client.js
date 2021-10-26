var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
/* eslint-disable */
// Generated automatically. Do not edit.
System.register("src/skyrim-platform/skyrimPlatform", [], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {/* eslint-disable */
            // Generated automatically. Do not edit.
        }
    };
});
System.register("src/front/consoleCommands", [], function (exports_2, context_2) {
    "use strict";
    var scriptCommands, consoleCommands;
    var __moduleName = context_2 && context_2.id;
    return {
        setters: [],
        execute: function () {
            exports_2("scriptCommands", scriptCommands = [
                'additem',
                'addperk',
                'addspell',
                'addtofaction',
                'advlevel',
                'AdvSkill',
                'Cast',
                'completequest',
                'DamageActorValue',
                'disable',
                'dispelallspells',
                'drop',
                'duplicateallitems',
                'enable',
                'equipitem',
                'equipspell',
                'equipshout',
                'forceAV',
                'getAV',
                'getAVinfo',
                'getlevel',
                'GetLocationCleared',
                'getrelationshiprank',
                'getstage',
                'hasperk',
                'incPCS',
                'kill',
                'lock',
                'MarkForDelete',
                'modAV',
                'moveto',
                'movetoqt',
                'openactorcontainer',
                'paycrimegold',
                'placeatme',
                // "playidle",
                'pushactoraway',
                'recycleactor',
                'removeallitems',
                'removeitem',
                'removeperk',
                'removespell',
                'resetAI',
                'resethealth',
                'resetinventory',
                'RestoreActorValue',
                'resurrect',
                'say',
                'setactoralpha',
                'setAV',
                'setessential',
                'setghost',
                'setgs',
                'setlevel',
                'SetLocationCleared',
                'setnpcweight',
                'setownership',
                'setrace',
                'setrelationshiprank',
                'setscale',
                'setstage',
                'setunconscious',
                'showinventory',
                'shp',
                'sifh',
                'sqs',
                'stopcombat',
                'str',
                'teachword',
                'unequipitem',
                'unlock',
                'unlockword',
            ]);
            exports_2("consoleCommands", consoleCommands = [
                'Show',
                'ShowVars',
                'ShowGlobalVars',
                'ShowQuestVars',
                'ShowQuests',
                'ShowQuestAliases',
                'SetPapyrusQuestVar',
                'SetPapyrusVar',
                'SetQuestAliases',
                'ClearQuestAliases',
                'ToggleCombatStats',
                'ToggleSafeZone',
                'ToggleAI',
                'ToggleCollisionGeometry',
                'ToggleMaterialGeometry',
                'ToggleStairsGeometry',
                'ToggleBorders',
                'ToggleSky',
                'ToggleWireframe',
                'ToggleCollision',
                'ToggleDebugText',
                'ToggleMenus',
                'TogglePrimitives',
                'ShowScenegraph',
                'ShowScenegraph',
                'ToggleMagicStats',
                'ShowAnim',
                'Show1stPerson',
                'Help',
                'ToggleNavMesh',
                'TogglePathLine',
                'PickRefByID',
                'SetLightingPasses',
                'ToggleLensFlare',
                'SetLensFlareGlobalIntensity',
                'ToggleLODLand',
                'ToggleMapEffect',
                'SetLODObjectDistance',
                'ToggleGrassUpdate',
                'CenterOnCell',
                'CheckRenderTargets',
                'SetGameSetting',
                'SetINISetting',
                'GetINISetting',
                'CenterOnExterior',
                'CalcPathToPoint',
                'CalcLowPathToPoint',
                'SetFog',
                'SetClipDist',
                'ToggleShadowVolumes',
                'SetImageSpaceGlow',
                'ToggleDetection',
                'ToggleHighProcess',
                'ToggleLowProcess',
                'ToggleMiddleLowProcess',
                'ToggleMiddleHighProcess',
                'ToggleAiSchedules',
                'SpeakSound',
                'BetaComment',
                'GameComment',
                'ToggleCellNode',
                'ToggleTrees',
                // "SetCameraFOV",
                'ToggleGodMode',
                'RefreshShaders',
                'ReloadFXP',
                'ToggleScripts',
                'ToggleConversations',
                'ToggleFullHelp',
                'ShowQuestLog',
                'ShowFullQuestLog',
                'DumpTexturePalette',
                'DumpModelMap',
                'CenterOnWorld',
                'ToggleGrass',
                'CreateGrassAt',
                'AddFaceAnimNote',
                'RefreshINI',
                'ToggleEmotions',
                'AddDecal',
                'TestCode',
                'PlayerSpellBook',
                'PrintAiList',
                'ShowQuestTargets',
                'HairTint',
                'SaveGame',
                'LoadGame',
                'DisplayPlayerIDs',
                'SetDisplayPlayerID',
                'TestAllCells',
                'RenderTestCell',
                'RenderTestHere',
                'SaveWorld',
                'ReloadCurrentClimate',
                'ReloadCurrentWeather',
                'TestSeenData',
                'TestLocalMap',
                'MoveToQuestTarget',
                'PrintNPCDialog',
                'ShowSubtitle',
                'ShowRenderPasses',
                'FreezeRenderAccumulation',
                'ToggleOcclusion',
                'OutputMemContexts',
                'OutputMemStats',
                'SetMemCheckPoint',
                'GetMemCheckPoint',
                'IncMemCheckPoint',
                'OutputAllocations',
                'AddWatchAddress',
                'RemoveWatchAddress',
                'ToggleDetectionStats',
                'SetTargetRefraction',
                'SetTargetRefractionFire',
                'ToggleRefractionDebug',
                'ToggleCharControllerShape',
                'ShowHeadTrackTarget',
                'SetCinematicParam',
                'SetTintParam',
                'SetHDRParam',
                'VisualRefPosition',
                'ShowPivot',
                'PrintHDRParam',
                'ToggleHDRDebug',
                'ToggleHDRMultipleLuminance',
                'RevertWorld',
                'OutputArchiveProfile',
                'QuitGame',
                'SaveIniFiles',
                'SetDebugText',
                'ToggleLiteBrite',
                'RunMemoryPass',
                'ResetMemContexts',
                'ToggleWaterSystem',
                'ToggleWaterRadius',
                'ShowWhoDetectsPlayer',
                'ToggleCombatAI',
                'ToggleFlyCam',
                'ModWaterShader',
                'WaterColor',
                'BeginTrace',
                'RunCellTest',
                'StartAllQuests',
                'CompleteAllQuestStages',
                'ToggleFogOfWar',
                'OutputLocalMapPictures',
                'SetGamma',
                'WasteMemory',
                'ClearAdaptedLight',
                'SetHudGlowConstants',
                'CloseFile',
                'SetTreeMipmapBias',
                'SendSherlockDebugText',
                'PlayExplosion',
                'SetMaxAniso',
                'SetMeshLODLevel',
                'SetTargetDOF',
                'ToggleFullScreenMotionBlur',
                'SetTriLinearThreshold',
                'SetVel',
                'DebugCombatBehavior',
                'ToggleCombatDebug',
                'TogglePathingInfoFunction',
                'ShowInventory',
                'ResetPerformanceTimers',
                'ToggleDebugDecal',
                'ToggleDecalRendering',
                'SetImageSpaceModifiersEnable',
                'SetUFOCamSpeedMult',
                'ToggleTestLight',
                'PlaceLocationMarker',
                'ClearLocationMarkers',
                'ToggleMultiboundCheck',
                'AddOcclusionPlane',
                'SetGlobalRadialBlur',
                'OutputTextureUseMap',
                'ClearScreenBlood',
                'ResetDialogueFlags',
                'GetActorValueInfo',
                'ToggleBoundVisGeom',
                'SetConsoleOuputFile',
                'IgnoreRenderPass',
                'PlayVATSCameras',
                'SetTargetFalloff',
                'ToggleActorMover',
                'CopySaves',
                'ToggleEOFImageSpace',
                'ForceFileCache',
                'DumpNiUpdates',
                'TestDegrade',
                'ToggleDepthBias',
                'ToggleSPURenderBatch',
                'ToggleSPUTransformUpdate',
                'ToggleSPUCulling',
                'ModifyFaceGen',
                'GetSKSEVersion',
                'SetEmitterParticleMax',
                'SetMPSParticleMax',
                'SetTaskThreadSleep',
                'SetTaskThreadUpdateSleep',
                'EvalActorTextures',
                'CreateSaveData',
                'CreateGameData',
                'LoadFlashMovie',
                'ShowMenu',
                'HideMenu',
                'RecvAnimEvent',
                'RunConsoleBatch',
                'LTGraph',
                'RTGraph',
                'ToggleHeapTracking',
                'TogglePoolTracking',
                'RumbleManager',
                'InstallMemoryTracker',
                'UninstallMemoryTracker',
                'CheckMemory',
                'SetStackDepth',
                'PathToRef',
                'StartAIControlledRobotTest',
                'TestHandleManagerWarnAndKillSDM',
                'SetFaceTarget',
                'PrecomputedLOSGeneration',
                'PrecomputedLOSDebug',
                'SetPathSprinting',
                'SetAnimGraphVar',
                'SetTreeTrunkFlexibility',
                'SetTreeBranchFlexibility',
                'SetTreeBranchAnimationRange',
                'SetTreeLeafFlexibility',
                'SetTreeLeafAmplitude',
                'SetTreeLeafFrequency',
                'SetTreeWindDirection',
                'SetTreeWindMagnitude',
                'SetBloodParam',
                'RegisterPrefix',
                'ToggleEventLog',
                'ExportPerfTrackingData',
                'DisplayGraphVariable',
                'ToggleMotionDriven',
                'ToggleControlsDriven',
                'ToggleGUIOverlay',
                'ModifyGUIOverlay',
                'SetActionComplete',
                'SetConsoleScopeQuest',
                'GetDistanceFromActorsPath',
                'ClearConsole',
                'ToggleMarkers',
                'KillAllProjectiles',
                'PlayTerrainEffect',
                'CellInfo',
                'Textures',
                'Timing',
                'Polygons',
                'Actors',
                'Quest',
                'Particles',
                'Memory',
                'ShowNodes',
                'SaveDebugTextPages',
                'OutputFixedStringTable',
                'AttachPapyrusScript',
                'SaveHavokSnapshot',
                'SetNPCWeight',
                'ShowClosestLocationForSphere',
                'PrintShaderMacros',
                'ToggleAudioOverlay',
                'TogglePapyrusLog',
                'ToggleContextOverlay',
                'ForceOutOfMemory',
                'ToggleMovement',
                'ToggleAnimations',
                'SetWarning',
                'TestFadeNodes',
                'ShowLowMaxHeights',
                'ShowHighMaxHeights',
                'EnableStoryManagerLogging',
                'SetFramebufferRange',
                'DumpPapyrusStacks',
                'DumpPapyrusUpdates',
                'SoundCatMod',
                'RunCompaction',
                'ToggleAnimatorCam',
                'ToggleImmortalMode',
                'SetSubgraphToDebug',
                'EnableRumble',
                'HavokVDBCapture',
                'ToggleMapCam',
                'ToggleNavmeshInfo',
                'PlaySyncAnim',
                'SetFormKnown',
                'SetDebugQuest',
                'SetQuestAliasLogging',
                'SetRace',
                'FindForm',
                'StartPapyrusScriptProfile',
                'StopPapyrusScriptProfile',
                'StartPapyrusFormProfile',
                'StopPapyrusFormProfile',
                'PrintQuestSceneInfo',
                'IsInvulnerable',
                'ExportInventoryItemInfo',
                'CollisionMesh',
                'IsolateRendering',
                'ToggleWaterCurrentGeometry',
                'PerformAction',
                'StartTrackPlayerDoors',
                'StopTrackPlayerDoors',
                'CheckPlayerDoors',
                'ToggleSPUMovement',
                'SetInChargen',
                'ClearAchievement',
                'ForceReset',
                'ReloadScript',
                'ForceCloseFiles',
                'HotLoadPlugin',
                'ToggleVerletDebug',
                'DumpConditionFunctions',
                'PlaceFurnitureTester',
                'DumpLoadedAnimationFiles',
                'FunctionDisplayRenderTarget',
                'ToggleParallaxOcclusion',
                'ToggleProjectedUVDiffuseNormals',
                'ReloadProjectedUVTextures',
                'FunctionToggleDownsampleCS',
                'FunctionToggleVolumetricLighting',
                'FunctionToggleVolumetricLighting',
                'FunctionToggleVolumetricLightingTemporalAccumulation',
                'FunctionSetVolumetricLightingParameters',
                'FunctionPrintVolumetricLightingParameters',
                'FunctionSetVolumetricLightingResolution',
                'ToggleCastShadows',
                'SetShadowParameter',
                'SetESRAMSetup',
                'ToggleESRAM',
                'ToggleMTR',
                'ToggleHTile',
                'ToggleZPrepassOutput',
                'ToggleFXAA',
                'SetJobListBatch',
                'SetJobListThread',
                'JobListTool',
                'SetCullingProcessCount',
                ' ConfigureIBL',
                'ToggleDOF',
                'ToggleDDOF',
                'ConfigureDDOF',
                'SetLightingColourClamp',
                'ChangeSnowParameters',
                'ToggleFog',
                'ToggleHDR',
                'ToggleStippleFade',
                'ToggleLandFade',
                'ResetGrassFade',
                ' ToggleAR',
                ' ToggleAVL',
                ' ToggleBC',
                ' ToggleIBLF',
                ' ToggleBCS',
                ' ToggleCLFVL',
                ' ToggleCSRCS',
                ' ToggleDS',
                ' ToggleIBEPF',
                ' ToggleLC',
                ' TogglePNCS',
                ' ToggleR',
                ' ToggleSAO',
                ' ToggleSAOCS',
                ' ToggleIL',
                ' ToggleSC',
                ' ToggleSSSS',
                ' ToggleTAA',
                ' ToggleUDR',
                ' ToggleWB',
                ' ToggleUM',
                ' ConfigureAR',
                ' ConfigureAVL',
                ' ConfigureBC',
                ' ConfigureIBLF',
                ' ConfigureBCS',
                ' ConfigureCLFVL',
                ' ConfigureCSRCS',
                ' ConfigureDS',
                ' ConfigureIBEPF',
                ' ConfigureLC',
                ' ConfigurePNCS',
                ' ConfigureR',
                ' ConfigureSAO',
                ' ConfigureSAOCS',
                ' ConfigureIL',
                ' ConfigureSC',
                ' ConfigureSSSS',
                ' ConfigureTAA',
                ' ConfigureUDR',
                ' ConfigureWB',
                ' ConfigureUM',
                'SyncCharacterFromSaveFile',
                'PreloadLinkedInteriors',
                'ResizeLargeRefLODGrid',
                'DisplaySaveCacheStatus',
                'AuditionSoundDescriptor',
                'TogglePrecipitationOcclusionMap',
                'ToggleTrijuice',
                'ToggleWaterJittering',
                'ToggleAlphaEffectJittering',
                'ExtractMod',
                'InstallMod',
                'UninstallMod',
                'DeleteMod',
                'BuildBNetModArchive',
                'ToggleEarlyZ',
                'ToggleDepthShift',
                'TogglePostponeBlurryEffect',
                'CharacterLight',
                'ClearMotionVectors',
                'ToggleTAAWaterBlending',
                'ToggleDecompressToCopy',
                'BNetLogin',
                'BNetLoginSSO',
                'BNetLogout',
                'IsLoggedIn',
                'BNetCreateAccount',
                'BNetLinkAccount',
                'BNetUnlinkAccount',
                'RequestOTP',
                'VerifyOTP',
                'GetLegalDocs',
                'AcceptLegalDoc',
                'SubscribeUGC',
                'UnsubscribeUGC',
                'GetSubscribedList',
                'FollowUGC',
                'UnfollowUGC',
                'GetFollowedList',
                'GetUGCDetails',
                'DownloadUGC',
                'DynamicResolution',
            ]);
        }
    };
});
System.register("src/lib/structures/movement", [], function (exports_3, context_3) {
    "use strict";
    var __moduleName = context_3 && context_3.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("src/lib/structures/look", [], function (exports_4, context_4) {
    "use strict";
    var __moduleName = context_4 && context_4.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("src/lib/structures/inventory", [], function (exports_5, context_5) {
    "use strict";
    var __moduleName = context_5 && context_5.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("src/front/spSnippet", ["src/skyrim-platform/skyrimPlatform"], function (exports_6, context_6) {
    "use strict";
    var skyrimPlatform_1, sp, spAny, deserializeArg, runMethod, runStatic, run;
    var __moduleName = context_6 && context_6.id;
    return {
        setters: [
            function (skyrimPlatform_1_1) {
                skyrimPlatform_1 = skyrimPlatform_1_1;
                sp = skyrimPlatform_1_1;
            }
        ],
        execute: function () {
            spAny = sp;
            deserializeArg = function (arg) {
                if (typeof arg === 'object') {
                    var form = skyrimPlatform_1.Game.getFormEx(arg.formId);
                    var gameObject = spAny[arg.type].from(form);
                    return gameObject;
                }
                return arg;
            };
            runMethod = function (snippet) { return __awaiter(void 0, void 0, void 0, function () {
                var self, selfCasted, f;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            self = skyrimPlatform_1.Game.getFormEx(snippet.selfId);
                            if (!self)
                                throw new Error("Unable to find form with id " + snippet.selfId.toString(16));
                            selfCasted = spAny[snippet.class].from(self);
                            if (!selfCasted)
                                throw new Error("Form " + snippet.selfId.toString(16) + " is not instance of " + snippet.class);
                            f = selfCasted[snippet.function];
                            return [4 /*yield*/, f.apply(selfCasted, snippet.arguments.map(function (arg) { return deserializeArg(arg); }))];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            }); };
            runStatic = function (snippet) { return __awaiter(void 0, void 0, void 0, function () {
                var papyrusClass;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            papyrusClass = spAny[snippet.class];
                            return [4 /*yield*/, papyrusClass[snippet.function].apply(papyrusClass, snippet.arguments.map(function (arg) { return deserializeArg(arg); }))];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            }); };
            exports_6("run", run = function (snippet) { return __awaiter(void 0, void 0, void 0, function () {
                var form, sign, count, soundId;
                return __generator(this, function (_a) {
                    if (snippet.class === 'SkympHacks') {
                        if (snippet.function === 'AddItem' || snippet.function === 'RemoveItem') {
                            form = skyrimPlatform_1.Form.from(deserializeArg(snippet.arguments[0]));
                            sign = snippet.function === 'AddItem' ? '+' : '-';
                            count = snippet.arguments[1];
                            soundId = 0x334ab;
                            if (form.getFormID() !== 0xf)
                                soundId = 0x14115;
                            sp.Sound.from(skyrimPlatform_1.Game.getFormEx(soundId)).play(skyrimPlatform_1.Game.getPlayer());
                            if (count > 0)
                                sp.Debug.notification(sign + " " + form.getName() + " (" + count + ")");
                        }
                        else
                            throw new Error("Unknown SkympHack - " + snippet.function);
                        return [2 /*return*/];
                    }
                    return [2 /*return*/, snippet.selfId ? runMethod(snippet) : runStatic(snippet)];
                });
            }); });
        }
    };
});
System.register("src/front/components/inventory", ["src/skyrim-platform/skyrimPlatform"], function (exports_7, context_7) {
    "use strict";
    var skyrimPlatform_2, cropName, extrasEqual, hasExtras, extractExtraData, squash, getExtraContainerChangesAsInventory, getBaseContainerAsInventory, sumInventories, getDiff, getInventory, basesReset, resetBase, applyInventory;
    var __moduleName = context_7 && context_7.id;
    return {
        setters: [
            function (skyrimPlatform_2_1) {
                skyrimPlatform_2 = skyrimPlatform_2_1;
            }
        ],
        execute: function () {
            // 'aaaaaaaaaaaaaaaa' => 'aaa...'
            cropName = function (s) {
                if (!s)
                    return s;
                var max = 128;
                return s.length >= max
                    ? s
                        .split('')
                        .filter(function (x, i) { return i < max; })
                        .join('')
                        .concat('...')
                    : s;
            };
            extrasEqual = function (a, b, ignoreWorn) {
                if (ignoreWorn === void 0) { ignoreWorn = false; }
                return (a.health === b.health &&
                    a.enchantmentId === b.enchantmentId &&
                    a.maxCharge === b.maxCharge &&
                    !!a.removeEnchantmentOnUnequip === !!b.removeEnchantmentOnUnequip &&
                    a.chargePercent === b.chargePercent &&
                    // namesEqual(a, b) &&
                    a.soul === b.soul &&
                    a.poisonId === b.poisonId &&
                    a.poisonCount === b.poisonCount &&
                    ((!!a.worn === !!b.worn && !!a.wornLeft === !!b.wornLeft) || ignoreWorn));
            };
            hasExtras = function (e) {
                return !extrasEqual(e, { baseId: 0, count: 0 });
            };
            extractExtraData = function (refr, extraList, out) {
                // I see that ExtraWorn is not emitted for 0xFF actors when arrows are equipped. Fixing
                var item = skyrimPlatform_2.Game.getFormEx(out.baseId);
                if (skyrimPlatform_2.Ammo.from(item)) {
                    var actor = skyrimPlatform_2.Actor.from(refr);
                    if (actor && actor.isEquipped(item)) {
                        out.worn = true;
                    }
                }
                (extraList || []).forEach(function (extra) {
                    switch (extra.type) {
                        case 'Health':
                            out.health = Math.round(extra.health * 10) / 10;
                            // TESModPlatform::AddItemEx makes all items at least 1.01 health
                            if (out.health === 1) {
                                delete out.health;
                            }
                            break;
                        case 'Count':
                            out.count = extra.count;
                            break;
                        case 'Enchantment':
                            out.enchantmentId = extra.enchantmentId;
                            out.maxCharge = extra.maxCharge;
                            out.removeEnchantmentOnUnequip = extra.removeOnUnequip;
                            break;
                        case 'Charge':
                            out.chargePercent = extra.charge;
                            break;
                        case 'Poison':
                            out.poisonId = extra.poisonId;
                            out.poisonCount = extra.count;
                            break;
                        case 'Soul':
                            out.soul = extra.soul;
                            break;
                        case 'TextDisplayData':
                            out.name = extra.name;
                            break;
                        case 'Worn':
                            out.worn = true;
                            break;
                        case 'WornLeft':
                            out.wornLeft = true;
                            break;
                    }
                });
            };
            squash = function (inv) {
                var res = new Array();
                inv.entries.forEach(function (e) {
                    var same = res.find(function (x) { return e.baseId === x.baseId && extrasEqual(x, e); });
                    if (same) {
                        same.count += e.count;
                    }
                    else {
                        res.push(JSON.parse(JSON.stringify(e)));
                    }
                });
                return { entries: res.filter(function (x) { return x.count !== 0; }) };
            };
            getExtraContainerChangesAsInventory = function (refr) {
                var extraContainerChanges = skyrimPlatform_2.getExtraContainerChanges(refr.getFormID());
                var entries = new Array();
                extraContainerChanges.forEach(function (changesEntry) {
                    var entry = {
                        baseId: changesEntry.baseId,
                        count: changesEntry.countDelta,
                    };
                    (changesEntry.extendDataList || []).forEach(function (extraList) {
                        var e = {
                            baseId: entry.baseId,
                            count: 1,
                        };
                        extractExtraData(refr, extraList, e);
                        entries.push(e);
                        entry.count -= e.count;
                    });
                    if (entry.count !== 0)
                        entries.push(entry);
                });
                var res = { entries: entries };
                res = squash(res);
                return res;
            };
            getBaseContainerAsInventory = function (refr) {
                return { entries: skyrimPlatform_2.getContainer(refr.getBaseObject().getFormID()) };
            };
            sumInventories = function (lhs, rhs) {
                var leftEntriesWithExtras = lhs.entries.filter(function (e) { return hasExtras(e); });
                var rightEntriesWithExtras = rhs.entries.filter(function (e) { return hasExtras(e); });
                var leftEntriesSimple = lhs.entries.filter(function (e) { return !hasExtras(e); });
                var rightEntriesSimple = rhs.entries.filter(function (e) { return !hasExtras(e); });
                leftEntriesSimple.forEach(function (e) {
                    var matching = rightEntriesSimple.find(function (x) { return x.baseId === e.baseId; });
                    if (matching) {
                        e.count += matching.count;
                        matching.count = 0;
                    }
                });
                return {
                    entries: leftEntriesWithExtras
                        .concat(rightEntriesWithExtras)
                        .concat(leftEntriesSimple)
                        .concat(rightEntriesSimple)
                        .filter(function (e) { return e.count !== 0; }),
                };
            };
            exports_7("getDiff", getDiff = function (lhs, rhs, ignoreWorn) {
                var lhsCopy = JSON.parse(JSON.stringify(lhs));
                var rhsCopy = JSON.parse(JSON.stringify(rhs));
                rhsCopy.entries.forEach(function (e) {
                    var sameFromLeft = lhsCopy.entries.find(function (x) { return x.baseId === e.baseId && extrasEqual(x, e, ignoreWorn); });
                    if (sameFromLeft) {
                        sameFromLeft.count -= e.count;
                    }
                    else {
                        lhsCopy.entries.push(e);
                        lhsCopy.entries[lhsCopy.entries.length - 1].count *= -1;
                    }
                });
                return { entries: lhsCopy.entries.filter(function (x) { return x.count !== 0; }) };
            });
            exports_7("getInventory", getInventory = function (refr) {
                return squash(sumInventories(getBaseContainerAsInventory(refr), getExtraContainerChangesAsInventory(refr)));
            });
            basesReset = function () {
                if (skyrimPlatform_2.storage.basesResetExists !== true) {
                    skyrimPlatform_2.storage.basesResetExists = true;
                    skyrimPlatform_2.storage.basesReset = new Set();
                }
                return skyrimPlatform_2.storage.basesReset;
            };
            resetBase = function (refr) {
                var base = refr.getBaseObject();
                var baseId = base ? base.getFormID() : 0;
                if (!basesReset().has(baseId)) {
                    basesReset().add(baseId);
                    skyrimPlatform_2.TESModPlatform.resetContainer(base);
                    refr.removeAllItems(null, false, true);
                }
            };
            exports_7("applyInventory", applyInventory = function (refr, newInventory, enableCrashProtection, ignoreWorn) {
                if (ignoreWorn === void 0) { ignoreWorn = false; }
                resetBase(refr);
                var diff = getDiff(newInventory, getInventory(refr), ignoreWorn).entries;
                var res = true;
                diff.sort(function (a, b) { return (a.count < b.count ? -1 : 1); });
                diff.forEach(function (e, i) {
                    if (i > 0 && enableCrashProtection) {
                        res = false;
                        return;
                    }
                    var absCount = Math.abs(e.count);
                    var queueNiNodeUpdateNeeded = false;
                    var worn = !!e.worn;
                    var wornLeft = !!e.wornLeft;
                    var oneStepCount = e.count / absCount;
                    if (absCount > 1000) {
                        absCount = 1;
                        oneStepCount = 1;
                        // Also for arrows with strange count
                        if (worn && e.count < 0)
                            absCount = 0;
                    }
                    if (e.count > 1 && skyrimPlatform_2.Ammo.from(skyrimPlatform_2.Game.getFormEx(e.baseId))) {
                        absCount = 1;
                        oneStepCount = e.count;
                        if (e.count > 60000) {
                            // Why would actor have 60k arrows?
                            e.count = 1;
                        }
                    }
                    for (var i_1 = 0; i_1 < absCount; ++i_1) {
                        if (worn || wornLeft) {
                            skyrimPlatform_2.TESModPlatform.pushWornState(!!worn, !!wornLeft);
                            queueNiNodeUpdateNeeded = true;
                        }
                        var f = skyrimPlatform_2.Game.getFormEx(e.baseId);
                        if (!f)
                            skyrimPlatform_2.printConsole("Bad form ID " + e.baseId.toString(16));
                        else {
                            skyrimPlatform_2.TESModPlatform.addItemEx(refr, f, oneStepCount, e.health ? e.health : 1, e.enchantmentId ? skyrimPlatform_2.Enchantment.from(skyrimPlatform_2.Game.getFormEx(e.enchantmentId)) : null, e.maxCharge ? e.maxCharge : 0, !!e.removeEnchantmentOnUnequip, e.chargePercent ? e.chargePercent : 0, e.name ? cropName(e.name) : f.getName(), e.soul ? e.soul : 0, e.poisonId ? skyrimPlatform_2.Potion.from(skyrimPlatform_2.Game.getFormEx(e.poisonId)) : null, e.poisonCount ? e.poisonCount : 0);
                        }
                    }
                    if (queueNiNodeUpdateNeeded) {
                        var ac = skyrimPlatform_2.Actor.from(refr);
                        if (ac) {
                            ac.queueNiNodeUpdate();
                        }
                    }
                });
                return res;
            });
        }
    };
});
System.register("src/front/components/equipment", ["src/skyrim-platform/skyrimPlatform", "src/front/components/inventory"], function (exports_8, context_8) {
    "use strict";
    var skyrimPlatform_3, inventory_1, filterWorn, removeUnnecessaryExtra, getEquipment, applyEquipment, isBadMenuShown;
    var __moduleName = context_8 && context_8.id;
    return {
        setters: [
            function (skyrimPlatform_3_1) {
                skyrimPlatform_3 = skyrimPlatform_3_1;
            },
            function (inventory_1_1) {
                inventory_1 = inventory_1_1;
            }
        ],
        execute: function () {
            filterWorn = function (inv) {
                return { entries: inv.entries.filter(function (x) { return x.worn || x.wornLeft; }) };
            };
            removeUnnecessaryExtra = function (inv) {
                return {
                    entries: inv.entries.map(function (x) {
                        var r = JSON.parse(JSON.stringify(x));
                        r.chargePercent = r.maxCharge;
                        r.count = skyrimPlatform_3.Ammo.from(skyrimPlatform_3.Game.getFormEx(x.baseId)) ? 1000 : 1;
                        delete r.name;
                        return r;
                    }),
                };
            };
            exports_8("getEquipment", getEquipment = function (ac, numChanges) {
                return { inv: inventory_1.getInventory(ac), numChanges: numChanges };
            });
            exports_8("applyEquipment", applyEquipment = function (ac, eq) {
                return inventory_1.applyInventory(ac, removeUnnecessaryExtra(filterWorn(eq.inv)), true);
            });
            exports_8("isBadMenuShown", isBadMenuShown = function () {
                return (skyrimPlatform_3.Ui.isMenuOpen('InventoryMenu') ||
                    skyrimPlatform_3.Ui.isMenuOpen('FavoritesMenu') ||
                    skyrimPlatform_3.Ui.isMenuOpen('MagicMenu') ||
                    skyrimPlatform_3.Ui.isMenuOpen('ContainerMenu') ||
                    skyrimPlatform_3.Ui.isMenuOpen('Crafting Menu') // Actually I don't think it causes crashes
                );
            });
        }
    };
});
System.register("src/front/components/actorvalues", [], function (exports_9, context_9) {
    "use strict";
    var getActorValues, setActorValuePercentage;
    var __moduleName = context_9 && context_9.id;
    return {
        setters: [],
        execute: function () {
            exports_9("getActorValues", getActorValues = function (ac) {
                if (!ac)
                    return { health: 0, stamina: 0, magicka: 0 };
                var healthPercentage = ac.isDead() ? 0 : ac.getActorValuePercentage('health');
                var staminaPercentage = ac.getActorValuePercentage('stamina');
                var magickaPercentage = ac.getActorValuePercentage('magicka');
                var resultActorValue = {
                    health: healthPercentage,
                    stamina: staminaPercentage,
                    magicka: magickaPercentage,
                };
                return resultActorValue;
            });
            exports_9("setActorValuePercentage", setActorValuePercentage = function (ac, avName, percentage) {
                var currentPercentage = ac.getActorValuePercentage(avName);
                if (currentPercentage === percentage)
                    return;
                var currentMax = ac.getBaseActorValue(avName);
                var deltaPercentage = percentage - currentPercentage;
                var k = 1;
                if (deltaPercentage > 0) {
                    ac.restoreActorValue(avName, deltaPercentage * currentMax * k);
                }
                else if (deltaPercentage < 0) {
                    ac.damageActorValue(avName, deltaPercentage * currentMax * k);
                }
            });
        }
    };
});
System.register("src/front/components/movementApply", ["src/skyrim-platform/skyrimPlatform", "src/front/components/actorvalues"], function (exports_10, context_10) {
    "use strict";
    var skyrimPlatform_4, actorvalues_1, applyMovement, keepOffsetFromActor, getOffsetZ, applySprinting, applyBlocking, applySneaking, applyWeapDrawn, applyHealthPercentage, teleportDistance, bigAngleDiff, translateTo, teleportIfNeed, cellWidth, isInDifferentExteriorCell, isInDifferentWorldOrCell, getPos, getDistance;
    var __moduleName = context_10 && context_10.id;
    return {
        setters: [
            function (skyrimPlatform_4_1) {
                skyrimPlatform_4 = skyrimPlatform_4_1;
            },
            function (actorvalues_1_1) {
                actorvalues_1 = actorvalues_1_1;
            }
        ],
        execute: function () {
            exports_10("applyMovement", applyMovement = function (refr, m) {
                if (teleportIfNeed(refr, m))
                    return;
                translateTo(refr, m);
                var ac = skyrimPlatform_4.Actor.from(refr);
                if (ac) {
                    var lookAt = undefined;
                    if (m.lookAt) {
                        try {
                            lookAt = skyrimPlatform_4.Game.findClosestActor(m.lookAt[0], m.lookAt[1], m.lookAt[2], 128);
                        }
                        catch (e) {
                            lookAt = null;
                        }
                    }
                    if (lookAt) {
                        ac.setHeadTracking(true);
                        ac.setLookAt(lookAt, false);
                    }
                    else {
                        ac.setHeadTracking(false);
                    }
                    ac.blockActivation(true);
                    keepOffsetFromActor(ac, m);
                    applySprinting(ac, m.runMode === 'Sprinting');
                    applyBlocking(ac, m);
                    applySneaking(ac, m.isSneaking);
                    applyWeapDrawn(ac, m.isWeapDrawn);
                    applyHealthPercentage(ac, m.healthPercentage);
                }
            });
            keepOffsetFromActor = function (ac, m) {
                var offsetAngle = m.rot[2] - ac.getAngleZ();
                if (Math.abs(offsetAngle) < 5)
                    offsetAngle = 0;
                if (m.runMode === 'Standing') {
                    return ac.keepOffsetFromActor(ac, 0, 0, 0, 0, 0, offsetAngle, 1, 1);
                }
                var offset = [
                    3 * Math.sin((m.direction / 180) * Math.PI),
                    3 * Math.cos((m.direction / 180) * Math.PI),
                    getOffsetZ(m.runMode),
                ];
                ac.keepOffsetFromActor(ac, offset[0], offset[1], offset[2], 0, 0, offsetAngle, m.runMode === 'Walking' ? 2048 : 1, 1);
            };
            getOffsetZ = function (runMode) {
                switch (runMode) {
                    case 'Walking':
                        return -512;
                    case 'Running':
                        return -1024;
                }
                return 0;
            };
            applySprinting = function (ac, isSprinting) {
                if (ac.isSprinting() !== isSprinting) {
                    skyrimPlatform_4.Debug.sendAnimationEvent(ac, isSprinting ? 'SprintStart' : 'SprintStop');
                }
            };
            applyBlocking = function (ac, m) {
                if (ac.getAnimationVariableBool('IsBlocking') !== m.isBlocking) {
                    skyrimPlatform_4.Debug.sendAnimationEvent(ac, m.isBlocking ? 'BlockStart' : 'BlockStop');
                    skyrimPlatform_4.Debug.sendAnimationEvent(ac, m.isSneaking ? 'SneakStart' : 'SneakStop');
                }
            };
            applySneaking = function (ac, isSneaking) {
                var currentIsSneaking = ac.isSneaking() || ac.getAnimationVariableBool('IsSneaking');
                if (currentIsSneaking !== isSneaking) {
                    skyrimPlatform_4.Debug.sendAnimationEvent(ac, isSneaking ? 'SneakStart' : 'SneakStop');
                }
            };
            exports_10("applyWeapDrawn", applyWeapDrawn = function (ac, isWeapDrawn) {
                if (ac.isWeaponDrawn() !== isWeapDrawn) {
                    skyrimPlatform_4.TESModPlatform.setWeaponDrawnMode(ac, isWeapDrawn ? 1 : 0);
                }
            });
            applyHealthPercentage = function (ac, healthPercentage) {
                actorvalues_1.setActorValuePercentage(ac, 'health', healthPercentage);
            };
            teleportDistance = 64;
            bigAngleDiff = 80;
            translateTo = function (refr, m) {
                var distance = getDistance(getPos(refr), m.pos);
                var time = 0.1;
                if (m.isInJumpState || m.runMode != 'Standing')
                    time = 0.2;
                var speed = distance / time;
                var angleDiff = Math.abs(m.rot[2] - refr.getAngleZ());
                if (m.runMode !== 'Standing' || m.isInJumpState || distance > teleportDistance || angleDiff > bigAngleDiff) {
                    var actor = skyrimPlatform_4.Actor.from(refr);
                    if (actor && actor.getActorValue('Variable10') < -999)
                        return; // needs to be improved
                    if (!actor || !actor.isDead()) {
                        refr.translateTo(m.pos[0], m.pos[1], m.pos[2], m.rot[0], m.rot[1], m.rot[2], speed, 0);
                    }
                }
            };
            teleportIfNeed = function (refr, m) {
                if (isInDifferentWorldOrCell(refr, m.worldOrCell) || (!refr.is3DLoaded() && isInDifferentExteriorCell(refr, m.pos))) {
                    throw new Error('needs to be respawned');
                }
                return false;
            };
            cellWidth = 4096;
            isInDifferentExteriorCell = function (refr, pos) {
                var currentPos = getPos(refr);
                var playerPos = getPos(skyrimPlatform_4.Game.getPlayer());
                var targetDistanceToPlayer = getDistance(playerPos, pos);
                var currentDistanceToPlayer = getDistance(playerPos, currentPos);
                return currentDistanceToPlayer > cellWidth && targetDistanceToPlayer <= cellWidth;
            };
            isInDifferentWorldOrCell = function (refr, worldOrCell) {
                return worldOrCell !== (refr.getWorldSpace() || refr.getParentCell()).getFormID();
            };
            getPos = function (refr) {
                return [refr.getPositionX(), refr.getPositionY(), refr.getPositionZ()];
            };
            getDistance = function (a, b) {
                var r = 0;
                a.forEach(function (v, i) {
                    r += Math.pow((a[i] - b[i]), 2);
                });
                return Math.sqrt(r);
            };
        }
    };
});
System.register("src/front/components/movementGet", ["src/skyrim-platform/skyrimPlatform"], function (exports_11, context_11) {
    "use strict";
    var skyrimPlatform_5, getMovement, isSneaking, getRunMode;
    var __moduleName = context_11 && context_11.id;
    return {
        setters: [
            function (skyrimPlatform_5_1) {
                skyrimPlatform_5 = skyrimPlatform_5_1;
            }
        ],
        execute: function () {
            exports_11("getMovement", getMovement = function (refr) {
                var ac = skyrimPlatform_5.Actor.from(refr);
                // It is running for ObjectReferences because Standing
                // Doesn't lead to translateTo call
                var runMode = ac ? getRunMode(ac) : 'Running';
                var healthPercentage = ac && ac.getActorValuePercentage('health');
                if (ac && ac.isDead()) {
                    healthPercentage = 0;
                }
                var lookAt;
                if (ac.getFormID() !== 0x14) {
                    var combatTarget = ac.getCombatTarget();
                    if (combatTarget) {
                        lookAt = [combatTarget.getPositionX(), combatTarget.getPositionY(), combatTarget.getPositionZ()];
                    }
                }
                return {
                    worldOrCell: (refr.getWorldSpace() || refr.getParentCell()).getFormID(),
                    pos: [refr.getPositionX(), refr.getPositionY(), refr.getPositionZ()],
                    rot: [refr.getAngleX(), refr.getAngleY(), refr.getAngleZ()],
                    runMode: runMode,
                    direction: runMode !== 'Standing' ? 360 * refr.getAnimationVariableFloat('Direction') : 0,
                    isInJumpState: (ac && ac.getAnimationVariableBool('bInJumpState')),
                    isSneaking: (ac && isSneaking(ac)),
                    isBlocking: (ac && ac.getAnimationVariableBool('IsBlocking')),
                    isWeapDrawn: (ac && ac.isWeaponDrawn()),
                    healthPercentage: healthPercentage,
                    lookAt: lookAt,
                };
            });
            isSneaking = function (ac) { return ac.isSneaking() || ac.getAnimationVariableBool('IsSneaking'); };
            getRunMode = function (ac) {
                if (ac.isSprinting())
                    return 'Sprinting';
                var speed = ac.getAnimationVariableFloat('SpeedSampled');
                if (!speed)
                    return 'Standing';
                var isRunning = true;
                if (ac.getFormID() === 0x14) {
                    if (!skyrimPlatform_5.TESModPlatform.isPlayerRunningEnabled() || speed < 150)
                        isRunning = false;
                }
                else if (!ac.isRunning() || speed < 150)
                    isRunning = false;
                if (ac.getAnimationVariableFloat('IsBlocking')) {
                    isRunning = isSneaking(ac);
                }
                var carryWeight = ac.getActorValue('CarryWeight');
                var totalItemWeight = ac.getTotalItemWeight();
                if (carryWeight < totalItemWeight)
                    isRunning = false;
                return isRunning ? 'Running' : 'Walking';
            };
        }
    };
});
System.register("src/front/components/movement", ["src/front/components/movementApply", "src/front/components/movementGet"], function (exports_12, context_12) {
    "use strict";
    var movementApply, applyMovement, movementGet, getMovement;
    var __moduleName = context_12 && context_12.id;
    return {
        setters: [
            function (movementApply_1) {
                movementApply = movementApply_1;
            },
            function (movementGet_1) {
                movementGet = movementGet_1;
            }
        ],
        execute: function () {
            exports_12("applyMovement", applyMovement = movementApply.applyMovement);
            exports_12("getMovement", getMovement = movementGet.getMovement);
        }
    };
});
System.register("src/front/components/animation", ["src/skyrim-platform/skyrimPlatform", "src/front/components/movementApply"], function (exports_13, context_13) {
    "use strict";
    var skyrimPlatform_6, movementApply_2, allowedIdles, refsWithDefaultAnimsDisabled, allowedAnims, isIdle, applyAnimation, setDefaultAnimsDisabled, AnimationSource, ignoredAnims, setupHooks;
    var __moduleName = context_13 && context_13.id;
    return {
        setters: [
            function (skyrimPlatform_6_1) {
                skyrimPlatform_6 = skyrimPlatform_6_1;
            },
            function (movementApply_2_1) {
                movementApply_2 = movementApply_2_1;
            }
        ],
        execute: function () {
            allowedIdles = new Array();
            refsWithDefaultAnimsDisabled = new Set();
            allowedAnims = new Set();
            isIdle = function (animEventName) {
                return (animEventName === 'MotionDrivenIdle' ||
                    (animEventName.startsWith('Idle') && animEventName !== 'IdleStop' && animEventName !== 'IdleForceDefaultState'));
            };
            exports_13("applyAnimation", applyAnimation = function (refr, anim, state) {
                if (state.lastNumChanges === anim.numChanges)
                    return;
                state.lastNumChanges = anim.numChanges;
                if (isIdle(anim.animEventName)) {
                    allowedIdles.push([refr.getFormID(), anim.animEventName]);
                }
                if (anim.animEventName === 'SkympFakeEquip') {
                    var ac = skyrimPlatform_6.Actor.from(refr);
                    if (ac)
                        movementApply_2.applyWeapDrawn(ac, true);
                }
                else if (anim.animEventName === 'SkympFakeUnequip') {
                    var ac = skyrimPlatform_6.Actor.from(refr);
                    if (ac)
                        movementApply_2.applyWeapDrawn(ac, false);
                }
                else if (anim.animEventName === 'Ragdoll') {
                    var ac = skyrimPlatform_6.Actor.from(refr);
                    if (ac) {
                        ac.pushActorAway(ac, 0);
                        ac.setActorValue('Variable10', -1000);
                    }
                }
                else {
                    if (refsWithDefaultAnimsDisabled.has(refr.getFormID())) {
                        if (anim.animEventName.toLowerCase().includes('attack')) {
                            allowedAnims.add(refr.getFormID() + ":" + anim.animEventName);
                        }
                    }
                    skyrimPlatform_6.Debug.sendAnimationEvent(refr, anim.animEventName);
                    if (anim.animEventName === 'GetUpBegin') {
                        var refrId_1 = refr.getFormID();
                        skyrimPlatform_6.Utility.wait(1).then(function () {
                            var ac = skyrimPlatform_6.Actor.from(skyrimPlatform_6.Game.getFormEx(refrId_1));
                            if (ac)
                                ac.setActorValue('Variable10', 1000);
                        });
                    }
                }
            });
            exports_13("setDefaultAnimsDisabled", setDefaultAnimsDisabled = function (refrId, disabled) {
                if (disabled)
                    refsWithDefaultAnimsDisabled.add(refrId);
                else
                    refsWithDefaultAnimsDisabled.delete(refrId);
            });
            AnimationSource = /** @class */ (function () {
                function AnimationSource(refr) {
                    var _this = this;
                    this.refrId = 0;
                    this.numChanges = 0;
                    this.animEventName = '';
                    this.weapNonDrawnBlocker = 0;
                    this.weapDrawnBlocker = 0;
                    this.sneakBlocker = null;
                    this.refrId = refr.getFormID();
                    skyrimPlatform_6.hooks.sendAnimationEvent.add({
                        enter: function () { },
                        leave: function (ctx) {
                            if (ctx.selfId !== _this.refrId)
                                return;
                            if (!ctx.animationSucceeded)
                                return;
                            _this.onSendAnimationEvent(ctx.animEventName);
                        },
                    });
                }
                AnimationSource.prototype.filterMovement = function (mov) {
                    if (this.weapDrawnBlocker >= Date.now())
                        mov.isWeapDrawn = true;
                    if (this.weapNonDrawnBlocker >= Date.now())
                        mov.isWeapDrawn = false;
                    if (this.sneakBlocker === mov.isSneaking)
                        this.sneakBlocker = null;
                    else if (this.sneakBlocker === true)
                        mov.isSneaking = true;
                    else if (this.sneakBlocker === false)
                        mov.isSneaking = false;
                    return mov;
                };
                AnimationSource.prototype.getAnimation = function () {
                    var _a = this, numChanges = _a.numChanges, animEventName = _a.animEventName;
                    return { numChanges: numChanges, animEventName: animEventName };
                };
                AnimationSource.prototype.onSendAnimationEvent = function (animEventName) {
                    if (ignoredAnims.has(animEventName))
                        return;
                    var lower = animEventName.toLowerCase();
                    var isTorchEvent = lower.includes('torch');
                    if (animEventName.toLowerCase().includes('unequip') && !isTorchEvent) {
                        this.weapNonDrawnBlocker = Date.now() + 300;
                        animEventName = 'SkympFakeUnequip';
                    }
                    else if (animEventName.toLowerCase().includes('equip') && !isTorchEvent) {
                        this.weapDrawnBlocker = Date.now() + 300;
                        animEventName = 'SkympFakeEquip';
                    }
                    if (animEventName === 'SneakStart') {
                        this.sneakBlocker = true;
                        return;
                    }
                    if (animEventName === 'SneakStop') {
                        this.sneakBlocker = false;
                        return;
                    }
                    // if (animEventName === "Ragdoll") return;
                    if (animEventName === 'IdleForceDefaultState')
                        return;
                    this.numChanges++;
                    this.animEventName = animEventName;
                };
                return AnimationSource;
            }());
            exports_13("AnimationSource", AnimationSource);
            ignoredAnims = new Set([
                'moveStart',
                'moveStop',
                'turnStop',
                'CyclicCrossBlend',
                'CyclicFreeze',
                'TurnLeft',
                'TurnRight',
            ]);
            exports_13("setupHooks", setupHooks = function () {
                skyrimPlatform_6.hooks.sendAnimationEvent.add({
                    enter: function (ctx) {
                        if (refsWithDefaultAnimsDisabled.has(ctx.selfId)) {
                            if (ctx.animEventName.toLowerCase().includes('attack')) {
                                var animKey = ctx.selfId + ":" + ctx.animEventName;
                                if (allowedAnims.has(animKey)) {
                                    allowedAnims.delete(animKey);
                                }
                                else {
                                    skyrimPlatform_6.printConsole("block anim " + ctx.animEventName);
                                    ctx.animEventName = '';
                                    return;
                                }
                            }
                        }
                        // ShowRaceMenu forces this anim
                        if (ctx.animEventName === 'OffsetBoundStandingPlayerInstant') {
                            ctx.animEventName = '';
                            return;
                        }
                        // Disable idle animations for 0xff actors
                        if (ctx.selfId < 0xff000000)
                            return;
                        if (isIdle(ctx.animEventName)) {
                            var i = allowedIdles.findIndex(function (pair) {
                                return pair[0] === ctx.selfId && pair[1] === ctx.animEventName;
                            });
                            i === -1 ? (ctx.animEventName = '') : allowedIdles.splice(i, 1);
                        }
                    },
                    leave: function () { },
                });
            });
        }
    };
});
System.register("src/front/messages", [], function (exports_14, context_14) {
    "use strict";
    var MsgType;
    var __moduleName = context_14 && context_14.id;
    return {
        setters: [],
        execute: function () {
            (function (MsgType) {
                MsgType[MsgType["CustomPacket"] = 1] = "CustomPacket";
                MsgType[MsgType["UpdateMovement"] = 2] = "UpdateMovement";
                MsgType[MsgType["UpdateAnimation"] = 3] = "UpdateAnimation";
                MsgType[MsgType["UpdateLook"] = 4] = "UpdateLook";
                MsgType[MsgType["UpdateEquipment"] = 5] = "UpdateEquipment";
                MsgType[MsgType["Activate"] = 6] = "Activate";
                MsgType[MsgType["UpdateProperty"] = 7] = "UpdateProperty";
                MsgType[MsgType["PutItem"] = 8] = "PutItem";
                MsgType[MsgType["TakeItem"] = 9] = "TakeItem";
                MsgType[MsgType["FinishSpSnippet"] = 10] = "FinishSpSnippet";
                MsgType[MsgType["OnEquip"] = 11] = "OnEquip";
                MsgType[MsgType["ConsoleCommand"] = 12] = "ConsoleCommand";
                MsgType[MsgType["CraftItem"] = 13] = "CraftItem";
                MsgType[MsgType["Host"] = 14] = "Host";
                MsgType[MsgType["CustomEvent"] = 15] = "CustomEvent";
                MsgType[MsgType["ChangeValues"] = 16] = "ChangeValues";
            })(MsgType || (MsgType = {}));
            exports_14("MsgType", MsgType);
        }
    };
});
System.register("src/front/console", ["src/skyrim-platform/skyrimPlatform", "src/front/consoleCommands", "src/front/messages"], function (exports_15, context_15) {
    "use strict";
    var skyrimPlatform_7, consoleCommands_1, messages_1, blockConsole, CmdArgument, schemas, immuneSchema, nonVanilaCommands, getCommandExecutor, setUpConsoleCommands, printConsoleServer;
    var __moduleName = context_15 && context_15.id;
    return {
        setters: [
            function (skyrimPlatform_7_1) {
                skyrimPlatform_7 = skyrimPlatform_7_1;
            },
            function (consoleCommands_1_1) {
                consoleCommands_1 = consoleCommands_1_1;
            },
            function (messages_1_1) {
                messages_1 = messages_1_1;
            }
        ],
        execute: function () {
            exports_15("blockConsole", blockConsole = function () {
                // if (settings['skymp5-client']['enable-console'] !== true) {
                var legalCommands = ['qqq', 'fov', 'tmm'];
                consoleCommands_1.consoleCommands.concat(consoleCommands_1.scriptCommands).forEach(function (name) {
                    var command = skyrimPlatform_7.findConsoleCommand(name);
                    if (!command ||
                        legalCommands.includes(command.longName.toLowerCase()) ||
                        legalCommands.includes(command.shortName.toLowerCase())) {
                        return;
                    }
                    command.execute = function () {
                        skyrimPlatform_7.printConsole("You do not have permission to use this command ('" + name + "')");
                        return false;
                    };
                });
                // }
            });
            (function (CmdArgument) {
                CmdArgument[CmdArgument["ObjectReference"] = 0] = "ObjectReference";
                CmdArgument[CmdArgument["BaseForm"] = 1] = "BaseForm";
                CmdArgument[CmdArgument["Int"] = 2] = "Int";
                CmdArgument[CmdArgument["String"] = 3] = "String";
            })(CmdArgument || (CmdArgument = {}));
            schemas = {
                additem: [CmdArgument.ObjectReference, CmdArgument.BaseForm, CmdArgument.Int],
                placeatme: [CmdArgument.ObjectReference, CmdArgument.BaseForm],
                disable: [CmdArgument.ObjectReference],
                mp: [CmdArgument.ObjectReference, CmdArgument.String],
            };
            immuneSchema = ['mp'];
            nonVanilaCommands = ['mp'];
            getCommandExecutor = function (commandName, send, localIdToRemoteId) {
                return function () {
                    var _a;
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    var schema = schemas[commandName];
                    if (args.length !== schema.length && !immuneSchema.includes(commandName)) {
                        skyrimPlatform_7.printConsole("Mismatch found in the schema of '" + commandName + "' command");
                        return false;
                    }
                    for (var i = 0; i < args.length; ++i) {
                        switch (schema[i]) {
                            case CmdArgument.ObjectReference:
                                args[i] = localIdToRemoteId(parseInt("" + args[i], 10));
                                break;
                        }
                    }
                    skyrimPlatform_7.printConsole('sent');
                    send({ t: messages_1.MsgType.ConsoleCommand, data: { commandName: commandName, args: args } });
                    if (skyrimPlatform_7.storage._api_onConsoleCommand && skyrimPlatform_7.storage._api_onConsoleCommand.callback) {
                        if (commandName === 'mp') {
                            try {
                                (_a = skyrimPlatform_7.storage._api_onConsoleCommand).callback.apply(_a, args);
                            }
                            catch (e) {
                                skyrimPlatform_7.printConsole('"_api_onConsoleCommand" - ', e);
                            }
                        }
                    }
                    return false;
                };
            };
            exports_15("setUpConsoleCommands", setUpConsoleCommands = function (send, localIdToRemoteId) {
                var command = skyrimPlatform_7.findConsoleCommand(' ConfigureUM') || skyrimPlatform_7.findConsoleCommand('test');
                if (command) {
                    command.shortName = 'mp';
                    command.execute = getCommandExecutor('mp', send, localIdToRemoteId);
                }
                Object.keys(schemas).forEach(function (commandName) {
                    var command = skyrimPlatform_7.findConsoleCommand(commandName);
                    if (!command || nonVanilaCommands.includes(commandName))
                        return;
                    command.execute = getCommandExecutor(commandName, send, localIdToRemoteId);
                });
            });
            exports_15("printConsoleServer", printConsoleServer = function () {
                var argumets = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    argumets[_i] = arguments[_i];
                }
                var s = skyrimPlatform_7.storage._api_onPrintConsole;
                if (s === null || s === void 0 ? void 0 : s.callback)
                    s.callback.apply(s, argumets);
                // printConsole(...argumets);
            });
        }
    };
});
System.register("src/front/browser", ["src/skyrim-platform/skyrimPlatform", "src/front/console"], function (exports_16, context_16) {
    "use strict";
    var skyrimPlatform_8, console_1, dispatch, main;
    var __moduleName = context_16 && context_16.id;
    return {
        setters: [
            function (skyrimPlatform_8_1) {
                skyrimPlatform_8 = skyrimPlatform_8_1;
            },
            function (console_1_1) {
                console_1 = console_1_1;
            }
        ],
        execute: function () {
            exports_16("dispatch", dispatch = function (commandType, data) {
                if (data === void 0) { data = {}; }
                var src = [];
                src.push("\n\t\t\t\twindow.storage.dispatch({\n\t\t\t\t\ttype: 'COMMAND',\n\t\t\t\t\tdata: {\n\t\t\t\t\t\tcommandType: '" + commandType + "',\n\t\t\t\t\t\talter: ['" + JSON.stringify(data) + "']\n\t\t\t\t\t}\n\t\t\t\t})\n\t\t\t");
                try {
                    skyrimPlatform_8.browser.executeJavaScript(src.join('\n'));
                }
                catch (error) {
                    console_1.printConsoleServer(error);
                }
            });
            exports_16("main", main = function () {
                var badMenus = [
                    "BarterMenu" /* Barter */,
                    "Book Menu" /* Book */,
                    "ContainerMenu" /* Container */,
                    "Crafting Menu" /* Crafting */,
                    "GiftMenu" /* Gift */,
                    "InventoryMenu" /* Inventory */,
                    "Journal Menu" /* Journal */,
                    "Lockpicking Menu" /* Lockpicking */,
                    "Loading Menu" /* Loading */,
                    "MapMenu" /* Map */,
                    "RaceSex Menu" /* RaceSex */,
                    "StatsMenu" /* Stats */,
                    "TweenMenu" /* Tween */,
                    "Console" /* Console */,
                    "Main Menu" /* Main */,
                ];
                var browserVisibleState = false;
                skyrimPlatform_8.browser.setVisible(false);
                var setBrowserVisible = function (state) {
                    browserVisibleState = state;
                    skyrimPlatform_8.browser.setVisible(state);
                };
                skyrimPlatform_8.once('update', function () {
                    browserVisibleState = true;
                    skyrimPlatform_8.browser.setVisible(true);
                });
                var browserFocusedState = false;
                var setBrowserFocused = function (state) {
                    browserFocusedState = state;
                    skyrimPlatform_8.browser.setFocused(state);
                };
                var badMenuOpen = true;
                var lastBadMenuCheck = 0;
                skyrimPlatform_8.on('update', function () {
                    if (Date.now() - lastBadMenuCheck > 200) {
                        lastBadMenuCheck = Date.now();
                        badMenuOpen = badMenus.findIndex(function (menu) { return skyrimPlatform_8.Ui.isMenuOpen(menu); }) !== -1;
                        skyrimPlatform_8.browser.setVisible(browserVisibleState && !badMenuOpen);
                    }
                });
                var isInputFocused = false;
                skyrimPlatform_8.on('browserMessage', function (event) {
                    if (!event.arguments.length)
                        return;
                    var e = event.arguments[0];
                    if (e.type === 'focusInputField') {
                        // window.skyrimPlatform.sendMessage({ type: 'focusInputField', data: true/false });
                        isInputFocused = e.data;
                    }
                    else if (e.type === 'browserFocused') {
                        // window.skyrimPlatform.sendMessage({ type: 'browserFocused', data: true/false });
                        setBrowserFocused(e.data);
                    }
                    else if (e.type === 'browserVisible') {
                        // window.skyrimPlatform.sendMessage({ type: 'browserVisible', data: true/false });
                        setBrowserVisible(e.data);
                    }
                });
                var binding = new Map([
                    [[60 /* F2 */], function () { return setBrowserVisible(!browserVisibleState); }],
                    [[64 /* F6 */], function () { return setBrowserFocused(!browserFocusedState); }],
                    [[1 /* Escape */], function () { return (browserFocusedState ? setBrowserFocused(false) : undefined); }],
                    [
                        [200 /* UpArrow */],
                        function () {
                            if (!browserFocusedState)
                                return;
                            dispatch('CHAT_UPDATE_HISTORY_STEP_UP');
                        },
                    ],
                    [
                        [208 /* DownArrow */],
                        function () {
                            if (!browserFocusedState)
                                return;
                            dispatch('CHAT_UPDATE_HISTORY_STEP_DOWN');
                        },
                    ],
                    [
                        [22 /* U */],
                        function () {
                            if (badMenuOpen || browserFocusedState || isInputFocused)
                                return;
                            setBrowserFocused(true);
                            dispatch('ANIMLIST_SHOW');
                        },
                    ],
                    [
                        [28 /* Enter */],
                        function () {
                            if (badMenuOpen || browserFocusedState)
                                return;
                            setBrowserFocused(true);
                            dispatch('CHAT_SHOW');
                        },
                    ],
                    [
                        [42 /* LeftShift */, 15 /* Tab */],
                        function () {
                            if (badMenuOpen || browserFocusedState)
                                return;
                            setBrowserFocused(true);
                            dispatch('FRAMETRANSLATOR_SHOW');
                        },
                    ],
                ]);
                var lastNumKeys = 0;
                skyrimPlatform_8.on('update', function () {
                    var numKeys = skyrimPlatform_8.Input.getNumKeysPressed();
                    if (lastNumKeys === numKeys)
                        return;
                    lastNumKeys = numKeys;
                    binding.forEach(function (fn, keyCodes) {
                        if (keyCodes.every(function (key) { return skyrimPlatform_8.Input.isKeyPressed(key); }))
                            fn();
                    });
                });
                var cfg = {
                    ip: skyrimPlatform_8.settings['skymp5-client']['server-ip'],
                    port: skyrimPlatform_8.settings['skymp5-client']['server-port'],
                };
                skyrimPlatform_8.printConsole({ cfg: cfg });
                var uiPort = cfg.port === 7777 ? 3000 : cfg.port + 1;
                var url = "http://" + cfg.ip + ":" + uiPort + "/ui/index.html";
                skyrimPlatform_8.printConsole("loading url " + url);
                skyrimPlatform_8.browser.loadUrl(url);
            });
        }
    };
});
System.register("src/front/deathSystem", ["src/skyrim-platform/skyrimPlatform"], function (exports_17, context_17) {
    "use strict";
    var skyrimPlatform_9, gAllowGetUp, update, makeActorImmortal;
    var __moduleName = context_17 && context_17.id;
    return {
        setters: [
            function (skyrimPlatform_9_1) {
                skyrimPlatform_9 = skyrimPlatform_9_1;
            }
        ],
        execute: function () {
            gAllowGetUp = true;
            exports_17("update", update = function () {
                gAllowGetUp = skyrimPlatform_9.Game.getPlayer().getActorValuePercentage('health') >= 0.05;
            });
            skyrimPlatform_9.hooks.sendAnimationEvent.add({
                enter: function (ctx) {
                    if (ctx.animEventName.toLowerCase().includes('killmove')) {
                        ctx.animEventName = '';
                    }
                    if (ctx.selfId !== 0x14)
                        return;
                    if (!gAllowGetUp && ctx.animEventName === 'GetUpBegin') {
                        ctx.animEventName = '';
                        skyrimPlatform_9.printConsole('block GetUpBegin');
                    }
                },
                leave: function () { },
            });
            exports_17("makeActorImmortal", makeActorImmortal = function (act) {
                act.startDeferredKill();
            });
        }
    };
});
System.register("src/front/hostAttempts", ["src/skyrim-platform/skyrimPlatform"], function (exports_18, context_18) {
    "use strict";
    var skyrimPlatform_10, tryHost, nextHostAttempt;
    var __moduleName = context_18 && context_18.id;
    return {
        setters: [
            function (skyrimPlatform_10_1) {
                skyrimPlatform_10 = skyrimPlatform_10_1;
            }
        ],
        execute: function () {
            skyrimPlatform_10.storage.hostAttempts = [];
            exports_18("tryHost", tryHost = function (targetRemoteId) {
                skyrimPlatform_10.storage.hostAttempts.push(targetRemoteId);
            });
            exports_18("nextHostAttempt", nextHostAttempt = function () {
                var arr = skyrimPlatform_10.storage.hostAttempts;
                if (arr.length === 0)
                    return undefined;
                return arr.shift();
            });
        }
    };
});
System.register("src/front/components/look", ["src/skyrim-platform/skyrimPlatform"], function (exports_19, context_19) {
    "use strict";
    var skyrimPlatform_11, getLook, isVisible, applyTints, silentVoiceTypeId, applyLookCommon, applyLook, applyLookToPlayer;
    var __moduleName = context_19 && context_19.id;
    return {
        setters: [
            function (skyrimPlatform_11_1) {
                skyrimPlatform_11 = skyrimPlatform_11_1;
            }
        ],
        execute: function () {
            exports_19("getLook", getLook = function (actor) {
                var base = skyrimPlatform_11.ActorBase.from(actor.getBaseObject());
                var hairColor = base.getHairColor();
                var skinColor = skyrimPlatform_11.TESModPlatform.getSkinColor(base);
                var newLook = {
                    isFemale: base.getSex() === 1,
                    raceId: base.getRace() ? base.getRace().getFormID() : 0,
                    weight: base.getWeight(),
                    hairColor: hairColor ? hairColor.getColor() : 0,
                    headpartIds: [],
                    headTextureSetId: base.getFaceTextureSet() ? base.getFaceTextureSet().getFormID() : 0,
                    options: new Array(19),
                    presets: new Array(4),
                    tints: [],
                    skinColor: skinColor ? skinColor.getColor() : 0,
                    name: actor.getBaseObject().getName(),
                };
                var numHeadparts = base.getNumHeadParts();
                for (var i = 0; i < numHeadparts; ++i) {
                    var part = base.getNthHeadPart(i);
                    if (part)
                        newLook.headpartIds.push(part.getFormID());
                }
                for (var i = 0; i < newLook.options.length; ++i) {
                    newLook.options[i] = base.getFaceMorph(i);
                }
                for (var i = 0; i < newLook.presets.length; ++i) {
                    newLook.presets[i] = base.getFacePreset(i);
                }
                var numTints = skyrimPlatform_11.Game.getPlayer().getFormID() === actor.getFormID() ? skyrimPlatform_11.Game.getNumTintMasks() : 0;
                for (var i = 0; i < numTints; ++i) {
                    var tint = {
                        texturePath: skyrimPlatform_11.Game.getNthTintMaskTexturePath(i),
                        type: skyrimPlatform_11.Game.getNthTintMaskType(i),
                        argb: skyrimPlatform_11.Game.getNthTintMaskColor(i),
                    };
                    newLook.tints.push(tint);
                }
                return newLook;
            });
            isVisible = function (argb) { return argb > 0x00ffffff || argb < 0; };
            exports_19("applyTints", applyTints = function (actor, look) {
                if (!look)
                    throw new Error('null look has been passed to applyTints');
                var tints = look.tints.filter(function (t) { return isVisible(t.argb); });
                var raceWarPaintRegex = /.*Head.+WarPaint.*/;
                var uniWarPaintRegex = /.*HeadWarPaint.*/;
                var raceSpecificWarPaint = tints.filter(function (t) { return isVisible(t.argb) && t.texturePath.match(raceWarPaintRegex); }).length; // MaleHeadNordWarPaint
                var uniWarPaint = tints.filter(function (t) { return isVisible(t.argb) && t.texturePath.match(uniWarPaintRegex); }).length; // MaleHeadWarPaint
                if (raceSpecificWarPaint + uniWarPaint > 1) {
                    // If visible war paints of these two types present, then Skyrim crashes
                    skyrimPlatform_11.printConsole('bad warpaint!', raceSpecificWarPaint, uniWarPaint);
                    return;
                }
                skyrimPlatform_11.TESModPlatform.clearTintMasks(actor);
                tints.forEach(function (tint) {
                    skyrimPlatform_11.TESModPlatform.pushTintMask(actor, tint.type, tint.argb, tint.texturePath);
                });
                var playerBaseId = skyrimPlatform_11.Game.getPlayer().getBaseObject().getFormID();
                if (actor)
                    skyrimPlatform_11.TESModPlatform.setFormIdUnsafe(actor.getBaseObject(), playerBaseId);
            });
            exports_19("silentVoiceTypeId", silentVoiceTypeId = 0x0002f7c3);
            applyLookCommon = function (look, npc) {
                var race = skyrimPlatform_11.Race.from(skyrimPlatform_11.Game.getFormEx(look.raceId));
                var headparts = look.headpartIds.map(function (id) { return skyrimPlatform_11.HeadPart.from(skyrimPlatform_11.Game.getFormEx(id)); }).filter(function (headpart) { return !!headpart; });
                skyrimPlatform_11.TESModPlatform.setNpcSex(npc, look.isFemale ? 1 : 0);
                if (race)
                    skyrimPlatform_11.TESModPlatform.setNpcRace(npc, race);
                npc.setWeight(look.weight);
                skyrimPlatform_11.TESModPlatform.setNpcSkinColor(npc, look.skinColor);
                skyrimPlatform_11.TESModPlatform.setNpcHairColor(npc, look.hairColor);
                skyrimPlatform_11.TESModPlatform.resizeHeadpartsArray(npc, headparts.length);
                headparts.forEach(function (v, i) { return npc.setNthHeadPart(v, i); });
                npc.setFaceTextureSet(skyrimPlatform_11.TextureSet.from(skyrimPlatform_11.Game.getFormEx(look.headTextureSetId))); // setFaceTextureSet supports null argument
                npc.setVoiceType(skyrimPlatform_11.VoiceType.from(skyrimPlatform_11.Game.getFormEx(silentVoiceTypeId)));
                look.options.forEach(function (v, i) { return npc.setFaceMorph(v, i); });
                look.presets.forEach(function (v, i) { return npc.setFacePreset(v, i); });
                if (look.name) {
                    npc.setName(look.name);
                }
                else {
                    // for undefined or empty name
                    npc.setName(' ');
                }
            };
            exports_19("applyLook", applyLook = function (look) {
                var npc = skyrimPlatform_11.TESModPlatform.createNpc();
                if (!npc)
                    throw new Error('createNpc returned null');
                applyLookCommon(look, npc);
                return npc;
            });
            exports_19("applyLookToPlayer", applyLookToPlayer = function (look) {
                applyLookCommon(look, skyrimPlatform_11.ActorBase.from(skyrimPlatform_11.Game.getPlayer().getBaseObject()));
                applyTints(null, look);
                skyrimPlatform_11.Game.getPlayer().queueNiNodeUpdate();
            });
        }
    };
});
System.register("src/front/model", [], function (exports_20, context_20) {
    "use strict";
    var __moduleName = context_20 && context_20.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("src/front/worldCleaner", ["src/skyrim-platform/skyrimPlatform"], function (exports_21, context_21) {
    "use strict";
    var skyrimPlatform_12, protection, isInDialogue;
    var __moduleName = context_21 && context_21.id;
    function processOneActor() {
        var pc = skyrimPlatform_12.Game.getPlayer();
        var actor = skyrimPlatform_12.Game.findRandomActor(pc.getPositionX(), pc.getPositionY(), pc.getPositionZ(), 8192);
        var actorId = actor.getFormID();
        var currentProtection = protection.get(actorId);
        if (currentProtection > 0)
            return;
        if (!actor || actorId === 0x14 || actor.isDisabled() || actor.isDeleted())
            return;
        if (isInDialogue(actor)) {
            // Deleting actor in dialogue crashes Skyrim
            // https://github.com/skyrim-multiplayer/issue-tracker/issues/13
            actor.setPosition(0, 0, 0);
            return;
        }
        actor.disable(false).then(function () {
            var ac = skyrimPlatform_12.Actor.from(skyrimPlatform_12.Game.getFormEx(actorId));
            if (!ac || isInDialogue(ac))
                return;
            ac.delete();
        });
    }
    function updateWc() {
        return processOneActor();
    }
    exports_21("updateWc", updateWc);
    function modWcProtection(actorId, mod) {
        var currentProtection = protection.get(actorId);
        protection.set(actorId, currentProtection ? currentProtection + mod : mod);
    }
    exports_21("modWcProtection", modWcProtection);
    return {
        setters: [
            function (skyrimPlatform_12_1) {
                skyrimPlatform_12 = skyrimPlatform_12_1;
            }
        ],
        execute: function () {
            protection = new Map();
            isInDialogue = function (ac) { return ac.isInDialogueWithPlayer() || !!ac.getDialogueTarget(); };
        }
    };
});
System.register("src/front/view", ["src/skyrim-platform/skyrimPlatform", "src/front/components/movement", "src/front/components/animation", "src/front/components/look", "src/front/components/equipment", "src/front/worldCleaner", "src/front/components/inventory", "src/front/hostAttempts", "src/front/components/movementGet", "src/front/deathSystem"], function (exports_22, context_22) {
    "use strict";
    var skyrimPlatform_13, sp, movement_1, animation_1, look_1, equipment_1, worldCleaner_1, inventory_2, hostAttempts_1, movementGet_2, deathSystem, gCrosshairRefId, gPcInJumpState, gPcWorldOrCellId, gUpdateNeighborFunctionsKeys, gUpdateNeighborFunctions, getFormEx, lastTryHost, tryHostIfNeed, SpawnProcess, getDefaultEquipState, getDefaultLookState, undefinedRefr, unknownValue, undefinedFormModel, undefinedObject, undefinedView, ctx, FormView, FormViewArray, WorldView, getViewFromStorage, localIdToRemoteId, remoteIdToLocalId;
    var __moduleName = context_22 && context_22.id;
    function dealWithRef(ref, base) {
        var t = base.getType();
        if (isContainer(t) || isItem(t) || isIngredientSource(t) || isNpc(t) || isDoor(t)) {
            ref.blockActivation(true);
        }
        else {
            ref.blockActivation(false);
        }
        if (ref.isLocked()) {
            ref.lock(false, false);
        }
        if (isItem(t)) {
            ref.setMotionType(4 /* Keyframed */, false);
        }
        if (isFlora(t)) {
            var hasIngr = sp.Flora.from(base).getIngredient() != null;
            if (hasIngr)
                ref.setMotionType(4 /* Keyframed */, false);
        }
    }
    return {
        setters: [
            function (skyrimPlatform_13_1) {
                skyrimPlatform_13 = skyrimPlatform_13_1;
                sp = skyrimPlatform_13_1;
            },
            function (movement_1_1) {
                movement_1 = movement_1_1;
            },
            function (animation_1_1) {
                animation_1 = animation_1_1;
            },
            function (look_1_1) {
                look_1 = look_1_1;
            },
            function (equipment_1_1) {
                equipment_1 = equipment_1_1;
            },
            function (worldCleaner_1_1) {
                worldCleaner_1 = worldCleaner_1_1;
            },
            function (inventory_2_1) {
                inventory_2 = inventory_2_1;
            },
            function (hostAttempts_1_1) {
                hostAttempts_1 = hostAttempts_1_1;
            },
            function (movementGet_2_1) {
                movementGet_2 = movementGet_2_1;
            },
            function (deathSystem_1) {
                deathSystem = deathSystem_1;
            }
        ],
        execute: function () {
            gCrosshairRefId = 0;
            gPcInJumpState = false;
            gPcWorldOrCellId = 0;
            gUpdateNeighborFunctionsKeys = new Array();
            gUpdateNeighborFunctions = {};
            skyrimPlatform_13.on('tick', function () {
                var keys = skyrimPlatform_13.storage.updateNeighborFunctions_keys;
                if (keys && Array.isArray(keys)) {
                    gUpdateNeighborFunctionsKeys = keys;
                }
                else {
                    gUpdateNeighborFunctionsKeys = [];
                }
                gUpdateNeighborFunctions = skyrimPlatform_13.storage.updateNeighborFunctions;
            });
            getFormEx = skyrimPlatform_13.Game.getFormEx;
            lastTryHost = {};
            tryHostIfNeed = function (ac, remoteId) {
                var last = lastTryHost[remoteId];
                if (!last || Date.now() - last >= 1000) {
                    lastTryHost[remoteId] = Date.now();
                    if (movementGet_2.getMovement(ac).worldOrCell === movementGet_2.getMovement(skyrimPlatform_13.Game.getPlayer()).worldOrCell) {
                        return hostAttempts_1.tryHost(remoteId);
                    }
                }
            };
            SpawnProcess = /** @class */ (function () {
                function SpawnProcess(look, pos, refrId, callback) {
                    var _this = this;
                    this.callback = callback;
                    var refr = skyrimPlatform_13.ObjectReference.from(skyrimPlatform_13.Game.getFormEx(refrId));
                    if (!refr || refr.getFormID() !== refrId)
                        return;
                    refr.setPosition.apply(refr, pos).then(function () { return _this.enable(look, refrId); });
                }
                SpawnProcess.prototype.enable = function (look, refrId) {
                    var _this = this;
                    var refr = skyrimPlatform_13.ObjectReference.from(skyrimPlatform_13.Game.getFormEx(refrId));
                    if (!refr || refr.getFormID() !== refrId)
                        return;
                    var ac = skyrimPlatform_13.Actor.from(refr);
                    if (look && ac)
                        look_1.applyTints(ac, look);
                    refr.enable(false).then(function () { return _this.resurrect(look, refrId); });
                };
                SpawnProcess.prototype.resurrect = function (look, refrId) {
                    var _this = this;
                    var refr = skyrimPlatform_13.ObjectReference.from(skyrimPlatform_13.Game.getFormEx(refrId));
                    if (!refr || refr.getFormID() !== refrId)
                        return;
                    var ac = skyrimPlatform_13.Actor.from(refr);
                    if (ac) {
                        return ac.resurrect().then(function () {
                            _this.callback();
                        });
                    }
                    return refr.setMotionType(4 /* Keyframed */, true).then(this.callback);
                };
                return SpawnProcess;
            }());
            getDefaultEquipState = function () {
                return { lastNumChanges: 0, isBadMenuShown: false, lastEqMoment: 0 };
            };
            getDefaultLookState = function () {
                return { lastNumChanges: 0, look: null };
            };
            undefinedRefr = undefined;
            unknownValue = undefined;
            undefinedFormModel = undefined;
            undefinedObject = undefined;
            undefinedView = undefined;
            ctx = {
                refr: undefinedRefr,
                value: unknownValue,
                _model: undefinedFormModel,
                sp: sp,
                state: undefinedObject,
                _view: undefinedView,
                i: -1,
                getFormIdInServerFormat: function (clientsideFormId) {
                    return localIdToRemoteId(clientsideFormId);
                },
                getFormIdInClientFormat: function (serversideFormId) {
                    return remoteIdToLocalId(serversideFormId);
                },
                get: function (propName) {
                    return this._model[propName];
                },
                respawn: function () {
                    this._view.destroyForm(this.i);
                },
            };
            FormView = /** @class */ (function () {
                function FormView(remoteRefrId) {
                    this.remoteRefrId = remoteRefrId;
                    this.lastHarvestedApply = 0;
                    this.lastOpenApply = 0;
                    this.refrId = 0;
                    this.ready = false;
                    this.animState = { lastNumChanges: 0 };
                    this.movState = {
                        lastNumChanges: 0,
                        lastApply: 0,
                        lastRehost: 0,
                        everApplied: false,
                    };
                    this.lookState = getDefaultLookState();
                    this.eqState = getDefaultEquipState();
                    this.lookBasedBaseId = 0;
                    this.isOnScreen = false;
                    this.lastPcWorldOrCell = 0;
                    this.lastWorldOrCell = 0;
                    this.spawnMoment = 0;
                    this.wasHostedByOther = undefined;
                    this.state = {};
                    this.localImmortal = false;
                }
                FormView.prototype.update = function (model) {
                    var _this = this;
                    var _a, _b, _c;
                    // Other players mutate into PC clones when moving to another location
                    if (model.movement) {
                        if (!this.lastWorldOrCell)
                            this.lastWorldOrCell = model.movement.worldOrCell;
                        if (this.lastWorldOrCell !== model.movement.worldOrCell) {
                            skyrimPlatform_13.printConsole("[1] worldOrCell changed, destroying FormView " + this.lastWorldOrCell.toString(16) + " => " + model.movement.worldOrCell.toString(16));
                            this.lastWorldOrCell = model.movement.worldOrCell;
                            this.destroy();
                            this.refrId = 0;
                            this.lookBasedBaseId = 0;
                            return;
                        }
                    }
                    // Players with different worldOrCell should be invisible
                    if (model.movement) {
                        var worldOrCell = skyrimPlatform_13.Game.getPlayer().getWorldSpace() || skyrimPlatform_13.Game.getPlayer().getParentCell();
                        if (worldOrCell && model.movement.worldOrCell !== worldOrCell.getFormID()) {
                            this.destroy();
                            this.refrId = 0;
                            return;
                        }
                    }
                    // Apply look before base form selection to prevent double-spawn
                    if (model.look) {
                        if (!this.lookState.look || model.numLookChanges !== this.lookState.lastNumChanges) {
                            this.lookState.look = model.look;
                            this.lookState.lastNumChanges = model.numLookChanges;
                            this.lookBasedBaseId = 0;
                        }
                    }
                    var refId = model.refrId && model.refrId < 0xff000000 ? model.refrId : undefined;
                    if (refId) {
                        if (this.refrId !== refId) {
                            this.destroy();
                            this.refrId = model.refrId;
                            this.ready = true;
                            var refr_1 = skyrimPlatform_13.ObjectReference.from(skyrimPlatform_13.Game.getFormEx(this.refrId));
                            if (refr_1) {
                                var base = refr_1.getBaseObject();
                                if (base)
                                    dealWithRef(refr_1, base);
                            }
                        }
                    }
                    else {
                        var base = getFormEx(+model.baseId) || getFormEx(this.getLookBasedBase());
                        if (!base)
                            return;
                        var refr_2 = skyrimPlatform_13.ObjectReference.from(skyrimPlatform_13.Game.getFormEx(this.refrId));
                        var respawnRequired = !refr_2 || !refr_2.getBaseObject() || refr_2.getBaseObject().getFormID() !== base.getFormID();
                        if (respawnRequired) {
                            this.destroy();
                            var player = skyrimPlatform_13.Game.getPlayer();
                            refr_2 = player.placeAtMe(base, 1, true, true);
                            this.state = {};
                            delete this.wasHostedByOther;
                            var kTypeNpc = 43;
                            if (base.getType() !== kTypeNpc) {
                                refr_2.setAngle(((_a = model.movement) === null || _a === void 0 ? void 0 : _a.rot[0]) || 0, ((_b = model.movement) === null || _b === void 0 ? void 0 : _b.rot[1]) || 0, ((_c = model.movement) === null || _c === void 0 ? void 0 : _c.rot[2]) || 0);
                            }
                            worldCleaner_1.modWcProtection(refr_2.getFormID(), 1);
                            // TODO: reset all states?
                            this.eqState = getDefaultEquipState();
                            this.ready = false;
                            new SpawnProcess(this.lookState.look, model.movement ? model.movement.pos : [player.getPositionX(), player.getPositionY(), player.getPositionZ()], refr_2.getFormID(), function () {
                                _this.ready = true;
                                _this.spawnMoment = Date.now();
                            });
                            if (model.look && model.look.name)
                                refr_2.setDisplayName("" + model.look.name, true);
                        }
                        this.refrId = refr_2.getFormID();
                    }
                    if (!this.ready)
                        return;
                    var refr = skyrimPlatform_13.ObjectReference.from(skyrimPlatform_13.Game.getFormEx(this.refrId));
                    if (refr) {
                        var actor = skyrimPlatform_13.Actor.from(refr);
                        if (actor && !this.localImmortal) {
                            deathSystem.makeActorImmortal(actor);
                            actor.setActorValue('health', 1000000);
                            this.localImmortal = true;
                        }
                        this.applyAll(refr, model);
                        for (var _i = 0, gUpdateNeighborFunctionsKeys_1 = gUpdateNeighborFunctionsKeys; _i < gUpdateNeighborFunctionsKeys_1.length; _i++) {
                            var key = gUpdateNeighborFunctionsKeys_1[_i];
                            var v = model[key];
                            // From docs:
                            // In `updateOwner`/`updateNeighbor` equals to a value of a currently processed property.
                            // Can't be `undefined` here, since updates are not received for `undefined` property values.
                            // In other contexts is always `undefined`.
                            if (v !== undefined) {
                                if (this.refrId >= 0xff000000) {
                                    /* printConsole(
                          "upd",
                          this.refrId.toString(16),
                          `${key}=${JSON.stringify(v)}`
                        ); */
                                }
                                ctx.refr = refr;
                                ctx.value = v;
                                ctx._model = model;
                                ctx.state = this.state;
                                var f = gUpdateNeighborFunctions[key];
                                // Actually, 'f' should always be a valid function, but who knows
                                try {
                                    if (f)
                                        f(ctx);
                                }
                                catch (e) {
                                    skyrimPlatform_13.printConsole("'updateNeighbor." + key + "' - ", e);
                                }
                            }
                        }
                    }
                };
                FormView.prototype.destroy = function () {
                    this.isOnScreen = false;
                    this.spawnMoment = 0;
                    var refr = skyrimPlatform_13.ObjectReference.from(skyrimPlatform_13.Game.getFormEx(this.refrId));
                    if (this.refrId >= 0xff000000) {
                        if (refr)
                            refr.delete();
                        worldCleaner_1.modWcProtection(this.refrId, -1);
                        var ac = skyrimPlatform_13.Actor.from(refr);
                        if (ac) {
                            sp.TESModPlatform.setWeaponDrawnMode(ac, -1);
                        }
                    }
                    this.localImmortal = false;
                };
                FormView.prototype.applyHarvested = function (refr, isHarvested) {
                    var base = refr.getBaseObject();
                    if (base) {
                        var t = base.getType();
                        if (t >= 38 && t <= 39) {
                            var wasHarvested = refr.isHarvested();
                            if (isHarvested !== wasHarvested) {
                                var ac = undefined;
                                if (isHarvested) {
                                    for (var i = 0; i < 20; ++i) {
                                        ac = skyrimPlatform_13.Game.findRandomActor(refr.getPositionX(), refr.getPositionY(), refr.getPositionZ(), 10000);
                                        if (ac && ac.getFormID() !== 0x14) {
                                            break;
                                        }
                                    }
                                }
                                if (isHarvested && ac && ac.getFormID() !== 0x14) {
                                    refr.activate(ac, true);
                                }
                                else {
                                    refr.setHarvested(isHarvested);
                                    var id_1 = refr.getFormID();
                                    refr.disable(false).then(function () {
                                        var restoredRefr = skyrimPlatform_13.ObjectReference.from(skyrimPlatform_13.Game.getFormEx(id_1));
                                        if (restoredRefr)
                                            restoredRefr.enable(false);
                                    });
                                }
                            }
                        }
                        else {
                            var wasHarvested = refr.isDisabled();
                            if (isHarvested !== wasHarvested) {
                                if (isHarvested) {
                                    var id_2 = refr.getFormID();
                                    refr.disable(false).then(function () {
                                        var restoredRefr = skyrimPlatform_13.ObjectReference.from(skyrimPlatform_13.Game.getFormEx(id_2));
                                        if (restoredRefr && !restoredRefr.isDisabled()) {
                                            restoredRefr.delete();
                                            // Deletion takes time, so in practice this would be called a lot of times
                                        }
                                    });
                                }
                                else
                                    refr.enable(true);
                            }
                        }
                    }
                };
                FormView.prototype.applyAll = function (refr, model) {
                    var forcedWeapDrawn = null;
                    if (gCrosshairRefId === this.refrId) {
                        this.lastHarvestedApply = 0;
                        this.lastOpenApply = 0;
                    }
                    var now = Date.now();
                    if (now - this.lastHarvestedApply > 666) {
                        this.lastHarvestedApply = now;
                        this.applyHarvested(refr, !!model.isHarvested);
                    }
                    if (now - this.lastOpenApply > 133) {
                        this.lastOpenApply = now;
                        refr.setOpen(!!model.isOpen);
                    }
                    if (model.inventory && gCrosshairRefId === this.refrId && !equipment_1.isBadMenuShown()) {
                        // Do not let actors breaking their equipment via inventory apply
                        // However, actually, actors do not have inventory in their models
                        // Except your clone.
                        if (!skyrimPlatform_13.Actor.from(refr)) {
                            inventory_2.applyInventory(refr, model.inventory, false, true);
                        }
                    }
                    if (model.animation) {
                        if (model.animation.animEventName === 'SkympFakeUnequip') {
                            forcedWeapDrawn = false;
                        }
                        else if (model.animation.animEventName === 'SkympFakeEquip') {
                            forcedWeapDrawn = true;
                        }
                    }
                    if (model.movement) {
                        var ac = skyrimPlatform_13.Actor.from(refr);
                        if (ac) {
                            if (model.isHostedByOther !== this.wasHostedByOther) {
                                this.wasHostedByOther = model.isHostedByOther;
                                this.movState.lastApply = 0;
                                if (model.isHostedByOther) {
                                    animation_1.setDefaultAnimsDisabled(ac.getFormID(), true);
                                }
                                else {
                                    animation_1.setDefaultAnimsDisabled(ac.getFormID(), false);
                                }
                            }
                        }
                        if (this.movState.lastApply && Date.now() - this.movState.lastApply > 1500) {
                            if (Date.now() - this.movState.lastRehost > 1000) {
                                this.movState.lastRehost = Date.now();
                                var remoteId = this.remoteRefrId;
                                if (ac && ac.is3DLoaded()) {
                                    tryHostIfNeed(ac, remoteId);
                                    skyrimPlatform_13.printConsole('try to rehost');
                                }
                            }
                        }
                        if (+model.numMovementChanges !== this.movState.lastNumChanges ||
                            Date.now() - this.movState.lastApply > 2000) {
                            this.movState.lastApply = Date.now();
                            if (model.isHostedByOther || !this.movState.everApplied) {
                                var backup = model.movement.isWeapDrawn;
                                if (forcedWeapDrawn === true || forcedWeapDrawn === false) {
                                    model.movement.isWeapDrawn = forcedWeapDrawn;
                                }
                                movement_1.applyMovement(refr, model.movement);
                                model.movement.isWeapDrawn = backup;
                                this.movState.lastNumChanges = +model.numMovementChanges;
                                this.movState.everApplied = true;
                            }
                            else {
                                if (ac)
                                    ac.clearKeepOffsetFromActor();
                                if (ac)
                                    sp.TESModPlatform.setWeaponDrawnMode(ac, -1);
                                var remoteId = this.remoteRefrId;
                                if (ac && remoteId && ac.is3DLoaded())
                                    tryHostIfNeed(ac, remoteId);
                            }
                        }
                    }
                    if (model.animation)
                        animation_1.applyAnimation(refr, model.animation, this.animState);
                    if (model.look) {
                        var actor = skyrimPlatform_13.Actor.from(refr);
                        if (actor && !gPcInJumpState) {
                            if (gPcWorldOrCellId) {
                                if (this.lastPcWorldOrCell && gPcWorldOrCellId !== this.lastPcWorldOrCell) {
                                    // Redraw tints if PC world/cell changed
                                    this.isOnScreen = false;
                                }
                                this.lastPcWorldOrCell = gPcWorldOrCellId;
                            }
                            var headPos = [
                                skyrimPlatform_13.NetImmerse.getNodeWorldPositionX(actor, 'NPC Head [Head]', false),
                                skyrimPlatform_13.NetImmerse.getNodeWorldPositionY(actor, 'NPC Head [Head]', false),
                                skyrimPlatform_13.NetImmerse.getNodeWorldPositionZ(actor, 'NPC Head [Head]', false),
                            ];
                            var screenPoint = skyrimPlatform_13.worldPointToScreenPoint(headPos)[0];
                            var isOnScreen = screenPoint[0] > 0 &&
                                screenPoint[1] > 0 &&
                                screenPoint[2] > 0 &&
                                screenPoint[0] < 1 &&
                                screenPoint[1] < 1 &&
                                screenPoint[2] < 1;
                            if (isOnScreen !== this.isOnScreen) {
                                this.isOnScreen = isOnScreen;
                                if (isOnScreen) {
                                    actor.queueNiNodeUpdate();
                                    skyrimPlatform_13.Game.getPlayer().queueNiNodeUpdate();
                                }
                            }
                        }
                    }
                    if (model.equipment) {
                        var isShown = equipment_1.isBadMenuShown();
                        if (this.eqState.isBadMenuShown !== isShown) {
                            this.eqState.isBadMenuShown = isShown;
                            if (!isShown)
                                this.eqState.lastNumChanges = -1;
                        }
                        if (this.eqState.lastNumChanges !== model.equipment.numChanges) {
                            var ac = skyrimPlatform_13.Actor.from(refr);
                            // If we do not block inventory here, we will be able to reproduce the bug:
                            // 1. Place ~90 bots and force them to reequip iron swords to the left hand (rate should be ~50ms)
                            // 2. Open your inventory and reequip different items fast
                            // 3. After 1-2 minutes close your inventory and see that HUD disappeared
                            if (ac &&
                                !equipment_1.isBadMenuShown() &&
                                Date.now() - this.eqState.lastEqMoment > 500 &&
                                Date.now() - this.spawnMoment > -1 &&
                                this.spawnMoment > 0) {
                                // if (this.spawnMoment > 0 && Date.now() - this.spawnMoment > 5000) {
                                if (equipment_1.applyEquipment(ac, model.equipment)) {
                                    this.eqState.lastNumChanges = model.equipment.numChanges;
                                }
                                this.eqState.lastEqMoment = Date.now();
                                // }
                                // const res: boolean = applyEquipment(ac, model.equipment);
                                // if (res) this.eqState.lastNumChanges = model.equipment.numChanges;
                            }
                        }
                    }
                };
                FormView.prototype.getLookBasedBase = function () {
                    var base = skyrimPlatform_13.ActorBase.from(skyrimPlatform_13.Game.getFormEx(this.lookBasedBaseId));
                    if (!base && this.lookState.look) {
                        this.lookBasedBaseId = look_1.applyLook(this.lookState.look).getFormID();
                    }
                    return this.lookBasedBaseId;
                };
                FormView.prototype.getLocalRefrId = function () {
                    return this.refrId;
                };
                FormView.prototype.getRemoteRefrId = function () {
                    return this.remoteRefrId;
                };
                return FormView;
            }());
            exports_22("FormView", FormView);
            FormViewArray = /** @class */ (function () {
                function FormViewArray() {
                    this.formViews = new Array();
                }
                FormViewArray.prototype.updateForm = function (form, i) {
                    var view = this.formViews[i];
                    if (!view) {
                        this.formViews[i] = new FormView(form.refrId);
                    }
                    else {
                        view.update(form);
                    }
                };
                FormViewArray.prototype.destroyForm = function (i) {
                    if (!this.formViews[i])
                        return;
                    this.formViews[i].destroy();
                    this.formViews[i] = undefined;
                };
                FormViewArray.prototype.resize = function (newSize) {
                    if (this.formViews.length > newSize) {
                        this.formViews.slice(newSize).forEach(function (v) { return v && v.destroy(); });
                    }
                    this.formViews.length = newSize;
                };
                FormViewArray.prototype.updateAll = function (model, showMe, isCloneView) {
                    ctx._view = this;
                    var forms = model.forms;
                    var n = forms.length;
                    for (var i = 0; i < n; ++i) {
                        if (!forms[i] || (model.playerCharacterFormIdx === i && !showMe)) {
                            this.destroyForm(i);
                            continue;
                        }
                        var form = forms[i];
                        var realPos = undefined;
                        var offset = form.movement && (model.playerCharacterFormIdx === i || isCloneView);
                        if (offset) {
                            realPos = form.movement.pos;
                            form.movement.pos = [realPos[0] + 128, realPos[1] + 128, realPos[2]];
                        }
                        if (isCloneView) {
                            // Prevent using the same refr by normal and clone views
                            if (!form.refrId || form.refrId >= 0xff000000) {
                                var backup = form.isHostedByOther;
                                form.isHostedByOther = true;
                                this.updateForm(form, i);
                                form.isHostedByOther = backup;
                            }
                        }
                        else {
                            ctx.i = i;
                            this.updateForm(form, i);
                        }
                        if (offset) {
                            form.movement.pos = realPos;
                        }
                    }
                };
                FormViewArray.prototype.getRemoteRefrId = function (clientsideRefrId) {
                    if (clientsideRefrId < 0xff000000)
                        throw new Error('This function is only for 0xff forms');
                    var formView = this.formViews.find(function (formView) {
                        return formView && formView.getLocalRefrId() === clientsideRefrId;
                    });
                    return formView ? formView.getRemoteRefrId() : 0;
                };
                FormViewArray.prototype.getLocalRefrId = function (remoteRefrId) {
                    if (remoteRefrId < 0xff000000)
                        throw new Error('This function is only for 0xff forms');
                    var formView = this.formViews.find(function (formView) {
                        return formView && formView.getRemoteRefrId() === remoteRefrId;
                    });
                    return formView ? formView.getLocalRefrId() : 0;
                };
                return FormViewArray;
            }());
            WorldView = /** @class */ (function () {
                function WorldView() {
                    var _this = this;
                    this.formViews = new FormViewArray();
                    this.cloneFormViews = new FormViewArray();
                    this.allowUpdate = false;
                    this.pcWorldOrCell = 0;
                    this.counter = false;
                    // Work around showRaceMenu issue
                    // Default nord in Race Menu will have very ugly face
                    // If other players are spawning when we show this menu
                    skyrimPlatform_13.on('update', function () {
                        var pc = skyrimPlatform_13.Game.getPlayer();
                        var pcWorldOrCell = (pc.getWorldSpace() || pc.getParentCell()).getFormID();
                        if (_this.pcWorldOrCell !== pcWorldOrCell) {
                            if (_this.pcWorldOrCell) {
                                skyrimPlatform_13.printConsole('Reset all form views');
                                _this.formViews.resize(0);
                                _this.cloneFormViews.resize(0);
                            }
                            _this.pcWorldOrCell = pcWorldOrCell;
                        }
                    });
                    skyrimPlatform_13.once('update', function () {
                        // Wait 1s game time (time spent in Race Menu isn't counted)
                        skyrimPlatform_13.Utility.wait(1).then(function () {
                            _this.allowUpdate = true;
                            skyrimPlatform_13.printConsole('Update is now allowed');
                        });
                    });
                }
                WorldView.prototype.getRemoteRefrId = function (clientsideRefrId) {
                    return this.formViews.getRemoteRefrId(clientsideRefrId);
                };
                WorldView.prototype.getLocalRefrId = function (remoteRefrId) {
                    return this.formViews.getLocalRefrId(remoteRefrId);
                };
                WorldView.prototype.update = function (model) {
                    if (!this.allowUpdate)
                        return;
                    // Skip 50% of updates
                    this.counter = !this.counter;
                    if (this.counter)
                        return;
                    this.formViews.resize(model.forms.length);
                    var showMe = skyrimPlatform_13.settings['skymp5-client']['show-me'];
                    var showClones = skyrimPlatform_13.settings['skymp5-client']['show-clones'];
                    var player = skyrimPlatform_13.Game.getPlayer();
                    var crosshair = skyrimPlatform_13.Game.getCurrentCrosshairRef();
                    gCrosshairRefId = crosshair ? crosshair.getFormID() : 0;
                    gPcInJumpState = player.getAnimationVariableBool('bInJumpState');
                    var pcWorldOrCell = player.getWorldSpace() || player.getParentCell();
                    gPcWorldOrCellId = pcWorldOrCell ? pcWorldOrCell.getFormID() : 0;
                    this.formViews.updateAll(model, showMe, false);
                    if (showClones) {
                        this.cloneFormViews.updateAll(model, false, true);
                    }
                    else {
                        this.cloneFormViews.resize(0);
                    }
                };
                WorldView.prototype.destroy = function () {
                    this.formViews.resize(0);
                };
                return WorldView;
            }());
            exports_22("WorldView", WorldView);
            exports_22("getViewFromStorage", getViewFromStorage = function () {
                var res = skyrimPlatform_13.storage.view;
                if (typeof res === 'object')
                    return res;
                return undefined;
            });
            exports_22("localIdToRemoteId", localIdToRemoteId = function (localFormId) {
                if (localFormId >= 0xff000000) {
                    var view = getViewFromStorage();
                    if (!view)
                        return 0;
                    localFormId = view.getRemoteRefrId(localFormId);
                    if (!localFormId)
                        return 0;
                    // serverside ids are 64bit
                    if (localFormId >= 0x100000000) {
                        localFormId -= 0x100000000;
                    }
                }
                return localFormId;
            });
            exports_22("remoteIdToLocalId", remoteIdToLocalId = function (remoteFormId) {
                if (remoteFormId >= 0xff000000) {
                    var view = getViewFromStorage();
                    if (!view)
                        return 0;
                    remoteFormId = view.getLocalRefrId(remoteFormId);
                    if (!remoteFormId)
                        return 0;
                }
                return remoteFormId;
            });
        }
    };
});
System.register("src/front/msgHandler", [], function (exports_23, context_23) {
    "use strict";
    var __moduleName = context_23 && context_23.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("src/front/modelSource", [], function (exports_24, context_24) {
    "use strict";
    var __moduleName = context_24 && context_24.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("src/front/networking", ["src/skyrim-platform/skyrimPlatform"], function (exports_25, context_25) {
    "use strict";
    var skyrimPlatform_14, sp, handlersMap, lastHostname, lastPort, createClientSafe, connect, close, on, send, reconnect;
    var __moduleName = context_25 && context_25.id;
    return {
        setters: [
            function (skyrimPlatform_14_1) {
                skyrimPlatform_14 = skyrimPlatform_14_1;
                sp = skyrimPlatform_14_1;
            }
        ],
        execute: function () {
            handlersMap = new Map();
            lastHostname = '';
            lastPort = 0;
            createClientSafe = function (hostname, port) {
                sp.printConsole("createClientSafe " + hostname + ":" + port);
                // Client sometimes call this function with bad parameters.
                // It causes assertion failure in Debug mode, but doesn't lead to anything on a regular player's machine.
                // It seems that this function will be called with the valid parameters later
                if (hostname !== '' && lastPort !== 0) {
                    skyrimPlatform_14.mpClientPlugin.createClient(hostname, port);
                }
            };
            sp.on('tick', function () {
                skyrimPlatform_14.mpClientPlugin.tick(function (packetType, jsonContent, error) {
                    var handlers = handlersMap.get(packetType) || [];
                    handlers.forEach(function (handler) {
                        var parse = function () {
                            try {
                                return JSON.parse(jsonContent);
                            }
                            catch (e) {
                                throw new Error("JSON " + jsonContent + " failed to parse: " + e);
                            }
                        };
                        handler(jsonContent.length ? parse() : error);
                    });
                });
            });
            exports_25("connect", connect = function (hostname, port) {
                lastHostname = hostname;
                lastPort = port;
                createClientSafe(hostname, port);
            });
            exports_25("close", close = function () {
                skyrimPlatform_14.mpClientPlugin.destroyClient();
            });
            exports_25("on", on = function (packetType, handler) {
                var arr = handlersMap.get(packetType);
                arr = (arr || []).concat([handler]);
                handlersMap.set(packetType, arr);
            });
            exports_25("send", send = function (msg, reliable) {
                skyrimPlatform_14.mpClientPlugin.send(JSON.stringify(msg), reliable);
            });
            // Reconnect automatically
            exports_25("reconnect", reconnect = function () { return createClientSafe(lastHostname, lastPort); });
            on('connectionFailed', reconnect);
            on('connectionDenied', reconnect);
            on('disconnect', reconnect);
        }
    };
});
System.register("src/front/sendTarget", [], function (exports_26, context_26) {
    "use strict";
    var __moduleName = context_26 && context_26.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("src/front/loadGameManager", ["src/skyrim-platform/skyrimPlatform"], function (exports_27, context_27) {
    "use strict";
    var sp, isCausedBySkyrimPlatform, addLoadGameListener, loadGame;
    var __moduleName = context_27 && context_27.id;
    return {
        setters: [
            function (sp_1) {
                sp = sp_1;
            }
        ],
        execute: function () {
            isCausedBySkyrimPlatform = false;
            exports_27("addLoadGameListener", addLoadGameListener = function (onGameLoad) {
                sp.on('loadGame', function () {
                    try {
                        onGameLoad({ isCausedBySkyrimPlatform: isCausedBySkyrimPlatform });
                    }
                    catch (e) {
                        sp.once('tick', function () {
                            isCausedBySkyrimPlatform = false;
                        });
                        throw e;
                    }
                    sp.once('tick', function () {
                        isCausedBySkyrimPlatform = false;
                    });
                });
            });
            exports_27("loadGame", loadGame = function (pos, rot, worldOrCell, changeFormNpc) {
                sp.loadGame(pos, rot, worldOrCell, changeFormNpc);
                isCausedBySkyrimPlatform = true;
            });
        }
    };
});
System.register("src/lib/idManager", [], function (exports_28, context_28) {
    "use strict";
    var IdManager;
    var __moduleName = context_28 && context_28.id;
    return {
        setters: [],
        execute: function () {
            IdManager = /** @class */ (function () {
                function IdManager() {
                    this.idByValue = new Array();
                    this.valueById = new Array();
                    this.minimumUnusedId = 0;
                }
                IdManager.prototype.allocateIdFor = function (value) {
                    if (this.idByValue.length <= value) {
                        this.idByValue.length = value + 1;
                    }
                    this.idByValue[value] = this.minimumUnusedId;
                    if (this.valueById.length <= this.minimumUnusedId) {
                        this.valueById.length = this.minimumUnusedId + 1;
                    }
                    this.valueById[this.minimumUnusedId] = value;
                    var res = this.minimumUnusedId;
                    this.minimumUnusedId++;
                    while (this.valueById.length > this.minimumUnusedId && typeof this.valueById[this.minimumUnusedId] === 'number') {
                        this.minimumUnusedId++;
                    }
                    return res;
                };
                IdManager.prototype.freeIdFor = function (value) {
                    var id = this.idByValue[value];
                    if (id < this.minimumUnusedId) {
                        this.minimumUnusedId = id;
                    }
                    this.idByValue[value] = undefined;
                    this.valueById[id] = undefined;
                };
                IdManager.prototype.getId = function (value) {
                    var r = this.idByValue[value];
                    return typeof r === 'number' ? r : -1;
                };
                IdManager.prototype.getValueById = function (id) {
                    return this.valueById[id];
                };
                return IdManager;
            }());
            exports_28("IdManager", IdManager);
        }
    };
});
System.register("src/front/updateOwner", ["src/skyrim-platform/skyrimPlatform", "src/front/view"], function (exports_29, context_29) {
    "use strict";
    var sp, view, setOwnerModel, setup;
    var __moduleName = context_29 && context_29.id;
    return {
        setters: [
            function (sp_2) {
                sp = sp_2;
            },
            function (view_1) {
                view = view_1;
            }
        ],
        execute: function () {
            exports_29("setOwnerModel", setOwnerModel = function (ownerModel) {
                sp.storage.ownerModel = ownerModel;
                sp.storage.ownerModelSet = true;
            });
            exports_29("setup", setup = function () {
                var ctx = {
                    sp: sp,
                    refr: undefined,
                    value: undefined,
                    _model: undefined,
                    getFormIdInServerFormat: function (clientsideFormId) {
                        return view.localIdToRemoteId(clientsideFormId);
                    },
                    getFormIdInClientFormat: function (serversideFormId) {
                        return view.remoteIdToLocalId(serversideFormId);
                    },
                    get: function (propName) {
                        return this._model[propName];
                    },
                    state: {},
                };
                sp.on('update', function () {
                    var keys = sp.storage.updateOwnerFunctions_keys;
                    if (!keys || !Array.isArray(keys)) {
                        keys = [];
                    }
                    var funcs = sp.storage.updateOwnerFunctions;
                    if (sp.storage.ownerModelSet !== true)
                        return;
                    var ownerModel = sp.storage.ownerModel;
                    for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                        var propName = keys_1[_i];
                        var f = funcs[propName];
                        // Actually, must always be a valid funciton, but who knows
                        if (!f)
                            continue;
                        ctx._model = ownerModel;
                        if (!ctx._model)
                            continue;
                        ctx.value = ctx._model[propName];
                        if (ctx.value === undefined)
                            continue;
                        ctx.refr = sp.ObjectReference.from(sp.Game.getPlayer());
                        ctx._model = ownerModel;
                        try {
                            if (f)
                                f(ctx);
                        }
                        catch (e) {
                            sp.printConsole("'updateOwner." + propName + "' - ", e);
                        }
                    }
                });
            });
        }
    };
});
System.register("src/front/remoteServer", ["src/skyrim-platform/skyrimPlatform", "src/front/networking", "src/front/messages", "src/front/loadGameManager", "src/front/components/inventory", "src/front/components/equipment", "src/lib/idManager", "src/front/components/look", "src/front/spSnippet", "src/front/view", "src/front/updateOwner", "src/front/components/actorvalues"], function (exports_30, context_30) {
    "use strict";
    var skyrimPlatform_15, sp, networking, messages, loadGameManager, inventory_3, equipment_2, idManager_1, look_2, spSnippet, view_2, updateOwner, actorvalues_2, setupEventSource, loggingStartMoment, maxLoggingDelay, SpawnTask, sendBrowserToken, loginWithSkympIoCredentials, getPcInventory, setPcInventory, pcInvLastApply, RemoteServer;
    var __moduleName = context_30 && context_30.id;
    return {
        setters: [
            function (skyrimPlatform_15_1) {
                skyrimPlatform_15 = skyrimPlatform_15_1;
                sp = skyrimPlatform_15_1;
            },
            function (networking_1) {
                networking = networking_1;
            },
            function (messages_2) {
                messages = messages_2;
            },
            function (loadGameManager_1) {
                loadGameManager = loadGameManager_1;
            },
            function (inventory_3_1) {
                inventory_3 = inventory_3_1;
            },
            function (equipment_2_1) {
                equipment_2 = equipment_2_1;
            },
            function (idManager_1_1) {
                idManager_1 = idManager_1_1;
            },
            function (look_2_1) {
                look_2 = look_2_1;
            },
            function (spSnippet_1) {
                spSnippet = spSnippet_1;
            },
            function (view_2_1) {
                view_2 = view_2_1;
            },
            function (updateOwner_1) {
                updateOwner = updateOwner_1;
            },
            function (actorvalues_2_1) {
                actorvalues_2 = actorvalues_2_1;
            }
        ],
        execute: function () {
            //
            // eventSource system
            //
            setupEventSource = function (ctx) {
                skyrimPlatform_15.once('update', function () {
                    try {
                        ctx._fn(ctx);
                        // printConsole(`'eventSources.${ctx._eventName}' - Added`);
                    }
                    catch (e) {
                        // printConsole(`'eventSources.${ctx._eventName}' -`, e);
                    }
                });
            };
            // Handle hot reload for eventSoucres
            if (Array.isArray(skyrimPlatform_15.storage.eventSourceContexts)) {
                skyrimPlatform_15.storage.eventSourceContexts = skyrimPlatform_15.storage.eventSourceContexts.filter(function (ctx) { return !ctx._expired; });
                skyrimPlatform_15.storage.eventSourceContexts.forEach(function (ctx) {
                    setupEventSource(ctx);
                });
            }
            loggingStartMoment = 0;
            maxLoggingDelay = 5000;
            skyrimPlatform_15.on('tick', function () {
                if (loggingStartMoment && Date.now() - loggingStartMoment > maxLoggingDelay) {
                    skyrimPlatform_15.printConsole('Logging in failed. Reconnecting.');
                    networking.reconnect();
                    loggingStartMoment = 0;
                }
            });
            SpawnTask = /** @class */ (function () {
                function SpawnTask() {
                    this.running = false;
                }
                return SpawnTask;
            }());
            sendBrowserToken = function () {
                networking.send({
                    t: messages.MsgType.CustomPacket,
                    content: {
                        customPacketType: 'browserToken',
                        token: skyrimPlatform_15.browser.getToken(),
                    },
                }, true);
            };
            loginWithSkympIoCredentials = function () {
                loggingStartMoment = Date.now();
                skyrimPlatform_15.printConsole('Logging in as skymp.io user');
                networking.send({
                    t: messages.MsgType.CustomPacket,
                    content: {
                        customPacketType: 'loginWithSkympIo',
                        gameData: skyrimPlatform_15.settings['skymp5-client'].gameData,
                    },
                }, true);
            };
            exports_30("getPcInventory", getPcInventory = function () {
                var res = skyrimPlatform_15.storage.pcInv;
                if (typeof res === 'object' && res.entries) {
                    return res;
                }
                return null;
            });
            setPcInventory = function (inv) {
                skyrimPlatform_15.storage.pcInv = inv;
            };
            pcInvLastApply = 0;
            skyrimPlatform_15.on('update', function () {
                if (equipment_2.isBadMenuShown())
                    return;
                if (Date.now() - pcInvLastApply > maxLoggingDelay) {
                    var readonlyArray = [1, 2, 3];
                    pcInvLastApply = Date.now();
                    var pcInv = getPcInventory();
                    if (pcInv)
                        inventory_3.applyInventory(skyrimPlatform_15.Game.getPlayer(), pcInv, false, true);
                }
            });
            RemoteServer = /** @class */ (function () {
                function RemoteServer() {
                    this.worldModel = { forms: [], playerCharacterFormIdx: -1 };
                    this.idManager_ = new idManager_1.IdManager();
                }
                RemoteServer.prototype.setInventory = function (msg) {
                    skyrimPlatform_15.once('update', function () {
                        setPcInventory(msg.inventory);
                        pcInvLastApply = 0;
                    });
                };
                RemoteServer.prototype.openContainer = function (msg) {
                    var _this = this;
                    skyrimPlatform_15.once('update', function () { return __awaiter(_this, void 0, void 0, function () {
                        var _this = this;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, skyrimPlatform_15.Utility.wait(0.1)];
                                case 1:
                                    _a.sent(); // Give a chance to update inventory
                                    skyrimPlatform_15.ObjectReference.from(skyrimPlatform_15.Game.getFormEx(msg.target)).activate(skyrimPlatform_15.Game.getPlayer(), true);
                                    (function () { return __awaiter(_this, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    if (!!skyrimPlatform_15.Ui.isMenuOpen('ContainerMenu')) return [3 /*break*/, 2];
                                                    return [4 /*yield*/, skyrimPlatform_15.Utility.wait(0.1)];
                                                case 1:
                                                    _a.sent();
                                                    return [3 /*break*/, 0];
                                                case 2:
                                                    if (!skyrimPlatform_15.Ui.isMenuOpen('ContainerMenu')) return [3 /*break*/, 4];
                                                    return [4 /*yield*/, skyrimPlatform_15.Utility.wait(0.1)];
                                                case 3:
                                                    _a.sent();
                                                    return [3 /*break*/, 2];
                                                case 4:
                                                    networking.send({
                                                        t: messages.MsgType.Activate,
                                                        data: { caster: 0x14, target: msg.target },
                                                    }, true);
                                                    return [2 /*return*/];
                                            }
                                        });
                                    }); })();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                };
                RemoteServer.prototype.teleport = function (msg) {
                    skyrimPlatform_15.once('update', function () {
                        skyrimPlatform_15.printConsole('Teleporting...', msg.pos, 'cell/world is', msg.worldOrCell.toString(16));
                        var worldOrCell = skyrimPlatform_15.Game.getFormEx(msg.worldOrCell);
                        skyrimPlatform_15.TESModPlatform.moveRefrToPosition(skyrimPlatform_15.Game.getPlayer(), skyrimPlatform_15.Cell.from(worldOrCell), skyrimPlatform_15.WorldSpace.from(worldOrCell), msg.pos[0], msg.pos[1], msg.pos[2], msg.rot[0], msg.rot[1], msg.rot[2]);
                        skyrimPlatform_15.Utility.wait(0.2).then(function () {
                            skyrimPlatform_15.Game.getPlayer().setAngle(msg.rot[0], msg.rot[1], msg.rot[2]);
                        });
                    });
                };
                RemoteServer.prototype.createActor = function (msg) {
                    var _this = this;
                    loggingStartMoment = 0;
                    var i = this.getIdManager().allocateIdFor(msg.idx);
                    if (this.worldModel.forms.length <= i)
                        this.worldModel.forms.length = i + 1;
                    var movement = null;
                    if (msg.refrId >= 0xff000000) {
                        movement = {
                            pos: msg.transform.pos,
                            rot: msg.transform.rot,
                            worldOrCell: msg.transform.worldOrCell,
                            runMode: 'Standing',
                            direction: 0,
                            isInJumpState: false,
                            isSneaking: false,
                            isBlocking: false,
                            isWeapDrawn: false,
                            healthPercentage: 1.0,
                        };
                    }
                    this.worldModel.forms[i] = {
                        idx: msg.idx,
                        movement: movement,
                        numMovementChanges: 0,
                        numLookChanges: 0,
                        baseId: msg.baseId,
                        refrId: msg.refrId,
                    };
                    if (msg.isMe) {
                        updateOwner.setOwnerModel(this.worldModel.forms[i]);
                    }
                    if (msg.look) {
                        this.worldModel.forms[i].look = msg.look;
                    }
                    if (msg.equipment) {
                        this.worldModel.forms[i].equipment = msg.equipment;
                    }
                    if (msg.props) {
                        Object.keys(msg.props).forEach(function (propName) {
                            var i = _this.getIdManager().getId(msg.idx);
                            _this.worldModel.forms[i][propName] = msg.props[propName];
                        });
                    }
                    if (msg.isMe)
                        this.worldModel.playerCharacterFormIdx = i;
                    if (msg.props && msg.props.isRaceMenuOpen && msg.isMe) {
                        this.setRaceMenuOpen({ type: 'setRaceMenuOpen', open: true });
                    }
                    var applyPcInv = function () {
                        inventory_3.applyInventory(skyrimPlatform_15.Game.getPlayer(), msg.equipment
                            ? {
                                entries: msg.equipment.inv.entries.filter(function (x) { return !!skyrimPlatform_15.Armor.from(skyrimPlatform_15.Game.getFormEx(x.baseId)); }),
                            }
                            : { entries: [] }, false);
                        if (msg.props && msg.props.inventory) {
                            _this.setInventory({
                                type: 'setInventory',
                                inventory: msg.props.inventory,
                            });
                        }
                    };
                    if (msg.isMe) {
                        var task_1 = new SpawnTask();
                        skyrimPlatform_15.once('update', function () {
                            if (!task_1.running) {
                                task_1.running = true;
                                skyrimPlatform_15.printConsole('Using moveRefrToPosition to spawn player');
                                var worldOrCell = skyrimPlatform_15.Game.getFormEx(msg.transform.worldOrCell);
                                skyrimPlatform_15.TESModPlatform.moveRefrToPosition(skyrimPlatform_15.Game.getPlayer(), skyrimPlatform_15.Cell.from(worldOrCell), skyrimPlatform_15.WorldSpace.from(worldOrCell), msg.transform.pos[0], msg.transform.pos[1], msg.transform.pos[2], msg.transform.rot[0], msg.transform.rot[1], msg.transform.rot[2]);
                                // Unfortunatelly it requires two calls to work
                                skyrimPlatform_15.Utility.wait(1).then(applyPcInv);
                                skyrimPlatform_15.Utility.wait(1.3).then(applyPcInv);
                            }
                            if (msg.props) {
                                var baseActorValues_1 = new Map([
                                    ['healRate', msg.props.healRate],
                                    ['healRateMult', msg.props.healRateMult],
                                    ['health', msg.props.health],
                                    ['magickaRate', msg.props.magickaRate],
                                    ['magickaRateMult', msg.props.magickaRateMult],
                                    ['magicka', msg.props.magicka],
                                    ['staminaRate', msg.props.staminaRate],
                                    ['staminaRateMult', msg.props.staminaRateMult],
                                    ['stamina', msg.props.stamina],
                                    ['healthPercentage', msg.props.healthPercentage],
                                    ['staminaPercentage', msg.props.staminaPercentage],
                                    ['magickaPercentage', msg.props.magickaPercentage],
                                ]);
                                var player_1 = skyrimPlatform_15.Game.getPlayer();
                                if (player_1) {
                                    baseActorValues_1.forEach(function (value, key) {
                                        if (typeof value === 'number') {
                                            if (key.includes('Percentage')) {
                                                var subKey = key.replace('Percentage', '');
                                                var subValue = baseActorValues_1.get(subKey);
                                                if (typeof subValue === 'number') {
                                                    actorvalues_2.setActorValuePercentage(player_1, subKey, value);
                                                }
                                            }
                                            else {
                                                player_1.setActorValue(key, value);
                                            }
                                        }
                                    });
                                }
                            }
                        });
                        skyrimPlatform_15.once('tick', function () {
                            skyrimPlatform_15.once('tick', function () {
                                if (!task_1.running) {
                                    task_1.running = true;
                                    skyrimPlatform_15.printConsole('Using loadGame to spawn player');
                                    skyrimPlatform_15.printConsole('skinColorFromServer:', msg.look ? msg.look.skinColor.toString(16) : undefined);
                                    loadGameManager.loadGame(msg.transform.pos, msg.transform.rot, msg.transform.worldOrCell, msg.look
                                        ? {
                                            name: msg.look.name,
                                            raceId: msg.look.raceId,
                                            face: {
                                                hairColor: msg.look.hairColor,
                                                bodySkinColor: msg.look.skinColor,
                                                headTextureSetId: msg.look.headTextureSetId,
                                                headPartIds: msg.look.headpartIds,
                                                presets: msg.look.presets,
                                            },
                                        }
                                        : undefined);
                                    skyrimPlatform_15.once('update', function () {
                                        applyPcInv();
                                        skyrimPlatform_15.Utility.wait(0.3).then(applyPcInv);
                                        if (msg.look) {
                                            look_2.applyLookToPlayer(msg.look);
                                            if (msg.look.isFemale) {
                                                // Fix gender-specific walking anim
                                                skyrimPlatform_15.Game.getPlayer().resurrect();
                                            }
                                        }
                                    });
                                }
                            });
                        });
                    }
                };
                RemoteServer.prototype.destroyActor = function (msg) {
                    var i = this.getIdManager().getId(msg.idx);
                    this.worldModel.forms[i] = null;
                    // Shrink to fit
                    while (1) {
                        var length = this.worldModel.forms.length;
                        if (!length)
                            break;
                        if (this.worldModel.forms[length - 1])
                            break;
                        this.worldModel.forms.length = length - 1;
                    }
                    if (this.worldModel.playerCharacterFormIdx === i) {
                        this.worldModel.playerCharacterFormIdx = -1;
                        // TODO: move to a separate module
                        skyrimPlatform_15.once('update', function () { return skyrimPlatform_15.Game.quitToMainMenu(); });
                    }
                    this.getIdManager().freeIdFor(msg.idx);
                };
                RemoteServer.prototype.UpdateMovement = function (msg) {
                    var i = this.getIdManager().getId(msg.idx);
                    this.worldModel.forms[i].movement = msg.data;
                    if (!this.worldModel.forms[i].numMovementChanges) {
                        this.worldModel.forms[i].numMovementChanges = 0;
                    }
                    this.worldModel.forms[i].numMovementChanges++;
                };
                RemoteServer.prototype.UpdateAnimation = function (msg) {
                    var i = this.getIdManager().getId(msg.idx);
                    this.worldModel.forms[i].animation = msg.data;
                };
                RemoteServer.prototype.UpdateLook = function (msg) {
                    var i = this.getIdManager().getId(msg.idx);
                    this.worldModel.forms[i].look = msg.data;
                    if (!this.worldModel.forms[i].numLookChanges) {
                        this.worldModel.forms[i].numLookChanges = 0;
                    }
                    this.worldModel.forms[i].numLookChanges++;
                };
                RemoteServer.prototype.UpdateEquipment = function (msg) {
                    var i = this.getIdManager().getId(msg.idx);
                    this.worldModel.forms[i].equipment = msg.data;
                };
                RemoteServer.prototype.UpdateProperty = function (msg) {
                    var i = this.getIdManager().getId(msg.idx);
                    this.worldModel.forms[i][msg.propName] = msg.data;
                };
                RemoteServer.prototype.handleConnectionAccepted = function () {
                    this.worldModel.forms = [];
                    this.worldModel.playerCharacterFormIdx = -1;
                    loginWithSkympIoCredentials();
                    sendBrowserToken();
                };
                RemoteServer.prototype.handleDisconnect = function () { };
                RemoteServer.prototype.ChangeValues = function (msg) {
                    var ac = skyrimPlatform_15.Game.getPlayer();
                    if (!ac)
                        return;
                    actorvalues_2.setActorValuePercentage(ac, 'health', msg.data.health);
                    actorvalues_2.setActorValuePercentage(ac, 'stamina', msg.data.stamina);
                    actorvalues_2.setActorValuePercentage(ac, 'magicka', msg.data.magicka);
                };
                RemoteServer.prototype.setRaceMenuOpen = function (msg) {
                    if (msg.open) {
                        var visualTeleportingBugDelay_1 = 0.3;
                        skyrimPlatform_15.once('update', function () {
                            return skyrimPlatform_15.Utility.wait(visualTeleportingBugDelay_1).then(function () {
                                var ironHelment = skyrimPlatform_15.Armor.from(skyrimPlatform_15.Game.getFormEx(0x00012e4d));
                                skyrimPlatform_15.Game.getPlayer().unequipItem(ironHelment, false, true);
                                skyrimPlatform_15.Game.showRaceMenu();
                            });
                        });
                    }
                    else {
                        // TODO: Implement closeMenu in SkyrimPlatform
                    }
                };
                RemoteServer.prototype.customPacket = function (msg) {
                    switch (msg.content.customPacketType) {
                        case 'loginRequired':
                            loginWithSkympIoCredentials();
                            break;
                    }
                };
                RemoteServer.prototype.spSnippet = function (msg) {
                    var _this = this;
                    skyrimPlatform_15.once('update', function () { return __awaiter(_this, void 0, void 0, function () {
                        var _this = this;
                        return __generator(this, function (_a) {
                            spSnippet
                                .run(msg)
                                .then(function (res) {
                                if (res === undefined)
                                    res = null;
                                _this.send({
                                    t: messages.MsgType.FinishSpSnippet,
                                    returnValue: res,
                                    snippetIdx: msg.snippetIdx,
                                }, true);
                            })
                                .catch(function (e) { return skyrimPlatform_15.printConsole('!!! SpSnippet failed', e); });
                            return [2 /*return*/];
                        });
                    }); });
                };
                RemoteServer.prototype.updateGamemodeUpdateFunctions = function (storageVar, functionSources) {
                    skyrimPlatform_15.storage[storageVar] = JSON.parse(JSON.stringify(functionSources));
                    Object.keys(functionSources).forEach(function (propName) {
                        try {
                            skyrimPlatform_15.storage[storageVar][propName] = new Function('ctx', skyrimPlatform_15.storage[storageVar][propName]);
                            var emptyFunction = functionSources[propName] === '';
                            if (emptyFunction) {
                                delete skyrimPlatform_15.storage[storageVar][propName];
                                // printConsole(`'${storageVar}.${propName}' -`, 'Added empty');
                            }
                            else {
                                // printConsole(`'${storageVar}.${propName}' -`, 'Added');
                            }
                        }
                        catch (e) {
                            skyrimPlatform_15.printConsole("'" + storageVar + "." + propName + "' -", e);
                        }
                    });
                    skyrimPlatform_15.storage[storageVar + "_keys"] = Object.keys(skyrimPlatform_15.storage[storageVar]);
                };
                RemoteServer.prototype.updateGamemodeData = function (msg) {
                    var _this = this;
                    skyrimPlatform_15.storage._api_onAnimationEvent = { callback: function () { } };
                    //
                    // updateOwnerFunctions/updateNeighborFunctions
                    //
                    skyrimPlatform_15.storage.updateNeighborFunctions = undefined;
                    skyrimPlatform_15.storage.updateOwnerFunctions = undefined;
                    this.updateGamemodeUpdateFunctions('updateNeighborFunctions', msg.updateNeighborFunctions || {});
                    this.updateGamemodeUpdateFunctions('updateOwnerFunctions', msg.updateOwnerFunctions || {});
                    //
                    // EventSource
                    //
                    if (!Array.isArray(skyrimPlatform_15.storage.eventSourceContexts)) {
                        skyrimPlatform_15.storage.eventSourceContexts = [];
                    }
                    else {
                        skyrimPlatform_15.storage.eventSourceContexts.forEach(function (ctx) {
                            ctx.sendEvent = function () { };
                            ctx._expired = true;
                        });
                    }
                    var eventNames = Object.keys(msg.eventSources);
                    eventNames.forEach(function (eventName) {
                        try {
                            var fn = new Function('ctx', msg.eventSources[eventName]);
                            var ctx = {
                                sp: sp,
                                sendEvent: function () {
                                    var args = [];
                                    for (var _i = 0; _i < arguments.length; _i++) {
                                        args[_i] = arguments[_i];
                                    }
                                    _this.send({
                                        t: messages.MsgType.CustomEvent,
                                        args: args,
                                        eventName: eventName,
                                    }, true);
                                },
                                getFormIdInServerFormat: function (clientsideFormId) {
                                    return view_2.localIdToRemoteId(clientsideFormId);
                                },
                                getFormIdInClientFormat: function (serversideFormId) {
                                    return view_2.remoteIdToLocalId(serversideFormId);
                                },
                                _fn: fn,
                                _eventName: eventName,
                                state: {},
                            };
                            skyrimPlatform_15.storage.eventSourceContexts.push(ctx);
                            setupEventSource(ctx);
                        }
                        catch (e) {
                            skyrimPlatform_15.printConsole("'eventSources." + eventName + "' -", e);
                        }
                    });
                };
                /** Packet handlers end * */
                RemoteServer.prototype.getWorldModel = function () {
                    return this.worldModel;
                };
                RemoteServer.prototype.getMyActorIndex = function () {
                    return this.worldModel.playerCharacterFormIdx;
                };
                RemoteServer.prototype.send = function (msg, reliable) {
                    if (this.worldModel.playerCharacterFormIdx === -1)
                        return;
                    var refrId = msg._refrId;
                    var idxInModel = refrId
                        ? this.worldModel.forms.findIndex(function (f) { return f && f.refrId === refrId; })
                        : this.worldModel.playerCharacterFormIdx;
                    msg.idx = this.worldModel.forms[idxInModel].idx;
                    delete msg._refrId;
                    networking.send(msg, reliable);
                };
                RemoteServer.prototype.getIdManager = function () {
                    if (!this.idManager_)
                        this.idManager_ = new idManager_1.IdManager();
                    return this.idManager_;
                };
                return RemoteServer;
            }());
            exports_30("RemoteServer", RemoteServer);
        }
    };
});
System.register("src/front/skympClient", ["src/skyrim-platform/skyrimPlatform", "src/front/view", "src/front/components/movement", "src/front/components/look", "src/front/components/animation", "src/front/components/equipment", "src/front/components/inventory", "src/front/messages", "src/front/remoteServer", "src/front/networking", "src/front/loadGameManager", "src/front/deathSystem", "src/front/console", "src/front/hostAttempts", "src/front/updateOwner", "src/front/components/actorvalues"], function (exports_31, context_31) {
    "use strict";
    var skyrimPlatform_16, sp, view_3, movement_2, look_3, animation_2, equipment_3, inventory_4, messages_3, remoteServer_1, networking, loadGameManager, deathSystem, console_2, hostAttempts_2, updateOwner, actorvalues_3, handleMessage, targetIp, targetPort, SkympClient;
    var __moduleName = context_31 && context_31.id;
    return {
        setters: [
            function (skyrimPlatform_16_1) {
                skyrimPlatform_16 = skyrimPlatform_16_1;
                sp = skyrimPlatform_16_1;
            },
            function (view_3_1) {
                view_3 = view_3_1;
            },
            function (movement_2_1) {
                movement_2 = movement_2_1;
            },
            function (look_3_1) {
                look_3 = look_3_1;
            },
            function (animation_2_1) {
                animation_2 = animation_2_1;
            },
            function (equipment_3_1) {
                equipment_3 = equipment_3_1;
            },
            function (inventory_4_1) {
                inventory_4 = inventory_4_1;
            },
            function (messages_3_1) {
                messages_3 = messages_3_1;
            },
            function (remoteServer_1_1) {
                remoteServer_1 = remoteServer_1_1;
            },
            function (networking_2) {
                networking = networking_2;
            },
            function (loadGameManager_2) {
                loadGameManager = loadGameManager_2;
            },
            function (deathSystem_2) {
                deathSystem = deathSystem_2;
            },
            function (console_2_1) {
                console_2 = console_2_1;
            },
            function (hostAttempts_2_1) {
                hostAttempts_2 = hostAttempts_2_1;
            },
            function (updateOwner_2) {
                updateOwner = updateOwner_2;
            },
            function (actorvalues_3_1) {
                actorvalues_3 = actorvalues_3_1;
            }
        ],
        execute: function () {
            handleMessage = function (msgAny, handler_) {
                var msgType = msgAny.type || messages_3.MsgType[msgAny.t];
                var handler = handler_;
                var f = handler[msgType];
                /* if (msgType !== "UpdateMovement") {
                printConsole();
                for (const key in msgAny) {
                  const v = (msgAny as Record<string, any>)[key];
                  printConsole(`${key}=${JSON.stringify(v)}`);
                }
              } */
                if (msgType === 'hostStart') {
                    var msg = msgAny;
                    var target = msg.target;
                    skyrimPlatform_16.printConsole('hostStart', target.toString(16));
                    var hosted = skyrimPlatform_16.storage.hosted;
                    if (typeof hosted !== typeof []) {
                        // if you try to switch to Set checkout .concat usage.
                        // concat compiles but doesn't work as expected
                        hosted = new Array();
                        skyrimPlatform_16.storage.hosted = hosted;
                    }
                    if (!hosted.includes(target)) {
                        hosted.push(target);
                    }
                }
                if (msgType === 'hostStop') {
                    var msg = msgAny;
                    var target_1 = msg.target;
                    skyrimPlatform_16.printConsole('hostStop', target_1.toString(16));
                    var hosted = skyrimPlatform_16.storage.hosted;
                    if (typeof hosted === typeof []) {
                        skyrimPlatform_16.storage.hosted = hosted.filter(function (x) { return x !== target_1; });
                    }
                }
                if (f && typeof f === 'function')
                    handler[msgType](msgAny);
            };
            // for (let i = 0; i < 100; ++i) printConsole();
            skyrimPlatform_16.printConsole('Hello Multiplayer');
            skyrimPlatform_16.printConsole('settings:', skyrimPlatform_16.settings['skymp5-client']);
            targetIp = skyrimPlatform_16.settings['skymp5-client']['server-ip'];
            targetPort = skyrimPlatform_16.settings['skymp5-client']['server-port'];
            if (skyrimPlatform_16.storage.targetIp !== targetIp || skyrimPlatform_16.storage.targetPort !== targetPort) {
                skyrimPlatform_16.storage.targetIp = targetIp;
                skyrimPlatform_16.storage.targetPort = targetPort;
                skyrimPlatform_16.printConsole("Connecting to " + skyrimPlatform_16.storage.targetIp + ":" + skyrimPlatform_16.storage.targetPort);
                networking.connect(targetIp, targetPort);
            }
            else {
                skyrimPlatform_16.printConsole('Reconnect is not required');
            }
            SkympClient = /** @class */ (function () {
                function SkympClient() {
                    var _this = this;
                    this.playerAnimSource = new Map();
                    this.lastSendMovementMoment = new Map();
                    this.lastAnimationSent = new Map();
                    this.msgHandler = undefined;
                    this.sendTarget = undefined;
                    this.isRaceSexMenuShown = false;
                    this.singlePlayer = false;
                    this.equipmentChanged = false;
                    this.numEquipmentChanges = 0;
                    this.prevValues = { health: 0, stamina: 0, magicka: 0 };
                    this.prevActorValuesUpdateTime = 0;
                    this.actorValuesNeedUpdate = false;
                    this.resetView();
                    this.resetRemoteServer();
                    animation_2.setupHooks();
                    updateOwner.setup();
                    sp.printConsole('SkympClient ctor');
                    networking.on('connectionFailed', function () {
                        skyrimPlatform_16.printConsole('Connection failed');
                    });
                    networking.on('connectionDenied', function (err) {
                        skyrimPlatform_16.printConsole('Connection denied: ', err);
                    });
                    networking.on('connectionAccepted', function () {
                        _this.msgHandler.handleConnectionAccepted();
                    });
                    networking.on('disconnect', function () {
                        _this.msgHandler.handleDisconnect();
                    });
                    networking.on('message', function (msgAny) {
                        handleMessage(msgAny, _this.msgHandler);
                    });
                    skyrimPlatform_16.on('update', function () {
                        if (!_this.singlePlayer) {
                            _this.sendInputs();
                        }
                    });
                    var lastInv;
                    skyrimPlatform_16.once('update', function () {
                        var send = function (msg) {
                            _this.sendTarget.send(msg, true);
                        };
                        var localIdToRemoteId = function (localId) {
                            return _this.localIdToRemoteId(localId);
                        };
                        console_2.setUpConsoleCommands(send, localIdToRemoteId);
                    });
                    skyrimPlatform_16.on('activate', function (e) {
                        lastInv = inventory_4.getInventory(skyrimPlatform_16.Game.getPlayer());
                        var caster = e.caster ? e.caster.getFormID() : 0;
                        var target = e.target ? e.target.getFormID() : 0;
                        if (!target || !caster)
                            return;
                        // Actors never have non-ff ids locally in skymp
                        if (caster !== 0x14 && caster < 0xff000000)
                            return;
                        target = _this.localIdToRemoteId(target);
                        if (!target)
                            return skyrimPlatform_16.printConsole('localIdToRemoteId returned 0 (target)');
                        caster = _this.localIdToRemoteId(caster);
                        if (!caster)
                            return skyrimPlatform_16.printConsole('localIdToRemoteId returned 0 (caster)');
                        var openState = e.target.getOpenState();
                        if (openState === 2 /* Opening */ || openState === 4 /* Closing */)
                            return;
                        _this.sendTarget.send({ t: messages_3.MsgType.Activate, data: { caster: caster, target: target } }, true);
                        skyrimPlatform_16.printConsole('sendActi', { caster: caster, target: target });
                    });
                    var furnitureStreak = new Map();
                    skyrimPlatform_16.on('containerChanged', function (e) {
                        var oldContainerId = e.oldContainer ? e.oldContainer.getFormID() : 0;
                        var newContainerId = e.newContainer ? e.newContainer.getFormID() : 0;
                        var baseObjId = e.baseObj ? e.baseObj.getFormID() : 0;
                        if (oldContainerId !== 0x14 && newContainerId !== 0x14)
                            return;
                        var furnitureRef = skyrimPlatform_16.Game.getPlayer().getFurnitureReference();
                        if (!furnitureRef)
                            return;
                        var furrnitureId = furnitureRef.getFormID();
                        if (oldContainerId === 0x14 && newContainerId === 0) {
                            var craftInputObjects = furnitureStreak.get(furrnitureId);
                            if (!craftInputObjects) {
                                craftInputObjects = { entries: [] };
                            }
                            craftInputObjects.entries.push({
                                baseId: baseObjId,
                                count: e.numItems,
                            });
                            furnitureStreak.set(furrnitureId, craftInputObjects);
                            skyrimPlatform_16.printConsole("Adding " + baseObjId.toString(16) + " (" + e.numItems + ") to recipe");
                        }
                        else if (oldContainerId === 0 && newContainerId === 0x14) {
                            skyrimPlatform_16.printConsole('Flushing recipe');
                            var craftInputObjects = furnitureStreak.get(furrnitureId);
                            if (craftInputObjects && craftInputObjects.entries.length) {
                                furnitureStreak.delete(furrnitureId);
                                var workbench = _this.localIdToRemoteId(furrnitureId);
                                if (!workbench)
                                    return skyrimPlatform_16.printConsole('localIdToRemoteId returned 0');
                                _this.sendTarget.send({
                                    t: messages_3.MsgType.CraftItem,
                                    data: { workbench: workbench, craftInputObjects: craftInputObjects, resultObjectId: baseObjId },
                                }, true);
                                skyrimPlatform_16.printConsole('sendCraft', {
                                    workbench: workbench,
                                    craftInputObjects: craftInputObjects,
                                    resultObjectId: baseObjId,
                                });
                            }
                        }
                    });
                    skyrimPlatform_16.on('containerChanged', function (e) {
                        if (e.oldContainer && e.newContainer) {
                            if (e.oldContainer.getFormID() === 0x14 || e.newContainer.getFormID() === 0x14) {
                                skyrimPlatform_16.printConsole(1);
                                if (!lastInv)
                                    lastInv = remoteServer_1.getPcInventory();
                                if (lastInv) {
                                    skyrimPlatform_16.printConsole(2);
                                    var newInv = inventory_4.getInventory(skyrimPlatform_16.Game.getPlayer());
                                    // It seems that 'ignoreWorn = false' fixes this:
                                    // https://github.com/skyrim-multiplayer/issue-tracker/issues/43
                                    // For some reason excess diff is produced when 'ignoreWorn = true'
                                    // I thought that it would be vice versa but that's how it works
                                    var ignoreWorn = false;
                                    var diff = inventory_4.getDiff(lastInv, newInv, ignoreWorn);
                                    skyrimPlatform_16.printConsole('diff:');
                                    for (var i = 0; i < diff.entries.length; ++i) {
                                        skyrimPlatform_16.printConsole("[" + i + "] " + JSON.stringify(diff.entries[i]));
                                    }
                                    var msgs = diff.entries.map(function (entry) {
                                        if (entry.count !== 0) {
                                            var msg = JSON.parse(JSON.stringify(entry));
                                            delete msg.name; // Extra name works too strange
                                            msg.t = entry.count > 0 ? messages_3.MsgType.PutItem : messages_3.MsgType.TakeItem;
                                            msg.count = Math.abs(msg.count);
                                            msg.target =
                                                e.oldContainer.getFormID() === 0x14 ? e.newContainer.getFormID() : e.oldContainer.getFormID();
                                            return msg;
                                        }
                                    });
                                    msgs.forEach(function (msg) { return _this.sendTarget.send(msg, true); });
                                }
                            }
                        }
                    });
                    var playerFormId = 0x14;
                    skyrimPlatform_16.on('equip', function (e) {
                        if (!e.actor || !e.baseObj)
                            return;
                        if (e.actor.getFormID() === playerFormId) {
                            _this.equipmentChanged = true;
                            _this.sendTarget.send({ t: messages_3.MsgType.OnEquip, baseId: e.baseObj.getFormID() }, false);
                        }
                    });
                    skyrimPlatform_16.on('unequip', function (e) {
                        if (!e.actor || !e.baseObj)
                            return;
                        if (e.actor.getFormID() === playerFormId) {
                            _this.equipmentChanged = true;
                        }
                    });
                    skyrimPlatform_16.on('loadGame', function () {
                        // Currently only armor is equipped after relogging (see remoteServer.ts)
                        // This hack forces sending /equipment without weapons/ back to the server
                        skyrimPlatform_16.Utility.wait(3).then(function () {
                            _this.equipmentChanged = true;
                        });
                    });
                    loadGameManager.addLoadGameListener(function (e) {
                        if (!e.isCausedBySkyrimPlatform && !_this.singlePlayer) {
                            sp.Debug.messageBox('Save has been loaded in multiplayer, switching to the single-player mode');
                            networking.close();
                            _this.singlePlayer = true;
                            skyrimPlatform_16.Game.setInChargen(false, false, false);
                        }
                    });
                    skyrimPlatform_16.on('update', function () { return deathSystem.update(); });
                    skyrimPlatform_16.once('update', function () {
                        var player = skyrimPlatform_16.Game.getPlayer();
                        if (player) {
                            deathSystem.makeActorImmortal(player);
                        }
                    });
                }
                // May return null
                SkympClient.prototype.getInputOwner = function (_refrId) {
                    return _refrId ? skyrimPlatform_16.Actor.from(skyrimPlatform_16.Game.getFormEx(this.remoteIdToLocalId(_refrId))) : skyrimPlatform_16.Game.getPlayer();
                };
                SkympClient.prototype.sendMovement = function (_refrId) {
                    var owner = this.getInputOwner(_refrId);
                    if (!owner)
                        return;
                    var refrIdStr = "" + _refrId;
                    var sendMovementRateMs = 130;
                    var now = Date.now();
                    var last = this.lastSendMovementMoment.get(refrIdStr);
                    if (!last || now - last > sendMovementRateMs) {
                        this.sendTarget.send({
                            t: messages_3.MsgType.UpdateMovement,
                            data: movement_2.getMovement(owner),
                            _refrId: _refrId,
                        }, false);
                        this.lastSendMovementMoment.set(refrIdStr, now);
                    }
                };
                SkympClient.prototype.sendAnimation = function (_refrId) {
                    var owner = this.getInputOwner(_refrId);
                    if (!owner)
                        return;
                    // Extermly important that it's a local id since AnimationSource depends on it
                    var refrIdStr = owner.getFormID().toString(16);
                    var animSource = this.playerAnimSource.get(refrIdStr);
                    if (!animSource) {
                        animSource = new animation_2.AnimationSource(owner);
                        this.playerAnimSource.set(refrIdStr, animSource);
                    }
                    var anim = animSource.getAnimation();
                    var lastAnimationSent = this.lastAnimationSent.get(refrIdStr);
                    if (!lastAnimationSent || anim.numChanges !== lastAnimationSent.numChanges) {
                        if (anim.animEventName !== '') {
                            this.lastAnimationSent.set(refrIdStr, anim);
                            this.updateActorValuesAfterAnimation(anim.animEventName);
                            this.sendTarget.send({ t: messages_3.MsgType.UpdateAnimation, data: anim, _refrId: _refrId }, false);
                            if (skyrimPlatform_16.storage._api_onAnimationEvent &&
                                skyrimPlatform_16.storage._api_onAnimationEvent.callback) {
                                try {
                                    skyrimPlatform_16.storage._api_onAnimationEvent.callback(_refrId || 0x14, anim.animEventName);
                                }
                                catch (e) {
                                    skyrimPlatform_16.printConsole('"_api_onAnimationEvent" -', e);
                                }
                            }
                        }
                    }
                };
                SkympClient.prototype.sendLook = function (_refrId) {
                    if (_refrId)
                        return;
                    var shown = skyrimPlatform_16.Ui.isMenuOpen('RaceSex Menu');
                    if (shown !== this.isRaceSexMenuShown) {
                        this.isRaceSexMenuShown = shown;
                        if (!shown) {
                            skyrimPlatform_16.printConsole('Exited from race menu');
                            var look = look_3.getLook(skyrimPlatform_16.Game.getPlayer());
                            this.sendTarget.send({ t: messages_3.MsgType.UpdateLook, data: look, _refrId: _refrId }, true);
                        }
                    }
                };
                SkympClient.prototype.sendEquipment = function (_refrId) {
                    if (_refrId)
                        return;
                    if (this.equipmentChanged) {
                        this.equipmentChanged = false;
                        ++this.numEquipmentChanges;
                        var eq = equipment_3.getEquipment(skyrimPlatform_16.Game.getPlayer(), this.numEquipmentChanges);
                        this.sendTarget.send({ t: messages_3.MsgType.UpdateEquipment, data: eq, _refrId: _refrId }, true);
                        skyrimPlatform_16.printConsole({ eq: eq });
                    }
                };
                SkympClient.prototype.sendActorValuePercentage = function (_refrId) {
                    var owner = this.getInputOwner(_refrId);
                    if (!owner)
                        return;
                    var av = actorvalues_3.getActorValues(skyrimPlatform_16.Game.getPlayer());
                    var currentTime = Date.now();
                    if (currentTime - this.prevActorValuesUpdateTime < 1000 && this.actorValuesNeedUpdate === false) {
                        return;
                    }
                    if (this.prevValues.health !== av.health ||
                        this.prevValues.stamina !== av.stamina ||
                        this.prevValues.magicka !== av.magicka ||
                        this.actorValuesNeedUpdate === true) {
                        this.sendTarget.send({ t: messages_3.MsgType.ChangeValues, data: av, _refrId: _refrId }, true);
                        this.actorValuesNeedUpdate = false;
                        this.prevValues = av;
                        this.prevActorValuesUpdateTime = currentTime;
                    }
                };
                SkympClient.prototype.sendHostAttempts = function () {
                    var remoteId = hostAttempts_2.nextHostAttempt();
                    if (!remoteId)
                        return;
                    this.sendTarget.send({ t: messages_3.MsgType.Host, remoteId: remoteId }, false);
                };
                SkympClient.prototype.sendInputs = function () {
                    var _this = this;
                    var hosted = typeof skyrimPlatform_16.storage.hosted === typeof [] ? skyrimPlatform_16.storage.hosted : [];
                    var targets = [undefined].concat(hosted);
                    // printConsole({ targets });
                    targets.forEach(function (target) {
                        _this.sendMovement(target);
                        _this.sendAnimation(target);
                        _this.sendLook(target);
                        _this.sendEquipment(target);
                        _this.sendActorValuePercentage(target);
                    });
                    this.sendHostAttempts();
                };
                SkympClient.prototype.resetRemoteServer = function () {
                    var prevRemoteServer = skyrimPlatform_16.storage.remoteServer;
                    var rs;
                    if (prevRemoteServer && prevRemoteServer.getWorldModel) {
                        rs = prevRemoteServer;
                        skyrimPlatform_16.printConsole('Restore previous RemoteServer');
                        // Keep previous RemoteServer, but update func implementations
                        var newObj = new remoteServer_1.RemoteServer();
                        var rsAny = rs;
                        for (var key in newObj) {
                            if (typeof newObj[key] === 'function')
                                rsAny[key] = newObj[key];
                        }
                    }
                    else {
                        rs = new remoteServer_1.RemoteServer();
                        skyrimPlatform_16.printConsole('Creating RemoteServer');
                    }
                    this.sendTarget = rs;
                    this.msgHandler = rs;
                    this.modelSource = rs;
                    skyrimPlatform_16.storage.remoteServer = rs;
                };
                SkympClient.prototype.resetView = function () {
                    var _this = this;
                    var prevView = skyrimPlatform_16.storage.view;
                    var view = new view_3.WorldView();
                    skyrimPlatform_16.once('update', function () {
                        if (prevView && prevView.destroy) {
                            prevView.destroy();
                            skyrimPlatform_16.printConsole('Previous View destroyed');
                        }
                        skyrimPlatform_16.storage.view = view;
                    });
                    skyrimPlatform_16.on('update', function () {
                        if (!_this.singlePlayer)
                            view.update(_this.modelSource.getWorldModel());
                    });
                };
                SkympClient.prototype.getView = function () {
                    return view_3.getViewFromStorage();
                };
                SkympClient.prototype.localIdToRemoteId = function (localFormId) {
                    return view_3.localIdToRemoteId(localFormId);
                };
                SkympClient.prototype.remoteIdToLocalId = function (remoteFormId) {
                    return view_3.remoteIdToLocalId(remoteFormId);
                };
                SkympClient.prototype.updateActorValuesAfterAnimation = function (animName) {
                    if (animName === 'JumpLand' || animName === 'JumpLandDirectional' || animName === 'DeathAnim') {
                        this.actorValuesNeedUpdate = true;
                    }
                };
                return SkympClient;
            }());
            exports_31("SkympClient", SkympClient);
            skyrimPlatform_16.once('update', function () {
                // Is it racing with OnInit in Papyrus?
                sp.TESModPlatform.blockPapyrusEvents(true);
            });
        }
    };
});
System.register("src/front/version", ["src/skyrim-platform/skyrimPlatform"], function (exports_32, context_32) {
    "use strict";
    var skyrimPlatform_17, requiredVersion, realVersion, verifyVersion;
    var __moduleName = context_32 && context_32.id;
    return {
        setters: [
            function (skyrimPlatform_17_1) {
                skyrimPlatform_17 = skyrimPlatform_17_1;
            }
        ],
        execute: function () {
            requiredVersion = '0.7.0+build3';
            realVersion = typeof skyrimPlatform_17.getPlatformVersion === 'function' ? skyrimPlatform_17.getPlatformVersion() : 'unknown';
            exports_32("verifyVersion", verifyVersion = function () {
                if (!requiredVersion.includes(realVersion)) {
                    skyrimPlatform_17.Debug.messageBox("You need to have on of those SkyrimPlatform versions " + JSON.stringify(requiredVersion) + " to join this server. Your current version is " + realVersion);
                    skyrimPlatform_17.Utility.waitMenuMode(0.5).then(function () {
                        skyrimPlatform_17.on('update', function () {
                            if (!skyrimPlatform_17.Ui.isMenuOpen('MessageBoxMenu'))
                                skyrimPlatform_17.Game.quitToMainMenu();
                        });
                    });
                }
            });
        }
    };
});
System.register("src/front/index", ["src/skyrim-platform/skyrimPlatform", "src/front/skympClient", "src/front/console", "src/front/browser", "src/front/loadGameManager", "src/front/version", "src/front/worldCleaner"], function (exports_33, context_33) {
    "use strict";
    var skyrimPlatform_18, skympClient_1, console_3, browser, loadGameManager, version_1, worldCleaner_2, enforceLimitations, lastTimeUpd, riftenUnlocked, n, k, zeroKMoment, lastFps;
    var __moduleName = context_33 && context_33.id;
    return {
        setters: [
            function (skyrimPlatform_18_1) {
                skyrimPlatform_18 = skyrimPlatform_18_1;
            },
            function (skympClient_1_1) {
                skympClient_1 = skympClient_1_1;
            },
            function (console_3_1) {
                console_3 = console_3_1;
            },
            function (browser_1) {
                browser = browser_1;
            },
            function (loadGameManager_3) {
                loadGameManager = loadGameManager_3;
            },
            function (version_1_1) {
                version_1 = version_1_1;
            },
            function (worldCleaner_2_1) {
                worldCleaner_2 = worldCleaner_2_1;
            }
        ],
        execute: function () {
            new skympClient_1.SkympClient();
            enforceLimitations = function () {
                skyrimPlatform_18.Game.setInChargen(true, true, false);
            };
            skyrimPlatform_18.once('update', enforceLimitations);
            loadGameManager.addLoadGameListener(enforceLimitations);
            skyrimPlatform_18.once('update', function () {
                skyrimPlatform_18.Utility.setINIBool('bAlwaysActive:General', true);
            });
            skyrimPlatform_18.on('update', function () {
                skyrimPlatform_18.Utility.setINIInt('iDifficulty:GamePlay', 5);
                skyrimPlatform_18.Game.enableFastTravel(false);
            });
            browser.main();
            console_3.blockConsole();
            skyrimPlatform_18.once('update', version_1.verifyVersion);
            skyrimPlatform_18.on('update', function () { return worldCleaner_2.updateWc(); });
            lastTimeUpd = 0;
            skyrimPlatform_18.on('update', function () {
                if (Date.now() - lastTimeUpd <= 2000)
                    return;
                lastTimeUpd = Date.now();
                // Also update weather to be always clear
                var w = skyrimPlatform_18.Weather.findWeather(0);
                if (w)
                    w.setActive(false, false);
                var gameHourId = 0x38;
                var gameHour = skyrimPlatform_18.GlobalVariable.from(skyrimPlatform_18.Game.getFormEx(gameHourId));
                var gameDayId = 0x37;
                var gameDay = skyrimPlatform_18.GlobalVariable.from(skyrimPlatform_18.Game.getFormEx(gameDayId));
                var gameMonthId = 0x36;
                var gameMonth = skyrimPlatform_18.GlobalVariable.from(skyrimPlatform_18.Game.getFormEx(gameMonthId));
                var gameYearId = 0x35;
                var gameYear = skyrimPlatform_18.GlobalVariable.from(skyrimPlatform_18.Game.getFormEx(gameYearId));
                var timeScaleId = 0x3a;
                var timeScale = skyrimPlatform_18.GlobalVariable.from(skyrimPlatform_18.Game.getFormEx(timeScaleId));
                var d = new Date();
                var hour = d.getUTCHours();
                var mm = d.getUTCMinutes() / 60;
                var ss = d.getUTCSeconds() / 60 / 60;
                var mss = d.getUTCMilliseconds() / 60 / 60 / 1000;
                gameHour.setValue(hour + mm + ss + mss);
                gameDay.setValue(d.getUTCDate());
                gameMonth.setValue(d.getUTCMonth());
                gameYear.setValue(d.getUTCFullYear() - 2020 + 199);
                timeScale.setValue(1);
            });
            skyrimPlatform_18.once('update', function () {
                var notify = function (msg) {
                    var _a;
                    var countRegex = /(\d+)/;
                    var countRemoveRegex = /[(].+[)]$/gm;
                    var typeRemoveRegex = /^[+-]\s/gm;
                    var getType = function (msg) {
                        if (msg.startsWith('+'))
                            return 'additem';
                        if (msg.startsWith('-'))
                            return 'deleteitem';
                        return 'default';
                    };
                    var type = getType(msg);
                    var match = (_a = msg.match(countRegex)) !== null && _a !== void 0 ? _a : [];
                    var count = +match[0];
                    var message = msg.replace(countRemoveRegex, '').replace(typeRemoveRegex, '');
                    var data = { message: message, type: type, count: count };
                    browser.dispatch('INFOBAR_ADD_MESSAGE', data);
                };
                skyrimPlatform_18.Debug.notification = notify;
            });
            riftenUnlocked = false;
            skyrimPlatform_18.on('update', function () {
                if (riftenUnlocked)
                    return;
                var refr = skyrimPlatform_18.ObjectReference.from(skyrimPlatform_18.Game.getFormEx(0x42284));
                if (refr)
                    return;
                refr.lock(false, false);
                riftenUnlocked = true;
            });
            n = 10;
            k = 0;
            zeroKMoment = 0;
            lastFps = 0;
            skyrimPlatform_18.on('update', function () {
                ++k;
                if (k === n) {
                    k = 0;
                    if (zeroKMoment) {
                        var timePassed = (Date.now() - zeroKMoment) * 0.001;
                        var fps = Math.round(n / timePassed);
                        if (lastFps !== fps) {
                            lastFps = fps;
                            // printConsole(`Current FPS is ${fps}`);
                        }
                    }
                    zeroKMoment = Date.now();
                }
            });
        }
    };
});
var isScroll = function (t) { return t === 23; };
var isArmor = function (t) { return t === 26; };
var isBook = function (t) { return t === 27; };
var isContainer = function (t) { return t === 28; };
var isDoor = function (t) { return t === 29; };
var isIngredient = function (t) { return t === 30; };
var isLight = function (t) { return t === 31; };
var isMisc = function (t) { return t === 32; };
var isMovableStatic = function (t) { return t === 36; };
var isTree = function (t) { return t === 38; };
var isFlora = function (t) { return t === 39; };
var isWeapon = function (t) { return t === 41; };
var isAmmo = function (t) { return t === 42; };
var isNpc = function (t) { return t === 43; };
var isPotion = function (t) { return t === 46; };
var isSoulGem = function (t) { return t === 52; };
var isIngredientSource = function (t) { return isFlora(t) || isTree(t); };
var isItem = function (t) {
    return isAmmo(t) ||
        isArmor(t) ||
        isBook(t) ||
        isIngredient(t) ||
        isLight(t) ||
        isPotion(t) ||
        isScroll(t) ||
        isSoulGem(t) ||
        isWeapon(t) ||
        isMisc(t);
};
