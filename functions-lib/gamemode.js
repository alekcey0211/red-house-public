var parcelRequire = undefined;
var parcelRequire = undefined;
// modules are defined as an array1
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
})({"lib/sprintf-js/index.js":[function(require,module,exports) {
/*! sprintf-js v1.1.2 | Copyright (c) 2007-present, Alexandru Mărășteanu <hello@alexei.ro> | BSD-3-Clause */
!function () {
  "use strict";

  var g = {
    not_string: /[^s]/,
    not_bool: /[^t]/,
    not_type: /[^T]/,
    not_primitive: /[^v]/,
    number: /[diefg]/,
    numeric_arg: /[bcdiefguxX]/,
    json: /[j]/,
    not_json: /[^j]/,
    text: /^[^\x25]+/,
    modulo: /^\x25{2}/,
    placeholder: /^\x25(?:([1-9]\d*)\$|\(([^)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-gijostTuvxX])/,
    key: /^([a-z_][a-z_\d]*)/i,
    key_access: /^\.([a-z_][a-z_\d]*)/i,
    index_access: /^\[(\d+)\]/,
    sign: /^[+-]/
  };

  function y(e) {
    return function (e, t) {
      var r,
          n,
          i,
          s,
          a,
          o,
          p,
          c,
          l,
          u = 1,
          f = e.length,
          d = "";

      for (n = 0; n < f; n++) if ("string" == typeof e[n]) d += e[n];else if ("object" == typeof e[n]) {
        if ((s = e[n]).keys) for (r = t[u], i = 0; i < s.keys.length; i++) {
          if (null == r) throw new Error(y('[sprintf] Cannot access property "%s" of undefined value "%s"', s.keys[i], s.keys[i - 1]));
          r = r[s.keys[i]];
        } else r = s.param_no ? t[s.param_no] : t[u++];
        if (g.not_type.test(s.type) && g.not_primitive.test(s.type) && r instanceof Function && (r = r()), g.numeric_arg.test(s.type) && "number" != typeof r && isNaN(r)) throw new TypeError(y("[sprintf] expecting number but found %T", r));

        switch (g.number.test(s.type) && (c = 0 <= r), s.type) {
          case "b":
            r = parseInt(r, 10).toString(2);
            break;

          case "c":
            r = String.fromCharCode(parseInt(r, 10));
            break;

          case "d":
          case "i":
            r = parseInt(r, 10);
            break;

          case "j":
            r = JSON.stringify(r, null, s.width ? parseInt(s.width) : 0);
            break;

          case "e":
            r = s.precision ? parseFloat(r).toExponential(s.precision) : parseFloat(r).toExponential();
            break;

          case "f":
            r = s.precision ? parseFloat(r).toFixed(s.precision) : parseFloat(r);
            break;

          case "g":
            r = s.precision ? String(Number(r.toPrecision(s.precision))) : parseFloat(r);
            break;

          case "o":
            r = (parseInt(r, 10) >>> 0).toString(8);
            break;

          case "s":
            r = String(r), r = s.precision ? r.substring(0, s.precision) : r;
            break;

          case "t":
            r = String(!!r), r = s.precision ? r.substring(0, s.precision) : r;
            break;

          case "T":
            r = Object.prototype.toString.call(r).slice(8, -1).toLowerCase(), r = s.precision ? r.substring(0, s.precision) : r;
            break;

          case "u":
            r = parseInt(r, 10) >>> 0;
            break;

          case "v":
            r = r.valueOf(), r = s.precision ? r.substring(0, s.precision) : r;
            break;

          case "x":
            r = (parseInt(r, 10) >>> 0).toString(16);
            break;

          case "X":
            r = (parseInt(r, 10) >>> 0).toString(16).toUpperCase();
        }

        g.json.test(s.type) ? d += r : (!g.number.test(s.type) || c && !s.sign ? l = "" : (l = c ? "+" : "-", r = r.toString().replace(g.sign, "")), o = s.pad_char ? "0" === s.pad_char ? "0" : s.pad_char.charAt(1) : " ", p = s.width - (l + r).length, a = s.width && 0 < p ? o.repeat(p) : "", d += s.align ? l + r + a : "0" === o ? l + a + r : a + l + r);
      }

      return d;
    }(function (e) {
      if (p[e]) return p[e];
      var t,
          r = e,
          n = [],
          i = 0;

      for (; r;) {
        if (null !== (t = g.text.exec(r))) n.push(t[0]);else if (null !== (t = g.modulo.exec(r))) n.push("%");else {
          if (null === (t = g.placeholder.exec(r))) throw new SyntaxError("[sprintf] unexpected placeholder");

          if (t[2]) {
            i |= 1;
            var s = [],
                a = t[2],
                o = [];
            if (null === (o = g.key.exec(a))) throw new SyntaxError("[sprintf] failed to parse named argument key");

            for (s.push(o[1]); "" !== (a = a.substring(o[0].length));) if (null !== (o = g.key_access.exec(a))) s.push(o[1]);else {
              if (null === (o = g.index_access.exec(a))) throw new SyntaxError("[sprintf] failed to parse named argument key");
              s.push(o[1]);
            }

            t[2] = s;
          } else i |= 2;

          if (3 === i) throw new Error("[sprintf] mixing positional and named placeholders is not (yet) supported");
          n.push({
            placeholder: t[0],
            param_no: t[1],
            keys: t[2],
            sign: t[3],
            pad_char: t[4],
            align: t[5],
            width: t[6],
            precision: t[7],
            type: t[8]
          });
        }
        r = r.substring(t[0].length);
      }

      return p[e] = n;
    }(e), arguments);
  }

  function e(e, t) {
    return y.apply(null, [e].concat(t || []));
  }

  var p = Object.create(null);
  "undefined" != typeof exports && (exports.sprintf = y, exports.vsprintf = e), "undefined" != typeof window && (window.sprintf = y, window.vsprintf = e, "function" == typeof define && define.amd && define(function () {
    return {
      sprintf: y,
      vsprintf: e
    };
  }));
}();
},{}],"src/utils/papyrusArgs.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getNumberArray = exports.getBoolean = exports.getNumber = exports.getStringArray = exports.getString = exports.getObject = void 0;

var err = function (index, x, expectedTypeName) {
  throw new TypeError("The argument with index " + index + " has value (" + JSON.stringify(x) + ") that doesn't meet the requirements of " + expectedTypeName);
};

var getArray = function (args, index, type) {
  var x = args[index];

  if (x === null || x === undefined) {
    return [];
  }

  return Array.isArray(x) && !x.filter(function (v) {
    return typeof v !== type;
  }).length ? x : err(index, x, type + '[]');
};

var getObject = function (args, index) {
  var x = args[index];
  return x && typeof x === 'object' && !Array.isArray(x) ? x : err(index, x, 'PapyrusObject');
};

exports.getObject = getObject;

var getString = function (args, index) {
  var x = args[index];
  return typeof x === 'string' ? x : err(index, x, 'string');
};

exports.getString = getString;

var getStringArray = function (args, index) {
  return getArray(args, index, 'string');
};

exports.getStringArray = getStringArray;

var getNumber = function (args, index) {
  var x = args[index];
  return typeof x === 'number' ? x : err(index, x, 'number');
};

exports.getNumber = getNumber;

var getBoolean = function (args, index) {
  var x = args[index];
  return typeof x === 'boolean' ? x : err(index, x, 'boolean');
};

exports.getBoolean = getBoolean;

var getNumberArray = function (args, index) {
  return getArray(args, index, 'number');
};

exports.getNumberArray = getNumberArray;
},{}],"src/papyrus/multiplayer.ts":[function(require,module,exports) {
"use strict";

var __spreadArrays = this && this.__spreadArrays || function () {
  for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;

  for (var r = Array(s), k = 0, i = 0; i < il; i++) for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) r[k] = a[j];

  return r;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.register = exports.localizationDefault = void 0;

var sprintf_js_1 = require("../../lib/sprintf-js");

var papyrusArgs_1 = require("../utils/papyrusArgs");

var executeUiCommand = function (mp, self, args) {
  var actor = papyrusArgs_1.getObject(args, 0);
  var commandType = papyrusArgs_1.getString(args, 1);
  var argumentNames = papyrusArgs_1.getStringArray(args, 2);
  var tokens = papyrusArgs_1.getStringArray(args, 3);
  var alter = papyrusArgs_1.getString(args, 4);
  var actorId = mp.getIdFromDesc(actor.desc);
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

var log = function (mp, self, args) {
  var text = papyrusArgs_1.getString(args, 0);
  console.log('[GM]', text);
};

var format = function (mp, self, args) {
  var format = papyrusArgs_1.getString(args, 0);
  var tokens = papyrusArgs_1.getStringArray(args, 1);
  return sprintf_js_1.sprintf.apply(void 0, __spreadArrays([format], tokens));
};

var getText = function (localization, mp, self, args) {
  var msgId = papyrusArgs_1.getString(args, 0);
  return localization.getText(msgId);
};

var getActorsInStreamZone = function (mp, self, args) {
  var actor = papyrusArgs_1.getObject(args, 0);
  var actorId = mp.getIdFromDesc(actor.desc);
  var res = new Array();
  mp.get(actorId, 'neighbors').forEach(function (formId) {
    if (mp.get(formId, 'type') === 'MpActor') {
      res.push({
        type: 'form',
        desc: mp.getDescFromId(formId)
      });
    }
  });
  return res;
};

var getOnlinePlayers = function (mp) {
  var res = new Array();
  mp.get(0, 'onlinePlayers').forEach(function (formId) {
    res.push({
      type: 'form',
      desc: mp.getDescFromId(formId)
    });
  });
  return res;
};

var asPerk = function (mp, self, args) {
  return papyrusArgs_1.getObject(args, 0);
};

exports.localizationDefault = {
  getText: function (x) {
    return x;
  }
};

var register = function (mp, localization) {
  if (localization === void 0) {
    localization = exports.localizationDefault;
  }

  for (var _i = 0, _a = ['Multiplayer', 'M']; _i < _a.length; _i++) {
    var className = _a[_i];
    mp.registerPapyrusFunction('global', className, 'ExecuteUiCommand', function (self, args) {
      return executeUiCommand(mp, self, args);
    });
    mp.registerPapyrusFunction('global', className, 'Log', function (self, args) {
      return log(mp, self, args);
    });
    mp.registerPapyrusFunction('global', className, 'Format', function (self, args) {
      return format(mp, self, args);
    });
    mp.registerPapyrusFunction('global', className, 'GetText', function (self, args) {
      return getText(localization, mp, self, args);
    });
    mp.registerPapyrusFunction('global', className, 'GetActorsInStreamZone', function (self, args) {
      return getActorsInStreamZone(mp, self, args);
    });
    mp.registerPapyrusFunction('global', className, 'GetOnlinePlayers', function () {
      return getOnlinePlayers(mp);
    });
    mp.registerPapyrusFunction('global', className, 'AsPerk', function (self, args) {
      return asPerk(mp, self, args);
    });
  }
};

exports.register = register;
},{"../../lib/sprintf-js":"lib/sprintf-js/index.js","../utils/papyrusArgs":"src/utils/papyrusArgs.ts"}],"src/papyrus/events.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.register = void 0;

var register = function (mp) {
  mp['onUiEvent'] = function (pcFormId, uiEvent) {
    if (!pcFormId) return console.log('Plz reconnect');

    switch (uiEvent.type) {
      case 'cef::chat:send':
        {
          var text = uiEvent.data;

          if (typeof text === 'string') {
            var ac = {
              type: 'form',
              desc: mp.getDescFromId(pcFormId)
            };
            mp.callPapyrusFunction('global', 'GM_Main', '_OnChatInput', null, [ac, text]);
          }
        }
    }
  };
};

exports.register = register;
},{}],"src/papyrus/stringUtil.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.register = void 0;

