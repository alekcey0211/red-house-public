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
})({"fC7F":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FunctionInfo = void 0;

class FunctionInfo {
  constructor(f) {
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

    for (let name in args) {
      const arg = args[name];

      switch (typeof arg) {
        case 'number':
          result = `const ${name} = ${arg};\n` + result;
          break;

        case 'string':
          result = `const ${name} = '${arg}';\n` + result;
          break;

        case 'boolean':
          result = `const ${name} = ${arg};\n` + result;
          break;

        case 'object':
          if (Array.isArray(arg)) {
            if (typeof arg[0] === 'number') {
              result = `const ${name} = [${arg}];\n` + result;
            } else if (typeof arg[0] === 'string') {
              result = `const ${name} = [${arg.map(x => `"${x}"`)}];\n` + result;
            }
          }

          break;

        case 'function':
          result = `const ${name} = ${arg.toString()};\n` + result;
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

const functionInfo_1 = require("../utils/functionInfo");

const intervalDelay = 200;

const execEvalCommand = (mp, current, isVisibleByNeighbors) => {
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
    execEvalCommand(mp, current, isVisibleByNeighbors);
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
    }, isVisibleByNeighbors);
    return;
  }

  evalCommandList.push({
    id,
    f
  });
  if (evalRunning) return;
  const current = evalCommandList.shift();

  if (current) {
    execEvalCommand(mp, current, isVisibleByNeighbors);
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
    updateOwner: new functionInfo_1.FunctionInfo(evalUpdate).tryCatch(),
    updateNeighbor: ''
  });
  mp.makeProperty('evalAll', {
    isVisibleByOwner: true,
    isVisibleByNeighbors: true,
    updateOwner: new functionInfo_1.FunctionInfo(evalUpdate).tryCatch(),
    updateNeighbor: new functionInfo_1.FunctionInfo(evalUpdate).tryCatch()
  });
  mp.makeProperty('evalOther', {
    isVisibleByOwner: false,
    isVisibleByNeighbors: true,
    updateOwner: '',
    updateNeighbor: new functionInfo_1.FunctionInfo(evalUpdate).tryCatch()
  });
};

exports.register = register;
},{"../utils/functionInfo":"fC7F"}],"oZY1":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBooleanArray = exports.getBoolean = exports.getNumberArray = exports.getNumber = exports.getStringArray = exports.getString = exports.getObjectArray = exports.getObject = void 0;

const err = (index, x, expectedTypeName) => {
  throw new TypeError(`The argument with index ${index} has value (${JSON.stringify(x)}) that doesn't meet the requirements of ${expectedTypeName}`);
};

const getArray = (args, index, type) => {
  const x = args[index];

  if (x === null || x === undefined) {
    return [];
  }

  return Array.isArray(x) && !x.filter(v => typeof v !== type).length ? x : err(index, x, type + '[]');
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

const eval_1 = require("../../properties/eval");

const functionInfo_1 = require("../../utils/functionInfo");

const papyrusArgs_1 = require("../../utils/papyrusArgs");

const getForm = (mp, self, args) => {
  var _a, _b;

  const formId = papyrusArgs_1.getNumber(args, 0);

  try {
    if (formId >= 0xff000000) {
      mp.get(formId, 'type');
      return {
        desc: mp.getDescFromId(formId),
        type: 'form'
      };
    } else {
      const espm = mp.lookupEspmRecordById(formId);

      if (!((_a = espm.record) === null || _a === void 0 ? void 0 : _a.type)) {
        console.log(`ESPM Record by id ${formId.toString(16)} not found`);
        return;
      }

      const obj = {
        desc: mp.getDescFromId(formId),
        type: ['REFR', 'ACHR'].includes((_b = espm.record) === null || _b === void 0 ? void 0 : _b.type) ? 'form' : 'espm'
      };
      return obj;
    }
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
  const formId = papyrusArgs_1.getNumber(args, 0);
  const fileName = papyrusArgs_1.getString(args, 1);
  const desc = getDesc(mp, formId, fileName);
  if (!desc) return;

  try {
    return exports.getForm(mp, null, [mp.getIdFromDesc(desc)]);
  } catch (error) {
    console.log(error);
  }
};

exports.getFormFromFile = getFormFromFile;

const getFormFromFileEx = (mp, self, args) => {
  const formId = papyrusArgs_1.getNumber(args, 0);
  const fileName = papyrusArgs_1.getString(args, 1);
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
  const ac = papyrusArgs_1.getObject(args, 0);
  const acId = mp.getIdFromDesc(ac.desc);

  const func = ctx => {
    ctx.sp.once('update', () => {
      ctx.sp.Game.forceThirdPerson();
    });
  };

  eval_1.evalClient(mp, acId, new functionInfo_1.FunctionInfo(func).getText({}));
};

const disablePlayerControls = (mp, self, args) => {
  const ac = papyrusArgs_1.getObject(args, 0);
  const acId = mp.getIdFromDesc(ac.desc);

  const func = ctx => {
    ctx.sp.once('update', () => {
      ctx.sp.Game.disablePlayerControls(false, false, false, true, false, false, false, false, 0);
    });
  };

  eval_1.evalClient(mp, acId, new functionInfo_1.FunctionInfo(func).getText({}));
};

const enablePlayerControls = (mp, self, args) => {
  const ac = papyrusArgs_1.getObject(args, 0);
  const acId = mp.getIdFromDesc(ac.desc);

  const func = ctx => {
    ctx.sp.once('update', () => {
      ctx.sp.Game.enablePlayerControls(true, true, true, true, true, true, true, true, 0);
    });
  };

  eval_1.evalClient(mp, acId, new functionInfo_1.FunctionInfo(func).getText({}));
};

const getCurrentCrosshairRef = (mp, selfNull, args) => {
  const self = papyrusArgs_1.getObject(args, 0);
  const selfId = mp.getIdFromDesc(self.desc);
  const refId = mp.get(selfId, 'CurrentCrosshairRef');
  if (!refId) return undefined;
  return exports.getForm(mp, null, [refId]);
};

const register = (mp, serverOptionProvider) => {
  mp.registerPapyrusFunction('global', 'Game', 'GetForm', (self, args) => exports.getForm(mp, self, args));
  mp.registerPapyrusFunction('global', 'Game', 'GetFormEx', (self, args) => exports.getForm(mp, self, args));
  mp.registerPapyrusFunction('global', 'Game', 'GetFormFromFile', (self, args) => exports.getFormFromFile(mp, self, args));
  mp.registerPapyrusFunction('global', 'GameEx', 'GetFormFromFile', (self, args) => exports.getFormFromFileEx(mp, self, args));
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
};

exports.register = register;
},{"../../properties/eval":"mJTA","../../utils/functionInfo":"fC7F","../../utils/papyrusArgs":"oZY1"}],"wmVe":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.register = exports.getLinkedCellId = exports.getLinkedDoorId = exports.teleportToLinkedDoorMarker = exports.getDistance = exports.getAngleZ = exports.getAngleY = exports.getAngleX = exports.getAngle = exports.setAngle = exports.getEspPosition = exports.getPositionZ = exports.getPositionY = exports.getPositionX = exports.getPosition = exports.setPosition = void 0;

const papyrusArgs_1 = require("../../utils/papyrusArgs");

const setPosition = (mp, self, args) => {
  const selfId = mp.getIdFromDesc(self.desc);
  const [x, y, z] = [papyrusArgs_1.getNumber(args, 0), papyrusArgs_1.getNumber(args, 1), papyrusArgs_1.getNumber(args, 2)];
  mp.set(selfId, 'pos', [x, y, z]);
};

exports.setPosition = setPosition;

const getPosition = (mp, self) => {
  var _a;

  return (_a = mp.get(mp.getIdFromDesc(self.desc), 'pos')) !== null && _a !== void 0 ? _a : [0, 0, 0];
};

exports.getPosition = getPosition;

const getPositionX = (mp, self) => exports.getPosition(mp, self)[0];

exports.getPositionX = getPositionX;

const getPositionY = (mp, self) => exports.getPosition(mp, self)[1];

exports.getPositionY = getPositionY;

const getPositionZ = (mp, self) => exports.getPosition(mp, self)[2];

exports.getPositionZ = getPositionZ;

const getEspPosition = (mp, placeId) => {
  var _a, _b;

  const espmRecord = mp.lookupEspmRecordById(placeId);
  const data = (_b = (_a = espmRecord.record) === null || _a === void 0 ? void 0 : _a.fields.find(x => x.type === 'DATA')) === null || _b === void 0 ? void 0 : _b.data;

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
  const [x, y, z] = [papyrusArgs_1.getNumber(args, 0), papyrusArgs_1.getNumber(args, 1), papyrusArgs_1.getNumber(args, 2)];
  mp.set(selfId, 'angle', [x, y, z]);
};

exports.setAngle = setAngle;

const getAngle = (mp, self) => {
  var _a;

  return (_a = mp.get(mp.getIdFromDesc(self.desc), 'angle')) !== null && _a !== void 0 ? _a : [0, 0, 0];
};

exports.getAngle = getAngle;

const getAngleX = (mp, self) => exports.getAngle(mp, self)[0];

exports.getAngleX = getAngleX;

const getAngleY = (mp, self) => exports.getAngle(mp, self)[1];

exports.getAngleY = getAngleY;

const getAngleZ = (mp, self) => exports.getAngle(mp, self)[2];

exports.getAngleZ = getAngleZ;

const getDistance = (mp, self, args) => {
  const target = papyrusArgs_1.getObject(args, 0);
  const selfPosition = exports.getPosition(mp, self);
  const targetCoord = exports.getPosition(mp, target);
  return Math.sqrt(Math.pow(selfPosition[0] - targetCoord[0], 2) + Math.pow(selfPosition[1] - targetCoord[1], 2) + Math.pow(selfPosition[2] - targetCoord[2], 2));
};

exports.getDistance = getDistance;

const teleportToLinkedDoorMarker = (mp, self, args) => {
  var _a, _b;

  const objectToTeleportId = mp.getIdFromDesc(papyrusArgs_1.getObject(args, 1).desc);
  const door = papyrusArgs_1.getObject(args, 0);
  const espmRecord = mp.lookupEspmRecordById(mp.getIdFromDesc(door.desc));
  const xtel = (_b = (_a = espmRecord.record) === null || _a === void 0 ? void 0 : _a.fields.find(x => x.type === 'XTEL')) === null || _b === void 0 ? void 0 : _b.data;

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
  var _a, _b;

  const espmRecord = mp.lookupEspmRecordById(mp.getIdFromDesc(papyrusArgs_1.getObject(args, 0).desc));
  const xtel = (_b = (_a = espmRecord.record) === null || _a === void 0 ? void 0 : _a.fields.find(x => x.type === 'XTEL')) === null || _b === void 0 ? void 0 : _b.data;

  if (xtel) {
    const dataView = new DataView(xtel.buffer);
    const linkedDoorId = dataView.getUint32(0, true);
    return linkedDoorId;
  }

  return 0;
};

exports.getLinkedDoorId = getLinkedDoorId;

const getLinkedCellId = (mp, self, args) => {
  var _a, _b;

  const espmRecord = mp.lookupEspmRecordById(mp.getIdFromDesc(papyrusArgs_1.getObject(args, 0).desc));
  const xtel = (_b = (_a = espmRecord.record) === null || _a === void 0 ? void 0 : _a.fields.find(x => x.type === 'XTEL')) === null || _b === void 0 ? void 0 : _b.data;

  if (xtel) {
    const dataView = new DataView(xtel.buffer);
    const linkedDoorId = dataView.getUint32(0, true);
    const linkedCellId = mp.getIdFromDesc(mp.get(linkedDoorId, 'worldOrCellDesc'));
    return linkedCellId;
  }

  return 0;
};

exports.getLinkedCellId = getLinkedCellId;

const register = mp => {
  mp.registerPapyrusFunction('method', 'ObjectReference', 'SetPosition', (self, args) => exports.setPosition(mp, self, args));
  mp.registerPapyrusFunction('method', 'ObjectReference', 'GetPositionX', self => exports.getPositionX(mp, self));
  mp.registerPapyrusFunction('method', 'ObjectReference', 'GetPositionY', self => exports.getPositionY(mp, self));
  mp.registerPapyrusFunction('method', 'ObjectReference', 'GetPositionZ', self => exports.getPositionZ(mp, self));
  mp.registerPapyrusFunction('method', 'ObjectReference', 'SetAngle', (self, args) => exports.setAngle(mp, self, args));
  mp.registerPapyrusFunction('method', 'ObjectReference', 'GetAngleX', self => exports.getAngleX(mp, self));
  mp.registerPapyrusFunction('method', 'ObjectReference', 'GetAngleY', self => exports.getAngleY(mp, self));
  mp.registerPapyrusFunction('method', 'ObjectReference', 'GetAngleZ', self => exports.getAngleZ(mp, self));
  mp.registerPapyrusFunction('global', 'ObjectReferenceEx', 'TeleportToLinkedDoorMarker', (self, args) => exports.teleportToLinkedDoorMarker(mp, self, args));
  mp.registerPapyrusFunction('global', 'ObjectReferenceEx', 'GetLinkedDoorId', (self, args) => exports.getLinkedDoorId(mp, self, args));
  mp.registerPapyrusFunction('global', 'ObjectReferenceEx', 'GetLinkedCellId', (self, args) => exports.getLinkedCellId(mp, self, args));
};

exports.register = register;
},{"../../utils/papyrusArgs":"oZY1"}],"zNfc":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.statePropFactory = exports.checkAndCreatePropertyExist = exports.propertyExist = exports.handleNotExistsProperty = void 0;

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
    if (exports.handleNotExistsProperty(err)) {
      return false;
    }

    console.log(err);
  }
};

exports.propertyExist = propertyExist;

