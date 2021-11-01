var parcelRequire = undefined;
// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"zNfc":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.statePropFactory = exports.propertyExist = exports.handleNotExistsProperty = exports.checkAndCreatePropertyExist = void 0;

const handleNotExistsProperty = err => {
  const regex = /Property.+doesn't exist/gm;
  return regex.exec(err) !== null;
};

exports.handleNotExistsProperty = handleNotExistsProperty;

const propertyExist = (mp, formId, key) => {
  try {
    mp.get(formId, key);
    return true;
  } catch (err) {
    if (handleNotExistsProperty(err)) {
      return false;
    }

    console.log(err);
  }

  return false;
};

exports.propertyExist = propertyExist;

const checkAndCreatePropertyExist = (mp, formId, key) => {
  try {
    mp.get(formId, key);
  } catch (err) {
    if (handleNotExistsProperty(err)) {
      statePropFactory(mp, key);
      return;
    }

    console.log(err);
  }
};

exports.checkAndCreatePropertyExist = checkAndCreatePropertyExist;

const statePropFactory = (mp, stateName, sync = false) => {
  mp.makeProperty(stateName, {
    isVisibleByOwner: sync,
    isVisibleByNeighbors: sync,
    updateOwner: '',
    updateNeighbor: ''
  });
};

exports.statePropFactory = statePropFactory;
},{}],"OORL":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.runPropertiesSaver = exports.getAllPropsFromData = exports.addToQueue = void 0;

var _functions = require("../papyrus/multiplayer/functions");

const ignoreProperties = ['pos', 'worldOrCellDesc', 'angle', 'inventory', 'eval', 'uiOpened', 'browserFocused', 'browserVisible', 'browserModal', 'isBlocking', 'isWeaponDrawn', 'isFlying', 'isSprinting', 'communicationId', 'actionType', 'party', 'leader', 'groupMembers', 'chromeInputFocus', 'isDead', 'staminaNumChanges', 'lastAnimation', 'CurrentCrosshairRef'];
let properties = [];

const addToQueue = (formId, prop, value) => {
  const property = {
    formId,
    prop,
    value
  };
  properties.push(property);
};

exports.addToQueue = addToQueue;

const runPropertiesSaver = mp => {
  setTimeout(() => {
    console.debug('Saving properties');
    properties.forEach(property => {
      try {
        saveProperty(mp, property);
      } catch (_unused) {}
    });
    properties = [];
    runPropertiesSaver(mp);
  }, 60 * 1000);
};

exports.runPropertiesSaver = runPropertiesSaver;

const saveProperty = (mp, property) => {
  if (ignoreProperties.includes(property.prop)) return;

  try {
    const fileName = `properties\\${property.formId}.json`;
    const data = mp.readDataFile(fileName);
    const jsonFromFile = data ? JSON.parse(data) : {};
    jsonFromFile[property.prop] = property.value;
    const jsonToSave = JSON.stringify(jsonFromFile);
    mp.writeDataFile(fileName, jsonToSave);
  } catch (_unused2) {}
};

const getAllPropsFromData = mp => {
  const files = mp.readDataDirectory().filter(name => {
    return name.includes('properties\\') && name.includes('.json');
  });
  files.forEach(file => {
    try {
      const props = JSON.parse(mp.readDataFile(file));
      const id = parseInt(file.slice(11, -5), 10);
      Object.entries(props).forEach(([propName, propValue]) => {
        if (ignoreProperties.includes(propName)) return;
        (0, _functions.checkAndCreatePropertyExist)(mp, id, propName);

        try {
          mp.set(id, propName, propValue);
        } catch (e) {
          console.debug(e);
        }
      });
    } catch (_unused3) {}
  });
};

exports.getAllPropsFromData = getAllPropsFromData;
},{"../papyrus/multiplayer/functions":"zNfc"}],"R8LA":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EventEmitter = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class EventEmitter {
  constructor() {
    _defineProperty(this, "events", void 0);

    this.events = {};
  }

  emit(eventName, data) {
    const event = this.events[eventName];

    if (!event) {
      console.error(`Event ${eventName} is not found`);
      return;
    }

    event.forEach(fn => {
      fn.call(null, data);
    });
  }

  subscribe(eventName, fn) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }

    this.events[eventName].push(fn);
    return () => {
      this.events[eventName] = this.events[eventName].filter(eventFn => fn !== eventFn);
    };
  }

}

exports.EventEmitter = EventEmitter;
},{}],"uozv":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.init = exports.WorldSpace = exports.Weapon = exports.Race = exports.Potion = exports.Perk = exports.Outfit = exports.ObjectReference = exports.MagicEffect = exports.M = exports.Location = exports.Keyword = exports.Game = exports.Form = exports.Debug = exports.ConstructibleObject = exports.Cell = exports.Armor = exports.Actor = void 0;

var _ = require("../..");

var _eventEmitter = require("../utils/event-emitter");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const from = (func, obj) => {
  try {
    return mp.callPapyrusFunction('global', 'RHF_Modules', func, null, [obj]);
  } catch (_unused) {
    return null;
  }
};

class BaseClass {
  constructor(obj) {
    _defineProperty(this, "obj", void 0);

    this.obj = obj;
  }

}

class Form extends BaseClass {
  constructor(obj) {
    super(obj);
    if (!_.IForm) throw new Error("the interface 'IForm' is not defined");
  }

  getLvlListObjects() {
    if (!_.IForm.GetLvlListObjects) throw new Error("the method 'GetLvlListObjects' is not implemented");
    return _.IForm.GetLvlListObjects(this.obj);
  }

  getFormID() {
    if (!_.IForm.GetFormID) throw new Error("the method 'GetFormID' is not implemented");
    return _.IForm.GetFormID(this.obj);
  }

  getGoldValue() {
    if (!_.IForm.GetGoldValue) throw new Error("the method 'GetGoldValue' is not implemented");
    return _.IForm.GetGoldValue(this.obj);
  }

  getName() {
    if (!_.IForm.GetName) throw new Error("the method 'GetName' is not implemented");
    return _.IForm.GetName(this.obj);
  }

  getKeywords() {
    if (!_.IForm.GetKeywords) throw new Error("the method 'GetKeywords' is not implemented");

    const objArray = _.IForm.GetKeywords(this.obj);

    return objArray.map(obj => new Keyword(obj));
  }

  getNthKeyword(index) {
    if (!_.IForm.GetNthKeyword) throw new Error("the method 'GetNthKeyword' is not implemented");

    const obj = _.IForm.GetNthKeyword(this.obj, [index]);

    if (!obj) return null;
    return new Keyword(obj);
  }

  getNumKeywords() {
    if (!_.IForm.GetNumKeywords) throw new Error("the method 'GetNumKeywords' is not implemented");
    return _.IForm.GetNumKeywords(this.obj);
  }

  hasKeyword(akKeyword) {
    if (!_.IForm.HasKeyword) throw new Error("the method 'HasKeyword' is not implemented");
    if (!akKeyword) throw new Error('akKeyword is not defined');
    return _.IForm.HasKeyword(this.obj, [akKeyword.obj]);
  }

  getType() {
    if (!_.IForm.GetType) throw new Error("the method 'GetType' is not implemented");
    return _.IForm.GetType(this.obj);
  }

  getWeight() {
    if (!_.IForm.GetWeight) throw new Error("the method 'GetWeight' is not implemented");
    return _.IForm.GetWeight(this.obj);
  }

  getWorldModelNthTextureSet(n) {
    throw new Error("the method 'GetWorldModelNthTextureSet' is not implemented");
  }

  getWorldModelNumTextureSets() {
    throw new Error("the method 'GetWorldModelNumTextureSets' is not implemented");
  }

  getWorldModelPath() {
    throw new Error("the method 'GetWorldModelPath' is not implemented");
  }

  hasWorldModel() {
    throw new Error("the method 'HasWorldModel' is not implemented");
  }

  isPlayable() {
    throw new Error("the method 'IsPlayable' is not implemented");
  }

  playerKnows() {
    throw new Error("the method 'PlayerKnows' is not implemented");
  }

  sendModEvent(eventName, strArg, numArg) {
    throw new Error("the method 'SendModEvent' is not implemented");
  }

  setGoldValue(value) {
    throw new Error("the method 'SetGoldValue' is not implemented");
  }

  setName(name) {
    throw new Error("the method 'SetName' is not implemented");
  }

  setPlayerKnows(knows) {
    throw new Error("the method 'SetPlayerKnows' is not implemented");
  }

  setWeight(weight) {
    throw new Error("the method 'SetWeight' is not implemented");
  }

  setWorldModelNthTextureSet(nSet, n) {
    throw new Error("the method 'SetWorldModelNthTextureSet' is not implemented");
  }

  setWorldModelPath(path) {
    throw new Error("the method 'SetWorldModelPath' is not implemented");
  }

  getEditorId() {
    if (!_.IForm.GetEditorID) throw new Error("the method 'GetEditorID' is not implemented");
    return _.IForm.GetEditorID(this.obj);
  }

  getSignature() {
    if (!_.IForm.GetSignature) throw new Error("the method 'GetSignature' is not implemented");
    return _.IForm.GetSignature(this.obj);
  }

  equalSignature(signature) {
    if (!_.IForm.EqualSignature) throw new Error("the method 'EqualSignature' is not implemented");
    return _.IForm.EqualSignature(this.obj, [signature]);
  }

}

exports.Form = Form;

class ObjectReference extends Form {
  constructor(obj) {
    super(obj);
    if (!_.IObjectReference) throw new Error("the interface 'IObjectReference' is not defined");
  }

  static from(papyrusObject) {
    if (!papyrusObject) return null;
    const obj = from('GetObjectReference', papyrusObject.obj);
    if (!obj) return null;
    return new ObjectReference(obj);
  }

  static get(id) {
    const form = Game.getForm(id);
    if (!form) return null;
    const objectReference = ObjectReference.from(form);
    if (!objectReference) return null;
    return objectReference;
  }

  activate(akActivator, abDefaultProcessingOnly) {
    throw new Error("the method 'Activate' is not implemented");
  }

  addDependentAnimatedObjectReference(akDependent) {
    throw new Error("the method 'AddDependentAnimatedObjectReference' is not implemented");
  }

  addInventoryEventFilter(akFilter) {
    throw new Error("the method 'AddInventoryEventFilter' is not implemented");
  }

  addItem(akItemToAdd, aiCount = 1, abSilent = false) {
    if (!_.IObjectReference.AddItem) throw new Error("the method 'AddItem' is not implemented");
    if (!akItemToAdd) throw new Error('ItemToAdd is not defined');
    return _.IObjectReference.AddItem(this.obj, [akItemToAdd.obj, aiCount, abSilent]);
  }

  addToMap(abAllowFastTravel) {
    throw new Error("the method 'AddToMap' is not implemented");
  }

  applyHavokImpulse(afX, afY, afZ, afMagnitude) {
    throw new Error("the method 'ApplyHavokImpulse' is not implemented");
  }

  blockActivation(abBlocked = true) {
    if (!_.IObjectReference.BlockActivation) throw new Error("the method 'BlockActivation' is not implemented");
    return _.IObjectReference.BlockActivation(this.obj, [abBlocked]);
  }

  calculateEncounterLevel(aiDifficulty) {
    throw new Error("the method 'CalculateEncounterLevel' is not implemented");
  }

  canFastTravelToMarker() {
    throw new Error("the method 'CanFastTravelToMarker' is not implemented");
  }

  clearDestruction() {
    if (!_.IObjectReference.ClearDestruction) throw new Error("the method 'ClearDestruction' is not implemented");
    return _.IObjectReference.ClearDestruction(this.obj);
  }

  createDetectionEvent(akOwner, aiSoundLevel) {
    throw new Error("the method 'CreateDetectionEvent' is not implemented");
  }

  createEnchantment(maxCharge, effects, magnitudes, areas, durations) {
    throw new Error("the method 'CreateEnchantment' is not implemented");
  }

  damageObject(afDamage) {
    if (!_.IObjectReference.DamageObject) throw new Error("the method 'DamageObject' is not implemented");
    return _.IObjectReference.DamageObject(this.obj, [afDamage]);
  }

  delete() {
    throw new Error("the method 'Delete' is not implemented");
  }

  disable(abFadeOut = false) {
    if (!_.IObjectReference.Disable) throw new Error("the method 'Disable' is not implemented");
    return _.IObjectReference.Disable(this.obj, [abFadeOut]);
  }

  disableNoWait(abFadeOut = false) {
    throw new Error("the method 'DisableNoWait' is not implemented");
  }

  dropObject(akObject, aiCount) {
    throw new Error("the method 'DropObject' is not implemented");
  }

  enable(abFadeIn) {
    throw new Error("the method 'Enable' is not implemented");
  }

  enableFastTravel(abEnable) {
    throw new Error("the method 'EnableFastTravel' is not implemented");
  }

  enableNoWait(abFadeIn) {
    throw new Error("the method 'EnableNoWait' is not implemented");
  }

  forceAddRagdollToWorld() {
    throw new Error("the method 'ForceAddRagdollToWorld' is not implemented");
  }

  forceRemoveRagdollFromWorld() {
    throw new Error("the method 'ForceRemoveRagdollFromWorld' is not implemented");
  }

  getActorOwner() {
    throw new Error("the method 'GetActorOwner' is not implemented");
  }

  getAllForms(toFill) {
    throw new Error("the method 'GetAllForms' is not implemented");
  }

  getAngleX() {
    if (!_.IObjectReference.GetAngleX) throw new Error("the method 'GetAngleX' is not implemented");
    return _.IObjectReference.GetAngleX(this.obj);
  }

  getAngleY() {
    if (!_.IObjectReference.GetAngleY) throw new Error("the method 'GetAngleY' is not implemented");
    return _.IObjectReference.GetAngleY(this.obj);
  }

  getAngleZ() {
    if (!_.IObjectReference.GetAngleZ) throw new Error("the method 'GetAngleZ' is not implemented");
    return _.IObjectReference.GetAngleZ(this.obj);
  }

  getAnimationVariableBool(arVariableName) {
    throw new Error("the method 'GetAnimationVariableBool' is not implemented");
  }

  getAnimationVariableFloat(arVariableName) {
    throw new Error("the method 'GetAnimationVariableFloat' is not implemented");
  }

  getAnimationVariableInt(arVariableName) {
    throw new Error("the method 'GetAnimationVariableInt' is not implemented");
  }

  getBaseObject() {
    if (!_.IObjectReference.GetBaseObject) throw new Error("the method 'GetBaseObject' is not implemented");

    const obj = _.IObjectReference.GetBaseObject(this.obj);

    if (!obj) return null;
    return new Form(obj);
  }

  getContainerForms() {
    if (!_.IObjectReference.GetContainerForms) throw new Error("the method 'GetContainerForms' is not implemented");

    const objArray = _.IObjectReference.GetContainerForms(this.obj);

    return objArray.map(obj => new Form(obj));
  }

  getCurrentDestructionStage() {
    if (!_.IObjectReference.GetCurrentDestructionStage) {
      throw new Error("the method 'GetCurrentDestructionStage' is not implemented");
    }

    return _.IObjectReference.GetCurrentDestructionStage(this.obj);
  }

  getCurrentLocation() {
    throw new Error("the method 'GetCurrentLocation' is not implemented");
  }

  getCurrentScene() {
    throw new Error("the method 'GetCurrentScene' is not implemented");
  }

  getDisplayName() {
    if (!_.IObjectReference.GetDisplayName) throw new Error("the method 'GetDisplayName' is not implemented");
    return _.IObjectReference.GetDisplayName(this.obj);
  }

  getEditorLocation() {
    throw new Error("the method 'GetEditorLocation' is not implemented");
  }

  getEnableParent() {
    throw new Error("the method 'GetEnableParent' is not implemented");
  }

  getEnchantment() {
    throw new Error("the method 'GetEnchantment' is not implemented");
  }

  getFactionOwner() {
    throw new Error("the method 'GetFactionOwner' is not implemented");
  }

  getHeadingAngle(akOther) {
    throw new Error("the method 'GetHeadingAngle' is not implemented");
  }

  getHeight() {
    throw new Error("the method 'GetHeight' is not implemented");
  }

  getItemCharge() {
    throw new Error("the method 'GetItemCharge' is not implemented");
  }

  getItemCount(akItem) {
    if (!_.IObjectReference.GetItemCount) throw new Error("the method 'GetItemCount' is not implemented");
    if (!akItem) throw new Error('akItemisnot defined');
    return _.IObjectReference.GetItemCount(this.obj, [akItem.obj]);
  }

  getItemHealthPercent() {
    throw new Error("the method 'GetItemHealthPercent' is not implemented");
  }

  getItemMaxCharge() {
    throw new Error("the method 'GetItemMaxCharge' is not implemented");
  }

  getKey() {
    throw new Error("the method 'GetKey' is not implemented");
  }

  getLength() {
    throw new Error("the method 'GetLength' is not implemented");
  }

  getLinkedRef(apKeyword) {
    throw new Error("the method 'GetLinkedRef' is not implemented");
  }

  getLockLevel() {
    throw new Error("the method 'GetLockLevel' is not implemented");
  }

  getMass() {
    throw new Error("the method 'GetMass' is not implemented");
  }

  getNthForm(index) {
    throw new Error("the method 'GetNthForm' is not implemented");
  }

  getNthLinkedRef(aiLinkedRef) {
    throw new Error("the method 'GetNthLinkedRef' is not implemented");
  }

  getNthReferenceAlias(n) {
    throw new Error("the method 'GetNthReferenceAlias' is not implemented");
  }

  getNumItems() {
    throw new Error("the method 'GetNumItems' is not implemented");
  }

  getNumReferenceAliases() {
    throw new Error("the method 'GetNumReferenceAliases' is not implemented");
  }

  getOpenState() {
    throw new Error("the method 'GetOpenState' is not implemented");
  }

  getParentCell() {
    if (!_.IObjectReference.GetParentCell) throw new Error("the method 'GetParentCell' is not implemented");

    const obj = _.IObjectReference.GetParentCell(this.obj);

    if (!obj) return null;
    return new Cell(obj);
  }

  getPoison() {
    throw new Error("the method 'GetPoison' is not implemented");
  }

  getPositionX() {
    if (!_.IObjectReference.GetPositionX) throw new Error("the method 'GetPositionX' is not implemented");
    return _.IObjectReference.GetPositionX(this.obj);
  }

  getPositionY() {
    if (!_.IObjectReference.GetPositionY) throw new Error("the method 'GetPositionY' is not implemented");
    return _.IObjectReference.GetPositionY(this.obj);
  }

  getPositionZ() {
    if (!_.IObjectReference.GetPositionZ) throw new Error("the method 'GetPositionZ' is not implemented");
    return _.IObjectReference.GetPositionZ(this.obj);
  }

  getReferenceAliases() {
    throw new Error("the method 'GetReferenceAliases' is not implemented");
  }

  getScale() {
    if (!_.IObjectReference.GetScale) throw new Error("the method 'GetScale' is not implemented");
    return _.IObjectReference.GetScale(this.obj);
  }

  getTotalArmorWeight() {
    throw new Error("the method 'GetTotalArmorWeight' is not implemented");
  }

  getTotalItemWeight() {
    throw new Error("the method 'GetTotalItemWeight' is not implemented");
  }

  getTriggerObjectCount() {
    throw new Error("the method 'GetTriggerObjectCount' is not implemented");
  }

  getVoiceType() {
    throw new Error("the method 'GetVoiceType' is not implemented");
  }

  getWidth() {
    throw new Error("the method 'GetWidth' is not implemented");
  }

  getWorldSpace() {
    if (!_.IObjectReference.GetWorldSpace) throw new Error("the method 'GetWorldSpace' is not implemented");

    const obj = _.IObjectReference.GetWorldSpace(this.obj);

    if (!obj) return null;
    return new WorldSpace(obj);
  }

  hasEffectKeyword(akKeyword) {
    throw new Error("the method 'HasEffectKeyword' is not implemented");
  }

  hasNode(asNodeName) {
    throw new Error("the method 'HasNode' is not implemented");
  }

  hasRefType(akRefType) {
    throw new Error("the method 'HasRefType' is not implemented");
  }

  ignoreFriendlyHits(abIgnore) {
    throw new Error("the method 'IgnoreFriendlyHits' is not implemented");
  }

  interruptCast() {
    throw new Error("the method 'InterruptCast' is not implemented");
  }

  is3DLoaded() {
    throw new Error("the method 'Is3DLoaded' is not implemented");
  }

  isActivateChild(akChild) {
    throw new Error("the method 'IsActivateChild' is not implemented");
  }

  isActivationBlocked() {
    throw new Error("the method 'IsActivationBlocked' is not implemented");
  }

  isDeleted() {
    throw new Error("the method 'IsDeleted' is not implemented");
  }

  isDisabled() {
    throw new Error("the method 'IsDisabled' is not implemented");
  }

  isFurnitureInUse(abIgnoreReserved) {
    throw new Error("the method 'IsFurnitureInUse' is not implemented");
  }

  isFurnitureMarkerInUse(aiMarker, abIgnoreReserved) {
    throw new Error("the method 'IsFurnitureMarkerInUse' is not implemented");
  }

  isHarvested() {
    throw new Error("the method 'IsHarvested' is not implemented");
  }

  isIgnoringFriendlyHits() {
    throw new Error("the method 'IsIgnoringFriendlyHits' is not implemented");
  }

  isInDialogueWithPlayer() {
    throw new Error("the method 'IsInDialogueWithPlayer' is not implemented");
  }

  isLockBroken() {
    throw new Error("the method 'IsLockBroken' is not implemented");
  }

  isLocked() {
    throw new Error("the method 'IsLocked' is not implemented");
  }

  isMapMarkerVisible() {
    throw new Error("the method 'IsMapMarkerVisible' is not implemented");
  }

  isOffLimits() {
    throw new Error("the method 'IsOffLimits' is not implemented");
  }

  knockAreaEffect(afMagnitude, afRadius) {
    throw new Error("the method 'KnockAreaEffect' is not implemented");
  }

  lock(abLock, abAsOwner) {
    throw new Error("the method 'Lock' is not implemented");
  }

  moveTo(akTarget, afXOffset = 0, afYOffset = 0, afZOffset = 0, abMatchRotation = true) {
    if (!_.IObjectReference.MoveTo) throw new Error("the method 'MoveTo' is not implemented");
    if (!akTarget) throw new Error('akTarget is not defined');
    return _.IObjectReference.MoveTo(this.obj, [akTarget.obj, afXOffset, afYOffset, afZOffset, abMatchRotation]);
  }

  moveToInteractionLocation(akTarget) {
    throw new Error("the method 'MoveToInteractionLocation' is not implemented");
  }

  moveToMyEditorLocation() {
    throw new Error("the method 'MoveToMyEditorLocation' is not implemented");
  }

  moveToNode(akTarget, asNodeName) {
    throw new Error("the method 'MoveToNode' is not implemented");
  }

  placeActorAtMe(akActorToPlace, aiLevelMod, akZone) {
    throw new Error("the method 'PlaceActorAtMe' is not implemented");
  }

  placeAtMe(akFormToPlace, aiCount = 1, abForcePersist = false, abInitiallyDisabled = false) {
    if (!_.IObjectReference.PlaceAtMe) throw new Error("the method 'PlaceAtMe' is not implemented");
    if (!akFormToPlace) throw new Error('akFormToPlace is not defined');

    const obj = _.IObjectReference.PlaceAtMe(this.obj, [akFormToPlace.obj, aiCount, abForcePersist, abInitiallyDisabled]);

    if (!obj) return null;
    return new ObjectReference(obj);
  }

  playAnimation(asAnimation) {
    throw new Error("the method 'PlayAnimation' is not implemented");
  }

  playAnimationAndWait(asAnimation, asEventName) {
    throw new Error("the method 'PlayAnimationAndWait' is not implemented");
  }

  playGamebryoAnimation(asAnimation, abStartOver, afEaseInTime) {
    throw new Error("the method 'PlayGamebryoAnimation' is not implemented");
  }

  playImpactEffect(akImpactEffect, asNodeName, afPickDirX, afPickDirY, afPickDirZ, afPickLength, abApplyNodeRotation, abUseNodeLocalRotation) {
    throw new Error("the method 'PlayImpactEffect' is not implemented");
  }

  playSyncedAnimationAndWaitSS(asAnimation1, asEvent1, akObj2, asAnimation2, asEvent2) {
    throw new Error("the method 'PlaySyncedAnimationAndWaitSS' is not implemented");
  }

  playSyncedAnimationSS(asAnimation1, akObj2, asAnimation2) {
    throw new Error("the method 'PlaySyncedAnimationSS' is not implemented");
  }

  playTerrainEffect(asEffectModelName, asAttachBoneName) {
    throw new Error("the method 'PlayTerrainEffect' is not implemented");
  }

  processTrapHit(akTrap, afDamage, afPushback, afXVel, afYVel, afZVel, afXPos, afYPos, afZPos, aeMaterial, afStagger) {
    throw new Error("the method 'ProcessTrapHit' is not implemented");
  }

  pushActorAway(akActorToPush, aiKnockbackForce) {
    throw new Error("the method 'PushActorAway' is not implemented");
  }

  removeAllInventoryEventFilters() {
    throw new Error("the method 'RemoveAllInventoryEventFilters' is not implemented");
  }

  removeAllItems(akTransferTo = null, abKeepOwnership = false, abRemoveQuestItems = false) {
    var _akTransferTo$obj;

    if (!_.IObjectReference.RemoveAllItems) throw new Error("the method 'RemoveAllItems' is not implemented");
    return _.IObjectReference.RemoveAllItems(this.obj, [(_akTransferTo$obj = akTransferTo === null || akTransferTo === void 0 ? void 0 : akTransferTo.obj) !== null && _akTransferTo$obj !== void 0 ? _akTransferTo$obj : null]);
  }

  removeDependentAnimatedObjectReference(akDependent) {
    throw new Error("the method 'RemoveDependentAnimatedObjectReference' is not implemented");
  }

  removeInventoryEventFilter(akFilter) {
    throw new Error("the method 'RemoveInventoryEventFilter' is not implemented");
  }

  removeItem(akItemToRemove, aiCount = 1, abSilent = false, akOtherContainer = null) {
    var _akOtherContainer$obj;

    if (!_.IObjectReference.RemoveItem) throw new Error("the method 'RemoveItem' is not implemented");
    if (!akItemToRemove) throw new Error('ItemToAdd is not defined');
    return _.IObjectReference.RemoveItem(this.obj, [akItemToRemove.obj, aiCount, abSilent, (_akOtherContainer$obj = akOtherContainer === null || akOtherContainer === void 0 ? void 0 : akOtherContainer.obj) !== null && _akOtherContainer$obj !== void 0 ? _akOtherContainer$obj : null]);
  }

  reset(akTarget) {
    throw new Error("the method 'Reset' is not implemented");
  }

  resetInventory() {
    throw new Error("the method 'ResetInventory' is not implemented");
  }

  say(akTopicToSay, akActorToSpeakAs, abSpeakInPlayersHead) {
    throw new Error("the method 'Say' is not implemented");
  }

  sendStealAlarm(akThief) {
    throw new Error("the method 'SendStealAlarm' is not implemented");
  }

  setActorCause(akActor) {
    throw new Error("the method 'SetActorCause' is not implemented");
  }

  setActorOwner(akActorBase) {
    throw new Error("the method 'SetActorOwner' is not implemented");
  }

  setAngle(afXAngle, afYAngle, afZAngle) {
    if (!_.IObjectReference.SetAngle) throw new Error("the method 'SetAngle' is not implemented");
    return _.IObjectReference.SetAngle(this.obj, [afXAngle, afYAngle, afZAngle]);
  }

  setAnimationVariableBool(arVariableName, abNewValue) {
    throw new Error("the method 'SetAnimationVariableBool' is not implemented");
  }

  setAnimationVariableFloat(arVariableName, afNewValue) {
    throw new Error("the method 'SetAnimationVariableFloat' is not implemented");
  }

  setAnimationVariableInt(arVariableName, aiNewValue) {
    throw new Error("the method 'SetAnimationVariableInt' is not implemented");
  }

  setDestroyed(abDestroyed) {
    throw new Error("the method 'SetDestroyed' is not implemented");
  }

  setDisplayName(name, force = false) {
    if (!_.IObjectReference.SetDisplayName) throw new Error("the method 'SetDisplayName' is not implemented");
    return _.IObjectReference.SetDisplayName(this.obj, [name, force]);
  }

  setEnchantment(source, maxCharge) {
    throw new Error("the method 'SetEnchantment' is not implemented");
  }

  setFactionOwner(akFaction) {
    throw new Error("the method 'SetFactionOwner' is not implemented");
  }

  setHarvested(harvested) {
    throw new Error("the method 'SetHarvested' is not implemented");
  }

  setItemCharge(charge) {
    throw new Error("the method 'SetItemCharge' is not implemented");
  }

  setItemHealthPercent(health) {
    throw new Error("the method 'SetItemHealthPercent' is not implemented");
  }

  setItemMaxCharge(maxCharge) {
    throw new Error("the method 'SetItemMaxCharge' is not implemented");
  }

  setLockLevel(aiLockLevel) {
    throw new Error("the method 'SetLockLevel' is not implemented");
  }

  setMotionType(aeMotionType, abAllowActivate) {
    throw new Error("the method 'SetMotionType' is not implemented");
  }

  setNoFavorAllowed(abNoFavor) {
    throw new Error("the method 'SetNoFavorAllowed' is not implemented");
  }

  setOpen(abOpen) {
    throw new Error("the method 'SetOpen' is not implemented");
  }

  setPosition(afX, afY, afZ) {
    if (!_.IObjectReference.SetPosition) throw new Error("the method 'SetPosition' is not implemented");
    return _.IObjectReference.SetPosition(this.obj, [afX, afY, afZ]);
  }

  setScale(afScale) {
    if (!_.IObjectReference.SetScale) throw new Error("the method 'SetScale' is not implemented");
    return _.IObjectReference.SetScale(this.obj, [afScale]);
  }

  splineTranslateTo(afX, afY, afZ, afXAngle, afYAngle, afZAngle, afTangentMagnitude, afSpeed, afMaxRotationSpeed) {
    throw new Error("the method 'SplineTranslateTo' is not implemented");
  }

  splineTranslateToRefNode(arTarget, arNodeName, afTangentMagnitude, afSpeed, afMaxRotationSpeed) {
    throw new Error("the method 'SplineTranslateToRefNode' is not implemented");
  }

  stopTranslation() {
    throw new Error("the method 'StopTranslation' is not implemented");
  }

  tetherToHorse(akHorse) {
    throw new Error("the method 'TetherToHorse' is not implemented");
  }

  translateTo(afX, afY, afZ, afXAngle, afYAngle, afZAngle, afSpeed, afMaxRotationSpeed) {
    throw new Error("the method 'TranslateTo' is not implemented");
  }

  waitForAnimationEvent(asEventName) {
    throw new Error("the method 'WaitForAnimationEvent' is not implemented");
  }

  getDistance(akOther) {
    if (!_.IObjectReference.GetDistance) throw new Error("the method 'GetDistance' is not implemented");
    if (!akOther) throw new Error('akOther is not defined');
    return _.IObjectReference.GetDistance(this.obj, [akOther.obj]);
  }

  getStorageValue(key) {
    if (!_.IObjectReference.GetStorageValue) throw new Error("the method 'GetStorageValue' is not implemented");
    return _.IObjectReference.GetStorageValue(this.obj, [key]);
  }

  setStorageValue(key, value) {
    if (!_.IObjectReference.SetStorageValue) throw new Error("the method 'SetStorageValue' is not implemented");
    return _.IObjectReference.SetStorageValue(this.obj, [key, value]);
  }

  getRespawnTime() {
    if (!_.IObjectReference.GetRespawnTime) throw new Error("the method 'GetRespawnTime' is not implemented");
    return _.IObjectReference.GetRespawnTime([this.obj]);
  }

  getLinkedDoorId() {
    if (!_.IObjectReference.GetLinkedDoorId) throw new Error("the method 'GetLinkedDoorId' is not implemented");
    return _.IObjectReference.GetLinkedDoorId(this.obj);
  }

  getLinkedCellId() {
    if (!_.IObjectReference.GetLinkedCellId) throw new Error("the method 'GetLinkedCellId' is not implemented");
    return _.IObjectReference.GetLinkedCellId(this.obj);
  }

}

exports.ObjectReference = ObjectReference;

class Actor extends ObjectReference {
  constructor(obj) {
    super(obj);
    if (!_.IActor) throw new Error("the interface 'IActor' is not defined");
  }

  static from(papyrusObject) {
    if (!papyrusObject) return null;
    const obj = from('GetActor', papyrusObject.obj);
    if (!obj) return null;
    return new Actor(obj);
  }

  static get(id) {
    const form = Game.getForm(id);
    if (!form) return null;
    const actor = Actor.from(form);
    if (!actor) return null;
    return actor;
  }

  addPerk(akPerk) {
    if (!_.IActor.AddPerk) throw new Error("the method 'AddPerk' is not implemented");
    if (!akPerk) throw new Error('akPerk is not defined');
    return _.IActor.AddPerk(this.obj, [akPerk.obj]);
  }

  addShout(akShout) {
    throw new Error("the method 'AddShout' is not implemented");
  }

  addSpell(akSpell, abVerbose) {
    throw new Error("the method 'AddSpell' is not implemented");
  }

  allowBleedoutDialogue(abCanTalk) {
    throw new Error("the method 'AllowBleedoutDialogue' is not implemented");
  }

  allowPCDialogue(abTalk) {
    throw new Error("the method 'AllowPCDialogue' is not implemented");
  }

  attachAshPile(akAshPileBase) {
    throw new Error("the method 'AttachAshPile' is not implemented");
  }

  canFlyHere() {
    throw new Error("the method 'CanFlyHere' is not implemented");
  }

  changeHeadPart(hPart) {
    throw new Error("the method 'ChangeHeadPart' is not implemented");
  }

  clearArrested() {
    throw new Error("the method 'ClearArrested' is not implemented");
  }

  clearExpressionOverride() {
    throw new Error("the method 'ClearExpressionOverride' is not implemented");
  }

  clearExtraArrows() {
    throw new Error("the method 'ClearExtraArrows' is not implemented");
  }

  clearForcedMovement() {
    throw new Error("the method 'ClearForcedMovement' is not implemented");
  }

  clearKeepOffsetFromActor() {
    throw new Error("the method 'ClearKeepOffsetFromActor' is not implemented");
  }

  clearLookAt() {
    throw new Error("the method 'ClearLookAt' is not implemented");
  }

  damageActorValue(asValueName, afDamage) {
    if (!_.IActor.DamageActorValue) throw new Error("the method 'DamageActorValue' is not implemented");
    return _.IActor.DamageActorValue(this.obj, [asValueName, afDamage]);
  }

  dismount() {
    throw new Error("the method 'Dismount' is not implemented");
  }

  dispelAllSpells() {
    throw new Error("the method 'DispelAllSpells' is not implemented");
  }

  dispelSpell(akSpell) {
    throw new Error("the method 'DispelSpell' is not implemented");
  }

  doCombatSpellApply(akSpell, akTarget) {
    throw new Error("the method 'DoCombatSpellApply' is not implemented");
  }

  drawWeapon() {
    throw new Error("the method 'DrawWeapon' is not implemented");
  }

  enableAI(abEnable) {
    throw new Error("the method 'EnableAI' is not implemented");
  }

  endDeferredKill() {
    throw new Error("the method 'EndDeferredKill' is not implemented");
  }

  equipItem(akItem, abPreventRemoval = false, abSilent = false) {
    if (!_.IActor.EquipItem) throw new Error("the method 'EquipItem' is not implemented");
    if (!akItem) throw new Error('akItem is not defined');
    return _.IActor.EquipItem(this.obj, [akItem.obj, abPreventRemoval, abSilent]);
  }

  equipItemById(item, itemId, equipSlot, preventUnequip, equipSound) {
    throw new Error("the method 'EquipItemById' is not implemented");
  }

  equipItemEx(item, equipSlot, preventUnequip, equipSound) {
    throw new Error("the method 'EquipItemEx' is not implemented");
  }

  equipShout(akShout) {
    throw new Error("the method 'EquipShout' is not implemented");
  }

  equipSpell(akSpell, aiSource) {
    throw new Error("the method 'EquipSpell' is not implemented");
  }

  evaluatePackage() {
    throw new Error("the method 'EvaluatePackage' is not implemented");
  }

  forceActorValue(asValueName, afNewValue) {
    throw new Error("the method 'ForceActorValue' is not implemented");
  }

  forceMovementDirection(afXAngle, afYAngle, afZAngle) {
    throw new Error("the method 'ForceMovementDirection' is not implemented");
  }

  forceMovementDirectionRamp(afXAngle, afYAngle, afZAngle, afRampTime) {
    throw new Error("the method 'ForceMovementDirectionRamp' is not implemented");
  }

  forceMovementRotationSpeed(afXMult, afYMult, afZMult) {
    throw new Error("the method 'ForceMovementRotationSpeed' is not implemented");
  }

  forceMovementRotationSpeedRamp(afXMult, afYMult, afZMult, afRampTime) {
    throw new Error("the method 'ForceMovementRotationSpeedRamp' is not implemented");
  }

  forceMovementSpeed(afSpeedMult) {
    throw new Error("the method 'ForceMovementSpeed' is not implemented");
  }

  forceMovementSpeedRamp(afSpeedMult, afRampTime) {
    throw new Error("the method 'ForceMovementSpeedRamp' is not implemented");
  }

  forceTargetAngle(afXAngle, afYAngle, afZAngle) {
    throw new Error("the method 'ForceTargetAngle' is not implemented");
  }

  forceTargetDirection(afXAngle, afYAngle, afZAngle) {
    throw new Error("the method 'ForceTargetDirection' is not implemented");
  }

  forceTargetSpeed(afSpeed) {
    throw new Error("the method 'ForceTargetSpeed' is not implemented");
  }

  getActorValue(asValueName) {
    if (!_.IActor.GetActorValue) throw new Error("the method 'GetActorValue' is not implemented");
    return _.IActor.GetActorValue(this.obj, [asValueName]);
  }

  getActorValueMax(asValueName) {
    throw new Error("the method 'GetActorValueMax' is not implemented");
  }

  getActorValuePercentage(asValueName) {
    if (!_.IActor.GetActorValuePercentage) throw new Error("the method 'GetActorValuePercentage' is not implemented");
    return _.IActor.GetActorValuePercentage(this.obj, [asValueName]);
  }

  getBaseActorValue(asValueName) {
    throw new Error("the method 'GetBaseActorValue' is not implemented");
  }

  getBribeAmount() {
    throw new Error("the method 'GetBribeAmount' is not implemented");
  }

  getCombatState() {
    throw new Error("the method 'GetCombatState' is not implemented");
  }

  getCombatTarget() {
    throw new Error("the method 'GetCombatTarget' is not implemented");
  }

  getCrimeFaction() {
    throw new Error("the method 'GetCrimeFaction' is not implemented");
  }

  getCurrentPackage() {
    throw new Error("the method 'GetCurrentPackage' is not implemented");
  }

  getDialogueTarget() {
    throw new Error("the method 'GetDialogueTarget' is not implemented");
  }

  getEquippedArmorInSlot(aiSlot) {
    throw new Error("the method 'GetEquippedArmorInSlot' is not implemented");
  }

  getEquippedItemId(Location) {
    throw new Error("the method 'GetEquippedItemId' is not implemented");
  }

  getEquippedItemType(aiHand) {
    throw new Error("the method 'GetEquippedItemType' is not implemented");
  }

  getEquippedObject(Location) {
    if (!_.IActor.GetEquippedObject) throw new Error("the method 'GetEquippedObject' is not implemented");

    const obj = _.IActor.GetEquippedObject(this.obj, [Location]);

    if (!obj) return null;
    return new Form(obj);
  }

  getEquippedShield() {
    if (!_.IActor.GetEquippedShield) throw new Error("the method 'GetEquippedShield' is not implemented");

    const obj = _.IActor.GetEquippedShield(this.obj);

    if (!obj) return null;
    return new Armor(obj);
  }

  getEquippedShout() {
    throw new Error("the method 'GetEquippedShout' is not implemented");
  }

  getEquippedSpell(aiSource) {
    throw new Error("the method 'GetEquippedSpell' is not implemented");
  }

  getEquippedWeapon(abLeftHand) {
    if (!_.IActor.GetEquippedWeapon) throw new Error("the method 'GetEquippedWeapon' is not implemented");

    const obj = _.IActor.GetEquippedWeapon(this.obj, [abLeftHand]);

    if (!obj) return null;
    return new Weapon(obj);
  }

  getFactionRank(akFaction) {
    throw new Error("the method 'GetFactionRank' is not implemented");
  }

  getFactionReaction(akOther) {
    throw new Error("the method 'GetFactionReaction' is not implemented");
  }

  getFactions(minRank, maxRank) {
    throw new Error("the method 'GetFactions' is not implemented");
  }

  getFlyingState() {
    throw new Error("the method 'GetFlyingState' is not implemented");
  }

  getForcedLandingMarker() {
    throw new Error("the method 'GetForcedLandingMarker' is not implemented");
  }

  getFurnitureReference() {
    throw new Error("the method 'GetFurnitureReference' is not implemented");
  }

  getGoldAmount() {
    throw new Error("the method 'GetGoldAmount' is not implemented");
  }

  getHighestRelationshipRank() {
    throw new Error("the method 'GetHighestRelationshipRank' is not implemented");
  }

  getKiller() {
    throw new Error("the method 'GetKiller' is not implemented");
  }

  getLevel() {
    throw new Error("the method 'GetLevel' is not implemented");
  }

  getLeveledActorBase() {
    throw new Error("the method 'GetLeveledActorBase' is not implemented");
  }

  getLightLevel() {
    throw new Error("the method 'GetLightLevel' is not implemented");
  }

  getLowestRelationshipRank() {
    throw new Error("the method 'GetLowestRelationshipRank' is not implemented");
  }

  getNoBleedoutRecovery() {
    throw new Error("the method 'GetNoBleedoutRecovery' is not implemented");
  }

  getNthSpell(n) {
    throw new Error("the method 'GetNthSpell' is not implemented");
  }

  getPlayerControls() {
    throw new Error("the method 'GetPlayerControls' is not implemented");
  }

  getRace() {
    if (!_.IActor.GetRace) throw new Error("the method 'GetRace' is not implemented");

    const obj = _.IActor.GetRace(this.obj);

    if (!obj) return null;
    return new Race(obj);
  }

  getRelationshipRank(akOther) {
    throw new Error("the method 'GetRelationshipRank' is not implemented");
  }

  getSitState() {
    throw new Error("the method 'GetSitState' is not implemented");
  }

  getSleepState() {
    throw new Error("the method 'GetSleepState' is not implemented");
  }

  getSpellCount() {
    throw new Error("the method 'GetSpellCount' is not implemented");
  }

  getVoiceRecoveryTime() {
    throw new Error("the method 'GetVoiceRecoveryTime' is not implemented");
  }

  getWarmthRating() {
    throw new Error("the method 'GetWarmthRating' is not implemented");
  }

  getWornForm(slotMask) {
    throw new Error("the method 'GetWornForm' is not implemented");
  }

  getWornItemId(slotMask) {
    throw new Error("the method 'GetWornItemId' is not implemented");
  }

  hasAssociation(akAssociation, akOther) {
    throw new Error("the method 'HasAssociation' is not implemented");
  }

  hasFamilyRelationship(akOther) {
    throw new Error("the method 'HasFamilyRelationship' is not implemented");
  }

  hasLOS(akOther) {
    throw new Error("the method 'HasLOS' is not implemented");
  }

  hasMagicEffect(akEffect) {
    throw new Error("the method 'HasMagicEffect' is not implemented");
  }

  hasMagicEffectWithKeyword(akKeyword) {
    throw new Error("the method 'HasMagicEffectWithKeyword' is not implemented");
  }

  hasParentRelationship(akOther) {
    throw new Error("the method 'HasParentRelationship' is not implemented");
  }

  hasPerk(akPerk) {
    if (!_.IActor.HasPerk) throw new Error("the method 'HasPerk' is not implemented");
    if (!akPerk) throw new Error('akPerk is not defined');
    return _.IActor.HasPerk(this.obj, [akPerk.obj]);
  }

  hasSpell(akForm) {
    throw new Error("the method 'HasSpell' is not implemented");
  }

  isAIEnabled() {
    throw new Error("the method 'IsAIEnabled' is not implemented");
  }

  isAlarmed() {
    throw new Error("the method 'IsAlarmed' is not implemented");
  }

  isAlerted() {
    throw new Error("the method 'IsAlerted' is not implemented");
  }

  isAllowedToFly() {
    throw new Error("the method 'IsAllowedToFly' is not implemented");
  }

  isArrested() {
    throw new Error("the method 'IsArrested' is not implemented");
  }

  isArrestingTarget() {
    throw new Error("the method 'IsArrestingTarget' is not implemented");
  }

  isBeingRidden() {
    throw new Error("the method 'IsBeingRidden' is not implemented");
  }

  isBleedingOut() {
    throw new Error("the method 'IsBleedingOut' is not implemented");
  }

  isBribed() {
    throw new Error("the method 'IsBribed' is not implemented");
  }

  isChild() {
    throw new Error("the method 'IsChild' is not implemented");
  }

  isCommandedActor() {
    throw new Error("the method 'IsCommandedActor' is not implemented");
  }

  isDead() {
    if (!_.IActor.IsDead) throw new Error("the method 'IsDead' is not implemented");
    return _.IActor.IsDead(this.obj);
  }

  isDetectedBy(akOther) {
    throw new Error("the method 'IsDetectedBy' is not implemented");
  }

  isDoingFavor() {
    throw new Error("the method 'IsDoingFavor' is not implemented");
  }

  isEquipped(akItem) {
    if (!_.IActor.IsEquipped) throw new Error("the method 'IsEquipped' is not implemented");
    if (!akItem) throw new Error('akItem is not defined');
    return _.IActor.IsEquipped(this.obj, [akItem.obj]);
  }

  isEssential() {
    throw new Error("the method 'IsEssential' is not implemented");
  }

  isFlying() {
    throw new Error("the method 'IsFlying' is not implemented");
  }

  isGhost() {
    throw new Error("the method 'IsGhost' is not implemented");
  }

  isGuard() {
    throw new Error("the method 'IsGuard' is not implemented");
  }

  isHostileToActor(akActor) {
    throw new Error("the method 'IsHostileToActor' is not implemented");
  }

  isHuman() {
    if (!_.IActor.IsHuman) throw new Error("the method 'IsEquipped' is not implemented");
    return _.IActor.IsHuman(this.obj);
  }

  isInCombat() {
    throw new Error("the method 'IsInCombat' is not implemented");
  }

  isInFaction(akFaction) {
    throw new Error("the method 'IsInFaction' is not implemented");
  }

  isInKillMove() {
    throw new Error("the method 'IsInKillMove' is not implemented");
  }

  isIntimidated() {
    throw new Error("the method 'IsIntimidated' is not implemented");
  }

  isOnMount() {
    throw new Error("the method 'IsOnMount' is not implemented");
  }

  isOverEncumbered() {
    throw new Error("the method 'IsOverEncumbered' is not implemented");
  }

  isPlayerTeammate() {
    throw new Error("the method 'IsPlayerTeammate' is not implemented");
  }

  isPlayersLastRiddenHorse() {
    throw new Error("the method 'IsPlayersLastRiddenHorse' is not implemented");
  }

  isRunning() {
    throw new Error("the method 'IsRunning' is not implemented");
  }

  isSneaking() {
    throw new Error("the method 'IsSneaking' is not implemented");
  }

  isSprinting() {
    throw new Error("the method 'IsSprinting' is not implemented");
  }

  isSwimming() {
    throw new Error("the method 'IsSwimming' is not implemented");
  }

  isTrespassing() {
    throw new Error("the method 'IsTrespassing' is not implemented");
  }

  isUnconscious() {
    throw new Error("the method 'IsUnconscious' is not implemented");
  }

  isWeaponDrawn() {
    if (!_.IActor.IsWeaponDrawn) throw new Error("the method 'IsWeaponDrawn' is not implemented");
    return _.IActor.IsWeaponDrawn(this.obj);
  }

  keepOffsetFromActor(arTarget, afOffsetX, afOffsetY, afOffsetZ, afOffsetAngleX, afOffsetAngleY, afOffsetAngleZ, afCatchUpRadius, afFollowRadius) {
    throw new Error("the method 'KeepOffsetFromActor' is not implemented");
  }

  kill(akKiller) {
    var _akKiller$obj;

    if (!_.IActor.Kill) throw new Error("the method 'Kill' is not implemented");
    return _.IActor.Kill(this.obj, [(_akKiller$obj = akKiller === null || akKiller === void 0 ? void 0 : akKiller.obj) !== null && _akKiller$obj !== void 0 ? _akKiller$obj : null]);
  }

  killSilent(akKiller) {
    throw new Error("the method 'KillSilent' is not implemented");
  }

  modActorValue(asValueName, afAmount) {
    if (!_.IActor.ModActorValue) throw new Error("the method 'ModActorValue' is not implemented");
    return _.IActor.ModActorValue(this.obj, [asValueName, afAmount]);
  }

  modAV(asValueName, afAmount) {
    return this.modActorValue(asValueName, afAmount);
  }

  modFactionRank(akFaction, aiMod) {
    throw new Error("the method 'ModFactionRank' is not implemented");
  }

  moveToPackageLocation() {
    throw new Error("the method 'MoveToPackageLocation' is not implemented");
  }

  openInventory(abForceOpen) {
    throw new Error("the method 'OpenInventory' is not implemented");
  }

  pathToReference(aTarget, afWalkRunPercent) {
    throw new Error("the method 'PathToReference' is not implemented");
  }

  playIdle(akIdle) {
    throw new Error("the method 'PlayIdle' is not implemented");
  }

  playIdleWithTarget(akIdle, akTarget) {
    throw new Error("the method 'PlayIdleWithTarget' is not implemented");
  }

  playSubGraphAnimation(asEventName) {
    throw new Error("the method 'PlaySubGraphAnimation' is not implemented");
  }

  queueNiNodeUpdate() {
    throw new Error("the method 'QueueNiNodeUpdate' is not implemented");
  }

  regenerateHead() {
    throw new Error("the method 'RegenerateHead' is not implemented");
  }

  removeFromAllFactions() {
    throw new Error("the method 'RemoveFromAllFactions' is not implemented");
  }

  removeFromFaction(akFaction) {
    throw new Error("the method 'RemoveFromFaction' is not implemented");
  }

  removePerk(akPerk) {
    if (!_.IActor.RemovePerk) throw new Error("the method 'RemovePerk' is not implemented");
    if (!akPerk) throw new Error('akPerk is not defined');
    return _.IActor.RemovePerk(this.obj, [akPerk.obj]);
  }

  removeShout(akShout) {
    throw new Error("the method 'RemoveShout' is not implemented");
  }

  removeSpell(akSpell) {
    throw new Error("the method 'RemoveSpell' is not implemented");
  }

  replaceHeadPart(oPart, newPart) {
    throw new Error("the method 'ReplaceHeadPart' is not implemented");
  }

  resetAI() {
    throw new Error("the method 'ResetAI' is not implemented");
  }

  resetExpressionOverrides() {
    throw new Error("the method 'ResetExpressionOverrides' is not implemented");
  }

  resetHealthAndLimbs() {
    throw new Error("the method 'ResetHealthAndLimbs' is not implemented");
  }

  restoreActorValue(asValueName, afAmount) {
    if (!_.IActor.RestoreActorValue) throw new Error("the method 'RestoreActorValue' is not implemented");
    return _.IActor.RestoreActorValue(this.obj, [asValueName, afAmount]);
  }

  restoreAV(asValueName, afAmount) {
    return this.restoreActorValue(asValueName, afAmount);
  }

  async resurrect() {
    if (!_.IActor.Resurrect) throw new Error("the method 'Resurrect' is not implemented");
    return _.IActor.Resurrect(this.obj);
  }

  sendAssaultAlarm() {
    throw new Error("the method 'SendAssaultAlarm' is not implemented");
  }

  sendLycanthropyStateChanged(abIsWerewolf) {
    throw new Error("the method 'SendLycanthropyStateChanged' is not implemented");
  }

  sendTrespassAlarm(akCriminal) {
    throw new Error("the method 'SendTrespassAlarm' is not implemented");
  }

  sendVampirismStateChanged(abIsVampire) {
    throw new Error("the method 'SendVampirismStateChanged' is not implemented");
  }

  setActorValue(asValueName, afValue) {
    if (!_.IActor.SetActorValue) throw new Error("the method 'SetActorValue' is not implemented");
    return _.IActor.SetActorValue(this.obj, [asValueName, afValue]);
  }

  setAlert(abAlerted) {
    throw new Error("the method 'SetAlert' is not implemented");
  }

  setAllowFlying(abAllowed) {
    throw new Error("the method 'SetAllowFlying' is not implemented");
  }

  setAllowFlyingEx(abAllowed, abAllowCrash, abAllowSearch) {
    throw new Error("the method 'SetAllowFlyingEx' is not implemented");
  }

  setAlpha(afTargetAlpha, abFade) {
    throw new Error("the method 'SetAlpha' is not implemented");
  }

  setAttackActorOnSight(abAttackOnSight) {
    throw new Error("the method 'SetAttackActorOnSight' is not implemented");
  }

  setBribed(abBribe) {
    throw new Error("the method 'SetBribed' is not implemented");
  }

  setCrimeFaction(akFaction) {
    throw new Error("the method 'SetCrimeFaction' is not implemented");
  }

  setCriticalStage(aiStage) {
    throw new Error("the method 'SetCriticalStage' is not implemented");
  }

  setDoingFavor(abDoingFavor) {
    throw new Error("the method 'SetDoingFavor' is not implemented");
  }

  setDontMove(abDontMove) {
    throw new Error("the method 'SetDontMove' is not implemented");
  }

  setExpressionModifier(index, value) {
    throw new Error("the method 'SetExpressionModifier' is not implemented");
  }

  setExpressionOverride(aiMood, aiStrength) {
    throw new Error("the method 'SetExpressionOverride' is not implemented");
  }

  setExpressionPhoneme(index, value) {
    throw new Error("the method 'SetExpressionPhoneme' is not implemented");
  }

  setEyeTexture(akNewTexture) {
    throw new Error("the method 'SetEyeTexture' is not implemented");
  }

  setFactionRank(akFaction, aiRank) {
    throw new Error("the method 'SetFactionRank' is not implemented");
  }

  setForcedLandingMarker(aMarker) {
    throw new Error("the method 'SetForcedLandingMarker' is not implemented");
  }

  setGhost(abIsGhost) {
    throw new Error("the method 'SetGhost' is not implemented");
  }

  setHeadTracking(abEnable) {
    throw new Error("the method 'SetHeadTracking' is not implemented");
  }

  setIntimidated(abIntimidate) {
    throw new Error("the method 'SetIntimidated' is not implemented");
  }

  setLookAt(akTarget, abPathingLookAt) {
    throw new Error("the method 'SetLookAt' is not implemented");
  }

  setNoBleedoutRecovery(abAllowed) {
    throw new Error("the method 'SetNoBleedoutRecovery' is not implemented");
  }

  setNotShowOnStealthMeter(abNotShow) {
    throw new Error("the method 'SetNotShowOnStealthMeter' is not implemented");
  }

  setOutfit(akOutfit, abSleepOutfit) {
    if (!_.IActor.SetOutfit) throw new Error("the method 'SetOutfit' is not implemented");
    if (!akOutfit) throw new Error('akOutfit is not defined');
    return _.IActor.SetOutfit(this.obj, [akOutfit.obj, abSleepOutfit]);
  }

  setPlayerControls(abControls) {
    throw new Error("the method 'SetPlayerControls' is not implemented");
  }

  setPlayerResistingArrest() {
    throw new Error("the method 'SetPlayerResistingArrest' is not implemented");
  }

  setPlayerTeammate(abTeammate, abCanDoFavor) {
    throw new Error("the method 'SetPlayerTeammate' is not implemented");
  }

  setRace(akRace) {
    if (!_.IActor.SetRace) throw new Error("the method 'SetRace' is not implemented");
    if (!akRace) throw new Error('akRace is not defined');
    return _.IActor.SetRace(this.obj, [akRace.obj]);
  }

  setRelationshipRank(akOther, aiRank) {
    throw new Error("the method 'SetRelationshipRank' is not implemented");
  }

  setRestrained(abRestrained) {
    throw new Error("the method 'SetRestrained' is not implemented");
  }

  setSubGraphFloatVariable(asVariableName, afValue) {
    throw new Error("the method 'SetSubGraphFloatVariable' is not implemented");
  }

  setUnconscious(abUnconscious) {
    throw new Error("the method 'SetUnconscious' is not implemented");
  }

  setVehicle(akVehicle) {
    throw new Error("the method 'SetVehicle' is not implemented");
  }

  setVoiceRecoveryTime(afTime) {
    throw new Error("the method 'SetVoiceRecoveryTime' is not implemented");
  }

  sheatheWeapon() {
    throw new Error("the method 'SheatheWeapon' is not implemented");
  }

  showBarterMenu() {
    throw new Error("the method 'ShowBarterMenu' is not implemented");
  }

  showGiftMenu(abGivingGift, apFilterList, abShowStolenItems, abUseFavorPoints) {
    throw new Error("the method 'ShowGiftMenu' is not implemented");
  }

  startCannibal(akTarget) {
    throw new Error("the method 'StartCannibal' is not implemented");
  }

  startCombat(akTarget) {
    throw new Error("the method 'StartCombat' is not implemented");
  }

  startDeferredKill() {
    throw new Error("the method 'StartDeferredKill' is not implemented");
  }

  startSneaking() {
    throw new Error("the method 'StartSneaking' is not implemented");
  }

  startVampireFeed(akTarget) {
    throw new Error("the method 'StartVampireFeed' is not implemented");
  }

  stopCombat() {
    throw new Error("the method 'StopCombat' is not implemented");
  }

  stopCombatAlarm() {
    throw new Error("the method 'StopCombatAlarm' is not implemented");
  }

  trapSoul(akTarget) {
    throw new Error("the method 'TrapSoul' is not implemented");
  }

  unLockOwnedDoorsInCell() {
    throw new Error("the method 'UnLockOwnedDoorsInCell' is not implemented");
  }

  unequipAll() {
    if (!_.IActor.UnequipAll) throw new Error("the method 'UnequipAll' is not implemented");
    return _.IActor.UnequipAll(this.obj);
  }

  unequipItem(akItem, abPreventEquip = false, abSilent = false) {
    if (!_.IActor.UnequipItem) throw new Error("the method 'UnequipItem' is not implemented");
    if (!akItem) throw new Error('akItem is not defined');
    return _.IActor.UnequipItem(this.obj, [akItem.obj, abPreventEquip, abSilent]);
  }

  unequipItemEx(item, equipSlot, preventEquip) {
    throw new Error("the method 'UnequipItemEx' is not implemented");
  }

  unequipItemSlot(aiSlot) {
    if (!_.IActor.UnequipItemSlot) throw new Error("the method 'UnequipItemSlot' is not implemented");
    return _.IActor.UnequipItemSlot(this.obj, [aiSlot]);
  }

  unequipShout(akShout) {
    throw new Error("the method 'UnequipShout' is not implemented");
  }

  unequipSpell(akSpell, aiSource) {
    throw new Error("the method 'UnequipSpell' is not implemented");
  }

  updateWeight(neckDelta) {
    throw new Error("the method 'UpdateWeight' is not implemented");
  }

  willIntimidateSucceed() {
    throw new Error("the method 'WillIntimidateSucceed' is not implemented");
  }

  wornHasKeyword(akKeyword) {
    throw new Error("the method 'WornHasKeyword' is not implemented");
  }

  setWorldSpace(id) {
    if (!_.IActor.SetWorldOrCell) throw new Error("the method SetWorldOrCell' is not implemented");
    return _.IActor.SetWorldOrCell([this.obj, id]);
  }

  throwOut() {
    if (!_.IActor.ThrowOut) throw new Error("the method 'ThrowOut' is not implemented");
    return _.IActor.ThrowOut(this.obj);
  }

}

exports.Actor = Actor;

class Armor extends Form {
  constructor(obj) {
    super(obj);
    if (!_.IArmor) throw new Error("the interface 'IArmor' is not defined");
  }

  static from(papyrusObject) {
    if (!papyrusObject) return null;
    const obj = from('GetArmor', papyrusObject.obj);
    if (!obj) return null;
    return new Armor(obj);
  }

  static get(id) {
    const form = Game.getForm(id);
    if (!form) return null;
    const armor = Armor.from(form);
    if (!armor) return null;
    return armor;
  }

  addSlotToMask(slotMask) {
    throw new Error("the method 'AddSlotToMask' is not implemented");
  }

  getArmorRating() {
    if (!_.IArmor.GetArmorRating) throw new Error("the method 'GetArmorRating' is not implemented");
    return _.IArmor.GetArmorRating(this.obj);
  }

  getEnchantment() {
    throw new Error("the method 'GetEnchantment' is not implemented");
  }

  getIconPath(bFemalePath) {
    throw new Error("the method 'GetIconPath' is not implemented");
  }

  getMessageIconPath(bFemalePath) {
    throw new Error("the method 'GetMessageIconPath' is not implemented");
  }

  getModelPath(bFemalePath) {
    throw new Error("the method 'GetModelPath' is not implemented");
  }

  getNthArmorAddon(n) {
    throw new Error("the method 'GetNthArmorAddon' is not implemented");
  }

  getNumArmorAddons() {
    throw new Error("the method 'GetNumArmorAddons' is not implemented");
  }

  getSlotMask() {
    throw new Error("the method 'GetSlotMask' is not implemented");
  }

  getWarmthRating() {
    throw new Error("the method 'GetWarmthRating' is not implemented");
  }

  getWeightClass() {
    throw new Error("the method 'GetWeightClass' is not implemented");
  }

  modArmorRating(modBy) {
    throw new Error("the method 'ModArmorRating' is not implemented");
  }

  removeSlotFromMask(slotMask) {
    throw new Error("the method 'RemoveSlotFromMask' is not implemented");
  }

  setArmorRating(armorRating) {
    throw new Error("the method 'SetArmorRating' is not implemented");
  }

  setEnchantment(e) {
    throw new Error("the method 'SetEnchantment' is not implemented");
  }

  setIconPath(path, bFemalePath) {
    throw new Error("the method 'SetIconPath' is not implemented");
  }

  setMessageIconPath(path, bFemalePath) {
    throw new Error("the method 'SetMessageIconPath' is not implemented");
  }

  setModelPath(path, bFemalePath) {
    throw new Error("the method 'SetModelPath' is not implemented");
  }

  setSlotMask(slotMask) {
    throw new Error("the method 'SetSlotMask' is not implemented");
  }

  setWeightClass(weightClass) {
    throw new Error("the method 'SetWeightClass' is not implemented");
  }

}

exports.Armor = Armor;

class Cell extends Form {
  constructor(obj) {
    super(obj);
    if (!_.ICell) throw new Error("the interface 'ICell' is not defined");
  }

  static from(papyrusObject) {
    if (!papyrusObject) return null;
    const obj = from('GetCell', papyrusObject.obj);
    if (!obj) return null;
    return new Cell(obj);
  }

  static get(id) {
    const form = Game.getForm(id);
    if (!form) return null;
    const cell = Cell.from(form);
    if (!cell) return null;
    return cell;
  }

  getActorOwner() {
    throw new Error("the method 'GetActorOwner' is not implemented");
  }

  getFactionOwner() {
    throw new Error("the method 'GetFactionOwner' is not implemented");
  }

  getLocation() {
    if (!_.ICell.GetLocation) throw new Error("the method 'GetLocation' is not implemented");

    const location = _.ICell.GetLocation(this.obj);

    if (!location) return null;
    return new Location(location);
  }

  getNthRef(n, formTypeFilter) {
    throw new Error("the method 'GetNthRef' is not implemented");
  }

  getNumRefs(formTypeFilter) {
    throw new Error("the method 'GetNumRefs' is not implemented");
  }

  getWaterLevel() {
    throw new Error("the method 'GetWaterLevel' is not implemented");
  }

  isAttached() {
    throw new Error("the method 'IsAttached' is not implemented");
  }

  isInterior() {
    if (!_.ICell.IsInterior) throw new Error("the method 'IsInterior' is not implemented");
    return _.ICell.IsInterior(this.obj);
  }

  reset() {
    throw new Error("the method 'Reset' is not implemented");
  }

  setActorOwner(akActor) {
    throw new Error("the method 'SetActorOwner' is not implemented");
  }

  setFactionOwner(akFaction) {
    throw new Error("the method 'SetFactionOwner' is not implemented");
  }

  setFogColor(aiNearRed, aiNearGreen, aiNearBlue, aiFarRed, aiFarGreen, aiFarBlue) {
    throw new Error("the method 'SetFogColor' is not implemented");
  }

  setFogPlanes(afNear, afFar) {
    throw new Error("the method 'SetFogPlanes' is not implemented");
  }

  setFogPower(afPower) {
    throw new Error("the method 'SetFogPower' is not implemented");
  }

  setPublic(abPublic) {
    throw new Error("the method 'SetPublic' is not implemented");
  }

}

exports.Cell = Cell;

class ConstructibleObject extends Form {
  constructor(obj) {
    super(obj);
    if (!_.IConstructibleObject) throw new Error("the interface 'IConstructibleObject' is not defined");
  }

  static from(papyrusObject) {
    if (!papyrusObject) return null;
    const obj = from('GetConstructibleObject', papyrusObject.obj);
    if (!obj) return null;
    return new ConstructibleObject(obj);
  }

  static get(id) {
    const form = Game.getForm(id);
    if (!form) return null;
    const constructibleObject = ConstructibleObject.from(form);
    if (!constructibleObject) return null;
    return constructibleObject;
  }

  getNthIngredient(n) {
    if (!_.IConstructibleObject.GetNthIngredient) throw new Error("the method 'getNthIngredient' is not implemented");

    const obj = _.IConstructibleObject.GetNthIngredient(this.obj, [n]);

    if (!obj) return null;
    return new Form(obj);
  }

  getNthIngredientQuantity(n) {
    if (!_.IConstructibleObject.GetNthIngredientQuantity) {
      throw new Error("the method 'getNthIngredientQuantity' is not implemented");
    }

    return _.IConstructibleObject.GetNthIngredientQuantity(this.obj, [n]);
  }

  getNumIngredients() {
    if (!_.IConstructibleObject.GetNumIngredients) throw new Error("the method 'GetNumIngredients' is not implemented");
    return _.IConstructibleObject.GetNumIngredients(this.obj);
  }

  getResult() {
    if (!_.IConstructibleObject.GetResult) throw new Error("the method 'GetResult' is not implemented");

    const obj = _.IConstructibleObject.GetResult(this.obj);

    if (!obj) return null;
    return new Form(obj);
  }

  getResultQuantity() {
    throw new Error("the method 'GetResultQuantity' is not implemented");
  }

  getWorkbenchKeyword() {
    if (!_.IConstructibleObject.GetWorkbenchKeyword) {
      throw new Error("the method 'getWorkbenchKeyword' is not implemented");
    }

    const obj = _.IConstructibleObject.GetWorkbenchKeyword(this.obj);

    if (!obj) return null;
    return new Keyword(obj);
  }

  setNthIngredient(required, n) {
    throw new Error("the method 'SetNthIngredient' is not implemented");
  }

  setNthIngredientQuantity(value, n) {
    throw new Error("the method 'SetNthIngredientQuantity' is not implemented");
  }

  setResult(result) {
    throw new Error("the method 'SetResult' is not implemented");
  }

  setResultQuantity(quantity) {
    throw new Error("the method 'SetResultQuantity' is not implemented");
  }

  setWorkbenchKeyword(aKeyword) {
    throw new Error("the method 'SetWorkbenchKeyword' is not implemented");
  }

}

exports.ConstructibleObject = ConstructibleObject;

class Location extends Form {
  constructor(obj) {
    super(obj);
    if (!_.ILocation) throw new Error("the interface 'ILocation' is not defined");
  }

  static from(papyrusObject) {
    if (!papyrusObject) return null;
    const obj = from('GetLocation', papyrusObject.obj);
    if (!obj) return null;
    return new Location(obj);
  }

  static get(id) {
    const form = Game.getForm(id);
    if (!form) return null;
    const location = Location.from(form);
    if (!location) return null;
    return location;
  }

  getKeywordData(akKeyword) {
    throw new Error("the method 'GetKeywordData' is not implemented");
  }

  hasCommonParent(akOther, akFilter) {
    throw new Error("the method 'HasCommonParent' is not implemented");
  }

  isCleared() {
    throw new Error("the method 'IsCleared' is not implemented");
  }

  isLoaded() {
    throw new Error("the method 'IsLoaded' is not implemented");
  }

  isSameLocation(akOtherLocation, akKeyword) {
    throw new Error("the method 'IsSameLocation' is not implemented");
  }

  setKeywordData(akKeyword, afData) {
    throw new Error("the method 'SetKeywordData' is not implemented");
  }

  setCleared(abCleared = true) {
    throw new Error("the method 'SetCleared' is not implemented");
  }

  getParent() {
    if (!_.ILocation.GetParent) throw new Error("the method 'GetParent' is not implemented");

    const parent = _.ILocation.GetParent(this.obj);

    if (!parent) return null;
    return new Location(parent);
  }

}

exports.Location = Location;

class Keyword extends Form {
  constructor(obj) {
    super(obj);
    if (!_.IKeyword) throw new Error("the interface 'IKeyword' is not defined");
  }

  static from(papyrusObject) {
    if (!papyrusObject) return null;
    const obj = from('GetKeyword', papyrusObject.obj);
    if (!obj) return null;
    return new Keyword(obj);
  }

  static get(id) {
    const form = Game.getForm(id);
    if (!form) return null;
    const keyword = Keyword.from(form);
    if (!keyword) return null;
    return keyword;
  }

  static getKeyword(key) {
    if (!_.IKeyword.GetKeyword) throw new Error("the method 'GetKeyword' is not implemented");

    const obj = _.IKeyword.GetKeyword([key]);

    if (!obj) return null;
    return new Keyword(obj);
  }

}

exports.Keyword = Keyword;

class MagicEffect extends Form {
  constructor(obj) {
    super(obj);
    if (!_.IMagicEffect) throw new Error("the interface 'IMagicEffect' is not defined");
  }

  static from(papyrusObject) {
    if (!papyrusObject) return null;
    const obj = from('GetMagicEffect', papyrusObject.obj);
    if (!obj) return null;
    return new MagicEffect(obj);
  }

  static get(id) {
    const form = Game.getForm(id);
    if (!form) return null;
    const magicEffect = MagicEffect.from(form);
    if (!magicEffect) return null;
    return magicEffect;
  }

  clearEffectFlag(flag) {
    throw new Error("the method 'ClearEffectFlag' is not implemented");
  }

  getArea() {
    throw new Error("the method 'GetArea' is not implemented");
  }

  getAssociatedSkill() {
    throw new Error("the method 'GetAssociatedSkill' is not implemented");
  }

  getBaseCost() {
    throw new Error("the method 'GetBaseCost' is not implemented");
  }

  getCastTime() {
    throw new Error("the method 'GetCastTime' is not implemented");
  }

  getCastingArt() {
    throw new Error("the method 'GetCastingArt' is not implemented");
  }

  getCastingType() {
    throw new Error("the method 'GetCastingType' is not implemented");
  }

  getDeliveryType() {
    throw new Error("the method 'GetDeliveryType' is not implemented");
  }

  getEnchantArt() {
    throw new Error("the method 'GetEnchantArt' is not implemented");
  }

  getEnchantShader() {
    throw new Error("the method 'GetEnchantShader' is not implemented");
  }

  getEquipAbility() {
    throw new Error("the method 'GetEquipAbility' is not implemented");
  }

  getExplosion() {
    throw new Error("the method 'GetExplosion' is not implemented");
  }

  getHitEffectArt() {
    throw new Error("the method 'GetHitEffectArt' is not implemented");
  }

  getHitShader() {
    throw new Error("the method 'GetHitShader' is not implemented");
  }

  getImageSpaceMod() {
    throw new Error("the method 'GetImageSpaceMod' is not implemented");
  }

  getImpactDataSet() {
    throw new Error("the method 'GetImpactDataSet' is not implemented");
  }

  getLight() {
    throw new Error("the method 'GetLight' is not implemented");
  }

  getPerk() {
    throw new Error("the method 'GetPerk' is not implemented");
  }

  getProjectile() {
    throw new Error("the method 'GetProjectile' is not implemented");
  }

  getResistance() {
    throw new Error("the method 'GetResistance' is not implemented");
  }

  getSkillLevel() {
    throw new Error("the method 'GetSkillLevel' is not implemented");
  }

  getSkillUsageMult() {
    throw new Error("the method 'GetSkillUsageMult' is not implemented");
  }

  getSounds() {
    throw new Error("the method 'GetSounds' is not implemented");
  }

  isEffectFlagSet(flag) {
    throw new Error("the method 'IsEffectFlagSet' is not implemented");
  }

  setArea(area) {
    throw new Error("the method 'SetArea' is not implemented");
  }

  setAssociatedSkill(skill) {
    throw new Error("the method 'SetAssociatedSkill' is not implemented");
  }

  setBaseCost(cost) {
    throw new Error("the method 'SetBaseCost' is not implemented");
  }

  setCastTime(castTime) {
    throw new Error("the method 'SetCastTime' is not implemented");
  }

  setCastingArt(obj) {
    throw new Error("the method 'SetCastingArt' is not implemented");
  }

  setEffectFlag(flag) {
    throw new Error("the method 'SetEffectFlag' is not implemented");
  }

  setEnchantArt(obj) {
    throw new Error("the method 'SetEnchantArt' is not implemented");
  }

  setEnchantShader(obj) {
    throw new Error("the method 'SetEnchantShader' is not implemented");
  }

  setEquipAbility(obj) {
    throw new Error("the method 'SetEquipAbility' is not implemented");
  }

  setExplosion(obj) {
    throw new Error("the method 'SetExplosion' is not implemented");
  }

  setHitEffectArt(obj) {
    throw new Error("the method 'SetHitEffectArt' is not implemented");
  }

  setHitShader(obj) {
    throw new Error("the method 'SetHitShader' is not implemented");
  }

  setImageSpaceMod(obj) {
    throw new Error("the method 'SetImageSpaceMod' is not implemented");
  }

  setImpactDataSet(obj) {
    throw new Error("the method 'SetImpactDataSet' is not implemented");
  }

  setLight(obj) {
    throw new Error("the method 'SetLight' is not implemented");
  }

  setPerk(obj) {
    throw new Error("the method 'SetPerk' is not implemented");
  }

  setProjectile(obj) {
    throw new Error("the method 'SetProjectile' is not implemented");
  }

  setResistance(skill) {
    throw new Error("the method 'SetResistance' is not implemented");
  }

  setSkillLevel(level) {
    throw new Error("the method 'SetSkillLevel' is not implemented");
  }

  setSkillUsageMult(usageMult) {
    throw new Error("the method 'SetSkillUsageMult' is not implemented");
  }

}

exports.MagicEffect = MagicEffect;

class Outfit extends Form {
  constructor(obj) {
    super(obj);
    if (!_.IOutfit) throw new Error("the interface 'IOutfit' is not defined");
  }

  static from(papyrusObject) {
    if (!papyrusObject) return null;
    const obj = from('GetOutfit', papyrusObject.obj);
    if (!obj) return null;
    return new Outfit(obj);
  }

  static get(id) {
    const form = Game.getForm(id);
    if (!form) return null;
    const outfit = Outfit.from(form);
    if (!outfit) return null;
    return outfit;
  }

}

exports.Outfit = Outfit;

class Perk extends Form {
  constructor(obj) {
    super(obj);
    if (!_.IPerk) throw new Error("the interface 'IPerk' is not defined");
  }

  static from(papyrusObject) {
    if (!papyrusObject) return null;
    const obj = from('GetPerk', papyrusObject.obj);
    if (!obj) return null;
    return new Perk(obj);
  }

  static get(id) {
    const form = Game.getForm(id);
    if (!form) return null;
    const perk = Perk.from(form);
    if (!perk) return null;
    return perk;
  }

}

exports.Perk = Perk;

class Potion extends Form {
  constructor(obj) {
    super(obj);
    if (!_.IPotion) throw new Error("the interface 'IPotion' is not defined");
  }

  static from(papyrusObject) {
    if (!papyrusObject) return null;
    const obj = from('GetPotion', papyrusObject.obj);
    if (!obj) return null;
    return new Potion(obj);
  }

  static get(id) {
    const form = Game.getForm(id);
    if (!form) return null;
    const potion = Potion.from(form);
    if (!potion) return null;
    return potion;
  }

  getCostliestEffectIndex() {
    throw new Error("the method 'GetCostliestEffectIndex' is not implemented");
  }

  getEffectAreas() {
    if (!_.IPotion.GetEffectAreas) throw new Error("the method 'GetEffectAreas' is not implemented");
    return _.IPotion.GetEffectAreas(this.obj);
  }

  getEffectDurations() {
    if (!_.IPotion.GetEffectDurations) throw new Error("the method 'GetEffectDurations' is not implemented");
    return _.IPotion.GetEffectDurations(this.obj);
  }

  getEffectMagnitudes() {
    if (!_.IPotion.GetEffectMagnitudes) throw new Error("the method 'GetEffectMagnitudes' is not implemented");
    return _.IPotion.GetEffectMagnitudes(this.obj);
  }

  getMagicEffects() {
    if (!_.IPotion.GetMagicEffects) throw new Error("the method 'GetMagicEffects' is not implemented");

    const objArray = _.IPotion.GetMagicEffects(this.obj);

    return objArray.map(obj => new MagicEffect(obj));
  }

  getNthEffectArea(index) {
    if (!_.IPotion.GetNthEffectArea) throw new Error("the method 'GetNthEffectArea' is not implemented");
    return _.IPotion.GetNthEffectArea(this.obj, [index]);
  }

  getNthEffectDuration(index) {
    if (!_.IPotion.GetNthEffectDuration) throw new Error("the method 'GetNthEffectDuration' is not implemented");
    return _.IPotion.GetNthEffectDuration(this.obj, [index]);
  }

  getNthEffectMagicEffect(index) {
    if (!_.IPotion.GetNthEffectMagicEffect) throw new Error("the method 'GetNthEffectMagicEffect' is not implemented");

    const obj = _.IPotion.GetNthEffectMagicEffect(this.obj, [index]);

    if (!obj) return null;
    return new MagicEffect(obj);
  }

  getNthEffectMagnitude(index) {
    if (!_.IPotion.GetNthEffectMagnitude) throw new Error("the method 'GetNthEffectMagnitude' is not implemented");
    return _.IPotion.GetNthEffectMagnitude(this.obj, [index]);
  }

  getNumEffects() {
    if (!_.IPotion.GetNumEffects) throw new Error("the method 'GetNumEffects' is not implemented");
    return _.IPotion.GetNumEffects(this.obj);
  }

  getUseSound() {
    throw new Error("the method 'GetUseSound' is not implemented");
  }

  isFood() {
    if (!_.IPotion.IsFood) throw new Error("the method 'IsFood' is not implemented");
    return _.IPotion.IsFood(this.obj);
  }

  isHostile() {
    throw new Error("the method 'IsHostile' is not implemented");
  }

  isPoison() {
    if (!_.IPotion.IsPoison) throw new Error("the method 'IsPoison' is not implemented");
    return _.IPotion.IsPoison(this.obj);
  }

  setNthEffectArea(index, value) {
    throw new Error("the method 'SetNthEffectArea' is not implemented");
  }

  setNthEffectDuration(index, value) {
    throw new Error("the method 'SetNthEffectDuration' is not implemented");
  }

  setNthEffectMagnitude(index, value) {
    throw new Error("the method 'SetNthEffectMagnitude' is not implemented");
  }

}

exports.Potion = Potion;

class Race extends Form {
  constructor(obj) {
    super(obj);
    if (!_.IRace) throw new Error("the interface 'IRace' is not defined");
  }

  static from(papyrusObject) {
    if (!papyrusObject) return null;
    const obj = from('GetRace', papyrusObject.obj);
    if (!obj) return null;
    return new Race(obj);
  }

  static get(id) {
    const form = Game.getForm(id);
    if (!form) return null;
    const race = Race.from(form);
    if (!race) return null;
    return race;
  }

}

exports.Race = Race;

class Weapon extends Form {
  constructor(obj) {
    super(obj);
    if (!_.IWeapon) throw new Error("the interface 'IWeapon' is not defined");
  }

  static from(papyrusObject) {
    if (!papyrusObject) return null;
    const obj = from('GetWeapon', papyrusObject.obj);
    if (!obj) return null;
    return new Weapon(obj);
  }

  static get(id) {
    const form = Game.getForm(id);
    if (!form) return null;
    const weapon = Weapon.from(form);
    if (!weapon) return null;
    return weapon;
  }

  fire(akSource, akAmmo) {
    throw new Error("the method 'Fire' is not implemented");
  }

  getBaseDamage() {
    if (!_.IWeapon.GetBaseDamage) throw new Error("the method 'GetBaseDamage' is not implemented");
    return _.IWeapon.GetBaseDamage(this.obj);
  }

  getCritDamage() {
    throw new Error("the method 'GetCritDamage' is not implemented");
  }

  getCritEffect() {
    throw new Error("the method 'GetCritEffect' is not implemented");
  }

  getCritEffectOnDeath() {
    throw new Error("the method 'GetCritEffectOnDeath' is not implemented");
  }

  getCritMultiplier() {
    throw new Error("the method 'GetCritMultiplier' is not implemented");
  }

  getEnchantment() {
    throw new Error("the method 'GetEnchantment' is not implemented");
  }

  getEnchantmentValue() {
    throw new Error("the method 'GetEnchantmentValue' is not implemented");
  }

  getEquipType() {
    throw new Error("the method 'GetEquipType' is not implemented");
  }

  getEquippedModel() {
    throw new Error("the method 'GetEquippedModel' is not implemented");
  }

  getIconPath() {
    throw new Error("the method 'GetIconPath' is not implemented");
  }

  getMaxRange() {
    throw new Error("the method 'GetMaxRange' is not implemented");
  }

  getMessageIconPath() {
    throw new Error("the method 'GetMessageIconPath' is not implemented");
  }

  getMinRange() {
    throw new Error("the method 'GetMinRange' is not implemented");
  }

  getModelPath() {
    throw new Error("the method 'GetModelPath' is not implemented");
  }

  getReach() {
    throw new Error("the method 'GetReach' is not implemented");
  }

  getResist() {
    throw new Error("the method 'GetResist' is not implemented");
  }

  getSkill() {
    throw new Error("the method 'GetSkill' is not implemented");
  }

  getSpeed() {
    throw new Error("the method 'GetSpeed' is not implemented");
  }

  getStagger() {
    throw new Error("the method 'GetStagger' is not implemented");
  }

  getTemplate() {
    throw new Error("the method 'GetTemplate' is not implemented");
  }

  getWeaponType() {
    if (!_.IWeapon.GetWeaponType) throw new Error("the method 'GetWeaponType' is not implemented");
    return _.IWeapon.GetWeaponType(this.obj);
  }

  setBaseDamage(damage) {
    throw new Error("the method 'SetBaseDamage' is not implemented");
  }

  setCritDamage(damage) {
    throw new Error("the method 'SetCritDamage' is not implemented");
  }

  setCritEffect(ce) {
    throw new Error("the method 'SetCritEffect' is not implemented");
  }

  setCritEffectOnDeath(ceod) {
    throw new Error("the method 'SetCritEffectOnDeath' is not implemented");
  }

  setCritMultiplier(crit) {
    throw new Error("the method 'SetCritMultiplier' is not implemented");
  }

  setEnchantment(e) {
    throw new Error("the method 'SetEnchantment' is not implemented");
  }

  setEnchantmentValue(value) {
    throw new Error("the method 'SetEnchantmentValue' is not implemented");
  }

  setEquipType(type) {
    throw new Error("the method 'SetEquipType' is not implemented");
  }

  setEquippedModel(model) {
    throw new Error("the method 'SetEquippedModel' is not implemented");
  }

  setIconPath(path) {
    throw new Error("the method 'SetIconPath' is not implemented");
  }

  setMaxRange(maxRange) {
    throw new Error("the method 'SetMaxRange' is not implemented");
  }

  setMessageIconPath(path) {
    throw new Error("the method 'SetMessageIconPath' is not implemented");
  }

  setMinRange(minRange) {
    throw new Error("the method 'SetMinRange' is not implemented");
  }

  setModelPath(path) {
    throw new Error("the method 'SetModelPath' is not implemented");
  }

  setReach(reach) {
    throw new Error("the method 'SetReach' is not implemented");
  }

  setResist(resist) {
    throw new Error("the method 'SetResist' is not implemented");
  }

  setSkill(skill) {
    throw new Error("the method 'SetSkill' is not implemented");
  }

  setSpeed(speed) {
    throw new Error("the method 'SetSpeed' is not implemented");
  }

  setStagger(stagger) {
    throw new Error("the method 'SetStagger' is not implemented");
  }

  setWeaponType(type) {
    throw new Error("the method 'SetWeaponType' is not implemented");
  }

}

exports.Weapon = Weapon;

class WorldSpace extends Form {
  constructor(obj) {
    super(obj);
    if (!_.IWorldSpace) throw new Error("the interface 'IWorldSpace' is not defined");
  }

  static from(papyrusObject) {
    if (!papyrusObject) return null;
    const obj = from('GetWorldSpace', papyrusObject.obj);
    if (!obj) return null;
    return new WorldSpace(obj);
  }

  static get(id) {
    const form = Game.getForm(id);
    if (!form) return null;
    const worldSpace = WorldSpace.from(form);
    if (!worldSpace) return null;
    return worldSpace;
  }

}

exports.WorldSpace = WorldSpace;

class Debug {
  constructor() {
    if (!_.IDebug) throw new Error("the interface 'IDebug' is not defined");
  }

  static centerOnCell(target, asCellname) {
    if (!_.IDebug.CenterOnCell) throw new Error("the method 'CenterOnCell' is not implemented");
    if (!target) throw new Error('target is not defined');
    return _.IDebug.CenterOnCell([target.obj, asCellname]);
  }

  static centerOnCellAndWait(param1) {
    throw new Error("the method 'CenterOnCellAndWait' is not implemented");
  }

  static closeUserLog(param1) {
    throw new Error("the method 'CloseUserLog' is not implemented");
  }

  static dBSendPlayerPosition() {
    throw new Error("the method 'DBSendPlayerPosition' is not implemented");
  }

  static debugChannelNotify(param1, param2) {
    throw new Error("the method 'DebugChannelNotify' is not implemented");
  }

  static dumpAliasData(param1) {
    throw new Error("the method 'DumpAliasData' is not implemented");
  }

  static getConfigName() {
    throw new Error("the method 'GetConfigName' is not implemented");
  }

  static getPlatformName() {
    throw new Error("the method 'GetPlatformName' is not implemented");
  }

  static getVersionNumber() {
    throw new Error("the method 'GetVersionNumber' is not implemented");
  }

  static messageBox(param1) {
    throw new Error("the method 'MessageBox' is not implemented");
  }

  static notification(target, msg) {
    if (!_.IDebug.Notification) throw new Error("the method 'Notification' is not implemented");
    if (!target) throw new Error('target is not defined');
    return _.IDebug.Notification([target.obj, msg]);
  }

  static openUserLog(param1) {
    throw new Error("the method 'OpenUserLog' is not implemented");
  }

  static playerMoveToAndWait(param1) {
    throw new Error("the method 'PlayerMoveToAndWait' is not implemented");
  }

  static quitGame(target) {
    if (!_.IDebug.QuitGame) throw new Error("the method 'QuitGame' is not implemented");
    if (!target) throw new Error('target is not defined');
    return _.IDebug.QuitGame([target.obj]);
  }

  static sendAnimationEvent(arRef, asEventName) {
    if (!_.IDebug.SendAnimationEvent) throw new Error("the method 'SendAnimationEvent' is not implemented");
    if (!arRef) throw new Error('target is not defined');

    _.IDebug.SendAnimationEvent([arRef.obj, asEventName]);
  }

  static setFootIK(param1) {
    throw new Error("the method 'SetFootIK' is not implemented");
  }

  static setGodMode(param1) {
    throw new Error("the method 'SetGodMode' is not implemented");
  }

  static showRefPosition(arRef) {
    throw new Error("the method 'ShowRefPosition' is not implemented");
  }

  static startScriptProfiling(param1) {
    throw new Error("the method 'StartScriptProfiling' is not implemented");
  }

  static startStackProfiling() {
    throw new Error("the method 'StartStackProfiling' is not implemented");
  }

  static stopScriptProfiling(param1) {
    throw new Error("the method 'StopScriptProfiling' is not implemented");
  }

  static stopStackProfiling() {
    throw new Error("the method 'StopStackProfiling' is not implemented");
  }

  static takeScreenshot(param1) {
    throw new Error("the method 'TakeScreenshot' is not implemented");
  }

  static toggleAI() {
    throw new Error("the method 'ToggleAI' is not implemented");
  }

  static toggleCollisions(target) {
    if (!_.IDebug.ToggleCollisions) throw new Error("the method 'ToogleCollisions' is not implemented");
    if (!target) throw new Error('target is not defined');
    return _.IDebug.ToggleCollisions([target.obj]);
  }

  static toggleMenus() {
    throw new Error("the method 'ToggleMenus' is not implemented");
  }

  static trace(param1, param2) {
    throw new Error("the method 'Trace' is not implemented");
  }

  static traceStack(param1, param2) {
    throw new Error("the method 'TraceStack' is not implemented");
  }

  static traceUser(param1, param2, param3) {
    throw new Error("the method 'TraceUser' is not implemented");
  }

}

exports.Debug = Debug;

class Game {
  constructor() {
    if (!_.IGame) throw new Error("the interface 'IGame' is not defined");
  }

  static addAchievement(aiAchievementID) {
    throw new Error("the method 'AddAchievement' is not implemented");
  }

  static addHavokBallAndSocketConstraint(arRefA, arRefANode, arRefB, arRefBNode, afRefALocalOffsetX, afRefALocalOffsetY, afRefALocalOffsetZ, afRefBLocalOffsetX, afRefBLocalOffsetY, afRefBLocalOffsetZ) {
    throw new Error("the method 'AddHavokBallAndSocketConstraint' is not implemented");
  }

  static addPerkPoints(aiPerkPoints) {
    throw new Error("the method 'AddPerkPoints' is not implemented");
  }

  static advanceSkill(asSkillName, afMagnitude) {
    throw new Error("the method 'AdvanceSkill' is not implemented");
  }

  static calculateFavorCost(aiFavorPrice) {
    throw new Error("the method 'CalculateFavorCost' is not implemented");
  }

  static clearPrison() {
    throw new Error("the method 'ClearPrison' is not implemented");
  }

  static clearTempEffects() {
    throw new Error("the method 'ClearTempEffects' is not implemented");
  }

  static disablePlayerControls(target, abMovement = true, abFighting = true, abCamSwitch = false, abLooking = false, abSneaking = false, abMenu = true, abActivate = true, abJournalTabs = false, aiDisablePOVType = 0) {
    if (!_.IGame.DisablePlayerControls) throw new Error("the method 'DisablePlayerControls' is not implemented");
    if (!target) throw new Error('target is not defined');
    return _.IGame.DisablePlayerControls([target.obj, abMovement, abFighting, abCamSwitch, abLooking, abSneaking, abMenu, abActivate, abJournalTabs, aiDisablePOVType]);
  }

  static enableFastTravel(abEnable) {
    throw new Error("the method 'EnableFastTravel' is not implemented");
  }

  static enablePlayerControls(target, abMovement = true, abFighting = true, abCamSwitch = true, abLooking = true, abSneaking = true, abMenu = true, abActivate = true, abJournalTabs = true, aiDisablePOVType = 0) {
    if (!_.IGame.EnablePlayerControls) throw new Error("the method 'EnablePlayerControls' is not implemented");
    if (!target) throw new Error('target is not defined');
    return _.IGame.EnablePlayerControls([target.obj, abMovement, abFighting, abCamSwitch, abLooking, abSneaking, abMenu, abActivate, abJournalTabs, aiDisablePOVType]);
  }

  static fadeOutGame(abFadingOut, abBlackFade, afSecsBeforeFade, afFadeDuration) {
    throw new Error("the method 'FadeOutGame' is not implemented");
  }

  static fastTravel(akDestination) {
    throw new Error("the method 'FastTravel' is not implemented");
  }

  static findClosestActor(afX, afY, afZ, afRadius) {
    throw new Error("the method 'FindClosestActor' is not implemented");
  }

  static findClosestReferenceOfAnyTypeInList(arBaseObjects, afX, afY, afZ, afRadius) {
    throw new Error("the method 'FindClosestReferenceOfAnyTypeInList' is not implemented");
  }

  static findClosestReferenceOfType(arBaseObject, afX, afY, afZ, afRadius) {
    throw new Error("the method 'FindClosestReferenceOfType' is not implemented");
  }

  static findRandomActor(afX, afY, afZ, afRadius) {
    throw new Error("the method 'FindRandomActor' is not implemented");
  }

  static findRandomReferenceOfAnyTypeInList(arBaseObjects, afX, afY, afZ, afRadius) {
    throw new Error("the method 'FindRandomReferenceOfAnyTypeInList' is not implemented");
  }

  static findRandomReferenceOfType(arBaseObject, afX, afY, afZ, afRadius) {
    throw new Error("the method 'FindRandomReferenceOfType' is not implemented");
  }

  static forceFirstPerson() {
    throw new Error("the method 'forceFirstPerson' is not implemented");
  }

  static forceThirdPerson(target) {
    if (!_.IGame.ForceThirdPerson) throw new Error("the method 'ForceThirdPerson' is not implemented");
    if (!target) throw new Error('target is not defined');
    return _.IGame.ForceThirdPerson([target.obj]);
  }

  static getCameraState() {
    throw new Error("the method 'GetCameraState' is not implemented");
  }

  static getCurrentConsoleRef() {
    throw new Error("the method 'GetCurrentConsoleRef' is not implemented");
  }

  static getCurrentCrosshairRef(target) {
    if (!_.IGame.GetCurrentCrosshairRef) throw new Error("the method 'GetCurrentCrosshairRef' is not implemented");
    if (!target) throw new Error('target is not defined');

    const obj = _.IGame.GetCurrentCrosshairRef([target.obj]);

    if (!obj) return null;
    return new ObjectReference(obj);
  }

  static getDialogueTarget() {
    throw new Error("the method 'GetDialogueTarget' is not implemented");
  }

  static getExperienceForLevel(currentLevel) {
    throw new Error("the method 'GetExperienceForLevel' is not implemented");
  }

  static getForm(aiFormID) {
    if (!_.IGame.GetForm) throw new Error("the method 'GetForm' is not implemented");

    const obj = _.IGame.GetForm([aiFormID]);

    if (!obj) return null;
    return new Form(obj);
  }

  static getFormEx(formId) {
    if (!_.IGame.GetForm) throw new Error("the method 'GetForm' is not implemented");

    const obj = _.IGame.GetForm([formId]);

    if (!obj) return null;
    return new Form(obj);
  }

  static getFormFromFile(aiFormID, asFilename) {
    if (!_.IGame.GetFormFromFile) throw new Error("the method 'GetFormFromFile' is not implemented");

    const obj = _.IGame.GetFormFromFile([aiFormID, asFilename]);

    if (!obj) return null;
    return new Form(obj);
  }

  static getGameSettingFloat(asGameSetting) {
    throw new Error("the method 'GetGameSettingFloat' is not implemented");
  }

  static getGameSettingInt(asGameSetting) {
    throw new Error("the method 'GetGameSettingInt' is not implemented");
  }

  static getGameSettingString(asGameSetting) {
    throw new Error("the method 'GetGameSettingString' is not implemented");
  }

  static getHotkeyBoundObject(hotkey) {
    throw new Error("the method 'GetHotkeyBoundObject' is not implemented");
  }

  static getLightModAuthor(idx) {
    throw new Error("the method 'GetLightModAuthor' is not implemented");
  }

  static getLightModByName(name) {
    throw new Error("the method 'GetLightModByName' is not implemented");
  }

  static getLightModCount() {
    throw new Error("the method 'GetLightModCount' is not implemented");
  }

  static getLightModDependencyCount(idx) {
    throw new Error("the method 'GetLightModDependencyCount' is not implemented");
  }

  static getLightModDescription(idx) {
    throw new Error("the method 'GetLightModDescription' is not implemented");
  }

  static getLightModName(idx) {
    throw new Error("the method 'GetLightModName' is not implemented");
  }

  static getModAuthor(modIndex) {
    throw new Error("the method 'GetModAuthor' is not implemented");
  }

  static getModByName(name) {
    throw new Error("the method 'GetModByName' is not implemented");
  }

  static getModCount() {
    throw new Error("the method 'GetModCount' is not implemented");
  }

  static getModDependencyCount(modIndex) {
    throw new Error("the method 'GetModDependencyCount' is not implemented");
  }

  static getModDescription(modIndex) {
    throw new Error("the method 'GetModDescription' is not implemented");
  }

  static getModName(modIndex) {
    throw new Error("the method 'GetModName' is not implemented");
  }

  static getNthLightModDependency(modIdx, idx) {
    throw new Error("the method 'GetNthLightModDependency' is not implemented");
  }

  static getNthTintMaskColor(n) {
    throw new Error("the method 'GetNthTintMaskColor' is not implemented");
  }

  static getNthTintMaskTexturePath(n) {
    throw new Error("the method 'GetNthTintMaskTexturePath' is not implemented");
  }

  static getNthTintMaskType(n) {
    throw new Error("the method 'GetNthTintMaskType' is not implemented");
  }

  static getNumTintMasks() {
    throw new Error("the method 'GetNumTintMasks' is not implemented");
  }

  static getNumTintsByType(type) {
    throw new Error("the method 'GetNumTintsByType' is not implemented");
  }

  static getPerkPoints() {
    throw new Error("the method 'GetPerkPoints' is not implemented");
  }

  static getPlayerExperience() {
    throw new Error("the method 'GetPlayerExperience' is not implemented");
  }

  static getPlayerGrabbedRef() {
    throw new Error("the method 'GetPlayerGrabbedRef' is not implemented");
  }

  static getPlayerMovementMode() {
    throw new Error("the method 'GetPlayerMovementMode' is not implemented");
  }

  static getPlayersLastRiddenHorse() {
    throw new Error("the method 'GetPlayersLastRiddenHorse' is not implemented");
  }

  static getRealHoursPassed() {
    throw new Error("the method 'GetRealHoursPassed' is not implemented");
  }

  static getSunPositionX() {
    throw new Error("the method 'GetSunPositionX' is not implemented");
  }

  static getSunPositionY() {
    throw new Error("the method 'GetSunPositionY' is not implemented");
  }

  static getSunPositionZ() {
    throw new Error("the method 'GetSunPositionZ' is not implemented");
  }

  static getTintMaskColor(type, index) {
    throw new Error("the method 'GetTintMaskColor' is not implemented");
  }

  static getTintMaskTexturePath(type, index) {
    throw new Error("the method 'GetTintMaskTexturePath' is not implemented");
  }

  static hideTitleSequenceMenu() {
    throw new Error("the method 'HideTitleSequenceMenu' is not implemented");
  }

  static incrementSkill(asSkillName) {
    throw new Error("the method 'IncrementSkill' is not implemented");
  }

  static incrementSkillBy(asSkillName, aiCount) {
    throw new Error("the method 'IncrementSkillBy' is not implemented");
  }

  static incrementStat(asStatName, aiModAmount) {
    throw new Error("the method 'IncrementStat' is not implemented");
  }

  static isActivateControlsEnabled() {
    throw new Error("the method 'IsActivateControlsEnabled' is not implemented");
  }

  static isCamSwitchControlsEnabled() {
    throw new Error("the method 'IsCamSwitchControlsEnabled' is not implemented");
  }

  static isFastTravelControlsEnabled() {
    throw new Error("the method 'IsFastTravelControlsEnabled' is not implemented");
  }

  static isFastTravelEnabled() {
    throw new Error("the method 'IsFastTravelEnabled' is not implemented");
  }

  static isFightingControlsEnabled() {
    throw new Error("the method 'IsFightingControlsEnabled' is not implemented");
  }

  static isJournalControlsEnabled() {
    throw new Error("the method 'IsJournalControlsEnabled' is not implemented");
  }

  static isLookingControlsEnabled() {
    throw new Error("the method 'IsLookingControlsEnabled' is not implemented");
  }

  static isMenuControlsEnabled() {
    throw new Error("the method 'IsMenuControlsEnabled' is not implemented");
  }

  static isMovementControlsEnabled() {
    throw new Error("the method 'IsMovementControlsEnabled' is not implemented");
  }

  static isObjectFavorited(Form) {
    throw new Error("the method 'IsObjectFavorited' is not implemented");
  }

  static isPlayerSungazing() {
    throw new Error("the method 'IsPlayerSungazing' is not implemented");
  }

  static isModuleInstalled(name) {
    throw new Error("the method 'IsModuleInstalled' is not implemented");
  }

  static isSneakingControlsEnabled() {
    throw new Error("the method 'IsSneakingControlsEnabled' is not implemented");
  }

  static isWordUnlocked(akWord) {
    throw new Error("the method 'IsWordUnlocked' is not implemented");
  }

  static loadGame(name) {
    throw new Error("the method 'LoadGame' is not implemented");
  }

  static modPerkPoints(perkPoints) {
    throw new Error("the method 'ModPerkPoints' is not implemented");
  }

  static playBink(asFilename, abInterruptible, abMuteAudio, abMuteMusic, abLetterbox) {
    throw new Error("the method 'PlayBink' is not implemented");
  }

  static precacheCharGen() {
    throw new Error("the method 'PrecacheCharGen' is not implemented");
  }

  static precacheCharGenClear() {
    throw new Error("the method 'PrecacheCharGenClear' is not implemented");
  }

  static queryStat(asStat) {
    throw new Error("the method 'QueryStat' is not implemented");
  }

  static quitToMainMenu() {
    throw new Error("the method 'QuitToMainMenu' is not implemented");
  }

  static removeHavokConstraints(arFirstRef, arFirstRefNodeName, arSecondRef, arSecondRefNodeName) {
    throw new Error("the method 'RemoveHavokConstraints' is not implemented");
  }

  static requestAutosave() {
    throw new Error("the method 'RequestAutosave' is not implemented");
  }

  static requestModel(asModelName) {
    throw new Error("the method 'RequestModel' is not implemented");
  }

  static requestSave() {
    throw new Error("the method 'RequestSave' is not implemented");
  }

  static saveGame(name) {
    throw new Error("the method 'SaveGame' is not implemented");
  }

  static sendWereWolfTransformation() {
    throw new Error("the method 'SendWereWolfTransformation' is not implemented");
  }

  static serveTime() {
    throw new Error("the method 'ServeTime' is not implemented");
  }

  static setAllowFlyingMountLandingRequests(abAllow) {
    throw new Error("the method 'SetAllowFlyingMountLandingRequests' is not implemented");
  }

  static setBeastForm(abEntering) {
    throw new Error("the method 'SetBeastForm' is not implemented");
  }

  static setCameraTarget(arTarget) {
    throw new Error("the method 'SetCameraTarget' is not implemented");
  }

  static setGameSettingBool(setting, value) {
    throw new Error("the method 'SetGameSettingBool' is not implemented");
  }

  static setGameSettingFloat(setting, value) {
    throw new Error("the method 'SetGameSettingFloat' is not implemented");
  }

  static setGameSettingInt(setting, value) {
    throw new Error("the method 'SetGameSettingInt' is not implemented");
  }

  static setGameSettingString(setting, value) {
    throw new Error("the method 'SetGameSettingString' is not implemented");
  }

  static setHudCartMode(abSetCartMode) {
    throw new Error("the method 'SetHudCartMode' is not implemented");
  }

  static setInChargen(abDisableSaving, abDisableWaiting, abShowControlsDisabledMessage) {
    throw new Error("the method 'SetInChargen' is not implemented");
  }

  static setMiscStat(name, value) {
    throw new Error("the method 'SetMiscStat' is not implemented");
  }

  static setNthTintMaskColor(n, color) {
    throw new Error("the method 'SetNthTintMaskColor' is not implemented");
  }

  static setNthTintMaskTexturePath(path, n) {
    throw new Error("the method 'SetNthTintMaskTexturePath' is not implemented");
  }

  static setPerkPoints(perkPoints) {
    throw new Error("the method 'SetPerkPoints' is not implemented");
  }

  static setPlayerAIDriven(abAIDriven) {
    throw new Error("the method 'SetPlayerAIDriven' is not implemented");
  }

  static setPlayerExperience(exp) {
    throw new Error("the method 'SetPlayerExperience' is not implemented");
  }

  static setPlayerLevel(level) {
    throw new Error("the method 'SetPlayerLevel' is not implemented");
  }

  static setPlayerReportCrime(abReportCrime) {
    throw new Error("the method 'SetPlayerReportCrime' is not implemented");
  }

  static setPlayersLastRiddenHorse(horse) {
    throw new Error("the method 'SetPlayersLastRiddenHorse' is not implemented");
  }

  static setSittingRotation(afValue) {
    throw new Error("the method 'SetSittingRotation' is not implemented");
  }

  static setSunGazeImageSpaceModifier(apImod) {
    throw new Error("the method 'SetSunGazeImageSpaceModifier' is not implemented");
  }

  static setTintMaskColor(color, type, index) {
    throw new Error("the method 'SetTintMaskColor' is not implemented");
  }

  static setTintMaskTexturePath(path, type, index) {
    throw new Error("the method 'SetTintMaskTexturePath' is not implemented");
  }

  static showFirstPersonGeometry(abShow) {
    throw new Error("the method 'ShowFirstPersonGeometry' is not implemented");
  }

  static showLimitedRaceMenu() {
    throw new Error("the method 'ShowLimitedRaceMenu' is not implemented");
  }

  static showRaceMenu() {
    throw new Error("the method 'ShowRaceMenu' is not implemented");
  }

  static showTitleSequenceMenu() {
    throw new Error("the method 'ShowTitleSequenceMenu' is not implemented");
  }

  static showTrainingMenu(aTrainer) {
    throw new Error("the method 'ShowTrainingMenu' is not implemented");
  }

  static startTitleSequence(asSequenceName) {
    throw new Error("the method 'StartTitleSequence' is not implemented");
  }

  static teachWord(akWord) {
    throw new Error("the method 'TeachWord' is not implemented");
  }

  static triggerScreenBlood(aiValue) {
    throw new Error("the method 'TriggerScreenBlood' is not implemented");
  }

  static unbindObjectHotkey(hotkey) {
    throw new Error("the method 'UnbindObjectHotkey' is not implemented");
  }

  static unlockWord(akWord) {
    throw new Error("the method 'UnlockWord' is not implemented");
  }

  static updateHairColor() {
    throw new Error("the method 'UpdateHairColor' is not implemented");
  }

  static updateThirdPerson() {
    throw new Error("the method 'UpdateThirdPerson' is not implemented");
  }

  static updateTintMaskColors() {
    throw new Error("the method 'UpdateTintMaskColors' is not implemented");
  }

  static usingGamepad() {
    throw new Error("the method 'UsingGamepad' is not implemented");
  }

  static getPlayer() {
    throw new Error("the method 'GetPlayer' is not implemented");
  }

  static shakeCamera(akSource, afStrength, afDuration) {
    throw new Error("the method 'ShakeCamera' is not implemented");
  }

  static shakeController(afSmallMotorStrength, afBigMotorStreangth, afDuration) {
    throw new Error("the method 'ShakeController' is not implemented");
  }

  static getServerOption() {
    if (!_.IGame.GetServerOptions) throw new Error("the method 'GetServerOptions' is not implemented");
    return _.IGame.GetServerOptions();
  }

  static getServerOptionValue(key) {
    if (!_.IGame.GetServerOptionsValue) throw new Error("the method 'GetServerOptionsValue' is not implemented");
    return _.IGame.GetServerOptionsValue([key]);
  }

}

exports.Game = Game;

class M {
  constructor() {
    if (!_.IM) throw new Error("the interface 'IM' is not defined");
  }

  static getActorsInStreamZone(target) {
    if (!_.IM.GetActorsInStreamZone) throw new Error("the method 'GetActorsInStreamZone' is not implemented");
    if (!target) throw new Error('target is not defined');

    const objArray = _.IM.GetActorsInStreamZone([target.obj]);

    return objArray.map(obj => new Actor(obj));
  }

  static getOnlinePlayers() {
    if (!_.IM.GetOnlinePlayers) throw new Error("the method 'GetOnlinePlayers' is not implemented");

    const objArray = _.IM.GetOnlinePlayers();

    return objArray.map(obj => new Actor(obj));
  }

  static isPlayer(id) {
    if (!_.IM.IsPlayer) throw new Error("the method 'IsPlayer' is not implemented");
    if (!id) throw new Error('id is not defined');
    return _.IM.IsPlayer([id]);
  }

  static browserSetVisible(target, state) {
    if (!_.IM.BrowserSetVisible) throw new Error("the method 'BrowserSetVisible' is not implemented");
    if (!target) throw new Error('target is not defined');
    return _.IM.BrowserSetVisible([target.obj, state]);
  }

  static browserSetFocused(target, state) {
    if (!_.IM.BrowserSetFocused) throw new Error("the method 'BrowserSetFocused' is not implemented");
    if (!target) throw new Error('target is not defined');
    return _.IM.BrowserSetFocused([target.obj, state]);
  }

  static browserSetModal(target, state) {
    if (!_.IM.BrowserSetModal) throw new Error("the method 'BrowserSetModal' is not implemented");
    if (!target) throw new Error('target is not defined');
    return _.IM.BrowserSetModal([target.obj, state]);
  }

  static browserGetVisible(target) {
    if (!_.IM.BrowserGetVisible) throw new Error("the method 'BrowserGetVisible' is not implemented");
    if (!target) throw new Error('target is not defined');
    return _.IM.BrowserGetVisible([target.obj]);
  }

  static browserGetFocused(target) {
    if (!_.IM.BrowserGetFocused) throw new Error("the method 'BrowserGetFocused' is not implemented");
    if (!target) throw new Error('target is not defined');
    return _.IM.BrowserGetFocused([target.obj]);
  }

  static browserGetModal(target) {
    if (!_.IM.BrowserGetModal) throw new Error("the method 'BrowserGetModal' is not implemented");
    if (!target) throw new Error('target is not defined');
    return _.IM.BrowserGetModal([target.obj]);
  }

  static getGlobalStorageValue(key) {
    if (!_.IM.GetGlobalStorageValue) throw new Error("the method 'GetGlobalStorageValue' is not implemented");
    if (!key) throw new Error('key is not defined');
    return _.IM.GetGlobalStorageValue([key]);
  }

  static setGlobalStorageValue(key, value) {
    if (!_.IM.SetGlobalStorageValue) throw new Error("the method 'SetGlobalStorageValue' is not implemented");
    if (!key) throw new Error('key is not defined');
    return _.IM.SetGlobalStorageValue(key, value);
  }

  static sendChatMessage(target, message) {
    if (!_.IM.ExecuteUiCommand) throw new Error("the method 'ExecuteUiCommand' is not implemented");
    if (!target) throw new Error('target is not defined');
    if (!message) throw new Error('message is not defined');
    return _.IM.ExecuteUiCommand([target.obj, 'CHAT_ADD_MESSAGE', null, null, JSON.stringify({
      message
    })]);
  }

  static sendChatCommand(target, command, message) {
    if (!_.IM.ExecuteUiCommand) throw new Error("the method 'ExecuteUiCommand' is not implemented");
    if (!target) throw new Error('target is not defined');
    if (message === undefined || message === null) throw new Error('message is not defined');
    return _.IM.ExecuteUiCommand([target.obj, command, null, null, message]);
  }

}

exports.M = M;

class JSModule {}

const init = mp => {
  const emitter = new _eventEmitter.EventEmitter();
  mp.modules = [];

  mp.addJSModule = module => mp.modules.push(module);

  mp.loadJSModule = modulePath => {
    const moduleName = modulePath.replace('modules\\', '').replace('\\index.js', '');

    try {
      const moduleCode = mp.readDataFile(modulePath);

      if (!moduleCode.includes('mp.addJSModule')) {
        console.error(`error when initialize module ${moduleName}`, 'module doesn`t have "mp.addJSModule"');
        return false;
      }

      eval(mp.readDataFile(modulePath));
      return true;
    } catch (err) {
      console.error(`error when initialize module ${moduleName}`, err);
      return false;
    }
  };

  const regex = /^modules\\.+index\.js$/;
  const modules = mp.readDataDirectory().filter(x => x.trim().match(regex));
  console.log(`find ${modules.length} js modules`);
  setTimeout(() => {
    modules.forEach((modulePath, i) => {
      const success = mp.loadJSModule(modulePath);
      if (!success) return;
      const moduleName = modulePath.replace('modules\\', '').replace('\\index.js', '');
      mp.modules[i].name = moduleName;
    });
  }, 0);
};

exports.init = init;
},{"../..":"QCba","../utils/event-emitter":"R8LA"}],"nXcD":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.register = void 0;

var m = _interopRequireWildcard(require("../modules"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const register = mp => {
  mp.registerPapyrusFunction('global', 'RHF_Modules', 'OnTriggerEnter', (self, args) => onTriggerEnter(mp, args));
  mp.registerPapyrusFunction('global', 'RHF_Modules', 'OnTriggerLeave', (self, args) => onTriggerLeave(mp, args));
};

exports.register = register;

function onTriggerEnter(mp, args) {
  const triggerRef = args[0];
  mp.modules.forEach(module => {
    try {
      if (!module.onTriggerEnter) return;
      module.onTriggerEnter(new m.Actor(triggerRef));
    } catch (err) {
      console.error(`error in module ${module.name} onTriggerEnter`, err);
    }
  });
}

function onTriggerLeave(mp, args) {
  const triggerRef = args[0];
  mp.modules.forEach(module => {
    try {
      if (!module.onTriggerLeave) return;
      module.onTriggerLeave(new m.Actor(triggerRef));
    } catch (err) {
      console.error(`error in module ${module.name} onTriggerLeave`, err);
    }
  });
}
},{"../modules":"uozv"}],"fC7F":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FunctionInfo = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class FunctionInfo {
  constructor(f) {
    _defineProperty(this, "f", void 0);

    this.f = f;
  }

  get body() {
    const funcString = this.f.toString().substring(0, this.f.toString().length - 1);
    return funcString.replace(new RegExp('^.+?{', 'm'), '').trim();
  }

  tryCatch() {
    return `
      try {
        ${this.body}
      } catch(err) {
        ctx.sp.printConsole('[CTX ERROR]', err);
      }`;
  }

  getText(args, log = false) {
    let result = this.tryCatch();

    for (const name in args) {
      const arg = args[name];

      switch (typeof arg) {
        case 'number':
          result = `const ${name} = ${arg};\n${result}`;
          break;

        case 'string':
          result = `const ${name} = '${arg}';\n${result}`;
          break;

        case 'boolean':
          result = `const ${name} = ${arg};\n${result}`;
          break;

        case 'object':
          if (Array.isArray(arg)) {
            if (typeof arg[0] === 'number') {
              result = `const ${name} = [${arg}];\n${result}`;
            } else if (typeof arg[0] === 'string') {
              result = `const ${name} = [${arg.map(x => `"${x}"`)}];\n${result}`;
            }
          }

          break;

        case 'function':
          result = `const ${name} = ${arg.toString()};\n${result}`;
          break;
      }
    }

    if (log) {
      console.log(result);
    }

    return result;
  }

}

exports.FunctionInfo = FunctionInfo;
},{}],"mJTA":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.register = exports.evalClient = void 0;

var _functionInfo = require("../utils/functionInfo");

const intervalDelay = 200;

const execEvalCommand = (mp, current) => {
  const prop = 'eval';
  const prev = mp.get(current.id, prop);
  const n = prev ? prev.n + 1 : 1;
  mp.set(current.id, prop, {
    n,
    f: current.f
  });
};

let evalRunning = false;
const evalCommandList = [];

const shiftEvalCommand = (mp, isVisibleByNeighbors) => {
  const current = evalCommandList.shift();

  if (current) {
    execEvalCommand(mp, current);
    setTimeout(() => {
      shiftEvalCommand(mp, isVisibleByNeighbors);
    }, intervalDelay);
  } else {
    evalRunning = false;
  }
};

const evalClient = (mp, id, f, isVisibleByNeighbors = false, immediately = false) => {
  if (immediately) {
    execEvalCommand(mp, {
      id,
      f
    });
    return;
  }

  evalCommandList.push({
    id,
    f
  });
  if (evalRunning) return;
  const current = evalCommandList.shift();

  if (current) {
    execEvalCommand(mp, current);
    setTimeout(() => {
      shiftEvalCommand(mp, isVisibleByNeighbors);
    }, intervalDelay);
    evalRunning = true;
  }
};

exports.evalClient = evalClient;

const evalUpdate = ctx => {
  if (!ctx.value || ctx.state.neval === ctx.value.n) return;
  ctx.state.neval = ctx.value.n;
  eval(ctx.value.f);
};

const register = mp => {
  mp.makeProperty('eval', {
    isVisibleByOwner: true,
    isVisibleByNeighbors: false,
    updateOwner: new _functionInfo.FunctionInfo(evalUpdate).tryCatch(),
    updateNeighbor: ''
  });
  mp.makeProperty('evalAll', {
    isVisibleByOwner: true,
    isVisibleByNeighbors: true,
    updateOwner: new _functionInfo.FunctionInfo(evalUpdate).tryCatch(),
    updateNeighbor: new _functionInfo.FunctionInfo(evalUpdate).tryCatch()
  });
  mp.makeProperty('evalOther', {
    isVisibleByOwner: false,
    isVisibleByNeighbors: true,
    updateOwner: '',
    updateNeighbor: new _functionInfo.FunctionInfo(evalUpdate).tryCatch()
  });
};

exports.register = register;
},{"../utils/functionInfo":"fC7F"}],"oZY1":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getStringArray = exports.getString = exports.getObjectArray = exports.getObject = exports.getNumberArray = exports.getNumber = exports.getBooleanArray = exports.getBoolean = void 0;

const err = (index, x, expectedTypeName) => {
  throw new TypeError(`The argument with index ${index} has value (${JSON.stringify(x)}) that doesn't meet the requirements of ${expectedTypeName}`);
};

const getArray = (args, index, type) => {
  const x = args[index];

  if (x === null || x === undefined) {
    return [];
  }

  return Array.isArray(x) && !x.filter(v => typeof v !== type).length ? x : err(index, x, `${type}[]`);
};

const getObject = (args, index) => {
  const x = args[index];
  return x && typeof x === 'object' && !Array.isArray(x) ? x : err(index, x, 'PapyrusObject');
};

exports.getObject = getObject;

const getObjectArray = (args, index) => {
  return getArray(args, index, 'object');
};

exports.getObjectArray = getObjectArray;

const getString = (args, index) => {
  const x = args[index];
  return typeof x === 'string' ? x : err(index, x, 'string');
};

exports.getString = getString;

const getStringArray = (args, index) => {
  return getArray(args, index, 'string');
};

exports.getStringArray = getStringArray;

const getNumber = (args, index) => {
  const x = args[index];
  return typeof x === 'number' ? x : err(index, x, 'number');
};

exports.getNumber = getNumber;

const getNumberArray = (args, index) => {
  return getArray(args, index, 'number');
};

exports.getNumberArray = getNumberArray;

const getBoolean = (args, index) => {
  const x = args[index];
  return typeof x === 'boolean' ? x : err(index, x, 'boolean');
};

exports.getBoolean = getBoolean;

const getBooleanArray = (args, index) => {
  return getArray(args, index, 'boolean');
};

exports.getBooleanArray = getBooleanArray;
},{}],"WCBi":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.register = exports.getFormFromFileEx = exports.getFormFromFile = exports.getForm = void 0;

var _ = require("../../..");

var _eval = require("../../properties/eval");

var _functionInfo = require("../../utils/functionInfo");

var _papyrusArgs = require("../../utils/papyrusArgs");

const getForm = (mp, self, args) => {
  const formId = (0, _papyrusArgs.getNumber)(args, 0);

  try {
    var _espm$record, _espm$record2;

    if (formId >= 0xff000000) {
      mp.get(formId, 'type');
      return {
        desc: mp.getDescFromId(formId),
        type: 'form'
      };
    }

    const espm = mp.lookupEspmRecordById(formId);

    if (!((_espm$record = espm.record) !== null && _espm$record !== void 0 && _espm$record.type)) {
      console.log(`ESPM Record by id ${formId.toString(16)} not found`);
      return;
    }

    const obj = {
      desc: mp.getDescFromId(formId),
      type: ['REFR', 'ACHR'].includes((_espm$record2 = espm.record) === null || _espm$record2 === void 0 ? void 0 : _espm$record2.type) ? 'form' : 'espm'
    };
    return obj;
  } catch (err) {
    const regex = /Form with id.+doesn't exist/gm;

    if (regex.exec(err) !== null) {
      console.log(err);
      return;
    }

    console.log(err);
    throw err;
  }
};

exports.getForm = getForm;

const getDesc = (mp, formId, fileName) => {
  const mods = mp.getEspmLoadOrder();
  const index = mods.findIndex(mod => mod.toLowerCase() === fileName.toLowerCase());
  if (index === -1) return null;
  const desc = `${formId.toString(16)}:${mods[index]}`;
  return desc;
};

const getFormFromFile = (mp, self, args) => {
  const formId = (0, _papyrusArgs.getNumber)(args, 0);
  const fileName = (0, _papyrusArgs.getString)(args, 1);
  const desc = getDesc(mp, formId, fileName);
  if (!desc) return;

  try {
    return getForm(mp, null, [mp.getIdFromDesc(desc)]);
  } catch (error) {
    console.log(error);
  }
};

exports.getFormFromFile = getFormFromFile;

const getFormFromFileEx = (mp, self, args) => {
  const formId = (0, _papyrusArgs.getNumber)(args, 0);
  const fileName = (0, _papyrusArgs.getString)(args, 1);
  const desc = getDesc(mp, formId, fileName);
  if (!desc) return;

  try {
    return mp.getIdFromDesc(desc);
  } catch (error) {
    console.error(error);
  }
};

exports.getFormFromFileEx = getFormFromFileEx;

const forceThirdPerson = (mp, self, args) => {
  const ac = (0, _papyrusArgs.getObject)(args, 0);
  const acId = mp.getIdFromDesc(ac.desc);

  const func = ctx => {
    ctx.sp.once('update', () => {
      ctx.sp.Game.forceThirdPerson();
    });
  };

  (0, _eval.evalClient)(mp, acId, new _functionInfo.FunctionInfo(func).getText({}));
};

const disablePlayerControls = (mp, self, args) => {
  const ac = (0, _papyrusArgs.getObject)(args, 0);
  const acId = mp.getIdFromDesc(ac.desc);

  const func = ctx => {
    ctx.sp.once('update', () => {
      ctx.sp.Game.disablePlayerControls(false, false, false, true, false, false, false, false, 0);
    });
  };

  (0, _eval.evalClient)(mp, acId, new _functionInfo.FunctionInfo(func).getText({}));
};

const enablePlayerControls = (mp, self, args) => {
  const ac = (0, _papyrusArgs.getObject)(args, 0);
  const acId = mp.getIdFromDesc(ac.desc);

  const func = ctx => {
    ctx.sp.once('update', () => {
      ctx.sp.Game.enablePlayerControls(true, true, true, true, true, true, true, true, 0);
    });
  };

  (0, _eval.evalClient)(mp, acId, new _functionInfo.FunctionInfo(func).getText({}));
};

const getCurrentCrosshairRef = (mp, selfNull, args) => {
  const self = (0, _papyrusArgs.getObject)(args, 0);
  const selfId = mp.getIdFromDesc(self.desc);
  const refId = mp.get(selfId, 'CurrentCrosshairRef');
  if (!refId) return undefined;
  return getForm(mp, null, [refId]);
};

const register = (mp, serverOptionProvider) => {
  mp.registerPapyrusFunction('global', 'Game', 'GetForm', (self, args) => getForm(mp, self, args));
  mp.registerPapyrusFunction('global', 'Game', 'GetFormEx', (self, args) => getForm(mp, self, args));
  mp.registerPapyrusFunction('global', 'Game', 'GetFormFromFile', (self, args) => getFormFromFile(mp, self, args));
  mp.registerPapyrusFunction('global', 'GameEx', 'GetFormFromFile', (self, args) => getFormFromFileEx(mp, self, args));
  mp.registerPapyrusFunction('global', 'GameEx', 'ForceThirdPerson', (self, args) => forceThirdPerson(mp, self, args));
  mp.registerPapyrusFunction('global', 'GameEx', 'DisablePlayerControls', (self, args) => disablePlayerControls(mp, self, args));
  mp.registerPapyrusFunction('global', 'GameEx', 'EnablePlayerControls', (self, args) => enablePlayerControls(mp, self, args));
  mp.registerPapyrusFunction('global', 'GameEx', 'GetCurrentCrosshairRef', (self, args) => getCurrentCrosshairRef(mp, self, args));
  mp.registerPapyrusFunction('global', 'GameEx', 'GetServerOptionsString', (self, args) => serverOptionProvider.getServerOptionsValue(args));
  mp.registerPapyrusFunction('global', 'GameEx', 'GetServerOptionsStringArray', (self, args) => serverOptionProvider.getServerOptionsValue(args));
  mp.registerPapyrusFunction('global', 'GameEx', 'GetServerOptionsInt', (self, args) => serverOptionProvider.getServerOptionsValue(args));
  mp.registerPapyrusFunction('global', 'GameEx', 'GetServerOptionsIntArray', (self, args) => serverOptionProvider.getServerOptionsValue(args));
  mp.registerPapyrusFunction('global', 'GameEx', 'GetServerOptionsFloat', (self, args) => serverOptionProvider.getServerOptionsValue(args));
  mp.registerPapyrusFunction('global', 'GameEx', 'GetServerOptionsFloatArray', (self, args) => serverOptionProvider.getServerOptionsValue(args));
  mp.registerPapyrusFunction('global', 'GameEx', 'GetServerOptionsBool', (self, args) => serverOptionProvider.getServerOptionsValue(args));

  _.IGame.GetForm = args => getForm(mp, null, args);

  _.IGame.GetFormFromFile = args => getFormFromFile(mp, null, args);

  _.IGame.ForceThirdPerson = args => forceThirdPerson(mp, null, args);

  _.IGame.DisablePlayerControls = args => disablePlayerControls(mp, null, args);

  _.IGame.EnablePlayerControls = args => enablePlayerControls(mp, null, args);

  _.IGame.GetCurrentCrosshairRef = args => getCurrentCrosshairRef(mp, null, args);

  _.IGame.GetServerOptions = () => serverOptionProvider.getServerOptions();

  _.IGame.GetServerOptionsValue = args => serverOptionProvider.getServerOptionsValue(args);
};

exports.register = register;
},{"../../..":"QCba","../../properties/eval":"mJTA","../../utils/functionInfo":"fC7F","../../utils/papyrusArgs":"oZY1"}],"WNwQ":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateAttributeSimple = exports.updateAttributeCommon = void 0;

var _functionInfo = require("../../../utils/functionInfo");

const updateAttributeCommon = (attrParam, isOwner = false) => {
  return new _functionInfo.FunctionInfo((ctx, attrParam, isOwner) => {
    const rateAV = attr => attr === 'health' ? 'av_healrate' : `av_${attr}rate`;

    const multAV = attr => attr === 'health' ? 'av_healratemult' : `av_${attr}ratemult`;

    const drainAV = attr => `av_mp_${attr}drain`;

    const av = attrParam;
    if (!ctx.refr || !ctx.get) return;
    const ac = ctx.sp.Actor.from(ctx.refr);
    if (!ac) return;
    if (!ctx.value) return;
    const base = ctx.value.base || 0;
    const perm = ctx.value.permanent || 0;
    const temp = ctx.value.temporary || 0;
    const targetMax = base + perm + temp;
    const numChangesKey = `${av}NumChanges`;
    const numChanges = ctx.get(numChangesKey);

    if (ctx.state[numChangesKey] !== numChanges) {
      ctx.state[numChangesKey] = numChanges;
      ctx.state[`${av}RegenStart`] = +Date.now();
    }

    const realTargetDmg = ctx.value.damage || 0;
    let targetDmg = realTargetDmg;

    if (av === 'health' || ac.getFormID() === 0x14) {
      const multName = multAV(av);
      const rateName = rateAV(av);
      const drainName = drainAV(av);
      const additionalRegenMult = 1.0;
      const regenDuration = (+Date.now() - (ctx.state[`${av}RegenStart`] || 0)) / 1000;
      const healRateMult = ctx.get(multName);
      const healRateMultCurrent = ((healRateMult === null || healRateMult === void 0 ? void 0 : healRateMult.base) || 0) + ((healRateMult === null || healRateMult === void 0 ? void 0 : healRateMult.permanent) || 0) + ((healRateMult === null || healRateMult === void 0 ? void 0 : healRateMult.temporary) || 0) + ((healRateMult === null || healRateMult === void 0 ? void 0 : healRateMult.damage) || 0);
      const healRate = ctx.get(rateName);
      const healRateCurrent = ((healRate === null || healRate === void 0 ? void 0 : healRate.base) || 0) + ((healRate === null || healRate === void 0 ? void 0 : healRate.permanent) || 0) + ((healRate === null || healRate === void 0 ? void 0 : healRate.temporary) || 0) + ((healRate === null || healRate === void 0 ? void 0 : healRate.damage) || 0);
      const drain = ctx.get(drainName);
      const drainCurrent = ((drain === null || drain === void 0 ? void 0 : drain.base) || 0) + ((drain === null || drain === void 0 ? void 0 : drain.permanent) || 0) + ((drain === null || drain === void 0 ? void 0 : drain.temporary) || 0) + ((drain === null || drain === void 0 ? void 0 : drain.damage) || 0);

      if (drainCurrent) {
        targetDmg += regenDuration * drainCurrent;
      } else {
        targetDmg += regenDuration * additionalRegenMult * healRateCurrent * healRateMultCurrent * 0.01 * targetMax * 0.01;
      }

      if (targetDmg > 0) {
        targetDmg = 0;
      }
    }

    const currentPercentage = ac.getActorValuePercentage(av);
    const currentMax = ac.getBaseActorValue(av);
    let targetPercentage = (targetMax + targetDmg) / targetMax;

    if (ctx.get('isDead') && av === 'health') {
      targetPercentage = 0;
    }

    const deltaPercentage = targetPercentage - currentPercentage;
    let k = !targetPercentage || av === 'magicka' ? 1 : 0.25;

    if (av === 'stamina') {
      k = 0.0003;
    }

    if (deltaPercentage > 0) {
      ac.restoreActorValue(av, currentMax * deltaPercentage * k);
    } else if (deltaPercentage < 0) {
      ac.damageActorValue(av, deltaPercentage * currentMax * k);
    }

    if (isOwner) {
      ac.setActorValue(av, base);
    } else if (av === 'health') {
      ac.setActorValue(av, base * 100);
    }
  }).getText({
    attrParam,
    isOwner
  });
};

exports.updateAttributeCommon = updateAttributeCommon;

const updateAttributeSimple = attrParam => {
  return new _functionInfo.FunctionInfo((ctx, attrParam) => {
    const av = attrParam;
    if (!ctx.refr || !ctx.get) return;
    const ac = ctx.sp.Actor.from(ctx.refr);
    if (!ac) return;
    if (!ctx.value) return;
    if (JSON.stringify(ctx.value) === JSON.stringify(ctx.state.lastAttributeSkillValues)) return;
    ctx.state[`last${av}Value`] = ctx.value;
    const base = ctx.value.base || 0;
    const perm = ctx.value.permanent || 0;
    const temp = ctx.value.temporary || 0;
    const targetMax = base + perm + temp;
    const targetDmg = ctx.value.damage || 0;
    const currentPercentage = ac.getActorValuePercentage(av);
    const currentMax = ac.getBaseActorValue(av);
    const targetPercentage = (targetMax + targetDmg) / targetMax;
    const deltaPercentage = targetPercentage - currentPercentage;

    if (deltaPercentage > 0) {
      ac.restoreActorValue(av, deltaPercentage * currentMax);
    } else if (deltaPercentage < 0) {
      ac.damageActorValue(av, deltaPercentage * currentMax);
    }

    ac.setActorValue(av, base);
  }).getText({
    attrParam
  });
};

exports.updateAttributeSimple = updateAttributeSimple;
},{"../../../utils/functionInfo":"fC7F"}],"Klzq":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.register = exports.actorValues = void 0;

var _functions = require("../../../papyrus/multiplayer/functions");

var _attributesFunc = require("./attributes-func");

const avs = ['healrate', 'healratemult', 'staminarate', 'staminaratemult', 'magickarate', 'magickaratemult', 'mp_healthdrain', 'mp_magickadrain', 'mp_staminadrain'];
const relatedPropNames = ['healthNumChanges', 'magickaNumChanges', 'staminaNumChanges'];

const getAvMaximum = (avOps, formId, avName) => {
  let sum = 0;
  ['base', 'permanent', 'temporary'].forEach(modifierName => {
    sum += avOps.get(formId, avName, modifierName);
  });
  return sum;
};

const getAvCurrent = (avOps, formId, avName) => {
  let res = getAvMaximum(avOps, formId, avName);
  res += avOps.get(formId, avName, 'damage');
  return res;
};

const regen = (avOps, avNameTarget, avNameRate, avNameRateMult, avNameDrain) => {
  return {
    parent: avOps,

    set(formId, avName, modifierName, newValue) {
      var _this$parent;

      let dangerousAvNames = [avNameTarget, avNameRate, avNameRateMult, avNameDrain];
      dangerousAvNames = dangerousAvNames.map(x => x.toLowerCase());

      if (dangerousAvNames.indexOf(avName.toLowerCase()) !== -1 && this.applyRegenerationToParent) {
        this.applyRegenerationToParent(formId);
      }

      (_this$parent = this.parent) === null || _this$parent === void 0 ? void 0 : _this$parent.set(formId, avName, modifierName, newValue);
    },

    get(formId, avName, modifierName) {
      if (!this.parent || !this.getSecondsMatched) {
        return 0;
      }

      const drain = getAvCurrent(this.parent, formId, avNameDrain);
      const realValue = this.parent.get(formId, avName, modifierName);

      if (avName.toLowerCase() === avNameTarget.toLowerCase()) {
        if (modifierName === 'damage') {
          const avMax = getAvMaximum(this.parent, formId, avName);
          const regenDuration = timeSource.getSecondsPassed() - this.getSecondsMatched(formId);
          const rate = getAvCurrent(this.parent, formId, avNameRate);
          const rateMult = getAvCurrent(this.parent, formId, avNameRateMult);
          let damageMod = realValue;

          if (drain) {
            damageMod += regenDuration * drain;
          } else {
            damageMod += regenDuration * rate * rateMult * 0.01 * avMax * 0.01;
          }

          return Math.min(0, damageMod);
        }
      }

      return realValue;
    },

    getSecondsMatched(formId) {
      return this.secondsMatched && this.secondsMatched[formId] || 0;
    },

    setSecondsMatched(formId, secondsMatched) {
      if (!this.secondsMatched) {
        this.secondsMatched = {};
      }

      this.secondsMatched[formId] = secondsMatched;
    },

    applyRegenerationToParent(formId) {
      if (!this.parent || !this.setSecondsMatched) {
        return 0;
      }

      const damageAfterRegen = this.get(formId, avNameTarget, 'damage');
      this.parent.set(formId, avNameTarget, 'damage', damageAfterRegen);
      this.setSecondsMatched(formId, timeSource.getSecondsPassed());
    }

  };
};

const timeSource = {
  startMoment: Date.now(),

  getSecondsPassed() {
    if (!this.startMoment) {
      this.startMoment = Date.now();
    }

    return (+Date.now() - +this.startMoment) / 1000.0;
  }

};
let actorValues;
exports.actorValues = actorValues;

const register = mp => {
  ['health', 'magicka', 'stamina'].forEach(attr => {
    mp.makeProperty(`av_${attr}`, {
      isVisibleByOwner: true,
      isVisibleByNeighbors: attr === 'health',
      updateNeighbor: (0, _attributesFunc.updateAttributeCommon)(attr, false),
      updateOwner: (0, _attributesFunc.updateAttributeCommon)(attr, true)
    });
  });
  ['oneHanded', 'twoHanded', 'marksman', 'block', 'smithing', 'heavyArmor', 'lightArmor', 'pickpocket', 'lockpicking', 'sneak', 'alchemy', 'speechcraft', 'alteration', 'conjuration', 'destruction', 'illusion', 'restoration', 'enchanting'].forEach(attr => {
    mp.makeProperty(`av_${attr}`, {
      isVisibleByOwner: true,
      isVisibleByNeighbors: false,
      updateNeighbor: (0, _attributesFunc.updateAttributeSimple)(attr),
      updateOwner: (0, _attributesFunc.updateAttributeSimple)(attr)
    });
  });
  avs.forEach(avName => {
    (0, _functions.statePropFactory)(mp, `av_${avName}`, true);
  });
  relatedPropNames.forEach(propName => {
    (0, _functions.statePropFactory)(mp, propName, true);
  });
  ['speedmult', 'weaponspeedmult'].forEach(mult => {
    mp.makeProperty(`av_${mult}`, {
      isVisibleByOwner: true,
      isVisibleByNeighbors: true,
      updateOwner: (0, _attributesFunc.updateAttributeSimple)(mult),
      updateNeighbor: (0, _attributesFunc.updateAttributeSimple)(mult)
    });
  });
  let avOps = {
    set(formId, avName, modifierName, newValue) {
      const propName = `av_${avName.toLowerCase()}`;
      const value = mp.get(formId, propName);
      if (!value) return;
      value[modifierName] = newValue;
      mp.set(formId, propName, value);

      if (['health', 'magicka', 'stamina'].indexOf(avName.toLowerCase()) !== -1) {
        var _mp$get;

        const propName = `${avName.toLowerCase()}NumChanges`;
        const numChanges = (_mp$get = mp.get(formId, propName)) !== null && _mp$get !== void 0 ? _mp$get : 0;
        mp.set(formId, propName, 1 + numChanges);
      }
    },

    get(formId, avName, modifierName) {
      const propName = `av_${avName.toLowerCase()}`;
      const propValue = mp.get(formId, propName);

      if (propValue === undefined) {
        const s = `[av] '${propName}' was undefined for ${formId.toString(16)}`;
        throw new Error(s);
      }

      return propValue[modifierName] || 0;
    }

  };
  avOps = {
    parent: avOps,

    set(formId, avName, modifierName, newValue) {
      if (!this.parent) {
        return;
      }

      if (modifierName === 'damage') {
        if (newValue > 0) {
          newValue = 0;
        } else if (newValue < -getAvMaximum(this.parent, formId, avName)) {
          newValue = -getAvMaximum(this.parent, formId, avName);
        }
      }

      this.parent.set(formId, avName, modifierName, newValue);
    },

    get(formId, avName, modifierName) {
      if (!this.parent) {
        return 0;
      }

      return this.parent.get(formId, avName, modifierName);
    }

  };
  avOps = regen(avOps, 'health', 'healrate', 'healratemult', 'mp_healthdrain');
  avOps = regen(avOps, 'magicka', 'magickarate', 'magickaratemult', 'mp_magickadrain');
  avOps = regen(avOps, 'stamina', 'staminarate', 'staminaratemult', 'mp_staminadrain');
  avOps = {
    parent: avOps,

    set(formId, avName, modifierName, newValue) {
      if (!this.parent) {
        return;
      }

      const oldMaximum = getAvMaximum(this.parent, formId, avName);
      const newMaximum = getAvMaximum(this.parent, formId, avName);
      this.parent.set(formId, avName, modifierName, newValue);
      const k = newMaximum / oldMaximum;

      if (Number.isFinite(k) && k !== 1 && this.multiplyDamage) {
        this.multiplyDamage(formId, avName, k);
      }
    },

    get(formId, avName, modifierName) {
      if (!this.parent) {
        return 0;
      }

      return this.parent.get(formId, avName, modifierName);
    },

    multiplyDamage(formId, avName, k) {
      if (!this.parent) {
        return;
      }

      const previousDamage = this.parent.get(formId, avName, 'damage');
      this.parent.set(formId, avName, 'damage', previousDamage * k);
    }

  };
  exports.actorValues = actorValues = {
    set: (formId, avName, modifierName, newValue) => avOps.set(formId, avName, modifierName, newValue),
    get: (formId, avName, modifierName) => avOps.get(formId, avName, modifierName),
    getMaximum: (formId, avName) => getAvMaximum(avOps, formId, avName),
    getCurrent: (formId, avName) => getAvCurrent(avOps, formId, avName),
    flushRegen: (formId, avName) => {
      const damageModAfterRegen = avOps.get(formId, avName, 'damage');
      avOps.set(formId, avName, 'damage', damageModAfterRegen);
    },
    setDefaults: (formId, options, base = {}) => {
      console.log('[sync] setDefaults', formId.toString(16), base);
      const force = !!(options !== null && options !== void 0 && options.force);

      if (mp.get(formId, 'type') === 'MpActor') {
        if (mp.get(formId, 'isDead') === undefined || force) {
          mp.set(formId, 'isDead', false);
        }

        ['health', 'magicka', 'stamina'].forEach(avName => {
          if (!mp.get(formId, `av_${avName}`) || force) {
            var _base$avName;

            mp.set(formId, `av_${avName}`, {
              base: (_base$avName = base[avName]) !== null && _base$avName !== void 0 ? _base$avName : 100
            });
          }
        });
        ['healrate', 'magickarate', 'staminarate'].forEach(avName => {
          if (!mp.get(formId, `av_${avName}`) || force) {
            var _base$avName2;

            mp.set(formId, `av_${avName}`, {
              base: (_base$avName2 = base[avName]) !== null && _base$avName2 !== void 0 ? _base$avName2 : 5
            });
          }
        });
        ['healratemult', 'magickaratemult', 'staminaratemult'].forEach(avName => {
          if (!mp.get(formId, `av_${avName}`) || force) {
            var _base$avName3;

            mp.set(formId, `av_${avName}`, {
              base: (_base$avName3 = base[avName]) !== null && _base$avName3 !== void 0 ? _base$avName3 : 100
            });
          }
        });
        ['mp_healthdrain', 'mp_magickadrain', 'mp_staminadrain'].forEach(avName => {
          if (!mp.get(formId, `av_${avName}`) || force) {
            var _base$avName4;

            mp.set(formId, `av_${avName}`, {
              base: (_base$avName4 = base[avName]) !== null && _base$avName4 !== void 0 ? _base$avName4 : 0
            });
          }
        });

        if (!mp.get(formId, 'av_speedmult') || force) {
          var _base$speedmult;

          mp.set(formId, 'av_speedmult', {
            base: (_base$speedmult = base.speedmult) !== null && _base$speedmult !== void 0 ? _base$speedmult : 100
          });
        }

        if (!mp.get(formId, 'av_weaponspeedmult') || force) {
          var _base$weaponspeedmult;

          mp.set(formId, 'av_weaponspeedmult', {
            base: (_base$weaponspeedmult = base.weaponspeedmult) !== null && _base$weaponspeedmult !== void 0 ? _base$weaponspeedmult : 1
          });
        }

        ['oneHanded', 'twoHanded', 'marksman', 'block', 'smithing', 'heavyArmor', 'lightArmor', 'pickpocket', 'lockpicking', 'sneak', 'alchemy', 'speechcraft', 'alteration', 'conjuration', 'destruction', 'illusion', 'restoration', 'enchanting'].forEach(avName => {
          if (!mp.get(formId, `av_${avName}`) || force) {
            var _base$avName5;

            mp.set(formId, `av_${avName}`, {
              base: (_base$avName5 = base[avName]) !== null && _base$avName5 !== void 0 ? _base$avName5 : 100
            });
          }
        });
      }
    }
  };
};

exports.register = register;
},{"../../../papyrus/multiplayer/functions":"zNfc","./attributes-func":"WNwQ"}],"dwII":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.onUiMenuToggle = exports.onPrintConsole = exports.onLoad = exports.onInput = exports.onHit = exports.onEquip = exports.onEffectStart = exports.onCurrentCrosshairChange = exports.onCloseRaceMenu = exports.onCellChange = exports.onAnimationEvent = void 0;

const onLoad = ctx => {
  ctx.sp.once('update', async () => {
    if (ctx.state.loaded) return;
    await ctx.sp.Utility.wait(0.4);
    ctx.sendEvent();
    ctx.state.loaded = true;
  });
};

exports.onLoad = onLoad;

const onCellChange = ctx => {
  ctx.sp.on('update', () => {
    const ac = ctx.sp.Game.getPlayer();
    if ((ac === null || ac === void 0 ? void 0 : ac.getFormID()) !== 0x14) return;
    const currentCell = ac.getParentCell();

    if (currentCell && ctx.state.currentCell !== (currentCell === null || currentCell === void 0 ? void 0 : currentCell.getFormID())) {
      if (ctx.state.currentCell !== undefined) {
        ctx.sendEvent({
          prevCell: ctx.state.currentCell,
          currentCell: currentCell === null || currentCell === void 0 ? void 0 : currentCell.getFormID()
        });
      }

      ctx.state.currentCell = currentCell === null || currentCell === void 0 ? void 0 : currentCell.getFormID();
    }
  });
};

exports.onCellChange = onCellChange;

const onHit = (ctx, isHitStatic) => {
  ctx.sp.on('hit', event => {
    var _e$agressor, _e$agressor$getBaseOb, _e$agressor2, _e$target, _e$agressor3;

    const e = event;
    const baseId = (_e$agressor = e.agressor) === null || _e$agressor === void 0 ? void 0 : (_e$agressor$getBaseOb = _e$agressor.getBaseObject()) === null || _e$agressor$getBaseOb === void 0 ? void 0 : _e$agressor$getBaseOb.getFormID();
    if (((_e$agressor2 = e.agressor) === null || _e$agressor2 === void 0 ? void 0 : _e$agressor2.getFormID()) !== 0x14 && baseId === 7) return;
    const targetActor = ctx.sp.Actor.from(e.target);
    if (!!targetActor === isHitStatic) return;
    if (e.source && ctx.sp.Spell.from(e.source)) return;
    const target = ctx.getFormIdInServerFormat((_e$target = e.target) === null || _e$target === void 0 ? void 0 : _e$target.getFormID());
    const agressor = ctx.getFormIdInServerFormat((_e$agressor3 = e.agressor) === null || _e$agressor3 === void 0 ? void 0 : _e$agressor3.getFormID());
    ctx.sendEvent({
      isPowerAttack: e.isPowerAttack,
      isSneakAttack: e.isSneakAttack,
      isBashAttack: e.isBashAttack,
      isHitBlocked: e.isHitBlocked,
      target,
      agressor
    });
  });
};

exports.onHit = onHit;

const onEquip = ctx => {
  ctx.sp.on('equip', event => {
    var _e$baseObj, _ctx$sp$Game$getPlaye;

    const e = event;
    const target = ctx.getFormIdInServerFormat((_e$baseObj = e.baseObj) === null || _e$baseObj === void 0 ? void 0 : _e$baseObj.getFormID());
    const actor = ctx.getFormIdInServerFormat(e.actor.getFormID());
    const data = {
      actor,
      target,
      player: (_ctx$sp$Game$getPlaye = ctx.sp.Game.getPlayer()) === null || _ctx$sp$Game$getPlaye === void 0 ? void 0 : _ctx$sp$Game$getPlaye.getFormID()
    };
    ctx.sendEvent(data);
  });
};

exports.onEquip = onEquip;

const onInput = ctx => {
  ctx.sp.on('update', () => {
    const keys = ctx.sp.Input.getNumKeysPressed();

    if (ctx.state.keys !== keys) {
      if (ctx.state.keys !== undefined && keys) {
        const keycodes = [];

        for (let i = 0; i < keys; i++) {
          keycodes.push(ctx.sp.Input.getNthKeyPressed(i));
        }

        ctx.sendEvent(keycodes);
      }

      ctx.state.keys = keys;
    }
  });
};

exports.onInput = onInput;

const onAnimationEvent = ctx => {
  const next = ctx.sp.storage._api_onAnimationEvent;
  ctx.sp.storage._api_onAnimationEvent = {
    callback(...args) {
      const [, animEventName] = args;
      ctx.sendEvent({
        current: animEventName,
        previous: ctx.state.prevAnimation
      });
      ctx.state.prevAnimation = animEventName;

      if (typeof next.callback === 'function') {
        next.callback(...args);
      }
    }

  };
};

exports.onAnimationEvent = onAnimationEvent;

const onPrintConsole = ctx => {
  const next = ctx.sp.storage._api_onPrintConsole;
  ctx.sp.storage._api_onPrintConsole = {
    callback(...args) {
      ctx.sendEvent(args);

      if (typeof next.callback === 'function') {
        next.callback(...args);
      }
    }

  };
};

exports.onPrintConsole = onPrintConsole;

const onCloseRaceMenu = ctx => {
  const next = ctx.sp.storage._api_onCloseRaceMenu;
  ctx.sp.storage._api_onCloseRaceMenu = {
    callback() {
      ctx.sendEvent();

      if (typeof next.callback === 'function') {
        next.callback();
      }
    }

  };
};

exports.onCloseRaceMenu = onCloseRaceMenu;

const onUiMenuToggle = ctx => {
  const badMenus = ['BarterMenu', 'Book Menu', 'ContainerMenu', 'GiftMenu', 'InventoryMenu', 'Journal Menu', 'Lockpicking Menu', 'Loading Menu', 'MapMenu', 'RaceSex Menu', 'StatsMenu', 'TweenMenu', 'Console', 'Loading Menu', 'Main Menu'];
  const allMenu = ['BarterMenu', 'Book Menu', 'Console', 'Console Native UI Menu', 'ContainerMenu', 'Crafting Menu', 'Credits Menu', 'Cursor Menu', 'Debug Text Menu', 'Dialogue Menu', 'Fader Menu', 'FavoritesMenu', 'GiftMenu', 'HUD Menu', 'InventoryMenu', 'Journal Menu', 'Kinect Menu', 'LevelUp Menu', 'Loading Menu', 'Main Menu', 'Lockpicking Menu', 'MagicMenu', 'MapMenu', 'MessageBoxMenu', 'Mist Menu', 'Overlay Interaction Menu', 'Overlay Menu', 'Quantity Menu', 'RaceSex Menu', 'Sleep/Wait Menu', 'StatsMenu', 'TitleSequence Menu', 'Top Menu', 'Training Menu', 'Tutorial Menu', 'TweenMenu'];
  ctx.sp.on('update', () => {
    const isMenuOpen = badMenus.findIndex(menu => ctx.sp.Ui.isMenuOpen(menu)) >= 0;

    if (ctx.state.lastMenuState !== isMenuOpen) {
      if (ctx.state.lastMenuState !== undefined && isMenuOpen !== undefined) {
        ctx.sendEvent(isMenuOpen);
      }

      ctx.state.lastMenuState = isMenuOpen;
    }
  });
};

exports.onUiMenuToggle = onUiMenuToggle;

const onEffectStart = ctx => {
  ctx.sp.on('effectStart', event => {
    var _event$caster, _event$target, _event$caster2, _event$effect, _event$activeEffect;

    if (((_event$caster = event.caster) === null || _event$caster === void 0 ? void 0 : _event$caster.getFormID()) !== 0x14) return;
    const target = ctx.getFormIdInServerFormat((_event$target = event.target) === null || _event$target === void 0 ? void 0 : _event$target.getFormID());
    const caster = ctx.getFormIdInServerFormat((_event$caster2 = event.caster) === null || _event$caster2 === void 0 ? void 0 : _event$caster2.getFormID());
    ctx.sendEvent({
      caster,
      target,
      effect: (_event$effect = event.effect) === null || _event$effect === void 0 ? void 0 : _event$effect.getFormID(),
      mag: (_event$activeEffect = event.activeEffect) === null || _event$activeEffect === void 0 ? void 0 : _event$activeEffect.getMagnitude()
    });
  });
};

exports.onEffectStart = onEffectStart;

const onCurrentCrosshairChange = ctx => {
  ctx.sp.on('update', () => {
    const ref = ctx.sp.Game.getCurrentCrosshairRef();
    const refId = ref === null || ref === void 0 ? void 0 : ref.getFormID();

    if (ctx.state.lastCrosshairRef !== refId) {
      const data = {
        crosshairRefId: refId && ctx.getFormIdInServerFormat(refId)
      };
      ctx.sendEvent(data);
      ctx.state.lastCrosshairRef = refId;
    }
  });
};

exports.onCurrentCrosshairChange = onCurrentCrosshairChange;
},{}],"wmVe":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.teleportToLinkedDoorMarker = exports.setPosition = exports.setAngle = exports.register = exports.getPositionZ = exports.getPositionY = exports.getPositionX = exports.getPosition = exports.getLinkedDoorId = exports.getLinkedCellId = exports.getEspPosition = exports.getDistance = exports.getAngleZ = exports.getAngleY = exports.getAngleX = exports.getAngle = void 0;

var _papyrusArgs = require("../../utils/papyrusArgs");

const setPosition = (mp, self, args) => {
  const selfId = mp.getIdFromDesc(self.desc);
  const [x, y, z] = [(0, _papyrusArgs.getNumber)(args, 0), (0, _papyrusArgs.getNumber)(args, 1), (0, _papyrusArgs.getNumber)(args, 2)];
  mp.set(selfId, 'pos', [x, y, z]);
};

exports.setPosition = setPosition;

const getPosition = (mp, self) => {
  var _mp$get;

  return (_mp$get = mp.get(mp.getIdFromDesc(self.desc), 'pos')) !== null && _mp$get !== void 0 ? _mp$get : [0, 0, 0];
};

exports.getPosition = getPosition;

const getPositionX = (mp, self) => getPosition(mp, self)[0];

exports.getPositionX = getPositionX;

const getPositionY = (mp, self) => getPosition(mp, self)[1];

exports.getPositionY = getPositionY;

const getPositionZ = (mp, self) => getPosition(mp, self)[2];

exports.getPositionZ = getPositionZ;

const getEspPosition = (mp, placeId) => {
  var _espmRecord$record, _espmRecord$record$fi;

  const espmRecord = mp.lookupEspmRecordById(placeId);
  const data = (_espmRecord$record = espmRecord.record) === null || _espmRecord$record === void 0 ? void 0 : (_espmRecord$record$fi = _espmRecord$record.fields.find(x => x.type === 'DATA')) === null || _espmRecord$record$fi === void 0 ? void 0 : _espmRecord$record$fi.data;

  if (data) {
    const dataView = new DataView(data.buffer);
    const posX = dataView.getFloat32(4, true);
    const posY = dataView.getFloat32(8, true);
    const posZ = dataView.getFloat32(12, true);
    return [posX, posY, posZ];
  }

  return [0, 0, 0];
};

exports.getEspPosition = getEspPosition;

const setAngle = (mp, self, args) => {
  const selfId = mp.getIdFromDesc(self.desc);
  const [x, y, z] = [(0, _papyrusArgs.getNumber)(args, 0), (0, _papyrusArgs.getNumber)(args, 1), (0, _papyrusArgs.getNumber)(args, 2)];
  mp.set(selfId, 'angle', [x, y, z]);
};

exports.setAngle = setAngle;

const getAngle = (mp, self) => {
  var _mp$get2;

  return (_mp$get2 = mp.get(mp.getIdFromDesc(self.desc), 'angle')) !== null && _mp$get2 !== void 0 ? _mp$get2 : [0, 0, 0];
};

exports.getAngle = getAngle;

const getAngleX = (mp, self) => getAngle(mp, self)[0];

exports.getAngleX = getAngleX;

const getAngleY = (mp, self) => getAngle(mp, self)[1];

exports.getAngleY = getAngleY;

const getAngleZ = (mp, self) => getAngle(mp, self)[2];

exports.getAngleZ = getAngleZ;

const getDistance = (mp, self, args) => {
  const target = (0, _papyrusArgs.getObject)(args, 0);
  const selfPosition = getPosition(mp, self);
  const targetCoord = getPosition(mp, target);
  return Math.sqrt(Math.pow(selfPosition[0] - targetCoord[0], 2) + Math.pow(selfPosition[1] - targetCoord[1], 2) + Math.pow(selfPosition[2] - targetCoord[2], 2));
};

exports.getDistance = getDistance;

const teleportToLinkedDoorMarker = (mp, self, args) => {
  var _espmRecord$record2, _espmRecord$record2$f;

  const objectToTeleportId = mp.getIdFromDesc((0, _papyrusArgs.getObject)(args, 1).desc);
  const door = (0, _papyrusArgs.getObject)(args, 0);
  const espmRecord = mp.lookupEspmRecordById(mp.getIdFromDesc(door.desc));
  const xtel = (_espmRecord$record2 = espmRecord.record) === null || _espmRecord$record2 === void 0 ? void 0 : (_espmRecord$record2$f = _espmRecord$record2.fields.find(x => x.type === 'XTEL')) === null || _espmRecord$record2$f === void 0 ? void 0 : _espmRecord$record2$f.data;

  if (xtel) {
    const dataView = new DataView(xtel.buffer);
    const linkedDoorId = dataView.getUint32(0, true);
    const cell = mp.get(linkedDoorId, 'worldOrCellDesc');
    const [posX, posY, posZ] = [dataView.getFloat32(4, true), dataView.getFloat32(8, true), dataView.getFloat32(12, true)];
    const [angleX, angleY, angleZ] = [dataView.getFloat32(16, true), dataView.getFloat32(20, true), dataView.getFloat32(24, true)];
    mp.set(objectToTeleportId, 'worldOrCellDesc', cell);
    mp.set(objectToTeleportId, 'pos', [posX, posY, posZ]);
    mp.set(objectToTeleportId, 'angle', [angleX, angleY, angleZ]);
  }
};

exports.teleportToLinkedDoorMarker = teleportToLinkedDoorMarker;

const getLinkedDoorId = (mp, self, args) => {
  var _espmRecord$record3, _espmRecord$record3$f;

  const target = (0, _papyrusArgs.getObject)(args, 0);
  const targetId = mp.getIdFromDesc(target.desc);
  const espmRecord = mp.lookupEspmRecordById(targetId);
  const xtel = (_espmRecord$record3 = espmRecord.record) === null || _espmRecord$record3 === void 0 ? void 0 : (_espmRecord$record3$f = _espmRecord$record3.fields.find(x => x.type === 'XTEL')) === null || _espmRecord$record3$f === void 0 ? void 0 : _espmRecord$record3$f.data;
  if (!xtel) return 0;
  const dataView = new DataView(xtel.buffer);
  const linkedDoorId = dataView.getUint32(0, true);
  return linkedDoorId;
};

exports.getLinkedDoorId = getLinkedDoorId;

const getLinkedCellId = (mp, self, args) => {
  var _espmRecord$record4, _espmRecord$record4$f;

  const target = (0, _papyrusArgs.getObject)(args, 0);
  const targetId = mp.getIdFromDesc(target.desc);
  const espmRecord = mp.lookupEspmRecordById(targetId);
  const xtel = (_espmRecord$record4 = espmRecord.record) === null || _espmRecord$record4 === void 0 ? void 0 : (_espmRecord$record4$f = _espmRecord$record4.fields.find(x => x.type === 'XTEL')) === null || _espmRecord$record4$f === void 0 ? void 0 : _espmRecord$record4$f.data;
  if (!xtel) return 0;
  const dataView = new DataView(xtel.buffer);
  const linkedDoorId = dataView.getUint32(0, true);
  const linkedCellId = mp.getIdFromDesc(mp.get(linkedDoorId, 'worldOrCellDesc'));
  return linkedCellId;
};

exports.getLinkedCellId = getLinkedCellId;

const register = mp => {
  mp.registerPapyrusFunction('method', 'ObjectReference', 'SetPosition', (self, args) => setPosition(mp, self, args));
  mp.registerPapyrusFunction('method', 'ObjectReference', 'GetPositionX', self => getPositionX(mp, self));
  mp.registerPapyrusFunction('method', 'ObjectReference', 'GetPositionY', self => getPositionY(mp, self));
  mp.registerPapyrusFunction('method', 'ObjectReference', 'GetPositionZ', self => getPositionZ(mp, self));
  mp.registerPapyrusFunction('method', 'ObjectReference', 'SetAngle', (self, args) => setAngle(mp, self, args));
  mp.registerPapyrusFunction('method', 'ObjectReference', 'GetAngleX', self => getAngleX(mp, self));
  mp.registerPapyrusFunction('method', 'ObjectReference', 'GetAngleY', self => getAngleY(mp, self));
  mp.registerPapyrusFunction('method', 'ObjectReference', 'GetAngleZ', self => getAngleZ(mp, self));
  mp.registerPapyrusFunction('global', 'ObjectReferenceEx', 'TeleportToLinkedDoorMarker', (self, args) => teleportToLinkedDoorMarker(mp, self, args));
  mp.registerPapyrusFunction('global', 'ObjectReferenceEx', 'GetLinkedDoorId', (self, args) => getLinkedDoorId(mp, self, args));
  mp.registerPapyrusFunction('global', 'ObjectReferenceEx', 'GetLinkedCellId', (self, args) => getLinkedCellId(mp, self, args));
};

exports.register = register;
},{"../../utils/papyrusArgs":"oZY1"}],"P8j4":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setStorageValueStringArray = exports.setStorageValueString = exports.setStorageValueNumberArray = exports.setStorageValueNumber = exports.setStorageValueFormArray = exports.setStorageValueForm = exports.setStorageValueBoolArray = exports.setStorageValueBool = exports.setStorageValue = exports.register = exports.getStorageValueStringArray = exports.getStorageValueString = exports.getStorageValueNumberArray = exports.getStorageValueNumber = exports.getStorageValueFormArray = exports.getStorageValueForm = exports.getStorageValueBoolArray = exports.getStorageValueBool = exports.getStorageValue = exports._setStorageValue = exports._getStorageValue = void 0;

var _papyrusArgs = require("../../utils/papyrusArgs");

var _functions = require("../multiplayer/functions");

const _getStorageValue = (mp, self, args) => {
  const refId = mp.getIdFromDesc(self.desc);
  const key = (0, _papyrusArgs.getString)(args, 0);
  (0, _functions.checkAndCreatePropertyExist)(mp, refId, key);
  let val;

  try {
    val = mp.get(refId, key);
  } catch (err) {
    console.log(err);
  }

  return val;
};

exports._getStorageValue = _getStorageValue;

const getStorageValue = (mp, self, args) => {
  const ref = (0, _papyrusArgs.getObject)(args, 0);
  const key = (0, _papyrusArgs.getString)(args, 1);
  return _getStorageValue(mp, ref, [key]);
};

exports.getStorageValue = getStorageValue;

const getStorageValueString = (mp, self, args) => {
  const val = getStorageValue(mp, self, args);
  return val === null || val === undefined ? '' : (0, _papyrusArgs.getString)([val], 0);
};

exports.getStorageValueString = getStorageValueString;

const getStorageValueStringArray = (mp, self, args) => {
  const val = getStorageValue(mp, self, args);
  return val === null || val === undefined ? [] : (0, _papyrusArgs.getStringArray)([val], 0);
};

exports.getStorageValueStringArray = getStorageValueStringArray;

const getStorageValueNumber = (mp, self, args) => {
  const val = getStorageValue(mp, self, args);
  return val === null || val === undefined ? 0 : (0, _papyrusArgs.getNumber)([val], 0);
};

exports.getStorageValueNumber = getStorageValueNumber;

const getStorageValueNumberArray = (mp, self, args) => {
  const val = getStorageValue(mp, self, args);
  return val === null || val === undefined ? [] : (0, _papyrusArgs.getNumberArray)([val], 0);
};

exports.getStorageValueNumberArray = getStorageValueNumberArray;

const getStorageValueBool = (mp, self, args) => {
  const val = getStorageValue(mp, self, args);
  return val === null || val === undefined ? null : (0, _papyrusArgs.getBoolean)([val], 0);
};

exports.getStorageValueBool = getStorageValueBool;

const getStorageValueBoolArray = (mp, self, args) => {
  const val = getStorageValue(mp, self, args);
  return val === null || val === undefined ? [] : (0, _papyrusArgs.getBooleanArray)([val], 0);
};

exports.getStorageValueBoolArray = getStorageValueBoolArray;

const getStorageValueForm = (mp, self, args) => {
  const val = getStorageValue(mp, self, args);
  return val === null || val === undefined ? null : (0, _papyrusArgs.getObject)([val], 0);
};

exports.getStorageValueForm = getStorageValueForm;

const getStorageValueFormArray = (mp, self, args) => {
  const val = getStorageValue(mp, self, args);
  return val === null || val === undefined ? [] : (0, _papyrusArgs.getObjectArray)([val], 0);
};

exports.getStorageValueFormArray = getStorageValueFormArray;

const setStorageValueString = (mp, self, args) => setStorageValue(mp, args, (0, _papyrusArgs.getString)(args, 2));

exports.setStorageValueString = setStorageValueString;

const setStorageValueStringArray = (mp, self, args) => setStorageValue(mp, args, (0, _papyrusArgs.getStringArray)(args, 2));

exports.setStorageValueStringArray = setStorageValueStringArray;

const setStorageValueNumber = (mp, self, args) => setStorageValue(mp, args, (0, _papyrusArgs.getNumber)(args, 2));

exports.setStorageValueNumber = setStorageValueNumber;

const setStorageValueNumberArray = (mp, self, args) => setStorageValue(mp, args, (0, _papyrusArgs.getNumberArray)(args, 2));

exports.setStorageValueNumberArray = setStorageValueNumberArray;

const setStorageValueBool = (mp, self, args) => setStorageValue(mp, args, (0, _papyrusArgs.getBoolean)(args, 2));

exports.setStorageValueBool = setStorageValueBool;

const setStorageValueBoolArray = (mp, self, args) => setStorageValue(mp, args, (0, _papyrusArgs.getBooleanArray)(args, 2));

exports.setStorageValueBoolArray = setStorageValueBoolArray;

const setStorageValueForm = (mp, self, args) => setStorageValue(mp, args, (0, _papyrusArgs.getObject)(args, 2));

exports.setStorageValueForm = setStorageValueForm;

const setStorageValueFormArray = (mp, self, args) => setStorageValue(mp, args, (0, _papyrusArgs.getObjectArray)(args, 2));

exports.setStorageValueFormArray = setStorageValueFormArray;

const _setStorageValue = (mp, self, args) => {
  const refId = mp.getIdFromDesc(self.desc);
  const key = (0, _papyrusArgs.getString)(args, 0);
  const value = args[1];
  (0, _functions.checkAndCreatePropertyExist)(mp, refId, key);

  try {
    mp.set(refId, key, value);
  } catch (err) {
    console.log(err);
  }
};

exports._setStorageValue = _setStorageValue;

const setStorageValue = (mp, args, value) => {
  const ref = (0, _papyrusArgs.getObject)(args, 0);
  const refId = mp.getIdFromDesc(ref.desc);
  const key = (0, _papyrusArgs.getString)(args, 1);
  (0, _functions.checkAndCreatePropertyExist)(mp, refId, key);

  try {
    mp.set(refId, key, value);
  } catch (err) {
    console.log(err);
  }
};

exports.setStorageValue = setStorageValue;

const register = mp => {
  mp.registerPapyrusFunction('global', 'ObjectReferenceEx', 'GetStorageValueString', (self, args) => getStorageValueString(mp, self, args));
  mp.registerPapyrusFunction('global', 'ObjectReferenceEx', 'GetStorageValueStringArray', (self, args) => getStorageValueStringArray(mp, self, args));
  mp.registerPapyrusFunction('global', 'ObjectReferenceEx', 'GetStorageValueInt', (self, args) => getStorageValueNumber(mp, self, args));
  mp.registerPapyrusFunction('global', 'ObjectReferenceEx', 'GetStorageValueIntArray', (self, args) => getStorageValueNumberArray(mp, self, args));
  mp.registerPapyrusFunction('global', 'ObjectReferenceEx', 'GetStorageValueFloat', (self, args) => getStorageValueNumber(mp, self, args));
  mp.registerPapyrusFunction('global', 'ObjectReferenceEx', 'GetStorageValueFloatArray', (self, args) => getStorageValueNumberArray(mp, self, args));
  mp.registerPapyrusFunction('global', 'ObjectReferenceEx', 'GetStorageValueBool', (self, args) => getStorageValueBool(mp, self, args));
  mp.registerPapyrusFunction('global', 'ObjectReferenceEx', 'GetStorageValueBoolArray', (self, args) => getStorageValueBoolArray(mp, self, args));
  mp.registerPapyrusFunction('global', 'ObjectReferenceEx', 'GetStorageValueForm', (self, args) => getStorageValueForm(mp, self, args));
  mp.registerPapyrusFunction('global', 'ObjectReferenceEx', 'GetStorageValueFormArray', (self, args) => getStorageValueFormArray(mp, self, args));
  mp.registerPapyrusFunction('global', 'ObjectReferenceEx', 'SetStorageValueString', (self, args) => setStorageValueString(mp, self, args));
  mp.registerPapyrusFunction('global', 'ObjectReferenceEx', 'SetStorageValueStringArray', (self, args) => setStorageValueStringArray(mp, self, args));
  mp.registerPapyrusFunction('global', 'ObjectReferenceEx', 'SetStorageValueInt', (self, args) => setStorageValueNumber(mp, self, args));
  mp.registerPapyrusFunction('global', 'ObjectReferenceEx', 'SetStorageValueIntArray', (self, args) => setStorageValueNumberArray(mp, self, args));
  mp.registerPapyrusFunction('global', 'ObjectReferenceEx', 'SetStorageValueFloat', (self, args) => setStorageValueNumber(mp, self, args));
  mp.registerPapyrusFunction('global', 'ObjectReferenceEx', 'SetStorageValueFloatArray', (self, args) => setStorageValueNumberArray(mp, self, args));
  mp.registerPapyrusFunction('global', 'ObjectReferenceEx', 'SetStorageValueBool', (self, args) => setStorageValueBool(mp, self, args));
  mp.registerPapyrusFunction('global', 'ObjectReferenceEx', 'SetStorageValueBoolArray', (self, args) => setStorageValueBoolArray(mp, self, args));
  mp.registerPapyrusFunction('global', 'ObjectReferenceEx', 'SetStorageValueForm', (self, args) => setStorageValueForm(mp, self, args));
  mp.registerPapyrusFunction('global', 'ObjectReferenceEx', 'SetStorageValueFormArray', (self, args) => setStorageValueFormArray(mp, self, args));
};

exports.register = register;
},{"../../utils/papyrusArgs":"oZY1","../multiplayer/functions":"zNfc"}],"FxH1":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.uint8arrayToStringMethod = exports.uint8 = exports.uint32 = exports.uint16 = exports.randomInRange = exports.isArrayEqual = exports.int32 = exports.inPoly = exports.float32 = void 0;

const isArrayEqual = (arr1, arr2) => {
  const type = Object.prototype.toString.call(arr1);
  if (type !== Object.prototype.toString.call(arr2)) return false;
  if (['[object Array]', '[object Object]'].indexOf(type) < 0) return false;
  const valueLen = type === '[object Array]' ? arr1.length : Object.keys(arr1).length;
  const otherLen = type === '[object Array]' ? arr2.length : Object.keys(arr2).length;
  if (valueLen !== otherLen) return false;

  const compare = (item1, item2) => {
    const itemType = Object.prototype.toString.call(item1);

    if (['[object Array]', '[object Object]'].indexOf(itemType) >= 0) {
      if (!isArrayEqual(item1, item2)) return false;
    } else {
      if (itemType !== Object.prototype.toString.call(item2)) return false;

      if (itemType === '[object Function]') {
        if (item1.toString() !== item2.toString()) return false;
      } else if (item1 !== item2) return false;
    }
  };

  if (type === '[object Array]') {
    for (let i = 0; i < valueLen; i++) {
      if (compare(arr1[i], arr2[i]) === false) return false;
    }
  } else {
    for (const key in arr1) {
      if (arr1.hasOwnProperty(key)) {
        if (compare(arr1[key], arr2[key]) === false) return false;
      }
    }
  }

  return true;
};

exports.isArrayEqual = isArrayEqual;

const randomInRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

exports.randomInRange = randomInRange;
const cacheInPoly = {};

const inPoly = (x, y, xp, yp) => {
  const index = x.toString() + y.toString() + xp.join('') + yp.join('');

  if (cacheInPoly[index]) {
    return cacheInPoly[index];
  }

  const npol = xp.length;
  let j = npol - 1;
  let c = false;

  for (let i = 0; i < npol; i++) {
    if ((yp[i] <= y && y < yp[j] || yp[j] <= y && y < yp[i]) && x > (xp[j] - xp[i]) * (y - yp[i]) / (yp[j] - yp[i]) + xp[i]) {
      c = !c;
    }

    j = i;
  }

  cacheInPoly[index] = c;
  return c;
};

exports.inPoly = inPoly;

const uint8arrayToStringMethod = myUint8Arr => {
  return String.fromCharCode.apply(null, [...myUint8Arr]);
};

exports.uint8arrayToStringMethod = uint8arrayToStringMethod;

const uint8 = (buffer, offset = 0) => new DataView(buffer).getUint8(offset);

exports.uint8 = uint8;

const uint16 = (buffer, offset = 0) => new DataView(buffer).getUint16(offset, true);

exports.uint16 = uint16;

const uint32 = (buffer, offset = 0) => new DataView(buffer).getUint32(offset, true);

exports.uint32 = uint32;

const int32 = (buffer, offset = 0) => new DataView(buffer).getInt32(offset, true);

exports.int32 = int32;

const float32 = (buffer, offset = 0) => new DataView(buffer).getFloat32(offset, true);

exports.float32 = float32;
},{}],"WIJZ":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.register = exports.isInterior = exports.getLocation = void 0;

var _papyrusArgs = require("../../utils/papyrusArgs");

var _helper = require("../../utils/helper");

var _ = require("../../..");

const FLG_Interior = 0x0001;
const FLG_Has_Water = 0x0002;
const FLG_Cant_Travel_From_Here = 0x0004;
const FLG_No_LOD_Water = 0x0008;
const FLG_Public_Area = 0x0020;
const FLG_Hand_Changed = 0x0040;
const FLG_Show_Sky = 0x0080;
const FLG_Use_Sky_Lighting = 0x0100;

const flagExists = (mp, self, flag) => {
  var _espmRecord$record, _espmRecord$record$fi;

  const selfId = mp.getIdFromDesc(self.desc);
  const espmRecord = mp.lookupEspmRecordById(selfId);
  const enit = (_espmRecord$record = espmRecord.record) === null || _espmRecord$record === void 0 ? void 0 : (_espmRecord$record$fi = _espmRecord$record.fields.find(x => x.type === 'DATA')) === null || _espmRecord$record$fi === void 0 ? void 0 : _espmRecord$record$fi.data;
  if (!enit) return false;
  const flags = (0, _helper.uint16)(enit.buffer, 0);
  return !!(flags & flag);
};

const isInterior = (mp, self) => flagExists(mp, self, FLG_Interior);

exports.isInterior = isInterior;

const getLocation = (mp, self, args) => {
  var _espmRecord$record2, _espmRecord$record2$f;

  const cell = (0, _papyrusArgs.getObject)(args, 0);
  const espmRecord = mp.lookupEspmRecordById(mp.getIdFromDesc(cell.desc));
  const xlcn = (_espmRecord$record2 = espmRecord.record) === null || _espmRecord$record2 === void 0 ? void 0 : (_espmRecord$record2$f = _espmRecord$record2.fields.find(x => x.type === 'XLCN')) === null || _espmRecord$record2$f === void 0 ? void 0 : _espmRecord$record2$f.data;

  if (xlcn) {
    const dataView = new DataView(xlcn.buffer);
    return {
      type: 'espm',
      desc: mp.getDescFromId(dataView.getUint32(0, true))
    };
  }
};

exports.getLocation = getLocation;

const register = mp => {
  mp.registerPapyrusFunction('method', 'Cell', 'IsInterior', self => isInterior(mp, self));
  mp.registerPapyrusFunction('global', 'CellEx', 'GetLocation', (self, args) => getLocation(mp, self, args));

  _.ICell.IsInterior = self => isInterior(mp, self);

  _.ICell.GetLocation = self => getLocation(mp, null, [self]);
};

exports.register = register;
},{"../../utils/papyrusArgs":"oZY1","../../utils/helper":"FxH1","../../..":"QCba"}],"I1C7":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setActorValue = exports.restoreActorValue = exports.modActorValue = exports.getActorValuePercentage = exports.getActorValue = exports.damageActorValue = void 0;

var _attributes = require("../../properties/actor/actorValues/attributes");

var _papyrusArgs = require("../../utils/papyrusArgs");

const setActorValue = (mp, self, args) => {
  const selfId = mp.getIdFromDesc(self.desc);
  const avName = (0, _papyrusArgs.getString)(args, 0);
  const avValue = (0, _papyrusArgs.getNumber)(args, 1);

  _attributes.actorValues.set(selfId, avName, 'base', avValue);
};

exports.setActorValue = setActorValue;

const getActorValue = (mp, self, args) => {
  const selfId = mp.getIdFromDesc(self.desc);
  const avName = (0, _papyrusArgs.getString)(args, 0);
  return _attributes.actorValues.getCurrent(selfId, avName);
};

exports.getActorValue = getActorValue;

const getActorValuePercentage = (mp, self, args) => {
  const selfId = mp.getIdFromDesc(self.desc);
  const avName = (0, _papyrusArgs.getString)(args, 0);
  return _attributes.actorValues.getCurrent(selfId, avName) / _attributes.actorValues.getMaximum(selfId, avName);
};

exports.getActorValuePercentage = getActorValuePercentage;

const damageActorValue = (mp, self, args) => {
  const selfId = mp.getIdFromDesc(self.desc);
  const avName = (0, _papyrusArgs.getString)(args, 0);
  const avValue = (0, _papyrusArgs.getNumber)(args, 1);

  const damage = _attributes.actorValues.get(selfId, avName, 'damage');

  _attributes.actorValues.set(selfId, avName, 'damage', damage - avValue);
};

exports.damageActorValue = damageActorValue;

const restoreActorValue = (mp, self, args) => {
  const selfId = mp.getIdFromDesc(self.desc);
  const avName = (0, _papyrusArgs.getString)(args, 0);
  const avValue = (0, _papyrusArgs.getNumber)(args, 1);

  const damage = _attributes.actorValues.get(selfId, avName, 'damage');

  _attributes.actorValues.set(selfId, avName, 'damage', damage + avValue > 0 ? 0 : damage + avValue);
};

exports.restoreActorValue = restoreActorValue;

const modActorValue = (mp, self, args) => {
  const selfId = mp.getIdFromDesc(self.desc);
  const avName = (0, _papyrusArgs.getString)(args, 0);
  const avValue = (0, _papyrusArgs.getNumber)(args, 1);

  _attributes.actorValues.set(selfId, avName, 'temporary', avValue);
};

exports.modActorValue = modActorValue;
},{"../../properties/actor/actorValues/attributes":"Klzq","../../utils/papyrusArgs":"oZY1"}],"d40v":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removePerk = exports.hasPerk = exports.addPerk = void 0;

var _papyrusArgs = require("../../utils/papyrusArgs");

const getPerkList = (mp, selfId) => {
  var _mp$get;

  return (_mp$get = mp.get(selfId, 'perk')) !== null && _mp$get !== void 0 ? _mp$get : [];
};

const setPerkList = (mp, selfId, perkList) => {
  mp.set(selfId, 'perk', perkList);
};

const hasPerk = (mp, self, args) => {
  const perk = (0, _papyrusArgs.getObject)(args, 0);
  const selfId = mp.getIdFromDesc(self.desc);
  const perkId = mp.getIdFromDesc(perk.desc);
  return getPerkList(mp, selfId).includes(perkId);
};

exports.hasPerk = hasPerk;

const addPerk = (mp, self, args) => {
  const perk = (0, _papyrusArgs.getObject)(args, 0);
  const selfId = mp.getIdFromDesc(self.desc);
  const perkId = mp.getIdFromDesc(perk.desc);
  if (hasPerk(mp, self, args)) return;
  const perkList = getPerkList(mp, selfId);
  perkList.push(perkId);
  setPerkList(mp, selfId, perkList);
};

exports.addPerk = addPerk;

const removePerk = (mp, self, args) => {
  const perk = (0, _papyrusArgs.getObject)(args, 0);
  const selfId = mp.getIdFromDesc(self.desc);
  const perkId = mp.getIdFromDesc(perk.desc);
  if (!hasPerk(mp, self, args)) return;
  const perkList = getPerkList(mp, selfId);
  perkList.push(perkId);
  setPerkList(mp, selfId, perkList.filter(id => id !== perkId));
};

exports.removePerk = removePerk;
},{"../../utils/papyrusArgs":"oZY1"}],"icKT":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.equipSlotMap = void 0;
const equipSlotMap = {
  0x1: 30,
  0x2: 31,
  0x4: 32,
  0x8: 33,
  0x10: 34,
  0x20: 35,
  0x40: 36,
  0x80: 37,
  0x100: 38,
  0x200: 39,
  0x400: 40,
  0x800: 41,
  0x1000: 42,
  0x2000: 43
};
exports.equipSlotMap = equipSlotMap;
},{}],"WNhg":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.register = exports.getSlotById = exports.getSlot = exports.getBaseArmorById = exports.getArmorRating = void 0;

var _ = require("../../..");

var _helper = require("../../utils/helper");

var _types = require("./types");

const getBaseArmorById = (mp, selfId, espmRecord) => {
  var _espmRecord$record, _espmRecord$record$fi;

  if (!espmRecord) espmRecord = mp.lookupEspmRecordById(selfId);
  const dnam = (_espmRecord$record = espmRecord.record) === null || _espmRecord$record === void 0 ? void 0 : (_espmRecord$record$fi = _espmRecord$record.fields.find(x => x.type === 'DNAM')) === null || _espmRecord$record$fi === void 0 ? void 0 : _espmRecord$record$fi.data;
  if (!dnam) return 0;
  return (0, _helper.uint32)(dnam.buffer, 0) / 100;
};

exports.getBaseArmorById = getBaseArmorById;

const getArmorRating = (mp, self) => {
  const selfId = mp.getIdFromDesc(self.desc);
  return getBaseArmorById(mp, selfId);
};

exports.getArmorRating = getArmorRating;

const getSlotById = (mp, selfId, espmRecord) => {
  var _espmRecord$record2, _espmRecord$record2$f;

  if (!espmRecord) espmRecord = mp.lookupEspmRecordById(selfId);
  const b2 = (_espmRecord$record2 = espmRecord.record) === null || _espmRecord$record2 === void 0 ? void 0 : (_espmRecord$record2$f = _espmRecord$record2.fields.find(x => x.type === 'BOD2')) === null || _espmRecord$record2$f === void 0 ? void 0 : _espmRecord$record2$f.data;
  if (!b2) return [];
  const slot = (0, _helper.uint32)(b2.buffer, 0);
  if (!slot) return [];
  return Object.keys(_types.equipSlotMap).filter(k => slot & +k).map(k => _types.equipSlotMap[+k]);
};

exports.getSlotById = getSlotById;

const getSlot = (mp, self) => {
  const selfId = mp.getIdFromDesc(self.desc);
  return getSlotById(mp, selfId);
};

exports.getSlot = getSlot;

const register = mp => {
  mp.registerPapyrusFunction('method', 'Armor', 'GetArmorRating', self => getArmorRating(mp, self));
  mp.registerPapyrusFunction('method', 'Armor', 'GetAR', self => getArmorRating(mp, self));
  mp.registerPapyrusFunction('method', 'Armor', 'GetSlot', self => getSlot(mp, self));

  _.IArmor.GetArmorRating = self => getArmorRating(mp, self);

  _.IArmor.GetSlot = self => getSlot(mp, self);
};

exports.register = register;
},{"../../..":"QCba","../../utils/helper":"FxH1","./types":"icKT"}],"D1sz":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hasKeywordEx = exports.hasKeyword = exports.getNumKeywords = exports.getNthKeyword = exports.getKeywords = void 0;

var _ = require(".");

var _papyrusArgs = require("../../utils/papyrusArgs");

var _game = require("../game");

const getKeywords = (mp, self) => {
  var _data$record, _data$record$fields$f;

  const selfId = (0, _.getSelfId)(mp, self.desc);
  const data = mp.lookupEspmRecordById(selfId);
  const kwda = (_data$record = data.record) === null || _data$record === void 0 ? void 0 : (_data$record$fields$f = _data$record.fields.find(x => x.type === 'KWDA')) === null || _data$record$fields$f === void 0 ? void 0 : _data$record$fields$f.data;
  const keywords = [];
  if (!kwda) return keywords;
  const dataView = new DataView(kwda.buffer);

  for (let i = 0; i < dataView.byteLength; i += 4) {
    keywords.push({
      desc: mp.getDescFromId(dataView.getUint32(i, true)),
      type: 'espm'
    });
  }

  return keywords;
};

exports.getKeywords = getKeywords;

const getNumKeywords = (mp, self) => {
  var _data$record2, _data$record2$fields$;

  const selfId = (0, _.getSelfId)(mp, self.desc);
  const data = mp.lookupEspmRecordById(selfId);
  const ksiz = (_data$record2 = data.record) === null || _data$record2 === void 0 ? void 0 : (_data$record2$fields$ = _data$record2.fields.find(x => x.type === 'KSIZ')) === null || _data$record2$fields$ === void 0 ? void 0 : _data$record2$fields$.data;
  if (!ksiz) return 0;
  const dataView = new DataView(ksiz.buffer);
  return dataView.getUint32(0, true);
};

exports.getNumKeywords = getNumKeywords;

const getNthKeyword = (mp, self, args) => {
  var _data$record3, _data$record3$fields$;

  const selfId = (0, _.getSelfId)(mp, self.desc);
  const data = mp.lookupEspmRecordById(selfId);
  const index = (0, _papyrusArgs.getNumber)(args, 0) - 1;
  const kwda = (_data$record3 = data.record) === null || _data$record3 === void 0 ? void 0 : (_data$record3$fields$ = _data$record3.fields.find(x => x.type === 'KWDA')) === null || _data$record3$fields$ === void 0 ? void 0 : _data$record3$fields$.data;

  if (kwda) {
    const dataView = new DataView(kwda.buffer);
    return {
      desc: mp.getDescFromId(dataView.getUint32(index * 4, true)),
      type: 'espm'
    };
  }
};

exports.getNthKeyword = getNthKeyword;

const hasKeyword = (mp, self, args) => {
  var _espmRecord$record, _espmRecord$record$fi;

  const selfId = (0, _.getSelfId)(mp, self.desc);
  const keyword = (0, _papyrusArgs.getObject)(args, 0);
  const keywordId = mp.getIdFromDesc(keyword.desc);
  const espmRecord = mp.lookupEspmRecordById(selfId);
  const kwda = (_espmRecord$record = espmRecord.record) === null || _espmRecord$record === void 0 ? void 0 : (_espmRecord$record$fi = _espmRecord$record.fields.find(x => x.type === 'KWDA')) === null || _espmRecord$record$fi === void 0 ? void 0 : _espmRecord$record$fi.data;

  if (kwda) {
    const dataView = new DataView(kwda.buffer);

    for (let i = 0; i < dataView.byteLength; i += 4) {
      if (dataView.getUint32(i, true) === keywordId) return true;
    }
  }

  return false;
};

exports.hasKeyword = hasKeyword;

const hasKeywordEx = (mp, self, args) => {
  const form = (0, _game.getForm)(mp, null, [(0, _papyrusArgs.getNumber)(args, 0)]);
  const keyword = (0, _game.getForm)(mp, null, [(0, _papyrusArgs.getNumber)(args, 1)]);
  if (!form || !keyword) return false;
  return hasKeyword(mp, form, [keyword]);
};

exports.hasKeywordEx = hasKeywordEx;
},{".":"mnzc","../../utils/papyrusArgs":"oZY1","../game":"WCBi"}],"CIMu":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formType = exports.FormType = void 0;
var FormType;
exports.FormType = FormType;

(function (FormType) {
  FormType[FormType["kFormType_None"] = 0] = "kFormType_None";
  FormType[FormType["kFormType_TES4"] = 1] = "kFormType_TES4";
  FormType[FormType["kFormType_Group"] = 2] = "kFormType_Group";
  FormType[FormType["kFormType_GMST"] = 3] = "kFormType_GMST";
  FormType[FormType["kFormType_Keyword"] = 4] = "kFormType_Keyword";
  FormType[FormType["kFormType_LocationRef"] = 5] = "kFormType_LocationRef";
  FormType[FormType["kFormType_Action"] = 6] = "kFormType_Action";
  FormType[FormType["kFormType_TextureSet"] = 7] = "kFormType_TextureSet";
  FormType[FormType["kFormType_MenuIcon"] = 8] = "kFormType_MenuIcon";
  FormType[FormType["kFormType_Global"] = 9] = "kFormType_Global";
  FormType[FormType["kFormType_Class"] = 10] = "kFormType_Class";
  FormType[FormType["kFormType_Faction"] = 11] = "kFormType_Faction";
  FormType[FormType["kFormType_HeadPart"] = 12] = "kFormType_HeadPart";
  FormType[FormType["kFormType_Eyes"] = 13] = "kFormType_Eyes";
  FormType[FormType["kFormType_Race"] = 14] = "kFormType_Race";
  FormType[FormType["kFormType_Sound"] = 15] = "kFormType_Sound";
  FormType[FormType["kFormType_AcousticSpace"] = 16] = "kFormType_AcousticSpace";
  FormType[FormType["kFormType_Skill"] = 17] = "kFormType_Skill";
  FormType[FormType["kFormType_EffectSetting"] = 18] = "kFormType_EffectSetting";
  FormType[FormType["kFormType_Script"] = 19] = "kFormType_Script";
  FormType[FormType["kFormType_LandTexture"] = 20] = "kFormType_LandTexture";
  FormType[FormType["kFormType_Enchantment"] = 21] = "kFormType_Enchantment";
  FormType[FormType["kFormType_Spell"] = 22] = "kFormType_Spell";
  FormType[FormType["kFormType_ScrollItem"] = 23] = "kFormType_ScrollItem";
  FormType[FormType["kFormType_Activator"] = 24] = "kFormType_Activator";
  FormType[FormType["kFormType_TalkingActivator"] = 25] = "kFormType_TalkingActivator";
  FormType[FormType["kFormType_Armor"] = 26] = "kFormType_Armor";
  FormType[FormType["kFormType_Book"] = 27] = "kFormType_Book";
  FormType[FormType["kFormType_Container"] = 28] = "kFormType_Container";
  FormType[FormType["kFormType_Door"] = 29] = "kFormType_Door";
  FormType[FormType["kFormType_Ingredient"] = 30] = "kFormType_Ingredient";
  FormType[FormType["kFormType_Light"] = 31] = "kFormType_Light";
  FormType[FormType["kFormType_Misc"] = 32] = "kFormType_Misc";
  FormType[FormType["kFormType_Apparatus"] = 33] = "kFormType_Apparatus";
  FormType[FormType["kFormType_Static"] = 34] = "kFormType_Static";
  FormType[FormType["kFormType_StaticCollection"] = 35] = "kFormType_StaticCollection";
  FormType[FormType["kFormType_MovableStatic"] = 36] = "kFormType_MovableStatic";
  FormType[FormType["kFormType_Grass"] = 37] = "kFormType_Grass";
  FormType[FormType["kFormType_Tree"] = 38] = "kFormType_Tree";
  FormType[FormType["kFormType_Flora"] = 39] = "kFormType_Flora";
  FormType[FormType["kFormType_Furniture"] = 40] = "kFormType_Furniture";
  FormType[FormType["kFormType_Weapon"] = 41] = "kFormType_Weapon";
  FormType[FormType["kFormType_Ammo"] = 42] = "kFormType_Ammo";
  FormType[FormType["kFormType_NPC"] = 43] = "kFormType_NPC";
  FormType[FormType["kFormType_LeveledCharacter"] = 44] = "kFormType_LeveledCharacter";
  FormType[FormType["kFormType_Key"] = 45] = "kFormType_Key";
  FormType[FormType["kFormType_Potion"] = 46] = "kFormType_Potion";
  FormType[FormType["kFormType_IdleMarker"] = 47] = "kFormType_IdleMarker";
  FormType[FormType["kFormType_Note"] = 48] = "kFormType_Note";
  FormType[FormType["kFormType_ConstructibleObject"] = 49] = "kFormType_ConstructibleObject";
  FormType[FormType["kFormType_Projectile"] = 50] = "kFormType_Projectile";
  FormType[FormType["kFormType_Hazard"] = 51] = "kFormType_Hazard";
  FormType[FormType["kFormType_SoulGem"] = 52] = "kFormType_SoulGem";
  FormType[FormType["kFormType_LeveledItem"] = 53] = "kFormType_LeveledItem";
  FormType[FormType["kFormType_Weather"] = 54] = "kFormType_Weather";
  FormType[FormType["kFormType_Climate"] = 55] = "kFormType_Climate";
  FormType[FormType["kFormType_SPGD"] = 56] = "kFormType_SPGD";
  FormType[FormType["kFormType_ReferenceEffect"] = 57] = "kFormType_ReferenceEffect";
  FormType[FormType["kFormType_Region"] = 58] = "kFormType_Region";
  FormType[FormType["kFormType_NAVI"] = 59] = "kFormType_NAVI";
  FormType[FormType["kFormType_Cell"] = 60] = "kFormType_Cell";
  FormType[FormType["kFormType_Reference"] = 61] = "kFormType_Reference";
  FormType[FormType["kFormType_Character"] = 62] = "kFormType_Character";
  FormType[FormType["kFormType_Missile"] = 63] = "kFormType_Missile";
  FormType[FormType["kFormType_Arrow"] = 64] = "kFormType_Arrow";
  FormType[FormType["kFormType_Grenade"] = 65] = "kFormType_Grenade";
  FormType[FormType["kFormType_BeamProj"] = 66] = "kFormType_BeamProj";
  FormType[FormType["kFormType_FlameProj"] = 67] = "kFormType_FlameProj";
  FormType[FormType["kFormType_ConeProj"] = 68] = "kFormType_ConeProj";
  FormType[FormType["kFormType_BarrierProj"] = 69] = "kFormType_BarrierProj";
  FormType[FormType["kFormType_PHZD"] = 70] = "kFormType_PHZD";
  FormType[FormType["kFormType_WorldSpace"] = 71] = "kFormType_WorldSpace";
  FormType[FormType["kFormType_Land"] = 72] = "kFormType_Land";
  FormType[FormType["kFormType_NAVM"] = 73] = "kFormType_NAVM";
  FormType[FormType["kFormType_TLOD"] = 74] = "kFormType_TLOD";
  FormType[FormType["kFormType_Topic"] = 75] = "kFormType_Topic";
  FormType[FormType["kFormType_TopicInfo"] = 76] = "kFormType_TopicInfo";
  FormType[FormType["kFormType_Quest"] = 77] = "kFormType_Quest";
  FormType[FormType["kFormType_Idle"] = 78] = "kFormType_Idle";
  FormType[FormType["kFormType_Package"] = 79] = "kFormType_Package";
  FormType[FormType["kFormType_CombatStyle"] = 80] = "kFormType_CombatStyle";
  FormType[FormType["kFormType_LoadScreen"] = 81] = "kFormType_LoadScreen";
  FormType[FormType["kFormType_LeveledSpell"] = 82] = "kFormType_LeveledSpell";
  FormType[FormType["kFormType_ANIO"] = 83] = "kFormType_ANIO";
  FormType[FormType["kFormType_Water"] = 84] = "kFormType_Water";
  FormType[FormType["kFormType_EffectShader"] = 85] = "kFormType_EffectShader";
  FormType[FormType["kFormType_TOFT"] = 86] = "kFormType_TOFT";
  FormType[FormType["kFormType_Explosion"] = 87] = "kFormType_Explosion";
  FormType[FormType["kFormType_Debris"] = 88] = "kFormType_Debris";
  FormType[FormType["kFormType_ImageSpace"] = 89] = "kFormType_ImageSpace";
  FormType[FormType["kFormType_ImageSpaceMod"] = 90] = "kFormType_ImageSpaceMod";
  FormType[FormType["kFormType_List"] = 91] = "kFormType_List";
  FormType[FormType["kFormType_Perk"] = 92] = "kFormType_Perk";
  FormType[FormType["kFormType_BodyPartData"] = 93] = "kFormType_BodyPartData";
  FormType[FormType["kFormType_AddonNode"] = 94] = "kFormType_AddonNode";
  FormType[FormType["kFormType_ActorValueInfo"] = 95] = "kFormType_ActorValueInfo";
  FormType[FormType["kFormType_CameraShot"] = 96] = "kFormType_CameraShot";
  FormType[FormType["kFormType_CameraPath"] = 97] = "kFormType_CameraPath";
  FormType[FormType["kFormType_VoiceType"] = 98] = "kFormType_VoiceType";
  FormType[FormType["kFormType_MaterialType"] = 99] = "kFormType_MaterialType";
  FormType[FormType["kFormType_ImpactData"] = 100] = "kFormType_ImpactData";
  FormType[FormType["kFormType_ImpactDataSet"] = 101] = "kFormType_ImpactDataSet";
  FormType[FormType["kFormType_ARMA"] = 102] = "kFormType_ARMA";
  FormType[FormType["kFormType_EncounterZone"] = 103] = "kFormType_EncounterZone";
  FormType[FormType["kFormType_Location"] = 104] = "kFormType_Location";
  FormType[FormType["kFormType_Message"] = 105] = "kFormType_Message";
  FormType[FormType["kFormType_Ragdoll"] = 106] = "kFormType_Ragdoll";
  FormType[FormType["kFormType_DOBJ"] = 107] = "kFormType_DOBJ";
  FormType[FormType["kFormType_LightingTemplate"] = 108] = "kFormType_LightingTemplate";
  FormType[FormType["kFormType_MusicType"] = 109] = "kFormType_MusicType";
  FormType[FormType["kFormType_Footstep"] = 110] = "kFormType_Footstep";
  FormType[FormType["kFormType_FootstepSet"] = 111] = "kFormType_FootstepSet";
  FormType[FormType["kFormType_StoryBranchNode"] = 112] = "kFormType_StoryBranchNode";
  FormType[FormType["kFormType_StoryQuestNode"] = 113] = "kFormType_StoryQuestNode";
  FormType[FormType["kFormType_StoryEventNode"] = 114] = "kFormType_StoryEventNode";
  FormType[FormType["kFormType_DialogueBranch"] = 115] = "kFormType_DialogueBranch";
  FormType[FormType["kFormType_MusicTrack"] = 116] = "kFormType_MusicTrack";
  FormType[FormType["kFormType_DLVW"] = 117] = "kFormType_DLVW";
  FormType[FormType["kFormType_WordOfPower"] = 118] = "kFormType_WordOfPower";
  FormType[FormType["kFormType_Shout"] = 119] = "kFormType_Shout";
  FormType[FormType["kFormType_EquipSlot"] = 120] = "kFormType_EquipSlot";
  FormType[FormType["kFormType_Relationship"] = 121] = "kFormType_Relationship";
  FormType[FormType["kFormType_Scene"] = 122] = "kFormType_Scene";
  FormType[FormType["kFormType_AssociationType"] = 123] = "kFormType_AssociationType";
  FormType[FormType["kFormType_Outfit"] = 124] = "kFormType_Outfit";
  FormType[FormType["kFormType_Art"] = 125] = "kFormType_Art";
  FormType[FormType["kFormType_Material"] = 126] = "kFormType_Material";
  FormType[FormType["kFormType_MovementType"] = 127] = "kFormType_MovementType";
  FormType[FormType["kFormType_SoundDescriptor"] = 128] = "kFormType_SoundDescriptor";
  FormType[FormType["kFormType_DualCastData"] = 129] = "kFormType_DualCastData";
  FormType[FormType["kFormType_SoundCategory"] = 130] = "kFormType_SoundCategory";
  FormType[FormType["kFormType_SoundOutput"] = 131] = "kFormType_SoundOutput";
  FormType[FormType["kFormType_CollisionLayer"] = 132] = "kFormType_CollisionLayer";
  FormType[FormType["kFormType_ColorForm"] = 133] = "kFormType_ColorForm";
  FormType[FormType["kFormType_ReverbParam"] = 134] = "kFormType_ReverbParam";
  FormType[FormType["kFormType_LensFlare"] = 135] = "kFormType_LensFlare";
  FormType[FormType["kFormType_Unk88"] = 136] = "kFormType_Unk88";
  FormType[FormType["kFormType_VolumetricLighting"] = 137] = "kFormType_VolumetricLighting";
  FormType[FormType["kFormType_Unk8A"] = 138] = "kFormType_Unk8A";
  FormType[FormType["kFormType_Alias"] = 139] = "kFormType_Alias";
  FormType[FormType["kFormType_ReferenceAlias"] = 140] = "kFormType_ReferenceAlias";
  FormType[FormType["kFormType_LocationAlias"] = 141] = "kFormType_LocationAlias";
  FormType[FormType["kFormType_ActiveMagicEffect"] = 142] = "kFormType_ActiveMagicEffect";
  FormType[FormType["kFormType_Max"] = 137] = "kFormType_Max";
})(FormType || (exports.FormType = FormType = {}));

const formType = {
  NONE: FormType.kFormType_None,
  TES4: FormType.kFormType_TES4,
  GRUP: FormType.kFormType_Group,
  GMST: FormType.kFormType_GMST,
  KYWD: FormType.kFormType_Keyword,
  LCRT: FormType.kFormType_LocationRef,
  AACT: FormType.kFormType_Action,
  TXST: FormType.kFormType_TextureSet,
  MICN: FormType.kFormType_MenuIcon,
  GLOB: FormType.kFormType_Global,
  CLAS: FormType.kFormType_Class,
  FACT: FormType.kFormType_Faction,
  HDPT: FormType.kFormType_HeadPart,
  EYES: FormType.kFormType_Eyes,
  RACE: FormType.kFormType_Race,
  SOUN: FormType.kFormType_Sound,
  ASPC: FormType.kFormType_AcousticSpace,
  SKIL: FormType.kFormType_Skill,
  MGEF: FormType.kFormType_EffectSetting,
  SCPT: FormType.kFormType_Script,
  LTEX: FormType.kFormType_LandTexture,
  ENCH: FormType.kFormType_Enchantment,
  SPEL: FormType.kFormType_Spell,
  SCRL: FormType.kFormType_ScrollItem,
  ACTI: FormType.kFormType_Activator,
  TACT: FormType.kFormType_TalkingActivator,
  ARMO: FormType.kFormType_Armor,
  BOOK: FormType.kFormType_Book,
  CONT: FormType.kFormType_Container,
  DOOR: FormType.kFormType_Door,
  INGR: FormType.kFormType_Ingredient,
  LIGH: FormType.kFormType_Light,
  MISC: FormType.kFormType_Misc,
  APPA: FormType.kFormType_Apparatus,
  STAT: FormType.kFormType_Static,
  SCOL: FormType.kFormType_StaticCollection,
  MSTT: FormType.kFormType_MovableStatic,
  GRAS: FormType.kFormType_Grass,
  TREE: FormType.kFormType_Tree,
  FLOR: FormType.kFormType_Flora,
  FURN: FormType.kFormType_Furniture,
  WEAP: FormType.kFormType_Weapon,
  AMMO: FormType.kFormType_Ammo,
  NPC_: FormType.kFormType_NPC,
  LVLN: FormType.kFormType_LeveledCharacter,
  KEYM: FormType.kFormType_Key,
  ALCH: FormType.kFormType_Potion,
  IDLM: FormType.kFormType_IdleMarker,
  NOTE: FormType.kFormType_Note,
  COBJ: FormType.kFormType_ConstructibleObject,
  PROJ: FormType.kFormType_Projectile,
  HAZD: FormType.kFormType_Hazard,
  SLGM: FormType.kFormType_SoulGem,
  LVLI: FormType.kFormType_LeveledItem,
  WTHR: FormType.kFormType_Weather,
  CLMT: FormType.kFormType_Climate,
  SPGD: FormType.kFormType_SPGD,
  RFCT: FormType.kFormType_ReferenceEffect,
  REGN: FormType.kFormType_Region,
  NAVI: FormType.kFormType_NAVI,
  CELL: FormType.kFormType_Cell,
  REFR: FormType.kFormType_Reference,
  ACHR: FormType.kFormType_Character,
  PMIS: FormType.kFormType_Missile,
  PARW: FormType.kFormType_Arrow,
  PGRE: FormType.kFormType_Grenade,
  PBEA: FormType.kFormType_BeamProj,
  PFLA: FormType.kFormType_FlameProj,
  PCON: FormType.kFormType_ConeProj,
  PBAR: FormType.kFormType_BarrierProj,
  PHZD: FormType.kFormType_PHZD,
  WRLD: FormType.kFormType_WorldSpace,
  LAND: FormType.kFormType_Land,
  NAVM: FormType.kFormType_NAVM,
  TLOD: FormType.kFormType_TLOD,
  DIAL: FormType.kFormType_Topic,
  INFO: FormType.kFormType_TopicInfo,
  QUST: FormType.kFormType_Quest,
  IDLE: FormType.kFormType_Idle,
  PACK: FormType.kFormType_Package,
  CSTY: FormType.kFormType_CombatStyle,
  LSCR: FormType.kFormType_LoadScreen,
  LVSP: FormType.kFormType_LeveledSpell,
  ANIO: FormType.kFormType_ANIO,
  WATR: FormType.kFormType_Water,
  EFSH: FormType.kFormType_EffectShader,
  TOFT: FormType.kFormType_TOFT,
  EXPL: FormType.kFormType_Explosion,
  DEBR: FormType.kFormType_Debris,
  IMGS: FormType.kFormType_ImageSpace,
  IMAD: FormType.kFormType_ImageSpaceMod,
  FLST: FormType.kFormType_List,
  PERK: FormType.kFormType_Perk,
  BPTD: FormType.kFormType_BodyPartData,
  ADDN: FormType.kFormType_AddonNode,
  AVIF: FormType.kFormType_ActorValueInfo,
  CAMS: FormType.kFormType_CameraShot,
  CPTH: FormType.kFormType_CameraPath,
  VTYP: FormType.kFormType_VoiceType,
  MATT: FormType.kFormType_MaterialType,
  IPCT: FormType.kFormType_ImpactData,
  IPDS: FormType.kFormType_ImpactDataSet,
  ARMA: FormType.kFormType_ARMA,
  ECZN: FormType.kFormType_EncounterZone,
  LCTN: FormType.kFormType_Location,
  MESH: FormType.kFormType_Message,
  RGDL: FormType.kFormType_Ragdoll,
  DOBJ: FormType.kFormType_DOBJ,
  LGTM: FormType.kFormType_LightingTemplate,
  MUSC: FormType.kFormType_MusicType,
  FSTP: FormType.kFormType_Footstep,
  FSTS: FormType.kFormType_FootstepSet,
  SMBN: FormType.kFormType_StoryBranchNode,
  SMQN: FormType.kFormType_StoryQuestNode,
  SMEN: FormType.kFormType_StoryEventNode,
  DLBR: FormType.kFormType_DialogueBranch,
  MUST: FormType.kFormType_MusicTrack,
  DLVW: FormType.kFormType_DLVW,
  WOOP: FormType.kFormType_WordOfPower,
  SHOU: FormType.kFormType_Shout,
  EQUP: FormType.kFormType_EquipSlot,
  RELA: FormType.kFormType_Relationship,
  SCEN: FormType.kFormType_Scene,
  ASTP: FormType.kFormType_AssociationType,
  OTFT: FormType.kFormType_Outfit,
  ARTO: FormType.kFormType_Art,
  MATO: FormType.kFormType_Material,
  MOVT: FormType.kFormType_MovementType,
  SNDR: FormType.kFormType_SoundDescriptor,
  DUAL: FormType.kFormType_DualCastData,
  SNCT: FormType.kFormType_SoundCategory,
  SOPM: FormType.kFormType_SoundOutput,
  COLL: FormType.kFormType_CollisionLayer,
  CLFM: FormType.kFormType_ColorForm,
  REVB: FormType.kFormType_ReverbParam,
  BGSBaseAlias: FormType.kFormType_Alias,
  BGSRefAlias: FormType.kFormType_ReferenceAlias,
  BGSLocAlias: FormType.kFormType_LocationAlias,
  ActiveMagicEffect: FormType.kFormType_ActiveMagicEffect
};
exports.formType = formType;
},{}],"mliY":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLvlListObjects = void 0;

var _modules = require("../../modules");

let lvlLists = null;
let lvlNpcLists = null;
let cntoLists = null;

const getLvlListObjects = (mp, self) => {
  const selfId = mp.getIdFromDesc(self.desc);
  const lvlListId = getLvlListId(mp, selfId);
  checkAndLoadLists(mp);
  const lvlListArray = [];
  lvlListArray.push(...getLvlListFromBaseId(mp, selfId));
  lvlListArray.push(...getLvlListFromTemplate(mp, selfId));
  lvlListArray.push(...getLvlListFromId(mp, lvlListId));
  lvlListArray.push(...getLvlListFromId(mp, selfId));
  return lvlListArray;
};

exports.getLvlListObjects = getLvlListObjects;

const getLvlListFromId = (mp, id) => {
  if (id === 0) return [];
  const lvlListArray = [];

  if (lvlLists[id]) {
    lvlLists[id].forEach(element => {
      if (lvlLists[element.id]) {
        const itemChance = getLvlListChance(mp, element.id) / 100;
        const elementLvlList = getLvlListFromId(mp, element.id);
        if (!elementLvlList) return [];
        elementLvlList.forEach(value => {
          const chance = Math.random();

          if (chance < itemChance) {
            lvlListArray.push(value);
          }
        });
      } else {
        lvlListArray.push(element);
      }
    });
  } else if (lvlNpcLists[id]) {
    lvlNpcLists[id].forEach(element => {
      lvlListArray.push(...getLvlListFromId(mp, element.id));
    });
  } else if (!lvlLists[id] && !lvlNpcLists[id]) {
    lvlListArray.push(...getLvlListFromBaseId(mp, id));
    lvlListArray.push(...getLvlListFromTemplate(mp, id));
    if (lvlListArray === []) lvlListArray.push({
      id,
      count: 1,
      level: 1
    });

    if (cntoLists[id]) {
      cntoLists[id].forEach(value => {
        const lvlObj = {
          id: value.id,
          count: value.count,
          level: 1
        };
        lvlListArray.push(lvlObj);
      });
    }
  }

  return lvlListArray;
};

const getLvlListFromBaseId = (mp, id) => {
  var _ObjectReference$get, _ObjectReference$get$;

  const baseId = (_ObjectReference$get = _modules.ObjectReference.get(id)) === null || _ObjectReference$get === void 0 ? void 0 : (_ObjectReference$get$ = _ObjectReference$get.getBaseObject()) === null || _ObjectReference$get$ === void 0 ? void 0 : _ObjectReference$get$.getFormID();
  if (!baseId) return [];
  const lvlListId = getLvlListId(mp, baseId);
  const lvlList = [];
  lvlList.push(...getLvlListFromId(mp, baseId));
  lvlList.push(...getLvlListFromId(mp, lvlListId));
  return lvlList;
};

const getLvlListFromTemplate = (mp, id) => {
  if (id === 0) return [];
  const templateId = getTemplate(mp, id);
  const lvlListArray = [];

  if (lvlNpcLists[templateId]) {
    lvlNpcLists[templateId].forEach(value => {
      lvlListArray.push(...getLvlListFromId(mp, getLvlListId(mp, value.id)));
    });
  }

  const lvlListId = getLvlListId(mp, templateId);
  lvlListArray.push(...getLvlListFromId(mp, templateId));
  lvlListArray.push(...getLvlListFromId(mp, lvlListId));
  return lvlListArray !== null && lvlListArray !== void 0 ? lvlListArray : [];
};

const getTemplate = (mp, id) => {
  var _espmRecord$record, _espmRecord$record$fi;

  const object = {
    type: 'form',
    desc: mp.getDescFromId(id)
  };
  const espmRecord = mp.lookupEspmRecordById(mp.getIdFromDesc(object.desc));
  const tplt = (_espmRecord$record = espmRecord.record) === null || _espmRecord$record === void 0 ? void 0 : (_espmRecord$record$fi = _espmRecord$record.fields.find(x => x.type === 'TPLT')) === null || _espmRecord$record$fi === void 0 ? void 0 : _espmRecord$record$fi.data;

  if (tplt) {
    const dataView = new DataView(tplt.buffer);
    const templateId = dataView.getUint32(0, true);
    return templateId;
  }

  return 0;
};

const getLvlListId = (mp, id) => {
  var _espmRecord$record2, _espmRecord$record2$f;

  const espmRecord = mp.lookupEspmRecordById(id);
  const inam = (_espmRecord$record2 = espmRecord.record) === null || _espmRecord$record2 === void 0 ? void 0 : (_espmRecord$record2$f = _espmRecord$record2.fields.find(x => x.type === 'INAM')) === null || _espmRecord$record2$f === void 0 ? void 0 : _espmRecord$record2$f.data;

  if (inam) {
    const dataView = new DataView(inam.buffer);
    const lvlListId = dataView.getUint32(0, true);
    return lvlListId;
  }

  return 0;
};

const getLvlListChance = (mp, id) => {
  var _espmRecord$record3, _espmRecord$record3$f;

  const espmRecord = mp.lookupEspmRecordById(id);
  const lvld = (_espmRecord$record3 = espmRecord.record) === null || _espmRecord$record3 === void 0 ? void 0 : (_espmRecord$record3$f = _espmRecord$record3.fields.find(x => x.type === 'LVLD')) === null || _espmRecord$record3$f === void 0 ? void 0 : _espmRecord$record3$f.data;

  if (lvld) {
    const dataView = new DataView(lvld.buffer);
    const chance = dataView.getUint8(0);
    return chance === 0 ? 100 / lvlLists[id].length : chance / lvlLists[id].length;
  }

  return 0;
};

const checkAndLoadLists = mp => {
  if (!lvlLists) {
    lvlLists = JSON.parse(mp.readDataFile('xelib/lvl-list.json'));
  }

  if (!lvlNpcLists) {
    lvlNpcLists = JSON.parse(mp.readDataFile('xelib/lvl-npc-list.json'));
  }

  if (!cntoLists) {
    cntoLists = JSON.parse(mp.readDataFile('xelib/cnto-npc_.json'));
  }
};
},{"../../modules":"uozv"}],"mnzc":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.register = exports.getWeightById = exports.getWeight = exports.getSelfId = exports.getName = exports.getEditorIdById = exports.getEditorId = exports.getDescription = exports._getEditorId = void 0;

var _ = require("../../..");

var _helper = require("../../utils/helper");

var _papyrusArgs = require("../../utils/papyrusArgs");

var _keywords = require("./keywords");

var _type = require("./type");

var _lvlList = require("./lvl-list");

const getSelfId = (mp, desc) => {
  const selfId = mp.getIdFromDesc(desc);

  if (selfId >= 0xff000000) {
    return mp.getIdFromDesc(mp.get(selfId, 'baseDesc'));
  }

  return selfId;
};

exports.getSelfId = getSelfId;

const getFormID = (mp, self) => mp.getIdFromDesc(self.desc);

const getName = (strings, mp, self) => {
  var _espmRecord$record, _espmRecord$record$fi, _espmRecord$record2, _espmRecord$record2$f;

  const selfId = getSelfId(mp, self.desc);
  const espmRecord = mp.lookupEspmRecordById(selfId);
  const full = (_espmRecord$record = espmRecord.record) === null || _espmRecord$record === void 0 ? void 0 : (_espmRecord$record$fi = _espmRecord$record.fields.find(x => x.type === 'FULL')) === null || _espmRecord$record$fi === void 0 ? void 0 : _espmRecord$record$fi.data;
  const tplt = (_espmRecord$record2 = espmRecord.record) === null || _espmRecord$record2 === void 0 ? void 0 : (_espmRecord$record2$f = _espmRecord$record2.fields.find(x => x.type === 'TPLT')) === null || _espmRecord$record2$f === void 0 ? void 0 : _espmRecord$record2$f.data;
  if (!full && !tplt) return 'NOT_FOUND';
  if (!full && tplt) return getName(strings, mp, {
    type: 'form',
    desc: mp.getDescFromId((0, _helper.uint32)(tplt.buffer, 0))
  });
  if (full && full.length > 4) return new TextDecoder().decode(full);

  if (full && self.desc) {
    var _strings$getText;

    const espName = self.desc.split(':')[1].split('.')[0].toLowerCase();
    const index = (0, _helper.uint32)(full.buffer, 0);
    return (_strings$getText = strings.getText(espName, index)) !== null && _strings$getText !== void 0 ? _strings$getText : '';
  }

  return 'NOT_FOUND';
};

exports.getName = getName;

const getNameEx = (strings, mp, selfNull, args) => {
  const self = (0, _papyrusArgs.getObject)(args, 0);
  return getName(strings, mp, self);
};

const getDescription = (strings, mp, selfNull, args) => {
  var _espmRecord$record3, _espmRecord$record3$f;

  const self = (0, _papyrusArgs.getObject)(args, 0);
  const selfId = getSelfId(mp, self.desc);
  const espName = self.desc.split(':')[1].split('.')[0].toLowerCase();
  const espmRecord = mp.lookupEspmRecordById(selfId);
  const desc = (_espmRecord$record3 = espmRecord.record) === null || _espmRecord$record3 === void 0 ? void 0 : (_espmRecord$record3$f = _espmRecord$record3.fields.find(x => x.type === 'DESC')) === null || _espmRecord$record3$f === void 0 ? void 0 : _espmRecord$record3$f.data;

  if (desc) {
    var _strings$getText2;

    const dataView = new DataView(desc.buffer);
    const index = dataView.getUint32(0, true);

    if (desc.length > 4) {
      return new TextDecoder().decode(desc);
    }

    return (_strings$getText2 = strings.getText(espName, index)) !== null && _strings$getText2 !== void 0 ? _strings$getText2 : '';
  }

  return '';
};

exports.getDescription = getDescription;

const _getEditorId = (mp, selfId) => {
  var _rec$fields$find;

  const espmRecord = mp.lookupEspmRecordById(selfId);
  const rec = espmRecord.record;
  if (!rec) return '';
  const name = (_rec$fields$find = rec.fields.find(x => x.type === 'NAME')) === null || _rec$fields$find === void 0 ? void 0 : _rec$fields$find.data;
  if (!name) return rec.editorId;
  const dataView = new DataView(name.buffer);
  const baseId = dataView.getUint32(0, true);
  const recBase = mp.lookupEspmRecordById(baseId).record;
  if (!recBase) return '';
  return recBase.editorId;
};

exports._getEditorId = _getEditorId;

const getEditorId = (mp, self, args) => _getEditorId(mp, getSelfId(mp, (0, _papyrusArgs.getObject)(args, 0).desc));

exports.getEditorId = getEditorId;

const getEditorIdById = (mp, self, args) => _getEditorId(mp, (0, _papyrusArgs.getNumber)(args, 0));

exports.getEditorIdById = getEditorIdById;

const getGoldValue = (mp, self) => {
  var _recordData$record, _recordData$record$fi;

  const selfId = getSelfId(mp, self.desc);
  const recordData = mp.lookupEspmRecordById(selfId);
  const data = (_recordData$record = recordData.record) === null || _recordData$record === void 0 ? void 0 : (_recordData$record$fi = _recordData$record.fields.find(x => x.type === 'DATA')) === null || _recordData$record$fi === void 0 ? void 0 : _recordData$record$fi.data;
  if (!data) return -1;
  const dataView = new DataView(data.buffer);
  return dataView.getUint32(0, true);
};

const getWeightById = (mp, selfId) => {
  var _recordData$record2, _recordData$record4, _recordData$record4$f;

  const recordData = mp.lookupEspmRecordById(selfId);

  if (((_recordData$record2 = recordData.record) === null || _recordData$record2 === void 0 ? void 0 : _recordData$record2.type) === 'NPC_') {
    var _recordData$record3, _recordData$record3$f;

    const nam7 = (_recordData$record3 = recordData.record) === null || _recordData$record3 === void 0 ? void 0 : (_recordData$record3$f = _recordData$record3.fields.find(x => x.type === 'NAM7')) === null || _recordData$record3$f === void 0 ? void 0 : _recordData$record3$f.data;
    if (!nam7) return 0;
    return (0, _helper.float32)(nam7.buffer);
  }

  const data = (_recordData$record4 = recordData.record) === null || _recordData$record4 === void 0 ? void 0 : (_recordData$record4$f = _recordData$record4.fields.find(x => x.type === 'DATA')) === null || _recordData$record4$f === void 0 ? void 0 : _recordData$record4$f.data;
  if (!data) return 0;
  return (0, _helper.float32)(data.buffer, 4);
};

exports.getWeightById = getWeightById;

const getWeight = (mp, self) => {
  const selfId = getSelfId(mp, self.desc);
  return getWeightById(mp, selfId);
};

exports.getWeight = getWeight;

const getType = (mp, self) => {
  var _data$record, _data$record2, _data$record3;

  const selfId = getSelfId(mp, self.desc);
  const data = mp.lookupEspmRecordById(selfId);
  return (_data$record = data.record) !== null && _data$record !== void 0 && _data$record.type && _type.formType[(_data$record2 = data.record) === null || _data$record2 === void 0 ? void 0 : _data$record2.type] ? _type.formType[(_data$record3 = data.record) === null || _data$record3 === void 0 ? void 0 : _data$record3.type] : 0;
};

const _getSignature = (mp, selfId) => {
  var _espmRecord$record$ty, _espmRecord$record4;

  const espmRecord = mp.lookupEspmRecordById(selfId);
  return (_espmRecord$record$ty = (_espmRecord$record4 = espmRecord.record) === null || _espmRecord$record4 === void 0 ? void 0 : _espmRecord$record4.type) !== null && _espmRecord$record$ty !== void 0 ? _espmRecord$record$ty : '';
};

const getSignature = (mp, self) => _getSignature(mp, getSelfId(mp, self.desc));

const getSignatureEx = (mp, self, args) => _getSignature(mp, (0, _papyrusArgs.getNumber)(args, 0));

const _equalSignature = (mp, selfId, type) => {
  var _espmRecord$record5;

  const espmRecord = mp.lookupEspmRecordById(selfId);
  if (((_espmRecord$record5 = espmRecord.record) === null || _espmRecord$record5 === void 0 ? void 0 : _espmRecord$record5.type) === type) return true;
  return false;
};

const equalSignature = (mp, self, args) => _equalSignature(mp, getSelfId(mp, self.desc), (0, _papyrusArgs.getString)(args, 0));

const equalSignatureEx = (mp, self, args) => _equalSignature(mp, (0, _papyrusArgs.getNumber)(args, 0), (0, _papyrusArgs.getString)(args, 1));

const register = (mp, strings) => {
  mp.registerPapyrusFunction('method', 'Form', 'GetFormID', self => getFormID(mp, self));
  mp.registerPapyrusFunction('method', 'Form', 'GetName', self => getName(strings, mp, self));
  mp.registerPapyrusFunction('method', 'Form', 'GetType', self => getType(mp, self));
  mp.registerPapyrusFunction('method', 'Form', 'GetGoldValue', self => getGoldValue(mp, self));
  mp.registerPapyrusFunction('method', 'Form', 'GetWeight', self => getWeight(mp, self));
  mp.registerPapyrusFunction('method', 'Form', 'GetKeywords', self => (0, _keywords.getKeywords)(mp, self));
  mp.registerPapyrusFunction('method', 'Form', 'GetNumKeywords', self => (0, _keywords.getNumKeywords)(mp, self));
  mp.registerPapyrusFunction('method', 'Form', 'GetNthKeyword', (self, args) => (0, _keywords.getNthKeyword)(mp, self, args));
  mp.registerPapyrusFunction('method', 'Form', 'HasKeyword', (self, args) => (0, _keywords.hasKeyword)(mp, self, args));
  mp.registerPapyrusFunction('method', 'Form', 'GetSignature', self => getSignature(mp, self));
  mp.registerPapyrusFunction('method', 'Form', 'EqualSignature', (self, args) => equalSignature(mp, self, args));
  mp.registerPapyrusFunction('global', 'FormEx', 'GetName', (self, args) => getNameEx(strings, mp, self, args));
  mp.registerPapyrusFunction('global', 'FormEx', 'GetEditorID', (self, args) => getEditorId(mp, self, args));
  mp.registerPapyrusFunction('global', 'FormEx', 'GetDescription', (self, args) => getDescription(strings, mp, self, args));
  mp.registerPapyrusFunction('global', 'FormEx', 'HasKeyword', (self, args) => (0, _keywords.hasKeywordEx)(mp, self, args));
  mp.registerPapyrusFunction('global', 'FormEx', 'GetSignature', (self, args) => getSignatureEx(mp, self, args));
  mp.registerPapyrusFunction('global', 'FormEx', 'EqualSignature', (self, args) => equalSignatureEx(mp, self, args));

  _.IForm.GetFormID = self => getFormID(mp, self);

  _.IForm.GetName = self => getName(strings, mp, self);

  _.IForm.GetType = self => getType(mp, self);

  _.IForm.GetGoldValue = self => getGoldValue(mp, self);

  _.IForm.GetWeight = self => getWeight(mp, self);

  _.IForm.GetKeywords = self => (0, _keywords.getKeywords)(mp, self);

  _.IForm.GetNumKeywords = self => (0, _keywords.getNumKeywords)(mp, self);

  _.IForm.GetNthKeyword = (self, args) => (0, _keywords.getNthKeyword)(mp, self, args);

  _.IForm.HasKeyword = (self, args) => (0, _keywords.hasKeyword)(mp, self, args);

  _.IForm.GetEditorID = self => getEditorId(mp, null, [self]);

  _.IForm.GetDescription = self => getDescription(strings, mp, null, [self]);

  _.IForm.GetSignature = self => getSignature(mp, self);

  _.IForm.EqualSignature = (self, args) => equalSignature(mp, self, args);

  _.IForm.GetLvlListObjects = self => (0, _lvlList.getLvlListObjects)(mp, self);
};

exports.register = register;
},{"../../..":"QCba","../../utils/helper":"FxH1","../../utils/papyrusArgs":"oZY1","./keywords":"D1sz","./type":"CIMu","./lvl-list":"mliY"}],"Xpf2":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WeaponType = exports.WeaponLocation = void 0;
var WeaponType;
exports.WeaponType = WeaponType;

(function (WeaponType) {
  WeaponType[WeaponType["Fists"] = 0] = "Fists";
  WeaponType[WeaponType["Swords"] = 1] = "Swords";
  WeaponType[WeaponType["Daggers"] = 2] = "Daggers";
  WeaponType[WeaponType["WarAxes"] = 3] = "WarAxes";
  WeaponType[WeaponType["Maces"] = 4] = "Maces";
  WeaponType[WeaponType["Greatswords"] = 5] = "Greatswords";
  WeaponType[WeaponType["BattleaxesANDWarhammers"] = 6] = "BattleaxesANDWarhammers";
  WeaponType[WeaponType["Bows"] = 7] = "Bows";
  WeaponType[WeaponType["Staff"] = 8] = "Staff";
  WeaponType[WeaponType["Crossbows"] = 9] = "Crossbows";
})(WeaponType || (exports.WeaponType = WeaponType = {}));

var WeaponLocation;
exports.WeaponLocation = WeaponLocation;

(function (WeaponLocation) {
  WeaponLocation[WeaponLocation["LeftHand"] = 0] = "LeftHand";
  WeaponLocation[WeaponLocation["RightHand"] = 1] = "RightHand";
})(WeaponLocation || (exports.WeaponLocation = WeaponLocation = {}));
},{}],"TCaz":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.register = exports.getWeaponTypeById = exports.getWeaponType = exports.getLocationById = exports.getBaseDamageById = exports.getBaseDamage = void 0;

var _ = require("../../..");

var _helper = require("../../utils/helper");

var _type = require("./type");

const getWeaponTypeById = (mp, selfId, espmRecord) => {
  var _espmRecord$record, _espmRecord$record$fi;

  if (!espmRecord) espmRecord = mp.lookupEspmRecordById(selfId);
  const kwda = (_espmRecord$record = espmRecord.record) === null || _espmRecord$record === void 0 ? void 0 : (_espmRecord$record$fi = _espmRecord$record.fields.find(x => x.type === 'KWDA')) === null || _espmRecord$record$fi === void 0 ? void 0 : _espmRecord$record$fi.data;
  const keywords = [];
  if (!kwda) return _type.WeaponType.Fists;
  const dataView = new DataView(kwda.buffer);

  for (let i = 0; i < dataView.byteLength; i += 4) {
    keywords.push(dataView.getUint32(i, true));
  }

  if (keywords.includes(0x1e711)) {
    return _type.WeaponType.Swords;
  }

  if (keywords.includes(0x6d931)) {
    return _type.WeaponType.Greatswords;
  }

  if (keywords.includes(0x1e713)) {
    return _type.WeaponType.Daggers;
  }

  if (keywords.includes(0x6d932) || keywords.includes(0x6d930)) {
    return _type.WeaponType.BattleaxesANDWarhammers;
  }

  if (keywords.includes(0x1e714)) {
    return _type.WeaponType.Maces;
  }

  if (keywords.includes(0x1e712)) {
    return _type.WeaponType.WarAxes;
  }

  if (keywords.includes(0x1e715)) {
    return _type.WeaponType.Bows;
  }

  if (keywords.includes(0x1e716)) {
    return _type.WeaponType.Staff;
  }

  if (keywords.includes(-1)) {
    return _type.WeaponType.Crossbows;
  }
};

exports.getWeaponTypeById = getWeaponTypeById;

const getWeaponType = (mp, self) => {
  const selfId = mp.getIdFromDesc(self.desc);
  return getWeaponTypeById(mp, selfId);
};

exports.getWeaponType = getWeaponType;

const getBaseDamageById = (mp, selfId, espmRecord) => {
  var _espmRecord$record2, _espmRecord$record2$f;

  if (!espmRecord) espmRecord = mp.lookupEspmRecordById(selfId);
  const data = (_espmRecord$record2 = espmRecord.record) === null || _espmRecord$record2 === void 0 ? void 0 : (_espmRecord$record2$f = _espmRecord$record2.fields.find(x => x.type === 'DATA')) === null || _espmRecord$record2$f === void 0 ? void 0 : _espmRecord$record2$f.data;
  if (!data) return 0;
  const damage = (0, _helper.uint16)(data.buffer, 8);
  return damage;
};

exports.getBaseDamageById = getBaseDamageById;

const getBaseDamage = (mp, self) => {
  const selfId = mp.getIdFromDesc(self.desc);
  return getBaseDamageById(mp, selfId);
};

exports.getBaseDamage = getBaseDamage;

const getLocationById = (mp, selfId, espmRecord) => {
  var _espmRecord$record3, _espmRecord$record3$f, _etypeId$record;

  if (!espmRecord) espmRecord = mp.lookupEspmRecordById(selfId);
  const etype = (_espmRecord$record3 = espmRecord.record) === null || _espmRecord$record3 === void 0 ? void 0 : (_espmRecord$record3$f = _espmRecord$record3.fields.find(x => x.type === 'ETYP')) === null || _espmRecord$record3$f === void 0 ? void 0 : _espmRecord$record3$f.data;
  if (!etype) return _type.WeaponLocation.RightHand;
  const etypeId = mp.lookupEspmRecordById((0, _helper.uint32)(etype.buffer, 0));
  if (!etypeId) return _type.WeaponLocation.RightHand;
  const edidEquipSlot = (_etypeId$record = etypeId.record) === null || _etypeId$record === void 0 ? void 0 : _etypeId$record.editorId;
  if (edidEquipSlot === 'LeftHand') return _type.WeaponLocation.LeftHand;
  return _type.WeaponLocation.RightHand;
};

exports.getLocationById = getLocationById;

const register = mp => {
  mp.registerPapyrusFunction('method', 'Weapon', 'GetWeaponType', self => getWeaponType(mp, self));
  mp.registerPapyrusFunction('method', 'Weapon', 'GetBaseDamage', self => getBaseDamage(mp, self));

  _.IWeapon.GetWeaponType = self => getWeaponType(mp, self);

  _.IWeapon.GetBaseDamage = self => getBaseDamage(mp, self);
};

exports.register = register;
},{"../../..":"QCba","../../utils/helper":"FxH1","./type":"Xpf2"}],"lP44":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.unequipItemSlot = exports.unequipItemEx = exports.unequipItem = exports.unequipAll = exports.isEquipped = exports.getWornFormsId = exports.getWornForms = exports.getEquippedWeapon = exports.getEquippedShield = exports.getEquippedObject = exports.getEquippedItemType = exports.getEquippedArmorInSlot = exports.getEquipment = exports.equipItemEx = exports.equipItem = exports._getWornForms = void 0;

var _eval = require("../../properties/eval");

var _functionInfo = require("../../utils/functionInfo");

var _papyrusArgs = require("../../utils/papyrusArgs");

var _armor = require("../armor");

var _form = require("../form");

var _game = require("../game");

var _weapon = require("../weapon");

const getEquipment = (mp, selfId, opt = {
  mapARMO: true,
  mapWEAP: true
}) => {
  if (opt.mapWEAP === undefined) opt.mapWEAP = true;
  if (opt.mapARMO === undefined) opt.mapARMO = true;
  const eq = mp.get(selfId, 'equipment');
  if (!eq) return;
  if (!opt.mapWEAP && !opt.mapARMO) return eq;
  eq.inv.entries = eq.inv.entries.filter(x => x.worn).map(x => {
    const rec = mp.lookupEspmRecordById(x.baseId);
    if (!rec.record) return x;
    x.type = rec.record.type;
    x.weight = (0, _form.getWeightById)(mp, x.baseId);

    switch (true) {
      case rec.record.type === 'WEAP' && opt.mapWEAP:
        x.location = (0, _weapon.getLocationById)(mp, x.baseId, rec);
        x.baseDamage = (0, _weapon.getBaseDamageById)(mp, x.baseId, rec);
        x.weaponType = (0, _weapon.getWeaponTypeById)(mp, x.baseId, rec);
        break;

      case rec.record.type === 'ARMO' && opt.mapARMO:
        x.baseArmor = (0, _armor.getBaseArmorById)(mp, x.baseId, rec);
        x.slot = (0, _armor.getSlotById)(mp, x.baseId, rec);
        break;

      default:
        break;
    }

    return x;
  });
  return eq;
};

exports.getEquipment = getEquipment;

const equipItem = (mp, self, args) => {
  const selfId = mp.getIdFromDesc(self.desc);
  const item = (0, _papyrusArgs.getObject)(args, 0);
  const itemId = mp.getIdFromDesc(item.desc);
  const preventRemoval = (0, _papyrusArgs.getBoolean)(args, 1);
  const silent = (0, _papyrusArgs.getBoolean)(args, 2);
  const countExist = mp.callPapyrusFunction('method', 'ObjectReference', 'GetItemCount', self, [item]);

  if (countExist === 0) {
    mp.callPapyrusFunction('method', 'ObjectReference', 'AddItem', self, [item, 1, true]);
  }

  const func = (ctx, itemId, preventRemoval, silent) => {
    (() => {
      if (!ctx.refr) return;
      const ac = ctx.sp.Actor.from(ctx.refr);
      const form = ctx.sp.Game.getFormEx(itemId);
      ac === null || ac === void 0 ? void 0 : ac.equipItem(form, preventRemoval, silent);
    })();
  };

  (0, _eval.evalClient)(mp, selfId, new _functionInfo.FunctionInfo(func).getText({
    itemId,
    preventRemoval,
    silent
  }));

  if (!silent) {}
};

exports.equipItem = equipItem;

const equipItemEx = (mp, self, args) => {
  const selfId = mp.getIdFromDesc(self.desc);
  const item = (0, _papyrusArgs.getObject)(args, 0);
  const itemId = mp.getIdFromDesc(item.desc);
  const slot = args[1] ? (0, _papyrusArgs.getNumber)(args, 1) : 0;
  const preventUnequip = args[2] ? (0, _papyrusArgs.getBoolean)(args, 2) : false;
  const equipSound = args[3] ? (0, _papyrusArgs.getBoolean)(args, 3) : true;

  const func = (ctx, itemId, slot, preventUnequip, equipSound) => {
    ctx.sp.once('update', () => {
      if (!ctx.refr) return;
      const ac = ctx.sp.Actor.from(ctx.refr);
      const form = ctx.sp.Game.getFormEx(itemId);
      ac === null || ac === void 0 ? void 0 : ac.equipItemEx(form, slot, preventUnequip, equipSound);
    });
  };

  (0, _eval.evalClient)(mp, selfId, new _functionInfo.FunctionInfo(func).getText({
    itemId,
    slot,
    preventUnequip,
    equipSound
  }));

  if (!equipSound) {}
};

exports.equipItemEx = equipItemEx;

const isEquipped = (mp, self, args) => {
  const selfId = mp.getIdFromDesc(self.desc);
  const item = (0, _papyrusArgs.getObject)(args, 0);
  const itemId = mp.getIdFromDesc(item.desc);
  const eq = getEquipment(mp, selfId);
  if (!eq) return false;
  return eq.inv.entries.findIndex(item => item.baseId === itemId && item.worn) >= 0;
};

exports.isEquipped = isEquipped;

const unequipItem = (mp, self, args) => {
  const selfId = mp.getIdFromDesc(self.desc);
  const item = (0, _papyrusArgs.getObject)(args, 0);
  const itemId = mp.getIdFromDesc(item.desc);
  const preventRemoval = args[1] ? (0, _papyrusArgs.getBoolean)(args, 1) : false;
  const silent = args[2] ? (0, _papyrusArgs.getBoolean)(args, 2) : false;

  const func = (ctx, itemId, preventRemoval, silent) => {
    ctx.sp.once('update', () => {
      if (!ctx.refr) return;
      const ac = ctx.sp.Actor.from(ctx.refr);
      const form = ctx.sp.Game.getFormEx(itemId);
      ac === null || ac === void 0 ? void 0 : ac.unequipItem(form, preventRemoval, silent);
    });
  };

  (0, _eval.evalClient)(mp, selfId, new _functionInfo.FunctionInfo(func).getText({
    itemId,
    preventRemoval,
    silent
  }));

  if (!silent) {}
};

exports.unequipItem = unequipItem;

const unequipItemEx = (mp, self, args) => {
  const selfId = mp.getIdFromDesc(self.desc);
  const item = (0, _papyrusArgs.getObject)(args, 0);
  const itemId = mp.getIdFromDesc(item.desc);
  const slot = args[1] ? (0, _papyrusArgs.getNumber)(args, 1) : 0;
  const preventEquip = args[2] ? (0, _papyrusArgs.getBoolean)(args, 2) : false;

  const func = (ctx, itemId, slot, preventEquip) => {
    ctx.sp.once('update', () => {
      if (!ctx.refr) return;
      const ac = ctx.sp.Actor.from(ctx.refr);
      const form = ctx.sp.Game.getFormEx(itemId);
      ac === null || ac === void 0 ? void 0 : ac.unequipItemEx(form, slot, preventEquip);
    });
  };

  (0, _eval.evalClient)(mp, selfId, new _functionInfo.FunctionInfo(func).getText({
    itemId,
    slot,
    preventEquip
  }));
};

exports.unequipItemEx = unequipItemEx;

const unequipAll = (mp, self) => {
  const selfId = mp.getIdFromDesc(self.desc);

  const func = ctx => {
    ctx.sp.once('update', () => {
      if (!ctx.refr) return;
      const ac = ctx.sp.Actor.from(ctx.refr);
      ac === null || ac === void 0 ? void 0 : ac.unequipAll();
    });
  };

  (0, _eval.evalClient)(mp, selfId, new _functionInfo.FunctionInfo(func).getText());
};

exports.unequipAll = unequipAll;

const unequipItemSlot = (mp, self, args) => {
  const selfId = mp.getIdFromDesc(self.desc);
  const slotId = (0, _papyrusArgs.getNumber)(args, 0);

  const func = (ctx, slotId) => {
    ctx.sp.once('update', () => {
      if (!ctx.refr) return;
      const ac = ctx.sp.Actor.from(ctx.refr);
      ac === null || ac === void 0 ? void 0 : ac.unequipItemSlot(slotId);
    });
  };

  (0, _eval.evalClient)(mp, selfId, new _functionInfo.FunctionInfo(func).getText({
    slotId
  }));
};

exports.unequipItemSlot = unequipItemSlot;

const getEquippedItemType = (mp, self, args) => {
  const selfId = mp.getIdFromDesc(self.desc);
  const hand = (0, _papyrusArgs.getNumber)(args, 0);
};

exports.getEquippedItemType = getEquippedItemType;

const _getWornForms = (mp, self) => {
  const selfId = mp.getIdFromDesc(self.desc);
  const eq = getEquipment(mp, selfId);
  return eq === null || eq === void 0 ? void 0 : eq.inv.entries.filter(x => x.worn).map(x => (0, _game.getForm)(mp, null, [x.baseId])).filter(x => x);
};

exports._getWornForms = _getWornForms;

const getWornForms = (mp, selfNull, args) => {
  const self = (0, _papyrusArgs.getObject)(args, 0);
  return _getWornForms(mp, self);
};

exports.getWornForms = getWornForms;

const getWornFormsId = (mp, selfNull, args) => {
  const selfId = mp.getIdFromDesc((0, _papyrusArgs.getObject)(args, 0).desc);
  const eq = getEquipment(mp, selfId);
  return eq === null || eq === void 0 ? void 0 : eq.inv.entries.filter(x => x.worn).map(x => x.baseId);
};

exports.getWornFormsId = getWornFormsId;

const getEquippedObject = (mp, self, args) => {
  var _eq$inv$entries$find;

  const selfId = mp.getIdFromDesc(self.desc);
  const loc = (0, _papyrusArgs.getNumber)(args, 0);
  const eq = getEquipment(mp, selfId, {
    mapARMO: false
  });
  const baseId = eq === null || eq === void 0 ? void 0 : (_eq$inv$entries$find = eq.inv.entries.find(x => x.location === loc)) === null || _eq$inv$entries$find === void 0 ? void 0 : _eq$inv$entries$find.baseId;
  if (baseId) return (0, _game.getForm)(mp, null, [baseId]);
};

exports.getEquippedObject = getEquippedObject;

const getEquippedArmorInSlot = (mp, self, args) => {
  var _eq$inv$entries$find2;

  const selfId = mp.getIdFromDesc(self.desc);
  const slot = (0, _papyrusArgs.getNumber)(args, 0);
  const eq = getEquipment(mp, selfId, {
    mapWEAP: false
  });
  const baseId = eq === null || eq === void 0 ? void 0 : (_eq$inv$entries$find2 = eq.inv.entries.find(x => {
    var _x$slot;

    return (_x$slot = x.slot) === null || _x$slot === void 0 ? void 0 : _x$slot.includes(slot);
  })) === null || _eq$inv$entries$find2 === void 0 ? void 0 : _eq$inv$entries$find2.baseId;
  if (baseId) return (0, _game.getForm)(mp, null, [baseId]);
};

exports.getEquippedArmorInSlot = getEquippedArmorInSlot;

const getEquippedShield = (mp, self) => {
  var _eq$inv$entries$find3;

  const selfId = mp.getIdFromDesc(self.desc);
  const eq = getEquipment(mp, selfId, {
    mapWEAP: false
  });
  const baseId = eq === null || eq === void 0 ? void 0 : (_eq$inv$entries$find3 = eq.inv.entries.find(x => {
    var _x$slot2;

    return (_x$slot2 = x.slot) === null || _x$slot2 === void 0 ? void 0 : _x$slot2.includes(39);
  })) === null || _eq$inv$entries$find3 === void 0 ? void 0 : _eq$inv$entries$find3.baseId;
  if (baseId) return (0, _game.getForm)(mp, null, [baseId]);
};

exports.getEquippedShield = getEquippedShield;

const getEquippedWeapon = (mp, self, args) => {
  var _eq$inv$entries$find4;

  const selfId = mp.getIdFromDesc(self.desc);
  const isLeftHand = (0, _papyrusArgs.getBoolean)(args, 0);
  const loc = isLeftHand ? 0 : 1;
  const eq = getEquipment(mp, selfId, {
    mapARMO: false
  });
  const baseId = eq === null || eq === void 0 ? void 0 : (_eq$inv$entries$find4 = eq.inv.entries.find(x => x.location === loc)) === null || _eq$inv$entries$find4 === void 0 ? void 0 : _eq$inv$entries$find4.baseId;
  if (baseId) return (0, _game.getForm)(mp, null, [baseId]);
};

exports.getEquippedWeapon = getEquippedWeapon;
},{"../../properties/eval":"mJTA","../../utils/functionInfo":"fC7F","../../utils/papyrusArgs":"oZY1","../armor":"WNhg","../form":"mnzc","../game":"WCBi","../weapon":"TCaz"}],"AkNH":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.raceDefaultAttr = exports.getRaceUnarmedDamage = exports.getRaceStaminaRate = exports.getRaceStamina = exports.getRaceMagickaRate = exports.getRaceMagicka = exports.getRaceId = exports.getRaceHealth = exports.getRaceHealRate = exports.getAttr = void 0;

var _helper = require("../utils/helper");

const raceDefaultAttr = {
  health: 100,
  healrate: 0,
  magicka: 100,
  magickarate: 100,
  stamina: 100,
  staminarate: 100
};
exports.raceDefaultAttr = raceDefaultAttr;

const getRaceId = (mp, pcFormId, rec) => {
  var _rec$fields$find;

  if (pcFormId >= 0xff000000) {
    try {
      var _appearance$raceId;

      const appearance = mp.get(pcFormId, 'appearance');
      return (_appearance$raceId = appearance === null || appearance === void 0 ? void 0 : appearance.raceId) !== null && _appearance$raceId !== void 0 ? _appearance$raceId : 0;
    } catch (error) {}
  }

  const rnam = (_rec$fields$find = rec.fields.find(x => x.type === 'RNAM')) === null || _rec$fields$find === void 0 ? void 0 : _rec$fields$find.data;
  if (!rnam) return 0;
  return (0, _helper.uint32)(rnam.buffer, 0);
};

exports.getRaceId = getRaceId;

const getRaceFloat32DataValue = (espmRecord, offset) => {
  var _espmRecord$record, _espmRecord$record$fi;

  const raceData = (_espmRecord$record = espmRecord.record) === null || _espmRecord$record === void 0 ? void 0 : (_espmRecord$record$fi = _espmRecord$record.fields.find(x => x.type === 'DATA')) === null || _espmRecord$record$fi === void 0 ? void 0 : _espmRecord$record$fi.data;
  if (!raceData) return;
  return (0, _helper.float32)(raceData.buffer, offset);
};

const getRaceUnarmedDamage = espmRecord => getRaceFloat32DataValue(espmRecord, 96);

exports.getRaceUnarmedDamage = getRaceUnarmedDamage;

const getRaceHealth = espmRecord => getRaceFloat32DataValue(espmRecord, 36);

exports.getRaceHealth = getRaceHealth;

const getRaceHealRate = espmRecord => getRaceFloat32DataValue(espmRecord, 84);

exports.getRaceHealRate = getRaceHealRate;

const getRaceMagicka = espmRecord => getRaceFloat32DataValue(espmRecord, 40);

exports.getRaceMagicka = getRaceMagicka;

const getRaceMagickaRate = espmRecord => getRaceFloat32DataValue(espmRecord, 88);

exports.getRaceMagickaRate = getRaceMagickaRate;

const getRaceStamina = espmRecord => getRaceFloat32DataValue(espmRecord, 44);

exports.getRaceStamina = getRaceStamina;

const getRaceStaminaRate = espmRecord => getRaceFloat32DataValue(espmRecord, 92);

exports.getRaceStaminaRate = getRaceStaminaRate;

const getAttr = (mp, pcFormId) => {
  var _rec$fields$find2, _getRaceHealth, _getRaceHealRate, _getRaceMagicka, _getRaceMagickaRate, _getRaceStamina, _getRaceStaminaRate;

  const selfId = mp.getIdFromDesc(mp.get(pcFormId, 'baseDesc'));
  const rec = mp.lookupEspmRecordById(selfId).record;
  if (!rec) return raceDefaultAttr;
  const acbs = (_rec$fields$find2 = rec.fields.find(x => x.type === 'ACBS')) === null || _rec$fields$find2 === void 0 ? void 0 : _rec$fields$find2.data;
  const magickaOffset = acbs ? (0, _helper.uint16)(acbs.buffer, 4) : 0;
  const staminaOffset = acbs ? (0, _helper.uint16)(acbs.buffer, 6) : 0;
  const healthOffset = acbs ? (0, _helper.uint16)(acbs.buffer, 20) : 0;
  const raceId = getRaceId(mp, selfId, rec);
  if (!raceId) return raceDefaultAttr;
  mp.set(pcFormId, 'race', raceId);
  const race = mp.lookupEspmRecordById(raceId);
  return {
    health: ((_getRaceHealth = getRaceHealth(race)) !== null && _getRaceHealth !== void 0 ? _getRaceHealth : 100) + healthOffset,
    healrate: (_getRaceHealRate = getRaceHealRate(race)) !== null && _getRaceHealRate !== void 0 ? _getRaceHealRate : 0,
    magicka: ((_getRaceMagicka = getRaceMagicka(race)) !== null && _getRaceMagicka !== void 0 ? _getRaceMagicka : 100) + magickaOffset,
    magickarate: (_getRaceMagickaRate = getRaceMagickaRate(race)) !== null && _getRaceMagickaRate !== void 0 ? _getRaceMagickaRate : 0,
    stamina: ((_getRaceStamina = getRaceStamina(race)) !== null && _getRaceStamina !== void 0 ? _getRaceStamina : 100) + staminaOffset,
    staminarate: (_getRaceStaminaRate = getRaceStaminaRate(race)) !== null && _getRaceStaminaRate !== void 0 ? _getRaceStaminaRate : 0
  };
};

exports.getAttr = getAttr;
},{"../utils/helper":"FxH1"}],"ZYrz":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.throwOutById = exports.register = void 0;

var _value = require("./value");

var _perk = require("./perk");

var _equip = require("./equip");

var _papyrusArgs = require("../../utils/papyrusArgs");

var _eval = require("../../properties/eval");

var _functionInfo = require("../../utils/functionInfo");

var _game = require("../game");

var _attributes = require("../../properties/actor/actorValues/attributes");

var _objectReference = require("../objectReference");

var _ = require("../../..");

var _race = require("../race");

var _helper = require("../../utils/helper");

const isWeaponDrawn = (mp, self) => !!mp.get(mp.getIdFromDesc(self.desc), 'isWeaponDrawn');

const isDead = (mp, self) => !!mp.get(mp.getIdFromDesc(self.desc), 'isDead');

const setOutfit = (mp, self, args) => {
  var _espmRecord$record, _espmRecord$record$fi;

  const selfId = mp.getIdFromDesc(self.desc);
  const outfit = (0, _papyrusArgs.getObject)(args, 0);
  const outfitId = mp.getIdFromDesc(outfit.desc);
  const espmRecord = mp.lookupEspmRecordById(outfitId);
  const inam = (_espmRecord$record = espmRecord.record) === null || _espmRecord$record === void 0 ? void 0 : (_espmRecord$record$fi = _espmRecord$record.fields.find(x => x.type === 'INAM')) === null || _espmRecord$record$fi === void 0 ? void 0 : _espmRecord$record$fi.data;

  if (inam) {
    const dt = new DataView(inam.buffer);

    for (let index = 0; index < inam.length; index += 4) {
      const itemId = dt.getUint32(index, true);
      const form = (0, _game.getForm)(mp, null, [itemId]);

      if (form) {
        const countExist = mp.callPapyrusFunction('method', 'ObjectReference', 'GetItemCount', self, [form]);

        if (countExist === 0) {
          mp.callPapyrusFunction('method', 'ObjectReference', 'AddItem', self, [form, 1, true]);
        }

        (0, _equip.unequipItem)(mp, self, [form, false, true]);
        (0, _equip.equipItem)(mp, self, [form, false, true]);
      }
    }
  }

  const sleepOutfit = (0, _papyrusArgs.getBoolean)(args, 1);

  const func = (ctx, outfitId, sleepOutfit) => {
    ctx.sp.once('update', async () => {
      if (!ctx.refr) return;
      const ac = ctx.sp.Actor.from(ctx.refr);
      if (!ac) return;
      const outfit = ctx.sp.Game.getForm(outfitId);
      if (!outfit) return;
      ac.setOutfit(ctx.sp.Outfit.from(outfit), sleepOutfit);
    });
  };

  (0, _eval.evalClient)(mp, selfId, new _functionInfo.FunctionInfo(func).getText({
    outfitId,
    sleepOutfit
  }), true);
};

const setRace = (mp, self, args) => {
  const selfId = mp.getIdFromDesc(self.desc);
  const race = (0, _papyrusArgs.getObject)(args, 0);
  const raceId = mp.getIdFromDesc(race.desc);
  mp.set(selfId, 'race', raceId);
  const espmRecord = mp.lookupEspmRecordById(raceId);
  const hp = (0, _race.getRaceHealth)(espmRecord);
  const stamina = (0, _race.getRaceStamina)(espmRecord);

  _attributes.actorValues.set(selfId, 'health', 'base', hp);

  _attributes.actorValues.set(selfId, 'stamina', 'base', stamina);
};

const getRace = (mp, self) => {
  const selfId = mp.getIdFromDesc(self.desc);
  const raceId = mp.get(selfId, 'race');

  if (!raceId) {
    const baseId = (0, _objectReference.getBaseObjectId)(mp, null, [self]);

    if (baseId) {
      var _espmRecord$record2, _espmRecord$record2$f;

      const espmRecord = mp.lookupEspmRecordById(baseId);
      const rnam = (_espmRecord$record2 = espmRecord.record) === null || _espmRecord$record2 === void 0 ? void 0 : (_espmRecord$record2$f = _espmRecord$record2.fields.find(x => x.type === 'RNAM')) === null || _espmRecord$record2$f === void 0 ? void 0 : _espmRecord$record2$f.data;

      if (rnam) {
        const raceId = (0, _helper.uint32)(rnam.buffer, 0);
        return (0, _game.getForm)(mp, null, [raceId]);
      }
    }

    return;
  }

  return (0, _game.getForm)(mp, null, [raceId]);
};

const isHuman = (mp, self) => {
  const race = getRace(mp, self);
  if (!race) return false;
  const raceId = mp.getIdFromDesc(race.desc);
  const humanRaces = [0x13740, 0x13741, 0x13742, 0x13743, 0x13744, 0x13745, 0x13746, 0x13747, 0x13748, 0x13749, 0x2c659, 0x2c65a, 0x2c65b, 0x2c65c, 0x67cd8, 0x7eaf3, 0x88794, 0x8883a, 0x8883c, 0x8883d, 0x88840, 0x88844, 0x88845, 0x88846, 0x88884, 0x97a3d, 0xa82b9, 0xa82ba];
  return humanRaces.includes(raceId);
};

const setWorldOrCell = (mp, selfNull, args) => {
  const self = (0, _papyrusArgs.getObject)(args, 0);
  const selfId = mp.getIdFromDesc(self.desc);
  const worldOrCell = (0, _papyrusArgs.getNumber)(args, 1);
  mp.set(selfId, 'worldOrCellDesc', mp.getDescFromId(worldOrCell));
};

const kill = (mp, self, args) => {
  const selfId = mp.getIdFromDesc(self.desc);
  const killer = args[0] ? (0, _papyrusArgs.getObject)(args, 0) : null;
  const killerId = killer ? mp.getIdFromDesc(killer.desc) : undefined;
  (0, _value.damageActorValue)(mp, self, ['health', 99999]);
  mp.set(selfId, 'isDead', true);
  if (mp.onDeath) mp.onDeath(selfId, killerId);
};

const resurrect = (mp, self) => {
  const selfId = mp.getIdFromDesc(self.desc);
  (0, _value.restoreActorValue)(mp, self, ['health', 99999]);
  (0, _value.restoreActorValue)(mp, self, ['magicka', 99999]);
  (0, _value.restoreActorValue)(mp, self, ['stamina', 99999]);
  mp.set(selfId, 'isDead', false);
  if (mp.onResurrect) mp.onResurrect(selfId);
};

const throwOutById = (mp, selfId) => {
  mp.set(selfId, 'pos', [-99999, -99999, -99999]);
  mp.set(selfId, 'isDead', true);

  try {
    _attributes.actorValues.set(selfId, 'health', 'base', 0);
  } catch (_unused) {}

  if (selfId >= 0xff000000) {
    try {
      mp.set(selfId, 'isDisabled', true);
    } catch (_unused2) {}
  }

  mp.set(selfId, 'worldOrCellDesc', '0');
};

exports.throwOutById = throwOutById;

const _throwOut = (mp, self) => {
  const selfId = mp.getIdFromDesc(self.desc);
  console.log('npc remove', selfId, (0, _objectReference.getDisplayName)(mp, self));
  throwOutById(mp, selfId);
};

const throwOut = (mp, selfNull, args) => {
  const self = (0, _papyrusArgs.getObject)(args, 0);

  _throwOut(mp, self);
};

const register = mp => {
  mp.registerPapyrusFunction('method', 'Actor', 'AddPerk', (self, args) => (0, _perk.addPerk)(mp, self, args));
  mp.registerPapyrusFunction('method', 'Actor', 'RemovePerk', (self, args) => (0, _perk.removePerk)(mp, self, args));
  mp.registerPapyrusFunction('method', 'Actor', 'HasPerk', (self, args) => (0, _perk.hasPerk)(mp, self, args));
  mp.registerPapyrusFunction('method', 'Actor', 'IsEquipped', (self, args) => (0, _equip.isEquipped)(mp, self, args));
  mp.registerPapyrusFunction('method', 'Actor', 'EquipItem', (self, args) => (0, _equip.equipItem)(mp, self, args));
  mp.registerPapyrusFunction('method', 'Actor', 'UnequipItem', (self, args) => (0, _equip.unequipItem)(mp, self, args));
  mp.registerPapyrusFunction('method', 'Actor', 'UnequipAll', self => (0, _equip.unequipAll)(mp, self));
  mp.registerPapyrusFunction('method', 'Actor', 'UnequipItemSlot', (self, args) => (0, _equip.unequipItemSlot)(mp, self, args));
  mp.registerPapyrusFunction('method', 'Actor', 'GetEquippedObject', (self, args) => (0, _equip.getEquippedObject)(mp, self, args));
  mp.registerPapyrusFunction('method', 'Actor', 'GetEquippedArmorInSlot', (self, args) => (0, _equip.getEquippedArmorInSlot)(mp, self, args));
  mp.registerPapyrusFunction('method', 'Actor', 'GetEquippedShield', self => (0, _equip.getEquippedShield)(mp, self));
  mp.registerPapyrusFunction('method', 'Actor', 'GetEquippedWeapon', (self, args) => (0, _equip.getEquippedWeapon)(mp, self, args));
  mp.registerPapyrusFunction('method', 'Actor', 'SetActorValue', (self, args) => (0, _value.setActorValue)(mp, self, args));
  mp.registerPapyrusFunction('method', 'Actor', 'SetAV', (self, args) => (0, _value.setActorValue)(mp, self, args));
  mp.registerPapyrusFunction('method', 'Actor', 'GetActorValue', (self, args) => (0, _value.getActorValue)(mp, self, args));
  mp.registerPapyrusFunction('method', 'Actor', 'GetAV', (self, args) => (0, _value.getActorValue)(mp, self, args));
  mp.registerPapyrusFunction('method', 'Actor', 'GetActorValuePercentage', (self, args) => (0, _value.getActorValuePercentage)(mp, self, args));
  mp.registerPapyrusFunction('method', 'Actor', 'DamageActorValue', (self, args) => (0, _value.damageActorValue)(mp, self, args));
  mp.registerPapyrusFunction('method', 'Actor', 'DamageAV', (self, args) => (0, _value.damageActorValue)(mp, self, args));
  mp.registerPapyrusFunction('method', 'Actor', 'RestoreActorValue', (self, args) => (0, _value.restoreActorValue)(mp, self, args));
  mp.registerPapyrusFunction('method', 'Actor', 'RestoreAV', (self, args) => (0, _value.restoreActorValue)(mp, self, args));
  mp.registerPapyrusFunction('method', 'Actor', 'ModActorValue', (self, args) => (0, _value.modActorValue)(mp, self, args));
  mp.registerPapyrusFunction('method', 'Actor', 'ModAV', (self, args) => (0, _value.modActorValue)(mp, self, args));
  mp.registerPapyrusFunction('method', 'Actor', 'IsWeaponDrawn', self => isWeaponDrawn(mp, self));
  mp.registerPapyrusFunction('method', 'Actor', 'IsDead', self => isDead(mp, self));
  mp.registerPapyrusFunction('method', 'Actor', 'SetOutfit', (self, args) => setOutfit(mp, self, args));
  mp.registerPapyrusFunction('method', 'Actor', 'SetRace', (self, args) => setRace(mp, self, args));
  mp.registerPapyrusFunction('method', 'Actor', 'GetRace', self => getRace(mp, self));
  mp.registerPapyrusFunction('method', 'Actor', 'Kill', (self, args) => kill(mp, self, args));
  mp.registerPapyrusFunction('method', 'Actor', 'Resurrect', self => resurrect(mp, self));
  mp.registerPapyrusFunction('global', 'ActorEx', 'GetWornForms', (self, args) => (0, _equip.getWornForms)(mp, self, args));
  mp.registerPapyrusFunction('global', 'ActorEx', 'GetWornFormsId', (self, args) => (0, _equip.getWornFormsId)(mp, self, args));
  mp.registerPapyrusFunction('global', 'ActorEx', 'SetWorldOrCell', (self, args) => setWorldOrCell(mp, self, args));
  mp.registerPapyrusFunction('global', 'ActorEx', 'ThrowOut', (self, args) => throwOut(mp, self, args));

  _.IActor.AddPerk = (self, args) => (0, _perk.addPerk)(mp, self, args);

  _.IActor.RemovePerk = (self, args) => (0, _perk.removePerk)(mp, self, args);

  _.IActor.HasPerk = (self, args) => (0, _perk.hasPerk)(mp, self, args);

  _.IActor.IsEquipped = (self, args) => (0, _equip.isEquipped)(mp, self, args);

  _.IActor.IsHuman = self => isHuman(mp, self);

  _.IActor.EquipItem = (self, args) => (0, _equip.equipItem)(mp, self, args);

  _.IActor.UnequipItem = (self, args) => (0, _equip.unequipItem)(mp, self, args);

  _.IActor.UnequipAll = self => (0, _equip.unequipAll)(mp, self);

  _.IActor.UnequipItemSlot = (self, args) => (0, _equip.unequipItemSlot)(mp, self, args);

  _.IActor.GetEquippedObject = (self, args) => (0, _equip.getEquippedObject)(mp, self, args);

  _.IActor.GetEquippedShield = self => (0, _equip.getEquippedShield)(mp, self);

  _.IActor.GetEquippedWeapon = (self, args) => (0, _equip.getEquippedWeapon)(mp, self, args);

  _.IActor.SetActorValue = (self, args) => (0, _value.setActorValue)(mp, self, args);

  _.IActor.GetActorValue = (self, args) => (0, _value.getActorValue)(mp, self, args);

  _.IActor.GetActorValuePercentage = (self, args) => (0, _value.getActorValuePercentage)(mp, self, args);

  _.IActor.DamageActorValue = (self, args) => (0, _value.damageActorValue)(mp, self, args);

  _.IActor.RestoreActorValue = (self, args) => (0, _value.restoreActorValue)(mp, self, args);

  _.IActor.ModActorValue = (self, args) => (0, _value.modActorValue)(mp, self, args);

  _.IActor.IsWeaponDrawn = self => isWeaponDrawn(mp, self);

  _.IActor.IsDead = self => isDead(mp, self);

  _.IActor.SetOutfit = (self, args) => setOutfit(mp, self, args);

  _.IActor.SetRace = (self, args) => setRace(mp, self, args);

  _.IActor.GetRace = self => getRace(mp, self);

  _.IActor.GetWornForms = self => (0, _equip._getWornForms)(mp, self);

  _.IActor.SetWorldOrCell = args => setWorldOrCell(mp, null, args);

  _.IActor.ThrowOut = self => _throwOut(mp, self);

  _.IActor.Kill = (self, args) => kill(mp, self, args);

  _.IActor.Resurrect = self => resurrect(mp, self);
};

exports.register = register;
},{"./value":"I1C7","./perk":"d40v","./equip":"lP44","../../utils/papyrusArgs":"oZY1","../../properties/eval":"mJTA","../../utils/functionInfo":"fC7F","../game":"WCBi","../../properties/actor/actorValues/attributes":"Klzq","../objectReference":"YRYD","../../..":"QCba","../race":"AkNH","../../utils/helper":"FxH1"}],"jnne":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.throwOrInit = exports.overrideNotify = exports.logExecuteTime = exports.initAVFromRace = void 0;

var _ = require("../..");

var _modules = require("../modules");

var _actor = require("../papyrus/actor");

var _lvlList = require("../papyrus/form/lvl-list");

var _objectReference = require("../papyrus/objectReference");

var _race = require("../papyrus/race");

var _attributes = require("../properties/actor/actorValues/attributes");

var _eval = require("../properties/eval");

var _functionInfo = require("../utils/functionInfo");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const initAVFromRace = (mp, pcFormId, serverOptions) => {
  if (mp.get(pcFormId, 'isDead') !== undefined) return;

  if (!mp.get(pcFormId, 'spawnTimeToRespawn')) {
    const time = (0, _objectReference.getRespawnTimeById)(mp, null, [pcFormId]);
    mp.set(pcFormId, 'spawnTimeToRespawn', time);
  }

  const raceAttr = serverOptions !== null && serverOptions !== void 0 && serverOptions.debugAttrAll ? _race.raceDefaultAttr : (0, _race.getAttr)(mp, pcFormId);

  _attributes.actorValues.setDefaults(pcFormId, {
    force: true
  }, _objectSpread(_objectSpread({}, raceAttr), {}, {
    oneHanded: 1,
    twoHanded: 1,
    marksman: 1,
    block: 1,
    smithing: 100,
    heavyArmor: 1,
    lightArmor: 1,
    pickpocket: 1,
    lockpicking: 1,
    sneak: 1,
    alchemy: 1,
    speechcraft: 1,
    alteration: 1,
    conjuration: 1,
    destruction: 1,
    illusion: 1,
    restoration: 1,
    enchanting: 1
  }));
};

exports.initAVFromRace = initAVFromRace;

const logExecuteTime = (startTime, eventName) => {
  if (Date.now() - startTime > 10) {
    console.log('[PERFOMANCE]', `Event ${eventName}: `, Date.now() - startTime);
  }
};

exports.logExecuteTime = logExecuteTime;

const throwOrInit = (mp, id, serverOptions) => {
  if (!serverOptions) serverOptions = _.serverOptionProvider.getServerOptions();

  if (id < 0x5000000 && mp.get(id, 'worldOrCellDesc') !== '0' && !serverOptions.isVanillaSpawn) {
    (0, _actor.throwOutById)(mp, id);
  } else if (!mp.get(id, 'spawnTimeToRespawn')) {
    try {
      const mob = {
        type: 'form',
        desc: mp.getDescFromId(id)
      };

      const mobActor = _modules.Actor.get(id);

      if (!mobActor.isHuman()) {
        const lvlObjects = (0, _lvlList.getLvlListObjects)(mp, mob);
        const lvl = Math.floor(Math.random() * 60);
        lvlObjects.forEach(item => {
          const itemToAdd = _modules.Game.getForm(item.id);

          if (!(mobActor.getItemCount(itemToAdd) > 0) && itemToAdd.getName() !== 'NOT_FOUND' && item.level < lvl) {
            mobActor.addItem(itemToAdd, item.count);
          }
        });
      } else if (id < 0x5000000) {
        (0, _actor.throwOutById)(mp, id);
      }
    } catch (err) {
      console.log('[ERROR] add lvl list items 1');
    }

    try {
      initAVFromRace(mp, id, serverOptions);
    } catch (err) {
      console.log('[ERROR] initAVFromRace', err);
    }
  }
};

exports.throwOrInit = throwOrInit;

const overrideNotify = (mp, formId) => {
  const func = ctx => {
    ctx.sp.once('update', () => {
      const notify = msg => {
        var _msg$match;

        const src = [];
        const countRegex = /(\d+)/;
        const countRemoveRegex = /[(].+[)]$/gm;
        const typeRemoveRegex = /^[+-]\s/gm;

        const getType = msg => {
          if (msg.startsWith('+')) return 'additem';
          if (msg.startsWith('-')) return 'deleteitem';
          return 'default';
        };

        const type = getType(msg);
        const match = (_msg$match = msg.match(countRegex)) !== null && _msg$match !== void 0 ? _msg$match : [];
        const count = +match[0];
        const message = msg.replace(countRemoveRegex, '').replace(typeRemoveRegex, '');
        const data = {
          message,
          type,
          count
        };
        src.push(`
				window.storage.dispatch({
					type: 'COMMAND',
					data: {
						commandType: 'INFOBAR_ADD_MESSAGE',
						alter: ['${JSON.stringify(data)}']
					}
				})
				`);
        ctx.sp.browser.executeJavaScript(src.join('\n'));
      };

      ctx.sp.Debug.notification = notify;
    });
  };

  (0, _eval.evalClient)(mp, formId, new _functionInfo.FunctionInfo(func).getText({}), false, true);
};

exports.overrideNotify = overrideNotify;
},{"../..":"QCba","../modules":"uozv","../papyrus/actor":"ZYrz","../papyrus/form/lvl-list":"mliY","../papyrus/objectReference":"YRYD","../papyrus/race":"AkNH","../properties/actor/actorValues/attributes":"Klzq","../properties/eval":"mJTA","../utils/functionInfo":"fC7F"}],"YRYD":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setOpen = exports.removeItem = exports.register = exports.placeObjectOnStatic = exports.placeAtMe = exports.isInInterior = exports.getWorldSpace = exports.getRespawnTimeById = exports.getRespawnTime = exports.getParentCell = exports.getLocationRef = exports.getItemCount = exports.getDisplayName = exports.getBaseObjectIdById = exports.getBaseObjectId = exports.disable = exports.addItem = void 0;

var _papyrusArgs = require("../../utils/papyrusArgs");

var game = _interopRequireWildcard(require("../game"));

var position = _interopRequireWildcard(require("./position"));

var _eval = require("../../properties/eval");

var _functionInfo = require("../../utils/functionInfo");

var storage = _interopRequireWildcard(require("./storage"));

var _cell = require("../cell");

var _helper = require("../../utils/helper");

var _ = require("../../..");

var _shared = require("../../events/shared");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const setScale = (mp, self, args) => {
  const selfId = mp.getIdFromDesc(self.desc);
  const scale = (0, _papyrusArgs.getNumber)(args, 0);
  mp.set(selfId, 'scale', scale);
};

const getScale = (mp, self) => {
  var _mp$get;

  const selfId = mp.getIdFromDesc(self.desc);
  return (_mp$get = mp.get(selfId, 'scale')) !== null && _mp$get !== void 0 ? _mp$get : 1;
};

const removeAllItems = (mp, self, args) => {
  const selfId = mp.getIdFromDesc(self.desc);
  const transferTo = args[0] ? (0, _papyrusArgs.getObject)(args, 0) : null;

  if (transferTo) {
    const transferToId = mp.getIdFromDesc(transferTo.desc);
    const transferToInv = mp.get(transferToId, 'inventory');
    const selfInv = mp.get(selfId, 'inventory');
    selfInv.entries.forEach(item => {
      const same = transferToInv.entries.find(x => x.baseId === item.baseId);

      if (same) {
        same.count += item.count;
      } else {
        transferToInv.entries.push(item);
      }
    });
    mp.set(transferToId, 'inventory', transferToInv);
  }

  const emptyInv = {
    entries: []
  };
  mp.set(selfId, 'inventory', emptyInv);
};

const getCurrentDestructionStage = (mp, self) => {
  var _mp$get2;

  const selfId = mp.getIdFromDesc(self.desc);
  return (_mp$get2 = mp.get(selfId, 'currentDestructionStage')) !== null && _mp$get2 !== void 0 ? _mp$get2 : -1;
};

const _setCurrentDestructionStage = (mp, self, args) => {
  const selfId = mp.getIdFromDesc(self.desc);
  const stage = (0, _papyrusArgs.getNumber)(args, 0);
  mp.set(selfId, 'currentDestructionStage', stage);
};

const setCurrentDestructionStage = (mp, self, args) => {
  const ref = (0, _papyrusArgs.getObject)(args, 0);
  const stage = (0, _papyrusArgs.getNumber)(args, 1);

  _setCurrentDestructionStage(mp, ref, [stage]);
};

const damageObject = (mp, self, args) => {
  const selfId = mp.getIdFromDesc(self.desc);
  const damage = (0, _papyrusArgs.getNumber)(args, 0);

  const func = (ctx, selfId, damage) => {
    ctx.sp.once('update', () => {
      const form = ctx.sp.Game.getFormEx(selfId);
      if (!form) return;
      const ref = ctx.sp.ObjectReference.from(form);
      if (!ref) return;
      ref.damageObject(damage);
    });
  };

  (0, _eval.evalClient)(mp, 0xff000000, new _functionInfo.FunctionInfo(func).getText({
    selfId,
    damage
  }));
};

const clearDestruction = (mp, self) => {
  const selfId = mp.getIdFromDesc(self.desc);

  const func = (ctx, selfId) => {
    ctx.sp.once('update', () => {
      const form = ctx.sp.Game.getFormEx(selfId);
      if (!form) return;
      const ref = ctx.sp.ObjectReference.from(form);
      if (!ref) return;
      ref.clearDestruction();
    });
  };

  (0, _eval.evalClient)(mp, 0xff000000, new _functionInfo.FunctionInfo(func).getText({
    selfId
  }), true);
};

const getContainerForms = (mp, self) => {
  const selfId = mp.getIdFromDesc(self.desc);
  return mp.get(selfId, 'inventory').entries.map(item => {
    return (0, game.getForm)(mp, null, [item.baseId]);
  }).filter(item => item);
};

const blockActivation = (mp, self, args) => {
  const state = (0, _papyrusArgs.getBoolean)(args, 0);
  mp.callPapyrusFunction('method', 'ObjectReference', 'BlockActivation', self, [state]);
};

const moveTo = (mp, self, args) => {
  const selfId = mp.getIdFromDesc(self.desc);
  const target = (0, _papyrusArgs.getObject)(args, 0);
  const targetId = mp.getIdFromDesc(target.desc);
  const xoffset = (0, _papyrusArgs.getNumber)(args, 1);
  const yoffset = (0, _papyrusArgs.getNumber)(args, 2);
  const zoffset = (0, _papyrusArgs.getNumber)(args, 3);
  const matchRotation = (0, _papyrusArgs.getBoolean)(args, 4);
  const [x, y, z] = (0, position.getPosition)(mp, target);
  const w = mp.get(targetId, 'worldOrCellDesc');
  console.log(selfId, [x + xoffset, y + yoffset, z + zoffset]);
  mp.set(selfId, 'pos', [x + xoffset, y + yoffset, z + zoffset]);
  mp.set(selfId, 'worldOrCellDesc', w);

  if (matchRotation) {
    mp.set(selfId, 'angle', (0, position.getAngle)(mp, target));
  }
};

const _getBaseObject = (mp, selfId) => {
  var _espmRecord$record, _espmRecord$record$fi;

  if (selfId >= 0xff000000) {
    selfId = mp.getIdFromDesc(mp.get(selfId, 'baseDesc'));
    return (0, game.getForm)(mp, null, [selfId]);
  }

  const espmRecord = mp.lookupEspmRecordById(selfId);
  const name = (_espmRecord$record = espmRecord.record) === null || _espmRecord$record === void 0 ? void 0 : (_espmRecord$record$fi = _espmRecord$record.fields.find(x => x.type === 'NAME')) === null || _espmRecord$record$fi === void 0 ? void 0 : _espmRecord$record$fi.data;

  if (name) {
    const dataView = new DataView(name.buffer);
    return (0, game.getForm)(mp, null, [dataView.getUint32(0, true)]);
  }
};

const getBaseObject = (mp, self) => {
  const selfId = mp.getIdFromDesc(self.desc);
  return _getBaseObject(mp, selfId);
};

const getBaseObjectId = (mp, self, args) => {
  const selfId = mp.getIdFromDesc((0, _papyrusArgs.getObject)(args, 0).desc);

  const base = _getBaseObject(mp, selfId);

  if (base) {
    return mp.getIdFromDesc(base.desc);
  }
};

exports.getBaseObjectId = getBaseObjectId;

const getBaseObjectIdById = (mp, self, args) => {
  const selfId = (0, _papyrusArgs.getNumber)(args, 0);

  const base = _getBaseObject(mp, selfId);

  if (base) {
    return mp.getIdFromDesc(base.desc);
  }
};

exports.getBaseObjectIdById = getBaseObjectIdById;

const placeObjectOnStatic = (mp, self, args) => {
  const placeId = (0, _papyrusArgs.getNumber)(args, 0);
  const whatSpawnId = (0, _papyrusArgs.getNumber)(args, 1);
  const sRefId = mp.place(whatSpawnId);
  const sRef = (0, game.getForm)(mp, null, [sRefId]);
  if (!sRef) return null;
  const targetPoint = {
    pos: (0, position.getEspPosition)(mp, placeId),
    angle: [0, 0, 0],
    worldOrCellDesc: mp.get(placeId, 'worldOrCellDesc')
  };
  Object.keys(targetPoint).forEach(key => {
    const propName = key;
    mp.set(sRefId, propName, targetPoint[propName]);
  });
  (0, _shared.throwOrInit)(mp, sRefId);
  return sRef;
};

exports.placeObjectOnStatic = placeObjectOnStatic;

const _placeAtMe = (mp, self, args) => {
  const selfId = mp.getIdFromDesc(self.desc);
  const whatSpawnId = (0, _papyrusArgs.getNumber)(args, 0);
  const count = (0, _papyrusArgs.getNumber)(args, 1);
  const sRefResult = [];

  for (let i = 0; i < count; i++) {
    var _mp$get3;

    const sRefId = mp.place(whatSpawnId);
    const sRef = (0, game.getForm)(mp, null, [sRefId]);
    if (!sRef) return null;
    sRefResult.push(sRef);
    const targetPoint = {
      pos: (_mp$get3 = mp.get(selfId, 'pos')) !== null && _mp$get3 !== void 0 ? _mp$get3 : [0, 0, 0],
      angle: [0, 0, 0],
      worldOrCellDesc: mp.get(selfId, 'worldOrCellDesc')
    };
    Object.keys(targetPoint).forEach(key => {
      const propName = key;
      mp.set(sRefId, propName, targetPoint[propName]);
    });
    (0, _shared.throwOrInit)(mp, sRefId);
  }

  if (sRefResult.length === 0) return null;
  return sRefResult[sRefResult.length - 1];
};

const placeAtMeObj = (mp, self, args) => {
  const target = (0, _papyrusArgs.getObject)(args, 0);
  const targetId = mp.getIdFromDesc(target.desc);
  const count = (0, _papyrusArgs.getNumber)(args, 1);
  return _placeAtMe(mp, self, [targetId, count]);
};

const placeAtMe = (mp, selfNull, args) => {
  const self = (0, _papyrusArgs.getObject)(args, 0);
  const targetId = (0, _papyrusArgs.getNumber)(args, 1);
  const count = (0, _papyrusArgs.getNumber)(args, 2);
  return _placeAtMe(mp, self, [targetId, count]);
};

exports.placeAtMe = placeAtMe;

const getLinkedReferenceId = (mp, self, args) => {
  var _espmRecord$record2, _espmRecord$record2$f;

  const base = mp.getIdFromDesc((0, _papyrusArgs.getObject)(args, 0).desc);
  const espmRecord = mp.lookupEspmRecordById(base);
  const links = (_espmRecord$record2 = espmRecord.record) === null || _espmRecord$record2 === void 0 ? void 0 : (_espmRecord$record2$f = _espmRecord$record2.fields.find(x => x.type === 'XLKR')) === null || _espmRecord$record2$f === void 0 ? void 0 : _espmRecord$record2$f.data;
  if (!links) return [];
  const dataView = new DataView(links.buffer);
  const keywordsId = [];

  for (let i = 4; i + 4 <= links.length; i += 8) {
    keywordsId.push(dataView.getUint32(i, true));
  }

  return keywordsId;
};

const getLinkedReferenceIdByKeywordId = (mp, self, args) => {
  var _espmRecord$record3, _espmRecord$record3$f;

  const base = mp.getIdFromDesc((0, _papyrusArgs.getObject)(args, 0).desc);
  const keywordId = (0, _papyrusArgs.getNumber)(args, 1);
  const espmRecord = mp.lookupEspmRecordById(base);
  const links = (_espmRecord$record3 = espmRecord.record) === null || _espmRecord$record3 === void 0 ? void 0 : (_espmRecord$record3$f = _espmRecord$record3.fields.find(x => x.type === 'XLKR')) === null || _espmRecord$record3$f === void 0 ? void 0 : _espmRecord$record3$f.data;

  if (links) {
    const dataView = new DataView(links.buffer);

    for (let i = 0; i + 4 <= dataView.byteLength; i += 8) {
      if (dataView.getUint32(i, true) === keywordId) {
        return dataView.getUint32(i + 4, true);
      }
    }
  }
};

const getDisplayName = (mp, self) => {
  var _espmRecord$record4, _espmRecord$record4$f, _ref2, _mp$get5;

  const selfId = mp.getIdFromDesc(self.desc);
  const appearance = mp.get(selfId, 'appearance');

  if (selfId >= 0xff000000) {
    var _ref, _mp$get4;

    const f = (0, game.getForm)(mp, null, [mp.getIdFromDesc(mp.get(selfId, 'baseDesc'))]);
    const n = f && mp.callPapyrusFunction('global', 'FormEx', 'GetName', null, [f]);
    return (_ref = (_mp$get4 = mp.get(selfId, 'displayName')) !== null && _mp$get4 !== void 0 ? _mp$get4 : appearance === null || appearance === void 0 ? void 0 : appearance.name) !== null && _ref !== void 0 ? _ref : n;
  }

  const espmRecord = mp.lookupEspmRecordById(selfId);
  const name = (_espmRecord$record4 = espmRecord.record) === null || _espmRecord$record4 === void 0 ? void 0 : (_espmRecord$record4$f = _espmRecord$record4.fields.find(x => x.type === 'NAME')) === null || _espmRecord$record4$f === void 0 ? void 0 : _espmRecord$record4$f.data;
  if (!name) return '';
  const baseId = (0, _helper.uint32)(name.buffer, 0);
  const f = (0, game.getForm)(mp, null, [baseId]);
  const n = f && mp.callPapyrusFunction('global', 'FormEx', 'GetName', null, [f]);
  return (_ref2 = (_mp$get5 = mp.get(selfId, 'displayName')) !== null && _mp$get5 !== void 0 ? _mp$get5 : appearance === null || appearance === void 0 ? void 0 : appearance.name) !== null && _ref2 !== void 0 ? _ref2 : n;
};

exports.getDisplayName = getDisplayName;

const setDisplayName = (mp, self, args) => {
  const selfId = mp.getIdFromDesc(self.desc);
  const name = (0, _papyrusArgs.getString)(args, 0);
  mp.set(selfId, 'displayName', name);
};

const getWorldSpace = (mp, self) => {
  const selfId = mp.getIdFromDesc(self.desc);
  const worldOrCellId = mp.getIdFromDesc(mp.get(selfId, 'worldOrCellDesc'));
  return game.getForm(mp, null, [worldOrCellId]);
};

exports.getWorldSpace = getWorldSpace;

const getParentCell = (mp, self) => {
  const selfId = mp.getIdFromDesc(self.desc);
  const cellDesc = mp.get(selfId, 'cellDesc');
  if (!cellDesc) return;
  const cellId = mp.getIdFromDesc(cellDesc);
  return game.getForm(mp, null, [cellId]);
};

exports.getParentCell = getParentCell;

const isInInterior = (mp, self) => {
  const cell = getParentCell(mp, self);
  if (!cell) return false;
  return (0, _cell.isInterior)(mp, cell);
};

exports.isInInterior = isInInterior;

const getLocationRef = (mp, self, args) => {
  var _espmRecord$record5, _espmRecord$record5$f;

  const espmRecord = mp.lookupEspmRecordById((0, _papyrusArgs.getNumber)(args, 0));
  const locationRef = (_espmRecord$record5 = espmRecord.record) === null || _espmRecord$record5 === void 0 ? void 0 : (_espmRecord$record5$f = _espmRecord$record5.fields.find(x => x.type === 'XLRT')) === null || _espmRecord$record5$f === void 0 ? void 0 : _espmRecord$record5$f.data;
  if (!locationRef) return;
  const dataView = new DataView(locationRef.buffer);
  const locationRefId = dataView.getUint32(0, true);
  return locationRefId;
};

exports.getLocationRef = getLocationRef;

const setOpen = (mp, self, args) => {
  const selfId = mp.getIdFromDesc(self.desc);
  const openState = (0, _papyrusArgs.getBoolean)(args, 0);
  console.log(selfId, openState);
  mp.set(selfId, 'openState', openState);
};

exports.setOpen = setOpen;

const getRespawnTimeById = (mp, selfNull, args) => {
  var _timeById$find, _timeById$find2, _ref3, _ref4;

  const selfId = (0, _papyrusArgs.getNumber)(args, 0);
  const baseId = getBaseObjectIdById(mp, null, [selfId]);

  const spawnTimeById = _.serverOptionProvider.getServerOptionsValue(['spawnTimeById']);

  const timeById = Array.isArray(spawnTimeById) ? spawnTimeById.map(x => {
    if (!x || typeof x !== 'string') return;
    const xParse = x.split(':');
    if (xParse.length !== 2) return;
    return {
      id: +xParse[0],
      time: +xParse[1]
    };
  }).filter(x => x) : [];
  const refTime = (_timeById$find = timeById.find(x => x.id === selfId)) === null || _timeById$find === void 0 ? void 0 : _timeById$find.time;
  const baseTime = (_timeById$find2 = timeById.find(x => x.id === baseId)) === null || _timeById$find2 === void 0 ? void 0 : _timeById$find2.time;
  return (_ref3 = (_ref4 = refTime !== null && refTime !== void 0 ? refTime : baseTime) !== null && _ref4 !== void 0 ? _ref4 : _.serverOptionProvider.getServerOptionsValue([baseId === 7 ? 'SpawnTimeToRespawn' : 'SpawnTimeToRespawnNPC'])) !== null && _ref3 !== void 0 ? _ref3 : -1;
};

exports.getRespawnTimeById = getRespawnTimeById;

const getRespawnTime = (mp, selfNull, args) => {
  const self = (0, _papyrusArgs.getObject)(args, 0);
  const selfId = mp.getIdFromDesc(self.desc);
  return getRespawnTimeById(mp, null, [selfId]);
};

exports.getRespawnTime = getRespawnTime;

const addItem = (mp, self, args) => {
  const item = (0, _papyrusArgs.getObject)(args, 0);
  const count = (0, _papyrusArgs.getNumber)(args, 1);
  const silent = (0, _papyrusArgs.getBoolean)(args, 2);
  mp.callPapyrusFunction('method', 'ObjectReference', 'AddItem', self, [item, count, silent]);
};

exports.addItem = addItem;

const removeItem = (mp, self, args) => {
  const item = (0, _papyrusArgs.getObject)(args, 0);
  const count = (0, _papyrusArgs.getNumber)(args, 1);
  const silent = (0, _papyrusArgs.getBoolean)(args, 2);
  const other = args[3] ? (0, _papyrusArgs.getObject)(args, 3) : null;
  mp.callPapyrusFunction('method', 'ObjectReference', 'RemoveItem', self, [item, count, silent, other]);
};

exports.removeItem = removeItem;

const disable = (mp, self, args) => {
  const abFadeOut = (0, _papyrusArgs.getBoolean)(args, 0);
  mp.callPapyrusFunction('method', 'ObjectReference', 'Disable', self, [abFadeOut]);
};

exports.disable = disable;

const getItemCount = (mp, self, args) => {
  const item = (0, _papyrusArgs.getObject)(args, 0);
  const itemCount = mp.callPapyrusFunction('method', 'ObjectReference', 'GetItemCount', self, [item]);
  if (!itemCount) return 0;
  return itemCount;
};

exports.getItemCount = getItemCount;

const register = mp => {
  mp.registerPapyrusFunction('method', 'ObjectReference', 'SetScale', (self, args) => setScale(mp, self, args));
  mp.registerPapyrusFunction('method', 'ObjectReference', 'GetScale', self => getScale(mp, self));
  mp.registerPapyrusFunction('method', 'ObjectReference', 'RemoveAllItems', (self, args) => removeAllItems(mp, self, args));
  mp.registerPapyrusFunction('method', 'ObjectReference', 'GetDistance', (self, args) => (0, position.getDistance)(mp, self, args));
  mp.registerPapyrusFunction('method', 'ObjectReference', 'MoveTo', (self, args) => moveTo(mp, self, args));
  mp.registerPapyrusFunction('method', 'ObjectReference', 'GetContainerForms', self => getContainerForms(mp, self));
  mp.registerPapyrusFunction('method', 'ObjectReference', 'GetCurrentDestructionStage', self => getCurrentDestructionStage(mp, self));
  mp.registerPapyrusFunction('method', 'ObjectReference', 'DamageObject', (self, args) => damageObject(mp, self, args));
  mp.registerPapyrusFunction('method', 'ObjectReference', 'ClearDestruction', self => clearDestruction(mp, self));
  mp.registerPapyrusFunction('global', 'ObjectReferenceEx', 'SetCurrentDestructionStage', (self, args) => setCurrentDestructionStage(mp, self, args));
  mp.registerPapyrusFunction('method', 'ObjectReference', 'GetBaseObject', self => getBaseObject(mp, self));
  mp.registerPapyrusFunction('global', 'ObjectReferenceEx', 'GetBaseObjectId', (self, args) => getBaseObjectId(mp, self, args));
  mp.registerPapyrusFunction('global', 'ObjectReferenceEx', 'GetLinkedReferenceId', (self, args) => getLinkedReferenceId(mp, self, args));
  mp.registerPapyrusFunction('global', 'ObjectReferenceEx', 'GetLinkedReferenceIdByKeywordId', (self, args) => getLinkedReferenceIdByKeywordId(mp, self, args));
  mp.registerPapyrusFunction('global', 'ObjectReferenceEx', 'PlaceObjectOnStatic', (self, args) => placeObjectOnStatic(mp, self, args));
  mp.registerPapyrusFunction('global', 'ObjectReferenceEx', 'PlaceAtMe', (self, args) => placeAtMe(mp, self, args));
  mp.registerPapyrusFunction('method', 'ObjectReference', 'GetDisplayName', self => getDisplayName(mp, self));
  mp.registerPapyrusFunction('method', 'ObjectReference', 'SetDisplayName', (self, args) => setDisplayName(mp, self, args));
  mp.registerPapyrusFunction('method', 'ObjectReference', 'GetWorldSpace', self => getWorldSpace(mp, self));
  mp.registerPapyrusFunction('method', 'ObjectReference', 'GetParentCell', self => getParentCell(mp, self));
  mp.registerPapyrusFunction('method', 'ObjectReference', 'IsInInterior', self => isInInterior(mp, self));
  mp.registerPapyrusFunction('method', 'ObjectReference', 'SetOpen', (self, args) => setOpen(mp, self, args));
  mp.registerPapyrusFunction('global', 'ObjectReferenceEx', 'GetLocationRef', (self, args) => getLocationRef(mp, self, args));
  mp.registerPapyrusFunction('global', 'ObjectReferenceEx', 'GetRespawnTime', (self, args) => getRespawnTime(mp, self, args));
  storage.register(mp);
  position.register(mp);

  _.IObjectReference.SetScale = (self, args) => setScale(mp, self, args);

  _.IObjectReference.GetScale = self => getScale(mp, self);

  _.IObjectReference.RemoveAllItems = (self, args) => removeAllItems(mp, self, args);

  _.IObjectReference.GetDistance = (self, args) => (0, position.getDistance)(mp, self, args);

  _.IObjectReference.MoveTo = (self, args) => moveTo(mp, self, args);

  _.IObjectReference.GetContainerForms = self => getContainerForms(mp, self);

  _.IObjectReference.GetCurrentDestructionStage = self => getCurrentDestructionStage(mp, self);

  _.IObjectReference.DamageObject = (self, args) => damageObject(mp, self, args);

  _.IObjectReference.ClearDestruction = self => clearDestruction(mp, self);

  _.IObjectReference.SetCurrentDestructionStage = (self, args) => _setCurrentDestructionStage(mp, self, args);

  _.IObjectReference.BlockActivation = (self, args) => blockActivation(mp, self, args);

  _.IObjectReference.GetBaseObject = self => getBaseObject(mp, self);

  _.IObjectReference.PlaceAtMe = (self, args) => placeAtMeObj(mp, self, args);

  _.IObjectReference.GetDisplayName = self => getDisplayName(mp, self);

  _.IObjectReference.SetDisplayName = (self, args) => setDisplayName(mp, self, args);

  _.IObjectReference.GetWorldSpace = self => getWorldSpace(mp, self);

  _.IObjectReference.GetParentCell = self => getParentCell(mp, self);

  _.IObjectReference.IsInInterior = self => isInInterior(mp, self);

  _.IObjectReference.SetOpen = (self, args) => setOpen(mp, self, args);

  _.IObjectReference.GetStorageValue = (self, args) => (0, storage._getStorageValue)(mp, self, args);

  _.IObjectReference.SetStorageValue = (self, args) => (0, storage._setStorageValue)(mp, self, args);

  _.IObjectReference.SetPosition = (self, args) => (0, position.setPosition)(mp, self, args);

  _.IObjectReference.GetPositionX = self => (0, position.getPositionX)(mp, self);

  _.IObjectReference.GetPositionY = self => (0, position.getPositionY)(mp, self);

  _.IObjectReference.GetPositionZ = self => (0, position.getPositionZ)(mp, self);

  _.IObjectReference.SetAngle = (self, args) => (0, position.setAngle)(mp, self, args);

  _.IObjectReference.GetAngleX = self => (0, position.getAngleX)(mp, self);

  _.IObjectReference.GetAngleY = self => (0, position.getAngleY)(mp, self);

  _.IObjectReference.GetAngleZ = self => (0, position.getAngleZ)(mp, self);

  _.IObjectReference.AddItem = (self, args) => addItem(mp, self, args);

  _.IObjectReference.RemoveItem = (self, args) => removeItem(mp, self, args);

  _.IObjectReference.GetItemCount = (self, args) => getItemCount(mp, self, args);

  _.IObjectReference.GetRespawnTime = args => getRespawnTime(mp, null, args);

  _.IObjectReference.Disable = (self, args) => disable(mp, self, args);

  _.IObjectReference.GetLinkedDoorId = self => (0, position.getLinkedDoorId)(mp, null, [self]);

  _.IObjectReference.GetLinkedCellId = self => (0, position.getLinkedCellId)(mp, null, [self]);
};

exports.register = register;
},{"../../utils/papyrusArgs":"oZY1","../game":"WCBi","./position":"wmVe","../../properties/eval":"mJTA","../../utils/functionInfo":"fC7F","./storage":"P8j4","../cell":"WIJZ","../../utils/helper":"FxH1","../../..":"QCba","../../events/shared":"jnne"}],"A7KX":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.showNicknames = exports.showNick = exports.sendPlayerPos = void 0;

var _game = require("../papyrus/game");

var _objectReference = require("../papyrus/objectReference");

var _eval = require("../properties/eval");

var _functionInfo = require("../utils/functionInfo");

const sendPlayerPos = ctx => {
  ctx.sp.on('update', () => {
    const player = ctx.sp.Game.getPlayer();
    if (!player) return;
    const [x, y, z] = [player.getPositionX(), player.getPositionY(), player.getPositionZ()];
    const [xF, yF, zF] = [x.toFixed(), y.toFixed(), z.toFixed()];
    if (xF === ctx.state.lastPosX && yF === ctx.state.lastPosY && zF === ctx.state.lastPosZ) return;
    const src = [];
    src.push(`window.playerPos = ${JSON.stringify([x, y, z])}`);

    try {
      ctx.sp.browser.executeJavaScript(src.join('\n'));
    } catch (error) {}

    ctx.state.lastPosX = xF;
    ctx.state.lastPosY = yF;
    ctx.state.lastPosZ = zF;
  });
};

exports.sendPlayerPos = sendPlayerPos;

const showNicknames = ctx => {
  ctx.sp.on('update', () => {
    const ac1 = ctx.sp.Actor.from(ctx.sp.Game.getFormEx(85837870));
    if (!ac1) return;
    const [x, y, z] = [ac1.getPositionX(), ac1.getPositionY(), ac1.getPositionZ()];
    const [[x1, y1, z1]] = ctx.sp.worldPointToScreenPoint([x, y, z]);
    const [xF, yF, zF] = [x1.toFixed(4), y1.toFixed(4), z1.toFixed(4)];
    if (xF === ctx.state.lastScreenPosX && yF === ctx.state.lastScreenPosY) return;
    ctx.sp.printConsole(x, y, z);
    ctx.sp.printConsole(x1, y1, z1);
    ctx.sp.printConsole(xF, yF, zF);
    ctx.sp.printConsole({
      text: ac1.getDisplayName(),
      posX: x1 * 100,
      posY: y1 * 100
    });
    const nick = [{
      text: ac1.getDisplayName(),
      posX: x1 < 0 ? 0 : (x1 + 0) * 100,
      posY: y1 < 0 ? 0 : y1 * 100
    }];
    const src = [];
    src.push(`
      window.storage.dispatch({
        type: 'COMMAND',
        data: {
          commandType: 'NICKNAMES_UPDATE',
          alter: ['${JSON.stringify(nick)}']
        }
      })
    `);

    try {
      ctx.sp.browser.executeJavaScript(src.join('\n'));
    } catch (error) {}

    ctx.state.lastScreenPosX = xF;
    ctx.state.lastScreenPosY = yF;
  });
};

exports.showNicknames = showNicknames;

const showNick = (mp, playerId, neighbors) => {
  const func2 = (ctx, itemsString) => {
    (() => {
      try {
        const items = JSON.parse(itemsString);
        const nicks = items.map(i => {
          const [[x, y, z]] = ctx.sp.worldPointToScreenPoint(i.pos);
          const ratio = (1 - z) * 20;
          return {
            text: i.text,
            posX: x * 100,
            posY: y * 100,
            posZ: z * 100,
            ratio
          };
        }).filter(x => x.posX >= 0 && x.posX <= 100 && x.posY >= 0 && x.posY <= 100 && x.posZ >= 0 && x.posZ <= 100 && x.ratio >= 0.25 && x.ratio <= 0.9);
        const src = [];
        src.push(`
        window.storage.dispatch({
          type: 'COMMAND',
          data: {
            commandType: 'NICKNAMES_UPDATE',
            alter: ['${JSON.stringify(nicks)}']
          }
        })
        `);
        ctx.sp.browser.executeJavaScript(src.join('\n'));
      } catch (err) {
        ctx.sp.printConsole('error', err);
      }
    })();
  };

  const items = neighbors.filter(n => mp.get(n, 'worldOrCellDesc') !== '0').map(n => {
    const pos = mp.get(n, 'pos');
    const nForm = (0, _game.getForm)(mp, null, [n]);
    const text = nForm && (0, _objectReference.getDisplayName)(mp, nForm);
    return {
      pos,
      text
    };
  });
  (0, _eval.evalClient)(mp, playerId, new _functionInfo.FunctionInfo(func2).getText({
    itemsString: JSON.stringify(items)
  }), false, true);
};

exports.showNick = showNick;
},{"../papyrus/game":"WCBi","../papyrus/objectReference":"YRYD","../properties/eval":"mJTA","../utils/functionInfo":"fC7F"}],"eVF9":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.register = void 0;

var _ = require("../..");

var _functionInfo = require("../utils/functionInfo");

var _emptyFunctions = require("./empty-functions");

var _shared = require("./shared");

const register = mp => {
  mp.makeEventSource('_empty01', new _functionInfo.FunctionInfo(_emptyFunctions.sendPlayerPos).body);

  if (mp.timer) {
    clearTimeout(mp.timer);
  }

  const serverOptions = _.serverOptionProvider.getServerOptions();

  if (serverOptions.enableInterval) {
    const interval = () => {
      mp.timer = setTimeout(() => {
        mp.get(0, 'onlinePlayers').forEach(id => {
          const neighbors = mp.get(id, 'neighbors').filter(n => mp.get(n, 'type') === 'MpActor');
          neighbors.forEach(n => {
            (0, _shared.throwOrInit)(mp, n, serverOptions);
          });
        });
        interval();
      }, 200);
    };

    interval();
  }
};

exports.register = register;
},{"../..":"QCba","../utils/functionInfo":"fC7F","./empty-functions":"A7KX","./shared":"jnne"}],"dvBS":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.register = exports.getFlags = void 0;

var _papyrusArgs = require("../utils/papyrusArgs");

const MGEF_FLGS = {
  Hostile: 0x00000001,
  Recover: 0x00000002,
  Detrimental: 0x00000004,
  'Snap to Navmesh': 0x00000008,
  'No Hit Event': 0x00000010,
  'Dispel Effects (toggle keywords to dispel type?)': 0x00000100,
  'No Duration': 0x00000200,
  'No Magnitude': 0x00000400,
  'No Area': 0x00000800,
  'FX Persist': 0x00001000,
  'Gory Visual': 0x00004000,
  'Hide in UI': 0x00008000,
  'No Recast': 0x00020000,
  'Power Affects Magnitude': 0x00200000,
  'Power Affects Duration': 0x00400000,
  Painless: 0x04000000,
  'No Hit Effect': 0x08000000,
  'No Death Dispel': 0x10000000
};

const getFlags = (mp, self, args) => {
  var _espmRecord$record, _espmRecord$record$fi;

  const id = (0, _papyrusArgs.getNumber)(args, 0);
  const espmRecord = mp.lookupEspmRecordById(id);
  const d = (_espmRecord$record = espmRecord.record) === null || _espmRecord$record === void 0 ? void 0 : (_espmRecord$record$fi = _espmRecord$record.fields.find(x => x.type === 'DATA')) === null || _espmRecord$record$fi === void 0 ? void 0 : _espmRecord$record$fi.data;
  const flgs = [];

  if (d) {
    const dv = new DataView(d.buffer);
    let fl = dv.getUint32(0, true);
    Object.keys(MGEF_FLGS).reverse().forEach(k => {
      if (fl - MGEF_FLGS[k] >= 0) {
        flgs.push(MGEF_FLGS[k]);
        fl -= MGEF_FLGS[k];
      }
    });
  }

  return flgs;
};

exports.getFlags = getFlags;

const register = mp => {};

exports.register = register;
},{"../utils/papyrusArgs":"oZY1"}],"sC2V":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.conditionFunctions = void 0;
const conditionFunctions = ['GetWantBlocking', 'GetDistance', 'AddItem', 'SetEssential', 'Rotate', 'GetLocked', 'GetPos', 'SetPos', 'GetAngle', 'SetAngle', 'GetStartingPos', 'GetStartingAngle', 'GetSecondsPassed', 'Activate', 'GetActorValue', 'SetActorValue', 'ModActorValue', 'SetAtStart', 'GetCurrentTime', 'PlayGroup', 'LoopGroup', 'SkipAnim', 'StartCombat', 'StopCombat', 'GetScale', 'IsMoving', 'IsTurning', 'GetLineOfSight', 'AddSpell', 'RemoveSpell', 'Cast', 'GetButtonPressed', 'GetInSameCell', 'Enable', 'Disable', 'GetDisabled', 'MenuMode', 'PlaceAtMe', 'PlaySound', 'GetDisease', 'FailAllObjectives', 'GetClothingValue', 'SameFaction', 'SameRace', 'SameSex', 'GetDetected', 'GetDead', 'GetItemCount', 'GetGold', 'GetSleeping', 'GetTalkedToPC', 'Say', 'SayTo', 'GetScriptVariable', 'StartQuest', 'StopQuest', 'GetQuestRunning', 'SetStage', 'GetStage', 'GetStageDone', 'GetFactionRankDifference', 'GetAlarmed', 'IsRaining', 'GetAttacked', 'GetIsCreature', 'GetLockLevel', 'GetShouldAttack', 'GetInCell', 'GetIsClass', 'GetIsRace', 'GetIsSex', 'GetInFaction', 'GetIsID', 'GetFactionRank', 'GetGlobalValue', 'IsSnowing', 'FastTravel', 'GetRandomPercent', 'RemoveMusic', 'GetQuestVariable', 'GetLevel', 'IsRotating', 'RemoveItem', 'GetLeveledEncounterValue', 'GetDeadCount', 'AddToMap', 'StartConversation', 'Drop', 'AddTopic', 'ShowMessage', 'SetAlert', 'GetIsAlerted', 'Look', 'StopLook', 'EvaluatePackage', 'SendAssaultAlarm', 'EnablePlayerControls', 'DisablePlayerControls', 'GetPlayerControlsDisabled', 'GetHeadingAngle', 'PickIdle', 'IsWeaponMagicOut', 'IsTorchOut', 'IsShieldOut', 'CreateDetectionEvent', 'IsActionRef', 'IsFacingUp', 'GetKnockedState', 'GetWeaponAnimType', 'IsWeaponSkillType', 'GetCurrentAIPackage', 'IsWaiting', 'IsIdlePlaying', 'CompleteQuest', 'Lock', 'UnLock', 'IsIntimidatedbyPlayer', 'IsPlayerInRegion', 'GetActorAggroRadiusViolated', 'GetCrimeKnown', 'SetEnemy', 'SetAlly', 'GetCrime', 'IsGreetingPlayer', 'StartMisterSandMan', 'IsGuard', 'StartCannibal', 'HasBeenEaten', 'GetStaminaPercentage', 'GetPCIsClass', 'GetPCIsRace', 'GetPCIsSex', 'GetPCInFaction', 'SameFactionAsPC', 'SameRaceAsPC', 'SameSexAsPC', 'GetIsReference', 'SetFactionRank', 'ModFactionRank', 'KillActor', 'ResurrectActor', 'IsTalking', 'GetWalkSpeed', 'GetCurrentAIProcedure', 'GetTrespassWarningLevel', 'IsTrespassing', 'IsInMyOwnedCell', 'GetWindSpeed', 'GetCurrentWeatherPercent', 'GetIsCurrentWeather', 'IsContinuingPackagePCNear', 'SetCrimeFaction', 'GetIsCrimeFaction', 'CanHaveFlames', 'HasFlames', 'AddFlames', 'RemoveFlames', 'GetOpenState', 'MoveToMarker', 'GetSitting', 'GetFurnitureMarkerID', 'GetIsCurrentPackage', 'IsCurrentFurnitureRef', 'IsCurrentFurnitureObj', 'SetSize', 'RemoveMe', 'DropMe', 'GetFactionReaction', 'SetFactionReaction', 'ModFactionReaction', 'GetDayOfWeek', 'IgnoreCrime', 'GetTalkedToPCParam', 'RemoveAllItems', 'WakeUpPC', 'IsPCSleeping', 'IsPCAMurderer', 'SetCombatStyle', 'PlaySound3D', 'SelectPlayerSpell', 'HasSameEditorLocAsRef', 'HasSameEditorLocAsRefAlias', 'GetEquipped', 'Wait', 'StopWaiting', 'IsSwimming', 'ScriptEffectElapsedSeconds', 'SetCellPublicFlag', 'GetPCSleepHours', 'SetPCSleepHours', 'GetAmountSoldStolen', 'ModAmountSoldStolen', 'GetIgnoreCrime', 'GetPCExpelled', 'SetPCExpelled', 'GetPCFactionMurder', 'SetPCFactionMurder', 'GetPCEnemyofFaction', 'SetPCEnemyofFaction', 'GetPCFactionAttack', 'SetPCFactionAttack', 'StartScene', 'StopScene', 'GetDestroyed', 'SetDestroyed', 'GetActionRef', 'GetSelf', 'GetContainer', 'GetForceRun', 'SetForceRun', 'GetForceSneak', 'SetForceSneak', 'AdvancePCSkill', 'AdvancePCLevel', 'HasMagicEffect', 'GetDefaultOpen', 'SetDefaultOpen', 'ShowClassMenu', 'ShowRaceMenu', 'GetAnimAction', 'ShowNameMenu', 'SetOpenState', 'ResetReference', 'IsSpellTarget', 'GetVATSMode', 'GetPersuasionNumber', 'GetVampireFeed', 'GetCannibal', 'GetIsClassDefault', 'GetClassDefaultMatch', 'GetInCellParam', 'UnusedFunction1', 'GetCombatTarget', 'GetPackageTarget', 'ShowSpellMaking', 'GetVatsTargetHeight', 'SetGhost', 'GetIsGhost', 'EquipItem', 'UnequipItem', 'SetClass', 'SetUnconscious', 'GetUnconscious', 'SetRestrained', 'GetRestrained', 'ForceFlee', 'GetIsUsedItem', 'GetIsUsedItemType', 'IsScenePlaying', 'IsInDialogueWithPlayer', 'GetLocationCleared', 'SetLocationCleared', 'ForceRefIntoAlias', 'EmptyRefAlias', 'GetIsPlayableRace', 'GetOffersServicesNow', 'GetGameSetting', 'StopCombatAlarmOnActor', 'HasAssociationType', 'HasFamilyRelationship', 'SetWeather', 'HasParentRelationship', 'IsWarningAbout', 'IsWeaponOut', 'HasSpell', 'IsTimePassing', 'IsPleasant', 'IsCloudy', 'TrapUpdate', 'ShowQuestObjectives', 'ForceActorValue', 'IncrementPCSkill', 'DoTrap', 'EnableFastTravel', 'IsSmallBump', 'GetParentRef', 'PlayBink', 'GetBaseActorValue', 'IsOwner', 'SetOwnership', 'IsCellOwner', 'SetCellOwnership', 'IsHorseStolen', 'SetCellFullName', 'SetActorFullName', 'IsLeftUp', 'IsSneaking', 'IsRunning', 'GetFriendHit', 'IsInCombat', 'SetPackDuration', 'PlayMagicShaderVisuals', 'PlayMagicEffectVisuals', 'StopMagicShaderVisuals', 'StopMagicEffectVisuals', 'ResetInterior', 'IsAnimPlaying', 'SetActorAlpha', 'EnableLinkedPathPoints', 'DisableLinkedPathPoints', 'IsInInterior', 'ForceWeather', 'ToggleActorsAI', 'IsActorsAIOff', 'IsWaterObject', 'GetPlayerAction', 'IsActorUsingATorch', 'SetLevel', 'ResetFallDamageTimer', 'IsXBox', 'GetInWorldspace', 'ModPCMiscStat', 'GetPCMiscStat', 'GetPairedAnimation', 'IsActorAVictim', 'GetTotalPersuasionNumber', 'SetScale', 'ModScale', 'GetIdleDoneOnce', 'KillAllActors', 'GetNoRumors', 'SetNoRumors', 'Dispel', 'GetCombatState', 'TriggerHitShader', 'GetWithinPackageLocation', 'Reset3DState', 'IsRidingHorse', 'DispelAllSpells', 'IsFleeing', 'AddAchievement', 'DuplicateAllItems', 'IsInDangerousWater', 'EssentialDeathReload', 'SetShowQuestItems', 'DuplicateNPCStats', 'ResetHealth', 'SetIgnoreFriendlyHits', 'GetIgnoreFriendlyHits', 'IsPlayersLastRiddenHorse', 'SetActorRefraction', 'SetItemValue', 'SetRigidBodyMass', 'ShowViewerStrings', 'ReleaseWeatherOverride', 'SetAllReachable', 'SetAllVisible', 'SetNoAvoidance', 'SendTrespassAlarm', 'SetSceneIsComplex', 'Autosave', 'StartMasterFileSeekData', 'DumpMasterFileSeekData', 'IsActor', 'IsEssential', 'PreloadMagicEffect', 'ShowDialogSubtitles', 'SetPlayerResistingArrest', 'IsPlayerMovingIntoNewSpace', 'GetInCurrentLoc', 'GetInCurrentLocAlias', 'GetTimeDead', 'HasLinkedRef', 'GetLinkedRef', 'DamageObject', 'IsChild', 'GetStolenItemValueNoCrime', 'GetLastPlayerAction', 'IsPlayerActionActive', 'SetTalkingActivatorActor', 'IsTalkingActivatorActor', 'ShowBarterMenu', 'IsInList', 'GetStolenItemValue', 'AddPerk', 'GetCrimeGoldViolent', 'GetCrimeGoldNonviolent', 'ShowRepairMenu', 'HasShout', 'AddNote', 'RemoveNote', 'GetHasNote', 'AddToFaction', 'RemoveFromFaction', 'DamageActorValue', 'RestoreActorValue', 'TriggerHUDShudder', 'GetObjectiveFailed', 'SetObjectiveFailed', 'SetGlobalTimeMultiplier', 'GetHitLocation', 'IsPC1stPerson', 'PurgeCellBuffers', 'PushActorAway', 'SetActorsAI', 'ClearOwnership', 'GetCauseofDeath', 'IsLimbGone', 'IsWeaponInList', 'PlayIdle', 'ApplyImageSpaceModifier', 'RemoveImageSpaceModifier', 'IsBribedbyPlayer', 'GetRelationshipRank', 'SetRelationshipRank', 'SetCellImageSpace', 'ShowChargenMenu', 'GetVATSValue', 'IsKiller', 'IsKillerObject', 'GetFactionCombatReaction', 'UseWeapon', 'EvaluateSpellConditions', 'ToggleMotionBlur', 'Exists', 'GetGroupMemberCount', 'GetGroupTargetCount', 'SetObjectiveCompleted', 'SetObjectiveDisplayed', 'GetObjectiveCompleted', 'GetObjectiveDisplayed', 'SetImageSpace', 'PipboyRadio', 'RemovePerk', 'DisableAllActors', 'GetIsFormType', 'GetIsVoiceType', 'GetPlantedExplosive', 'CompleteAllObjectives', 'IsScenePackageRunning', 'GetHealthPercentage', 'SetAudioMultithreading', 'GetIsObjectType', 'ShowChargenMenuParams', 'GetDialogueEmotion', 'GetDialogueEmotionValue', 'ExitGame', 'GetIsCreatureType', 'PlayerCreatePotion', 'PlayerEnchantObject', 'ShowWarning', 'EnterTrigger', 'MarkForDelete', 'SetPlayerAIDriven', 'GetInCurrentLocFormList', 'GetInZone', 'GetVelocity', 'GetGraphVariableFloat', 'HasPerk', 'GetFactionRelation', 'IsLastIdlePlayed', 'SetNPCRadio', 'SetPlayerTeammate', 'GetPlayerTeammate', 'GetPlayerTeammateCount', 'OpenActorContainer', 'ClearFactionPlayerEnemyFlag', 'ClearActorsFactionsPlayerEnemyFlag', 'GetActorCrimePlayerEnemy', 'GetCrimeGold', 'SetCrimeGold', 'ModCrimeGold', 'GetPlayerGrabbedRef', 'IsPlayerGrabbedRef', 'PlaceLeveledActorAtMe', 'GetKeywordItemCount', 'ShowLockpickMenu', 'GetBroadcastState', 'SetBroadcastState', 'StartRadioConversation', 'GetDestructionStage', 'ClearDestruction', 'CastImmediateOnSelf', 'GetIsAlignment', 'ResetQuest', 'SetQuestDelay', 'IsProtected', 'GetThreatRatio', 'MatchFaceGeometry', 'GetIsUsedItemEquipType', 'GetPlayerName', 'FireWeapon', 'PayCrimeGold', 'UnusedFunction2', 'MatchRace', 'SetPCYoung', 'SexChange', 'IsCarryable', 'GetConcussed', 'SetZoneRespawns', 'SetVATSTarget', 'GetMapMarkerVisible', 'ResetInventory', 'PlayerKnows', 'GetPermanentActorValue', 'GetKillingBlowLimb', 'GoToJail', 'CanPayCrimeGold', 'ServeTime', 'GetDaysInJail', 'EPAlchemyGetMakingPoison', 'EPAlchemyEffectHasKeyword', 'ShowAllMapMarkers', 'GetAllowWorldInteractions', 'ResetAI', 'SetRumble', 'SetNoActivationSound', 'ClearNoActivationSound', 'GetLastHitCritical', 'AddMusic', 'UnusedFunction3', 'UnusedFunction4', 'SetPCToddler', 'IsCombatTarget', 'TriggerScreenBlood', 'GetVATSRightAreaFree', 'GetVATSLeftAreaFree', 'GetVATSBackAreaFree', 'GetVATSFrontAreaFree', 'GetIsLockBroken', 'IsPS3', 'IsWin32', 'GetVATSRightTargetVisible', 'GetVATSLeftTargetVisible', 'GetVATSBackTargetVisible', 'GetVATSFrontTargetVisible', 'AttachAshPile', 'SetCriticalStage', 'IsInCriticalStage', 'RemoveFromAllFactions', 'GetXPForNextLevel', 'ShowLockpickMenuDebug', 'ForceSave', 'GetInfamy', 'GetInfamyViolent', 'GetInfamyNonViolent', 'UnusedFunction5', 'Sin', 'Cos', 'Tan', 'Sqrt', 'Log', 'Abs', 'GetQuestCompleted', 'UnusedFunction6', 'PipBoyRadioOff', 'AutoDisplayObjectives', 'IsGoreDisabled', 'FadeSFX', 'SetMinimalUse', 'IsSceneActionComplete', 'ShowQuestStages', 'GetSpellUsageNum', 'ForceRadioStationUpdate', 'GetActorsInHigh', 'HasLoaded3D', 'DisableAllMines', 'SetLastExtDoorActivated', 'KillQuestUpdates', 'IsImageSpaceActive', 'HasKeyword', 'HasRefType', 'LocationHasKeyword', 'LocationHasRefType', 'CreateEvent', 'GetIsEditorLocation', 'GetIsAliasRef', 'GetIsEditorLocAlias', 'IsSprinting', 'IsBlocking', 'HasEquippedSpell', 'GetCurrentCastingType', 'GetCurrentDeliveryType', 'EquipSpell', 'GetAttackState', 'GetAliasedRef', 'GetEventData', 'IsCloserToAThanB', 'EquipShout', 'GetEquippedShout', 'IsBleedingOut', 'UnlockWord', 'TeachWord', 'AddToContainer', 'GetRelativeAngle', 'SendAnimEvent', 'Shout', 'AddShout', 'RemoveShout', 'GetMovementDirection', 'IsInScene', 'GetRefTypeDeadCount', 'GetRefTypeAliveCount', 'ApplyHavokImpulse', 'GetIsFlying', 'IsCurrentSpell', 'SpellHasKeyword', 'GetEquippedItemType', 'GetLocationAliasCleared', 'SetLocationAliasCleared', 'GetLocAliasRefTypeDeadCount', 'GetLocAliasRefTypeAliveCount', 'IsWardState', 'IsInSameCurrentLocAsRef', 'IsInSameCurrentLocAsRefAlias', 'LocAliasIsLocation', 'GetKeywordDataForLocation', 'SetKeywordDataForLocation', 'GetKeywordDataForAlias', 'SetKeywordDataForAlias', 'LocAliasHasKeyword', 'IsNullPackageData', 'GetNumericPackageData', 'IsFurnitureAnimType', 'IsFurnitureEntryType', 'GetHighestRelationshipRank', 'GetLowestRelationshipRank', 'HasAssociationTypeAny', 'HasFamilyRelationshipAny', 'GetPathingTargetOffset', 'GetPathingTargetAngleOffset', 'GetPathingTargetSpeed', 'GetPathingTargetSpeedAngle', 'GetMovementSpeed', 'GetInContainer', 'IsLocationLoaded', 'IsLocAliasLoaded', 'IsDualCasting', 'DualCast', 'GetVMQuestVariable', 'GetVMScriptVariable', 'IsEnteringInteractionQuick', 'IsCasting', 'GetFlyingState', 'SetFavorState', 'IsInFavorState', 'HasTwoHandedWeaponEquipped', 'IsExitingInstant', 'IsInFriendStatewithPlayer', 'GetWithinDistance', 'GetActorValuePercent', 'IsUnique', 'GetLastBumpDirection', 'CameraShake', 'IsInFurnitureState', 'GetIsInjured', 'GetIsCrashLandRequest', 'GetIsHastyLandRequest', 'UpdateQuestInstanceGlobal', 'SetAllowFlying', 'IsLinkedTo', 'GetKeywordDataForCurrentLocation', 'GetInSharedCrimeFaction', 'GetBribeAmount', 'GetBribeSuccess', 'GetIntimidateSuccess', 'GetArrestedState', 'GetArrestingActor', 'ClearArrestState', 'EPTemperingItemIsEnchanted', 'EPTemperingItemHasKeyword', 'GetReceivedGiftValue', 'GetGiftGivenValue', 'ForceLocIntoAlias', 'GetReplacedItemType', 'SetHorseActor', 'PlayReferenceEffect', 'StopReferenceEffect', 'PlayShaderParticleGeometry', 'StopShaderParticleGeometry', 'ApplyImageSpaceModifierCrossFade', 'RemoveImageSpaceModifierCrossFade', 'IsAttacking', 'IsPowerAttacking', 'IsLastHostileActor', 'GetGraphVariableInt', 'GetCurrentShoutVariation', 'PlayImpactEffect', 'ShouldAttackKill', 'SendStealAlarm', 'GetActivationHeight', 'EPModSkillUsage_IsAdvanceSkill', 'WornHasKeyword', 'GetPathingCurrentSpeed', 'GetPathingCurrentSpeedAngle', 'KnockAreaEffect', 'InterruptCast', 'AddFormToFormList', 'RevertFormList', 'AddFormToLeveledList', 'RevertLeveledList', 'EPModSkillUsage_AdvanceObjectHasKeyword', 'EPModSkillUsage_IsAdvanceAction', 'EPMagic_SpellHasKeyword', 'GetNoBleedoutRecovery', 'SetNoBleedoutRecovery', 'EPMagic_SpellHasSkill', 'IsAttackType', 'IsAllowedToFly', 'HasMagicEffectKeyword', 'IsCommandedActor', 'IsStaggered', 'IsRecoiling', 'IsExitingInteractionQuick', 'IsPathing', 'GetShouldHelp', 'HasBoundWeaponEquipped', 'GetCombatTargetHasKeyword', 'UpdateLevel', 'GetCombatGroupMemberCount', 'IsIgnoringCombat', 'GetLightLevel', 'SavePCFace', 'SpellHasCastingPerk', 'IsBeingRidden', 'IsUndead', 'GetRealHoursPassed', 'UnequipAll', 'IsUnlockedDoor', 'IsHostileToActor', 'GetTargetHeight', 'IsPoison', 'WornApparelHasKeywordCount', 'GetItemHealthPercent', 'EffectWasDualCast', 'GetKnockStateEnum', 'DoesNotExist'];
exports.conditionFunctions = conditionFunctions;
},{}],"x9IM":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EffectSection = exports.EffectFunctionType = exports.ConditionRunOn = exports.ConditionOperator = exports.ConditionFlag = void 0;
var ConditionOperator;
exports.ConditionOperator = ConditionOperator;

(function (ConditionOperator) {
  ConditionOperator[ConditionOperator["EqualTo"] = 0] = "EqualTo";
  ConditionOperator[ConditionOperator["NotEqualTo"] = 1] = "NotEqualTo";
  ConditionOperator[ConditionOperator["GreaterThan"] = 2] = "GreaterThan";
  ConditionOperator[ConditionOperator["GreaterThanOrEqualTo"] = 3] = "GreaterThanOrEqualTo";
  ConditionOperator[ConditionOperator["LessThan"] = 4] = "LessThan";
  ConditionOperator[ConditionOperator["LessThanOrEqualTo"] = 5] = "LessThanOrEqualTo";
})(ConditionOperator || (exports.ConditionOperator = ConditionOperator = {}));

var ConditionFlag;
exports.ConditionFlag = ConditionFlag;

(function (ConditionFlag) {
  ConditionFlag[ConditionFlag["AND"] = 0] = "AND";
  ConditionFlag[ConditionFlag["OR"] = 1] = "OR";
})(ConditionFlag || (exports.ConditionFlag = ConditionFlag = {}));

var ConditionRunOn;
exports.ConditionRunOn = ConditionRunOn;

(function (ConditionRunOn) {
  ConditionRunOn[ConditionRunOn["Subjec"] = 0] = "Subjec";
  ConditionRunOn[ConditionRunOn["Targe"] = 1] = "Targe";
  ConditionRunOn[ConditionRunOn["Reference"] = 2] = "Reference";
  ConditionRunOn[ConditionRunOn["Combat"] = 3] = "Combat";
  ConditionRunOn[ConditionRunOn["Linked"] = 4] = "Linked";
  ConditionRunOn[ConditionRunOn["Quest"] = 5] = "Quest";
  ConditionRunOn[ConditionRunOn["Package"] = 6] = "Package";
  ConditionRunOn[ConditionRunOn["Event"] = 7] = "Event";
})(ConditionRunOn || (exports.ConditionRunOn = ConditionRunOn = {}));

var EffectSection;
exports.EffectSection = EffectSection;

(function (EffectSection) {
  EffectSection[EffectSection["Quest"] = 0] = "Quest";
  EffectSection[EffectSection["Ability"] = 1] = "Ability";
  EffectSection[EffectSection["Complex"] = 2] = "Complex";
})(EffectSection || (exports.EffectSection = EffectSection = {}));

var EffectFunctionType;
exports.EffectFunctionType = EffectFunctionType;

(function (EffectFunctionType) {
  EffectFunctionType[EffectFunctionType["None"] = 0] = "None";
  EffectFunctionType[EffectFunctionType["SetValue"] = 1] = "SetValue";
  EffectFunctionType[EffectFunctionType["AddValue"] = 2] = "AddValue";
  EffectFunctionType[EffectFunctionType["MultiplyValue"] = 3] = "MultiplyValue";
  EffectFunctionType[EffectFunctionType["AddRangeToValue"] = 4] = "AddRangeToValue";
  EffectFunctionType[EffectFunctionType["AddActorValueMult"] = 5] = "AddActorValueMult";
  EffectFunctionType[EffectFunctionType["Absolute"] = 6] = "Absolute";
  EffectFunctionType[EffectFunctionType["NegativeABSValue"] = 7] = "NegativeABSValue";
  EffectFunctionType[EffectFunctionType["AddLevelList"] = 8] = "AddLevelList";
  EffectFunctionType[EffectFunctionType["AddActivateChoice"] = 9] = "AddActivateChoice";
  EffectFunctionType[EffectFunctionType["SelectSpell"] = 10] = "SelectSpell";
  EffectFunctionType[EffectFunctionType["SelectText"] = 11] = "SelectText";
  EffectFunctionType[EffectFunctionType["SetAVMult"] = 12] = "SetAVMult";
  EffectFunctionType[EffectFunctionType["MultiplyAVMult"] = 13] = "MultiplyAVMult";
  EffectFunctionType[EffectFunctionType["Multiply1PlusAVMult"] = 14] = "Multiply1PlusAVMult";
  EffectFunctionType[EffectFunctionType["SetText"] = 15] = "SetText";
})(EffectFunctionType || (exports.EffectFunctionType = EffectFunctionType = {}));
},{}],"lgGM":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.conditionResult = exports.conditionAllResult = void 0;

var _helper = require("../../utils/helper");

var _keywords = require("../form/keywords");

var _functionList = require("./functionList");

var _type = require("./type");

const conditionAllResult = (mp, conditionFields, subjectId) => {
  const condResults = [];
  conditionFields.forEach(cf => {
    if (!cf) return;
    const result = conditionResult(mp, cf.data.buffer, subjectId);
    if (result === undefined) return;
    condResults.push(result);
  });

  if (condResults[0].flag === _type.ConditionFlag.AND) {
    return condResults.every(c => c.result);
  }

  if (condResults[0].flag === _type.ConditionFlag.OR) {
    return condResults.some(c => c.result);
  }

  return false;
};

exports.conditionAllResult = conditionAllResult;

const conditionResult = (mp, cond, subjectId) => {
  const flags = (0, _helper.uint8)(cond.slice(0, 5), 0);
  const operator = (0, _helper.uint8)(cond.slice(5, 8), 0);
  const value = (0, _helper.float32)(cond, 4);
  const func = (0, _helper.uint16)(cond, 8);
  const param1 = (0, _helper.int32)(cond, 12);

  if (operator === _type.ConditionOperator.EqualTo) {
    if (_functionList.conditionFunctions[func] === 'HasKeyword') {
      const funcResult = (0, _keywords.hasKeywordEx)(mp, null, [subjectId, param1]);
      const condResult = !!value === funcResult;
      return {
        flag: flags & _type.ConditionFlag.OR ? _type.ConditionFlag.OR : _type.ConditionFlag.AND,
        result: condResult
      };
    }
  }
};

exports.conditionResult = conditionResult;
},{"../../utils/helper":"FxH1","../form/keywords":"D1sz","./functionList":"sC2V","./type":"x9IM"}],"Fep9":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.register = exports.getPerkEffectData = void 0;

var _helper = require("../../utils/helper");

var _condition = require("./condition");

var _type = require("./type");

const getPerkEffectData = (mp, perkId, subjectId) => {
  var _perkRec$record;

  const perkRec = mp.lookupEspmRecordById(perkId);
  const perkRecFields = (_perkRec$record = perkRec.record) === null || _perkRec$record === void 0 ? void 0 : _perkRec$record.fields;
  if (!perkRecFields) return;
  const perkDataIndexies = [];
  let start = 0;
  let end = 0;
  perkRecFields.forEach((rec, i) => {
    if (rec.type === 'PRKE') {
      start = i;
    }

    if (rec.type === 'PRKF') {
      end = i;
      perkDataIndexies.push({
        start,
        end
      });
    }
  });
  return perkDataIndexies.map(index => {
    const fields = perkRecFields.slice(index.start, index.end + 1);
    const header = fields[0].data;

    if (header[0] === _type.EffectSection.Complex) {
      var _fields$find, _fields$find2;

      const effectType = (0, _helper.uint8)(fields[1].data.buffer, 0);
      const functionType = (0, _helper.uint8)(fields[1].data.buffer, 1);
      const CondTypeCount = fields.filter(x => x.type === 'CTDA');
      let conditionResult = CondTypeCount.length === 0;
      let conditionFunction;

      if (CondTypeCount.length > 0) {
        if (effectType === 0x23 && functionType === _type.EffectFunctionType.MultiplyValue) {
          if (subjectId) {
            conditionResult = (0, _condition.conditionAllResult)(mp, CondTypeCount, subjectId);
          }

          conditionFunction = subjectId => {
            return (0, _condition.conditionAllResult)(mp, CondTypeCount, subjectId);
          };
        }
      }

      const epft = (_fields$find = fields.find(x => x.type === 'EPFT')) === null || _fields$find === void 0 ? void 0 : _fields$find.data.buffer;
      const epfd = (_fields$find2 = fields.find(x => x.type === 'EPFD')) === null || _fields$find2 === void 0 ? void 0 : _fields$find2.data.buffer;
      const valueType = epft ? (0, _helper.uint8)(epft, 0) : 0;
      const effectValue = epfd ? valueType === 1 ? (0, _helper.float32)(epfd, 0) : 0 : 0;
      return {
        effectType,
        functionType,
        conditionResult,
        effectValue,
        conditionFunction
      };
    }
  });
};

exports.getPerkEffectData = getPerkEffectData;

const register = mp => {};

exports.register = register;
},{"../../utils/helper":"FxH1","./condition":"lgGM","./type":"x9IM"}],"e1XF":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.register = void 0;

var _ = require("../..");

var _equip = require("../papyrus/actor/equip");

var _form = require("../papyrus/form");

var _perk = require("../papyrus/perk");

var _type = require("../papyrus/perk/type");

var _race = require("../papyrus/race");

var _type2 = require("../papyrus/weapon/type");

var _functionInfo = require("../utils/functionInfo");

var _helper = require("../utils/helper");

var _functions = require("./functions");

var _attributes = require("../properties/actor/actorValues/attributes");

var p = _interopRequireWildcard(require("../modules"));

var _shared = require("./shared");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const hitHandle = (mp, event, target, agressor) => {
  mp.callPapyrusFunction('global', 'GM_Main', '_onHit', null, [target, agressor, event.isPowerAttack, event.isSneakAttack, event.isBashAttack, event.isHitBlocked]);
  mp.modules.forEach(module => {
    try {
      if (!module.onHit) return;
      const s = Date.now();
      module.onHit(new p.Actor(target), new p.Actor(agressor), event.isPowerAttack, event.isSneakAttack, event.isBashAttack, event.isHitBlocked);
      (0, _shared.logExecuteTime)(s, `${module.name}.onHit`);
    } catch (err) {
      console.error(`error in module ${module.name} onHit`, err);
    }
  });
};

const hitSync = (mp, pcFormId, event, target, agressor, isDead) => {
  const {
    HitDamageMod,
    isPowerAttackMult,
    isBashAttackMult
  } = _.serverOptionProvider.getServerOptions();

  let damageMod = HitDamageMod;
  const raceId = mp.get(pcFormId, 'race');

  if (raceId) {
    const espmRecord = mp.lookupEspmRecordById(raceId);
    const unarmedDamage = (0, _race.getRaceUnarmedDamage)(espmRecord);
    if (unarmedDamage) damageMod = -unarmedDamage;
  }

  const eq = (0, _equip.getEquipment)(mp, event.agressor);
  const eq1 = (0, _equip.getEquipment)(mp, event.target);
  const weap = eq === null || eq === void 0 ? void 0 : eq.inv.entries.filter(x => x.type === 'WEAP');
  const arm = eq1 === null || eq1 === void 0 ? void 0 : eq1.inv.entries.filter(x => x.type === 'ARMO');
  let isHammer = false;

  if (weap && weap.length > 0) {
    const baseDmg = weap[0].baseDamage;
    if (baseDmg) damageMod = baseDmg * -1;
    const type = weap[0].weaponType;
    if (type === _type2.WeaponType.BattleaxesANDWarhammers || type === _type2.WeaponType.Maces) isHammer = true;
  }

  if (arm && arm.length > 0) {
    arm.forEach(x => {
      if (!x.baseArmor) return;
      if (isHammer) x.baseArmor *= 0.75;
      const percent = 1 - x.baseArmor / 1000;
      damageMod *= percent;
    });
  }

  if (event.isPowerAttack) {
    damageMod *= isPowerAttackMult;
  }

  if (event.isBashAttack) {
    damageMod *= isBashAttackMult;
  }

  const calcPerks = false;

  if (calcPerks) {
    const targetId = (0, _form.getSelfId)(mp, agressor.desc);
    const rec = mp.lookupEspmRecordById(targetId).record;
    const prkr = rec === null || rec === void 0 ? void 0 : rec.fields.filter(x => x.type === 'PRKR').map(x => x.data);

    try {
      prkr === null || prkr === void 0 ? void 0 : prkr.forEach(prkrItem => {
        const perkId = (0, _helper.uint32)(prkrItem.buffer, 0);
        const effectData = (0, _perk.getPerkEffectData)(mp, perkId);
        effectData === null || effectData === void 0 ? void 0 : effectData.forEach(eff => {
          if (!eff) return;

          if (eff.effectType === 0x23 && eff.functionType === _type.EffectFunctionType.MultiplyValue) {
            if (!eff.conditionFunction || !weap || weap.length === 0) return;
            const conditionResult = eff.conditionFunction(weap[0].baseId);
            if (!conditionResult) return;

            if (eff.effectValue) {
              damageMod *= eff.effectValue;
            }
          }
        });
      });
    } catch (error) {
      console.log('Perk effect ERROR', error);
    }
  }

  if (event.isHitBlocked) {
    damageMod *= 0.5;
  }

  console.log('[HIT]', damageMod);
  const avName = 'health';

  const damage = _attributes.actorValues.get(event.target, avName, 'damage');

  const newDamageModValue = damage + damageMod;

  _attributes.actorValues.set(event.target, avName, 'damage', newDamageModValue);

  const wouldDie = _attributes.actorValues.getMaximum(event.target, avName) + newDamageModValue <= 0;

  if (wouldDie && !isDead) {
    if (mp.onDeath) mp.onDeath(event.target, event.agressor);
  }
};

const register = mp => {
  mp.makeEventSource('_onHit', new _functionInfo.FunctionInfo(_functions.onHit).getText({
    isHitStatic: false
  }));

  mp._onHit = (pcFormId, event) => {
    var _mp$get;

    const start = Date.now();
    if (!pcFormId) return console.log('Plz reconnect');

    if (event.target === 0x14) {
      event.target = pcFormId;
    }

    if (event.agressor === 0x14) {
      event.agressor = pcFormId;
    }

    const target = {
      type: 'form',
      desc: mp.getDescFromId(event.target)
    };
    const agressor = {
      type: 'form',
      desc: mp.getDescFromId(event.agressor)
    };
    const isDead = (_mp$get = mp.get(event.target, 'isDead')) !== null && _mp$get !== void 0 ? _mp$get : false;

    if (isDead) {
      hitHandle(mp, event, target, agressor);
      return (0, _shared.logExecuteTime)(start, '_onHit');
    }

    if (!mp.get(event.target, 'isInSafeLocation') && !mp.get(event.agressor, 'isInSafeLocation')) {
      hitSync(mp, pcFormId, event, target, agressor, isDead);
    }

    hitHandle(mp, event, target, agressor);
    (0, _shared.logExecuteTime)(start, '_onHit');
  };
};

exports.register = register;
},{"../..":"QCba","../papyrus/actor/equip":"lP44","../papyrus/form":"mnzc","../papyrus/perk":"Fep9","../papyrus/perk/type":"x9IM","../papyrus/race":"AkNH","../papyrus/weapon/type":"Xpf2","../utils/functionInfo":"fC7F","../utils/helper":"FxH1","./functions":"dwII","../properties/actor/actorValues/attributes":"Klzq","../modules":"uozv","./shared":"jnne"}],"YOwo":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleServerMsg = void 0;

const hotReloadModule = (mp, data) => {
  const path = data.path;
  const modulePath = path.replace('data\\', '');
  const moduleName = path.replace('data\\modules\\', '').replace('\\index.js', '');
  console.log(`Reload module ${moduleName}...`);
  const changedModuleIndex = mp.modules.findIndex(x => x.name === moduleName);
  mp.modules.splice(changedModuleIndex, 1);
  const success = mp.loadJSModule(modulePath);
  if (!success) return;
  mp.modules[mp.modules.length - 1].name = moduleName;
  console.log(`Reload module ${moduleName} success!`);
  console.log(mp.modules.map(x => x.name));
};

const handleServerMsg = (mp, pcFormId, data) => {
  switch (data.action) {
    case 'disconnect':
      if (typeof mp.onDisconnect === 'function') mp.onDisconnect(pcFormId);
      break;

    case 'moduleHotReload':
      hotReloadModule(mp, data);
      break;

    default:
      break;
  }
};

exports.handleServerMsg = handleServerMsg;
},{}],"kLvY":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.register = exports.getParent = void 0;

var _ = require("../../..");

const getParent = (mp, self) => {
  var _espmRecord$record, _espmRecord$record$fi;

  const espmRecord = mp.lookupEspmRecordById(mp.getIdFromDesc(self.desc));
  const pnam = (_espmRecord$record = espmRecord.record) === null || _espmRecord$record === void 0 ? void 0 : (_espmRecord$record$fi = _espmRecord$record.fields.find(x => x.type === 'PNAM')) === null || _espmRecord$record$fi === void 0 ? void 0 : _espmRecord$record$fi.data;

  if (pnam) {
    const dataView = new DataView(pnam.buffer);
    return {
      type: 'espm',
      desc: mp.getDescFromId(dataView.getUint32(0, true))
    };
  }

  return null;
};

exports.getParent = getParent;

const register = mp => {
  mp.registerPapyrusFunction('method', 'Location', 'GetParent', self => getParent(mp, self));

  _.ILocation.GetParent = self => getParent(mp, self);
};

exports.register = register;
},{"../../..":"QCba"}],"VJVi":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.register = void 0;

var _game = require("../papyrus/game");

var _attributes = require("../properties/actor/actorValues/attributes");

var _functionInfo = require("../utils/functionInfo");

var _functions = require("./functions");

var empty = _interopRequireWildcard(require("./empty"));

var _activeMagicEffect = require("../papyrus/activeMagicEffect");

var _equip = require("../papyrus/actor/equip");

var position = _interopRequireWildcard(require("../papyrus/objectReference/position"));

var _ = require("../..");

var m = _interopRequireWildcard(require("../modules"));

var _shared = require("./shared");

var _onHit = _interopRequireWildcard(require("./_onHit"));

var _serverMsg = require("./server-msg");

var _functions2 = require("../papyrus/multiplayer/functions");

var _cell = require("../papyrus/cell");

var _location = require("../papyrus/location");

var _objectReference = require("../papyrus/objectReference");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const loadedPc = {};

const register = mp => {
  mp.makeEventSource('_onLoadGame', new _functionInfo.FunctionInfo(_functions.onLoad).body);

  mp._onLoadGame = pcFormId => {
    const start = Date.now();

    if (loadedPc[pcFormId]) {
      console.debug(`${pcFormId.toString(16)} has already been loaded`);
      return;
    }

    loadedPc[pcFormId] = Date.now();
    console.debug('_onLoadGame', pcFormId.toString(16));
    if (!pcFormId) return console.log('Plz reconnect');
    const ac = {
      type: 'form',
      desc: mp.getDescFromId(pcFormId)
    };
    mp.set(pcFormId, 'browserVisible', true);
    mp.set(pcFormId, 'browserModal', false);

    const serverOptions = _.serverOptionProvider.getServerOptions();

    (0, _shared.initAVFromRace)(mp, pcFormId);
    const neighbors = mp.get(pcFormId, 'neighbors');
    neighbors.filter(n => mp.get(n, 'type') === 'MpActor').forEach(id => {
      (0, _shared.throwOrInit)(mp, id, serverOptions);
    });
    const isFirstLoad = mp.get(pcFormId, 'isFirstLoad');

    if (isFirstLoad !== false) {
      mp.set(pcFormId, 'isFirstLoad', !isFirstLoad);
    }

    mp.callPapyrusFunction('global', 'GM_Main', '_OnLoadGame', null, [ac]);
    mp.modules.forEach(module => {
      try {
        if (!module.onLoadGame) return;
        const s = Date.now();
        module.onLoadGame(new m.Actor(ac));
        (0, _shared.logExecuteTime)(s, `${module.name}.onLoadGame`);
      } catch (err) {
        console.error(`error in module ${module.name} onLoadGame`, err);
      }
    });
    (0, _shared.logExecuteTime)(start, '_onLoadGame');
  };

  mp.onActivate = (target, pcFormId) => {
    const start = Date.now();
    if (!pcFormId) return console.log('Plz reconnect');
    const casterRef = {
      type: 'form',
      desc: mp.getDescFromId(pcFormId)
    };
    const targetRef = {
      type: 'form',
      desc: mp.getDescFromId(target)
    };
    const activation = mp.callPapyrusFunction('global', 'GM_Main', '_onActivate', null, [targetRef, casterRef]);
    let activationFromModule = true;
    mp.modules.forEach(module => {
      if (!module.onActivate) return;
      const s = Date.now();

      try {
        const ret = module.onActivate(new m.ObjectReference(targetRef), new m.ObjectReference(casterRef));

        if (!ret) {
          activationFromModule = false;
          console.debug(`${module.name} cancel activation.`);
        }
      } catch (err) {
        console.error(`error in module ${module.name} onActivate`, err);
      }

      (0, _shared.logExecuteTime)(s, `${module.name}.onActivate`);
    });
    (0, _shared.logExecuteTime)(start, 'onActivate');
    return activation && activationFromModule;
  };

  mp.makeEventSource('_onCellChange', new _functionInfo.FunctionInfo(_functions.onCellChange).body);

  mp._onCellChange = (pcFormId, event) => {
    const start = Date.now();
    if (!pcFormId) return console.log('Plz reconnect');
    const ac = {
      type: 'form',
      desc: mp.getDescFromId(pcFormId)
    };
    const prevCell = {
      type: 'espm',
      desc: mp.getDescFromId(event.prevCell)
    };
    const currentCell = {
      type: 'espm',
      desc: mp.getDescFromId(event.currentCell)
    };
    const neighbors = mp.get(pcFormId, 'neighbors');

    const serverOptions = _.serverOptionProvider.getServerOptions();

    neighbors.filter(n => mp.get(n, 'type') === 'MpActor').forEach(id => {
      (0, _shared.throwOrInit)(mp, id, serverOptions);
    });
    (0, _functions2.checkAndCreatePropertyExist)(mp, pcFormId, 'isInSafeLocation');

    try {
      mp.set(pcFormId, 'isInSafeLocation', false);
    } catch (err) {
      console.log(err);
    }

    const worldSpace = (0, _objectReference.getWorldSpace)(mp, ac);
    let location = (0, _cell.getLocation)(mp, null, [{
      type: 'espm',
      desc: currentCell.desc
    }]);

    if (!location && worldSpace) {
      location = (0, _cell.getLocation)(mp, null, [{
        type: 'espm',
        desc: worldSpace.desc
      }]);
    }

    const safeLocations = serverOptions.SafeLocations;

    if (location) {
      if (safeLocations.includes(mp.getIdFromDesc(location.desc))) {
        mp.set(pcFormId, 'isInSafeLocation', true);
      } else {
        const parentLocation = (0, _location.getParent)(mp, location);

        if (parentLocation) {
          if (safeLocations.includes(mp.getIdFromDesc(parentLocation.desc))) {
            mp.set(pcFormId, 'isInSafeLocation', true);
          } else {
            const parentOfParentLocation = (0, _location.getParent)(mp, parentLocation);

            if (parentOfParentLocation) {
              if (safeLocations.includes(mp.getIdFromDesc(parentOfParentLocation.desc))) {
                mp.set(pcFormId, 'isInSafeLocation', true);
              }
            }
          }
        }
      }
    }

    mp.set(pcFormId, 'cellDesc', currentCell.desc);
    mp.callPapyrusFunction('global', 'GM_Main', '_onCellChange', null, [ac, prevCell, currentCell]);
    mp.modules.forEach(module => {
      try {
        if (!module.onCellChange) return;
        const s = Date.now();
        module.onCellChange(new m.Actor(ac), new m.Cell(prevCell), new m.Cell(currentCell));
        (0, _shared.logExecuteTime)(s, `${module.name}.onCellChange`);
      } catch (err) {
        console.error(`error in module ${module.name} onCellChange`, err);
      }
    });
    (0, _shared.logExecuteTime)(start, '_onCellChange');
  };

  mp.onDeath = (pcFormId, agressorFormId = null) => {
    const start = Date.now();
    const ac = {
      type: 'form',
      desc: mp.getDescFromId(pcFormId)
    };
    let agressor = null;

    if (agressorFormId) {
      agressor = {
        type: 'form',
        desc: mp.getDescFromId(agressorFormId)
      };
    }

    console.log(`${pcFormId.toString(16)} died`);
    mp.set(pcFormId, 'isDead', true);
    mp.callPapyrusFunction('global', 'GM_Main', '_onDeath', null, [ac]);
    mp.modules.forEach(module => {
      try {
        if (!module.onDeath) return;
        const s = Date.now();
        module.onDeath(new m.Actor(ac), agressor ? new m.Actor(agressor) : null);
        (0, _shared.logExecuteTime)(s, `${module.name}.onDeath`);
      } catch (err) {
        console.error(`error in module ${module.name} onDeath`, err);
      }
    });
    (0, _shared.logExecuteTime)(start, 'onDeath');
  };

  mp.onResurrect = pcFormId => {
    var _mp$modules;

    const start = Date.now();
    const ac = {
      type: 'form',
      desc: mp.getDescFromId(pcFormId)
    };
    console.log(`${pcFormId.toString(16)} respawns`);
    mp.set(pcFormId, 'isDead', false);
    mp.callPapyrusFunction('global', 'GM_Main', '_onResurrect', null, [ac]);
    (_mp$modules = mp.modules) === null || _mp$modules === void 0 ? void 0 : _mp$modules.forEach(module => {
      try {
        if (!module.onResurrect) return;
        const s = Date.now();
        module.onResurrect(new m.Actor(ac));
        (0, _shared.logExecuteTime)(s, `${module.name}.onResurrect`);
      } catch (err) {
        console.error(`error in module ${module.name} onResurrect`, err);
      }
    });
    (0, _shared.logExecuteTime)(start, 'onResurrect');
  };

  mp.makeEventSource('_onHitStatic', new _functionInfo.FunctionInfo(_functions.onHit).getText({
    isHitStatic: true
  }));

  mp._onHitStatic = (pcFormId, event) => {
    const start = Date.now();
    if (!pcFormId) return console.log('Plz reconnect');

    if (event.target === 0x14) {
      event.target = pcFormId;
    }

    if (event.agressor === 0x14) {
      event.agressor = pcFormId;
    }

    const target = {
      type: 'espm',
      desc: mp.getDescFromId(event.target)
    };
    const agressor = {
      type: 'form',
      desc: mp.getDescFromId(event.agressor)
    };
    mp.callPapyrusFunction('global', 'GM_Main', '_onHitStatic', null, [target, agressor, event.isPowerAttack, event.isSneakAttack, event.isBashAttack, event.isHitBlocked]);
    mp.modules.forEach(module => {
      try {
        if (!module.onHit) return;
        const s = Date.now();
        module.onHit(new m.Actor(target), new m.Actor(agressor), event.isPowerAttack, event.isSneakAttack, event.isBashAttack, event.isHitBlocked);
        (0, _shared.logExecuteTime)(s, `${module.name}.onHit`);
      } catch (err) {
        console.error(`error in module ${module.name} onHit`, err);
      }
    });
    (0, _shared.logExecuteTime)(start, '_onHitStatic');
  };

  mp.makeEventSource('_onEquip', new _functionInfo.FunctionInfo(_functions.onEquip).tryCatch());

  mp._onEquip = (pcFormId, event) => {
    const start = Date.now();
    if (!pcFormId) return console.log('Plz reconnect');

    if (event.actor === 0x14) {
      event.actor = pcFormId;
    }

    const ac = {
      type: 'form',
      desc: mp.getDescFromId(event.actor)
    };
    const target = {
      type: 'espm',
      desc: mp.getDescFromId(event.target)
    };
    mp.callPapyrusFunction('global', 'GM_Main', '_onEquip', null, [ac, target]);
    mp.modules.forEach(module => {
      try {
        if (!module.onEquip) return;
        const s = Date.now();
        module.onEquip(new m.Actor(ac), new m.Form(target));
        (0, _shared.logExecuteTime)(s, `${module.name}.onEquip`);
      } catch (err) {
        console.error(`error in module ${module.name} onEquip`, err);
      }
    });
    (0, _shared.logExecuteTime)(start, '_onEquip');
  };

  mp.onUiEvent = (pcFormId, uiEvent) => {
    var _mp$modules2;

    const start = Date.now();
    const ac = {
      type: 'form',
      desc: mp.getDescFromId(pcFormId)
    };

    switch (uiEvent.type) {
      case 'cef::chat:send':
        {
          if (!pcFormId) return console.log('Plz reconnect');
          const text = uiEvent.data;

          if (typeof text === 'string') {
            const tokens = text.split(' ');

            if (tokens[0].startsWith('/')) {
              const commandExists = mp.modules.some(module => {
                try {
                  if (!module.onChatCommand) return false;
                  const s = Date.now();
                  const exists = module.onChatCommand(new m.Actor(ac), tokens[0].toLowerCase(), tokens.slice(1));
                  (0, _shared.logExecuteTime)(s, `${module.name}.onChatCommand`);
                  return exists;
                } catch (err) {
                  console.error(`error in module ${module.name} onChatCommand`, err);
                  return false;
                }
              });
              if (commandExists) return (0, _shared.logExecuteTime)(start, 'onUiEvent');
            } else {
              mp.modules.forEach(module => {
                try {
                  if (!module.onChatInput) return;
                  const s = Date.now();
                  module.onChatInput(new m.Actor(ac), tokens);
                  (0, _shared.logExecuteTime)(s, `${module.name}.onChatInput`);
                } catch (err) {
                  console.error(`error in module ${module.name} onChatInput`, err);
                }
              });
            }

            mp.callPapyrusFunction('global', 'GM_Main', '_OnChatInput', null, [ac, text]);
          }

          break;
        }

      case 'server::msg:send':
        {
          (0, _serverMsg.handleServerMsg)(mp, pcFormId, uiEvent.data);
        }
    }

    (_mp$modules2 = mp.modules) === null || _mp$modules2 === void 0 ? void 0 : _mp$modules2.filter(module => module.onUiEvent).forEach(module => {
      try {
        if (!module.onUiEvent) return;
        const s = Date.now();
        module.onUiEvent(new m.Actor(ac), uiEvent);
        (0, _shared.logExecuteTime)(s, `${module.name}.onUiEvent`);
      } catch (err) {
        console.error(`error in module ${module.name} onUiEvent`, err);
      }
    });
    (0, _shared.logExecuteTime)(start, 'onUiEvent');
  };

  mp.makeEventSource('_onInput', new _functionInfo.FunctionInfo(_functions.onInput).tryCatch());

  mp._onInput = (pcFormId, keycodes) => {
    const start = Date.now();
    if (!pcFormId) return console.log('Plz reconnect');
    const ac = {
      type: 'form',
      desc: mp.getDescFromId(pcFormId)
    };
    mp.callPapyrusFunction('global', 'GM_Main', '_OnInput', null, [ac, keycodes]);

    const {
      keybindingBrowserSetVisible
    } = _.serverOptionProvider.getServerOptions();

    if (!mp.get(pcFormId, 'browserModal')) {
      if (keycodes.length === 1 && keycodes[0] === keybindingBrowserSetVisible) {}
    }

    if (keycodes.length === 1 && keycodes[0] === 0x04) {}

    if (keycodes.length === 1 && keycodes[0] === 0x05) {}

    mp.modules.forEach(module => {
      try {
        if (!module.onInput) return;
        const s = Date.now();
        module.onInput(new m.Actor(ac), keycodes);
        (0, _shared.logExecuteTime)(s, `${module.name}.onInput`);
      } catch (err) {
        console.error(`error in module ${module.name} onInput`, err);
      }
    });
    (0, _shared.logExecuteTime)(start, '_onInput');
  };

  mp.makeEventSource('_onAnimationEvent', new _functionInfo.FunctionInfo(_functions.onAnimationEvent).tryCatch());

  mp._onAnimationEvent = (pcFormId, animationEvent) => {
    const start = Date.now();
    if (!pcFormId) return console.log('Plz reconnect');
    const ac = {
      type: 'form',
      desc: mp.getDescFromId(pcFormId)
    };
    const isFall = ['JumpFallDirectional', 'JumpFall'].includes(animationEvent.current);
    const isJump = ['JumpDirectionalStart', 'JumpStandingStart'].includes(animationEvent.current);
    const isJumpLand = animationEvent.current.startsWith('JumpLand');
    const isAttack = animationEvent.current.toLowerCase().startsWith('attack');
    let isChangeHp = false;
    mp.set(pcFormId, 'isBlocking', animationEvent.current === 'blockStart');
    const stamina = 'stamina';

    if (isAttack) {
      let {
        HitStaminaReduce
      } = _.serverOptionProvider.getServerOptions();

      const eq = (0, _equip.getEquipment)(mp, pcFormId);
      const weap = eq === null || eq === void 0 ? void 0 : eq.inv.entries.filter(x => x.type === 'WEAP');

      if (weap && weap.length > 0) {
        if (weap[0].weight) HitStaminaReduce = weap[0].weight;
      }

      if (HitStaminaReduce > 0) {
        const damage = _attributes.actorValues.get(pcFormId, stamina, 'damage');

        const newDamageModValue = damage - HitStaminaReduce;

        _attributes.actorValues.set(pcFormId, stamina, 'damage', newDamageModValue);
      }
    }

    if (isJump) {
      const damage = _attributes.actorValues.get(pcFormId, stamina, 'damage');

      _attributes.actorValues.set(pcFormId, stamina, 'damage', damage - 5);
    }

    if (isFall || isJump) {
      mp.set(pcFormId, 'startZCoord', position.getPositionZ(mp, ac));
    }

    if (isJumpLand) {
      const startZCoord = mp.get(pcFormId, 'startZCoord');

      if (startZCoord) {
        const diff = startZCoord - position.getPositionZ(mp, ac);

        if (diff > 300) {
          const damage = _attributes.actorValues.get(pcFormId, 'health', 'damage');

          console.debug('isJumpLand', diff / 100, startZCoord);
          const newDamageModValue = damage - diff / 100;

          _attributes.actorValues.set(pcFormId, 'health', 'damage', newDamageModValue);

          const wouldDie = _attributes.actorValues.getMaximum(pcFormId, 'health') + newDamageModValue <= 0;

          if (wouldDie && !mp.get(pcFormId, 'isDead')) {
            if (mp.onDeath) mp.onDeath(pcFormId);
          }

          isChangeHp = true;
        }
      }
    }

    mp.set(pcFormId, 'lastAnimation', animationEvent.current);
    mp.callPapyrusFunction('global', 'GM_Main', '_onAnimationEvent', null, [ac, animationEvent.current, animationEvent.previous, isAttack, isJump, isFall, isJumpLand, isChangeHp]);
    mp.modules.forEach(module => {
      try {
        if (!module.onAnimationEvent) return;
        const s = Date.now();
        module.onAnimationEvent(new m.Actor(ac), animationEvent.current, animationEvent.previous, isAttack, isJump, isFall, isJumpLand, isChangeHp);
        (0, _shared.logExecuteTime)(s, `${module.name}.onAnimationEvent`);
      } catch (err) {
        console.error(`error in module ${module.name} onAnimationEvent`, err);
      }
    });
    (0, _shared.logExecuteTime)(start, '_onAnimationEvent');
  };

  mp.makeEventSource('_onUiMenuToggle', new _functionInfo.FunctionInfo(_functions.onUiMenuToggle).tryCatch());

  mp._onUiMenuToggle = (pcFormId, menuOpen) => {
    const start = Date.now();
    if (!pcFormId) return console.log('Plz reconnect');
    mp.set(pcFormId, 'uiOpened', menuOpen);
    mp.set(pcFormId, 'browserVisible', !menuOpen);
    (0, _shared.logExecuteTime)(start, '_onUiMenuToggle');
  };

  mp.makeEventSource('_onEffectStart', new _functionInfo.FunctionInfo(_functions.onEffectStart).tryCatch());

  mp._onEffectStart = (pcFormId, event) => {
    const start = Date.now();
    if (!pcFormId) return console.log('Plz reconnect');

    if (event.target === 0x14) {
      event.target = pcFormId;
    }

    if (event.caster === 0x14) {
      event.caster = pcFormId;
    }

    const caster = {
      type: 'form',
      desc: mp.getDescFromId(event.caster)
    };
    const target = {
      type: 'form',
      desc: mp.getDescFromId(event.target)
    };
    const effect = {
      type: 'espm',
      desc: mp.getDescFromId(event.effect)
    };
    const isDetrimental = (0, _activeMagicEffect.getFlags)(mp, null, [event.effect]).includes(0x4);
    mp.callPapyrusFunction('global', 'GM_Main', '_onEffectStart', null, [caster, target, effect, event.mag * (isDetrimental ? -1 : 1)]);
    mp.callPapyrusFunction('global', 'GM_Main', '_onEffectStart2', null, [caster, target, event.effect, event.mag * (isDetrimental ? -1 : 1)]);
    mp.modules.forEach(module => {
      try {
        if (!module.onEffectStart) return;
        const s = Date.now();
        module.onEffectStart(new m.ObjectReference(caster), new m.ObjectReference(target), new m.MagicEffect(effect), event.mag * (isDetrimental ? -1 : 1));
        (0, _shared.logExecuteTime)(s, `${module.name}.onEffectStart`);
      } catch (err) {
        console.error(`error in module ${module.name} onEffectStart`, err);
      }
    });
    (0, _shared.logExecuteTime)(start, '_onEffectStart');
  };

  mp.makeEventSource('_onCurrentCrosshairChange', new _functionInfo.FunctionInfo(_functions.onCurrentCrosshairChange).tryCatch());

  mp._onCurrentCrosshairChange = (pcFormId, event) => {
    var _getForm;

    const start = Date.now();
    if (!pcFormId) return console.log('Plz reconnect');
    const ac = {
      type: 'form',
      desc: mp.getDescFromId(pcFormId)
    };
    const crosshairRefId = event.crosshairRefId;
    const target = crosshairRefId ? (_getForm = (0, _game.getForm)(mp, null, [crosshairRefId])) !== null && _getForm !== void 0 ? _getForm : null : null;
    mp.set(pcFormId, 'CurrentCrosshairRef', target ? crosshairRefId : null);
    mp.callPapyrusFunction('global', 'GM_Main', '_onCurrentCrosshairChange', null, [ac, target]);
    mp.modules.forEach(module => {
      try {
        if (!module.onCurrentCrosshairChange) return;
        const s = Date.now();
        module.onCurrentCrosshairChange(new m.Actor(ac), target ? new m.ObjectReference(target) : null);
        (0, _shared.logExecuteTime)(s, `${module.name}.onCurrentCrosshairChange`);
      } catch (err) {
        console.error(`error in module ${module.name} onCurrentCrosshairChange`, err);
      }
    });
    (0, _shared.logExecuteTime)(start, '_onCurrentCrosshairChange');
  };

  mp.makeEventSource('_onPrintConsole', new _functionInfo.FunctionInfo(_functions.onPrintConsole).tryCatch());

  mp._onPrintConsole = (pcFormId, event) => {
    console.log('[client]', '\x1b[33m', ...event, '\x1b[0m');
  };

  mp.onDisconnect = pcFormId => {
    if (!pcFormId) return;
    console.log(pcFormId.toString(16), 'disconnect');
    const ac = {
      type: 'form',
      desc: mp.getDescFromId(pcFormId)
    };
    loadedPc[pcFormId] = 0;
    mp.callPapyrusFunction('global', 'GM_Main', '_onDisconnect', null, [ac]);
    mp.modules.forEach(module => {
      try {
        if (!module.onDisconnect) return;
        const s = Date.now();
        module.onDisconnect(new m.Actor(ac));
        (0, _shared.logExecuteTime)(s, `${module.name}.onDisconnect`);
      } catch (err) {
        console.error(`error in module ${module.name} onDisconnect`, err);
      }
    });
  };

  _onHit.register(mp);

  empty.register(mp);
};

exports.register = register;
},{"../papyrus/game":"WCBi","../properties/actor/actorValues/attributes":"Klzq","../utils/functionInfo":"fC7F","./functions":"dwII","./empty":"eVF9","../papyrus/activeMagicEffect":"dvBS","../papyrus/actor/equip":"lP44","../papyrus/objectReference/position":"wmVe","../..":"QCba","../modules":"uozv","./shared":"jnne","./_onHit":"e1XF","./server-msg":"YOwo","../papyrus/multiplayer/functions":"zNfc","../papyrus/cell":"WIJZ","../papyrus/location":"kLvY","../papyrus/objectReference":"YRYD"}],"t0IM":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stateChangeFactory = void 0;

const stateChangeFactory = (ctx, stateName, states) => {
  ctx.sp.on('update', () => {
    const ac = ctx.sp.Game.getPlayer();
    if (!ac) return;
    if (!states.includes(stateName)) return;
    const stateValue = ac[stateName]();

    if (ctx.state[stateName] !== stateValue) {
      if (ctx.state[stateName] !== undefined) {
        ctx.sendEvent(stateValue);
      }

      ctx.state[stateName] = stateValue;
    }
  });
};

exports.stateChangeFactory = stateChangeFactory;
},{}],"vm0Z":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.register = void 0;

var _functionInfo = require("../utils/functionInfo");

var _functions = require("./functions");

var _attributes = require("../properties/actor/actorValues/attributes");

const states = ['isSprinting', 'isWeaponDrawn', 'isDead', 'isFlying'];

const factory = stateName => {
  return new _functionInfo.FunctionInfo(_functions.stateChangeFactory).getText({
    stateName,
    states
  });
};

const sprintAttr = 'stamina';
const staminaReduce = 10;

const register = mp => {
  mp.makeEventSource('_onSprintStateChange', factory('isSprinting'));

  mp._onSprintStateChange = (pcFormId, isSprinting) => {
    const start = Date.now();
    if (!pcFormId) return console.log('Plz reconnect');
    mp.set(pcFormId, 'isSprinting', isSprinting);

    if (isSprinting) {
      _attributes.actorValues.set(pcFormId, `mp_${sprintAttr}drain`, 'base', -staminaReduce);
    } else {
      _attributes.actorValues.set(pcFormId, `mp_${sprintAttr}drain`, 'base', 0);
    }

    console.log('Event _onSprintStateChange: ', Date.now() - start);
  };

  mp.makeEventSource('_onWeaponDrawChange', factory('isWeaponDrawn'));

  mp._onWeaponDrawChange = (pcFormId, isWeaponDrawn) => {
    if (!pcFormId) return console.log('Plz reconnect');
    mp.set(pcFormId, 'isWeaponDrawn', isWeaponDrawn);
  };

  mp.makeEventSource('_onDead', factory('isDead'));

  mp._onDead = (pcFormId, isDead) => {
    if (isDead) {
      console.log(`${pcFormId.toString(16)} died`);
    }

    mp.set(pcFormId, 'isDead', true);
  };

  mp.makeEventSource('_onFly', factory('isFlying'));

  mp._onFly = (pcFormId, isFlying) => {
    if (!pcFormId) return console.log('Plz reconnect');
    mp.set(pcFormId, 'isFlying', isFlying);
  };
};

exports.register = register;
},{"../utils/functionInfo":"fC7F","./functions":"t0IM","../properties/actor/actorValues/attributes":"Klzq"}],"QfNO":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setGlobalStorageValueStringArray = exports.setGlobalStorageValueString = exports.setGlobalStorageValueNumberArray = exports.setGlobalStorageValueNumber = exports.setGlobalStorageValue = exports.getGlobalStorageValue = void 0;

var _papyrusArgs = require("../../utils/papyrusArgs");

var _functions = require("./functions");

const globalId = 0xff000000;

const getGlobalStorageValue = (mp, self, args) => {
  const key = (0, _papyrusArgs.getString)(args, 0);
  (0, _functions.checkAndCreatePropertyExist)(mp, globalId, key);

  try {
    return mp.get(globalId, key);
  } catch (err) {
    console.log(err);
  }
};

exports.getGlobalStorageValue = getGlobalStorageValue;

const setGlobalStorageValueString = (mp, self, args) => {
  const key = (0, _papyrusArgs.getString)(args, 0);
  const value = (0, _papyrusArgs.getString)(args, 1);
  setGlobalStorageValue(mp, key, value);
};

exports.setGlobalStorageValueString = setGlobalStorageValueString;

const setGlobalStorageValueStringArray = (mp, self, args) => {
  const key = (0, _papyrusArgs.getString)(args, 0);
  const value = (0, _papyrusArgs.getStringArray)(args, 1);
  setGlobalStorageValue(mp, key, value);
};

exports.setGlobalStorageValueStringArray = setGlobalStorageValueStringArray;

const setGlobalStorageValueNumber = (mp, self, args) => {
  const key = (0, _papyrusArgs.getString)(args, 0);
  const value = (0, _papyrusArgs.getNumber)(args, 1);
  setGlobalStorageValue(mp, key, value);
};

exports.setGlobalStorageValueNumber = setGlobalStorageValueNumber;

const setGlobalStorageValueNumberArray = (mp, self, args) => {
  const key = (0, _papyrusArgs.getString)(args, 0);
  const value = (0, _papyrusArgs.getNumberArray)(args, 1);
  setGlobalStorageValue(mp, key, value);
};

exports.setGlobalStorageValueNumberArray = setGlobalStorageValueNumberArray;

const setGlobalStorageValue = (mp, key, value) => {
  (0, _functions.checkAndCreatePropertyExist)(mp, globalId, key);

  try {
    mp.set(globalId, key, value);
  } catch (err) {
    console.log(err);
  }
};

exports.setGlobalStorageValue = setGlobalStorageValue;
},{"../../utils/papyrusArgs":"oZY1","./functions":"zNfc"}],"QSKn":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.register = exports.localizationDefault = exports.isPlayer = void 0;

var _ = require("../../..");

var _papyrusArgs = require("../../utils/papyrusArgs");

var _globalStorage = require("./globalStorage");

const executeUiCommand = (mp, self, args) => {
  const actor = (0, _papyrusArgs.getObject)(args, 0);
  const commandType = (0, _papyrusArgs.getString)(args, 1);
  const argumentNames = (0, _papyrusArgs.getStringArray)(args, 2);
  const tokens = (0, _papyrusArgs.getStringArray)(args, 3);
  const alter = (0, _papyrusArgs.getString)(args, 4);
  const actorId = mp.getIdFromDesc(actor.desc);
  mp.sendUiMessage(actorId, {
    type: 'COMMAND',
    data: {
      commandType,
      commandArgs: {
        argumentNames,
        tokens
      },
      alter: alter.split('\n')
    }
  });
};

const log = (mp, self, args) => {
  const text = (0, _papyrusArgs.getString)(args, 0);
  console.log('[GM]', '\x1b[34m', text, '\x1b[0m');
};

const getText = (localization, mp, self, args) => {
  const msgId = (0, _papyrusArgs.getString)(args, 0);
  return localization.getText(msgId);
};

const getActorsInStreamZone = (mp, self, args) => {
  const actor = (0, _papyrusArgs.getObject)(args, 0);
  const actorId = mp.getIdFromDesc(actor.desc);
  const res = new Array();
  mp.get(actorId, 'neighbors').forEach(formId => {
    if (mp.get(formId, 'type') === 'MpActor') {
      res.push({
        type: 'form',
        desc: mp.getDescFromId(formId)
      });
    }
  });
  return res;
};

const getOnlinePlayers = mp => {
  const res = new Array();
  mp.get(0, 'onlinePlayers').forEach(formId => {
    res.push({
      type: 'form',
      desc: mp.getDescFromId(formId)
    });
  });
  return res;
};

const isPlayer = (mp, args) => mp.get(0, 'onlinePlayers').findIndex(x => x === (0, _papyrusArgs.getNumber)(args, 0)) !== -1;

exports.isPlayer = isPlayer;

const asConvert = (mp, self, args) => (0, _papyrusArgs.getObject)(args, 0);

const stringToInt = (mp, self, args) => +(0, _papyrusArgs.getString)(args, 0);

const wait = (mp, self, args) => {
  const sec = (0, _papyrusArgs.getNumber)(args, 0);
  const name = (0, _papyrusArgs.getString)(args, 1);
  const ac = args[2] ? (0, _papyrusArgs.getObject)(args, 2) : undefined;
  const target = args[3] ? (0, _papyrusArgs.getObject)(args, 3) : undefined;
  const targetId = (0, _papyrusArgs.getNumber)(args, 4);
  const params = [];

  if (ac) {
    params.push(ac);
  }

  if (target) {
    params.push(target);
  }

  if (targetId !== -1) {
    params.push(targetId);
  }

  if (name.split('.').length !== 2) {
    console.log('Неправильное название функции. Требуется указать имя скрипта и функцию. Например M.GetText');
    return;
  }

  setTimeout(() => {
    mp.callPapyrusFunction('global', name.split('.')[0], name.split('.')[1], null, params);
  }, sec * 1000);
};

const browserSetVisible = (mp, self, args) => {
  const ac = (0, _papyrusArgs.getObject)(args, 0);
  const visible = (0, _papyrusArgs.getBoolean)(args, 1);
  mp.set(mp.getIdFromDesc(ac.desc), 'browserVisible', visible);

  if (!visible) {
    mp.set(mp.getIdFromDesc(ac.desc), 'browserModal', false);
  }
};

const browserGetVisible = (mp, self, args) => !!mp.get(mp.getIdFromDesc((0, _papyrusArgs.getObject)(args, 0).desc), 'browserVisible');

const browserSetFocused = (mp, self, args) => {
  const ac = (0, _papyrusArgs.getObject)(args, 0);
  const acId = mp.getIdFromDesc(ac.desc);
  const focused = (0, _papyrusArgs.getBoolean)(args, 1);
  mp.set(acId, 'browserFocused', focused);

  if (!focused) {
    mp.set(acId, 'browserModal', false);
    mp.set(acId, 'chromeInputFocus', false);
  }
};

const browserGetFocused = (mp, self, args) => !!mp.get(mp.getIdFromDesc((0, _papyrusArgs.getObject)(args, 0).desc), 'browserFocused');

const browserSetModal = (mp, self, args) => {
  const ac = (0, _papyrusArgs.getObject)(args, 0);
  const modal = (0, _papyrusArgs.getBoolean)(args, 1);
  mp.set(mp.getIdFromDesc(ac.desc), 'browserModal', modal);
};

const browserGetModal = (mp, self, args) => !!mp.get(mp.getIdFromDesc((0, _papyrusArgs.getObject)(args, 0).desc), 'browserModal');

const localizationDefault = {
  getText: x => x
};
exports.localizationDefault = localizationDefault;

const register = (mp, localization = localizationDefault) => {
  for (const className of ['Multiplayer', 'M']) {
    mp.registerPapyrusFunction('global', className, 'ExecuteUiCommand', (self, args) => executeUiCommand(mp, self, args));
    mp.registerPapyrusFunction('global', className, 'Log', (self, args) => log(mp, self, args));
    mp.registerPapyrusFunction('global', className, 'GetText', (self, args) => getText(localization, mp, self, args));
    mp.registerPapyrusFunction('global', className, 'GetActorsInStreamZone', (self, args) => getActorsInStreamZone(mp, self, args));
    mp.registerPapyrusFunction('global', className, 'GetOnlinePlayers', () => getOnlinePlayers(mp));
    mp.registerPapyrusFunction('global', className, 'IsPlayer', (self, args) => isPlayer(mp, args));
    mp.registerPapyrusFunction('global', className, 'AsPerk', (self, args) => asConvert(mp, self, args));
    mp.registerPapyrusFunction('global', className, 'AsOutfit', (self, args) => asConvert(mp, self, args));
    mp.registerPapyrusFunction('global', className, 'AsRace', (self, args) => asConvert(mp, self, args));
    mp.registerPapyrusFunction('global', className, 'AsMagicEffect', (self, args) => asConvert(mp, self, args));
    mp.registerPapyrusFunction('global', className, 'AsVisualEffect', (self, args) => asConvert(mp, self, args));
    mp.registerPapyrusFunction('global', className, 'StringToInt', (self, args) => stringToInt(mp, self, args));
    mp.registerPapyrusFunction('global', className, 'Wait', (self, args) => wait(mp, self, args));
    mp.registerPapyrusFunction('global', className, 'BrowserSetVisible', (self, args) => browserSetVisible(mp, self, args));
    mp.registerPapyrusFunction('global', className, 'BrowserSetFocused', (self, args) => browserSetFocused(mp, self, args));
    mp.registerPapyrusFunction('global', className, 'BrowserSetModal', (self, args) => browserSetModal(mp, self, args));
    mp.registerPapyrusFunction('global', className, 'BrowserGetVisible', (self, args) => browserGetVisible(mp, self, args));
    mp.registerPapyrusFunction('global', className, 'BrowserGetFocused', (self, args) => browserGetFocused(mp, self, args));
    mp.registerPapyrusFunction('global', className, 'BrowserGetModal', (self, args) => browserGetModal(mp, self, args));
    mp.registerPapyrusFunction('global', className, 'GetGlobalStorageValueString', (self, args) => (0, _globalStorage.getGlobalStorageValue)(mp, self, args));
    mp.registerPapyrusFunction('global', className, 'GetGlobalStorageValueStringArray', (self, args) => (0, _globalStorage.getGlobalStorageValue)(mp, self, args));
    mp.registerPapyrusFunction('global', className, 'GetGlobalStorageValueInt', (self, args) => (0, _globalStorage.getGlobalStorageValue)(mp, self, args));
    mp.registerPapyrusFunction('global', className, 'GetGlobalStorageValueIntArray', (self, args) => (0, _globalStorage.getGlobalStorageValue)(mp, self, args));
    mp.registerPapyrusFunction('global', className, 'GetGlobalStorageValueFloat', (self, args) => (0, _globalStorage.getGlobalStorageValue)(mp, self, args));
    mp.registerPapyrusFunction('global', className, 'GetGlobalStorageValueFloatArray', (self, args) => (0, _globalStorage.getGlobalStorageValue)(mp, self, args));
    mp.registerPapyrusFunction('global', className, 'SetGlobalStorageValueString', (self, args) => (0, _globalStorage.setGlobalStorageValueString)(mp, self, args));
    mp.registerPapyrusFunction('global', className, 'SetGlobalStorageValueStringArray', (self, args) => (0, _globalStorage.setGlobalStorageValueStringArray)(mp, self, args));
    mp.registerPapyrusFunction('global', className, 'SetGlobalStorageValueInt', (self, args) => (0, _globalStorage.setGlobalStorageValueNumber)(mp, self, args));
    mp.registerPapyrusFunction('global', className, 'SetGlobalStorageValueIntArray', (self, args) => (0, _globalStorage.setGlobalStorageValueNumberArray)(mp, self, args));
    mp.registerPapyrusFunction('global', className, 'SetGlobalStorageValueFloat', (self, args) => (0, _globalStorage.setGlobalStorageValueNumber)(mp, self, args));
    mp.registerPapyrusFunction('global', className, 'SetGlobalStorageValueFloatArray', (self, args) => (0, _globalStorage.setGlobalStorageValueNumberArray)(mp, self, args));
  }

  _.IM.GetActorsInStreamZone = args => getActorsInStreamZone(mp, null, args);

  _.IM.GetOnlinePlayers = () => getOnlinePlayers(mp);

  _.IM.IsPlayer = args => isPlayer(mp, args);

  _.IM.BrowserSetVisible = args => browserSetVisible(mp, null, args);

  _.IM.BrowserSetFocused = args => browserSetFocused(mp, null, args);

  _.IM.BrowserSetModal = args => browserSetModal(mp, null, args);

  _.IM.BrowserGetVisible = args => browserGetVisible(mp, null, args);

  _.IM.BrowserGetFocused = args => browserGetFocused(mp, null, args);

  _.IM.BrowserGetModal = args => browserGetModal(mp, null, args);

  _.IM.GetGlobalStorageValue = args => (0, _globalStorage.getGlobalStorageValue)(mp, null, args);

  _.IM.SetGlobalStorageValue = (key, value) => (0, _globalStorage.setGlobalStorageValue)(mp, key, value);

  _.IM.ExecuteUiCommand = args => executeUiCommand(mp, null, args);
};

exports.register = register;
},{"../../..":"QCba","../../utils/papyrusArgs":"oZY1","./globalStorage":"QfNO"}],"ejLG":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.register = void 0;

var _papyrusArgs = require("../utils/papyrusArgs");

const getNthChar = (mp, self, args) => {
  const text = (0, _papyrusArgs.getString)(args, 0);
  const index = (0, _papyrusArgs.getNumber)(args, 1);
  return text[index];
};

const split = (mp, self, args) => {
  const text = (0, _papyrusArgs.getString)(args, 0);
  const splitter = (0, _papyrusArgs.getString)(args, 1);
  return text.split(splitter);
};

const substring = (mp, self, args) => {
  const s = (0, _papyrusArgs.getString)(args, 0);
  const startIndex = (0, _papyrusArgs.getNumber)(args, 1);
  const length = (0, _papyrusArgs.getNumber)(args, 2);
  return s.substring(startIndex, length ? startIndex + length : undefined);
};

const match = (mp, self, args) => {
  const text = (0, _papyrusArgs.getString)(args, 0);
  const textFind = (0, _papyrusArgs.getString)(args, 1);
  return text.toLowerCase().includes(textFind.toLowerCase());
};

const getLength = (mp, self, args) => (0, _papyrusArgs.getString)(args, 0).length;

const toLower = (mp, self, args) => (0, _papyrusArgs.getString)(args, 0).toLowerCase();

const join = (mp, self, args) => (0, _papyrusArgs.getStringArray)(args, 0).join((0, _papyrusArgs.getString)(args, 1));

const quotes = (mp, self, args) => `"${(0, _papyrusArgs.getString)(args, 0)}"`;

const register = mp => {
  mp.registerPapyrusFunction('global', 'StringUtil', 'GetNthChar', (self, args) => getNthChar(mp, self, args));
  mp.registerPapyrusFunction('global', 'StringUtil', 'Split', (self, args) => split(mp, self, args));
  mp.registerPapyrusFunction('global', 'StringUtil', 'Substring', (self, args) => substring(mp, self, args));
  mp.registerPapyrusFunction('global', 'StringUtil', 'GetLength', (self, args) => getLength(mp, self, args));
  mp.registerPapyrusFunction('global', 'StringUtilEx', 'ToLower', (self, args) => toLower(mp, self, args));
  mp.registerPapyrusFunction('global', 'StringUtilEx', 'Join', (self, args) => join(mp, self, args));
  mp.registerPapyrusFunction('global', 'StringUtilEx', 'Quotes', (self, args) => quotes(mp, self, args));
  mp.registerPapyrusFunction('global', 'StringUtilEx', 'Match', (self, args) => match(mp, self, args));
};

exports.register = register;
},{"../utils/papyrusArgs":"oZY1"}],"GnGy":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.register = void 0;

var _helper = require("../utils/helper");

var _papyrusArgs = require("../utils/papyrusArgs");

const getAllIndexes = (arr, val) => {
  const indexes = [];
  let i = -1;

  while ((i = arr.indexOf(val, i + 1)) !== -1) {
    indexes.push(i);
  }

  return indexes;
};

const createStringArray = (mp, self, args) => {
  const size = (0, _papyrusArgs.getNumber)(args, 0);
  const fill = (0, _papyrusArgs.getString)(args, 1);
  return new Array(size).fill(fill);
};

const createBoolArray = (mp, self, args) => {
  const size = (0, _papyrusArgs.getNumber)(args, 0);
  const fill = (0, _papyrusArgs.getBoolean)(args, 1);
  return new Array(size).fill(fill);
};

const createNumberArray = (mp, self, args) => {
  const size = (0, _papyrusArgs.getNumber)(args, 0);
  const fill = (0, _papyrusArgs.getNumber)(args, 1);
  return new Array(size).fill(fill);
};

const createFormArray = (mp, self, args) => {
  const size = (0, _papyrusArgs.getNumber)(args, 0);
  const fill = args[1] ? (0, _papyrusArgs.getObject)(args, 1) : null;
  return new Array(size).fill(fill);
};

const resizeStringArray = (mp, self, args) => {
  const arr = (0, _papyrusArgs.getStringArray)(args, 0);
  const size = (0, _papyrusArgs.getNumber)(args, 1);

  if (arr.length > size) {
    arr.length = size;
  } else {
    const dif = size - arr.length;
    arr.length = size;
    arr.fill('', arr.length - dif, arr.length);
  }

  return arr;
};

const arrayStringFind = (mp, self, args) => {
  const array = (0, _papyrusArgs.getStringArray)(args, 0);
  const find = (0, _papyrusArgs.getString)(args, 1);
  return array.findIndex(x => x === find);
};

const arrayNumberFind = (mp, self, args) => {
  const array = (0, _papyrusArgs.getNumberArray)(args, 0);
  const find = (0, _papyrusArgs.getNumber)(args, 1);
  return array.findIndex(x => x === find);
};

const arrayStringFindAll = (mp, self, args) => {
  const array = (0, _papyrusArgs.getStringArray)(args, 0);
  const find = (0, _papyrusArgs.getString)(args, 1);
  return getAllIndexes(array, find);
};

const arrayNumberFindAll = (mp, self, args) => {
  const array = (0, _papyrusArgs.getNumberArray)(args, 0);
  const find = (0, _papyrusArgs.getNumber)(args, 1);
  return getAllIndexes(array, find);
};

const pushStringArray = (mp, self, args) => {
  const array = (0, _papyrusArgs.getStringArray)(args, 0);

  if (array[0] === '') {
    array.splice(0, 1);
  }

  const newValue = (0, _papyrusArgs.getString)(args, 1);
  return [...array, newValue];
};

const pushNumberArray = (mp, self, args) => {
  const array = (0, _papyrusArgs.getNumberArray)(args, 0);
  const newValue = (0, _papyrusArgs.getNumber)(args, 1);
  return [...array, newValue];
};

const pushFormArray = (mp, self, args) => {
  const array = (0, _papyrusArgs.getObjectArray)(args, 0);
  const newValue = (0, _papyrusArgs.getObject)(args, 1);
  return [...array, newValue];
};

const unshiftStringArray = (mp, self, args) => {
  const array = (0, _papyrusArgs.getStringArray)(args, 0);
  const newValue = (0, _papyrusArgs.getString)(args, 1);
  return [newValue, ...array];
};

const unshiftNumberArray = (mp, self, args) => {
  const array = (0, _papyrusArgs.getNumberArray)(args, 0);
  const newValue = (0, _papyrusArgs.getNumber)(args, 1);
  return [newValue, ...array];
};

const unshiftFormArray = (mp, self, args) => {
  const array = (0, _papyrusArgs.getObjectArray)(args, 0);
  const newValue = (0, _papyrusArgs.getObject)(args, 1);
  return [newValue, ...array];
};

const spliceStringArray = (mp, self, args) => {
  var _getNumber;

  const array = (0, _papyrusArgs.getStringArray)(args, 0);
  const index = (0, _papyrusArgs.getNumber)(args, 1);
  const countDeleteElements = (_getNumber = (0, _papyrusArgs.getNumber)(args, 2)) !== null && _getNumber !== void 0 ? _getNumber : 1;

  if (index >= array.length) {
    console.log('Index was outside the bounds of the array');
    return [];
  }

  array.splice(index, countDeleteElements);
  return array;
};

const spliceNumberArray = (mp, self, args) => {
  var _getNumber2;

  const array = (0, _papyrusArgs.getNumberArray)(args, 0);
  const index = (0, _papyrusArgs.getNumber)(args, 1);
  const countDeleteElements = (_getNumber2 = (0, _papyrusArgs.getNumber)(args, 2)) !== null && _getNumber2 !== void 0 ? _getNumber2 : 1;

  if (index >= array.length) {
    console.log('Index was outside the bounds of the array');
    return [];
  }

  array.splice(index, countDeleteElements);
  return array;
};

const spliceFormArray = (mp, self, args) => {
  var _getNumber3;

  const array = (0, _papyrusArgs.getObjectArray)(args, 0);
  const index = (0, _papyrusArgs.getNumber)(args, 1);
  const countDeleteElements = (_getNumber3 = (0, _papyrusArgs.getNumber)(args, 2)) !== null && _getNumber3 !== void 0 ? _getNumber3 : 1;

  if (index >= array.length) {
    console.log('Index was outside the bounds of the array');
    return [];
  }

  array.splice(index, countDeleteElements);
  return array;
};

const stringArrayToNumberArray = (mp, self, args) => (0, _papyrusArgs.getStringArray)(args, 0).map(x => +x);

const formArrayToObjectReferenceArray = (mp, self, args) => (0, _papyrusArgs.getObjectArray)(args, 0);

const formArrayToActorArray = (mp, self, args) => (0, _papyrusArgs.getObjectArray)(args, 0);

const randomInt = (mp, self, args) => (0, _helper.randomInRange)((0, _papyrusArgs.getNumber)(args, 0), (0, _papyrusArgs.getNumber)(args, 1));

const register = mp => {
  mp.registerPapyrusFunction('global', 'Utility', 'CreateStringArray', (self, args) => createStringArray(mp, self, args));
  mp.registerPapyrusFunction('global', 'Utility', 'CreateBoolArray', (self, args) => createBoolArray(mp, self, args));
  mp.registerPapyrusFunction('global', 'Utility', 'CreateFloatArray', (self, args) => createNumberArray(mp, self, args));
  mp.registerPapyrusFunction('global', 'Utility', 'CreateFormArray', (self, args) => createFormArray(mp, self, args));
  mp.registerPapyrusFunction('global', 'Utility', 'CreateIntArray', (self, args) => createNumberArray(mp, self, args));
  mp.registerPapyrusFunction('global', 'Utility', 'ResizeStringArray', (self, args) => resizeStringArray(mp, self, args));
  mp.registerPapyrusFunction('global', 'Utility', 'RandomInt', (self, args) => randomInt(mp, self, args));
  mp.registerPapyrusFunction('global', 'UtilityEx', 'ArrayStringFind', (self, args) => arrayStringFind(mp, self, args));
  mp.registerPapyrusFunction('global', 'UtilityEx', 'ArrayIntFind', (self, args) => arrayNumberFind(mp, self, args));
  mp.registerPapyrusFunction('global', 'UtilityEx', 'ArrayFloatFind', (self, args) => arrayNumberFind(mp, self, args));
  mp.registerPapyrusFunction('global', 'UtilityEx', 'ArrayStringFindAll', (self, args) => arrayStringFindAll(mp, self, args));
  mp.registerPapyrusFunction('global', 'UtilityEx', 'ArrayIntFindAll', (self, args) => arrayNumberFindAll(mp, self, args));
  mp.registerPapyrusFunction('global', 'UtilityEx', 'ArrayFloatFindAll', (self, args) => arrayNumberFindAll(mp, self, args));
  mp.registerPapyrusFunction('global', 'UtilityEx', 'StringArrayToIntArray', (self, args) => stringArrayToNumberArray(mp, self, args));
  mp.registerPapyrusFunction('global', 'UtilityEx', 'StringArrayToFloatArray', (self, args) => stringArrayToNumberArray(mp, self, args));
  mp.registerPapyrusFunction('global', 'UtilityEx', 'FormArrayToObjectReferenceArray', (self, args) => formArrayToObjectReferenceArray(mp, self, args));
  mp.registerPapyrusFunction('global', 'UtilityEx', 'FormArrayToActorArray', (self, args) => formArrayToActorArray(mp, self, args));
  mp.registerPapyrusFunction('global', 'UtilityEx', 'PushStringArray', (self, args) => pushStringArray(mp, self, args));
  mp.registerPapyrusFunction('global', 'UtilityEx', 'PushIntArray', (self, args) => pushNumberArray(mp, self, args));
  mp.registerPapyrusFunction('global', 'UtilityEx', 'PushFloatArray', (self, args) => pushNumberArray(mp, self, args));
  mp.registerPapyrusFunction('global', 'UtilityEx', 'PushFormArray', (self, args) => pushFormArray(mp, self, args));
  mp.registerPapyrusFunction('global', 'UtilityEx', 'UnshiftStringArray', (self, args) => unshiftStringArray(mp, self, args));
  mp.registerPapyrusFunction('global', 'UtilityEx', 'UnshiftIntArray', (self, args) => unshiftNumberArray(mp, self, args));
  mp.registerPapyrusFunction('global', 'UtilityEx', 'UnshiftFloatArray', (self, args) => unshiftNumberArray(mp, self, args));
  mp.registerPapyrusFunction('global', 'UtilityEx', 'UnshiftFormArray', (self, args) => unshiftFormArray(mp, self, args));
  mp.registerPapyrusFunction('global', 'UtilityEx', 'SpliceStringArray', (self, args) => spliceStringArray(mp, self, args));
  mp.registerPapyrusFunction('global', 'UtilityEx', 'SpliceIntArray', (self, args) => spliceNumberArray(mp, self, args));
  mp.registerPapyrusFunction('global', 'UtilityEx', 'SpliceFloatArray', (self, args) => spliceNumberArray(mp, self, args));
  mp.registerPapyrusFunction('global', 'UtilityEx', 'SpliceFormArray', (self, args) => spliceFormArray(mp, self, args));
};

exports.register = register;
},{"../utils/helper":"FxH1","../utils/papyrusArgs":"oZY1"}],"tMCa":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.register = exports.getNumberEspmLoad = void 0;

var _papyrusArgs = require("../utils/papyrusArgs");

var _eval = require("../properties/eval");

var _functionInfo = require("../utils/functionInfo");

var _ = require("../..");

var _multiplayer = require("./multiplayer");

let cocMarkers = null;

const centerOnCell = (mp, selfNull, args) => {
  var _Object$keys$find, _cocMarkers$targetCel;

  const self = (0, _papyrusArgs.getObject)(args, 0);
  const selfId = mp.getIdFromDesc(self.desc);
  const cellName = (0, _papyrusArgs.getString)(args, 1).toLowerCase();
  const cellList = JSON.parse(mp.readDataFile('coc/cell.json'));

  if (!cocMarkers) {
    cocMarkers = JSON.parse(mp.readDataFile('xelib/coc-markers.json'));
  }

  if (!cellList || !cocMarkers) return;
  const targetCellFromFile = (_Object$keys$find = Object.keys(cocMarkers).find(x => x.toLowerCase() === cellName)) !== null && _Object$keys$find !== void 0 ? _Object$keys$find : Object.keys(cellList).find(x => x.toLowerCase() === cellName);
  if (!targetCellFromFile) return;
  const targetPoint = (_cocMarkers$targetCel = cocMarkers[targetCellFromFile]) !== null && _cocMarkers$targetCel !== void 0 ? _cocMarkers$targetCel : cellList[targetCellFromFile];
  Object.keys(targetPoint).forEach(key => {
    const propName = key;
    mp.set(selfId, propName, targetPoint[propName]);
  });
};

const notification = (mp, self, args) => {
  const ac = (0, _papyrusArgs.getObject)(args, 0);
  const acId = mp.getIdFromDesc(ac.desc);
  const msg = (0, _papyrusArgs.getString)(args, 1);

  const func = (ctx, msg) => {
    ctx.sp.once('update', () => {
      ctx.sp.Debug.notification(msg);
    });
  };

  (0, _eval.evalClient)(mp, acId, new _functionInfo.FunctionInfo(func).getText({
    msg
  }));
};

const quitGame = (mp, self, args) => {
  const ac = (0, _papyrusArgs.getObject)(args, 0);
  const acId = mp.getIdFromDesc(ac.desc);
  if (!(0, _multiplayer.isPlayer)(mp, [acId])) return;

  const func = ctx => {
    ctx.sp.once('update', () => {
      ctx.sp.Debug.quitGame();
    });
  };

  (0, _eval.evalClient)(mp, acId, new _functionInfo.FunctionInfo(func).getText());
  (0, _eval.evalClient)(mp, acId, '');
};

const toggleCollisions = (mp, self, args) => {
  const ac = (0, _papyrusArgs.getObject)(args, 0);
  const acId = mp.getIdFromDesc(ac.desc);
  if (!(0, _multiplayer.isPlayer)(mp, [acId])) return;

  const func = ctx => {
    ctx.sp.once('update', () => {
      ctx.sp.Debug.toggleCollisions();
    });
  };

  (0, _eval.evalClient)(mp, acId, new _functionInfo.FunctionInfo(func).getText());
};

const showEspList = mp => {
  const listEsp = mp.getEspmLoadOrder();
  console.log(JSON.stringify(listEsp));
};

const getNumberEspmLoad = mp => {
  const listEsp = mp.getEspmLoadOrder();
  return listEsp === null || listEsp === void 0 ? void 0 : listEsp.length;
};

exports.getNumberEspmLoad = getNumberEspmLoad;

const aboutForm = (mp, self, args) => {
  const formId = (0, _papyrusArgs.getNumber)(args, 0);
  const data = mp.lookupEspmRecordById(formId).record;
  console.log(`AboutForm: ${JSON.stringify(data, null, 2)}`);
};

const about = (mp, self, args) => {
  console.log(`About: ${JSON.stringify((0, _papyrusArgs.getObject)(args, 0), null, 2)}`);
};

const sendClientConsole = (mp, self, args) => {
  if (!args) return;
  const message = args.toString();

  const func = ctx => {
    ctx.sp.once('update', () => {
      ctx.sp.printConsole(message);
    });
  };

  (0, _eval.evalClient)(mp, 0xff000000, new _functionInfo.FunctionInfo(func).getText({
    message
  }));
};

const register = mp => {
  mp.registerPapyrusFunction('global', 'DebugEx', 'CenterOnCell', (self, args) => centerOnCell(mp, self, args));
  mp.registerPapyrusFunction('global', 'DebugEx', 'Notification', (self, args) => notification(mp, self, args));
  mp.registerPapyrusFunction('global', 'DebugEx', 'ShowEspmLoad', () => showEspList(mp));
  mp.registerPapyrusFunction('global', 'DebugEx', 'AboutForm', (self, args) => aboutForm(mp, self, args));
  mp.registerPapyrusFunction('global', 'DebugEx', 'About', (self, args) => about(mp, self, args));
  mp.registerPapyrusFunction('global', 'DebugEx', 'PrintConsole', (self, args) => sendClientConsole(mp, self, args));

  _.IDebug.CenterOnCell = args => centerOnCell(mp, null, args);

  _.IDebug.Notification = args => notification(mp, null, args);

  _.IDebug.QuitGame = args => quitGame(mp, null, args);

  _.IDebug.ToggleCollisions = args => toggleCollisions(mp, null, args);

  _.IDebug.SendAnimationEvent = args => mp.callPapyrusFunction('global', 'Debug', 'SendAnimationEvent', null, args);
};

exports.register = register;
},{"../utils/papyrusArgs":"oZY1","../properties/eval":"mJTA","../utils/functionInfo":"fC7F","../..":"QCba","./multiplayer":"QSKn"}],"ZKYg":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.skillList = void 0;
const skillList = {
  OneHanded: 0x44c,
  TwoHanded: 0x44d,
  Marksman: 0x44e,
  Block: 0x44f,
  Smithing: 0x450,
  HeavyArmor: 0x451,
  LightArmor: 0x452,
  Pickpocket: 0x453,
  Lockpicking: 0x454,
  Sneak: 0x455,
  Alchemy: 0x456,
  Speechcraft: 0x457,
  Alteration: 0x458,
  Conjuration: 0x459,
  Destruction: 0x45a,
  Illusion: 0x45b,
  Restoration: 0x45c,
  Enchanting: 0x45d
};
exports.skillList = skillList;
},{}],"Ojqs":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.register = exports.getPerkTree = void 0;

var _skillList = require("../../properties/actor/actorValues/skillList");

var _papyrusArgs = require("../../utils/papyrusArgs");

var _game = require("../game");

const getActorValueInfoByName = (mp, self, args) => {
  const name = (0, _papyrusArgs.getString)(args, 0);

  if (_skillList.skillList[name]) {
    return getActorValueInfoByID(mp, self, [_skillList.skillList[name]]);
  }
};

const getActorValueInfoByID = (mp, self, args) => {
  const formId = (0, _papyrusArgs.getNumber)(args, 0);
  return {
    type: 'espm',
    desc: mp.getDescFromId(formId)
  };
};

const addSkillExperience = (mp, self, args) => {};

const getPerkTree = (mp, self, args) => {
  var _mp$callPapyrusFuncti, _mp$callPapyrusFuncti2;

  const skill = (0, _papyrusArgs.getObject)(args, 0);
  const skillId = mp.getIdFromDesc(skill.desc);
  const espmRecord = mp.lookupEspmRecordById(skillId);
  if (!espmRecord.record) return '';
  const espmFields = espmRecord.record.fields;
  const perkTree = [];
  let index1 = 0;
  let index2 = 0;

  while (index1 !== -1 && index2 !== -1) {
    index1 = espmFields.findIndex(x => x.type === 'PNAM');
    index2 = espmFields.findIndex(x => x.type === 'INAM');

    if (index1 !== -1 && index2 !== -1) {
      const obj = {};
      const fields = espmFields.splice(index1, index2 - index1 + 1);

      const getInt = n => {
        var _fields$find;

        const d = (_fields$find = fields.find(x => x.type === n)) === null || _fields$find === void 0 ? void 0 : _fields$find.data;
        return d && new DataView(d.buffer).getUint32(0, true);
      };

      const getFloat = n => {
        var _fields$find2;

        const d = (_fields$find2 = fields.find(x => x.type === n)) === null || _fields$find2 === void 0 ? void 0 : _fields$find2.data;
        return d && new DataView(d.buffer).getFloat32(0, true);
      };

      const perkId = getInt('PNAM');
      const perk = perkId && (0, _game.getForm)(mp, null, [perkId]);
      const perkName = perk && mp.callPapyrusFunction('global', 'FormEx', 'GetName', null, [perk]);

      if (perkId === 0) {
        obj.p = null;
      } else {
        var _perkName$toString;

        obj.p = {
          id: perkId !== null && perkId !== void 0 ? perkId : -1,
          name: (_perkName$toString = perkName === null || perkName === void 0 ? void 0 : perkName.toString()) !== null && _perkName$toString !== void 0 ? _perkName$toString : ''
        };
      }

      obj.x = getInt('XNAM');
      obj.y = getInt('YNAM');
      obj.h = getFloat('HNAM');
      obj.v = getFloat('VNAM');
      obj.i = getInt('INAM');
      obj.c = fields.filter(x => x.type === 'CNAM').map(x => new DataView(x.data.buffer).getUint32(0, true));
      perkTree.push(obj);
    }
  }

  const skillItem = {
    name: (_mp$callPapyrusFuncti = mp.callPapyrusFunction('global', 'FormEx', 'GetName', null, [skill])) === null || _mp$callPapyrusFuncti === void 0 ? void 0 : _mp$callPapyrusFuncti.toString(),
    desc: (_mp$callPapyrusFuncti2 = mp.callPapyrusFunction('global', 'FormEx', 'GetDescription', null, [skill])) === null || _mp$callPapyrusFuncti2 === void 0 ? void 0 : _mp$callPapyrusFuncti2.toString(),
    tree: perkTree
  };
  return JSON.stringify(skillItem);
};

exports.getPerkTree = getPerkTree;

const register = mp => {
  mp.registerPapyrusFunction('global', 'ActorValueInfo', 'GetActorValueInfoByID', (self, args) => getActorValueInfoByID(mp, self, args));
  mp.registerPapyrusFunction('global', 'ActorValueInfo', 'GetAVIByID', (self, args) => getActorValueInfoByID(mp, self, args));
  mp.registerPapyrusFunction('global', 'ActorValueInfo', 'GetActorValueInfoByName', (self, args) => getActorValueInfoByName(mp, self, args));
  mp.registerPapyrusFunction('global', 'ActorValueInfo', 'GetAVIByName', (self, args) => getActorValueInfoByName(mp, self, args));
  mp.registerPapyrusFunction('method', 'ActorValueInfo', 'AddSkillExperience', (self, args) => addSkillExperience(mp, self, args));
  mp.registerPapyrusFunction('global', 'ActorValueInfoEx', 'GetPerkTree', (self, args) => getPerkTree(mp, self, args));
};

exports.register = register;
},{"../../properties/actor/actorValues/skillList":"ZKYg","../../utils/papyrusArgs":"oZY1","../game":"WCBi"}],"PmOp":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.register = void 0;

var _functionInfo = require("../utils/functionInfo");

var _papyrusArgs = require("../utils/papyrusArgs");

var _functions = require("./multiplayer/functions");

function globalVariableUpdate(ctx, formId) {
  if (!ctx.refr) return;
  const ac = ctx.sp.Actor.from(ctx.refr);
  if (!ac) return;

  if (ctx.value && ctx.state[`lastGlobal${formId}Value`] !== ctx.value) {
    var _ctx$sp$GlobalVariabl;

    let val = ctx.value;
    val = val < 0 ? 0 : val;
    const formGlobal = ctx.sp.Game.getFormEx(formId);
    (_ctx$sp$GlobalVariabl = ctx.sp.GlobalVariable.from(formGlobal)) === null || _ctx$sp$GlobalVariabl === void 0 ? void 0 : _ctx$sp$GlobalVariabl.setValue(val <= 0 ? 1 : val);
    ctx.state[`lastGlobal${formId}Value`] = val;
  }
}

const checkGlobalProp = (mp, acId, key, formId) => {
  if (!(0, _functions.propertyExist)(mp, acId, key)) {
    mp.makeProperty(key, {
      isVisibleByOwner: true,
      isVisibleByNeighbors: false,
      updateOwner: new _functionInfo.FunctionInfo(globalVariableUpdate).getText({
        formId
      }),
      updateNeighbor: ''
    });
  }
};

const getValue = (mp, self, args) => {
  const ac = (0, _papyrusArgs.getObject)(args, 0);
  const acId = mp.getIdFromDesc(ac.desc);
  const formId = (0, _papyrusArgs.getNumber)(args, 1);
  const propKey = `global${formId}`;
  checkGlobalProp(mp, acId, propKey, formId);

  if ((0, _functions.propertyExist)(mp, acId, propKey)) {
    return mp.get(acId, propKey);
  }
};

const setValue = (mp, self, args) => {
  const ac = (0, _papyrusArgs.getObject)(args, 0);
  const acId = mp.getIdFromDesc(ac.desc);
  const formId = (0, _papyrusArgs.getNumber)(args, 1);
  const value = (0, _papyrusArgs.getNumber)(args, 2);
  const propKey = `global${formId}`;
  checkGlobalProp(mp, acId, propKey, formId);

  if ((0, _functions.propertyExist)(mp, acId, propKey)) {
    mp.set(acId, propKey, value);
  }
};

const register = mp => {
  mp.registerPapyrusFunction('global', 'GlobalVariableEx', 'GetValue', (self, args) => getValue(mp, self, args));
  mp.registerPapyrusFunction('global', 'GlobalVariableEx', 'SetValue', (self, args) => setValue(mp, self, args));
};

exports.register = register;
},{"../utils/functionInfo":"fC7F","../utils/papyrusArgs":"oZY1","./multiplayer/functions":"zNfc"}],"oZsC":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.register = void 0;

var _ = require("../../..");

var _helper = require("../../utils/helper");

var _papyrusArgs = require("../../utils/papyrusArgs");

var _game = require("../game");

let recipes = null;
let cookingRecipe = null;

const getRecipes = mp => {
  if (!recipes) {
    recipes = JSON.parse(mp.readDataFile('xelib/COBJ.json'));
  }

  return recipes;
};

const getCookingRecipes = mp => {
  if (!cookingRecipe) {
    cookingRecipe = JSON.parse(mp.readDataFile('xelib/cooking-COBJ.json'));
  }

  return cookingRecipe;
};

const getRecipeItems = (mp, self, args) => {
  var _espmRecord$record;

  const id = (0, _papyrusArgs.getNumber)(args, 0);
  const espmRecord = mp.lookupEspmRecordById(id);
  const cntoRecords = (_espmRecord$record = espmRecord.record) === null || _espmRecord$record === void 0 ? void 0 : _espmRecord$record.fields.filter(x => x.type === 'CNTO');

  if (cntoRecords && cntoRecords.length > 0) {
    return cntoRecords.map(rec => {
      return (0, _helper.uint32)(rec.data.buffer, 0);
    });
  }
};

const getRecipeCraftItem = (mp, self, args) => {
  var _espmRecord$record2, _espmRecord$record2$f;

  const id = (0, _papyrusArgs.getNumber)(args, 0);
  const espmRecord = mp.lookupEspmRecordById(id);
  const cnam = (_espmRecord$record2 = espmRecord.record) === null || _espmRecord$record2 === void 0 ? void 0 : (_espmRecord$record2$f = _espmRecord$record2.fields.find(x => x.type === 'CNAM')) === null || _espmRecord$record2$f === void 0 ? void 0 : _espmRecord$record2$f.data;
  if (!cnam) return;
  return (0, _helper.uint32)(cnam.buffer, 0);
};

const getRecipeItemCount = (mp, self, args) => {
  var _espmRecord$record3;

  const id = (0, _papyrusArgs.getNumber)(args, 0);
  const itemId = (0, _papyrusArgs.getNumber)(args, 1);
  const espmRecord = mp.lookupEspmRecordById(id);
  const cntoRecords = (_espmRecord$record3 = espmRecord.record) === null || _espmRecord$record3 === void 0 ? void 0 : _espmRecord$record3.fields.filter(x => x.type === 'CNTO');
  if (!cntoRecords || cntoRecords.length === 0) return;
  const findItem = cntoRecords.find(rec => {
    return (0, _helper.uint32)(rec.data.buffer, 0) === itemId;
  });

  if (findItem) {
    return (0, _helper.uint32)(findItem.data.buffer, 4);
  }
};

const getResult = (mp, self) => {
  var _espmRecord$record4, _espmRecord$record4$f;

  const selfId = mp.getIdFromDesc(self.desc);
  const espmRecord = mp.lookupEspmRecordById(selfId);
  const cnam = (_espmRecord$record4 = espmRecord.record) === null || _espmRecord$record4 === void 0 ? void 0 : (_espmRecord$record4$f = _espmRecord$record4.fields.find(x => x.type === 'CNAM')) === null || _espmRecord$record4$f === void 0 ? void 0 : _espmRecord$record4$f.data;
  if (!cnam) return;
  const formid = (0, _helper.uint32)(cnam.buffer, 0);
  return (0, _game.getForm)(mp, null, [formid]);
};

const getNumIngredients = (mp, self) => {
  var _espmRecord$record5, _cntoRecords$length;

  const selfId = mp.getIdFromDesc(self.desc);
  const espmRecord = mp.lookupEspmRecordById(selfId);
  const cntoRecords = (_espmRecord$record5 = espmRecord.record) === null || _espmRecord$record5 === void 0 ? void 0 : _espmRecord$record5.fields.filter(x => x.type === 'CNTO');
  return (_cntoRecords$length = cntoRecords === null || cntoRecords === void 0 ? void 0 : cntoRecords.length) !== null && _cntoRecords$length !== void 0 ? _cntoRecords$length : 0;
};

const getNthIngredient = (mp, self, args) => {
  var _espmRecord$record6;

  const selfId = mp.getIdFromDesc(self.desc);
  const index = (0, _papyrusArgs.getNumber)(args, 0);
  const espmRecord = mp.lookupEspmRecordById(selfId);
  const cntoRecords = (_espmRecord$record6 = espmRecord.record) === null || _espmRecord$record6 === void 0 ? void 0 : _espmRecord$record6.fields.filter(x => x.type === 'CNTO');
  if (!cntoRecords || cntoRecords.length === 0) return;
  if (index >= cntoRecords.length) return;
  const formid = (0, _helper.uint32)(cntoRecords[index].data.buffer, 0);
  return (0, _game.getForm)(mp, null, [formid]);
};

const getNthIngredientQuantity = (mp, self, args) => {
  var _espmRecord$record7;

  const selfId = mp.getIdFromDesc(self.desc);
  const index = (0, _papyrusArgs.getNumber)(args, 0);
  const espmRecord = mp.lookupEspmRecordById(selfId);
  const cntoRecords = (_espmRecord$record7 = espmRecord.record) === null || _espmRecord$record7 === void 0 ? void 0 : _espmRecord$record7.fields.filter(x => x.type === 'CNTO');
  if (!cntoRecords || cntoRecords.length === 0) return 0;
  if (index >= cntoRecords.length) return 0;
  return (0, _helper.uint32)(cntoRecords[index].data.buffer, 4);
};

const getWorkbenchKeyword = (mp, self) => {
  var _espmRecord$record8, _espmRecord$record8$f;

  const selfId = mp.getIdFromDesc(self.desc);
  const espmRecord = mp.lookupEspmRecordById(selfId);
  const bnam = (_espmRecord$record8 = espmRecord.record) === null || _espmRecord$record8 === void 0 ? void 0 : (_espmRecord$record8$f = _espmRecord$record8.fields.find(x => x.type === 'BNAM')) === null || _espmRecord$record8$f === void 0 ? void 0 : _espmRecord$record8$f.data;
  if (!bnam) return;
  const formid = (0, _helper.uint32)(bnam.buffer, 0);
  return (0, _game.getForm)(mp, null, [formid]);
};

const register = mp => {
  mp.registerPapyrusFunction('method', 'ConstructibleObject', 'GetResult', self => getResult(mp, self));
  mp.registerPapyrusFunction('method', 'ConstructibleObject', 'GetNumIngredients', self => getNumIngredients(mp, self));
  mp.registerPapyrusFunction('method', 'ConstructibleObject', 'GetNthIngredient', (self, args) => getNthIngredient(mp, self, args));
  mp.registerPapyrusFunction('method', 'ConstructibleObject', 'GetNthIngredientQuantity', (self, args) => getNthIngredientQuantity(mp, self, args));
  mp.registerPapyrusFunction('method', 'ConstructibleObject', 'GetWorkbenchKeyword', self => getWorkbenchKeyword(mp, self));
  mp.registerPapyrusFunction('global', 'ConstructibleObjectEx', 'GetRecipeItems', (self, args) => getRecipeItems(mp, self, args));
  mp.registerPapyrusFunction('global', 'ConstructibleObjectEx', 'GetRecipeCraftItem', (self, args) => getRecipeCraftItem(mp, self, args));
  mp.registerPapyrusFunction('global', 'ConstructibleObjectEx', 'GetRecipeItemCount', (self, args) => getRecipeItemCount(mp, self, args));
  mp.registerPapyrusFunction('global', 'ConstructibleObjectEx', 'GetRecipes', () => getRecipes(mp));
  mp.registerPapyrusFunction('global', 'ConstructibleObjectEx', 'GetCookingRecipes', () => getCookingRecipes(mp));

  _.IConstructibleObject.GetResult = self => getResult(mp, self);

  _.IConstructibleObject.GetNumIngredients = self => getNumIngredients(mp, self);

  _.IConstructibleObject.GetNthIngredient = (self, args) => getNthIngredient(mp, self, args);

  _.IConstructibleObject.GetNthIngredientQuantity = (self, args) => getNthIngredientQuantity(mp, self, args);

  _.IConstructibleObject.GetWorkbenchKeyword = self => getWorkbenchKeyword(mp, self);
};

exports.register = register;
},{"../../..":"QCba","../../utils/helper":"FxH1","../../utils/papyrusArgs":"oZY1","../game":"WCBi"}],"SDpR":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.register = exports.isPoison = exports.isFood = exports.getNumEffects = exports.getNthEffectMagnitude = exports.getNthEffectMagicEffect = exports.getNthEffectInfo = exports.getNthEffectDuration = exports.getNthEffectArea = exports.getMagicEffects = exports.getEffectMagnitudes = exports.getEffectInfo = exports.getEffectDurations = exports.getEffectAreas = exports.equip = void 0;

var _2 = require("../../..");

var _helper = require("../../utils/helper");

var _papyrusArgs = require("../../utils/papyrusArgs");

var _game = require("../game");

const FLG_ManualCalc = 0x00001;
const FLG_Food = 0x00002;
const FLG_Medicine = 0x10000;
const FLG_Poison = 0x20000;

const flagExists = (mp, self, flag) => {
  var _espmRecord$record, _espmRecord$record$fi;

  const selfId = mp.getIdFromDesc(self.desc);
  const espmRecord = mp.lookupEspmRecordById(selfId);
  const enit = (_espmRecord$record = espmRecord.record) === null || _espmRecord$record === void 0 ? void 0 : (_espmRecord$record$fi = _espmRecord$record.fields.find(x => x.type === 'ENIT')) === null || _espmRecord$record$fi === void 0 ? void 0 : _espmRecord$record$fi.data;
  if (!enit) return false;
  const flags = (0, _helper.uint32)(enit.buffer, 4);
  return !!(flags & flag);
};

const isFood = (mp, self) => flagExists(mp, self, FLG_Food);

exports.isFood = isFood;

const isPoison = (mp, self) => flagExists(mp, self, FLG_Poison);

exports.isPoison = isPoison;

const getNumEffects = (mp, self) => {
  var _espmRecord$record$fi2, _espmRecord$record2, _espmRecord$record2$f;

  const selfId = mp.getIdFromDesc(self.desc);
  const espmRecord = mp.lookupEspmRecordById(selfId);
  return (_espmRecord$record$fi2 = (_espmRecord$record2 = espmRecord.record) === null || _espmRecord$record2 === void 0 ? void 0 : (_espmRecord$record2$f = _espmRecord$record2.fields.filter(x => x.type === 'EFID')) === null || _espmRecord$record2$f === void 0 ? void 0 : _espmRecord$record2$f.length) !== null && _espmRecord$record$fi2 !== void 0 ? _espmRecord$record$fi2 : 0;
};

exports.getNumEffects = getNumEffects;

const getEffectInfo = (mp, self) => {
  var _espmRecord$record3, _espmRecord$record4;

  const selfId = mp.getIdFromDesc(self.desc);
  const espmRecord = mp.lookupEspmRecordById(selfId);
  const efit = (_espmRecord$record3 = espmRecord.record) === null || _espmRecord$record3 === void 0 ? void 0 : _espmRecord$record3.fields.filter(x => x.type === 'EFIT');
  const efid = (_espmRecord$record4 = espmRecord.record) === null || _espmRecord$record4 === void 0 ? void 0 : _espmRecord$record4.fields.filter(x => x.type === 'EFID');
  if (!efit || efit.length === 0 || !efid || efid.length === 0) return [];
  return [efid, efit];
};

exports.getEffectInfo = getEffectInfo;

const getNthEffectInfo = (mp, self, args) => {
  var _espmRecord$record5, _espmRecord$record6;

  const selfId = mp.getIdFromDesc(self.desc);
  const index = (0, _papyrusArgs.getNumber)(args, 0);
  const espmRecord = mp.lookupEspmRecordById(selfId);
  const efit = (_espmRecord$record5 = espmRecord.record) === null || _espmRecord$record5 === void 0 ? void 0 : _espmRecord$record5.fields.filter(x => x.type === 'EFIT');
  const efid = (_espmRecord$record6 = espmRecord.record) === null || _espmRecord$record6 === void 0 ? void 0 : _espmRecord$record6.fields.filter(x => x.type === 'EFID');
  if (!efit || efit.length <= index || !efid || efid.length <= index) return [];
  return [efid[index], efit[index]];
};

exports.getNthEffectInfo = getNthEffectInfo;

const getNthEffectMagnitude = (mp, self, args) => {
  const [_, efit] = getNthEffectInfo(mp, self, args);
  return efit ? (0, _helper.float32)(efit.data.buffer, 0) : 0;
};

exports.getNthEffectMagnitude = getNthEffectMagnitude;

const getNthEffectArea = (mp, self, args) => {
  const [_, efit] = getNthEffectInfo(mp, self, args);
  return efit ? (0, _helper.uint32)(efit.data.buffer, 4) : 0;
};

exports.getNthEffectArea = getNthEffectArea;

const getNthEffectDuration = (mp, self, args) => {
  const [_, efit] = getNthEffectInfo(mp, self, args);
  return efit ? (0, _helper.uint32)(efit.data.buffer, 8) : 0;
};

exports.getNthEffectDuration = getNthEffectDuration;

const getNthEffectMagicEffect = (mp, self, args) => {
  const [efid, _] = getNthEffectInfo(mp, self, args);
  return efid && (0, _game.getForm)(mp, null, [(0, _helper.uint32)(efid.data.buffer, 0)]);
};

exports.getNthEffectMagicEffect = getNthEffectMagicEffect;

const getEffectMagnitudes = (mp, self) => {
  const [_, efit] = getEffectInfo(mp, self);
  return efit ? efit.map(x => (0, _helper.float32)(x.data.buffer, 0)) : [];
};

exports.getEffectMagnitudes = getEffectMagnitudes;

const getEffectAreas = (mp, self) => {
  const [_, efit] = getEffectInfo(mp, self);
  return efit ? efit.map(x => (0, _helper.uint32)(x.data.buffer, 4)) : [];
};

exports.getEffectAreas = getEffectAreas;

const getEffectDurations = (mp, self) => {
  const [_, efit] = getEffectInfo(mp, self);
  return efit ? efit.map(x => (0, _helper.uint32)(x.data.buffer, 8)) : [];
};

exports.getEffectDurations = getEffectDurations;

const getMagicEffects = (mp, self) => {
  const [efid, _] = getEffectInfo(mp, self);
  return efid ? efid.map(x => {
    var _getForm;

    return (_getForm = (0, _game.getForm)(mp, null, [(0, _helper.uint32)(x.data.buffer, 0)])) !== null && _getForm !== void 0 ? _getForm : null;
  }).filter(x => x) : [];
};

exports.getMagicEffects = getMagicEffects;

const equip = (mp, self, args) => {
  var _mp$get;

  const selfId = mp.getIdFromDesc(self.desc);
  const potionId = (0, _papyrusArgs.getNumber)(args, 0);
  const {
    n = 0
  } = (_mp$get = mp.get(selfId, 'ALCHequipped')) !== null && _mp$get !== void 0 ? _mp$get : {};
  mp.set(selfId, 'ALCHequipped', {
    n: n + 1,
    id: potionId
  });
};

exports.equip = equip;

const register = mp => {
  mp.registerPapyrusFunction('method', 'Potion', 'IsFood', self => isFood(mp, self));
  mp.registerPapyrusFunction('method', 'Potion', 'IsPoison', self => isPoison(mp, self));
  mp.registerPapyrusFunction('method', 'Potion', 'GetNumEffects', self => getNumEffects(mp, self));
  mp.registerPapyrusFunction('method', 'Potion', 'GetNthEffectMagnitude', (self, args) => getNthEffectMagnitude(mp, self, args));
  mp.registerPapyrusFunction('method', 'Potion', 'GetNthEffectArea', (self, args) => getNthEffectArea(mp, self, args));
  mp.registerPapyrusFunction('method', 'Potion', 'GetNthEffectDuration', (self, args) => getNthEffectDuration(mp, self, args));
  mp.registerPapyrusFunction('method', 'Potion', 'GetNthEffectMagicEffect', (self, args) => getNthEffectMagicEffect(mp, self, args));
  mp.registerPapyrusFunction('method', 'Potion', 'GetEffectMagnitudes', self => getEffectMagnitudes(mp, self));
  mp.registerPapyrusFunction('method', 'Potion', 'GetEffectAreas', self => getEffectAreas(mp, self));
  mp.registerPapyrusFunction('method', 'Potion', 'GetEffectDurations', self => getEffectDurations(mp, self));
  mp.registerPapyrusFunction('method', 'Potion', 'GetMagicEffects', self => getMagicEffects(mp, self));

  _2.IPotion.IsFood = self => isFood(mp, self);

  _2.IPotion.IsPoison = self => isPoison(mp, self);

  _2.IPotion.GetNumEffects = self => getNumEffects(mp, self);

  _2.IPotion.GetNthEffectMagnitude = (self, args) => getNthEffectMagnitude(mp, self, args);

  _2.IPotion.GetNthEffectArea = (self, args) => getNthEffectArea(mp, self, args);

  _2.IPotion.GetNthEffectDuration = (self, args) => getNthEffectDuration(mp, self, args);

  _2.IPotion.GetNthEffectMagicEffect = (self, args) => getNthEffectMagicEffect(mp, self, args);

  _2.IPotion.GetEffectMagnitudes = self => getEffectMagnitudes(mp, self);

  _2.IPotion.GetEffectAreas = self => getEffectAreas(mp, self);

  _2.IPotion.GetEffectDurations = self => getEffectDurations(mp, self);

  _2.IPotion.GetMagicEffects = self => getMagicEffects(mp, self);
};

exports.register = register;
},{"../../..":"QCba","../../utils/helper":"FxH1","../../utils/papyrusArgs":"oZY1","../game":"WCBi"}],"GeQ2":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.register = exports.getKeyword = exports.getIdKeyword = void 0;

var _ = require("../../..");

var _papyrusArgs = require("../../utils/papyrusArgs");

let keywordAll = null;

const getKeyword = (mp, self, args) => {
  const editorId = (0, _papyrusArgs.getString)(args, 0);

  if (!keywordAll) {
    keywordAll = JSON.parse(mp.readDataFile('xelib/KYWD.json'));
  }

  const id = keywordAll[editorId];

  if (typeof id === 'number') {
    return {
      desc: mp.getDescFromId(id),
      type: 'espm'
    };
  }
};

exports.getKeyword = getKeyword;

const getIdKeyword = (mp, self, args) => {
  const editorId = (0, _papyrusArgs.getString)(args, 0);

  if (!keywordAll) {
    keywordAll = JSON.parse(mp.readDataFile('xelib/KYWD.json'));
  }

  const id = keywordAll[editorId];

  if (typeof id === 'number') {
    return id;
  }
};

exports.getIdKeyword = getIdKeyword;

const register = mp => {
  mp.registerPapyrusFunction('global', 'Keyword', 'GetKeyword', (self, args) => getKeyword(mp, self, args));
  mp.registerPapyrusFunction('global', 'KeywordEx', 'GetKeyword', (self, args) => getKeyword(mp, self, args));
  mp.registerPapyrusFunction('global', 'KeywordEx', 'GetIdKeyword', (self, args) => getIdKeyword(mp, self, args));

  _.IKeyword.GetKeyword = args => getKeyword(mp, null, args);
};

exports.register = register;
},{"../../..":"QCba","../../utils/papyrusArgs":"oZY1"}],"YH8e":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sqrt = exports.register = exports.pow = exports.min = exports.max = exports.floor = exports.ceil = void 0;

var _papyrusArgs = require("../utils/papyrusArgs");

const sqrt = (mp, self, args) => Math.sqrt((0, _papyrusArgs.getNumber)(args, 0));

exports.sqrt = sqrt;

const pow = (mp, self, args) => (0, _papyrusArgs.getNumber)(args, 0) ** (0, _papyrusArgs.getNumber)(args, 1);

exports.pow = pow;

const min = (mp, self, args) => Math.min(...(0, _papyrusArgs.getNumberArray)(args, 0));

exports.min = min;

const max = (mp, self, args) => Math.max(...(0, _papyrusArgs.getNumberArray)(args, 0));

exports.max = max;

const floor = (mp, self, args) => Math.floor((0, _papyrusArgs.getNumber)(args, 0));

exports.floor = floor;

const ceil = (mp, self, args) => Math.ceil((0, _papyrusArgs.getNumber)(args, 0));

exports.ceil = ceil;

const register = mp => {
  mp.registerPapyrusFunction('global', 'Math', 'sqrt', (self, args) => sqrt(mp, self, args));
  mp.registerPapyrusFunction('global', 'Math', 'pow', (self, args) => pow(mp, self, args));
  mp.registerPapyrusFunction('global', 'Math', 'Floor', (self, args) => floor(mp, self, args));
  mp.registerPapyrusFunction('global', 'Math', 'Ceiling', (self, args) => ceil(mp, self, args));
  mp.registerPapyrusFunction('global', 'MathEx', 'min', (self, args) => min(mp, self, args));
  mp.registerPapyrusFunction('global', 'MathEx', 'max', (self, args) => max(mp, self, args));
};

exports.register = register;
},{"../utils/papyrusArgs":"oZY1"}],"pZ4P":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.register = exports.getHitShaderId = exports.getHitShader = void 0;

var _helper = require("../utils/helper");

var _papyrusArgs = require("../utils/papyrusArgs");

var _game = require("./game");

const getHitShaderId = (mp, selfNull, args) => {
  var _rec$fields$find;

  const self = (0, _papyrusArgs.getObject)(args, 0);
  const selfId = mp.getIdFromDesc(self.desc);
  const rec = mp.lookupEspmRecordById(selfId).record;
  if (!rec) return null;
  const data = (_rec$fields$find = rec.fields.find(x => x.type === 'DATA')) === null || _rec$fields$find === void 0 ? void 0 : _rec$fields$find.data;
  if (!data) return null;
  return (0, _helper.uint32)(data.buffer, 0x20);
};

exports.getHitShaderId = getHitShaderId;

const getHitShader = (mp, self) => {
  var _getForm;

  const hitShaderId = getHitShaderId(mp, null, [self]);
  if (!hitShaderId) return null;
  return (_getForm = (0, _game.getForm)(mp, null, [hitShaderId])) !== null && _getForm !== void 0 ? _getForm : null;
};

exports.getHitShader = getHitShader;

const register = mp => {
  mp.registerPapyrusFunction('method', 'MagicEffect', 'GetHitShader', self => getHitShader(mp, self));
  mp.registerPapyrusFunction('global', 'MagicEffectEx', 'GetHitShaderId', (self, args) => getHitShaderId(mp, self, args));
};

exports.register = register;
},{"../utils/helper":"FxH1","../utils/papyrusArgs":"oZY1","./game":"WCBi"}],"jRUP":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.register = exports.play = void 0;

var _papyrusArgs = require("../utils/papyrusArgs");

const _play = (mp, selfId, refId, duration) => {
  var _mp$get;

  const {
    n = 0
  } = (_mp$get = mp.get(refId, 'activeShader')) !== null && _mp$get !== void 0 ? _mp$get : {};
  mp.set(refId, 'activeShader', {
    n: n + 1,
    id: selfId,
    duration
  });
  setTimeout(() => {
    mp.set(refId, 'activeShader', {
      n: n + 2
    });
  }, 200);
};

const play = (mp, self, args) => {
  const selfId = mp.getIdFromDesc(self.desc);
  const ref = (0, _papyrusArgs.getObject)(args, 0);
  const refId = mp.getIdFromDesc(ref.desc);
  const duration = (0, _papyrusArgs.getNumber)(args, 1);

  _play(mp, selfId, refId, duration);
};

exports.play = play;

const register = mp => {
  mp.registerPapyrusFunction('method', 'EffectShader', 'Play', (self, args) => play(mp, self, args));
};

exports.register = register;
},{"../utils/papyrusArgs":"oZY1"}],"zBNb":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.register = exports.playEx = exports.play = void 0;

var _papyrusArgs = require("../utils/papyrusArgs");

const _play = (mp, selfId, refId, duration, facingRefId) => {
  var _mp$get;

  const {
    n = 0
  } = (_mp$get = mp.get(refId, 'activeVisualEffect')) !== null && _mp$get !== void 0 ? _mp$get : {};
  mp.set(refId, 'activeVisualEffect', {
    n: n + 1,
    id: selfId,
    duration,
    facingRefId
  });
  setTimeout(() => {
    mp.set(refId, 'activeVisualEffect', {
      n: n + 2
    });
  }, 200);
};

const play = (mp, self, args) => {
  const selfId = mp.getIdFromDesc(self.desc);
  const ref = (0, _papyrusArgs.getObject)(args, 0);
  const refId = mp.getIdFromDesc(ref.desc);
  const facingRef = (0, _papyrusArgs.getObject)(args, 0);
  const facingRefId = mp.getIdFromDesc(facingRef.desc);
  const duration = (0, _papyrusArgs.getNumber)(args, 1);

  _play(mp, selfId, refId, duration, facingRefId);
};

exports.play = play;

const playEx = (mp, selfNull, args) => {
  const self = (0, _papyrusArgs.getObject)(args, 0);
  const selfId = mp.getIdFromDesc(self.desc);
  const ref = (0, _papyrusArgs.getObject)(args, 1);
  const refId = mp.getIdFromDesc(ref.desc);
  const duration = (0, _papyrusArgs.getNumber)(args, 2);
  const facingRef = (0, _papyrusArgs.getObject)(args, 3);
  const facingRefId = mp.getIdFromDesc(facingRef.desc);

  _play(mp, selfId, refId, duration, facingRefId);
};

exports.playEx = playEx;

const register = mp => {
  mp.registerPapyrusFunction('method', 'VisualEffect', 'Play', (self, args) => play(mp, self, args));
  mp.registerPapyrusFunction('global', 'VisualEffectEx', 'Play', (self, args) => playEx(mp, self, args));
};

exports.register = register;
},{"../utils/papyrusArgs":"oZY1"}],"b09m":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.register = void 0;

var _functionInfo = require("../utils/functionInfo");

var _helper = require("../utils/helper");

function perksUpdate(ctx) {
  var _ctx$value, _ctx$state$lastPerks;

  if (!ctx.refr) return;
  const ac = ctx.sp.Actor.from(ctx.refr);
  if (!ac) return;

  if (ctx.value && ((_ctx$value = ctx.value) === null || _ctx$value === void 0 ? void 0 : _ctx$value.length) !== ((_ctx$state$lastPerks = ctx.state.lastPerks) === null || _ctx$state$lastPerks === void 0 ? void 0 : _ctx$state$lastPerks.length)) {
    var _ctx$state$lastPerks2;

    const lastPerks = (_ctx$state$lastPerks2 = ctx.state.lastPerks) !== null && _ctx$state$lastPerks2 !== void 0 ? _ctx$state$lastPerks2 : [];
    lastPerks.filter(x => {
      var _ctx$value2;

      return !((_ctx$value2 = ctx.value) !== null && _ctx$value2 !== void 0 && _ctx$value2.includes(x));
    }).forEach(id => {
      const newPerk = ctx.sp.Perk.from(ctx.sp.Game.getFormEx(id));

      if (ac.hasPerk(newPerk)) {
        ac.removePerk(newPerk);
      }
    });
    ctx.value.forEach(id => {
      const newPerk = ctx.sp.Perk.from(ctx.sp.Game.getFormEx(id));

      if (!ac.hasPerk(newPerk)) {
        ac.addPerk(newPerk);
      }
    });
    ctx.state.lastPerks = ctx.value;
  }
}

const register = mp => {
  mp.makeProperty('perk', {
    isVisibleByOwner: true,
    isVisibleByNeighbors: false,
    updateOwner: new _functionInfo.FunctionInfo(perksUpdate).getText({
      isEqual: _helper.isArrayEqual
    }),
    updateNeighbor: ''
  });
};

exports.register = register;
},{"../utils/functionInfo":"fC7F","../utils/helper":"FxH1"}],"sIi4":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.register = void 0;

var _functions = require("../papyrus/multiplayer/functions");

var _functionInfo = require("../utils/functionInfo");

const browserVisibleUpdate = ctx => {
  if (ctx.value === undefined || ctx.state.lastBrowserVisible === ctx.value) return;
  ctx.sp.browser.setVisible(ctx.value);
  ctx.state.lastBrowserVisible = ctx.value;
};

const browserFocusedUpdate = ctx => {
  if (ctx.value === undefined || ctx.state.lastBrowserFocused === ctx.value) return;
  ctx.sp.browser.setFocused(ctx.value);
  ctx.state.lastBrowserFocused = ctx.value;
};

const register = mp => {
  mp.makeProperty('browserVisible', {
    isVisibleByOwner: true,
    isVisibleByNeighbors: false,
    updateOwner: new _functionInfo.FunctionInfo(browserVisibleUpdate).tryCatch(),
    updateNeighbor: ''
  });
  mp.makeProperty('browserFocused', {
    isVisibleByOwner: true,
    isVisibleByNeighbors: false,
    updateOwner: new _functionInfo.FunctionInfo(browserFocusedUpdate).tryCatch(),
    updateNeighbor: ''
  });
  (0, _functions.statePropFactory)(mp, 'browserModal');
  (0, _functions.statePropFactory)(mp, 'uiOpened');
  (0, _functions.statePropFactory)(mp, 'chromeInputFocus');
};

exports.register = register;
},{"../papyrus/multiplayer/functions":"zNfc","../utils/functionInfo":"fC7F"}],"QHL1":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.avUpdate = avUpdate;
exports.avUpdateDamage = avUpdateDamage;
exports.avUpdateExp = avUpdateExp;
exports.avUpdateRestore = avUpdateRestore;

function avUpdate(ctx, avName) {
  if (ctx.refr && ctx.value !== undefined && ctx.state[`last${avName}Value`] !== ctx.value) {
    const ac = ctx.sp.Actor.from(ctx.refr);
    if (!ac) return;
    ac.setActorValue(avName, ctx.value);
    ctx.state[`last${avName}Value`] = ctx.value;
  }
}

function avUpdateDamage(ctx, avName) {
  if (ctx.refr && ctx.value !== undefined && ctx.state[`last${avName}ValueDamage`] !== ctx.value) {
    const ac = ctx.sp.Actor.from(ctx.refr);
    if (!ac) return;
    ac.damageActorValue(avName, ctx.value);
    ctx.state[`last${avName}ValueDamage`] = ctx.value;
  }
}

function avUpdateRestore(ctx, avName) {
  if (ctx.refr && ctx.value !== undefined && ctx.state[`last${avName}ValueRestore`] !== ctx.value) {
    const ac = ctx.sp.Actor.from(ctx.refr);
    if (!ac) return;
    ac.restoreActorValue(avName, ctx.value);
    ctx.state[`last${avName}ValueRestore`] = ctx.value;
  }
}

function avUpdateExp(ctx, avName) {
  if (ctx.refr && ctx.value !== undefined && ctx.state[`last${avName}ValueExp`] !== ctx.value) {
    const ac = ctx.sp.Actor.from(ctx.refr);
    if (!ac) return;
    const avInfo = ctx.sp.ActorValueInfo.getActorValueInfoByName(avName);
    if (!avInfo) return;
    const lvl = ac.getActorValue(avName);
    const nextExp = avInfo.getExperienceForLevel(lvl);
    const multiply = nextExp / 100;
    avInfo.setSkillExperience(ctx.value * multiply);
    ctx.state[`last${avName}ValueExp`] = ctx.value;
  }
}
},{}],"kcSw":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.register = void 0;

var _functionInfo = require("../../../utils/functionInfo");

var _functions = require("./functions");

var _skillList = require("./skillList");

const register = mp => {
  Object.keys(_skillList.skillList).forEach(avName => {
    mp.makeProperty(`av${avName}`, {
      isVisibleByOwner: true,
      isVisibleByNeighbors: false,
      updateOwner: new _functionInfo.FunctionInfo(_functions.avUpdate).getText({
        avName
      }),
      updateNeighbor: ''
    });
    mp.makeProperty(`av${avName}Exp`, {
      isVisibleByOwner: true,
      isVisibleByNeighbors: false,
      updateOwner: new _functionInfo.FunctionInfo(_functions.avUpdateExp).getText({
        avName
      }),
      updateNeighbor: ''
    });
    mp.makeProperty(`av${avName}Damage`, {
      isVisibleByOwner: true,
      isVisibleByNeighbors: false,
      updateOwner: new _functionInfo.FunctionInfo(_functions.avUpdateDamage).getText({
        avName
      }),
      updateNeighbor: ''
    });
  });
};

exports.register = register;
},{"../../../utils/functionInfo":"fC7F","./functions":"QHL1","./skillList":"ZKYg"}],"TBbX":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.register = void 0;

var _functions = require("../../papyrus/multiplayer/functions");

var _functionInfo = require("../../utils/functionInfo");

var attributes = _interopRequireWildcard(require("./actorValues/attributes"));

var skill = _interopRequireWildcard(require("./actorValues/skill"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const updateNeighborIsDead = ctx => {
  if (!ctx.refr) return;
  const ac = ctx.sp.Actor.from(ctx.refr);
  if (!ac) return;
  const isDead = ctx.value;

  if (isDead) {
    ac.endDeferredKill();
    ac.kill(null);
  } else {
    ac.startDeferredKill();
  }

  if (!isDead && ac.isDead()) {
    ctx.respawn();
  }
};

const updateOwnerIsDead = ctx => {
  if (!ctx.refr) return;
  const ac = ctx.sp.Actor.from(ctx.refr);
  if (!ac) return;
  ac.startDeferredKill();
  const value = ctx.value;
  if (value === undefined) return;

  if (value !== ctx.state.value) {
    const die = !!value;
    ctx.state.value = value;
    if (!die) return ctx.sp.Debug.sendAnimationEvent(ac, 'GetUpBegin');
    const pos = [ac.getPositionX(), ac.getPositionY(), ac.getPositionZ()];

    for (let i = 0; i < 200; ++i) {
      const randomActor = ctx.sp.Game.findRandomActor(pos[0], pos[1], pos[2], 10000);
      if (!randomActor) continue;
      const tgt = randomActor.getCombatTarget();
      if (!tgt || (tgt === null || tgt === void 0 ? void 0 : tgt.getFormID()) !== 0x14) continue;
      randomActor.stopCombat();
    }

    ac.pushActorAway(ac, 0);
  }
};

const updateRace = ctx => {
  if (!ctx.refr || ctx.value === undefined || ctx.state.lastRace === ctx.value) return;
  const ac = ctx.sp.Actor.from(ctx.refr);
  if (!ac) return;
  const raceForm = ctx.sp.Game.getForm(ctx.value);
  if (!raceForm) return;
  const race = ctx.sp.Race.from(raceForm);
  if (!race) return;
  ac.setRace(race);
  ctx.state.lastRace = ctx.value;
};

const register = mp => {
  attributes.register(mp);
  skill.register(mp);
  (0, _functions.statePropFactory)(mp, 'isWeaponDrawn');
  (0, _functions.statePropFactory)(mp, 'isSprinting');
  (0, _functions.statePropFactory)(mp, 'CurrentCrosshairRef');
  (0, _functions.statePropFactory)(mp, 'isFlying');
  (0, _functions.statePropFactory)(mp, 'isBlocking');
  (0, _functions.statePropFactory)(mp, 'isFirstLoad');
  (0, _functions.statePropFactory)(mp, 'startZCoord');
  mp.makeProperty('isDead', {
    isVisibleByOwner: true,
    isVisibleByNeighbors: true,
    updateNeighbor: new _functionInfo.FunctionInfo(updateNeighborIsDead).tryCatch(),
    updateOwner: new _functionInfo.FunctionInfo(updateOwnerIsDead).tryCatch()
  });
  mp.makeProperty('race', {
    isVisibleByOwner: true,
    isVisibleByNeighbors: true,
    updateNeighbor: new _functionInfo.FunctionInfo(updateRace).tryCatch(),
    updateOwner: new _functionInfo.FunctionInfo(updateRace).tryCatch()
  });
};

exports.register = register;
},{"../../papyrus/multiplayer/functions":"zNfc","../../utils/functionInfo":"fC7F","./actorValues/attributes":"Klzq","./actorValues/skill":"kcSw"}],"hqDV":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.register = void 0;

var _functions = require("../papyrus/multiplayer/functions");

const register = mp => {
  (0, _functions.statePropFactory)(mp, 'keybinding_browserSetModal');
  (0, _functions.statePropFactory)(mp, 'keybinding_browserSetVisible');
  (0, _functions.statePropFactory)(mp, 'keybinding_browserSetFocused');
};

exports.register = register;
},{"../papyrus/multiplayer/functions":"zNfc"}],"HQ1N":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.register = void 0;

var _functions = require("../../papyrus/multiplayer/functions");

var _functionInfo = require("../../utils/functionInfo");

function displayNameUpdate(ctx) {
  if (ctx.refr && ctx.value !== undefined && ctx.state.lastDislpayName !== ctx.value) {
    const ref = ctx.sp.ObjectReference.from(ctx.refr);
    if (!ref) return;
    ref.setDisplayName(ctx.value, false);
    ctx.state.lastDislpayName = ctx.value;
  }
}

const setObjectDamageStage = ctx => {
  if (!ctx.refr) return;

  if (ctx.value !== undefined && ctx.state.lastObjectDamageStage !== ctx.value) {
    const stage = ctx.value;
    const obj = ctx.refr;
    const objectStage = obj.getCurrentDestructionStage();
    if (!objectStage) return;
    const currentStage = objectStage < 0 ? 0 : objectStage;
    const damage = 100;

    if (stage < currentStage) {
      obj.clearDestruction();

      for (let i = 0; i < stage; i++) {
        obj.damageObject(damage);
      }
    } else {
      for (let i = 0; i < stage - currentStage; i++) {
        obj.damageObject(damage);
      }
    }

    ctx.state.lastObjectDamageStage = ctx.value;
  }
};

const setOpenState = ctx => {
  if (ctx.refr && ctx.value !== undefined && ctx.state.lastOpenState !== ctx.value) {
    const ref = ctx.sp.ObjectReference.from(ctx.refr);
    if (!ref) return;
    ref.setOpen(ctx.value);
    ctx.state.lastOpenState = ctx.value;
  }
};

const activeShader = ctx => {
  if (ctx.refr && ctx.value !== undefined && ctx.state.lastActiveShaderExecN !== ctx.value.n) {
    var _ctx$value$duration;

    ctx.state.lastActiveShaderExecN = ctx.value.n;
    if (!ctx.value.n || !ctx.value.id) return;
    const ref = ctx.sp.ObjectReference.from(ctx.refr);
    if (!ref) return;
    const effForm = ctx.sp.Game.getFormEx(ctx.value.id);
    if (!effForm) return;
    const eff = ctx.sp.EffectShader.from(effForm);
    if (!eff) return;
    eff.play(ref, (_ctx$value$duration = ctx.value.duration) !== null && _ctx$value$duration !== void 0 ? _ctx$value$duration : 0);
  }
};

const activeVisualEffect = ctx => {
  if (ctx.refr && ctx.value !== undefined && ctx.state.lastActiveVisualEffectExecN !== ctx.value.n) {
    var _ctx$value$duration2;

    ctx.state.lastActiveVisualEffectExecN = ctx.value.n;
    if (!ctx.value.n || !ctx.value.id) return;
    const ref = ctx.sp.ObjectReference.from(ctx.refr);
    if (!ref) return;
    const effForm = ctx.sp.Game.getFormEx(ctx.value.id);
    if (!effForm) return;
    const eff = ctx.sp.VisualEffect.from(effForm);
    if (!eff) return;
    eff.play(ref, (_ctx$value$duration2 = ctx.value.duration) !== null && _ctx$value$duration2 !== void 0 ? _ctx$value$duration2 : 0, ref);
  }
};

const ALCHequipped = ctx => {
  if (ctx.refr && ctx.value !== undefined && ctx.state.lastALCHequippedExecN !== ctx.value.n) {
    ctx.state.lastALCHequippedExecN = ctx.value.n;
    if (!ctx.value.n || !ctx.value.id) return;
    const ac = ctx.sp.Actor.from(ctx.refr);
    if (!ac) return;
    const item = ctx.sp.Game.getFormEx(ctx.value.id);
    ac.equipItem(item, false, true);
  }
};

const setScale = ctx => {
  if (ctx.refr && ctx.value !== undefined && ctx.state.lastScale !== ctx.value) {
    const ref = ctx.sp.ObjectReference.from(ctx.refr);
    if (!ref) return;
    ref.setScale(ctx.value);
    ctx.state.lastScale = ctx.value;
  }
};

const register = mp => {
  mp.makeProperty('displayName', {
    isVisibleByOwner: true,
    isVisibleByNeighbors: true,
    updateOwner: new _functionInfo.FunctionInfo(displayNameUpdate).tryCatch(),
    updateNeighbor: new _functionInfo.FunctionInfo(displayNameUpdate).tryCatch()
  });
  mp.makeProperty('currentDestructionStage', {
    isVisibleByOwner: true,
    isVisibleByNeighbors: true,
    updateOwner: new _functionInfo.FunctionInfo(setObjectDamageStage).tryCatch(),
    updateNeighbor: new _functionInfo.FunctionInfo(setObjectDamageStage).tryCatch()
  });
  (0, _functions.statePropFactory)(mp, 'cellDesc');
  mp.makeProperty('openState', {
    isVisibleByOwner: true,
    isVisibleByNeighbors: true,
    updateOwner: new _functionInfo.FunctionInfo(setOpenState).tryCatch(),
    updateNeighbor: new _functionInfo.FunctionInfo(setOpenState).tryCatch()
  });
  mp.makeProperty('activeShader', {
    isVisibleByOwner: true,
    isVisibleByNeighbors: true,
    updateOwner: new _functionInfo.FunctionInfo(activeShader).tryCatch(),
    updateNeighbor: new _functionInfo.FunctionInfo(activeShader).tryCatch()
  });
  mp.makeProperty('activeVisualEffect', {
    isVisibleByOwner: true,
    isVisibleByNeighbors: true,
    updateOwner: new _functionInfo.FunctionInfo(activeVisualEffect).tryCatch(),
    updateNeighbor: new _functionInfo.FunctionInfo(activeVisualEffect).tryCatch()
  });
  mp.makeProperty('ALCHequipped', {
    isVisibleByOwner: true,
    isVisibleByNeighbors: true,
    updateOwner: new _functionInfo.FunctionInfo(ALCHequipped).tryCatch(),
    updateNeighbor: new _functionInfo.FunctionInfo(ALCHequipped).tryCatch()
  });
  mp.makeProperty('scale', {
    isVisibleByOwner: true,
    isVisibleByNeighbors: true,
    updateOwner: new _functionInfo.FunctionInfo(setScale).tryCatch(),
    updateNeighbor: new _functionInfo.FunctionInfo(setScale).tryCatch()
  });
};

exports.register = register;
},{"../../papyrus/multiplayer/functions":"zNfc","../../utils/functionInfo":"fC7F"}],"bSOF":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.register = void 0;

var _functions = require("../papyrus/multiplayer/functions");

const register = mp => {
  (0, _functions.statePropFactory)(mp, 'spawnTimeToRespawn');
};

exports.register = register;
},{"../papyrus/multiplayer/functions":"zNfc"}],"vmr5":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.register = void 0;

var _functions = require("../papyrus/multiplayer/functions");

const register = mp => {
  (0, _functions.statePropFactory)(mp, 'lastAnimation');
};

exports.register = register;
},{"../papyrus/multiplayer/functions":"zNfc"}],"z8sU":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LocalizationProvider = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class LocalizationProvider {
  constructor(mp, localizationFilePath, mode) {
    _defineProperty(this, "mp", void 0);

    _defineProperty(this, "localizationFilePath", void 0);

    _defineProperty(this, "mode", void 0);

    _defineProperty(this, "localization", void 0);

    this.mp = mp;
    this.localizationFilePath = localizationFilePath;
    this.mode = mode;
    this.localization = {};
  }

  getText(msgId) {
    if (Object.keys(this.localization).length === 0) {
      const contents = this.mp.readDataFile(this.localizationFilePath);

      try {
        this.localization = JSON.parse(contents);
      } catch (e) {
        this.localization = {};
      }
    }

    const res = this.localization[msgId] || msgId;

    if (this.mode === 'hotreload') {
      this.localization = {};
    }

    return res;
  }

}

exports.LocalizationProvider = LocalizationProvider;
},{}],"lAw9":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StringLocalizationProvider = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const formatLocalization = locale => {
  switch (locale) {
    case 'ru-RU':
      return 'russian';

    case 'en-US':
      return 'english';

    case 'fr-FR':
      return 'french';

    case 'de-DE':
      return 'german';

    case 'it-IT':
      return 'italian';

    case 'ja-JP':
      return 'japanese';

    case 'pl-PL':
      return 'polish';

    case 'es-ES':
      return 'spanish';

    default:
      return 'english';
  }
};

class StringLocalizationProvider {
  constructor(mp, stringsFilePath, locale = 'en-US') {
    _defineProperty(this, "mp", void 0);

    _defineProperty(this, "stringsFilePath", void 0);

    _defineProperty(this, "strings", void 0);

    this.mp = mp;
    this.stringsFilePath = stringsFilePath;
    this.strings = {};
    const regex = new RegExp(`strings.+_${formatLocalization(locale)}\\.json`);
    this.mp.readDataDirectory().filter(x => x.match(regex)).forEach(x => {
      const espName = x.replace('strings\\', '').split('_')[0].toLowerCase().trim();
      this.strings[espName] = JSON.parse(this.mp.readDataFile(x));
    });
  }

  getText(espName, index) {
    var _this$strings$espName;

    if (!this.strings[espName]) return;
    return (_this$strings$espName = this.strings[espName].find(x => x.Index.toString() === index.toString())) === null || _this$strings$espName === void 0 ? void 0 : _this$strings$espName.Text;
  }

}

exports.StringLocalizationProvider = StringLocalizationProvider;
},{}],"nnyN":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ServerOptionProvider = void 0;

var _papyrusArgs = require("../../utils/papyrusArgs");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class ServerOptionProvider {
  get data() {
    return this.mp.readDataFile('server-options.json');
  }

  get json() {
    const data = JSON.parse(this.decomment(this.data));
    Object.keys(this.defaultSettings).forEach(k => {
      if (data[k] === undefined) data[k] = this.defaultSettings[k];
    });
    return data;
  }

  constructor(mp, hotReload) {
    _defineProperty(this, "mp", void 0);

    _defineProperty(this, "hotReload", void 0);

    _defineProperty(this, "serverOptions", void 0);

    _defineProperty(this, "defaultSettings", {
      serverName: 'Secret Project',
      EnableDebug: false,
      isVanillaSpawn: false,
      CookingDuration: 5,
      CookingActivationDistance: 55,
      IsChooseSpawnEnable: true,
      SpawnTimeToRespawn: 1,
      spawnTimeToRespawnNPC: 10,
      spawnTimeById: [],
      SatietyDefaultValue: 95,
      SatietyDelay: 120,
      SatietyReduceValue: -1,
      HitDamageMod: -5,
      HitStaminaReduce: 5,
      isPowerAttackMult: 2,
      isBashAttackMult: 0.5,
      isPowerAttackStaminaReduce: 25,
      keybindingBrowserSetVisible: 60,
      keybindingBrowserSetFocused: 64,
      keybindingShowPerkTree: 24,
      keybindingAcceptTrade: 21,
      keybindingRejectTrade: 49,
      SafeLocations: [],
      StartUpItemsAdd: ['0x12eb7;1', '0x3eadd;50', '0x3eade;50'],
      StartUpItemsAddJSON: [{
        desc: '0x12eb7:Skyrim.esm',
        count: 1
      }, {
        desc: '0x3eadd:Skyrim.esm',
        count: 50
      }, {
        desc: '0x3eade:Skyrim.esm',
        count: 50
      }],
      LocationsForBuying: [],
      LocationsForBuyingValue: [],
      TimeScale: 20,
      showNickname: false,
      enableInterval: true,
      enableALCHeffect: true,
      adminPassword: '12345',
      debugAttrAll: false
    });

    this.mp = mp;
    this.hotReload = hotReload;
    if (!this.hotReload) this.serverOptions = this.json;
  }

  getServerOptions() {
    var _this$serverOptions;

    return (_this$serverOptions = this.serverOptions) !== null && _this$serverOptions !== void 0 ? _this$serverOptions : this.json;
  }

  getServerOptionsValue(args) {
    var _Object$keys$find, _settings$key;

    const settings = this.getServerOptions();
    const key = (_Object$keys$find = Object.keys(settings).find(x => x.toLowerCase() === (0, _papyrusArgs.getString)(args, 0).toLowerCase())) !== null && _Object$keys$find !== void 0 ? _Object$keys$find : Object.keys(this.defaultSettings).find(x => x.toLowerCase() === (0, _papyrusArgs.getString)(args, 0).toLowerCase());
    if (!key) return null;
    const value = (_settings$key = settings[key]) !== null && _settings$key !== void 0 ? _settings$key : this.defaultSettings[key];
    return value;
  }

  decomment(jsonString) {
    const regex = /\/\/.+/gm;
    return jsonString.replace(regex, '');
  }

}

exports.ServerOptionProvider = ServerOptionProvider;
},{"../../utils/papyrusArgs":"oZY1"}],"QCba":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.serverOptionProvider = exports.IWorldSpace = exports.IWeapon = exports.IRace = exports.IPotion = exports.IPerk = exports.IOutfit = exports.IObjectReference = exports.IMagicEffect = exports.IM = exports.ILocation = exports.IKeyword = exports.IGame = exports.IForm = exports.IDebug = exports.IConstructibleObject = exports.ICell = exports.IArmor = exports.IActor = void 0;

var _propertiesSaver = require("./src/propertiesSaver");

var trigger = _interopRequireWildcard(require("./src/events/trigger"));

var events = _interopRequireWildcard(require("./src/events"));

var synchronization = _interopRequireWildcard(require("./src/synchronization"));

var multiplayer = _interopRequireWildcard(require("./src/papyrus/multiplayer"));

var stringUtil = _interopRequireWildcard(require("./src/papyrus/stringUtil"));

var actor = _interopRequireWildcard(require("./src/papyrus/actor"));

var objectReference = _interopRequireWildcard(require("./src/papyrus/objectReference"));

var utility = _interopRequireWildcard(require("./src/papyrus/utility"));

var game = _interopRequireWildcard(require("./src/papyrus/game"));

var debug = _interopRequireWildcard(require("./src/papyrus/debug"));

var form = _interopRequireWildcard(require("./src/papyrus/form"));

var actorValueInfo = _interopRequireWildcard(require("./src/papyrus/actorValueInfo"));

var weapon = _interopRequireWildcard(require("./src/papyrus/weapon"));

var globalVariable = _interopRequireWildcard(require("./src/papyrus/globalVariable"));

var constructibleObject = _interopRequireWildcard(require("./src/papyrus/constructibleObject"));

var activeMagicEffect = _interopRequireWildcard(require("./src/papyrus/activeMagicEffect"));

var potion = _interopRequireWildcard(require("./src/papyrus/potion"));

var perk = _interopRequireWildcard(require("./src/papyrus/perk"));

var keyword = _interopRequireWildcard(require("./src/papyrus/keyword"));

var cell = _interopRequireWildcard(require("./src/papyrus/cell"));

var location = _interopRequireWildcard(require("./src/papyrus/location"));

var math = _interopRequireWildcard(require("./src/papyrus/math"));

var magicEffect = _interopRequireWildcard(require("./src/papyrus/magicEffect"));

var effectShader = _interopRequireWildcard(require("./src/papyrus/effectShader"));

var visualEffect = _interopRequireWildcard(require("./src/papyrus/visualEffect"));

var perkProp = _interopRequireWildcard(require("./src/properties/perks"));

var evalProp = _interopRequireWildcard(require("./src/properties/eval"));

var browserProp = _interopRequireWildcard(require("./src/properties/browser"));

var actorProp = _interopRequireWildcard(require("./src/properties/actor"));

var inputProp = _interopRequireWildcard(require("./src/properties/input"));

var objectReferenceProp = _interopRequireWildcard(require("./src/properties/objectReference"));

var spawnProp = _interopRequireWildcard(require("./src/properties/spawn"));

var animProp = _interopRequireWildcard(require("./src/properties/anim"));

var _localizationProvider = require("./src/utils/localizationProvider");

var _stringLocalizationProvider = require("./src/utils/stringLocalizationProvider");

var _serverOptions = require("./src/papyrus/game/server-options");

var modules = _interopRequireWildcard(require("./src/modules"));

var _shared = require("./src/events/shared");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const log = console.log;

console.debug = (...data) => {
  log('[DEBUG]', '\x1b[36m', ...data, '\x1b[0m');
};

console.error = (...data) => {
  log('[ERROR]', '\x1b[31m', ...data, '\x1b[0m');
};

console.log('gamemode.js starts...');
const register = mp.registerPapyrusFunction;

mp.registerPapyrusFunction = (callType, className, functionName, f) => {
  const diff = 2;

  if (callType === 'method') {
    register(callType, className, functionName, (self, args) => {
      const start = Date.now();
      const result = f(self, args);

      if (Date.now() - start > diff) {
        console.log(`PapyrusFunction ${className}.${functionName}: `, Date.now() - start);
      }

      return result;
    });
  } else if (callType === 'global') {
    register(callType, className, functionName, (self, args) => {
      const start = Date.now();
      const result = f(self, args);

      if (Date.now() - start > diff) {
        console.log(`PapyrusFunction ${className}.${functionName}: `, Date.now() - start);
      }

      return result;
    });
  }
};

const setProp = mp.set;

mp.set = (formId, propertyName, newValue) => {
  setProp(formId, propertyName, newValue);
  (0, _propertiesSaver.addToQueue)(formId, propertyName, newValue);
};

const config = mp.getServerSettings();
const locale = config.locale;
const isPapyrusHotReloadEnabled = config.isPapyrusHotReloadEnabled;
const isServerOptionsHotReloadEnabled = config.isServerOptionsHotReloadEnabled;
const localizationProvider = new _localizationProvider.LocalizationProvider(mp, `localization/${locale}.json`, isPapyrusHotReloadEnabled ? 'hotreload' : 'once');
const stringLocalizationProvider = new _stringLocalizationProvider.StringLocalizationProvider(mp, mp.readDataFile(`localization/${locale}.json`), locale);
const serverOptionProvider = new _serverOptions.ServerOptionProvider(mp, isServerOptionsHotReloadEnabled);
exports.serverOptionProvider = serverOptionProvider;
mp.clear();
const IForm = {};
exports.IForm = IForm;
const IObjectReference = {};
exports.IObjectReference = IObjectReference;
const IWeapon = {};
exports.IWeapon = IWeapon;
const IActor = {};
exports.IActor = IActor;
const IKeyword = {};
exports.IKeyword = IKeyword;
const ICell = {};
exports.ICell = ICell;
const ILocation = {};
exports.ILocation = ILocation;
const IPotion = {};
exports.IPotion = IPotion;
const IWorldSpace = {};
exports.IWorldSpace = IWorldSpace;
const IMagicEffect = {};
exports.IMagicEffect = IMagicEffect;
const IArmor = {};
exports.IArmor = IArmor;
const IConstructibleObject = {};
exports.IConstructibleObject = IConstructibleObject;
const IPerk = {};
exports.IPerk = IPerk;
const IRace = {};
exports.IRace = IRace;
const IOutfit = {};
exports.IOutfit = IOutfit;
const IGame = {};
exports.IGame = IGame;
const IDebug = {};
exports.IDebug = IDebug;
const IM = {};
exports.IM = IM;
trigger.register(mp);
perkProp.register(mp);
evalProp.register(mp);
actorProp.register(mp);
browserProp.register(mp);
objectReferenceProp.register(mp);
inputProp.register(mp);
spawnProp.register(mp);
animProp.register(mp);
events.register(mp);
synchronization.register(mp);
form.register(mp, stringLocalizationProvider);
multiplayer.register(mp, localizationProvider);
stringUtil.register(mp);
actor.register(mp);
actorValueInfo.register(mp);
objectReference.register(mp);
utility.register(mp);
game.register(mp, serverOptionProvider);
debug.register(mp);
weapon.register(mp);
globalVariable.register(mp);
constructibleObject.register(mp);
activeMagicEffect.register(mp);
potion.register(mp);
perk.register(mp);
keyword.register(mp);
cell.register(mp);
location.register(mp);
math.register(mp);
magicEffect.register(mp);
effectShader.register(mp);
visualEffect.register(mp);
setTimeout(() => {
  (0, _propertiesSaver.getAllPropsFromData)(mp);
  (0, _propertiesSaver.runPropertiesSaver)(mp);
  mp.callPapyrusFunction('global', 'GM_Main', '_OnPapyrusRegister', null, []);
  mp.get(0, 'onlinePlayers').forEach(p => {
    (0, _shared.overrideNotify)(mp, p);
  });
  modules.init(mp);
}, 0);
},{"./src/propertiesSaver":"OORL","./src/events/trigger":"nXcD","./src/events":"VJVi","./src/synchronization":"vm0Z","./src/papyrus/multiplayer":"QSKn","./src/papyrus/stringUtil":"ejLG","./src/papyrus/actor":"ZYrz","./src/papyrus/objectReference":"YRYD","./src/papyrus/utility":"GnGy","./src/papyrus/game":"WCBi","./src/papyrus/debug":"tMCa","./src/papyrus/form":"mnzc","./src/papyrus/actorValueInfo":"Ojqs","./src/papyrus/weapon":"TCaz","./src/papyrus/globalVariable":"PmOp","./src/papyrus/constructibleObject":"oZsC","./src/papyrus/activeMagicEffect":"dvBS","./src/papyrus/potion":"SDpR","./src/papyrus/perk":"Fep9","./src/papyrus/keyword":"GeQ2","./src/papyrus/cell":"WIJZ","./src/papyrus/location":"kLvY","./src/papyrus/math":"YH8e","./src/papyrus/magicEffect":"pZ4P","./src/papyrus/effectShader":"jRUP","./src/papyrus/visualEffect":"zBNb","./src/properties/perks":"b09m","./src/properties/eval":"mJTA","./src/properties/browser":"sIi4","./src/properties/actor":"TBbX","./src/properties/input":"hqDV","./src/properties/objectReference":"HQ1N","./src/properties/spawn":"bSOF","./src/properties/anim":"vmr5","./src/utils/localizationProvider":"z8sU","./src/utils/stringLocalizationProvider":"lAw9","./src/papyrus/game/server-options":"nnyN","./src/modules":"uozv","./src/events/shared":"jnne"}]},{},["QCba"], null)