var papyrusArgs_1 = require("../utils/papyrusArgs");

var getNthChar = function (mp, self, args) {
  var text = papyrusArgs_1.getString(args, 0);
  var index = papyrusArgs_1.getNumber(args, 1);
  return text[index];
};

var split = function (mp, self, args) {
  var text = papyrusArgs_1.getString(args, 0);
  var splitter = papyrusArgs_1.getString(args, 1);
  return text.split(splitter);
};

var substring = function (mp, self, args) {
  var s = papyrusArgs_1.getString(args, 0);
  var startIndex = papyrusArgs_1.getNumber(args, 1);
  var length = papyrusArgs_1.getNumber(args, 2);
  return s.substring(startIndex, length ? startIndex + length : undefined);
};

var getLength = function (mp, self, args) {
  var s = papyrusArgs_1.getString(args, 0);
  return s.length;
};

var toLower = function (mp, self, args) {
  var s = papyrusArgs_1.getString(args, 0);
  return s.toLowerCase();
};

var register = function (mp) {
  mp.registerPapyrusFunction('global', 'StringUtil', 'GetNthChar', function (self, args) {
    return getNthChar(mp, self, args);
  });
  mp.registerPapyrusFunction('global', 'StringUtil', 'Split', function (self, args) {
    return split(mp, self, args);
  });
  mp.registerPapyrusFunction('global', 'StringUtil', 'Substring', function (self, args) {
    return substring(mp, self, args);
  });
  mp.registerPapyrusFunction('global', 'StringUtil', 'GetLength', function (self, args) {
    return getLength(mp, self, args);
  });
  mp.registerPapyrusFunction('global', 'StringUtil', 'ToLower', function (self, args) {
    return toLower(mp, self, args);
  });
};