const checkAndCreatePropertyExist = (mp, formId, key) => {
  try {
    mp.get(formId, key);
  } catch (err) {
    if (exports.handleNotExistsProperty(err)) {
      exports.statePropFactory(mp, key);
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
},{}],"P8j4":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.register = exports.setStorageValue = exports._setStorageValue = exports.setStorageValueFormArray = exports.setStorageValueForm = exports.setStorageValueBoolArray = exports.setStorageValueBool = exports.setStorageValueNumberArray = exports.setStorageValueNumber = exports.setStorageValueStringArray = exports.setStorageValueString = exports.getStorageValueFormArray = exports.getStorageValueForm = exports.getStorageValueBoolArray = exports.getStorageValueBool = exports.getStorageValueNumberArray = exports.getStorageValueNumber = exports.getStorageValueStringArray = exports.getStorageValueString = exports.getStorageValue = exports._getStorageValue = void 0;

const papyrusArgs_1 = require("../../utils/papyrusArgs");

const functions_1 = require("../multiplayer/functions");

const _getStorageValue = (mp, self, args) => {
  const refId = mp.getIdFromDesc(self.desc);
  const key = papyrusArgs_1.getString(args, 0);
  functions_1.checkAndCreatePropertyExist(mp, refId, key);
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
  const ref = papyrusArgs_1.getObject(args, 0);
  const key = papyrusArgs_1.getString(args, 1);
  return exports._getStorageValue(mp, ref, [key]);
};

exports.getStorageValue = getStorageValue;

const getStorageValueString = (mp, self, args) => {
  const val = exports.getStorageValue(mp, self, args);
  return val === null || val === undefined ? '' : papyrusArgs_1.getString([val], 0);
};

exports.getStorageValueString = getStorageValueString;

const getStorageValueStringArray = (mp, self, args) => {
  const val = exports.getStorageValue(mp, self, args);
  return val === null || val === undefined ? [] : papyrusArgs_1.getStringArray([val], 0);
};

exports.getStorageValueStringArray = getStorageValueStringArray;

const getStorageValueNumber = (mp, self, args) => {
  const val = exports.getStorageValue(mp, self, args);
  return val === null || val === undefined ? 0 : papyrusArgs_1.getNumber([val], 0);
};

exports.getStorageValueNumber = getStorageValueNumber;

const getStorageValueNumberArray = (mp, self, args) => {
  const val = exports.getStorageValue(mp, self, args);
  return val === null || val === undefined ? [] : papyrusArgs_1.getNumberArray([val], 0);
};

exports.getStorageValueNumberArray = getStorageValueNumberArray;

const getStorageValueBool = (mp, self, args) => {
  const val = exports.getStorageValue(mp, self, args);
  return val === null || val === undefined ? null : papyrusArgs_1.getBoolean([val], 0);
};

exports.getStorageValueBool = getStorageValueBool;

const getStorageValueBoolArray = (mp, self, args) => {
  const val = exports.getStorageValue(mp, self, args);
  return val === null || val === undefined ? [] : papyrusArgs_1.getBooleanArray([val], 0);
};

exports.getStorageValueBoolArray = getStorageValueBoolArray;

const getStorageValueForm = (mp, self, args) => {
  const val = exports.getStorageValue(mp, self, args);
  return val === null || val === undefined ? null : papyrusArgs_1.getObject([val], 0);
};

exports.getStorageValueForm = getStorageValueForm;

const getStorageValueFormArray = (mp, self, args) => {
  const val = exports.getStorageValue(mp, self, args);
  return val === null || val === undefined ? [] : papyrusArgs_1.getObjectArray([val], 0);
};

exports.getStorageValueFormArray = getStorageValueFormArray;

const setStorageValueString = (mp, self, args) => exports.setStorageValue(mp, args, papyrusArgs_1.getString(args, 2));

exports.setStorageValueString = setStorageValueString;

const setStorageValueStringArray = (mp, self, args) => exports.setStorageValue(mp, args, papyrusArgs_1.getStringArray(args, 2));

exports.setStorageValueStringArray = setStorageValueStringArray;

const setStorageValueNumber = (mp, self, args) => exports.setStorageValue(mp, args, papyrusArgs_1.getNumber(args, 2));

exports.setStorageValueNumber = setStorageValueNumber;

const setStorageValueNumberArray = (mp, self, args) => exports.setStorageValue(mp, args, papyrusArgs_1.getNumberArray(args, 2));

exports.setStorageValueNumberArray = setStorageValueNumberArray;

const setStorageValueBool = (mp, self, args) => exports.setStorageValue(mp, args, papyrusArgs_1.getBoolean(args, 2));

exports.setStorageValueBool = setStorageValueBool;

const setStorageValueBoolArray = (mp, self, args) => exports.setStorageValue(mp, args, papyrusArgs_1.getBooleanArray(args, 2));

exports.setStorageValueBoolArray = setStorageValueBoolArray;

const setStorageValueForm = (mp, self, args) => exports.setStorageValue(mp, args, papyrusArgs_1.getObject(args, 2));

exports.setStorageValueForm = setStorageValueForm;

const setStorageValueFormArray = (mp, self, args) => exports.setStorageValue(mp, args, papyrusArgs_1.getObjectArray(args, 2));

exports.setStorageValueFormArray = setStorageValueFormArray;

const _setStorageValue = (mp, self, args) => {
  const refId = mp.getIdFromDesc(self.desc);
  const key = papyrusArgs_1.getString(args, 0);
  const value = args[1];
  functions_1.checkAndCreatePropertyExist(mp, refId, key);

  try {
    mp.set(refId, key, value);
  } catch (err) {
    console.log(err);
  }
};

exports._setStorageValue = _setStorageValue;

const setStorageValue = (mp, args, value) => {
  const ref = papyrusArgs_1.getObject(args, 0);
  const refId = mp.getIdFromDesc(ref.desc);
  const key = papyrusArgs_1.getString(args, 1);
  functions_1.checkAndCreatePropertyExist(mp, refId, key);

  try {
    mp.set(refId, key, value);
  } catch (err) {
    console.log(err);
  }
};

exports.setStorageValue = setStorageValue;

const register = mp => {
  mp.registerPapyrusFunction('global', 'ObjectReferenceEx', 'GetStorageValueString', (self, args) => exports.getStorageValueString(mp, self, args));
  mp.registerPapyrusFunction('global', 'ObjectReferenceEx', 'GetStorageValueStringArray', (self, args) => exports.getStorageValueStringArray(mp, self, args));
  mp.registerPapyrusFunction('global', 'ObjectReferenceEx', 'GetStorageValueInt', (self, args) => exports.getStorageValueNumber(mp, self, args));
  mp.registerPapyrusFunction('global', 'ObjectReferenceEx', 'GetStorageValueIntArray', (self, args) => exports.getStorageValueNumberArray(mp, self, args));
  mp.registerPapyrusFunction('global', 'ObjectReferenceEx', 'GetStorageValueFloat', (self, args) => exports.getStorageValueNumber(mp, self, args));
  mp.registerPapyrusFunction('global', 'ObjectReferenceEx', 'GetStorageValueFloatArray', (self, args) => exports.getStorageValueNumberArray(mp, self, args));
  mp.registerPapyrusFunction('global', 'ObjectReferenceEx', 'GetStorageValueBool', (self, args) => exports.getStorageValueBool(mp, self, args));
  mp.registerPapyrusFunction('global', 'ObjectReferenceEx', 'GetStorageValueBoolArray', (self, args) => exports.getStorageValueBoolArray(mp, self, args));
  mp.registerPapyrusFunction('global', 'ObjectReferenceEx', 'GetStorageValueForm', (self, args) => exports.getStorageValueForm(mp, self, args));
  mp.registerPapyrusFunction('global', 'ObjectReferenceEx', 'GetStorageValueFormArray', (self, args) => exports.getStorageValueFormArray(mp, self, args));
  mp.registerPapyrusFunction('global', 'ObjectReferenceEx', 'SetStorageValueString', (self, args) => exports.setStorageValueString(mp, self, args));
  mp.registerPapyrusFunction('global', 'ObjectReferenceEx', 'SetStorageValueStringArray', (self, args) => exports.setStorageValueStringArray(mp, self, args));
  mp.registerPapyrusFunction('global', 'ObjectReferenceEx', 'SetStorageValueInt', (self, args) => exports.setStorageValueNumber(mp, self, args));
  mp.registerPapyrusFunction('global', 'ObjectReferenceEx', 'SetStorageValueIntArray', (self, args) => exports.setStorageValueNumberArray(mp, self, args));
  mp.registerPapyrusFunction('global', 'ObjectReferenceEx', 'SetStorageValueFloat', (self, args) => exports.setStorageValueNumber(mp, self, args));
  mp.registerPapyrusFunction('global', 'ObjectReferenceEx', 'SetStorageValueFloatArray', (self, args) => exports.setStorageValueNumberArray(mp, self, args));
  mp.registerPapyrusFunction('global', 'ObjectReferenceEx', 'SetStorageValueBool', (self, args) => exports.setStorageValueBool(mp, self, args));
  mp.registerPapyrusFunction('global', 'ObjectReferenceEx', 'SetStorageValueBoolArray', (self, args) => exports.setStorageValueBoolArray(mp, self, args));
  mp.registerPapyrusFunction('global', 'ObjectReferenceEx', 'SetStorageValueForm', (self, args) => exports.setStorageValueForm(mp, self, args));
  mp.registerPapyrusFunction('global', 'ObjectReferenceEx', 'SetStorageValueFormArray', (self, args) => exports.setStorageValueFormArray(mp, self, args));
};

exports.register = register;
},{"../../utils/papyrusArgs":"oZY1","../multiplayer/functions":"zNfc"}],"FxH1":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.float32 = exports.int32 = exports.uint32 = exports.uint16 = exports.uint8 = exports.uint8arrayToStringMethod = exports.inPoly = exports.randomInRange = exports.isArrayEqual = void 0;

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
      if (!exports.isArrayEqual(item1, item2)) return false;
    } else {
      if (itemType !== Object.prototype.toString.call(item2)) return false;

      if (itemType === '[object Function]') {
        if (item1.toString() !== item2.toString()) return false;
      } else {
        if (item1 !== item2) return false;
      }
    }
  };

  if (type === '[object Array]') {
    for (var i = 0; i < valueLen; i++) {
      if (compare(arr1[i], arr2[i]) === false) return false;
    }
  } else {
    for (var key in arr1) {
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
let cacheInPoly = {};

const inPoly = (x, y, xp, yp) => {
  const index = x.toString() + y.toString() + xp.join('') + yp.join('');

  if (cacheInPoly[index]) {
    return cacheInPoly[index];
  }

  let npol = xp.length;
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

const uint8 = (buffer, offset) => new DataView(buffer).getUint8(offset);

exports.uint8 = uint8;

const uint16 = (buffer, offset) => new DataView(buffer).getUint16(offset, true);

exports.uint16 = uint16;

const uint32 = (buffer, offset) => new DataView(buffer).getUint32(offset, true);

exports.uint32 = uint32;

const int32 = (buffer, offset) => new DataView(buffer).getInt32(offset, true);

exports.int32 = int32;

const float32 = (buffer, offset) => new DataView(buffer).getFloat32(offset, true);

exports.float32 = float32;
},{}],"WIJZ":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.register = exports.getLocationId = exports.isInterior = void 0;

const papyrusArgs_1 = require("../../utils/papyrusArgs");

const helper_1 = require("../../utils/helper");

const FLG_Interior = 0x0001;
const FLG_Has_Water = 0x0002;
const FLG_Cant_Travel_From_Here = 0x0004;
const FLG_No_LOD_Water = 0x0008;
const FLG_Public_Area = 0x0020;
const FLG_Hand_Changed = 0x0040;
const FLG_Show_Sky = 0x0080;
const FLG_Use_Sky_Lighting = 0x0100;

const flagExists = (mp, self, flag) => {
  var _a, _b;

  const selfId = mp.getIdFromDesc(self.desc);
  const espmRecord = mp.lookupEspmRecordById(selfId);
  const enit = (_b = (_a = espmRecord.record) === null || _a === void 0 ? void 0 : _a.fields.find(x => x.type === 'DATA')) === null || _b === void 0 ? void 0 : _b.data;
  if (!enit) return false;
  const flags = helper_1.uint16(enit.buffer, 0);
  return !!(flags & flag);
};

const isInterior = (mp, self) => flagExists(mp, self, FLG_Interior);

exports.isInterior = isInterior;

const getLocationId = (mp, self, args) => {
  var _a, _b;

  const cell = papyrusArgs_1.getObject(args, 0);
  const espmRecord = mp.lookupEspmRecordById(mp.getIdFromDesc(cell.desc));
  const xlcn = (_b = (_a = espmRecord.record) === null || _a === void 0 ? void 0 : _a.fields.find(x => x.type === 'XLCN')) === null || _b === void 0 ? void 0 : _b.data;

  if (xlcn) {
    const dataView = new DataView(xlcn.buffer);
    return dataView.getUint32(0, true);
  }
};

exports.getLocationId = getLocationId;

const register = mp => {
  mp.registerPapyrusFunction('method', 'Cell', 'IsInterior', self => exports.isInterior(mp, self));
  mp.registerPapyrusFunction('global', 'CellEx', 'GetLocationId', (self, args) => exports.getLocationId(mp, self, args));
};

exports.register = register;
},{"../../utils/papyrusArgs":"oZY1","../../utils/helper":"FxH1"}],"YRYD":[function(require,module,exports) {
"use strict";

var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  Object.defineProperty(o, k2, {
    enumerable: true,
    get: function () {
      return m[k];
    }
  });
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

var __setModuleDefault = this && this.__setModuleDefault || (Object.create ? function (o, v) {
  Object.defineProperty(o, "default", {
    enumerable: true,
    value: v
  });
} : function (o, v) {
  o["default"] = v;
});

var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);

  __setModuleDefault(result, mod);

  return result;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.register = exports.addItem = exports.getRespawnTime = exports.getRespawnTimeById = exports.setOpen = exports.getLocationRef = exports.isInInterior = exports.getParentCell = exports.getWorldSpace = exports.getDisplayName = exports.placeAtMe = exports.placeObjectOnStatic = exports.getBaseObjectIdById = exports.getBaseObjectId = void 0;

const papyrusArgs_1 = require("../../utils/papyrusArgs");

const game_1 = require("../game");

const position_1 = require("./position");

const eval_1 = require("../../properties/eval");

const functionInfo_1 = require("../../utils/functionInfo");

const storage = __importStar(require("./storage"));

const position = __importStar(require("./position"));

const game = __importStar(require("../game"));

const cell_1 = require("../cell");

const helper_1 = require("../../utils/helper");

const events_1 = require("../../events");

const __1 = require("../../..");

const setScale = (mp, self, args) => {
  const scale = papyrusArgs_1.getNumber(args, 0);
  const selfId = mp.getIdFromDesc(self.desc);
};

const removeAllItems = (mp, self, args) => {
  const selfId = mp.getIdFromDesc(self.desc);
  const transferTo = args[0] ? papyrusArgs_1.getObject(args, 0) : null;
  const keepOwnership = args[1] ? papyrusArgs_1.getBoolean(args, 1) : false;
  const removeQuestItems = args[2] ? papyrusArgs_1.getBoolean(args, 2) : false;
  const emptyInv = {
    entries: []
  };
  mp.set(selfId, 'inventory', emptyInv);
};

const getCurrentDestructionStage = (mp, self) => {
  var _a;

  const selfId = mp.getIdFromDesc(self.desc);
  return (_a = mp.get(selfId, 'currentDestructionStage')) !== null && _a !== void 0 ? _a : -1;
};

const _setCurrentDestructionStage = (mp, self, args) => {
  const selfId = mp.getIdFromDesc(self.desc);
  const stage = papyrusArgs_1.getNumber(args, 0);
  mp.set(selfId, 'currentDestructionStage', stage);
};

const setCurrentDestructionStage = (mp, self, args) => {
  const ref = papyrusArgs_1.getObject(args, 0);
  const stage = papyrusArgs_1.getNumber(args, 1);

  _setCurrentDestructionStage(mp, ref, [stage]);
};

const damageObject = (mp, self, args) => {
  const selfId = mp.getIdFromDesc(self.desc);
  const damage = papyrusArgs_1.getNumber(args, 0);

  const func = (ctx, selfId, damage) => {
    ctx.sp.once('update', () => {
      const form = ctx.sp.Game.getFormEx(selfId);
      if (!form) return;
      const ref = ctx.sp.ObjectReference.from(form);
      if (!ref) return;
      ref.damageObject(damage);
    });
  };

  eval_1.evalClient(mp, 0xff000000, new functionInfo_1.FunctionInfo(func).getText({
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

  eval_1.evalClient(mp, 0xff000000, new functionInfo_1.FunctionInfo(func).getText({
    selfId
  }), true);
};

const getContainerForms = (mp, self) => {
  const selfId = mp.getIdFromDesc(self.desc);
  return mp.get(selfId, 'inventory').entries.map(item => {
    return game_1.getForm(mp, null, [item.baseId]);
  }).filter(item => item);
};

const blockActivation = (mp, self, args) => {
  const selfId = mp.getIdFromDesc(self.desc);
  const state = papyrusArgs_1.getBoolean(args, 0);
  mp.set(selfId, 'blockActivationState', state);
};

const moveTo = (mp, self, args) => {
  const selfId = mp.getIdFromDesc(self.desc);
  const target = papyrusArgs_1.getObject(args, 0);
  const targetId = mp.getIdFromDesc(target.desc);
  const xoffset = papyrusArgs_1.getNumber(args, 1);
  const yoffset = papyrusArgs_1.getNumber(args, 2);
  const zoffset = papyrusArgs_1.getNumber(args, 3);
  const matchRotation = papyrusArgs_1.getBoolean(args, 4);
  const [x, y, z] = position_1.getPosition(mp, target);
  const w = mp.get(targetId, 'worldOrCellDesc');
  console.log(selfId, [x + xoffset, y + yoffset, z + zoffset]);
  mp.set(selfId, 'pos', [x + xoffset, y + yoffset, z + zoffset]);
  mp.set(selfId, 'worldOrCellDesc', w);

  if (matchRotation) {
    mp.set(selfId, 'angle', position_1.getAngle(mp, target));
  }
};

const _getBaseObject = (mp, selfId) => {
  var _a, _b;

  if (selfId >= 0xff000000) {
    selfId = mp.getIdFromDesc(mp.get(selfId, 'baseDesc'));
    return game_1.getForm(mp, null, [selfId]);
  }

  const espmRecord = mp.lookupEspmRecordById(selfId);
  const name = (_b = (_a = espmRecord.record) === null || _a === void 0 ? void 0 : _a.fields.find(x => x.type === 'NAME')) === null || _b === void 0 ? void 0 : _b.data;

  if (name) {
    const dataView = new DataView(name.buffer);
    return game_1.getForm(mp, null, [dataView.getUint32(0, true)]);
  }

  return;
};

const getBaseObject = (mp, self) => {
  const selfId = mp.getIdFromDesc(self.desc);
  return _getBaseObject(mp, selfId);
};

const getBaseObjectId = (mp, self, args) => {
  const selfId = mp.getIdFromDesc(papyrusArgs_1.getObject(args, 0).desc);

  const base = _getBaseObject(mp, selfId);

  if (base) {
    return mp.getIdFromDesc(base.desc);
  }

  return;
};

exports.getBaseObjectId = getBaseObjectId;

const getBaseObjectIdById = (mp, self, args) => {
  const selfId = papyrusArgs_1.getNumber(args, 0);

  const base = _getBaseObject(mp, selfId);

  if (base) {
    return mp.getIdFromDesc(base.desc);
  }

  return;
};

exports.getBaseObjectIdById = getBaseObjectIdById;

const placeObjectOnStatic = (mp, self, args) => {
  const placeId = papyrusArgs_1.getNumber(args, 0);
  const whatSpawnId = papyrusArgs_1.getNumber(args, 1);
  const sRefId = mp.place(whatSpawnId);
  const sRef = game_1.getForm(mp, null, [sRefId]);
  if (!sRef) return null;
  const targetPoint = {
    pos: position_1.getEspPosition(mp, placeId),
    angle: [0, 0, 0],
    worldOrCellDesc: mp.get(placeId, 'worldOrCellDesc')
  };

  for (const key of Object.keys(targetPoint)) {
    const propName = key;
    mp.set(sRefId, propName, targetPoint[propName]);
  }

  events_1.throwOrInit(mp, sRefId);
  return sRef;
};

exports.placeObjectOnStatic = placeObjectOnStatic;

const _placeAtMe = (mp, self, args) => {
  var _a;

  const selfId = mp.getIdFromDesc(self.desc);
  const whatSpawnId = papyrusArgs_1.getNumber(args, 0);
  const count = papyrusArgs_1.getNumber(args, 1);
  let sRefResult = [];

  for (let i = 0; i < count; i++) {
    const sRefId = mp.place(whatSpawnId);
    const sRef = game_1.getForm(mp, null, [sRefId]);
    if (!sRef) return null;
    sRefResult.push(sRef);
    const targetPoint = {
      pos: (_a = mp.get(selfId, 'pos')) !== null && _a !== void 0 ? _a : [0, 0, 0],
      angle: [0, 0, 0],
      worldOrCellDesc: mp.get(selfId, 'worldOrCellDesc')
    };

    for (const key of Object.keys(targetPoint)) {
      const propName = key;
      mp.set(sRefId, propName, targetPoint[propName]);
    }

    events_1.throwOrInit(mp, sRefId);
  }

  if (sRefResult.length === 0) return null;
  return sRefResult[sRefResult.length - 1];
};

const placeAtMe = (mp, selfNull, args) => {
  const self = papyrusArgs_1.getObject(args, 0);
  const targetId = papyrusArgs_1.getNumber(args, 1);
  const count = papyrusArgs_1.getNumber(args, 2);
  return _placeAtMe(mp, self, [targetId, count]);
};

exports.placeAtMe = placeAtMe;

const getLinkedReferenceId = (mp, self, args) => {
  var _a, _b;

  const base = mp.getIdFromDesc(papyrusArgs_1.getObject(args, 0).desc);
  const espmRecord = mp.lookupEspmRecordById(base);
  const links = (_b = (_a = espmRecord.record) === null || _a === void 0 ? void 0 : _a.fields.find(x => x.type === 'XLKR')) === null || _b === void 0 ? void 0 : _b.data;
  if (!links) return [];
  const dataView = new DataView(links.buffer);
  let keywordsId = [];

  for (let i = 4; i + 4 <= links.length; i += 8) {
    keywordsId.push(dataView.getUint32(i, true));
  }

  return keywordsId;
};

const getLinkedReferenceIdByKeywordId = (mp, self, args) => {
  var _a, _b;

  const base = mp.getIdFromDesc(papyrusArgs_1.getObject(args, 0).desc);
  const keywordId = papyrusArgs_1.getNumber(args, 1);
  const espmRecord = mp.lookupEspmRecordById(base);
  const links = (_b = (_a = espmRecord.record) === null || _a === void 0 ? void 0 : _a.fields.find(x => x.type === 'XLKR')) === null || _b === void 0 ? void 0 : _b.data;

  if (links) {
    const dataView = new DataView(links.buffer);

    for (let i = 0; i + 4 <= dataView.byteLength; i += 8) {
      if (dataView.getUint32(i, true) == keywordId) {
        return dataView.getUint32(i + 4, true);
      }
    }
  }

  return;
};

const getDisplayName = (mp, self) => {
  var _a, _b, _c, _d, _e, _f;

  const selfId = mp.getIdFromDesc(self.desc);
  const appearance = mp.get(selfId, 'appearance');

  if (selfId >= 0xff000000) {
    const f = game_1.getForm(mp, null, [mp.getIdFromDesc(mp.get(selfId, 'baseDesc'))]);
    const n = f && mp.callPapyrusFunction('global', 'FormEx', 'GetName', null, [f]);
    return (_b = (_a = mp.get(selfId, 'displayName')) !== null && _a !== void 0 ? _a : appearance === null || appearance === void 0 ? void 0 : appearance.name) !== null && _b !== void 0 ? _b : n;
  }

  const espmRecord = mp.lookupEspmRecordById(selfId);
  const name = (_d = (_c = espmRecord.record) === null || _c === void 0 ? void 0 : _c.fields.find(x => x.type === 'NAME')) === null || _d === void 0 ? void 0 : _d.data;
  if (!name) return '';
  const baseId = helper_1.uint32(name.buffer, 0);
  const f = game_1.getForm(mp, null, [baseId]);
  const n = f && mp.callPapyrusFunction('global', 'FormEx', 'GetName', null, [f]);
  return (_f = (_e = mp.get(selfId, 'displayName')) !== null && _e !== void 0 ? _e : appearance === null || appearance === void 0 ? void 0 : appearance.name) !== null && _f !== void 0 ? _f : n;
};

exports.getDisplayName = getDisplayName;

const setDisplayName = (mp, self, args) => {
  const selfId = mp.getIdFromDesc(self.desc);
  const name = papyrusArgs_1.getString(args, 0);
  const force = papyrusArgs_1.getBoolean(args, 1);
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
  const cell = exports.getParentCell(mp, self);
  if (!cell) return false;
  return cell_1.isInterior(mp, cell);
};

exports.isInInterior = isInInterior;

const getLocationRef = (mp, self, args) => {
  var _a, _b;

  const espmRecord = mp.lookupEspmRecordById(papyrusArgs_1.getNumber(args, 0));
  const locationRef = (_b = (_a = espmRecord.record) === null || _a === void 0 ? void 0 : _a.fields.find(x => x.type === 'XLRT')) === null || _b === void 0 ? void 0 : _b.data;
  if (!locationRef) return;
  const dataView = new DataView(locationRef.buffer);
  const locationRefId = dataView.getUint32(0, true);
  return locationRefId;
};

exports.getLocationRef = getLocationRef;

const setOpen = (mp, self, args) => {
  const selfId = mp.getIdFromDesc(self.desc);
  const openState = papyrusArgs_1.getBoolean(args, 0);
  console.log(selfId, openState);
  mp.set(selfId, 'openState', openState);
};

exports.setOpen = setOpen;

const getRespawnTimeById = (mp, selfNull, args) => {
  var _a, _b, _c, _d;

  const selfId = papyrusArgs_1.getNumber(args, 0);
  const baseId = exports.getBaseObjectIdById(mp, null, [selfId]);

  const spawnTimeById = __1.serverOptionProvider.getServerOptionsValue(['spawnTimeById']);

  const timeById = Array.isArray(spawnTimeById) ? spawnTimeById.map(x => {
    if (!x || typeof x !== 'string') return;
    const xParse = x.split(':');
    if (xParse.length != 2) return;
    return {
      id: +xParse[0],
      time: +xParse[1]
    };
  }).filter(x => x) : [];
  const refTime = (_a = timeById.find(x => x.id === selfId)) === null || _a === void 0 ? void 0 : _a.time;
  const baseTime = (_b = timeById.find(x => x.id === baseId)) === null || _b === void 0 ? void 0 : _b.time;
  return (_d = (_c = refTime !== null && refTime !== void 0 ? refTime : baseTime) !== null && _c !== void 0 ? _c : __1.serverOptionProvider.getServerOptionsValue([baseId === 7 ? 'SpawnTimeToRespawn' : 'SpawnTimeToRespawnNPC'])) !== null && _d !== void 0 ? _d : -1;
};

exports.getRespawnTimeById = getRespawnTimeById;

const getRespawnTime = (mp, selfNull, args) => {
  const self = papyrusArgs_1.getObject(args, 0);
  const selfId = mp.getIdFromDesc(self.desc);
  return exports.getRespawnTimeById(mp, null, [selfId]);
};

exports.getRespawnTime = getRespawnTime;

const addItem = (mp, self, args) => {
  const item = papyrusArgs_1.getObject(args, 0);
  const count = papyrusArgs_1.getNumber(args, 1);
  const silent = papyrusArgs_1.getBoolean(args, 2);
  mp.callPapyrusFunction('method', 'ObjectReference', 'AddItem', self, [item, count, silent]);
};

exports.addItem = addItem;

const register = mp => {
  mp.registerPapyrusFunction('method', 'ObjectReference', 'SetScale', (self, args) => setScale(mp, self, args));
  mp.registerPapyrusFunction('method', 'ObjectReference', 'RemoveAllItems', (self, args) => removeAllItems(mp, self, args));
  mp.registerPapyrusFunction('method', 'ObjectReference', 'GetDistance', (self, args) => position_1.getDistance(mp, self, args));
  mp.registerPapyrusFunction('method', 'ObjectReference', 'MoveTo', (self, args) => moveTo(mp, self, args));
  mp.registerPapyrusFunction('method', 'ObjectReference', 'GetContainerForms', self => getContainerForms(mp, self));
  mp.registerPapyrusFunction('method', 'ObjectReference', 'GetCurrentDestructionStage', self => getCurrentDestructionStage(mp, self));
  mp.registerPapyrusFunction('method', 'ObjectReference', 'DamageObject', (self, args) => damageObject(mp, self, args));
  mp.registerPapyrusFunction('method', 'ObjectReference', 'ClearDestruction', self => clearDestruction(mp, self));
  mp.registerPapyrusFunction('global', 'ObjectReferenceEx', 'SetCurrentDestructionStage', (self, args) => setCurrentDestructionStage(mp, self, args));
  mp.registerPapyrusFunction('method', 'ObjectReference', 'BlockActivation', (self, args) => blockActivation(mp, self, args));
  mp.registerPapyrusFunction('method', 'ObjectReference', 'GetBaseObject', self => getBaseObject(mp, self));
  mp.registerPapyrusFunction('global', 'ObjectReferenceEx', 'GetBaseObjectId', (self, args) => exports.getBaseObjectId(mp, self, args));
  mp.registerPapyrusFunction('global', 'ObjectReferenceEx', 'GetLinkedReferenceId', (self, args) => getLinkedReferenceId(mp, self, args));
  mp.registerPapyrusFunction('global', 'ObjectReferenceEx', 'GetLinkedReferenceIdByKeywordId', (self, args) => getLinkedReferenceIdByKeywordId(mp, self, args));
  mp.registerPapyrusFunction('global', 'ObjectReferenceEx', 'PlaceObjectOnStatic', (self, args) => exports.placeObjectOnStatic(mp, self, args));
  mp.registerPapyrusFunction('global', 'ObjectReferenceEx', 'PlaceAtMe', (self, args) => exports.placeAtMe(mp, self, args));
  mp.registerPapyrusFunction('method', 'ObjectReference', 'GetDisplayName', self => exports.getDisplayName(mp, self));
  mp.registerPapyrusFunction('method', 'ObjectReference', 'SetDisplayName', (self, args) => setDisplayName(mp, self, args));
  mp.registerPapyrusFunction('method', 'ObjectReference', 'GetWorldSpace', self => exports.getWorldSpace(mp, self));
  mp.registerPapyrusFunction('method', 'ObjectReference', 'GetParentCell', self => exports.getParentCell(mp, self));
  mp.registerPapyrusFunction('method', 'ObjectReference', 'IsInInterior', self => exports.isInInterior(mp, self));
  mp.registerPapyrusFunction('method', 'ObjectReference', 'SetOpen', (self, args) => exports.setOpen(mp, self, args));
  mp.registerPapyrusFunction('global', 'ObjectReferenceEx', 'GetLocationRef', (self, args) => exports.getLocationRef(mp, self, args));
  mp.registerPapyrusFunction('global', 'ObjectReferenceEx', 'GetRespawnTime', (self, args) => exports.getRespawnTime(mp, self, args));
  storage.register(mp);
  position.register(mp);
};

exports.register = register;
},{"../../utils/papyrusArgs":"oZY1","../game":"WCBi","./position":"wmVe","../../properties/eval":"mJTA","../../utils/functionInfo":"fC7F","./storage":"P8j4","../cell":"WIJZ","../../utils/helper":"FxH1","../../events":"VJVi","../../..":"QCba"}],"WNwQ":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateAttributeMult = exports.updateAttributeCommon = void 0;

const functionInfo_1 = require("../../../utils/functionInfo");

const updateAttributeCommon = (attrParam, isOwner = false) => {
  return new functionInfo_1.FunctionInfo((ctx, attrParam, isOwner) => {
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

    if (av === 'health' || ac.getFormID() == 0x14) {
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
    const k = !targetPercentage || av === 'stamina' || av === 'magicka' ? 1 : 0.25;

    if (deltaPercentage > 0) {
      ac.restoreActorValue(av, deltaPercentage * currentMax * k);
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

const updateAttributeMult = attrParam => {
  return new functionInfo_1.FunctionInfo((ctx, attrParam) => {
    const av = attrParam;
    if (!ctx.refr || !ctx.get) return;
    const ac = ctx.sp.Actor.from(ctx.refr);
    if (!ac) return;
    if (!ctx.value) return;
    const base = ctx.value.base || 0;
    const perm = ctx.value.permanent || 0;
    const temp = ctx.value.temporary || 0;
    const targetMax = base + perm + temp;
    const targetDmg = ctx.value.damage || 0;
    const currentPercentage = ac.getActorValuePercentage(av);
    const currentMax = ac.getBaseActorValue(av);
    let targetPercentage = (targetMax + targetDmg) / targetMax;
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

exports.updateAttributeMult = updateAttributeMult;
},{"../../../utils/functionInfo":"fC7F"}],"Klzq":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.register = exports.actorValues = void 0;

const functions_1 = require("../../../papyrus/multiplayer/functions");

const attributes_func_1 = require("./attributes-func");

const avs = ['healrate', 'healratemult', 'staminarate', 'staminaratemult', 'magickarate', 'magickaratemult', 'mp_healthdrain', 'mp_magickadrain', 'mp_staminadrain'];
const relatedPropNames = ['healthNumChanges', 'magickaNumChanges', 'staminaNumChanges'];

const getAvMaximum = (avOps, formId, avName) => {
  let sum = 0;

  for (const modifierName of ['base', 'permanent', 'temporary']) {
    sum += avOps.get(formId, avName, modifierName);
  }

  return sum;
};

const getAvCurrent = (avOps, formId, avName) => {
  let res = getAvMaximum(avOps, formId, avName);
  res += avOps.get(formId, avName, 'damage');
  return res;
};

let regen = (avOps, avNameTarget, avNameRate, avNameRateMult, avNameDrain) => {
  return {
    parent: avOps,

    set(formId, avName, modifierName, newValue) {
      var _a;

      let dangerousAvNames = [avNameTarget, avNameRate, avNameRateMult, avNameDrain];
      dangerousAvNames = dangerousAvNames.map(x => x.toLowerCase());

      if (dangerousAvNames.indexOf(avName.toLowerCase()) !== -1 && this.applyRegenerationToParent) {
        this.applyRegenerationToParent(formId);
      }

      (_a = this.parent) === null || _a === void 0 ? void 0 : _a.set(formId, avName, modifierName, newValue);
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

const register = mp => {
  for (const attr of ['health', 'magicka', 'stamina']) {
    mp.makeProperty('av_' + attr, {
      isVisibleByOwner: true,
      isVisibleByNeighbors: attr === 'health',
      updateNeighbor: attributes_func_1.updateAttributeCommon(attr, false),
      updateOwner: attributes_func_1.updateAttributeCommon(attr, true)
    });
  }

  for (const avName of avs) {
    functions_1.statePropFactory(mp, 'av_' + avName, true);
  }

  for (const propName of relatedPropNames) {
    functions_1.statePropFactory(mp, propName, true);
  }

  ['speedmult', 'weaponspeedmult'].forEach(mult => {
    mp.makeProperty(`av_${mult}`, {
      isVisibleByOwner: true,
      isVisibleByNeighbors: true,
      updateOwner: attributes_func_1.updateAttributeMult(mult),
      updateNeighbor: attributes_func_1.updateAttributeMult(mult)
    });
  });
  let avOps = {
    set(formId, avName, modifierName, newValue) {
      var _a;

      const propName = 'av_' + avName.toLowerCase();
      let value = mp.get(formId, propName);
      if (!value) return;
      value[modifierName] = newValue;
      mp.set(formId, propName, value);

      if (['health', 'magicka', 'stamina'].indexOf(avName.toLowerCase()) !== -1) {
        const propName = `${avName.toLowerCase()}NumChanges`;
        const numChanges = (_a = mp.get(formId, propName)) !== null && _a !== void 0 ? _a : 0;
        mp.set(formId, propName, 1 + numChanges);
      }
    },

    get(formId, avName, modifierName) {
      const propName = 'av_' + avName.toLowerCase();
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

      if (modifierName == 'damage') {
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

      let oldMaximum, newMaximum;
      oldMaximum = getAvMaximum(this.parent, formId, avName);
      this.parent.set(formId, avName, modifierName, newValue);
      newMaximum = getAvMaximum(this.parent, formId, avName);
      const k = newMaximum / oldMaximum;

      if (isFinite(k) && k != 1 && this.multiplyDamage) {
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
  exports.actorValues = {
    set: (formId, avName, modifierName, newValue) => avOps.set(formId, avName, modifierName, newValue),
    get: (formId, avName, modifierName) => avOps.get(formId, avName, modifierName),
    getMaximum: (formId, avName) => getAvMaximum(avOps, formId, avName),
    getCurrent: (formId, avName) => getAvCurrent(avOps, formId, avName),
    flushRegen: (formId, avName) => {
      const damageModAfterRegen = avOps.get(formId, avName, 'damage');
      avOps.set(formId, avName, 'damage', damageModAfterRegen);
    },
    setDefaults: (formId, options, base = {}) => {
      var _a, _b, _c, _d, _e, _f;

      console.log('[sync] setDefaults', formId.toString(16), base);
      const force = !!(options === null || options === void 0 ? void 0 : options.force);

      if (mp.get(formId, 'type') === 'MpActor') {
        if (mp.get(formId, 'isDead') === undefined || force) {
          mp.set(formId, 'isDead', false);
        }

        for (const avName of ['health', 'magicka', 'stamina']) {
          if (!mp.get(formId, 'av_' + avName) || force) {
            mp.set(formId, 'av_' + avName, {
              base: (_a = base[avName]) !== null && _a !== void 0 ? _a : 100
            });
          }
        }

        for (const avName of ['healrate', 'magickarate', 'staminarate']) {
          if (!mp.get(formId, 'av_' + avName) || force) {
            mp.set(formId, 'av_' + avName, {
              base: (_b = base[avName]) !== null && _b !== void 0 ? _b : 5
            });
          }
        }

        for (const avName of ['healratemult', 'magickaratemult', 'staminaratemult']) {
          if (!mp.get(formId, 'av_' + avName) || force) {
            mp.set(formId, 'av_' + avName, {
              base: (_c = base[avName]) !== null && _c !== void 0 ? _c : 100
            });
          }
        }

        for (const avName of ['mp_healthdrain', 'mp_magickadrain', 'mp_staminadrain']) {
          if (!mp.get(formId, 'av_' + avName) || force) {
            mp.set(formId, 'av_' + avName, {
              base: (_d = base[avName]) !== null && _d !== void 0 ? _d : 0
            });
          }
        }

        if (!mp.get(formId, 'av_speedmult') || force) {
          mp.set(formId, 'av_speedmult', {
            base: (_e = base.speedmult) !== null && _e !== void 0 ? _e : 100
          });
        }

        if (!mp.get(formId, 'av_weaponspeedmult') || force) {
          mp.set(formId, 'av_weaponspeedmult', {
            base: (_f = base.weaponspeedmult) !== null && _f !== void 0 ? _f : 1
          });
        }
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
exports.onCurrentCrosshairChange = exports.onEffectStart = exports.onUiMenuToggle = exports.onCloseRaceMenu = exports.onPrintConsole = exports.onAnimationEvent = exports.onInput = exports.onEquip = exports.onHit = exports.onCellChange = void 0;

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
    var _a, _b, _c, _d, _e;

    const e = event;
    const baseId = (_b = (_a = e.agressor) === null || _a === void 0 ? void 0 : _a.getBaseObject()) === null || _b === void 0 ? void 0 : _b.getFormID();
    if (((_c = e.agressor) === null || _c === void 0 ? void 0 : _c.getFormID()) !== 0x14 && baseId === 7) return;
    const targetActor = ctx.sp.Actor.from(e.target);
    if (!!targetActor === isHitStatic) return;
    if (e.source && ctx.sp.Spell.from(e.source)) return;
    const target = ctx.getFormIdInServerFormat((_d = e.target) === null || _d === void 0 ? void 0 : _d.getFormID());
    const agressor = ctx.getFormIdInServerFormat((_e = e.agressor) === null || _e === void 0 ? void 0 : _e.getFormID());
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
    var _a, _b;

    const e = event;
    const target = ctx.getFormIdInServerFormat((_a = e.baseObj) === null || _a === void 0 ? void 0 : _a.getFormID());
    const actor = ctx.getFormIdInServerFormat(e.actor.getFormID());
    const data = {
      actor,
      target,
      player: (_b = ctx.sp.Game.getPlayer()) === null || _b === void 0 ? void 0 : _b.getFormID()
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
      const [serversideFormId, animEventName] = args;
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
    var _a, _b, _c, _d, _e;

    if (((_a = event.caster) === null || _a === void 0 ? void 0 : _a.getFormID()) !== 0x14) return;
    const target = ctx.getFormIdInServerFormat((_b = event.target) === null || _b === void 0 ? void 0 : _b.getFormID());
    const caster = ctx.getFormIdInServerFormat((_c = event.caster) === null || _c === void 0 ? void 0 : _c.getFormID());
    ctx.sendEvent({
      caster,
      target,
      effect: (_d = event.effect) === null || _d === void 0 ? void 0 : _d.getFormID(),
      mag: (_e = event.activeEffect) === null || _e === void 0 ? void 0 : _e.getMagnitude()
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
},{}],"A7KX":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.showNick = exports.showNicknames = exports.sendPlayerPos = void 0;

const game_1 = require("../papyrus/game");

const objectReference_1 = require("../papyrus/objectReference");

const eval_1 = require("../properties/eval");

const functionInfo_1 = require("../utils/functionInfo");

const sendPlayerPos = ctx => {
  ctx.sp.on('update', () => {
    const player = ctx.sp.Game.getPlayer();
    if (!player) return;
    const [x, y, z] = [player.getPositionX(), player.getPositionY(), player.getPositionZ()];
    const [xF, yF, zF] = [x.toFixed(), y.toFixed(), z.toFixed()];
    if (xF === ctx.state.lastPosX && yF === ctx.state.lastPosY && zF === ctx.state.lastPosZ) return;
    let src = [];
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
    let src = [];
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
    const nForm = game_1.getForm(mp, null, [n]);
    const text = nForm && objectReference_1.getDisplayName(mp, nForm);
    return {
      pos,
      text
    };
  });
  eval_1.evalClient(mp, playerId, new functionInfo_1.FunctionInfo(func2).getText({
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

const _1 = require(".");

const __1 = require("../..");

const functionInfo_1 = require("../utils/functionInfo");

const empty_functions_1 = require("./empty-functions");

const register = mp => {
  mp.makeEventSource('_empty01', new functionInfo_1.FunctionInfo(empty_functions_1.sendPlayerPos).body);

  if (mp.timer) {
    clearTimeout(mp.timer);
  }

  const serverOptions = __1.serverOptionProvider.getServerOptions();

  if (serverOptions.enableInterval) {
    const interval = () => {
      mp.timer = setTimeout(() => {
        mp.get(0, 'onlinePlayers').forEach(id => {
          const neighbors = mp.get(id, 'neighbors').filter(n => mp.get(n, 'type') === 'MpActor');
          neighbors.forEach(n => {
            if (!mp.get(n, 'spawnTimeToRespawn')) return;

            _1.throwOrInit(mp, n, serverOptions);
          });
        });
        interval();
      }, 200);
    };

    interval();
  }
};

exports.register = register;
},{".":"VJVi","../..":"QCba","../utils/functionInfo":"fC7F","./empty-functions":"A7KX"}],"dvBS":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.register = exports.getFlags = void 0;

const papyrusArgs_1 = require("../utils/papyrusArgs");

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
  var _a, _b;

  const id = papyrusArgs_1.getNumber(args, 0);
  const espmRecord = mp.lookupEspmRecordById(id);
  const d = (_b = (_a = espmRecord.record) === null || _a === void 0 ? void 0 : _a.fields.find(x => x.type === 'DATA')) === null || _b === void 0 ? void 0 : _b.data;
  const flgs = [];

  if (d) {
    const dv = new DataView(d.buffer);
    let fl = dv.getUint32(0, true);

    for (const k of Object.keys(MGEF_FLGS).reverse()) {
      if (fl - MGEF_FLGS[k] >= 0) {
        flgs.push(MGEF_FLGS[k]);
        fl = fl - MGEF_FLGS[k];
      }
    }
  }

  return flgs;
};

exports.getFlags = getFlags;

const register = mp => {};

exports.register = register;
},{"../utils/papyrusArgs":"oZY1"}],"icKT":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.equipSlotMap = void 0;
exports.equipSlotMap = {
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
},{}],"WNhg":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.register = exports.getSlot = exports.getSlotById = exports.getArmorRating = exports.getBaseArmorById = void 0;

const helper_1 = require("../../utils/helper");

const types_1 = require("./types");

const getBaseArmorById = (mp, selfId, espmRecord) => {
  var _a, _b;

  if (!espmRecord) espmRecord = mp.lookupEspmRecordById(selfId);
  const dnam = (_b = (_a = espmRecord.record) === null || _a === void 0 ? void 0 : _a.fields.find(x => x.type === 'DNAM')) === null || _b === void 0 ? void 0 : _b.data;
  if (!dnam) return 0;
  return helper_1.uint32(dnam.buffer, 0) / 100;
};

exports.getBaseArmorById = getBaseArmorById;

const getArmorRating = (mp, self) => {
  const selfId = mp.getIdFromDesc(self.desc);
  return exports.getBaseArmorById(mp, selfId);
};

exports.getArmorRating = getArmorRating;

const getSlotById = (mp, selfId, espmRecord) => {
  var _a, _b;

  if (!espmRecord) espmRecord = mp.lookupEspmRecordById(selfId);
  const b2 = (_b = (_a = espmRecord.record) === null || _a === void 0 ? void 0 : _a.fields.find(x => x.type === 'BOD2')) === null || _b === void 0 ? void 0 : _b.data;
  if (!b2) return [];
  const slot = helper_1.uint32(b2.buffer, 0);
  if (!slot) return [];
  return Object.keys(types_1.equipSlotMap).filter(k => slot & +k).map(k => types_1.equipSlotMap[+k]);
};

exports.getSlotById = getSlotById;

const getSlot = (mp, self) => {
  const selfId = mp.getIdFromDesc(self.desc);
  return exports.getSlotById(mp, selfId);
};

exports.getSlot = getSlot;

const register = mp => {
  mp.registerPapyrusFunction('method', 'Armor', 'GetArmorRating', self => exports.getArmorRating(mp, self));
  mp.registerPapyrusFunction('method', 'Armor', 'GetAR', self => exports.getArmorRating(mp, self));
  mp.registerPapyrusFunction('method', 'Armor', 'GetSlot', self => exports.getSlot(mp, self));
};

exports.register = register;
},{"../../utils/helper":"FxH1","./types":"icKT"}],"D1sz":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hasKeywordEx = exports.hasKeyword = exports.getNthKeyword = exports.getNumKeywords = exports.getKeywords = void 0;

const _1 = require(".");

const papyrusArgs_1 = require("../../utils/papyrusArgs");

const game_1 = require("../game");

const getKeywords = (mp, self) => {
  var _a, _b;

  const selfId = _1.getSelfId(mp, self.desc);

  const data = mp.lookupEspmRecordById(selfId);
  const kwda = (_b = (_a = data.record) === null || _a === void 0 ? void 0 : _a.fields.find(x => x.type === 'KWDA')) === null || _b === void 0 ? void 0 : _b.data;
  const keywords = [];

  if (kwda) {
    const dataView = new DataView(kwda.buffer);

    for (let i = 0; i < dataView.byteLength; i += 4) {
      keywords.push({
        desc: mp.getDescFromId(dataView.getUint32(i, true)),
        type: 'espm'
      });
    }
  }

  return keywords;
};

exports.getKeywords = getKeywords;

const getNumKeywords = (mp, self) => {
  var _a, _b;

  const selfId = _1.getSelfId(mp, self.desc);

  const data = mp.lookupEspmRecordById(selfId);
  const ksiz = (_b = (_a = data.record) === null || _a === void 0 ? void 0 : _a.fields.find(x => x.type === 'KSIZ')) === null || _b === void 0 ? void 0 : _b.data;

  if (ksiz) {
    const dataView = new DataView(ksiz.buffer);
    return dataView.getUint32(0, true);
  }

  return;
};

exports.getNumKeywords = getNumKeywords;

const getNthKeyword = (mp, self, args) => {
  var _a, _b;

  const selfId = _1.getSelfId(mp, self.desc);

  const data = mp.lookupEspmRecordById(selfId);
  const index = papyrusArgs_1.getNumber(args, 0) - 1;
  const kwda = (_b = (_a = data.record) === null || _a === void 0 ? void 0 : _a.fields.find(x => x.type === 'KWDA')) === null || _b === void 0 ? void 0 : _b.data;

  if (kwda) {
    let dataView = new DataView(kwda.buffer);
    return {
      desc: mp.getDescFromId(dataView.getUint32(index * 4, true)),
      type: 'espm'
    };
  }

  return;
};

exports.getNthKeyword = getNthKeyword;

const hasKeyword = (mp, self, args) => {
  var _a, _b;

  const selfId = _1.getSelfId(mp, self.desc);

  const keyword = papyrusArgs_1.getObject(args, 0);
  const keywordId = mp.getIdFromDesc(keyword.desc);
  const espmRecord = mp.lookupEspmRecordById(selfId);
  const kwda = (_b = (_a = espmRecord.record) === null || _a === void 0 ? void 0 : _a.fields.find(x => x.type === 'KWDA')) === null || _b === void 0 ? void 0 : _b.data;

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
  const form = game_1.getForm(mp, null, [papyrusArgs_1.getNumber(args, 0)]);
  const keyword = game_1.getForm(mp, null, [papyrusArgs_1.getNumber(args, 1)]);
  if (!form || !keyword) return false;
  return exports.hasKeyword(mp, form, [keyword]);
};

exports.hasKeywordEx = hasKeywordEx;
},{".":"mnzc","../../utils/papyrusArgs":"oZY1","../game":"WCBi"}],"CIMu":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formType = exports.FormType = void 0;
var FormType;

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
})(FormType = exports.FormType || (exports.FormType = {}));

exports.formType = {
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
},{}],"mnzc":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.register = exports.getWeightById = exports.getWeight = exports.getEditorIdById = exports.getEditorId = exports._getEditorId = exports.getDescription = exports.getName = exports.getSelfId = void 0;

const helper_1 = require("../../utils/helper");

const papyrusArgs_1 = require("../../utils/papyrusArgs");

const keywords_1 = require("./keywords");

const type_1 = require("./type");

const getSelfId = (mp, desc) => {
  let selfId = mp.getIdFromDesc(desc);

  if (selfId >= 0xff000000) {
    return mp.getIdFromDesc(mp.get(selfId, 'baseDesc'));
  }

  return selfId;
};

exports.getSelfId = getSelfId;

const getFormID = (mp, self) => {
  return mp.getIdFromDesc(self.desc);
};

const getName = (strings, mp, self) => {
  var _a, _b, _c, _d, _e;

  const selfId = exports.getSelfId(mp, self.desc);
  const espmRecord = mp.lookupEspmRecordById(selfId);
  const full = (_b = (_a = espmRecord.record) === null || _a === void 0 ? void 0 : _a.fields.find(x => x.type === 'FULL')) === null || _b === void 0 ? void 0 : _b.data;
  const tplt = (_d = (_c = espmRecord.record) === null || _c === void 0 ? void 0 : _c.fields.find(x => x.type === 'TPLT')) === null || _d === void 0 ? void 0 : _d.data;
  if (!full && !tplt) return 'NOT_FOUND';
  if (!full && tplt) return exports.getName(strings, mp, {
    type: 'form',
    desc: mp.getDescFromId(helper_1.uint32(tplt.buffer, 0))
  });
  if (full && full.length > 4) return new TextDecoder().decode(full);

  if (full && self.desc) {
    const espName = self.desc.split(':')[1].split('.')[0].toLowerCase();
    const index = helper_1.uint32(full.buffer, 0);
    return (_e = strings.getText(espName, index)) !== null && _e !== void 0 ? _e : '';
  }

  return 'NOT_FOUND';
};

exports.getName = getName;

const getNameEx = (strings, mp, selfNull, args) => {
  const self = papyrusArgs_1.getObject(args, 0);
  return exports.getName(strings, mp, self);
};

const getDescription = (strings, mp, selfNull, args) => {
  var _a, _b, _c;

  const self = papyrusArgs_1.getObject(args, 0);
  const selfId = exports.getSelfId(mp, self.desc);
  const espName = self.desc.split(':')[1].split('.')[0].toLowerCase();
  const espmRecord = mp.lookupEspmRecordById(selfId);
  const desc = (_b = (_a = espmRecord.record) === null || _a === void 0 ? void 0 : _a.fields.find(x => x.type === 'DESC')) === null || _b === void 0 ? void 0 : _b.data;

  if (desc) {
    const dataView = new DataView(desc.buffer);
    const index = dataView.getUint32(0, true);

    if (desc.length > 4) {
      return new TextDecoder().decode(desc);
    } else {
      return (_c = strings.getText(espName, index)) !== null && _c !== void 0 ? _c : '';
    }
  }

  return '';
};

exports.getDescription = getDescription;

const _getEditorId = (mp, selfId) => {
  var _a, _b, _c, _d;

  const espmRecord = mp.lookupEspmRecordById(selfId);
  const name = (_b = (_a = espmRecord.record) === null || _a === void 0 ? void 0 : _a.fields.find(x => x.type === 'NAME')) === null || _b === void 0 ? void 0 : _b.data;
  if (!name) return '';
  const dataView = new DataView(name.buffer);
  const baseId = dataView.getUint32(0, true);
  const espmRecordBase = mp.lookupEspmRecordById(baseId);
  const edid = (_d = (_c = espmRecordBase.record) === null || _c === void 0 ? void 0 : _c.fields.find(x => x.type === 'EDID')) === null || _d === void 0 ? void 0 : _d.data;
  if (!edid) return '';
  return helper_1.uint8arrayToStringMethod(edid);
};

exports._getEditorId = _getEditorId;

const getEditorId = (mp, self, args) => {
  return exports._getEditorId(mp, exports.getSelfId(mp, papyrusArgs_1.getObject(args, 0).desc));
};

exports.getEditorId = getEditorId;

const getEditorIdById = (mp, self, args) => {
  return exports._getEditorId(mp, papyrusArgs_1.getNumber(args, 0));
};

exports.getEditorIdById = getEditorIdById;

const getGoldValue = (mp, self) => {
  var _a, _b;

  const selfId = exports.getSelfId(mp, self.desc);
  const recordData = mp.lookupEspmRecordById(selfId);
  const data = (_b = (_a = recordData.record) === null || _a === void 0 ? void 0 : _a.fields.find(x => x.type === 'DATA')) === null || _b === void 0 ? void 0 : _b.data;
  if (!data) return -1;
  const dataView = new DataView(data.buffer);
  return dataView.getUint32(0, true);
};

const getWeight = (mp, self) => {
  const selfId = exports.getSelfId(mp, self.desc);
  return exports.getWeightById(mp, selfId);
};

exports.getWeight = getWeight;

const getWeightById = (mp, selfId) => {
  var _a, _b;

  const recordData = mp.lookupEspmRecordById(selfId);
  const data = (_b = (_a = recordData.record) === null || _a === void 0 ? void 0 : _a.fields.find(x => x.type === 'DATA')) === null || _b === void 0 ? void 0 : _b.data;
  if (!data) return 0;
  const dataView = new DataView(data.buffer);
  return dataView.getFloat32(4, true);
};

exports.getWeightById = getWeightById;

const getType = (mp, self) => {
  var _a, _b, _c;

  const selfId = exports.getSelfId(mp, self.desc);
  const data = mp.lookupEspmRecordById(selfId);
  return ((_a = data.record) === null || _a === void 0 ? void 0 : _a.type) && type_1.formType[(_b = data.record) === null || _b === void 0 ? void 0 : _b.type] ? type_1.formType[(_c = data.record) === null || _c === void 0 ? void 0 : _c.type] : 0;
};

const _getSignature = (mp, selfId) => {
  var _a, _b;

  const espmRecord = mp.lookupEspmRecordById(selfId);
  return (_b = (_a = espmRecord.record) === null || _a === void 0 ? void 0 : _a.type) !== null && _b !== void 0 ? _b : '';
};

const getSignature = (mp, self) => _getSignature(mp, exports.getSelfId(mp, self.desc));

const getSignatureEx = (mp, self, args) => _getSignature(mp, papyrusArgs_1.getNumber(args, 0));

const _equalSignature = (mp, selfId, type) => {
  var _a;

  const espmRecord = mp.lookupEspmRecordById(selfId);
  if (((_a = espmRecord.record) === null || _a === void 0 ? void 0 : _a.type) === type) return true;
  return false;
};

const equalSignature = (mp, self, args) => _equalSignature(mp, exports.getSelfId(mp, self.desc), papyrusArgs_1.getString(args, 0));

const equalSignatureEx = (mp, self, args) => _equalSignature(mp, papyrusArgs_1.getNumber(args, 0), papyrusArgs_1.getString(args, 1));

const register = (mp, strings) => {
  mp.registerPapyrusFunction('method', 'Form', 'GetFormID', self => getFormID(mp, self));
  mp.registerPapyrusFunction('method', 'Form', 'GetName', self => exports.getName(strings, mp, self));
  mp.registerPapyrusFunction('method', 'Form', 'GetType', self => getType(mp, self));
  mp.registerPapyrusFunction('method', 'Form', 'GetGoldValue', self => getGoldValue(mp, self));
  mp.registerPapyrusFunction('method', 'Form', 'GetWeight', self => exports.getWeight(mp, self));
  mp.registerPapyrusFunction('method', 'Form', 'GetKeywords', self => keywords_1.getKeywords(mp, self));
  mp.registerPapyrusFunction('method', 'Form', 'GetNumKeywords', self => keywords_1.getNumKeywords(mp, self));
  mp.registerPapyrusFunction('method', 'Form', 'GetNthKeyword', (self, args) => keywords_1.getNthKeyword(mp, self, args));
  mp.registerPapyrusFunction('method', 'Form', 'HasKeyword', (self, args) => keywords_1.hasKeyword(mp, self, args));
  mp.registerPapyrusFunction('method', 'Form', 'GetSignature', (self, args) => getSignature(mp, self));
  mp.registerPapyrusFunction('method', 'Form', 'EqualSignature', (self, args) => equalSignature(mp, self, args));
  mp.registerPapyrusFunction('global', 'FormEx', 'GetName', (self, args) => getNameEx(strings, mp, self, args));
  mp.registerPapyrusFunction('global', 'FormEx', 'GetEditorID', (self, args) => exports.getEditorId(mp, self, args));
  mp.registerPapyrusFunction('global', 'FormEx', 'GetDescription', (self, args) => exports.getDescription(strings, mp, self, args));
  mp.registerPapyrusFunction('global', 'FormEx', 'HasKeyword', (self, args) => keywords_1.hasKeywordEx(mp, self, args));
  mp.registerPapyrusFunction('global', 'FormEx', 'GetSignature', (self, args) => getSignatureEx(mp, self, args));
  mp.registerPapyrusFunction('global', 'FormEx', 'EqualSignature', (self, args) => equalSignatureEx(mp, self, args));
};

exports.register = register;
},{"../../utils/helper":"FxH1","../../utils/papyrusArgs":"oZY1","./keywords":"D1sz","./type":"CIMu"}],"Xpf2":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WeaponLocation = exports.WeaponType = void 0;
var WeaponType;

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
})(WeaponType = exports.WeaponType || (exports.WeaponType = {}));

var WeaponLocation;

(function (WeaponLocation) {
  WeaponLocation[WeaponLocation["LeftHand"] = 0] = "LeftHand";
  WeaponLocation[WeaponLocation["RightHand"] = 1] = "RightHand";
})(WeaponLocation = exports.WeaponLocation || (exports.WeaponLocation = {}));
},{}],"TCaz":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.register = exports.getLocationById = exports.getBaseDamage = exports.getBaseDamageById = exports.getWeaponType = exports.getWeaponTypeById = void 0;

const helper_1 = require("../../utils/helper");

const type_1 = require("./type");

const getWeaponTypeById = (mp, selfId, espmRecord) => {
  var _a, _b;

  if (!espmRecord) espmRecord = mp.lookupEspmRecordById(selfId);
  const kwda = (_b = (_a = espmRecord.record) === null || _a === void 0 ? void 0 : _a.fields.find(x => x.type === 'KWDA')) === null || _b === void 0 ? void 0 : _b.data;
  const keywords = [];
  if (!kwda) return type_1.WeaponType.Fists;
  const dataView = new DataView(kwda.buffer);

  for (let i = 0; i < dataView.byteLength; i += 4) {
    keywords.push(dataView.getUint32(i, true));
  }

  if (keywords.includes(0x1e711)) {
    return type_1.WeaponType.Swords;
  } else if (keywords.includes(0x6d931)) {
    return type_1.WeaponType.Greatswords;
  } else if (keywords.includes(0x1e713)) {
    return type_1.WeaponType.Daggers;
  } else if (keywords.includes(0x6d932) || keywords.includes(0x6d930)) {
    return type_1.WeaponType.BattleaxesANDWarhammers;
  } else if (keywords.includes(0x1e714)) {
    return type_1.WeaponType.Maces;
  } else if (keywords.includes(0x1e712)) {
    return type_1.WeaponType.WarAxes;
  } else if (keywords.includes(0x1e715)) {
    return type_1.WeaponType.Bows;
  } else if (keywords.includes(0x1e716)) {
    return type_1.WeaponType.Staff;
  } else if (keywords.includes(-1)) {
    return type_1.WeaponType.Crossbows;
  }
};

exports.getWeaponTypeById = getWeaponTypeById;

const getWeaponType = (mp, self) => {
  const selfId = mp.getIdFromDesc(self.desc);
  return exports.getWeaponTypeById(mp, selfId);
};

exports.getWeaponType = getWeaponType;

const getBaseDamageById = (mp, selfId, espmRecord) => {
  var _a, _b;

  if (!espmRecord) espmRecord = mp.lookupEspmRecordById(selfId);
  const data = (_b = (_a = espmRecord.record) === null || _a === void 0 ? void 0 : _a.fields.find(x => x.type === 'DATA')) === null || _b === void 0 ? void 0 : _b.data;
  if (!data) return 0;
  const damage = helper_1.uint16(data.buffer, 8);
  return damage;
};

exports.getBaseDamageById = getBaseDamageById;

const getBaseDamage = (mp, self) => {
  const selfId = mp.getIdFromDesc(self.desc);
  return exports.getBaseDamageById(mp, selfId);
};

exports.getBaseDamage = getBaseDamage;

const getLocationById = (mp, selfId, espmRecord) => {
  var _a, _b, _c;

  if (!espmRecord) espmRecord = mp.lookupEspmRecordById(selfId);
  const etype = (_b = (_a = espmRecord.record) === null || _a === void 0 ? void 0 : _a.fields.find(x => x.type === 'ETYP')) === null || _b === void 0 ? void 0 : _b.data;
  if (!etype) return type_1.WeaponLocation.RightHand;
  const etypeId = mp.lookupEspmRecordById(helper_1.uint32(etype.buffer, 0));
  if (!etypeId) return type_1.WeaponLocation.RightHand;
  const edidEquipSlot = (_c = etypeId.record) === null || _c === void 0 ? void 0 : _c.editorId;
  if (edidEquipSlot === 'LeftHand') return type_1.WeaponLocation.LeftHand;
  return type_1.WeaponLocation.RightHand;
};

exports.getLocationById = getLocationById;

const register = mp => {
  mp.registerPapyrusFunction('method', 'Weapon', 'GetWeaponType', self => exports.getWeaponType(mp, self));
  mp.registerPapyrusFunction('method', 'Weapon', 'GetBaseDamage', self => exports.getBaseDamage(mp, self));
};

exports.register = register;
},{"../../utils/helper":"FxH1","./type":"Xpf2"}],"lP44":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getEquippedWeapon = exports.getEquippedShield = exports.getEquippedArmorInSlot = exports.getEquippedObject = exports.getWornFormsId = exports.getWornForms = exports._getWornForms = exports.getEquippedItemType = exports.unequipItemSlot = exports.unequipAll = exports.unequipItemEx = exports.unequipItem = exports.isEquipped = exports.equipItemById = exports.equipItemEx = exports.equipItem = exports.getEquipment = void 0;

const eval_1 = require("../../properties/eval");

const functionInfo_1 = require("../../utils/functionInfo");

const papyrusArgs_1 = require("../../utils/papyrusArgs");

const armor_1 = require("../armor");

const form_1 = require("../form");

const game_1 = require("../game");

const weapon_1 = require("../weapon");

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
    x.weight = form_1.getWeightById(mp, x.baseId);

    switch (true) {
      case rec.record.type === 'WEAP' && opt.mapWEAP:
        x.location = weapon_1.getLocationById(mp, x.baseId, rec);
        x.baseDamage = weapon_1.getBaseDamageById(mp, x.baseId, rec);
        x.weaponType = weapon_1.getWeaponTypeById(mp, x.baseId, rec);
        break;

      case rec.record.type === 'ARMO' && opt.mapARMO:
        x.baseArmor = armor_1.getBaseArmorById(mp, x.baseId, rec);
        x.slot = armor_1.getSlotById(mp, x.baseId, rec);
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
  const item = papyrusArgs_1.getObject(args, 0);
  const itemId = mp.getIdFromDesc(item.desc);
  const preventRemoval = papyrusArgs_1.getBoolean(args, 1);
  const silent = papyrusArgs_1.getBoolean(args, 2);
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

  eval_1.evalClient(mp, selfId, new functionInfo_1.FunctionInfo(func).getText({
    itemId,
    preventRemoval,
    silent
  }));

  if (!silent) {}
};

exports.equipItem = equipItem;

const equipItemEx = (mp, self, args) => {
  const selfId = mp.getIdFromDesc(self.desc);
  const item = papyrusArgs_1.getObject(args, 0);
  const itemId = mp.getIdFromDesc(item.desc);
  const slot = args[1] ? papyrusArgs_1.getNumber(args, 1) : 0;
  const preventUnequip = args[2] ? papyrusArgs_1.getBoolean(args, 2) : false;
  const equipSound = args[3] ? papyrusArgs_1.getBoolean(args, 3) : true;

  const func = (ctx, itemId, slot, preventUnequip, equipSound) => {
    ctx.sp.once('update', () => {
      if (!ctx.refr) return;
      const ac = ctx.sp.Actor.from(ctx.refr);
      const form = ctx.sp.Game.getFormEx(itemId);
      ac === null || ac === void 0 ? void 0 : ac.equipItemEx(form, slot, preventUnequip, equipSound);
    });
  };

  eval_1.evalClient(mp, selfId, new functionInfo_1.FunctionInfo(func).getText({
    itemId,
    slot,
    preventUnequip,
    equipSound
  }));

  if (!equipSound) {}
};

exports.equipItemEx = equipItemEx;

const equipItemById = (mp, self, args) => {};

exports.equipItemById = equipItemById;

const isEquipped = (mp, self, args) => {
  const selfId = mp.getIdFromDesc(self.desc);
  const item = papyrusArgs_1.getObject(args, 0);
  const itemId = mp.getIdFromDesc(item.desc);
  const eq = exports.getEquipment(mp, selfId);
  if (!eq) return false;
  return eq.inv.entries.findIndex(item => item.baseId === itemId && item.worn) >= 0;
};

exports.isEquipped = isEquipped;

const unequipItem = (mp, self, args) => {
  const selfId = mp.getIdFromDesc(self.desc);
  const item = papyrusArgs_1.getObject(args, 0);
  const itemId = mp.getIdFromDesc(item.desc);
  const preventRemoval = args[1] ? papyrusArgs_1.getBoolean(args, 1) : false;
  const silent = args[2] ? papyrusArgs_1.getBoolean(args, 2) : false;

  const func = (ctx, itemId, preventRemoval, silent) => {
    ctx.sp.once('update', () => {
      if (!ctx.refr) return;
      const ac = ctx.sp.Actor.from(ctx.refr);
      const form = ctx.sp.Game.getFormEx(itemId);
      ac === null || ac === void 0 ? void 0 : ac.unequipItem(form, preventRemoval, silent);
    });
  };

  eval_1.evalClient(mp, selfId, new functionInfo_1.FunctionInfo(func).getText({
    itemId,
    preventRemoval,
    silent
  }));

  if (!silent) {}
};

exports.unequipItem = unequipItem;

const unequipItemEx = (mp, self, args) => {
  const selfId = mp.getIdFromDesc(self.desc);
  const item = papyrusArgs_1.getObject(args, 0);
  const itemId = mp.getIdFromDesc(item.desc);
  const slot = args[1] ? papyrusArgs_1.getNumber(args, 1) : 0;
  const preventEquip = args[2] ? papyrusArgs_1.getBoolean(args, 2) : false;

  const func = (ctx, itemId, slot, preventEquip) => {
    ctx.sp.once('update', () => {
      if (!ctx.refr) return;
      const ac = ctx.sp.Actor.from(ctx.refr);
      const form = ctx.sp.Game.getFormEx(itemId);
      ac === null || ac === void 0 ? void 0 : ac.unequipItemEx(form, slot, preventEquip);
    });
  };

  eval_1.evalClient(mp, selfId, new functionInfo_1.FunctionInfo(func).getText({
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

  eval_1.evalClient(mp, selfId, new functionInfo_1.FunctionInfo(func).getText());
};

exports.unequipAll = unequipAll;

const unequipItemSlot = (mp, self, args) => {
  const selfId = mp.getIdFromDesc(self.desc);
  const slotId = papyrusArgs_1.getNumber(args, 0);

  const func = (ctx, slotId) => {
    ctx.sp.once('update', () => {
      if (!ctx.refr) return;
      const ac = ctx.sp.Actor.from(ctx.refr);
      ac === null || ac === void 0 ? void 0 : ac.unequipItemSlot(slotId);
    });
  };

  eval_1.evalClient(mp, selfId, new functionInfo_1.FunctionInfo(func).getText({
    slotId
  }));
};

exports.unequipItemSlot = unequipItemSlot;

const getEquippedItemType = (mp, self, args) => {
  const selfId = mp.getIdFromDesc(self.desc);
  const hand = papyrusArgs_1.getNumber(args, 0);
};

exports.getEquippedItemType = getEquippedItemType;

const _getWornForms = (mp, self) => {
  const selfId = mp.getIdFromDesc(self.desc);
  const eq = exports.getEquipment(mp, selfId);
  return eq === null || eq === void 0 ? void 0 : eq.inv.entries.filter(x => x.worn).map(x => game_1.getForm(mp, null, [x.baseId])).filter(x => x);
};

exports._getWornForms = _getWornForms;

const getWornForms = (mp, selfNull, args) => {
  const self = papyrusArgs_1.getObject(args, 0);
  return exports._getWornForms(mp, self);
};

exports.getWornForms = getWornForms;

const getWornFormsId = (mp, selfNull, args) => {
  const selfId = mp.getIdFromDesc(papyrusArgs_1.getObject(args, 0).desc);
  const eq = exports.getEquipment(mp, selfId);
  return eq === null || eq === void 0 ? void 0 : eq.inv.entries.filter(x => x.worn).map(x => x.baseId);
};

exports.getWornFormsId = getWornFormsId;

const getEquippedObject = (mp, self, args) => {
  var _a;

  const selfId = mp.getIdFromDesc(self.desc);
  const loc = papyrusArgs_1.getNumber(args, 0);
  const eq = exports.getEquipment(mp, selfId, {
    mapARMO: false
  });
  const baseId = (_a = eq === null || eq === void 0 ? void 0 : eq.inv.entries.find(x => x.location === loc)) === null || _a === void 0 ? void 0 : _a.baseId;
  if (baseId) return game_1.getForm(mp, null, [baseId]);
};

exports.getEquippedObject = getEquippedObject;

const getEquippedArmorInSlot = (mp, self, args) => {
  var _a;

  const selfId = mp.getIdFromDesc(self.desc);
  const slot = papyrusArgs_1.getNumber(args, 0);
  const eq = exports.getEquipment(mp, selfId, {
    mapWEAP: false
  });
  const baseId = (_a = eq === null || eq === void 0 ? void 0 : eq.inv.entries.find(x => {
    var _a;

    return (_a = x.slot) === null || _a === void 0 ? void 0 : _a.includes(slot);
  })) === null || _a === void 0 ? void 0 : _a.baseId;
  if (baseId) return game_1.getForm(mp, null, [baseId]);
};

exports.getEquippedArmorInSlot = getEquippedArmorInSlot;

const getEquippedShield = (mp, self) => {
  var _a;

  const selfId = mp.getIdFromDesc(self.desc);
  const eq = exports.getEquipment(mp, selfId, {
    mapWEAP: false
  });
  const baseId = (_a = eq === null || eq === void 0 ? void 0 : eq.inv.entries.find(x => {
    var _a;

    return (_a = x.slot) === null || _a === void 0 ? void 0 : _a.includes(39);
  })) === null || _a === void 0 ? void 0 : _a.baseId;
  if (baseId) return game_1.getForm(mp, null, [baseId]);
};

exports.getEquippedShield = getEquippedShield;

const getEquippedWeapon = (mp, self, args) => {
  var _a;

  const selfId = mp.getIdFromDesc(self.desc);
  const isLeftHand = papyrusArgs_1.getBoolean(args, 0);
  const loc = isLeftHand ? 0 : 1;
  const eq = exports.getEquipment(mp, selfId, {
    mapARMO: false
  });
  const baseId = (_a = eq === null || eq === void 0 ? void 0 : eq.inv.entries.find(x => x.location === loc)) === null || _a === void 0 ? void 0 : _a.baseId;
  if (baseId) return game_1.getForm(mp, null, [baseId]);
};

exports.getEquippedWeapon = getEquippedWeapon;
},{"../../properties/eval":"mJTA","../../utils/functionInfo":"fC7F","../../utils/papyrusArgs":"oZY1","../armor":"WNhg","../form":"mnzc","../game":"WCBi","../weapon":"TCaz"}],"sC2V":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.conditionFunctions = void 0;
exports.conditionFunctions = ['GetWantBlocking', 'GetDistance', 'AddItem', 'SetEssential', 'Rotate', 'GetLocked', 'GetPos', 'SetPos', 'GetAngle', 'SetAngle', 'GetStartingPos', 'GetStartingAngle', 'GetSecondsPassed', 'Activate', 'GetActorValue', 'SetActorValue', 'ModActorValue', 'SetAtStart', 'GetCurrentTime', 'PlayGroup', 'LoopGroup', 'SkipAnim', 'StartCombat', 'StopCombat', 'GetScale', 'IsMoving', 'IsTurning', 'GetLineOfSight', 'AddSpell', 'RemoveSpell', 'Cast', 'GetButtonPressed', 'GetInSameCell', 'Enable', 'Disable', 'GetDisabled', 'MenuMode', 'PlaceAtMe', 'PlaySound', 'GetDisease', 'FailAllObjectives', 'GetClothingValue', 'SameFaction', 'SameRace', 'SameSex', 'GetDetected', 'GetDead', 'GetItemCount', 'GetGold', 'GetSleeping', 'GetTalkedToPC', 'Say', 'SayTo', 'GetScriptVariable', 'StartQuest', 'StopQuest', 'GetQuestRunning', 'SetStage', 'GetStage', 'GetStageDone', 'GetFactionRankDifference', 'GetAlarmed', 'IsRaining', 'GetAttacked', 'GetIsCreature', 'GetLockLevel', 'GetShouldAttack', 'GetInCell', 'GetIsClass', 'GetIsRace', 'GetIsSex', 'GetInFaction', 'GetIsID', 'GetFactionRank', 'GetGlobalValue', 'IsSnowing', 'FastTravel', 'GetRandomPercent', 'RemoveMusic', 'GetQuestVariable', 'GetLevel', 'IsRotating', 'RemoveItem', 'GetLeveledEncounterValue', 'GetDeadCount', 'AddToMap', 'StartConversation', 'Drop', 'AddTopic', 'ShowMessage', 'SetAlert', 'GetIsAlerted', 'Look', 'StopLook', 'EvaluatePackage', 'SendAssaultAlarm', 'EnablePlayerControls', 'DisablePlayerControls', 'GetPlayerControlsDisabled', 'GetHeadingAngle', 'PickIdle', 'IsWeaponMagicOut', 'IsTorchOut', 'IsShieldOut', 'CreateDetectionEvent', 'IsActionRef', 'IsFacingUp', 'GetKnockedState', 'GetWeaponAnimType', 'IsWeaponSkillType', 'GetCurrentAIPackage', 'IsWaiting', 'IsIdlePlaying', 'CompleteQuest', 'Lock', 'UnLock', 'IsIntimidatedbyPlayer', 'IsPlayerInRegion', 'GetActorAggroRadiusViolated', 'GetCrimeKnown', 'SetEnemy', 'SetAlly', 'GetCrime', 'IsGreetingPlayer', 'StartMisterSandMan', 'IsGuard', 'StartCannibal', 'HasBeenEaten', 'GetStaminaPercentage', 'GetPCIsClass', 'GetPCIsRace', 'GetPCIsSex', 'GetPCInFaction', 'SameFactionAsPC', 'SameRaceAsPC', 'SameSexAsPC', 'GetIsReference', 'SetFactionRank', 'ModFactionRank', 'KillActor', 'ResurrectActor', 'IsTalking', 'GetWalkSpeed', 'GetCurrentAIProcedure', 'GetTrespassWarningLevel', 'IsTrespassing', 'IsInMyOwnedCell', 'GetWindSpeed', 'GetCurrentWeatherPercent', 'GetIsCurrentWeather', 'IsContinuingPackagePCNear', 'SetCrimeFaction', 'GetIsCrimeFaction', 'CanHaveFlames', 'HasFlames', 'AddFlames', 'RemoveFlames', 'GetOpenState', 'MoveToMarker', 'GetSitting', 'GetFurnitureMarkerID', 'GetIsCurrentPackage', 'IsCurrentFurnitureRef', 'IsCurrentFurnitureObj', 'SetSize', 'RemoveMe', 'DropMe', 'GetFactionReaction', 'SetFactionReaction', 'ModFactionReaction', 'GetDayOfWeek', 'IgnoreCrime', 'GetTalkedToPCParam', 'RemoveAllItems', 'WakeUpPC', 'IsPCSleeping', 'IsPCAMurderer', 'SetCombatStyle', 'PlaySound3D', 'SelectPlayerSpell', 'HasSameEditorLocAsRef', 'HasSameEditorLocAsRefAlias', 'GetEquipped', 'Wait', 'StopWaiting', 'IsSwimming', 'ScriptEffectElapsedSeconds', 'SetCellPublicFlag', 'GetPCSleepHours', 'SetPCSleepHours', 'GetAmountSoldStolen', 'ModAmountSoldStolen', 'GetIgnoreCrime', 'GetPCExpelled', 'SetPCExpelled', 'GetPCFactionMurder', 'SetPCFactionMurder', 'GetPCEnemyofFaction', 'SetPCEnemyofFaction', 'GetPCFactionAttack', 'SetPCFactionAttack', 'StartScene', 'StopScene', 'GetDestroyed', 'SetDestroyed', 'GetActionRef', 'GetSelf', 'GetContainer', 'GetForceRun', 'SetForceRun', 'GetForceSneak', 'SetForceSneak', 'AdvancePCSkill', 'AdvancePCLevel', 'HasMagicEffect', 'GetDefaultOpen', 'SetDefaultOpen', 'ShowClassMenu', 'ShowRaceMenu', 'GetAnimAction', 'ShowNameMenu', 'SetOpenState', 'ResetReference', 'IsSpellTarget', 'GetVATSMode', 'GetPersuasionNumber', 'GetVampireFeed', 'GetCannibal', 'GetIsClassDefault', 'GetClassDefaultMatch', 'GetInCellParam', 'UnusedFunction1', 'GetCombatTarget', 'GetPackageTarget', 'ShowSpellMaking', 'GetVatsTargetHeight', 'SetGhost', 'GetIsGhost', 'EquipItem', 'UnequipItem', 'SetClass', 'SetUnconscious', 'GetUnconscious', 'SetRestrained', 'GetRestrained', 'ForceFlee', 'GetIsUsedItem', 'GetIsUsedItemType', 'IsScenePlaying', 'IsInDialogueWithPlayer', 'GetLocationCleared', 'SetLocationCleared', 'ForceRefIntoAlias', 'EmptyRefAlias', 'GetIsPlayableRace', 'GetOffersServicesNow', 'GetGameSetting', 'StopCombatAlarmOnActor', 'HasAssociationType', 'HasFamilyRelationship', 'SetWeather', 'HasParentRelationship', 'IsWarningAbout', 'IsWeaponOut', 'HasSpell', 'IsTimePassing', 'IsPleasant', 'IsCloudy', 'TrapUpdate', 'ShowQuestObjectives', 'ForceActorValue', 'IncrementPCSkill', 'DoTrap', 'EnableFastTravel', 'IsSmallBump', 'GetParentRef', 'PlayBink', 'GetBaseActorValue', 'IsOwner', 'SetOwnership', 'IsCellOwner', 'SetCellOwnership', 'IsHorseStolen', 'SetCellFullName', 'SetActorFullName', 'IsLeftUp', 'IsSneaking', 'IsRunning', 'GetFriendHit', 'IsInCombat', 'SetPackDuration', 'PlayMagicShaderVisuals', 'PlayMagicEffectVisuals', 'StopMagicShaderVisuals', 'StopMagicEffectVisuals', 'ResetInterior', 'IsAnimPlaying', 'SetActorAlpha', 'EnableLinkedPathPoints', 'DisableLinkedPathPoints', 'IsInInterior', 'ForceWeather', 'ToggleActorsAI', 'IsActorsAIOff', 'IsWaterObject', 'GetPlayerAction', 'IsActorUsingATorch', 'SetLevel', 'ResetFallDamageTimer', 'IsXBox', 'GetInWorldspace', 'ModPCMiscStat', 'GetPCMiscStat', 'GetPairedAnimation', 'IsActorAVictim', 'GetTotalPersuasionNumber', 'SetScale', 'ModScale', 'GetIdleDoneOnce', 'KillAllActors', 'GetNoRumors', 'SetNoRumors', 'Dispel', 'GetCombatState', 'TriggerHitShader', 'GetWithinPackageLocation', 'Reset3DState', 'IsRidingHorse', 'DispelAllSpells', 'IsFleeing', 'AddAchievement', 'DuplicateAllItems', 'IsInDangerousWater', 'EssentialDeathReload', 'SetShowQuestItems', 'DuplicateNPCStats', 'ResetHealth', 'SetIgnoreFriendlyHits', 'GetIgnoreFriendlyHits', 'IsPlayersLastRiddenHorse', 'SetActorRefraction', 'SetItemValue', 'SetRigidBodyMass', 'ShowViewerStrings', 'ReleaseWeatherOverride', 'SetAllReachable', 'SetAllVisible', 'SetNoAvoidance', 'SendTrespassAlarm', 'SetSceneIsComplex', 'Autosave', 'StartMasterFileSeekData', 'DumpMasterFileSeekData', 'IsActor', 'IsEssential', 'PreloadMagicEffect', 'ShowDialogSubtitles', 'SetPlayerResistingArrest', 'IsPlayerMovingIntoNewSpace', 'GetInCurrentLoc', 'GetInCurrentLocAlias', 'GetTimeDead', 'HasLinkedRef', 'GetLinkedRef', 'DamageObject', 'IsChild', 'GetStolenItemValueNoCrime', 'GetLastPlayerAction', 'IsPlayerActionActive', 'SetTalkingActivatorActor', 'IsTalkingActivatorActor', 'ShowBarterMenu', 'IsInList', 'GetStolenItemValue', 'AddPerk', 'GetCrimeGoldViolent', 'GetCrimeGoldNonviolent', 'ShowRepairMenu', 'HasShout', 'AddNote', 'RemoveNote', 'GetHasNote', 'AddToFaction', 'RemoveFromFaction', 'DamageActorValue', 'RestoreActorValue', 'TriggerHUDShudder', 'GetObjectiveFailed', 'SetObjectiveFailed', 'SetGlobalTimeMultiplier', 'GetHitLocation', 'IsPC1stPerson', 'PurgeCellBuffers', 'PushActorAway', 'SetActorsAI', 'ClearOwnership', 'GetCauseofDeath', 'IsLimbGone', 'IsWeaponInList', 'PlayIdle', 'ApplyImageSpaceModifier', 'RemoveImageSpaceModifier', 'IsBribedbyPlayer', 'GetRelationshipRank', 'SetRelationshipRank', 'SetCellImageSpace', 'ShowChargenMenu', 'GetVATSValue', 'IsKiller', 'IsKillerObject', 'GetFactionCombatReaction', 'UseWeapon', 'EvaluateSpellConditions', 'ToggleMotionBlur', 'Exists', 'GetGroupMemberCount', 'GetGroupTargetCount', 'SetObjectiveCompleted', 'SetObjectiveDisplayed', 'GetObjectiveCompleted', 'GetObjectiveDisplayed', 'SetImageSpace', 'PipboyRadio', 'RemovePerk', 'DisableAllActors', 'GetIsFormType', 'GetIsVoiceType', 'GetPlantedExplosive', 'CompleteAllObjectives', 'IsScenePackageRunning', 'GetHealthPercentage', 'SetAudioMultithreading', 'GetIsObjectType', 'ShowChargenMenuParams', 'GetDialogueEmotion', 'GetDialogueEmotionValue', 'ExitGame', 'GetIsCreatureType', 'PlayerCreatePotion', 'PlayerEnchantObject', 'ShowWarning', 'EnterTrigger', 'MarkForDelete', 'SetPlayerAIDriven', 'GetInCurrentLocFormList', 'GetInZone', 'GetVelocity', 'GetGraphVariableFloat', 'HasPerk', 'GetFactionRelation', 'IsLastIdlePlayed', 'SetNPCRadio', 'SetPlayerTeammate', 'GetPlayerTeammate', 'GetPlayerTeammateCount', 'OpenActorContainer', 'ClearFactionPlayerEnemyFlag', 'ClearActorsFactionsPlayerEnemyFlag', 'GetActorCrimePlayerEnemy', 'GetCrimeGold', 'SetCrimeGold', 'ModCrimeGold', 'GetPlayerGrabbedRef', 'IsPlayerGrabbedRef', 'PlaceLeveledActorAtMe', 'GetKeywordItemCount', 'ShowLockpickMenu', 'GetBroadcastState', 'SetBroadcastState', 'StartRadioConversation', 'GetDestructionStage', 'ClearDestruction', 'CastImmediateOnSelf', 'GetIsAlignment', 'ResetQuest', 'SetQuestDelay', 'IsProtected', 'GetThreatRatio', 'MatchFaceGeometry', 'GetIsUsedItemEquipType', 'GetPlayerName', 'FireWeapon', 'PayCrimeGold', 'UnusedFunction2', 'MatchRace', 'SetPCYoung', 'SexChange', 'IsCarryable', 'GetConcussed', 'SetZoneRespawns', 'SetVATSTarget', 'GetMapMarkerVisible', 'ResetInventory', 'PlayerKnows', 'GetPermanentActorValue', 'GetKillingBlowLimb', 'GoToJail', 'CanPayCrimeGold', 'ServeTime', 'GetDaysInJail', 'EPAlchemyGetMakingPoison', 'EPAlchemyEffectHasKeyword', 'ShowAllMapMarkers', 'GetAllowWorldInteractions', 'ResetAI', 'SetRumble', 'SetNoActivationSound', 'ClearNoActivationSound', 'GetLastHitCritical', 'AddMusic', 'UnusedFunction3', 'UnusedFunction4', 'SetPCToddler', 'IsCombatTarget', 'TriggerScreenBlood', 'GetVATSRightAreaFree', 'GetVATSLeftAreaFree', 'GetVATSBackAreaFree', 'GetVATSFrontAreaFree', 'GetIsLockBroken', 'IsPS3', 'IsWin32', 'GetVATSRightTargetVisible', 'GetVATSLeftTargetVisible', 'GetVATSBackTargetVisible', 'GetVATSFrontTargetVisible', 'AttachAshPile', 'SetCriticalStage', 'IsInCriticalStage', 'RemoveFromAllFactions', 'GetXPForNextLevel', 'ShowLockpickMenuDebug', 'ForceSave', 'GetInfamy', 'GetInfamyViolent', 'GetInfamyNonViolent', 'UnusedFunction5', 'Sin', 'Cos', 'Tan', 'Sqrt', 'Log', 'Abs', 'GetQuestCompleted', 'UnusedFunction6', 'PipBoyRadioOff', 'AutoDisplayObjectives', 'IsGoreDisabled', 'FadeSFX', 'SetMinimalUse', 'IsSceneActionComplete', 'ShowQuestStages', 'GetSpellUsageNum', 'ForceRadioStationUpdate', 'GetActorsInHigh', 'HasLoaded3D', 'DisableAllMines', 'SetLastExtDoorActivated', 'KillQuestUpdates', 'IsImageSpaceActive', 'HasKeyword', 'HasRefType', 'LocationHasKeyword', 'LocationHasRefType', 'CreateEvent', 'GetIsEditorLocation', 'GetIsAliasRef', 'GetIsEditorLocAlias', 'IsSprinting', 'IsBlocking', 'HasEquippedSpell', 'GetCurrentCastingType', 'GetCurrentDeliveryType', 'EquipSpell', 'GetAttackState', 'GetAliasedRef', 'GetEventData', 'IsCloserToAThanB', 'EquipShout', 'GetEquippedShout', 'IsBleedingOut', 'UnlockWord', 'TeachWord', 'AddToContainer', 'GetRelativeAngle', 'SendAnimEvent', 'Shout', 'AddShout', 'RemoveShout', 'GetMovementDirection', 'IsInScene', 'GetRefTypeDeadCount', 'GetRefTypeAliveCount', 'ApplyHavokImpulse', 'GetIsFlying', 'IsCurrentSpell', 'SpellHasKeyword', 'GetEquippedItemType', 'GetLocationAliasCleared', 'SetLocationAliasCleared', 'GetLocAliasRefTypeDeadCount', 'GetLocAliasRefTypeAliveCount', 'IsWardState', 'IsInSameCurrentLocAsRef', 'IsInSameCurrentLocAsRefAlias', 'LocAliasIsLocation', 'GetKeywordDataForLocation', 'SetKeywordDataForLocation', 'GetKeywordDataForAlias', 'SetKeywordDataForAlias', 'LocAliasHasKeyword', 'IsNullPackageData', 'GetNumericPackageData', 'IsFurnitureAnimType', 'IsFurnitureEntryType', 'GetHighestRelationshipRank', 'GetLowestRelationshipRank', 'HasAssociationTypeAny', 'HasFamilyRelationshipAny', 'GetPathingTargetOffset', 'GetPathingTargetAngleOffset', 'GetPathingTargetSpeed', 'GetPathingTargetSpeedAngle', 'GetMovementSpeed', 'GetInContainer', 'IsLocationLoaded', 'IsLocAliasLoaded', 'IsDualCasting', 'DualCast', 'GetVMQuestVariable', 'GetVMScriptVariable', 'IsEnteringInteractionQuick', 'IsCasting', 'GetFlyingState', 'SetFavorState', 'IsInFavorState', 'HasTwoHandedWeaponEquipped', 'IsExitingInstant', 'IsInFriendStatewithPlayer', 'GetWithinDistance', 'GetActorValuePercent', 'IsUnique', 'GetLastBumpDirection', 'CameraShake', 'IsInFurnitureState', 'GetIsInjured', 'GetIsCrashLandRequest', 'GetIsHastyLandRequest', 'UpdateQuestInstanceGlobal', 'SetAllowFlying', 'IsLinkedTo', 'GetKeywordDataForCurrentLocation', 'GetInSharedCrimeFaction', 'GetBribeAmount', 'GetBribeSuccess', 'GetIntimidateSuccess', 'GetArrestedState', 'GetArrestingActor', 'ClearArrestState', 'EPTemperingItemIsEnchanted', 'EPTemperingItemHasKeyword', 'GetReceivedGiftValue', 'GetGiftGivenValue', 'ForceLocIntoAlias', 'GetReplacedItemType', 'SetHorseActor', 'PlayReferenceEffect', 'StopReferenceEffect', 'PlayShaderParticleGeometry', 'StopShaderParticleGeometry', 'ApplyImageSpaceModifierCrossFade', 'RemoveImageSpaceModifierCrossFade', 'IsAttacking', 'IsPowerAttacking', 'IsLastHostileActor', 'GetGraphVariableInt', 'GetCurrentShoutVariation', 'PlayImpactEffect', 'ShouldAttackKill', 'SendStealAlarm', 'GetActivationHeight', 'EPModSkillUsage_IsAdvanceSkill', 'WornHasKeyword', 'GetPathingCurrentSpeed', 'GetPathingCurrentSpeedAngle', 'KnockAreaEffect', 'InterruptCast', 'AddFormToFormList', 'RevertFormList', 'AddFormToLeveledList', 'RevertLeveledList', 'EPModSkillUsage_AdvanceObjectHasKeyword', 'EPModSkillUsage_IsAdvanceAction', 'EPMagic_SpellHasKeyword', 'GetNoBleedoutRecovery', 'SetNoBleedoutRecovery', 'EPMagic_SpellHasSkill', 'IsAttackType', 'IsAllowedToFly', 'HasMagicEffectKeyword', 'IsCommandedActor', 'IsStaggered', 'IsRecoiling', 'IsExitingInteractionQuick', 'IsPathing', 'GetShouldHelp', 'HasBoundWeaponEquipped', 'GetCombatTargetHasKeyword', 'UpdateLevel', 'GetCombatGroupMemberCount', 'IsIgnoringCombat', 'GetLightLevel', 'SavePCFace', 'SpellHasCastingPerk', 'IsBeingRidden', 'IsUndead', 'GetRealHoursPassed', 'UnequipAll', 'IsUnlockedDoor', 'IsHostileToActor', 'GetTargetHeight', 'IsPoison', 'WornApparelHasKeywordCount', 'GetItemHealthPercent', 'EffectWasDualCast', 'GetKnockStateEnum', 'DoesNotExist'];
},{}],"x9IM":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EffectFunctionType = exports.EffectSection = exports.ConditionRunOn = exports.ConditionFlag = exports.ConditionOperator = void 0;
var ConditionOperator;

(function (ConditionOperator) {
  ConditionOperator[ConditionOperator["EqualTo"] = 0] = "EqualTo";
  ConditionOperator[ConditionOperator["NotEqualTo"] = 1] = "NotEqualTo";
  ConditionOperator[ConditionOperator["GreaterThan"] = 2] = "GreaterThan";
  ConditionOperator[ConditionOperator["GreaterThanOrEqualTo"] = 3] = "GreaterThanOrEqualTo";
  ConditionOperator[ConditionOperator["LessThan"] = 4] = "LessThan";
  ConditionOperator[ConditionOperator["LessThanOrEqualTo"] = 5] = "LessThanOrEqualTo";
})(ConditionOperator = exports.ConditionOperator || (exports.ConditionOperator = {}));

var ConditionFlag;

(function (ConditionFlag) {
  ConditionFlag[ConditionFlag["AND"] = 0] = "AND";
  ConditionFlag[ConditionFlag["OR"] = 1] = "OR";
})(ConditionFlag = exports.ConditionFlag || (exports.ConditionFlag = {}));

var ConditionRunOn;

(function (ConditionRunOn) {
  ConditionRunOn[ConditionRunOn["Subjec"] = 0] = "Subjec";
  ConditionRunOn[ConditionRunOn["Targe"] = 1] = "Targe";
  ConditionRunOn[ConditionRunOn["Reference"] = 2] = "Reference";
  ConditionRunOn[ConditionRunOn["Combat"] = 3] = "Combat";
  ConditionRunOn[ConditionRunOn["Linked"] = 4] = "Linked";
  ConditionRunOn[ConditionRunOn["Quest"] = 5] = "Quest";
  ConditionRunOn[ConditionRunOn["Package"] = 6] = "Package";
  ConditionRunOn[ConditionRunOn["Event"] = 7] = "Event";
})(ConditionRunOn = exports.ConditionRunOn || (exports.ConditionRunOn = {}));

var EffectSection;

(function (EffectSection) {
  EffectSection[EffectSection["Quest"] = 0] = "Quest";
  EffectSection[EffectSection["Ability"] = 1] = "Ability";
  EffectSection[EffectSection["Complex"] = 2] = "Complex";
})(EffectSection = exports.EffectSection || (exports.EffectSection = {}));

var EffectFunctionType;

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
})(EffectFunctionType = exports.EffectFunctionType || (exports.EffectFunctionType = {}));
},{}],"lgGM":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.conditionResult = exports.conditionAllResult = void 0;

const helper_1 = require("../../utils/helper");

const keywords_1 = require("../form/keywords");

const functionList_1 = require("./functionList");

const type_1 = require("./type");

const conditionAllResult = (mp, conditionFields, subjectId) => {
  const condResults = [];
  conditionFields.forEach(cf => {
    if (!cf) return;
    const result = exports.conditionResult(mp, cf.data.buffer, subjectId);
    if (result === undefined) return;
    condResults.push(result);
  });

  if (condResults[0].flag === type_1.ConditionFlag.AND) {
    return condResults.every(c => c.result);
  } else if (condResults[0].flag === type_1.ConditionFlag.OR) {
    return condResults.some(c => c.result);
  }

  return false;
};

exports.conditionAllResult = conditionAllResult;

const conditionResult = (mp, cond, subjectId) => {
  const flags = helper_1.uint8(cond.slice(0, 5), 0);
  const operator = helper_1.uint8(cond.slice(5, 8), 0);
  const value = helper_1.float32(cond, 4);
  const func = helper_1.uint16(cond, 8);
  const param1 = helper_1.int32(cond, 12);
  const param2 = helper_1.int32(cond, 16);
  const runOn = helper_1.uint32(cond, 20);
  const ref = helper_1.uint32(cond, 24);

  if (operator === type_1.ConditionOperator.EqualTo) {
    if (functionList_1.conditionFunctions[func] === 'HasKeyword') {
      const funcResult = keywords_1.hasKeywordEx(mp, null, [subjectId, param1]);
      const condResult = !!value == funcResult;
      return {
        flag: flags & type_1.ConditionFlag.OR ? type_1.ConditionFlag.OR : type_1.ConditionFlag.AND,
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

const helper_1 = require("../../utils/helper");

const condition_1 = require("./condition");

const type_1 = require("./type");

const getPerkEffectData = (mp, perkId, subjectId) => {
  var _a;

  const perkRec = mp.lookupEspmRecordById(perkId);
  const perkRecFields = (_a = perkRec.record) === null || _a === void 0 ? void 0 : _a.fields;
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
    var _a, _b;

    const i = index.start;
    const fields = perkRecFields.slice(index.start, index.end + 1);
    const header = fields[0].data;

    if (header[0] === type_1.EffectSection.Complex) {
      const effectType = helper_1.uint8(fields[1].data.buffer, 0);
      const functionType = helper_1.uint8(fields[1].data.buffer, 1);
      const CondTypeCount = fields.filter(x => x.type === 'CTDA');
      const prks = CondTypeCount.length > 0 ? 1 : 0;
      let conditionResult = CondTypeCount.length === 0;
      let conditionFunction = undefined;

      if (CondTypeCount.length > 0) {
        if (effectType === 0x23 && functionType === type_1.EffectFunctionType.MultiplyValue) {
          if (subjectId) {
            conditionResult = condition_1.conditionAllResult(mp, CondTypeCount, subjectId);
          }

          conditionFunction = subjectId => {
            return condition_1.conditionAllResult(mp, CondTypeCount, subjectId);
          };
        }
      }

      const epft = (_a = fields.find(x => x.type === 'EPFT')) === null || _a === void 0 ? void 0 : _a.data.buffer;
      const epfd = (_b = fields.find(x => x.type === 'EPFD')) === null || _b === void 0 ? void 0 : _b.data.buffer;
      const valueType = epft ? helper_1.uint8(epft, 0) : 0;
      const effectValue = epfd ? valueType === 1 ? helper_1.float32(epfd, 0) : 0 : 0;
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
},{"../../utils/helper":"FxH1","./condition":"lgGM","./type":"x9IM"}],"AkNH":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRaceStaminaRate = exports.getRaceStamina = exports.getRaceMagickaRate = exports.getRaceMagicka = exports.getRaceHealRate = exports.getRaceHealth = exports.getRaceUnarmedDamage = exports.getRaceId = void 0;

const helper_1 = require("../utils/helper");

const getRaceId = (mp, pcFormId, rec) => {
  var _a, _b;

  if (pcFormId >= 0xff000000) {
    try {
      const appearance = mp.get(pcFormId, 'appearance');
      return (_a = appearance === null || appearance === void 0 ? void 0 : appearance.raceId) !== null && _a !== void 0 ? _a : 0;
    } catch (error) {}
  }

  const rnam = (_b = rec.fields.find(x => x.type === 'RNAM')) === null || _b === void 0 ? void 0 : _b.data;
  if (!rnam) return;
  return helper_1.uint32(rnam.buffer, 0);
};

exports.getRaceId = getRaceId;

const getRaceFloat32DataValue = (espmRecord, offset) => {
  var _a, _b;

  const raceData = (_b = (_a = espmRecord.record) === null || _a === void 0 ? void 0 : _a.fields.find(x => x.type === 'DATA')) === null || _b === void 0 ? void 0 : _b.data;
  if (!raceData) return;
  return helper_1.float32(raceData.buffer, offset);
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
},{"../utils/helper":"FxH1"}],"I1C7":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addSkillExperience = exports.restoreActorValue = exports.damageActorValue = exports.getActorValue = exports.setActorValue = void 0;

const attributes_1 = require("../../properties/actor/actorValues/attributes");

const papyrusArgs_1 = require("../../utils/papyrusArgs");

const setActorValue = (mp, self, args) => {
  const selfId = mp.getIdFromDesc(self.desc);
  const avName = papyrusArgs_1.getString(args, 0);
  const avValue = papyrusArgs_1.getNumber(args, 1);
  attributes_1.actorValues.set(selfId, avName, 'base', avValue);
};

exports.setActorValue = setActorValue;

const getActorValue = (mp, self, args) => {
  const selfId = mp.getIdFromDesc(self.desc);
  const avName = papyrusArgs_1.getString(args, 0);
  return attributes_1.actorValues.getCurrent(selfId, avName);
};

exports.getActorValue = getActorValue;

const damageActorValue = (mp, self, args) => {
  const selfId = mp.getIdFromDesc(self.desc);
  const avName = papyrusArgs_1.getString(args, 0);
  const avValue = papyrusArgs_1.getNumber(args, 1);
  const damage = attributes_1.actorValues.get(selfId, avName, 'damage');
  attributes_1.actorValues.set(selfId, avName, 'damage', damage - avValue);
};

exports.damageActorValue = damageActorValue;

const restoreActorValue = (mp, self, args) => {
  const selfId = mp.getIdFromDesc(self.desc);
  const avName = papyrusArgs_1.getString(args, 0);
  const avValue = papyrusArgs_1.getNumber(args, 1);
  const damage = attributes_1.actorValues.get(selfId, avName, 'damage');
  attributes_1.actorValues.set(selfId, avName, 'damage', damage + avValue > 0 ? 0 : damage + avValue);
};

exports.restoreActorValue = restoreActorValue;

const addSkillExperience = (mp, self, args) => {
  const ac = papyrusArgs_1.getObject(args, 0);
  const acId = mp.getIdFromDesc(ac.desc);
  const avName = papyrusArgs_1.getString(args, 1);
  const exp = papyrusArgs_1.getNumber(args, 2);
};

exports.addSkillExperience = addSkillExperience;
},{"../../properties/actor/actorValues/attributes":"Klzq","../../utils/papyrusArgs":"oZY1"}],"d40v":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removePerk = exports.addPerk = exports.hasPerk = void 0;

const papyrusArgs_1 = require("../../utils/papyrusArgs");

const getPerkList = (mp, selfId) => {
  var _a;

  return (_a = mp.get(selfId, 'perk')) !== null && _a !== void 0 ? _a : [];
};

const setPerkList = (mp, selfId, perkList) => {
  mp.set(selfId, 'perk', perkList);
};

const hasPerk = (mp, self, args) => {
  const perk = papyrusArgs_1.getObject(args, 0);
  const selfId = mp.getIdFromDesc(self.desc);
  const perkId = mp.getIdFromDesc(perk.desc);
  return getPerkList(mp, selfId).includes(perkId);
};

exports.hasPerk = hasPerk;

const addPerk = (mp, self, args) => {
  const perk = papyrusArgs_1.getObject(args, 0);
  const selfId = mp.getIdFromDesc(self.desc);
  const perkId = mp.getIdFromDesc(perk.desc);
  if (exports.hasPerk(mp, self, args)) return;
  const perkList = getPerkList(mp, selfId);
  perkList.push(perkId);
  setPerkList(mp, selfId, perkList);
};

exports.addPerk = addPerk;

const removePerk = (mp, self, args) => {
  const perk = papyrusArgs_1.getObject(args, 0);
  const selfId = mp.getIdFromDesc(self.desc);
  const perkId = mp.getIdFromDesc(perk.desc);
  if (!exports.hasPerk(mp, self, args)) return;
  const perkList = getPerkList(mp, selfId);
  perkList.push(perkId);
  setPerkList(mp, selfId, perkList.filter(id => id !== perkId));
};

exports.removePerk = removePerk;
},{"../../utils/papyrusArgs":"oZY1"}],"ZYrz":[function(require,module,exports) {
"use strict";

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.register = exports.throwOutById = void 0;

const value_1 = require("./value");

const perk_1 = require("./perk");

const equip_1 = require("./equip");

const papyrusArgs_1 = require("../../utils/papyrusArgs");

const eval_1 = require("../../properties/eval");

const functionInfo_1 = require("../../utils/functionInfo");

const game_1 = require("../game");

const attributes_1 = require("../../properties/actor/actorValues/attributes");

const objectReference_1 = require("../objectReference");

const race_1 = require("../race");

const isWeaponDrawn = (mp, self) => !!mp.get(mp.getIdFromDesc(self.desc), 'isWeaponDrawn');

const isDead = (mp, self) => !!mp.get(mp.getIdFromDesc(self.desc), 'isDead');

const setOutfit = (mp, self, args) => {
  var _a, _b;

  const selfId = mp.getIdFromDesc(self.desc);
  const outfit = papyrusArgs_1.getObject(args, 0);
  const outfitId = mp.getIdFromDesc(outfit.desc);
  const espmRecord = mp.lookupEspmRecordById(outfitId);
  const inam = (_b = (_a = espmRecord.record) === null || _a === void 0 ? void 0 : _a.fields.find(x => x.type === 'INAM')) === null || _b === void 0 ? void 0 : _b.data;

  if (inam) {
    const dt = new DataView(inam.buffer);

    for (let index = 0; index < inam.length; index += 4) {
      const itemId = dt.getUint32(index, true);
      const form = game_1.getForm(mp, null, [itemId]);

      if (form) {
        const countExist = mp.callPapyrusFunction('method', 'ObjectReference', 'GetItemCount', self, [form]);

        if (countExist === 0) {
          mp.callPapyrusFunction('method', 'ObjectReference', 'AddItem', self, [form, 1, true]);
        }

        equip_1.unequipItem(mp, self, [form, false, true]);
        equip_1.equipItem(mp, self, [form, false, true]);
      }
    }
  }

  const sleepOutfit = papyrusArgs_1.getBoolean(args, 1);

  const func = (ctx, outfitId, sleepOutfit) => {
    ctx.sp.once('update', () => __awaiter(void 0, void 0, void 0, function* () {
      if (!ctx.refr) return;
      const ac = ctx.sp.Actor.from(ctx.refr);
      if (!ac) return;
      const outfit = ctx.sp.Game.getForm(outfitId);
      if (!outfit) return;
      ac.setOutfit(ctx.sp.Outfit.from(outfit), sleepOutfit);
    }));
  };

  eval_1.evalClient(mp, selfId, new functionInfo_1.FunctionInfo(func).getText({
    outfitId,
    sleepOutfit
  }), true);
};

const setRace = (mp, self, args) => {
  const selfId = mp.getIdFromDesc(self.desc);
  const race = papyrusArgs_1.getObject(args, 0);
  const raceId = mp.getIdFromDesc(race.desc);
  mp.set(selfId, 'race', raceId);
  const espmRecord = mp.lookupEspmRecordById(raceId);
  const hp = race_1.getRaceHealth(espmRecord);
  const stamina = race_1.getRaceStamina(espmRecord);
  attributes_1.actorValues.set(selfId, 'health', 'base', hp);
  attributes_1.actorValues.set(selfId, 'stamina', 'base', stamina);
};

const getRace = (mp, self) => {
  const selfId = mp.getIdFromDesc(self.desc);
  const raceId = mp.get(selfId, 'race');
  if (!raceId) return;
  return game_1.getForm(mp, null, [raceId]);
};

const setWorldOrCell = (mp, selfNull, args) => {
  const self = papyrusArgs_1.getObject(args, 0);
  const selfId = mp.getIdFromDesc(self.desc);
  const worldOrCell = papyrusArgs_1.getNumber(args, 1);
  mp.set(selfId, 'worldOrCellDesc', mp.getDescFromId(worldOrCell));
};

const _throwOut = (mp, self) => {
  const selfId = mp.getIdFromDesc(self.desc);
  console.log('npc remove', selfId, objectReference_1.getDisplayName(mp, self));
  exports.throwOutById(mp, selfId);
};

const throwOut = (mp, selfNull, args) => {
  const self = papyrusArgs_1.getObject(args, 0);

  _throwOut(mp, self);
};

const throwOutById = (mp, selfId) => {
  mp.set(selfId, 'pos', [-99999, -99999, -99999]);
  mp.set(selfId, 'isDead', true);

  try {
    attributes_1.actorValues.set(selfId, 'health', 'base', 0);
  } catch (_a) {}

  try {
    mp.set(selfId, 'isDisabled', true);
  } catch (_b) {}

  mp.set(selfId, 'worldOrCellDesc', '0');
};

exports.throwOutById = throwOutById;

const register = mp => {
  mp.registerPapyrusFunction('method', 'Actor', 'AddPerk', (self, args) => perk_1.addPerk(mp, self, args));
  mp.registerPapyrusFunction('method', 'Actor', 'RemovePerk', (self, args) => perk_1.removePerk(mp, self, args));
  mp.registerPapyrusFunction('method', 'Actor', 'HasPerk', (self, args) => perk_1.hasPerk(mp, self, args));
  mp.registerPapyrusFunction('method', 'Actor', 'IsEquipped', (self, args) => equip_1.isEquipped(mp, self, args));
  mp.registerPapyrusFunction('method', 'Actor', 'EquipItem', (self, args) => equip_1.equipItem(mp, self, args));
  mp.registerPapyrusFunction('method', 'Actor', 'UnequipItem', (self, args) => equip_1.unequipItem(mp, self, args));
  mp.registerPapyrusFunction('method', 'Actor', 'UnequipAll', self => equip_1.unequipAll(mp, self));
  mp.registerPapyrusFunction('method', 'Actor', 'UnequipItemSlot', (self, args) => equip_1.unequipItemSlot(mp, self, args));
  mp.registerPapyrusFunction('method', 'Actor', 'GetEquippedObject', (self, args) => equip_1.getEquippedObject(mp, self, args));
  mp.registerPapyrusFunction('method', 'Actor', 'GetEquippedArmorInSlot', (self, args) => equip_1.getEquippedArmorInSlot(mp, self, args));
  mp.registerPapyrusFunction('method', 'Actor', 'GetEquippedShield', self => equip_1.getEquippedShield(mp, self));
  mp.registerPapyrusFunction('method', 'Actor', 'GetEquippedWeapon', (self, args) => equip_1.getEquippedWeapon(mp, self, args));
  mp.registerPapyrusFunction('method', 'Actor', 'SetActorValue', (self, args) => value_1.setActorValue(mp, self, args));
  mp.registerPapyrusFunction('method', 'Actor', 'SetAV', (self, args) => value_1.setActorValue(mp, self, args));
  mp.registerPapyrusFunction('method', 'Actor', 'GetActorValue', (self, args) => value_1.getActorValue(mp, self, args));
  mp.registerPapyrusFunction('method', 'Actor', 'GetAV', (self, args) => value_1.getActorValue(mp, self, args));
  mp.registerPapyrusFunction('method', 'Actor', 'DamageActorValue', (self, args) => value_1.damageActorValue(mp, self, args));
  mp.registerPapyrusFunction('method', 'Actor', 'DamageAV', (self, args) => value_1.damageActorValue(mp, self, args));
  mp.registerPapyrusFunction('method', 'Actor', 'RestoreActorValue', (self, args) => value_1.restoreActorValue(mp, self, args));
  mp.registerPapyrusFunction('method', 'Actor', 'RestoreAV', (self, args) => value_1.restoreActorValue(mp, self, args));
  mp.registerPapyrusFunction('method', 'Actor', 'IsWeaponDrawn', self => isWeaponDrawn(mp, self));
  mp.registerPapyrusFunction('method', 'Actor', 'IsDead', self => isDead(mp, self));
  mp.registerPapyrusFunction('method', 'Actor', 'SetOutfit', (self, args) => setOutfit(mp, self, args));
  mp.registerPapyrusFunction('method', 'Actor', 'SetRace', (self, args) => setRace(mp, self, args));
  mp.registerPapyrusFunction('method', 'Actor', 'GetRace', self => getRace(mp, self));
  mp.registerPapyrusFunction('global', 'ActorEx', 'AddSkillExperience', (self, args) => value_1.addSkillExperience(mp, self, args));
  mp.registerPapyrusFunction('global', 'ActorEx', 'GetWornForms', (self, args) => equip_1.getWornForms(mp, self, args));
  mp.registerPapyrusFunction('global', 'ActorEx', 'GetWornFormsId', (self, args) => equip_1.getWornFormsId(mp, self, args));
  mp.registerPapyrusFunction('global', 'ActorEx', 'SetWorldOrCell', (self, args) => setWorldOrCell(mp, self, args));
  mp.registerPapyrusFunction('global', 'ActorEx', 'ThrowOut', (self, args) => throwOut(mp, self, args));
};

exports.register = register;
},{"./value":"I1C7","./perk":"d40v","./equip":"lP44","../../utils/papyrusArgs":"oZY1","../../properties/eval":"mJTA","../../utils/functionInfo":"fC7F","../game":"WCBi","../../properties/actor/actorValues/attributes":"Klzq","../objectReference":"YRYD","../race":"AkNH"}],"VJVi":[function(require,module,exports) {
"use strict";

var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  Object.defineProperty(o, k2, {
    enumerable: true,
    get: function () {
      return m[k];
    }
  });
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

var __setModuleDefault = this && this.__setModuleDefault || (Object.create ? function (o, v) {
  Object.defineProperty(o, "default", {
    enumerable: true,
    value: v
  });
} : function (o, v) {
  o["default"] = v;
});

var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);

  __setModuleDefault(result, mod);

  return result;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.register = exports.throwOrInit = exports.initAVFromRace = void 0;

const game_1 = require("../papyrus/game");

const objectReference_1 = require("../papyrus/objectReference");

const attributes_1 = require("../properties/actor/actorValues/attributes");

const functionInfo_1 = require("../utils/functionInfo");

const functions_1 = require("./functions");

const empty = __importStar(require("./empty"));

const activeMagicEffect_1 = require("../papyrus/activeMagicEffect");

const equip_1 = require("../papyrus/actor/equip");

const position = __importStar(require("../papyrus/objectReference/position"));

const type_1 = require("../papyrus/weapon/type");

const form_1 = require("../papyrus/form");

const helper_1 = require("../utils/helper");

const eval_1 = require("../properties/eval");

const perk_1 = require("../papyrus/perk");

const type_2 = require("../papyrus/perk/type");

const __1 = require("../..");

const race_1 = require("../papyrus/race");

const actor_1 = require("../papyrus/actor");

const getAttrFromRace = (mp, pcFormId) => {
  var _a, _b, _c, _d, _e, _f, _g;

  const defaultReturn = {
    health: 100,
    healrate: 0,
    magicka: 100,
    magickarate: 0,
    stamina: 100,
    staminarate: 0
  };
  const selfId = mp.getIdFromDesc(mp.get(pcFormId, 'baseDesc'));
  const rec = mp.lookupEspmRecordById(selfId).record;
  if (!rec) return defaultReturn;
  const acbs = (_a = rec.fields.find(x => x.type === 'ACBS')) === null || _a === void 0 ? void 0 : _a.data;
  const magickaOffset = acbs ? helper_1.uint16(acbs.buffer, 4) : 0;
  const staminaOffset = acbs ? helper_1.uint16(acbs.buffer, 6) : 0;
  const level = acbs ? helper_1.uint16(acbs.buffer, 8) : 0;
  const healthOffset = acbs ? helper_1.uint16(acbs.buffer, 20) : 0;
  const raceId = race_1.getRaceId(mp, selfId, rec);
  if (!raceId) return defaultReturn;
  mp.set(pcFormId, 'race', raceId);
  const espmRecord = mp.lookupEspmRecordById(raceId);
  return {
    health: ((_b = race_1.getRaceHealth(espmRecord)) !== null && _b !== void 0 ? _b : 100) + healthOffset,
    healrate: (_c = race_1.getRaceHealRate(espmRecord)) !== null && _c !== void 0 ? _c : 0,
    magicka: ((_d = race_1.getRaceMagicka(espmRecord)) !== null && _d !== void 0 ? _d : 100) + magickaOffset,
    magickarate: (_e = race_1.getRaceMagickaRate(espmRecord)) !== null && _e !== void 0 ? _e : 0,
    stamina: ((_f = race_1.getRaceStamina(espmRecord)) !== null && _f !== void 0 ? _f : 100) + staminaOffset,
    staminarate: (_g = race_1.getRaceStaminaRate(espmRecord)) !== null && _g !== void 0 ? _g : 0
  };
};

const initAVFromRace = (mp, pcFormId, serverOptions) => {
  if (mp.get(pcFormId, 'isDead') !== undefined) return;

  if (!mp.get(pcFormId, 'spawnTimeToRespawn')) {
    const time = objectReference_1.getRespawnTimeById(mp, null, [pcFormId]);
    mp.set(pcFormId, 'spawnTimeToRespawn', time);
  }

  const raceAttr = getAttrFromRace(mp, pcFormId);
  attributes_1.actorValues.setDefaults(pcFormId, {
    force: true
  }, raceAttr);
};

exports.initAVFromRace = initAVFromRace;

const logExecuteTime = (startTime, eventName) => {
  if (Date.now() - startTime > 10) {
    console.log('[PERFOMANCE]', `Event ${eventName}: `, Date.now() - startTime);
  }
};

const throwOrInit = (mp, id, serverOptions) => {
  if (id < 0x5000000 && mp.get(id, 'worldOrCellDesc') !== '0') {
    actor_1.throwOutById(mp, id);
  } else if (!mp.get(id, 'spawnTimeToRespawn')) {
    try {
      exports.initAVFromRace(mp, id, serverOptions);
    } catch (err) {
      console.log('[ERROR] initAVFromRace', err);
    }
  }
};

exports.throwOrInit = throwOrInit;

const register = mp => {
  mp['_onLoadGame'] = pcFormId => {
    const start = Date.now();
    console.log('_onLoadGame', pcFormId);
    if (!pcFormId) return console.log('Plz reconnect');
    const ac = {
      type: 'form',
      desc: mp.getDescFromId(pcFormId)
    };

    const func = ctx => {
      ctx.sp.once('update', () => {
        const notify = msg => {
          var _a;

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
          const match = (_a = msg.match(countRegex)) !== null && _a !== void 0 ? _a : [];
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

    eval_1.evalClient(mp, pcFormId, new functionInfo_1.FunctionInfo(func).getText({}), true);
    mp.set(pcFormId, 'browserVisible', true);
    mp.set(pcFormId, 'browserModal', false);

    const serverOptions = __1.serverOptionProvider.getServerOptions();

    exports.initAVFromRace(mp, pcFormId, serverOptions);
    const neighbors = mp.get(pcFormId, 'neighbors');
    neighbors.filter(n => mp.get(n, 'type') === 'MpActor').forEach(id => {
      exports.throwOrInit(mp, id, serverOptions);
    });
    mp.callPapyrusFunction('global', 'GM_Main', '_OnLoadGame', null, [ac]);
    logExecuteTime(start, '_onLoadGame');
  };

  mp['onActivate'] = (target, pcFormId) => {
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

    try {
      if (mp.get(target, 'blockActivationState')) return false;
    } catch (_a) {}

    const actiovation = mp.callPapyrusFunction('global', 'GM_Main', '_onActivate', null, [targetRef, casterRef]);
    logExecuteTime(start, 'onActivate');
    return actiovation !== null && actiovation !== void 0 ? actiovation : true;
  };

  mp.makeEventSource('_onCellChange', new functionInfo_1.FunctionInfo(functions_1.onCellChange).body);

  mp['_onCellChange'] = (pcFormId, event) => {
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

    const serverOptions = __1.serverOptionProvider.getServerOptions();

    neighbors.filter(n => mp.get(n, 'type') === 'MpActor').forEach(id => {
      exports.throwOrInit(mp, id, serverOptions);
    });
    mp.set(pcFormId, 'cellDesc', currentCell.desc);
    mp.callPapyrusFunction('global', 'GM_Main', '_onCellChange', null, [ac, prevCell, currentCell]);
    logExecuteTime(start, '_onCellChange');
  };

  mp.makeEventSource('_onHit', new functionInfo_1.FunctionInfo(functions_1.onHit).getText({
    isHitStatic: false
  }));

  mp['_onHit'] = (pcFormId, event) => {
    const start = Date.now();
    if (!pcFormId) return console.log('Plz reconnect');

    if (event.target === 0x14) {
      event.target = pcFormId;
    }

    if (event.agressor === 0x14) {
      event.agressor = pcFormId;
    }

    const {
      HitDamageMod,
      isPowerAttackMult,
      isBashAttackMult
    } = __1.serverOptionProvider.getServerOptions();

    const target = {
      type: 'form',
      desc: mp.getDescFromId(event.target)
    };
    const agressor = {
      type: 'form',
      desc: mp.getDescFromId(event.agressor)
    };
    let damageMod = HitDamageMod;
    const raceId = mp.get(pcFormId, 'race');

    if (raceId) {
      const espmRecord = mp.lookupEspmRecordById(raceId);
      const unarmedDamage = race_1.getRaceUnarmedDamage(espmRecord);
      unarmedDamage && (damageMod = -unarmedDamage);
    }

    const eq = equip_1.getEquipment(mp, event.agressor);
    const eq1 = equip_1.getEquipment(mp, event.target);
    const weap = eq === null || eq === void 0 ? void 0 : eq.inv.entries.filter(x => x.type === 'WEAP');
    const arm = eq1 === null || eq1 === void 0 ? void 0 : eq1.inv.entries.filter(x => x.type === 'ARMO');
    let isHammer = false;

    if (weap && weap.length > 0) {
      const baseDmg = weap[0].baseDamage;
      baseDmg && (damageMod = baseDmg * -1);
      const type = weap[0].weaponType;
      if (type === type_1.WeaponType.BattleaxesANDWarhammers || type === type_1.WeaponType.Maces) isHammer = true;
    }

    if (arm && arm.length > 0) {
      arm.forEach(x => {
        if (!x.baseArmor) return;
        if (isHammer) x.baseArmor * 0.75;
        const percent = 1 - x.baseArmor / 1000;
        damageMod = damageMod * percent;
      });
    }

    if (event.isPowerAttack) {
      damageMod = damageMod * isPowerAttackMult;
    }

    if (event.isBashAttack) {
      damageMod = damageMod * isBashAttackMult;
    }

    const calcPerks = false;

    if (calcPerks) {
      const targetId = form_1.getSelfId(mp, agressor.desc);
      const rec = mp.lookupEspmRecordById(targetId).record;
      const prkr = rec === null || rec === void 0 ? void 0 : rec.fields.filter(x => x.type === 'PRKR').map(x => x.data);

      try {
        prkr === null || prkr === void 0 ? void 0 : prkr.forEach(p => {
          const perkId = helper_1.uint32(p.buffer, 0);
          const effectData = perk_1.getPerkEffectData(mp, perkId);
          effectData === null || effectData === void 0 ? void 0 : effectData.forEach(eff => {
            if (!eff) return;

            if (eff.effectType === 0x23 && eff.functionType === type_2.EffectFunctionType.MultiplyValue) {
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
    const damage = attributes_1.actorValues.get(event.target, avName, 'damage');
    const newDamageModValue = damage + damageMod;
    attributes_1.actorValues.set(event.target, avName, 'damage', newDamageModValue);
    const wouldDie = attributes_1.actorValues.getMaximum(event.target, avName) + newDamageModValue <= 0;

    if (wouldDie && !mp.get(event.target, 'isDead')) {
      mp.onDeath && mp.onDeath(event.target);
    }

    mp.callPapyrusFunction('global', 'GM_Main', '_onHit', null, [target, agressor, event.isPowerAttack, event.isSneakAttack, event.isBashAttack, event.isHitBlocked]);
    logExecuteTime(start, '_onHit');
  };

  mp['onDeath'] = pcFormId => {
    const start = Date.now();
    const ac = {
      type: 'form',
      desc: mp.getDescFromId(pcFormId)
    };
    console.log(`${pcFormId.toString(16)} died`);
    mp.set(pcFormId, 'isDead', true);
    mp.callPapyrusFunction('global', 'GM_Main', '_onDeath', null, [ac]);
    logExecuteTime(start, 'onDeath');
  };

  mp.makeEventSource('_onHitStatic', new functionInfo_1.FunctionInfo(functions_1.onHit).getText({
    isHitStatic: true
  }));

  mp['_onHitStatic'] = (pcFormId, event) => {
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
    logExecuteTime(start, '_onHitStatic');
  };

  mp.makeEventSource('_onEquip', new functionInfo_1.FunctionInfo(functions_1.onEquip).tryCatch());

  mp['_onEquip'] = (pcFormId, event) => {
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
    logExecuteTime(start, '_onEquip');
  };

  mp['onUiEvent'] = (pcFormId, uiEvent) => {
    const start = Date.now();
    if (!pcFormId) return console.log('Plz reconnect');

    switch (uiEvent.type) {
      case 'cef::chat:send':
        {
          const text = uiEvent.data;

          if (typeof text === 'string') {
            const ac = {
              type: 'form',
              desc: mp.getDescFromId(pcFormId)
            };
            mp.callPapyrusFunction('global', 'GM_Main', '_OnChatInput', null, [ac, text]);
          }
        }
    }

    logExecuteTime(start, 'onUiEvent');
  };

  mp.makeEventSource('_onInput', new functionInfo_1.FunctionInfo(functions_1.onInput).tryCatch());

  mp['_onInput'] = (pcFormId, keycodes) => {
    var _a, _b;

    const start = Date.now();
    if (!pcFormId) return console.log('Plz reconnect');
    const ac = {
      type: 'form',
      desc: mp.getDescFromId(pcFormId)
    };
    mp.callPapyrusFunction('global', 'GM_Main', '_OnInput', null, [ac, keycodes]);

    const {
      keybindingBrowserSetVisible,
      keybindingBrowserSetFocused,
      command1,
      command2,
      command3,
      command4,
      command5,
      command0,
      command6,
      command7,
      command8,
      command9
    } = __1.serverOptionProvider.getServerOptions();

    if (!mp.get(pcFormId, 'browserModal')) {
      if (keycodes.length === 1 && keycodes[0] === keybindingBrowserSetVisible) {
        mp.callPapyrusFunction('global', 'M', 'BrowserSetVisible', null, [ac, (_a = !mp.get(pcFormId, 'browserVisible')) !== null && _a !== void 0 ? _a : true]);
      }

      if (keycodes.length === 1 && keycodes[0] === keybindingBrowserSetFocused) {
        mp.callPapyrusFunction('global', 'M', 'BrowserSetFocused', null, [ac, (_b = !mp.get(pcFormId, 'browserFocused')) !== null && _b !== void 0 ? _b : true]);
      }
    }

    const getCommand = () => {
      if (keycodes.includes(56) && keycodes.includes(0x02)) {
        return command1;
      } else if (keycodes.includes(56) && keycodes.includes(0x03)) {
        return command2;
      } else if (keycodes.includes(56) && keycodes.includes(0x04)) {
        return command3;
      } else if (keycodes.includes(56) && keycodes.includes(0x05)) {
        return command4;
      } else if (keycodes.includes(56) && keycodes.includes(0x06)) {
        return command5;
      } else if (keycodes.includes(56) && keycodes.includes(0x07)) {
        return command6;
      } else if (keycodes.includes(56) && keycodes.includes(0x08)) {
        return command7;
      } else if (keycodes.includes(56) && keycodes.includes(0x09)) {
        return command8;
      } else if (keycodes.includes(56) && keycodes.includes(0x0a)) {
        return command9;
      } else if (keycodes.includes(56) && keycodes.includes(0x0b)) {
        return command0;
      }

      return;
    };

    const command = getCommand();

    if (command) {
      mp.callPapyrusFunction('global', 'GM_Main', '_OnChatInput', null, [ac, command]);
    }

    logExecuteTime(start, '_onInput');
  };

  mp.makeEventSource('_onAnimationEvent', new functionInfo_1.FunctionInfo(functions_1.onAnimationEvent).tryCatch());

  mp['_onAnimationEvent'] = (pcFormId, animationEvent) => {
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
      } = __1.serverOptionProvider.getServerOptions();

      const eq = equip_1.getEquipment(mp, pcFormId);
      const weap = eq === null || eq === void 0 ? void 0 : eq.inv.entries.filter(x => x.type === 'WEAP');

      if (weap && weap.length > 0) {
        weap[0].weight && (HitStaminaReduce = weap[0].weight);
      }

      if (HitStaminaReduce > 0) {
        const damage = attributes_1.actorValues.get(pcFormId, stamina, 'damage');
        const newDamageModValue = damage - HitStaminaReduce;
        attributes_1.actorValues.set(pcFormId, stamina, 'damage', newDamageModValue);
      }
    }

    if (isJump) {
      const damage = attributes_1.actorValues.get(pcFormId, stamina, 'damage');
      attributes_1.actorValues.set(pcFormId, stamina, 'damage', damage - 5);
    }

    if (isFall || isJump) {
      mp.set(pcFormId, 'startZCoord', position.getPositionZ(mp, ac));
    }

    if (isJumpLand) {
      const startZCoord = mp.get(pcFormId, 'startZCoord');

      if (startZCoord) {
        const diff = startZCoord - position.getPositionZ(mp, ac);

        if (diff > 300) {
          const damage = attributes_1.actorValues.get(pcFormId, 'health', 'damage');
          const newDamageModValue = damage - diff / 100;
          attributes_1.actorValues.set(pcFormId, 'health', 'damage', newDamageModValue);
          const wouldDie = attributes_1.actorValues.getMaximum(pcFormId, 'health') + newDamageModValue <= 0;

          if (wouldDie && !mp.get(pcFormId, 'isDead')) {
            mp.onDeath && mp.onDeath(pcFormId);
          }

          isChangeHp = true;
        }
      }
    }

    mp.set(pcFormId, 'lastAnimation', animationEvent.current);
    mp.callPapyrusFunction('global', 'GM_Main', '_onAnimationEvent', null, [ac, animationEvent.current, animationEvent.previous, isAttack, isJump, isFall, isJumpLand, isChangeHp]);
    logExecuteTime(start, '_onAnimationEvent');
  };

  mp.makeEventSource('_onUiMenuToggle', new functionInfo_1.FunctionInfo(functions_1.onUiMenuToggle).tryCatch());

  mp['_onUiMenuToggle'] = (pcFormId, menuOpen) => {
    const start = Date.now();
    if (!pcFormId) return console.log('Plz reconnect');
    mp.set(pcFormId, 'uiOpened', menuOpen);
    mp.set(pcFormId, 'browserVisible', !menuOpen);
    logExecuteTime(start, '_onUiMenuToggle');
  };

  mp.makeEventSource('_onEffectStart', new functionInfo_1.FunctionInfo(functions_1.onEffectStart).tryCatch());

  mp['_onEffectStart'] = (pcFormId, event) => {
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
    const isDetrimental = activeMagicEffect_1.getFlags(mp, null, [event.effect]).includes(0x4);
    mp.callPapyrusFunction('global', 'GM_Main', '_onEffectStart', null, [caster, target, effect, event.mag * (isDetrimental ? -1 : 1)]);
    mp.callPapyrusFunction('global', 'GM_Main', '_onEffectStart2', null, [caster, target, event.effect, event.mag * (isDetrimental ? -1 : 1)]);
    logExecuteTime(start, '_onEffectStart');
  };

  mp.makeEventSource('_onCurrentCrosshairChange', new functionInfo_1.FunctionInfo(functions_1.onCurrentCrosshairChange).tryCatch());

  mp['_onCurrentCrosshairChange'] = (pcFormId, event) => {
    const start = Date.now();
    if (!pcFormId) return console.log('Plz reconnect');
    const ac = {
      type: 'form',
      desc: mp.getDescFromId(pcFormId)
    };
    const crosshairRefId = event.crosshairRefId;
    const target = crosshairRefId && game_1.getForm(mp, null, [crosshairRefId]);
    mp.set(pcFormId, 'CurrentCrosshairRef', target ? crosshairRefId : null);
    mp.callPapyrusFunction('global', 'GM_Main', '_onCurrentCrosshairChange', null, [ac, target]);
    logExecuteTime(start, '_onCurrentCrosshairChange');
  };

  mp.makeEventSource('_onPrintConsole', new functionInfo_1.FunctionInfo(functions_1.onPrintConsole).tryCatch());

  mp['_onPrintConsole'] = (pcFormId, event) => {
    console.log('[client]', '\x1b[33m', ...event, '\x1b[0m');
  };

  mp.makeEventSource('_onCloseRaceMenu', new functionInfo_1.FunctionInfo(functions_1.onCloseRaceMenu).tryCatch());

  mp['_onCloseRaceMenu'] = pcFormId => {
    console.debug('_onCloseRaceMenu', pcFormId);
    mp['_onLoadGame'](pcFormId);
  };

  mp['onDisconnectEvent'] = pcFormId => {
    console.log('disconnect', pcFormId);
  };

  empty.register(mp);
};

exports.register = register;
},{"../papyrus/game":"WCBi","../papyrus/objectReference":"YRYD","../properties/actor/actorValues/attributes":"Klzq","../utils/functionInfo":"fC7F","./functions":"dwII","./empty":"eVF9","../papyrus/activeMagicEffect":"dvBS","../papyrus/actor/equip":"lP44","../papyrus/objectReference/position":"wmVe","../papyrus/weapon/type":"Xpf2","../papyrus/form":"mnzc","../utils/helper":"FxH1","../properties/eval":"mJTA","../papyrus/perk":"Fep9","../papyrus/perk/type":"x9IM","../..":"QCba","../papyrus/race":"AkNH","../papyrus/actor":"ZYrz"}],"t0IM":[function(require,module,exports) {
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

const functionInfo_1 = require("../utils/functionInfo");

const functions_1 = require("./functions");

const attributes_1 = require("../properties/actor/actorValues/attributes");

const states = ['isSprinting', 'isWeaponDrawn', 'isDead', 'isFlying'];

const factory = stateName => {
  return new functionInfo_1.FunctionInfo(functions_1.stateChangeFactory).getText({
    stateName,
    states
  });
};

const sprintAttr = 'stamina';
const staminaReduce = 10;

const register = mp => {
  mp.makeEventSource('_onSprintStateChange', factory('isSprinting'));

  mp['_onSprintStateChange'] = (pcFormId, isSprinting) => {
    const start = Date.now();
    if (!pcFormId) return console.log('Plz reconnect');
    console.log('isSprinting', isSprinting);
    mp.set(pcFormId, 'isSprinting', isSprinting);

    if (isSprinting) {
      attributes_1.actorValues.set(pcFormId, `mp_${sprintAttr}drain`, 'base', -staminaReduce);
    } else {
      attributes_1.actorValues.set(pcFormId, `mp_${sprintAttr}drain`, 'base', 0);
    }

    console.log('Event _onSprintStateChange: ', Date.now() - start);
  };

  mp.makeEventSource('_onWeaponDrawChange', factory('isWeaponDrawn'));

  mp['_onWeaponDrawChange'] = (pcFormId, isWeaponDrawn) => {
    if (!pcFormId) return console.log('Plz reconnect');
    console.log('isWeaponDrawn', isWeaponDrawn);
    mp.set(pcFormId, 'isWeaponDrawn', isWeaponDrawn);
  };

  mp.makeEventSource('_onDead', factory('isDead'));

  mp['_onDead'] = (pcFormId, isDead) => {
    if (isDead) {
      console.log(`${pcFormId.toString(16)} died`);
    }

    mp.set(pcFormId, 'isDead', true);
  };

  mp.makeEventSource('_onFly', factory('isFlying'));

  mp['_onFly'] = (pcFormId, isFlying) => {
    if (!pcFormId) return console.log('Plz reconnect');
    console.log('isFlying', isFlying);
    mp.set(pcFormId, 'isFlying', isFlying);
  };
};

exports.register = register;
},{"../utils/functionInfo":"fC7F","./functions":"t0IM","../properties/actor/actorValues/attributes":"Klzq"}],"QfNO":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setGlobalStorageValue = exports.setGlobalStorageValueNumberArray = exports.setGlobalStorageValueNumber = exports.setGlobalStorageValueStringArray = exports.setGlobalStorageValueString = exports.getGlobalStorageValue = void 0;

const papyrusArgs_1 = require("../../utils/papyrusArgs");

const functions_1 = require("./functions");

const globalId = 0xff000000;

const getGlobalStorageValue = (mp, self, args) => {
  const key = papyrusArgs_1.getString(args, 0);
  functions_1.checkAndCreatePropertyExist(mp, globalId, key);

  try {
    return mp.get(globalId, key);
  } catch (err) {
    console.log(err);
  }
};

exports.getGlobalStorageValue = getGlobalStorageValue;

const setGlobalStorageValueString = (mp, self, args) => {
  const key = papyrusArgs_1.getString(args, 0);
  const value = papyrusArgs_1.getString(args, 1);
  exports.setGlobalStorageValue(mp, key, value);
};

exports.setGlobalStorageValueString = setGlobalStorageValueString;

const setGlobalStorageValueStringArray = (mp, self, args) => {
  const key = papyrusArgs_1.getString(args, 0);
  const value = papyrusArgs_1.getStringArray(args, 1);
  exports.setGlobalStorageValue(mp, key, value);
};

exports.setGlobalStorageValueStringArray = setGlobalStorageValueStringArray;

const setGlobalStorageValueNumber = (mp, self, args) => {
  const key = papyrusArgs_1.getString(args, 0);
  const value = papyrusArgs_1.getNumber(args, 1);
  exports.setGlobalStorageValue(mp, key, value);
};

exports.setGlobalStorageValueNumber = setGlobalStorageValueNumber;

const setGlobalStorageValueNumberArray = (mp, self, args) => {
  const key = papyrusArgs_1.getString(args, 0);
  const value = papyrusArgs_1.getNumberArray(args, 1);
  exports.setGlobalStorageValue(mp, key, value);
};

exports.setGlobalStorageValueNumberArray = setGlobalStorageValueNumberArray;

const setGlobalStorageValue = (mp, key, value) => {
  functions_1.checkAndCreatePropertyExist(mp, globalId, key);

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
exports.register = exports.localizationDefault = void 0;

const papyrusArgs_1 = require("../../utils/papyrusArgs");

const globalStorage_1 = require("./globalStorage");

const executeUiCommand = (mp, self, args) => {
  const actor = papyrusArgs_1.getObject(args, 0);
  const commandType = papyrusArgs_1.getString(args, 1);
  const argumentNames = papyrusArgs_1.getStringArray(args, 2);
  const tokens = papyrusArgs_1.getStringArray(args, 3);
  const alter = papyrusArgs_1.getString(args, 4);
  const actorId = mp.getIdFromDesc(actor.desc);
  mp.sendUiMessage(actorId, {
    type: 'COMMAND',
    data: {
      commandType: commandType,
      commandArgs: {
        argumentNames: argumentNames,
        tokens: tokens
      },
      alter: alter.split('\n')
    }
  });
};

const log = (mp, self, args) => {
  const text = papyrusArgs_1.getString(args, 0);
  console.log('[GM]', text);
};

const getText = (localization, mp, self, args) => {
  const msgId = papyrusArgs_1.getString(args, 0);
  return localization.getText(msgId);
};

const getActorsInStreamZone = (mp, self, args) => {
  const actor = papyrusArgs_1.getObject(args, 0);
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

const isPlayer = (mp, args) => mp.get(0, 'onlinePlayers').findIndex(x => x === papyrusArgs_1.getNumber(args, 0)) !== -1;

const asConvert = (mp, self, args) => papyrusArgs_1.getObject(args, 0);

const stringToInt = (mp, self, args) => +papyrusArgs_1.getString(args, 0);

const wait = (mp, self, args) => {
  const sec = papyrusArgs_1.getNumber(args, 0);
  const name = papyrusArgs_1.getString(args, 1);
  const ac = args[2] ? papyrusArgs_1.getObject(args, 2) : undefined;
  const target = args[3] ? papyrusArgs_1.getObject(args, 3) : undefined;
  const targetId = papyrusArgs_1.getNumber(args, 4);
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
  const ac = papyrusArgs_1.getObject(args, 0);
  const visible = papyrusArgs_1.getBoolean(args, 1);
  mp.set(mp.getIdFromDesc(ac.desc), 'browserVisible', visible);

  if (!visible) {
    mp.set(mp.getIdFromDesc(ac.desc), 'browserModal', false);
  }
};

const browserGetVisible = (mp, self, args) => !!mp.get(mp.getIdFromDesc(papyrusArgs_1.getObject(args, 0).desc), 'browserVisible');

const browserSetFocused = (mp, self, args) => {
  const ac = papyrusArgs_1.getObject(args, 0);
  const acId = mp.getIdFromDesc(ac.desc);
  const focused = papyrusArgs_1.getBoolean(args, 1);
  mp.set(acId, 'browserFocused', focused);

  if (!focused) {
    mp.set(acId, 'browserModal', false);
    mp.set(acId, 'chromeInputFocus', false);
  }
};

const browserGetFocused = (mp, self, args) => !!mp.get(mp.getIdFromDesc(papyrusArgs_1.getObject(args, 0).desc), 'browserFocused');

const browserSetModal = (mp, self, args) => {
  const ac = papyrusArgs_1.getObject(args, 0);
  const modal = papyrusArgs_1.getBoolean(args, 1);
  mp.set(mp.getIdFromDesc(ac.desc), 'browserModal', modal);
};

const browserGetModal = (mp, self, args) => !!mp.get(mp.getIdFromDesc(papyrusArgs_1.getObject(args, 0).desc), 'browserModal');

exports.localizationDefault = {
  getText: x => x
};

const register = (mp, localization = exports.localizationDefault) => {
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
    mp.registerPapyrusFunction('global', className, 'GetGlobalStorageValueString', (self, args) => globalStorage_1.getGlobalStorageValue(mp, self, args));
    mp.registerPapyrusFunction('global', className, 'GetGlobalStorageValueStringArray', (self, args) => globalStorage_1.getGlobalStorageValue(mp, self, args));
    mp.registerPapyrusFunction('global', className, 'GetGlobalStorageValueInt', (self, args) => globalStorage_1.getGlobalStorageValue(mp, self, args));
    mp.registerPapyrusFunction('global', className, 'GetGlobalStorageValueIntArray', (self, args) => globalStorage_1.getGlobalStorageValue(mp, self, args));
    mp.registerPapyrusFunction('global', className, 'GetGlobalStorageValueFloat', (self, args) => globalStorage_1.getGlobalStorageValue(mp, self, args));
    mp.registerPapyrusFunction('global', className, 'GetGlobalStorageValueFloatArray', (self, args) => globalStorage_1.getGlobalStorageValue(mp, self, args));
    mp.registerPapyrusFunction('global', className, 'SetGlobalStorageValueString', (self, args) => globalStorage_1.setGlobalStorageValueString(mp, self, args));
    mp.registerPapyrusFunction('global', className, 'SetGlobalStorageValueStringArray', (self, args) => globalStorage_1.setGlobalStorageValueStringArray(mp, self, args));
    mp.registerPapyrusFunction('global', className, 'SetGlobalStorageValueInt', (self, args) => globalStorage_1.setGlobalStorageValueNumber(mp, self, args));
    mp.registerPapyrusFunction('global', className, 'SetGlobalStorageValueIntArray', (self, args) => globalStorage_1.setGlobalStorageValueNumberArray(mp, self, args));
    mp.registerPapyrusFunction('global', className, 'SetGlobalStorageValueFloat', (self, args) => globalStorage_1.setGlobalStorageValueNumber(mp, self, args));
    mp.registerPapyrusFunction('global', className, 'SetGlobalStorageValueFloatArray', (self, args) => globalStorage_1.setGlobalStorageValueNumberArray(mp, self, args));
  }
};

exports.register = register;
},{"../../utils/papyrusArgs":"oZY1","./globalStorage":"QfNO"}],"ejLG":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.register = void 0;

const papyrusArgs_1 = require("../utils/papyrusArgs");

const getNthChar = (mp, self, args) => {
  const text = papyrusArgs_1.getString(args, 0);
  const index = papyrusArgs_1.getNumber(args, 1);
  return text[index];
};

const split = (mp, self, args) => {
  const text = papyrusArgs_1.getString(args, 0);
  const splitter = papyrusArgs_1.getString(args, 1);
  return text.split(splitter);
};

const substring = (mp, self, args) => {
  const s = papyrusArgs_1.getString(args, 0);
  const startIndex = papyrusArgs_1.getNumber(args, 1);
  const length = papyrusArgs_1.getNumber(args, 2);
  return s.substring(startIndex, length ? startIndex + length : undefined);
};

const match = (mp, self, args) => {
  const text = papyrusArgs_1.getString(args, 0);
  const textFind = papyrusArgs_1.getString(args, 1);
  return text.toLowerCase().includes(textFind.toLowerCase());
};

const getLength = (mp, self, args) => papyrusArgs_1.getString(args, 0).length;

const toLower = (mp, self, args) => papyrusArgs_1.getString(args, 0).toLowerCase();

const join = (mp, self, args) => papyrusArgs_1.getStringArray(args, 0).join(papyrusArgs_1.getString(args, 1));

const quotes = (mp, self, args) => `"${papyrusArgs_1.getString(args, 0)}"`;

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

const helper_1 = require("../utils/helper");

const papyrusArgs_1 = require("../utils/papyrusArgs");

const getAllIndexes = (arr, val) => {
  let indexes = [],
      i = -1;

  while ((i = arr.indexOf(val, i + 1)) != -1) {
    indexes.push(i);
  }

  return indexes;
};

const createStringArray = (mp, self, args) => {
  const size = papyrusArgs_1.getNumber(args, 0);
  const fill = papyrusArgs_1.getString(args, 1);
  return new Array(size).fill(fill);
};

const createBoolArray = (mp, self, args) => {
  const size = papyrusArgs_1.getNumber(args, 0);
  const fill = papyrusArgs_1.getBoolean(args, 1);
  return new Array(size).fill(fill);
};

const createNumberArray = (mp, self, args) => {
  const size = papyrusArgs_1.getNumber(args, 0);
  const fill = papyrusArgs_1.getNumber(args, 1);
  return new Array(size).fill(fill);
};

const createFormArray = (mp, self, args) => {
  const size = papyrusArgs_1.getNumber(args, 0);
  const fill = args[1] ? papyrusArgs_1.getObject(args, 1) : null;
  return new Array(size).fill(fill);
};

const resizeStringArray = (mp, self, args) => {
  const arr = papyrusArgs_1.getStringArray(args, 0);
  const size = papyrusArgs_1.getNumber(args, 1);

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
  const array = papyrusArgs_1.getStringArray(args, 0);
  const find = papyrusArgs_1.getString(args, 1);
  return array.findIndex(x => x === find);
};

const arrayNumberFind = (mp, self, args) => {
  const array = papyrusArgs_1.getNumberArray(args, 0);
  const find = papyrusArgs_1.getNumber(args, 1);
  return array.findIndex(x => x === find);
};

const arrayStringFindAll = (mp, self, args) => {
  const array = papyrusArgs_1.getStringArray(args, 0);
  const find = papyrusArgs_1.getString(args, 1);
  return getAllIndexes(array, find);
};

const arrayNumberFindAll = (mp, self, args) => {
  const array = papyrusArgs_1.getNumberArray(args, 0);
  const find = papyrusArgs_1.getNumber(args, 1);
  return getAllIndexes(array, find);
};

const pushStringArray = (mp, self, args) => {
  const array = papyrusArgs_1.getStringArray(args, 0);

  if (array[0] === '') {
    array.splice(0, 1);
  }

  const newValue = papyrusArgs_1.getString(args, 1);
  return [...array, newValue];
};

const pushNumberArray = (mp, self, args) => {
  const array = papyrusArgs_1.getNumberArray(args, 0);
  const newValue = papyrusArgs_1.getNumber(args, 1);
  return [...array, newValue];
};

const pushFormArray = (mp, self, args) => {
  const array = papyrusArgs_1.getObjectArray(args, 0);
  const newValue = papyrusArgs_1.getObject(args, 1);
  return [...array, newValue];
};

const unshiftStringArray = (mp, self, args) => {
  const array = papyrusArgs_1.getStringArray(args, 0);
  const newValue = papyrusArgs_1.getString(args, 1);
  return [newValue, ...array];
};

const unshiftNumberArray = (mp, self, args) => {
  const array = papyrusArgs_1.getNumberArray(args, 0);
  const newValue = papyrusArgs_1.getNumber(args, 1);
  return [newValue, ...array];
};

const unshiftFormArray = (mp, self, args) => {
  const array = papyrusArgs_1.getObjectArray(args, 0);
  const newValue = papyrusArgs_1.getObject(args, 1);
  return [newValue, ...array];
};

const spliceStringArray = (mp, self, args) => {
  var _a;

  const array = papyrusArgs_1.getStringArray(args, 0);
  const index = papyrusArgs_1.getNumber(args, 1);
  const countDeleteElements = (_a = papyrusArgs_1.getNumber(args, 2)) !== null && _a !== void 0 ? _a : 1;

  if (index >= array.length) {
    console.log('Index was outside the bounds of the array');
    return [];
  }

  array.splice(index, countDeleteElements);
  return array;
};

const spliceNumberArray = (mp, self, args) => {
  var _a;

  const array = papyrusArgs_1.getNumberArray(args, 0);
  const index = papyrusArgs_1.getNumber(args, 1);
  const countDeleteElements = (_a = papyrusArgs_1.getNumber(args, 2)) !== null && _a !== void 0 ? _a : 1;

  if (index >= array.length) {
    console.log('Index was outside the bounds of the array');
    return [];
  }

  array.splice(index, countDeleteElements);
  return array;
};

const spliceFormArray = (mp, self, args) => {
  var _a;

  const array = papyrusArgs_1.getObjectArray(args, 0);
  const index = papyrusArgs_1.getNumber(args, 1);
  const countDeleteElements = (_a = papyrusArgs_1.getNumber(args, 2)) !== null && _a !== void 0 ? _a : 1;

  if (index >= array.length) {
    console.log('Index was outside the bounds of the array');
    return [];
  }

  array.splice(index, countDeleteElements);
  return array;
};

const stringArrayToNumberArray = (mp, self, args) => papyrusArgs_1.getStringArray(args, 0).map(x => +x);

const formArrayToObjectReferenceArray = (mp, self, args) => papyrusArgs_1.getObjectArray(args, 0);

const formArrayToActorArray = (mp, self, args) => papyrusArgs_1.getObjectArray(args, 0);

const randomInt = (mp, self, args) => helper_1.randomInRange(papyrusArgs_1.getNumber(args, 0), papyrusArgs_1.getNumber(args, 1));

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

const papyrusArgs_1 = require("../utils/papyrusArgs");

const eval_1 = require("../properties/eval");

const functionInfo_1 = require("../utils/functionInfo");

let cocMarkers = null;

const centerOnCell = (mp, selfNull, args) => {
  var _a, _b;

  const self = papyrusArgs_1.getObject(args, 0);
  const selfId = mp.getIdFromDesc(self.desc);
  const cellName = papyrusArgs_1.getString(args, 1).toLowerCase();
  const cellList = JSON.parse(mp.readDataFile('coc/cell.json'));

  if (!cocMarkers) {
    cocMarkers = JSON.parse(mp.readDataFile('xelib/coc-markers.json'));
  }

  if (!cellList || !cocMarkers) return;
  const targetCellFromFile = (_a = Object.keys(cocMarkers).find(x => x.toLowerCase() === cellName)) !== null && _a !== void 0 ? _a : Object.keys(cellList).find(x => x.toLowerCase() === cellName);
  if (!targetCellFromFile) return;
  const targetPoint = (_b = cocMarkers[targetCellFromFile]) !== null && _b !== void 0 ? _b : cellList[targetCellFromFile];

  for (const key of Object.keys(targetPoint)) {
    const propName = key;
    mp.set(selfId, propName, targetPoint[propName]);
  }
};

const notification = (mp, self, args) => {
  const ac = papyrusArgs_1.getObject(args, 0);
  const acId = mp.getIdFromDesc(ac.desc);
  const msg = papyrusArgs_1.getString(args, 1);

  const func = (ctx, msg) => {
    ctx.sp.once('update', () => {
      ctx.sp.Debug.notification(msg);
    });
  };

  eval_1.evalClient(mp, acId, new functionInfo_1.FunctionInfo(func).getText({
    msg
  }));
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
  const formId = papyrusArgs_1.getNumber(args, 0);
  const data = mp.lookupEspmRecordById(formId).record;
  console.log('AboutForm: ' + JSON.stringify(data, null, 2));
};

const about = (mp, self, args) => {
  console.log('About: ' + JSON.stringify(papyrusArgs_1.getObject(args, 0), null, 2));
};

const sendClientConsole = (mp, self, args) => {
  if (!args) return;
  const message = args.toString();

  const func = ctx => {
    ctx.sp.once('update', () => {
      ctx.sp.printConsole(message);
    });
  };

  eval_1.evalClient(mp, 0xff000000, new functionInfo_1.FunctionInfo(func).getText({
    message
  }));
  return;
};

const register = mp => {
  mp.registerPapyrusFunction('global', 'DebugEx', 'CenterOnCell', (self, args) => centerOnCell(mp, self, args));
  mp.registerPapyrusFunction('global', 'DebugEx', 'Notification', (self, args) => notification(mp, self, args));
  mp.registerPapyrusFunction('global', 'DebugEx', 'ShowEspmLoad', () => showEspList(mp));
  mp.registerPapyrusFunction('global', 'DebugEx', 'AboutForm', (self, args) => aboutForm(mp, self, args));
  mp.registerPapyrusFunction('global', 'DebugEx', 'About', (self, args) => about(mp, self, args));
  mp.registerPapyrusFunction('global', 'DebugEx', 'PrintConsole', (self, args) => sendClientConsole(mp, self, args));
};

exports.register = register;
},{"../utils/papyrusArgs":"oZY1","../properties/eval":"mJTA","../utils/functionInfo":"fC7F"}],"ZKYg":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.skillList = void 0;
exports.skillList = {
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
},{}],"Ojqs":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.register = exports.getPerkTree = void 0;

const skillList_1 = require("../../properties/actor/actorValues/skillList");

const papyrusArgs_1 = require("../../utils/papyrusArgs");

const game_1 = require("../game");

const getActorValueInfoByName = (mp, self, args) => {
  const name = papyrusArgs_1.getString(args, 0);

  if (skillList_1.skillList[name]) {
    return getActorValueInfoByID(mp, self, [skillList_1.skillList[name]]);
  }
};

const getActorValueInfoByID = (mp, self, args) => {
  const formId = papyrusArgs_1.getNumber(args, 0);
  return {
    type: 'espm',
    desc: mp.getDescFromId(formId)
  };
};

const addSkillExperience = (mp, self, args) => {
  const selfId = mp.getIdFromDesc(self.desc);
  const acId = 0xff000000;
  const exp = papyrusArgs_1.getNumber(args, 0);
  const avName = 'OneHanded';
};

const getPerkTree = (mp, self, args) => {
  var _a, _b, _c;

  const skill = papyrusArgs_1.getObject(args, 0);
  const skillId = mp.getIdFromDesc(skill.desc);
  const espmRecord = mp.lookupEspmRecordById(skillId);
  if (!espmRecord.record) return '';
  const espmFields = espmRecord.record.fields;
  const perkTree = [];
  let index1 = 0,
      index2 = 0;

  while (index1 !== -1 && index2 !== -1) {
    index1 = espmFields.findIndex(x => x.type === 'PNAM');
    index2 = espmFields.findIndex(x => x.type === 'INAM');

    if (index1 !== -1 && index2 !== -1) {
      const obj = {};
      const fields = espmFields.splice(index1, index2 - index1 + 1);

      const getInt = n => {
        var _a;

        const d = (_a = fields.find(x => x.type === n)) === null || _a === void 0 ? void 0 : _a.data;
        return d && new DataView(d.buffer).getUint32(0, true);
      };

      const getFloat = n => {
        var _a;

        const d = (_a = fields.find(x => x.type === n)) === null || _a === void 0 ? void 0 : _a.data;
        return d && new DataView(d.buffer).getFloat32(0, true);
      };

      const perkId = getInt('PNAM');
      const perk = perkId && game_1.getForm(mp, null, [perkId]);
      const perkName = perk && mp.callPapyrusFunction('global', 'FormEx', 'GetName', null, [perk]);

      if (perkId === 0) {
        obj.p = null;
      } else {
        obj.p = {
          id: perkId !== null && perkId !== void 0 ? perkId : -1,
          name: (_a = perkName === null || perkName === void 0 ? void 0 : perkName.toString()) !== null && _a !== void 0 ? _a : ''
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
    name: (_b = mp.callPapyrusFunction('global', 'FormEx', 'GetName', null, [skill])) === null || _b === void 0 ? void 0 : _b.toString(),
    desc: (_c = mp.callPapyrusFunction('global', 'FormEx', 'GetDescription', null, [skill])) === null || _c === void 0 ? void 0 : _c.toString(),
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
  mp.registerPapyrusFunction('global', 'ActorValueInfoEx', 'GetPerkTree', (self, args) => exports.getPerkTree(mp, self, args));
};

exports.register = register;
},{"../../properties/actor/actorValues/skillList":"ZKYg","../../utils/papyrusArgs":"oZY1","../game":"WCBi"}],"PmOp":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.register = void 0;

const functionInfo_1 = require("../utils/functionInfo");

const papyrusArgs_1 = require("../utils/papyrusArgs");

const functions_1 = require("./multiplayer/functions");

function globalVariableUpdate(ctx, formId) {
  var _a;

  if (!ctx.refr) return;
  const ac = ctx.sp.Actor.from(ctx.refr);
  if (!ac) return;

  if (ctx.value && ctx.state['lastGlobal' + formId + 'Value'] !== ctx.value) {
    let val = ctx.value;
    val = val < 0 ? 0 : val;
    const formGlobal = ctx.sp.Game.getFormEx(formId);
    (_a = ctx.sp.GlobalVariable.from(formGlobal)) === null || _a === void 0 ? void 0 : _a.setValue(val <= 0 ? 1 : val);
    ctx.state['lastGlobal' + formId + 'Value'] = val;
  }
}

const checkGlobalProp = (mp, acId, key, formId) => {
  if (!functions_1.propertyExist(mp, acId, key)) {
    mp.makeProperty(key, {
      isVisibleByOwner: true,
      isVisibleByNeighbors: false,
      updateOwner: new functionInfo_1.FunctionInfo(globalVariableUpdate).getText({
        formId
      }),
      updateNeighbor: ''
    });
  }
};

const getValue = (mp, self, args) => {
  const ac = papyrusArgs_1.getObject(args, 0);
  const acId = mp.getIdFromDesc(ac.desc);
  const formId = papyrusArgs_1.getNumber(args, 1);
  const propKey = 'global' + formId;
  checkGlobalProp(mp, acId, propKey, formId);

  if (functions_1.propertyExist(mp, acId, propKey)) {
    return mp.get(acId, propKey);
  }

  return;
};

const setValue = (mp, self, args) => {
  const ac = papyrusArgs_1.getObject(args, 0);
  const acId = mp.getIdFromDesc(ac.desc);
  const formId = papyrusArgs_1.getNumber(args, 1);
  const value = papyrusArgs_1.getNumber(args, 2);
  const propKey = 'global' + formId;
  checkGlobalProp(mp, acId, propKey, formId);

  if (functions_1.propertyExist(mp, acId, propKey)) {
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

const helper_1 = require("../../utils/helper");

const papyrusArgs_1 = require("../../utils/papyrusArgs");

const game_1 = require("../game");

let recipes = null;
let cookingRecipe = null;

const getRecipes = (mp, self) => {
  if (!recipes) {
    recipes = JSON.parse(mp.readDataFile('xelib/COBJ.json'));
  }

  return recipes;
};

const getCookingRecipes = (mp, self) => {
  if (!cookingRecipe) {
    cookingRecipe = JSON.parse(mp.readDataFile('xelib/cooking-COBJ.json'));
  }

  return cookingRecipe;
};

const getRecipeItems = (mp, self, args) => {
  var _a;

  const id = papyrusArgs_1.getNumber(args, 0);
  const espmRecord = mp.lookupEspmRecordById(id);
  const cntoRecords = (_a = espmRecord.record) === null || _a === void 0 ? void 0 : _a.fields.filter(x => x.type === 'CNTO');

  if (cntoRecords && cntoRecords.length > 0) {
    return cntoRecords.map(rec => {
      return helper_1.uint32(rec.data.buffer, 0);
    });
  }

  return;
};

const getRecipeCraftItem = (mp, self, args) => {
  var _a, _b;

  const id = papyrusArgs_1.getNumber(args, 0);
  const espmRecord = mp.lookupEspmRecordById(id);
  const cnam = (_b = (_a = espmRecord.record) === null || _a === void 0 ? void 0 : _a.fields.find(x => x.type === 'CNAM')) === null || _b === void 0 ? void 0 : _b.data;
  if (!cnam) return;
  return helper_1.uint32(cnam.buffer, 0);
};

const getRecipeItemCount = (mp, self, args) => {
  var _a;

  const id = papyrusArgs_1.getNumber(args, 0);
  const itemId = papyrusArgs_1.getNumber(args, 1);
  const espmRecord = mp.lookupEspmRecordById(id);
  const cntoRecords = (_a = espmRecord.record) === null || _a === void 0 ? void 0 : _a.fields.filter(x => x.type === 'CNTO');
  if (!cntoRecords || cntoRecords.length === 0) return;
  const findItem = cntoRecords.find(rec => {
    return helper_1.uint32(rec.data.buffer, 0) === itemId;
  });

  if (findItem) {
    return helper_1.uint32(findItem.data.buffer, 4);
  }
};

const getResult = (mp, self) => {
  var _a, _b;

  const selfId = mp.getIdFromDesc(self.desc);
  const espmRecord = mp.lookupEspmRecordById(selfId);
  const cnam = (_b = (_a = espmRecord.record) === null || _a === void 0 ? void 0 : _a.fields.find(x => x.type === 'CNAM')) === null || _b === void 0 ? void 0 : _b.data;
  if (!cnam) return;
  const formid = helper_1.uint32(cnam.buffer, 0);
  return game_1.getForm(mp, null, [formid]);
};

const getNumIngredients = (mp, self) => {
  var _a, _b;

  const selfId = mp.getIdFromDesc(self.desc);
  const espmRecord = mp.lookupEspmRecordById(selfId);
  const cntoRecords = (_a = espmRecord.record) === null || _a === void 0 ? void 0 : _a.fields.filter(x => x.type === 'CNTO');
  return (_b = cntoRecords === null || cntoRecords === void 0 ? void 0 : cntoRecords.length) !== null && _b !== void 0 ? _b : 0;
};

const getNthIngredient = (mp, self, args) => {
  var _a;

  const selfId = mp.getIdFromDesc(self.desc);
  const index = papyrusArgs_1.getNumber(args, 0);
  const espmRecord = mp.lookupEspmRecordById(selfId);
  const cntoRecords = (_a = espmRecord.record) === null || _a === void 0 ? void 0 : _a.fields.filter(x => x.type === 'CNTO');
  if (!cntoRecords || cntoRecords.length === 0) return;
  if (index >= cntoRecords.length) return;
  const formid = helper_1.uint32(cntoRecords[index].data.buffer, 0);
  return game_1.getForm(mp, null, [formid]);
};

const getNthIngredientQuantity = (mp, self, args) => {
  var _a;

  const selfId = mp.getIdFromDesc(self.desc);
  const index = papyrusArgs_1.getNumber(args, 0);
  const espmRecord = mp.lookupEspmRecordById(selfId);
  const cntoRecords = (_a = espmRecord.record) === null || _a === void 0 ? void 0 : _a.fields.filter(x => x.type === 'CNTO');
  if (!cntoRecords || cntoRecords.length === 0) return 0;
  if (index >= cntoRecords.length) return 0;
  return helper_1.uint32(cntoRecords[index].data.buffer, 4);
};

const getWorkbenchKeyword = (mp, self) => {
  var _a, _b;

  const selfId = mp.getIdFromDesc(self.desc);
  const espmRecord = mp.lookupEspmRecordById(selfId);
  const bnam = (_b = (_a = espmRecord.record) === null || _a === void 0 ? void 0 : _a.fields.find(x => x.type === 'BNAM')) === null || _b === void 0 ? void 0 : _b.data;
  if (!bnam) return;
  const formid = helper_1.uint32(bnam.buffer, 0);
  return game_1.getForm(mp, null, [formid]);
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
  mp.registerPapyrusFunction('global', 'ConstructibleObjectEx', 'GetRecipes', self => getRecipes(mp, self));
  mp.registerPapyrusFunction('global', 'ConstructibleObjectEx', 'GetCookingRecipes', self => getCookingRecipes(mp, self));
};

exports.register = register;
},{"../../utils/helper":"FxH1","../../utils/papyrusArgs":"oZY1","../game":"WCBi"}],"SDpR":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.register = exports.equip = exports.getMagicEffects = exports.getEffectDurations = exports.getEffectAreas = exports.getEffectMagnitudes = exports.getNthEffectMagicEffect = exports.getNthEffectDuration = exports.getNthEffectArea = exports.getNthEffectMagnitude = exports.getNthEffectInfo = exports.getEffectInfo = exports.getNumEffects = exports.isPoison = exports.isFood = void 0;

const helper_1 = require("../../utils/helper");

const papyrusArgs_1 = require("../../utils/papyrusArgs");

const game_1 = require("../game");

const FLG_ManualCalc = 0x00001;
const FLG_Food = 0x00002;
const FLG_Medicine = 0x10000;
const FLG_Poison = 0x20000;

const flagExists = (mp, self, flag) => {
  var _a, _b;

  const selfId = mp.getIdFromDesc(self.desc);
  const espmRecord = mp.lookupEspmRecordById(selfId);
  const enit = (_b = (_a = espmRecord.record) === null || _a === void 0 ? void 0 : _a.fields.find(x => x.type === 'ENIT')) === null || _b === void 0 ? void 0 : _b.data;
  if (!enit) return false;
  const flags = helper_1.uint32(enit.buffer, 4);
  return !!(flags & flag);
};

const isFood = (mp, self) => flagExists(mp, self, FLG_Food);

exports.isFood = isFood;

const isPoison = (mp, self) => flagExists(mp, self, FLG_Poison);

exports.isPoison = isPoison;

const getNumEffects = (mp, self) => {
  var _a, _b, _c;

  const selfId = mp.getIdFromDesc(self.desc);
  const espmRecord = mp.lookupEspmRecordById(selfId);
  return (_c = (_b = (_a = espmRecord.record) === null || _a === void 0 ? void 0 : _a.fields.filter(x => x.type === 'EFID')) === null || _b === void 0 ? void 0 : _b.length) !== null && _c !== void 0 ? _c : 0;
};

exports.getNumEffects = getNumEffects;

const getEffectInfo = (mp, self) => {
  var _a, _b;

  const selfId = mp.getIdFromDesc(self.desc);
  const espmRecord = mp.lookupEspmRecordById(selfId);
  const efit = (_a = espmRecord.record) === null || _a === void 0 ? void 0 : _a.fields.filter(x => x.type === 'EFIT');
  const efid = (_b = espmRecord.record) === null || _b === void 0 ? void 0 : _b.fields.filter(x => x.type === 'EFID');
  if (!efit || efit.length === 0 || !efid || efid.length === 0) return [];
  return [efid, efit];
};

exports.getEffectInfo = getEffectInfo;

const getNthEffectInfo = (mp, self, args) => {
  var _a, _b;

  const selfId = mp.getIdFromDesc(self.desc);
  const index = papyrusArgs_1.getNumber(args, 0);
  const espmRecord = mp.lookupEspmRecordById(selfId);
  const efit = (_a = espmRecord.record) === null || _a === void 0 ? void 0 : _a.fields.filter(x => x.type === 'EFIT');
  const efid = (_b = espmRecord.record) === null || _b === void 0 ? void 0 : _b.fields.filter(x => x.type === 'EFID');
  if (!efit || efit.length <= index || !efid || efid.length <= index) return [];
  return [efid[index], efit[index]];
};

exports.getNthEffectInfo = getNthEffectInfo;

const getNthEffectMagnitude = (mp, self, args) => {
  const [_, efit] = exports.getNthEffectInfo(mp, self, args);
  return efit ? helper_1.float32(efit.data.buffer, 0) : 0;
};

exports.getNthEffectMagnitude = getNthEffectMagnitude;

const getNthEffectArea = (mp, self, args) => {
  const [_, efit] = exports.getNthEffectInfo(mp, self, args);
  return efit ? helper_1.uint32(efit.data.buffer, 4) : 0;
};

exports.getNthEffectArea = getNthEffectArea;

const getNthEffectDuration = (mp, self, args) => {
  const [_, efit] = exports.getNthEffectInfo(mp, self, args);
  return efit ? helper_1.uint32(efit.data.buffer, 8) : 0;
};

exports.getNthEffectDuration = getNthEffectDuration;

const getNthEffectMagicEffect = (mp, self, args) => {
  const [efid, _] = exports.getNthEffectInfo(mp, self, args);
  return efid && game_1.getForm(mp, null, [helper_1.uint32(efid.data.buffer, 0)]);
};

exports.getNthEffectMagicEffect = getNthEffectMagicEffect;

const getEffectMagnitudes = (mp, self) => {
  const [_, efit] = exports.getEffectInfo(mp, self);
  return efit ? efit.map(x => helper_1.float32(x.data.buffer, 0)) : [];
};

exports.getEffectMagnitudes = getEffectMagnitudes;

const getEffectAreas = (mp, self) => {
  const [_, efit] = exports.getEffectInfo(mp, self);
  return efit ? efit.map(x => helper_1.uint32(x.data.buffer, 4)) : [];
};

exports.getEffectAreas = getEffectAreas;

const getEffectDurations = (mp, self) => {
  const [_, efit] = exports.getEffectInfo(mp, self);
  return efit ? efit.map(x => helper_1.uint32(x.data.buffer, 8)) : [];
};

exports.getEffectDurations = getEffectDurations;

const getMagicEffects = (mp, self) => {
  const [efid, _] = exports.getEffectInfo(mp, self);
  return efid ? efid.map(x => {
    var _a;

    return (_a = game_1.getForm(mp, null, [helper_1.uint32(x.data.buffer, 0)])) !== null && _a !== void 0 ? _a : null;
  }).filter(x => x) : [];
};

exports.getMagicEffects = getMagicEffects;

const equip = (mp, self, args) => {
  var _a;

  const selfId = mp.getIdFromDesc(self.desc);
  const potionId = papyrusArgs_1.getNumber(args, 0);
  const {
    n = 0
  } = (_a = mp.get(selfId, 'ALCHequipped')) !== null && _a !== void 0 ? _a : {};
  mp.set(selfId, 'ALCHequipped', {
    n: n + 1,
    id: potionId
  });
};

exports.equip = equip;

const register = mp => {
  mp.registerPapyrusFunction('method', 'Potion', 'IsFood', self => exports.isFood(mp, self));
  mp.registerPapyrusFunction('method', 'Potion', 'IsPoison', self => exports.isPoison(mp, self));
  mp.registerPapyrusFunction('method', 'Potion', 'GetNumEffects', self => exports.getNumEffects(mp, self));
  mp.registerPapyrusFunction('method', 'Potion', 'GetNthEffectMagnitude', (self, args) => exports.getNthEffectMagnitude(mp, self, args));
  mp.registerPapyrusFunction('method', 'Potion', 'GetNthEffectArea', (self, args) => exports.getNthEffectArea(mp, self, args));
  mp.registerPapyrusFunction('method', 'Potion', 'GetNthEffectDuration', (self, args) => exports.getNthEffectDuration(mp, self, args));
  mp.registerPapyrusFunction('method', 'Potion', 'GetNthEffectMagicEffect', (self, args) => exports.getNthEffectMagicEffect(mp, self, args));
  mp.registerPapyrusFunction('method', 'Potion', 'GetEffectMagnitudes', self => exports.getEffectMagnitudes(mp, self));
  mp.registerPapyrusFunction('method', 'Potion', 'GetEffectAreas', self => exports.getEffectAreas(mp, self));
  mp.registerPapyrusFunction('method', 'Potion', 'GetEffectDurations', self => exports.getEffectDurations(mp, self));
  mp.registerPapyrusFunction('method', 'Potion', 'GetMagicEffects', self => exports.getMagicEffects(mp, self));
};

exports.register = register;
},{"../../utils/helper":"FxH1","../../utils/papyrusArgs":"oZY1","../game":"WCBi"}],"GeQ2":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.register = exports.getIdKeyword = exports.getKeyword = void 0;

const papyrusArgs_1 = require("../../utils/papyrusArgs");

let keywordAll = null;

const getKeyword = (mp, self, args) => {
  const editorId = papyrusArgs_1.getString(args, 0);

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

  return;
};

exports.getKeyword = getKeyword;

const getIdKeyword = (mp, self, args) => {
  const editorId = papyrusArgs_1.getString(args, 0);

  if (!keywordAll) {
    keywordAll = JSON.parse(mp.readDataFile('xelib/KYWD.json'));
  }

  const id = keywordAll[editorId];

  if (typeof id === 'number') {
    return id;
  }

  return;
};

exports.getIdKeyword = getIdKeyword;

const register = mp => {
  mp.registerPapyrusFunction('global', 'Keyword', 'GetKeyword', (self, args) => exports.getKeyword(mp, self, args));
  mp.registerPapyrusFunction('global', 'KeywordEx', 'GetKeyword', (self, args) => exports.getKeyword(mp, self, args));
  mp.registerPapyrusFunction('global', 'KeywordEx', 'GetIdKeyword', (self, args) => exports.getIdKeyword(mp, self, args));
};

exports.register = register;
},{"../../utils/papyrusArgs":"oZY1"}],"YH8e":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.register = exports.ceil = exports.floor = exports.max = exports.min = exports.pow = exports.sqrt = void 0;

const papyrusArgs_1 = require("../utils/papyrusArgs");

const sqrt = (mp, self, args) => Math.sqrt(papyrusArgs_1.getNumber(args, 0));

exports.sqrt = sqrt;

const pow = (mp, self, args) => Math.pow(papyrusArgs_1.getNumber(args, 0), papyrusArgs_1.getNumber(args, 1));

exports.pow = pow;

const min = (mp, self, args) => Math.min(...papyrusArgs_1.getNumberArray(args, 0));

exports.min = min;

const max = (mp, self, args) => Math.max(...papyrusArgs_1.getNumberArray(args, 0));

exports.max = max;

const floor = (mp, self, args) => Math.floor(papyrusArgs_1.getNumber(args, 0));

exports.floor = floor;

const ceil = (mp, self, args) => Math.ceil(papyrusArgs_1.getNumber(args, 0));

exports.ceil = ceil;

const register = mp => {
  mp.registerPapyrusFunction('global', 'Math', 'sqrt', (self, args) => exports.sqrt(mp, self, args));
  mp.registerPapyrusFunction('global', 'Math', 'pow', (self, args) => exports.pow(mp, self, args));
  mp.registerPapyrusFunction('global', 'Math', 'Floor', (self, args) => exports.floor(mp, self, args));
  mp.registerPapyrusFunction('global', 'Math', 'Ceiling', (self, args) => exports.ceil(mp, self, args));
  mp.registerPapyrusFunction('global', 'MathEx', 'min', (self, args) => exports.min(mp, self, args));
  mp.registerPapyrusFunction('global', 'MathEx', 'max', (self, args) => exports.max(mp, self, args));
};

exports.register = register;
},{"../utils/papyrusArgs":"oZY1"}],"pZ4P":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.register = exports.getHitShader = exports.getHitShaderId = void 0;