exports.register = register;
},{"../utils/papyrusArgs":"src/utils/papyrusArgs.ts"}],"src/utils/functionInfo.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FunctionInfo = void 0;

var FunctionInfo = function () {
  function FunctionInfo(f) {
    this.f = f;
  }

  Object.defineProperty(FunctionInfo.prototype, "body", {
    get: function () {
      var funcString = this.f.toString().substring(0, this.f.toString().length - 1);
      return funcString.replace(new RegExp('^.+?{', 'm'), '').trim();
    },
    enumerable: false,
    configurable: true
  });

  FunctionInfo.prototype.getText = function (args) {
    var result = this.body;

    for (var name in args) {
      switch (typeof args[name]) {
        case 'number':
          result = "const " + name + " = " + args[name] + ";\n" + result;
          break;

        case 'string':
          result = "const " + name + " = '" + args[name] + "';\n" + result;
          break;

        case 'boolean':
          result = "const " + name + " = " + args[name] + ";\n" + result;
          break;

        case 'object':
          if (Array.isArray(args[name])) {
            result = "const " + name + " = [" + args[name] + "];\n" + result;
          }

          break;

        case 'function':
          result = "const " + name + " = " + args[name].toString() + ";\n" + result;
          break;
      }
    }

    return result;
  };

  return FunctionInfo;
}();