const helper_1 = require("../utils/helper");

const papyrusArgs_1 = require("../utils/papyrusArgs");

const game_1 = require("./game");

const getHitShaderId = (mp, selfNull, args) => {
  var _a;

  const self = papyrusArgs_1.getObject(args, 0);
  const selfId = mp.getIdFromDesc(self.desc);
  const rec = mp.lookupEspmRecordById(selfId).record;
  if (!rec) return null;
  const data = (_a = rec.fields.find(x => x.type === 'DATA')) === null || _a === void 0 ? void 0 : _a.data;
  if (!data) return null;
  return helper_1.uint32(data.buffer, 0x20);
};

exports.getHitShaderId = getHitShaderId;

const getHitShader = (mp, self) => {
  var _a;

  const hitShaderId = exports.getHitShaderId(mp, null, [self]);
  if (!hitShaderId) return null;
  return (_a = game_1.getForm(mp, null, [hitShaderId])) !== null && _a !== void 0 ? _a : null;
};

exports.getHitShader = getHitShader;

const register = mp => {
  mp.registerPapyrusFunction('method', 'MagicEffect', 'GetHitShader', self => exports.getHitShader(mp, self));
  mp.registerPapyrusFunction('global', 'MagicEffectEx', 'GetHitShaderId', (self, args) => exports.getHitShaderId(mp, self, args));
};

exports.register = register;
},{"../utils/helper":"FxH1","../utils/papyrusArgs":"oZY1","./game":"WCBi"}],"jRUP":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.register = exports.play = void 0;

const papyrusArgs_1 = require("../utils/papyrusArgs");

const _play = (mp, selfId, refId, duration) => {
  var _a;

  const {
    n = 0
  } = (_a = mp.get(refId, 'activeShader')) !== null && _a !== void 0 ? _a : {};
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
  const ref = papyrusArgs_1.getObject(args, 0);
  const refId = mp.getIdFromDesc(ref.desc);
  const duration = papyrusArgs_1.getNumber(args, 1);

  _play(mp, selfId, refId, duration);
};

exports.play = play;

const register = mp => {
  mp.registerPapyrusFunction('method', 'EffectShader', 'Play', (self, args) => exports.play(mp, self, args));
};

exports.register = register;
},{"../utils/papyrusArgs":"oZY1"}],"zBNb":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.register = exports.playEx = exports.play = void 0;

const papyrusArgs_1 = require("../utils/papyrusArgs");

const _play = (mp, selfId, refId, duration, facingRefId) => {
  var _a;

  const {
    n = 0
  } = (_a = mp.get(refId, 'activeVisualEffect')) !== null && _a !== void 0 ? _a : {};
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
  const ref = papyrusArgs_1.getObject(args, 0);
  const refId = mp.getIdFromDesc(ref.desc);
  const facingRef = papyrusArgs_1.getObject(args, 0);
  const facingRefId = mp.getIdFromDesc(facingRef.desc);
  const duration = papyrusArgs_1.getNumber(args, 1);

  _play(mp, selfId, refId, duration, facingRefId);
};