exports.FunctionInfo = FunctionInfo;
},{}],"src/utils/helper.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isArrayEqual = void 0;

var isArrayEqual = function (arr1, arr2) {
  var type = Object.prototype.toString.call(arr1);
  if (type !== Object.prototype.toString.call(arr2)) return false;
  if (['[object Array]', '[object Object]'].indexOf(type) < 0) return false;
  var valueLen = type === '[object Array]' ? arr1.length : Object.keys(arr1).length;
  var otherLen = type === '[object Array]' ? arr2.length : Object.keys(arr2).length;
  if (valueLen !== otherLen) return false;

  var compare = function (item1, item2) {
    var itemType = Object.prototype.toString.call(item1);

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
},{}],"src/papyrus/actor.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.register = void 0;

var functionInfo_1 = require("../utils/functionInfo");

var helper_1 = require("../utils/helper");

var papyrusArgs_1 = require("../utils/papyrusArgs");

var getDisplayName = function (mp, self) {
  var formId = mp.getIdFromDesc(self.desc);
  var appearance = mp.get(formId, 'appearance');

  if (typeof appearance['name'] === 'string') {
    return appearance['name'];
  }

  return '';
};

var getPerkList = function (mp, selfId, targetId) {
  var _a;

  return (_a = mp.get(selfId, 'perk')) !== null && _a !== void 0 ? _a : [];
};

var setPerkList = function (mp, selfId, perkList) {
  mp.set(selfId, 'perk', perkList);
};

var hasPerk = function (mp, self, args) {
  var perk = papyrusArgs_1.getObject(args, 0);
  var selfId = mp.getIdFromDesc(self.desc);
  var perkId = mp.getIdFromDesc(perk.desc);
  return getPerkList(mp, selfId, perkId).includes(perkId);
};

var addPerk = function (mp, self, args) {
  var perk = papyrusArgs_1.getObject(args, 0);
  var selfId = mp.getIdFromDesc(self.desc);
  var perkId = mp.getIdFromDesc(perk.desc);
  if (hasPerk(mp, self, args)) return;
  var perkList = getPerkList(mp, selfId, perkId);
  perkList.push(perkId);
  setPerkList(mp, selfId, perkList);
};