exports.play = play;

const playEx = (mp, selfNull, args) => {
  const self = papyrusArgs_1.getObject(args, 0);
  const selfId = mp.getIdFromDesc(self.desc);
  const ref = papyrusArgs_1.getObject(args, 1);
  const refId = mp.getIdFromDesc(ref.desc);
  const duration = papyrusArgs_1.getNumber(args, 2);
  const facingRef = papyrusArgs_1.getObject(args, 3);
  const facingRefId = mp.getIdFromDesc(facingRef.desc);

  _play(mp, selfId, refId, duration, facingRefId);
};

exports.playEx = playEx;

const register = mp => {
  mp.registerPapyrusFunction('method', 'VisualEffect', 'Play', (self, args) => exports.play(mp, self, args));
  mp.registerPapyrusFunction('global', 'VisualEffectEx', 'Play', (self, args) => exports.playEx(mp, self, args));
};

exports.register = register;
},{"../utils/papyrusArgs":"oZY1"}],"b09m":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.register = void 0;

const functionInfo_1 = require("../utils/functionInfo");

const helper_1 = require("../utils/helper");

function perksUpdate(ctx, isEqual) {
  var _a, _b, _c;

  if (!ctx.refr) return;
  const ac = ctx.sp.Actor.from(ctx.refr);
  if (!ac) return;

  if (ctx.value && ((_a = ctx.value) === null || _a === void 0 ? void 0 : _a.length) !== ((_b = ctx.state.lastPerks) === null || _b === void 0 ? void 0 : _b.length)) {
    const lastPerks = (_c = ctx.state.lastPerks) !== null && _c !== void 0 ? _c : [];
    lastPerks.filter(x => {
      var _a;

      return !((_a = ctx.value) === null || _a === void 0 ? void 0 : _a.includes(x));
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
    updateOwner: new functionInfo_1.FunctionInfo(perksUpdate).getText({
      isEqual: helper_1.isArrayEqual
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

const functions_1 = require("../papyrus/multiplayer/functions");

const functionInfo_1 = require("../utils/functionInfo");

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
    updateOwner: new functionInfo_1.FunctionInfo(browserVisibleUpdate).tryCatch(),
    updateNeighbor: ''
  });
  mp.makeProperty('browserFocused', {
    isVisibleByOwner: true,
    isVisibleByNeighbors: false,
    updateOwner: new functionInfo_1.FunctionInfo(browserFocusedUpdate).tryCatch(),
    updateNeighbor: ''
  });
  functions_1.statePropFactory(mp, 'browserModal');
  functions_1.statePropFactory(mp, 'uiOpened');
  functions_1.statePropFactory(mp, 'chromeInputFocus');
};

exports.register = register;
},{"../papyrus/multiplayer/functions":"zNfc","../utils/functionInfo":"fC7F"}],"lucm":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.register = void 0;

const functionInfo_1 = require("../utils/functionInfo");

const blockActivation = ctx => {
  if (!ctx.refr) return;
  if (ctx.value === undefined || ctx.state.lastBlockActivationState === ctx.value) return;
  ctx.refr.blockActivation(ctx.value);
  ctx.state.lastBlockActivationState = ctx.value;
};

const register = mp => {
  mp.makeProperty('blockActivationState', {
    isVisibleByOwner: true,
    isVisibleByNeighbors: true,
    updateOwner: new functionInfo_1.FunctionInfo(blockActivation).tryCatch(),
    updateNeighbor: new functionInfo_1.FunctionInfo(blockActivation).tryCatch()
  });
};

exports.register = register;
},{"../utils/functionInfo":"fC7F"}],"QHL1":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.avUpdateExp = exports.avUpdateRestore = exports.avUpdateDamage = exports.avUpdate = void 0;

function avUpdate(ctx, avName) {
  if (ctx.refr && ctx.value !== undefined && ctx.state[`last${avName}Value`] !== ctx.value) {
    const ac = ctx.sp.Actor.from(ctx.refr);
    if (!ac) return;
    ac.setActorValue(avName, ctx.value);
    ctx.state[`last${avName}Value`] = ctx.value;
  }
}

exports.avUpdate = avUpdate;

function avUpdateDamage(ctx, avName) {
  if (ctx.refr && ctx.value !== undefined && ctx.state[`last${avName}ValueDamage`] !== ctx.value) {
    const ac = ctx.sp.Actor.from(ctx.refr);
    if (!ac) return;
    ac.damageActorValue(avName, ctx.value);
    ctx.state[`last${avName}ValueDamage`] = ctx.value;
  }
}

exports.avUpdateDamage = avUpdateDamage;

function avUpdateRestore(ctx, avName) {
  if (ctx.refr && ctx.value !== undefined && ctx.state[`last${avName}ValueRestore`] !== ctx.value) {
    const ac = ctx.sp.Actor.from(ctx.refr);
    if (!ac) return;
    ac.restoreActorValue(avName, ctx.value);
    ctx.state[`last${avName}ValueRestore`] = ctx.value;
  }
}

exports.avUpdateRestore = avUpdateRestore;

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