var removePerk = function (mp, self, args) {
  var perk = papyrusArgs_1.getObject(args, 0);
  var selfId = mp.getIdFromDesc(self.desc);
  var perkId = mp.getIdFromDesc(perk.desc);
  if (!hasPerk(mp, self, args)) return;
  var perkList = getPerkList(mp, selfId, perkId);
  perkList.push(perkId);
  setPerkList(mp, selfId, perkList.filter(function (id) {
    return id !== perkId;
  }));
};

function activePerksUpdate(ctx, isEqual) {
  var ac = ctx.sp.Actor.from(ctx.refr);
  if (!ac) return;

  if (!isEqual(ctx.state.lastActivePerks, ctx.value)) {
    var perkIds = ctx.value;
    perkIds.forEach(function (id) {
      var newPerk = ctx.sp.Perk.from(ctx.sp.Game.getFormEx(id));

      if (!ac.hasPerk(newPerk)) {
        ac.addPerk(newPerk);
      }
    });
    ctx.state.lastPerks = perkIds;
  }
}

var activePerksUpdateInfo = new functionInfo_1.FunctionInfo(activePerksUpdate);

var register = function (mp) {
  mp.registerPapyrusFunction('method', 'Actor', 'GetDisplayName', function (self) {
    return getDisplayName(mp, self);
  });
  mp.registerPapyrusFunction('method', 'Actor', 'AddPerk', function (self, args) {
    return addPerk(mp, self, args);
  });
  mp.registerPapyrusFunction('method', 'Actor', 'RemovePerk', function (self, args) {
    return removePerk(mp, self, args);
  });
  mp.registerPapyrusFunction('method', 'Actor', 'HasPerk', function (self, args) {
    return hasPerk(mp, self, args);
  });
  mp.makeProperty('perk', {
    isVisibleByOwner: true,
    isVisibleByNeighbors: false,
    updateOwner: activePerksUpdateInfo.getText({
      isEqual: helper_1.isArrayEqual
    }),
    updateNeighbor: ''
  });
};

exports.register = register;
},{"../utils/functionInfo":"src/utils/functionInfo.ts","../utils/helper":"src/utils/helper.ts","../utils/papyrusArgs":"src/utils/papyrusArgs.ts"}],"src/papyrus/objectReference.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.register = void 0;

var papyrusArgs_1 = require("../utils/papyrusArgs");

var getDistance = function (mp, self, args) {
  var target = papyrusArgs_1.getObject(args, 0);
  var selfId = mp.getIdFromDesc(self.desc);
  var targetId = mp.getIdFromDesc(target.desc);
  var selfPos = mp.get(selfId, 'pos');
  var targetPos = mp.get(targetId, 'pos');
  return Math.sqrt(Math.pow(selfPos[0] - targetPos[0], 2) + Math.pow(selfPos[1] - targetPos[1], 2) + Math.pow(selfPos[2] - targetPos[2], 2));
};

var setScale = function (mp, self, args) {
  var scale = papyrusArgs_1.getNumber(args, 0);
  var selfId = mp.getIdFromDesc(self.desc);
};

var register = function (mp) {
  mp.registerPapyrusFunction('method', 'ObjectReference', 'GetDistance', function (self, args) {
    return getDistance(mp, self, args);
  });
  mp.registerPapyrusFunction('method', 'ObjectReference', 'SetScale', function (self, args) {
    return setScale(mp, self, args);
  });
};

exports.register = register;
},{"../utils/papyrusArgs":"src/utils/papyrusArgs.ts"}],"src/papyrus/utility.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.register = void 0;

var papyrusArgs_1 = require("../utils/papyrusArgs");

var createStringArray = function (mp, self, args) {
  var size = papyrusArgs_1.getNumber(args, 0);
  var fill = papyrusArgs_1.getString(args, 1);
  return new Array(size).fill(fill);
};

var register = function (mp) {
  mp.registerPapyrusFunction('global', 'Utility', 'CreateStringArray', function (self, args) {
    return createStringArray(mp, self, args);
  });
};

exports.register = register;
},{"../utils/papyrusArgs":"src/utils/papyrusArgs.ts"}],"src/papyrus/game.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.register = void 0;

var papyrusArgs_1 = require("../utils/papyrusArgs");

var getForm = function (mp, self, args) {
  var _a, _b;

  var formId = papyrusArgs_1.getNumber(args, 0);

  try {
    if (formId > 0xff000000) {
      mp.get(formId, 'type');
      return {
        desc: mp.getDescFromId(formId),
        type: 'form'
      };
    } else {
      var espm = mp.lookupEspmRecordById(formId);

      if (((_a = espm.record) === null || _a === void 0 ? void 0 : _a.type) === 'REFR' || ((_b = espm.record) === null || _b === void 0 ? void 0 : _b.type) === 'ACHR') {
        return {
          desc: mp.getDescFromId(formId),
          type: 'form'
        };
      } else {
        return {
          desc: mp.getDescFromId(formId),
          type: 'espm'
        };
      }
    }
  } catch (err) {
    console.error(err);
    return;
  }
};

var register = function (mp) {
  mp.registerPapyrusFunction('global', 'Game', 'GetForm', function (self, args) {
    return getForm(mp, self, args);
  });
  mp.registerPapyrusFunction('global', 'Game', 'GetFormEx', function (self, args) {
    return getForm(mp, self, args);
  });
};

exports.register = register;
},{"../utils/papyrusArgs":"src/utils/papyrusArgs.ts"}],"src/utils/localizationProvider.ts":[function(require,module,exports) {
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
exports.LocalizationProvider = void 0;

var fs = __importStar(require("fs"));

var getFileContents = function (path) {
  if (fs.existsSync(path)) {
    return fs.readFileSync(path, {
      encoding: 'utf-8'
    });
  }

  return '';
};

var LocalizationProvider = function () {
  function LocalizationProvider(localizationFilePath, mode) {
    this.localizationFilePath = localizationFilePath;
    this.mode = mode;
    this.localization = {};
  }

  LocalizationProvider.prototype.getText = function (msgId) {
    if (Object.keys(this.localization).length === 0) {
      var contents = getFileContents(this.localizationFilePath);

      try {
        this.localization = JSON.parse(contents);
      } catch (e) {
        this.localization = {};
      }
    }

    var res = this.localization[msgId] || msgId;

    if (this.mode === 'hotreload') {
      this.localization = {};
    }

    return res;
  };

  return LocalizationProvider;
}();

exports.LocalizationProvider = LocalizationProvider;
},{}],"index.ts":[function(require,module,exports) {
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

var multiplayer = __importStar(require("./src/papyrus/multiplayer"));

var events = __importStar(require("./src/papyrus/events"));

var stringUtil = __importStar(require("./src/papyrus/stringUtil"));

var actor = __importStar(require("./src/papyrus/actor"));

var objectReference = __importStar(require("./src/papyrus/objectReference"));

var utility = __importStar(require("./src/papyrus/utility"));

var game = __importStar(require("./src/papyrus/game"));

var localizationProvider_1 = require("./src/utils/localizationProvider");

var fs = __importStar(require("fs"));

var path = __importStar(require("path"));

var config = JSON.parse(fs.readFileSync('server-settings.json', {
  encoding: 'utf-8'
}));
var locale = config.locale;
var data = config.dataDir;
var isPapyrusHotReloadEnabled = config.isPapyrusHotReloadEnabled;
var localizationProvider = new localizationProvider_1.LocalizationProvider(path.join(data, 'localization', locale + '.json'), isPapyrusHotReloadEnabled ? 'hotreload' : 'once');
multiplayer.register(mp, localizationProvider);
events.register(mp);
stringUtil.register(mp);
actor.register(mp);
objectReference.register(mp);
utility.register(mp);
game.register(mp);
setTimeout(function () {
  return mp.callPapyrusFunction('global', 'GM_Main', '_OnPapyrusRegister', null, []);
}, 0);
},{"./src/papyrus/multiplayer":"src/papyrus/multiplayer.ts","./src/papyrus/events":"src/papyrus/events.ts","./src/papyrus/stringUtil":"src/papyrus/stringUtil.ts","./src/papyrus/actor":"src/papyrus/actor.ts","./src/papyrus/objectReference":"src/papyrus/objectReference.ts","./src/papyrus/utility":"src/papyrus/utility.ts","./src/papyrus/game":"src/papyrus/game.ts","./src/utils/localizationProvider":"src/utils/localizationProvider.ts"}]},{},["index.ts"], null)