exports.avUpdateExp = avUpdateExp;
},{}],"kcSw":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.register = void 0;

const functionInfo_1 = require("../../../utils/functionInfo");

const functions_1 = require("./functions");

const skillList_1 = require("./skillList");

const register = mp => {
  Object.keys(skillList_1.skillList).forEach(avName => {
    mp.makeProperty(`av${avName}`, {
      isVisibleByOwner: true,
      isVisibleByNeighbors: false,
      updateOwner: new functionInfo_1.FunctionInfo(functions_1.avUpdate).getText({
        avName
      }),
      updateNeighbor: ''
    });
    mp.makeProperty(`av${avName}Exp`, {
      isVisibleByOwner: true,
      isVisibleByNeighbors: false,
      updateOwner: new functionInfo_1.FunctionInfo(functions_1.avUpdateExp).getText({
        avName
      }),
      updateNeighbor: ''
    });
    mp.makeProperty(`av${avName}Damage`, {
      isVisibleByOwner: true,
      isVisibleByNeighbors: false,
      updateOwner: new functionInfo_1.FunctionInfo(functions_1.avUpdateDamage).getText({
        avName
      }),
      updateNeighbor: ''
    });
  });
};

exports.register = register;
},{"../../../utils/functionInfo":"fC7F","./functions":"QHL1","./skillList":"ZKYg"}],"TBbX":[function(require,module,exports) {
"use strict";

var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  Object.defineProperty(o, k2, {
    enumerable: true,
    get: function () {
      return m[k];
    }
  });
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

var __setModuleDefault = this && this.__setModuleDefault || (Object.create ? function (o, v) {
  Object.defineProperty(o, "default", {
    enumerable: true,
    value: v
  });
} : function (o, v) {
  o["default"] = v;
});

var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);

  __setModuleDefault(result, mod);

  return result;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.register = void 0;

const functions_1 = require("../../papyrus/multiplayer/functions");

const functionInfo_1 = require("../../utils/functionInfo");

const attributes = __importStar(require("./actorValues/attributes"));

const skill = __importStar(require("./actorValues/skill"));

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

    if (die) {
      const pos = [ac.getPositionX(), ac.getPositionY(), ac.getPositionZ()];

      for (let i = 0; i < 200; ++i) {
        const randomActor = ctx.sp.Game.findRandomActor(pos[0], pos[1], pos[2], 10000);
        if (!randomActor) continue;
        const tgt = randomActor.getCombatTarget();
        if (!tgt || (tgt === null || tgt === void 0 ? void 0 : tgt.getFormID()) !== 0x14) continue;
        randomActor.stopCombat();
      }

      ac.pushActorAway(ac, 0);
    } else {}

    ctx.state.value = value;
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
  functions_1.statePropFactory(mp, 'isWeaponDrawn');
  functions_1.statePropFactory(mp, 'isSprinting');
  functions_1.statePropFactory(mp, 'CurrentCrosshairRef');
  functions_1.statePropFactory(mp, 'isFlying');
  functions_1.statePropFactory(mp, 'isBlocking');
  functions_1.statePropFactory(mp, 'startZCoord');
  mp.makeProperty('isDead', {
    isVisibleByOwner: true,
    isVisibleByNeighbors: true,
    updateNeighbor: new functionInfo_1.FunctionInfo(updateNeighborIsDead).tryCatch(),
    updateOwner: new functionInfo_1.FunctionInfo(updateOwnerIsDead).tryCatch()
  });
  mp.makeProperty('race', {
    isVisibleByOwner: true,
    isVisibleByNeighbors: true,
    updateNeighbor: new functionInfo_1.FunctionInfo(updateRace).tryCatch(),
    updateOwner: new functionInfo_1.FunctionInfo(updateRace).tryCatch()
  });
};

exports.register = register;
},{"../../papyrus/multiplayer/functions":"zNfc","../../utils/functionInfo":"fC7F","./actorValues/attributes":"Klzq","./actorValues/skill":"kcSw"}],"hqDV":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.register = void 0;

const functions_1 = require("../papyrus/multiplayer/functions");

const register = mp => {
  functions_1.statePropFactory(mp, 'keybinding_browserSetModal');
  functions_1.statePropFactory(mp, 'keybinding_browserSetVisible');
  functions_1.statePropFactory(mp, 'keybinding_browserSetFocused');
};

exports.register = register;
},{"../papyrus/multiplayer/functions":"zNfc"}],"HQ1N":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.register = void 0;

const functions_1 = require("../../papyrus/multiplayer/functions");

const functionInfo_1 = require("../../utils/functionInfo");

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
    ctx.sp.printConsole(ref.getFormID(), ctx.value);
    ref.setOpen(ctx.value);
    ctx.state.lastOpenState = ctx.value;
  }
};

const activeShader = ctx => {
  var _a;

  if (ctx.refr && ctx.value !== undefined && ctx.state.lastActiveShaderExecN !== ctx.value.n) {
    ctx.state.lastActiveShaderExecN = ctx.value.n;
    if (!ctx.value.n || !ctx.value.id) return;
    const ref = ctx.sp.ObjectReference.from(ctx.refr);
    if (!ref) return;
    const effForm = ctx.sp.Game.getFormEx(ctx.value.id);
    if (!effForm) return;
    const eff = ctx.sp.EffectShader.from(effForm);
    if (!eff) return;
    eff.play(ref, (_a = ctx.value.duration) !== null && _a !== void 0 ? _a : 0);
  }
};

const activeVisualEffect = ctx => {
  var _a;

  if (ctx.refr && ctx.value !== undefined && ctx.state.lastActiveVisualEffectExecN !== ctx.value.n) {
    ctx.state.lastActiveVisualEffectExecN = ctx.value.n;
    if (!ctx.value.n || !ctx.value.id) return;
    const ref = ctx.sp.ObjectReference.from(ctx.refr);
    if (!ref) return;
    const effForm = ctx.sp.Game.getFormEx(ctx.value.id);
    if (!effForm) return;
    const eff = ctx.sp.VisualEffect.from(effForm);
    if (!eff) return;
    eff.play(ref, (_a = ctx.value.duration) !== null && _a !== void 0 ? _a : 0, ref);
  }
};

const ALCHequipped = ctx => {
  if (ctx.refr && ctx.value !== undefined && ctx.state.lastALCHequippedExecN !== ctx.value.n) {
    ctx.state.lastALCHequippedExecN = ctx.value.n;
    if (!ctx.value.n || !ctx.value.id) return;
    const ac = ctx.sp.Actor.from(ctx.refr);
    if (!ac) return;
    const item = ctx.sp.Game.getFormEx(ctx.value.id);
    ctx.sp.printConsole(Date.now(), ctx.getFormIdInServerFormat(ac.getFormID()).toString(16));
    ac.equipItem(item, false, true);
  }
};

const register = mp => {
  mp.makeProperty('displayName', {
    isVisibleByOwner: true,
    isVisibleByNeighbors: true,
    updateOwner: new functionInfo_1.FunctionInfo(displayNameUpdate).tryCatch(),
    updateNeighbor: new functionInfo_1.FunctionInfo(displayNameUpdate).tryCatch()
  });
  mp.makeProperty('currentDestructionStage', {
    isVisibleByOwner: true,
    isVisibleByNeighbors: true,
    updateOwner: new functionInfo_1.FunctionInfo(setObjectDamageStage).tryCatch(),
    updateNeighbor: new functionInfo_1.FunctionInfo(setObjectDamageStage).tryCatch()
  });
  functions_1.statePropFactory(mp, 'cellDesc');
  mp.makeProperty('openState', {
    isVisibleByOwner: true,
    isVisibleByNeighbors: true,
    updateOwner: new functionInfo_1.FunctionInfo(setOpenState).tryCatch(),
    updateNeighbor: new functionInfo_1.FunctionInfo(setOpenState).tryCatch()
  });
  mp.makeProperty('activeShader', {
    isVisibleByOwner: true,
    isVisibleByNeighbors: true,
    updateOwner: new functionInfo_1.FunctionInfo(activeShader).tryCatch(),
    updateNeighbor: new functionInfo_1.FunctionInfo(activeShader).tryCatch()
  });
  mp.makeProperty('activeVisualEffect', {
    isVisibleByOwner: true,
    isVisibleByNeighbors: true,
    updateOwner: new functionInfo_1.FunctionInfo(activeVisualEffect).tryCatch(),
    updateNeighbor: new functionInfo_1.FunctionInfo(activeVisualEffect).tryCatch()
  });
  mp.makeProperty('ALCHequipped', {
    isVisibleByOwner: true,
    isVisibleByNeighbors: true,
    updateOwner: new functionInfo_1.FunctionInfo(ALCHequipped).tryCatch(),
    updateNeighbor: new functionInfo_1.FunctionInfo(ALCHequipped).tryCatch()
  });
};

exports.register = register;
},{"../../papyrus/multiplayer/functions":"zNfc","../../utils/functionInfo":"fC7F"}],"bSOF":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.register = void 0;

const functions_1 = require("../papyrus/multiplayer/functions");

const register = mp => {
  functions_1.statePropFactory(mp, 'spawnTimeToRespawn');
};

exports.register = register;
},{"../papyrus/multiplayer/functions":"zNfc"}],"vmr5":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.register = void 0;

const functions_1 = require("../papyrus/multiplayer/functions");

const register = mp => {
  functions_1.statePropFactory(mp, 'lastAnimation');
};

exports.register = register;
},{"../papyrus/multiplayer/functions":"zNfc"}],"z8sU":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LocalizationProvider = void 0;

class LocalizationProvider {
  constructor(mp, localizationFilePath, mode) {
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
    this.mp = mp;
    this.stringsFilePath = stringsFilePath;
    this.strings = {};
    const regex = new RegExp(`strings.+_${formatLocalization(locale)}\.json`);
    this.mp.readDataDirectory().filter(x => x.match(regex)).forEach(x => {
      const espName = x.replace('strings\\', '').split('_')[0].toLowerCase().trim();
      this.strings[espName] = JSON.parse(this.mp.readDataFile(x));
    });
  }

  getText(espName, index) {
    var _a;

    if (!this.strings[espName]) return;
    return (_a = this.strings[espName].find(x => x.Index.toString() === index.toString())) === null || _a === void 0 ? void 0 : _a.Text;
  }

}

exports.StringLocalizationProvider = StringLocalizationProvider;
},{}],"nnyN":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ServerOptionProvider = void 0;

const papyrusArgs_1 = require("../../utils/papyrusArgs");

class ServerOptionProvider {
  constructor(mp, hotReload) {
    this.mp = mp;
    this.hotReload = hotReload;
    this.defaultSettings = {
      serverName: 'Secret Project',
      EnableDebug: false,
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
      keybindingShowChat: 20,
      keybindingShowMenu: 21,
      keybindingShowAnimList: 22,
      keybindingShowPerkTree: 24,
      command1: '',
      command2: '',
      command3: '',
      command4: '',
      command5: '',
      command6: '',
      command7: '',
      command8: '',
      command9: '',
      command0: '',
      StartUpItemsAdd: ['0x64b42;10', '0xf4314;10', '0x34cdf;30', '0x64b3f;30', '0x64b41;30', '0x669a5;30', '0x65c9f;30', '0x64b42;30', '0x34d22;30', '0x45c28;30', '0x65c9b;5', '0x65c99;10', '0x64b40;30', '0x65c9e;30', '0xf2011;30', '0x515def1;2', '0x515def2;2', '0x12eb7;1', '0x3eadd;50'],
      LocationsForBuying: [],
      LocationsForBuyingValue: [],
      TimeScale: 20,
      showNickname: false,
      enableInterval: true,
      enableALCHeffect: true,
      adminPassword: '12345'
    };
    if (!this.hotReload) this.serverOptions = this.json;
  }

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

  getServerOptions() {
    var _a;

    return (_a = this.serverOptions) !== null && _a !== void 0 ? _a : this.json;
  }

  getServerOptionsValue(args) {
    var _a, _b;

    const settings = this.getServerOptions();
    const key = (_a = Object.keys(settings).find(x => x.toLowerCase() === papyrusArgs_1.getString(args, 0).toLowerCase())) !== null && _a !== void 0 ? _a : Object.keys(this.defaultSettings).find(x => x.toLowerCase() === papyrusArgs_1.getString(args, 0).toLowerCase());
    if (!key) return null;
    const value = (_b = settings[key]) !== null && _b !== void 0 ? _b : this.defaultSettings[key];
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

var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  Object.defineProperty(o, k2, {
    enumerable: true,
    get: function () {
      return m[k];
    }
  });
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

var __setModuleDefault = this && this.__setModuleDefault || (Object.create ? function (o, v) {
  Object.defineProperty(o, "default", {
    enumerable: true,
    value: v
  });
} : function (o, v) {
  o["default"] = v;
});

var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);

  __setModuleDefault(result, mod);

  return result;
};

var _a, _b;

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.serverOptionProvider = void 0;
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

const events = __importStar(require("./src/events"));

const synchronization = __importStar(require("./src/synchronization"));

const multiplayer = __importStar(require("./src/papyrus/multiplayer"));

const stringUtil = __importStar(require("./src/papyrus/stringUtil"));

const actor = __importStar(require("./src/papyrus/actor"));

const objectReference = __importStar(require("./src/papyrus/objectReference"));

const utility = __importStar(require("./src/papyrus/utility"));

const game = __importStar(require("./src/papyrus/game"));

const debug = __importStar(require("./src/papyrus/debug"));

const form = __importStar(require("./src/papyrus/form"));

const actorValueInfo = __importStar(require("./src/papyrus/actorValueInfo"));

const weapon = __importStar(require("./src/papyrus/weapon"));

const globalVariable = __importStar(require("./src/papyrus/globalVariable"));

const constructibleObject = __importStar(require("./src/papyrus/constructibleObject"));

const activeMagicEffect = __importStar(require("./src/papyrus/activeMagicEffect"));

const potion = __importStar(require("./src/papyrus/potion"));

const perk = __importStar(require("./src/papyrus/perk"));

const keyword = __importStar(require("./src/papyrus/keyword"));

const cell = __importStar(require("./src/papyrus/cell"));

const math = __importStar(require("./src/papyrus/math"));

const magicEffect = __importStar(require("./src/papyrus/magicEffect"));

const effectShader = __importStar(require("./src/papyrus/effectShader"));

const visualEffect = __importStar(require("./src/papyrus/visualEffect"));

const perkProp = __importStar(require("./src/properties/perks"));

const evalProp = __importStar(require("./src/properties/eval"));

const browserProp = __importStar(require("./src/properties/browser"));

const activatorProp = __importStar(require("./src/properties/activator"));

const actorProp = __importStar(require("./src/properties/actor"));

const inputProp = __importStar(require("./src/properties/input"));

const objectReferenceProp = __importStar(require("./src/properties/objectReference"));

const spawnProp = __importStar(require("./src/properties/spawn"));

const animProp = __importStar(require("./src/properties/anim"));

const localizationProvider_1 = require("./src/utils/localizationProvider");

const stringLocalizationProvider_1 = require("./src/utils/stringLocalizationProvider");

const server_options_1 = require("./src/papyrus/game/server-options");

const config = mp.getServerSettings();
const locale = config.locale;
const data = config.dataDir;
const isPapyrusHotReloadEnabled = config.isPapyrusHotReloadEnabled;
const isServerOptionsHotReloadEnabled = config.isServerOptionsHotReloadEnabled;
const stringsPath = (_a = config.stringsPath) !== null && _a !== void 0 ? _a : 'strings';
const gamemodePath = (_b = config.gamemodePath) !== null && _b !== void 0 ? _b : 'gamemode.js';
const localizationProvider = new localizationProvider_1.LocalizationProvider(mp, 'localization/' + locale + '.json', isPapyrusHotReloadEnabled ? 'hotreload' : 'once');
const stringLocalizationProvider = new stringLocalizationProvider_1.StringLocalizationProvider(mp, mp.readDataFile('localization/' + locale + '.json'), locale);
exports.serverOptionProvider = new server_options_1.ServerOptionProvider(mp, isServerOptionsHotReloadEnabled);
mp.clear();
perkProp.register(mp);
evalProp.register(mp);
actorProp.register(mp);
browserProp.register(mp);
objectReferenceProp.register(mp);
inputProp.register(mp);
activatorProp.register(mp);
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
game.register(mp, exports.serverOptionProvider);
debug.register(mp);
weapon.register(mp);
globalVariable.register(mp);
constructibleObject.register(mp);
activeMagicEffect.register(mp);
potion.register(mp);
perk.register(mp);
keyword.register(mp);
cell.register(mp);
math.register(mp);
magicEffect.register(mp);
effectShader.register(mp);
visualEffect.register(mp);
setTimeout(() => {
  mp.callPapyrusFunction('global', 'GM_Main', '_OnPapyrusRegister', null, []);
}, 0);
},{"./src/events":"VJVi","./src/synchronization":"vm0Z","./src/papyrus/multiplayer":"QSKn","./src/papyrus/stringUtil":"ejLG","./src/papyrus/actor":"ZYrz","./src/papyrus/objectReference":"YRYD","./src/papyrus/utility":"GnGy","./src/papyrus/game":"WCBi","./src/papyrus/debug":"tMCa","./src/papyrus/form":"mnzc","./src/papyrus/actorValueInfo":"Ojqs","./src/papyrus/weapon":"TCaz","./src/papyrus/globalVariable":"PmOp","./src/papyrus/constructibleObject":"oZsC","./src/papyrus/activeMagicEffect":"dvBS","./src/papyrus/potion":"SDpR","./src/papyrus/perk":"Fep9","./src/papyrus/keyword":"GeQ2","./src/papyrus/cell":"WIJZ","./src/papyrus/math":"YH8e","./src/papyrus/magicEffect":"pZ4P","./src/papyrus/effectShader":"jRUP","./src/papyrus/visualEffect":"zBNb","./src/properties/perks":"b09m","./src/properties/eval":"mJTA","./src/properties/browser":"sIi4","./src/properties/activator":"lucm","./src/properties/actor":"TBbX","./src/properties/input":"hqDV","./src/properties/objectReference":"HQ1N","./src/properties/spawn":"bSOF","./src/properties/anim":"vmr5","./src/utils/localizationProvider":"z8sU","./src/utils/stringLocalizationProvider":"lAw9","./src/papyrus/game/server-options":"nnyN"}]},{},["QCba"], null)
