var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));

// node_modules/node-json-db/dist/lib/Utils.js
var require_Utils = __commonJS({
  "node_modules/node-json-db/dist/lib/Utils.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.removeTrailingChar = exports.merge = void 0;
    var merge = (...arrays) => {
      const destination = {};
      arrays.forEach(function(source) {
        var prop;
        for (prop in source) {
          if (prop in destination && destination[prop] === null) {
            destination[prop] = source[prop];
          } else if (prop in destination && Array.isArray(destination[prop])) {
            destination[prop] = destination[prop].concat(source[prop]);
          } else if (prop in destination && typeof destination[prop] === "object") {
            destination[prop] = (0, exports.merge)(destination[prop], source[prop]);
          } else {
            destination[prop] = source[prop];
          }
        }
      });
      return destination;
    };
    exports.merge = merge;
    var removeTrailingChar = (dataPath, trailing) => {
      if (dataPath.length > 1 && dataPath.endsWith(trailing)) {
        return dataPath.substring(0, dataPath.length - 1);
      }
      return dataPath;
    };
    exports.removeTrailingChar = removeTrailingChar;
  }
});

// node_modules/mkdirp/lib/opts-arg.js
var require_opts_arg = __commonJS({
  "node_modules/mkdirp/lib/opts-arg.js"(exports, module2) {
    var { promisify } = require("util");
    var fs = require("fs");
    var optsArg = (opts) => {
      if (!opts)
        opts = { mode: 511, fs };
      else if (typeof opts === "object")
        opts = { mode: 511, fs, ...opts };
      else if (typeof opts === "number")
        opts = { mode: opts, fs };
      else if (typeof opts === "string")
        opts = { mode: parseInt(opts, 8), fs };
      else
        throw new TypeError("invalid options argument");
      opts.mkdir = opts.mkdir || opts.fs.mkdir || fs.mkdir;
      opts.mkdirAsync = promisify(opts.mkdir);
      opts.stat = opts.stat || opts.fs.stat || fs.stat;
      opts.statAsync = promisify(opts.stat);
      opts.statSync = opts.statSync || opts.fs.statSync || fs.statSync;
      opts.mkdirSync = opts.mkdirSync || opts.fs.mkdirSync || fs.mkdirSync;
      return opts;
    };
    module2.exports = optsArg;
  }
});

// node_modules/mkdirp/lib/path-arg.js
var require_path_arg = __commonJS({
  "node_modules/mkdirp/lib/path-arg.js"(exports, module2) {
    var platform = process.env.__TESTING_MKDIRP_PLATFORM__ || process.platform;
    var { resolve, parse } = require("path");
    var pathArg = (path) => {
      if (/\0/.test(path)) {
        throw Object.assign(new TypeError("path must be a string without null bytes"), {
          path,
          code: "ERR_INVALID_ARG_VALUE"
        });
      }
      path = resolve(path);
      if (platform === "win32") {
        const badWinChars = /[*|"<>?:]/;
        const { root } = parse(path);
        if (badWinChars.test(path.substr(root.length))) {
          throw Object.assign(new Error("Illegal characters in path."), {
            path,
            code: "EINVAL"
          });
        }
      }
      return path;
    };
    module2.exports = pathArg;
  }
});

// node_modules/mkdirp/lib/find-made.js
var require_find_made = __commonJS({
  "node_modules/mkdirp/lib/find-made.js"(exports, module2) {
    var { dirname } = require("path");
    var findMade = (opts, parent, path = void 0) => {
      if (path === parent)
        return Promise.resolve();
      return opts.statAsync(parent).then((st) => st.isDirectory() ? path : void 0, (er) => er.code === "ENOENT" ? findMade(opts, dirname(parent), parent) : void 0);
    };
    var findMadeSync = (opts, parent, path = void 0) => {
      if (path === parent)
        return void 0;
      try {
        return opts.statSync(parent).isDirectory() ? path : void 0;
      } catch (er) {
        return er.code === "ENOENT" ? findMadeSync(opts, dirname(parent), parent) : void 0;
      }
    };
    module2.exports = { findMade, findMadeSync };
  }
});

// node_modules/mkdirp/lib/mkdirp-manual.js
var require_mkdirp_manual = __commonJS({
  "node_modules/mkdirp/lib/mkdirp-manual.js"(exports, module2) {
    var { dirname } = require("path");
    var mkdirpManual = (path, opts, made) => {
      opts.recursive = false;
      const parent = dirname(path);
      if (parent === path) {
        return opts.mkdirAsync(path, opts).catch((er) => {
          if (er.code !== "EISDIR")
            throw er;
        });
      }
      return opts.mkdirAsync(path, opts).then(() => made || path, (er) => {
        if (er.code === "ENOENT")
          return mkdirpManual(parent, opts).then((made2) => mkdirpManual(path, opts, made2));
        if (er.code !== "EEXIST" && er.code !== "EROFS")
          throw er;
        return opts.statAsync(path).then((st) => {
          if (st.isDirectory())
            return made;
          else
            throw er;
        }, () => {
          throw er;
        });
      });
    };
    var mkdirpManualSync = (path, opts, made) => {
      const parent = dirname(path);
      opts.recursive = false;
      if (parent === path) {
        try {
          return opts.mkdirSync(path, opts);
        } catch (er) {
          if (er.code !== "EISDIR")
            throw er;
          else
            return;
        }
      }
      try {
        opts.mkdirSync(path, opts);
        return made || path;
      } catch (er) {
        if (er.code === "ENOENT")
          return mkdirpManualSync(path, opts, mkdirpManualSync(parent, opts, made));
        if (er.code !== "EEXIST" && er.code !== "EROFS")
          throw er;
        try {
          if (!opts.statSync(path).isDirectory())
            throw er;
        } catch (_) {
          throw er;
        }
      }
    };
    module2.exports = { mkdirpManual, mkdirpManualSync };
  }
});

// node_modules/mkdirp/lib/mkdirp-native.js
var require_mkdirp_native = __commonJS({
  "node_modules/mkdirp/lib/mkdirp-native.js"(exports, module2) {
    var { dirname } = require("path");
    var { findMade, findMadeSync } = require_find_made();
    var { mkdirpManual, mkdirpManualSync } = require_mkdirp_manual();
    var mkdirpNative = (path, opts) => {
      opts.recursive = true;
      const parent = dirname(path);
      if (parent === path)
        return opts.mkdirAsync(path, opts);
      return findMade(opts, path).then((made) => opts.mkdirAsync(path, opts).then(() => made).catch((er) => {
        if (er.code === "ENOENT")
          return mkdirpManual(path, opts);
        else
          throw er;
      }));
    };
    var mkdirpNativeSync = (path, opts) => {
      opts.recursive = true;
      const parent = dirname(path);
      if (parent === path)
        return opts.mkdirSync(path, opts);
      const made = findMadeSync(opts, path);
      try {
        opts.mkdirSync(path, opts);
        return made;
      } catch (er) {
        if (er.code === "ENOENT")
          return mkdirpManualSync(path, opts);
        else
          throw er;
      }
    };
    module2.exports = { mkdirpNative, mkdirpNativeSync };
  }
});

// node_modules/mkdirp/lib/use-native.js
var require_use_native = __commonJS({
  "node_modules/mkdirp/lib/use-native.js"(exports, module2) {
    var fs = require("fs");
    var version = process.env.__TESTING_MKDIRP_NODE_VERSION__ || process.version;
    var versArr = version.replace(/^v/, "").split(".");
    var hasNative = +versArr[0] > 10 || +versArr[0] === 10 && +versArr[1] >= 12;
    var useNative = !hasNative ? () => false : (opts) => opts.mkdir === fs.mkdir;
    var useNativeSync = !hasNative ? () => false : (opts) => opts.mkdirSync === fs.mkdirSync;
    module2.exports = { useNative, useNativeSync };
  }
});

// node_modules/mkdirp/index.js
var require_mkdirp = __commonJS({
  "node_modules/mkdirp/index.js"(exports, module2) {
    var optsArg = require_opts_arg();
    var pathArg = require_path_arg();
    var { mkdirpNative, mkdirpNativeSync } = require_mkdirp_native();
    var { mkdirpManual, mkdirpManualSync } = require_mkdirp_manual();
    var { useNative, useNativeSync } = require_use_native();
    var mkdirp = (path, opts) => {
      path = pathArg(path);
      opts = optsArg(opts);
      return useNative(opts) ? mkdirpNative(path, opts) : mkdirpManual(path, opts);
    };
    var mkdirpSync = (path, opts) => {
      path = pathArg(path);
      opts = optsArg(opts);
      return useNativeSync(opts) ? mkdirpNativeSync(path, opts) : mkdirpManualSync(path, opts);
    };
    mkdirp.sync = mkdirpSync;
    mkdirp.native = (path, opts) => mkdirpNative(pathArg(path), optsArg(opts));
    mkdirp.manual = (path, opts) => mkdirpManual(pathArg(path), optsArg(opts));
    mkdirp.nativeSync = (path, opts) => mkdirpNativeSync(pathArg(path), optsArg(opts));
    mkdirp.manualSync = (path, opts) => mkdirpManualSync(pathArg(path), optsArg(opts));
    module2.exports = mkdirp;
  }
});

// node_modules/node-json-db/dist/lib/Errors.js
var require_Errors = __commonJS({
  "node_modules/node-json-db/dist/lib/Errors.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DataError = exports.DatabaseError = exports.NestedError = void 0;
    var NestedError = class extends Error {
      inner;
      id;
      constructor(message, id, inner) {
        super(message);
        this.inner = inner;
        this.id = id;
        this.name = this.constructor.name;
      }
      toString() {
        const string = this.name + ": " + this.message;
        if (this.inner) {
          return string + ":\n" + this.inner;
        }
        return string;
      }
    };
    exports.NestedError = NestedError;
    var DatabaseError = class extends NestedError {
    };
    exports.DatabaseError = DatabaseError;
    var DataError = class extends NestedError {
    };
    exports.DataError = DataError;
  }
});

// node_modules/node-json-db/dist/lib/ArrayInfo.js
var require_ArrayInfo = __commonJS({
  "node_modules/node-json-db/dist/lib/ArrayInfo.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ArrayInfo = exports.arrayRegex = void 0;
    var Errors_1 = require_Errors();
    function isInt(value) {
      return !isNaN(value) && Number(value) == value && !isNaN(parseInt(value, 10));
    }
    var arrayRegex = () => /^([\.0-9a-zA-Z_$\-][0-9a-zA-Z_\-$\.]*)\[((?!(\]|\[)).*|)\]$/gm;
    exports.arrayRegex = arrayRegex;
    var regexCache = {};
    var ArrayInfo = class {
      property;
      index = 0;
      append = false;
      constructor(property, index) {
        this.property = property;
        this.append = index === "";
        if (isInt(index)) {
          this.index = parseInt(index);
        } else if (!this.append) {
          throw new Errors_1.DataError("Only numerical values accepted for array index", 200);
        }
      }
      static processArray(property) {
        if (typeof property === "undefined") {
          return null;
        }
        if (regexCache[property]) {
          return regexCache[property];
        }
        const arrayIndexRegex = (0, exports.arrayRegex)();
        const match = arrayIndexRegex.exec(property.trim());
        if (match != null) {
          return regexCache[property] = new ArrayInfo(match[1], match[2]);
        }
        return null;
      }
      getIndex(data, avoidProperty) {
        if (avoidProperty === void 0) {
          avoidProperty = false;
        }
        if (this.append) {
          return -1;
        }
        const index = this.index;
        if (index == -1) {
          const dataIterable = avoidProperty ? data : data[this.property];
          if (dataIterable.length === 0) {
            return 0;
          }
          return dataIterable.length - 1;
        }
        return index;
      }
      getData(data) {
        if (this.append) {
          throw new Errors_1.DataError("Can't get data when appending", 100);
        }
        const index = this.getIndex(data);
        return data[this.property][index];
      }
      setData(data, value) {
        if (this.append) {
          data[this.property].push(value);
        } else {
          const index = this.getIndex(data);
          data[this.property][index] = value;
        }
      }
      delete(data) {
        if (this.append) {
          throw new Errors_1.DataError("Can't delete an appended data", 10);
        }
        const index = this.getIndex(data);
        data[this.property].splice(index, 1);
      }
      isValid(data) {
        const index = this.getIndex(data);
        return data[this.property].hasOwnProperty(index);
      }
    };
    exports.ArrayInfo = ArrayInfo;
  }
});

// node_modules/node-json-db/dist/lib/DBParentData.js
var require_DBParentData = __commonJS({
  "node_modules/node-json-db/dist/lib/DBParentData.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DBParentData = void 0;
    var ArrayInfo_1 = require_ArrayInfo();
    var Errors_1 = require_Errors();
    var DBParentData = class {
      parent;
      data;
      db;
      dataPath;
      constructor(data, db2, dataPath, parent) {
        this.parent = parent;
        this.data = data;
        this.db = db2;
        this.dataPath = dataPath;
      }
      checkArray(deletion = false) {
        const arrayInfo = ArrayInfo_1.ArrayInfo.processArray(this.parent);
        if (arrayInfo && (!arrayInfo.append || deletion) && !arrayInfo.isValid(this.data)) {
          throw new Errors_1.DataError("DataPath: /" + this.dataPath + ". Can't find index " + arrayInfo.index + " in array " + arrayInfo.property, 10);
        }
        return arrayInfo;
      }
      getData() {
        if (this.parent === void 0) {
          return this.data;
        }
        const arrayInfo = this.checkArray();
        if (arrayInfo) {
          return arrayInfo.getData(this.data);
        } else {
          return this.data[this.parent];
        }
      }
      setData(toSet) {
        if (this.parent === void 0) {
          this.db.resetData(toSet);
          return;
        }
        const arrayInfo = ArrayInfo_1.ArrayInfo.processArray(this.parent);
        if (arrayInfo) {
          if (!this.data.hasOwnProperty(arrayInfo.property)) {
            this.data[arrayInfo.property] = [];
          } else if (!Array.isArray(this.data[arrayInfo.property])) {
            throw new Errors_1.DataError("DataPath: /" + this.dataPath + ". " + arrayInfo.property + " is not an array.", 11);
          }
          arrayInfo.setData(this.data, toSet);
        } else {
          this.data[this.parent] = toSet;
        }
      }
      delete() {
        if (this.parent === void 0) {
          this.db.resetData({});
          return;
        }
        const arrayInfo = this.checkArray(true);
        if (arrayInfo) {
          arrayInfo.delete(this.data);
        } else {
          delete this.data[this.parent];
        }
      }
    };
    exports.DBParentData = DBParentData;
  }
});

// node_modules/node-json-db/dist/lib/JsonDBConfig.js
var require_JsonDBConfig = __commonJS({
  "node_modules/node-json-db/dist/lib/JsonDBConfig.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Config = void 0;
    var path = require("path");
    var Config2 = class {
      filename;
      humanReadable;
      saveOnPush;
      separator;
      syncOnSave;
      constructor(filename, saveOnPush = true, humanReadable = false, separator = "/", syncOnSave = false) {
        this.filename = filename;
        if (path.extname(filename) === "") {
          this.filename += ".json";
        }
        this.humanReadable = humanReadable;
        this.saveOnPush = saveOnPush;
        this.separator = separator;
        this.syncOnSave = syncOnSave;
      }
    };
    exports.Config = Config2;
  }
});

// node_modules/node-json-db/dist/JsonDB.js
var require_JsonDB = __commonJS({
  "node_modules/node-json-db/dist/JsonDB.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.JsonDB = void 0;
    var Utils_1 = require_Utils();
    var FS = require("fs");
    var path = require("path");
    var mkdirp = require_mkdirp();
    var Errors_1 = require_Errors();
    var DBParentData_1 = require_DBParentData();
    var ArrayInfo_1 = require_ArrayInfo();
    var JsonDBConfig_1 = require_JsonDBConfig();
    var JsonDB2 = class {
      loaded = false;
      data = {};
      config;
      constructor(filename, saveOnPush = true, humanReadable = false, separator = "/", syncOnSave = false) {
        if (filename instanceof JsonDBConfig_1.Config) {
          this.config = filename;
        } else {
          this.config = new JsonDBConfig_1.Config(filename, saveOnPush, humanReadable, separator, syncOnSave);
        }
        if (!FS.existsSync(this.config.filename)) {
          const dirname = path.dirname(this.config.filename);
          mkdirp.sync(dirname);
          this.save(true);
          this.loaded = true;
        }
      }
      processDataPath(dataPath) {
        if (dataPath === void 0 ) {
          throw new Errors_1.DataError("The Data Path can't be empty", 6);
        }
        if (dataPath == this.config.separator) {
          return [];
        }
        if(!dataPath){dataPath=this.config.separator+"main"}
        console.log(`datapath =${dataPath } type=${typeof dataPath}`)
        //dataPath = (0, Utils_1.removeTrahar)(dataPath, this.config.separator);
        const path2 = dataPath.split(this.config.separator);
        path2.shift();
        return path2;
      }
      retrieveData(dataPath, create = false) {
        this.load();
        const thisDb = this;
        const recursiveProcessDataPath = (data, index) => {
          let property = dataPath[index];
          function findData(isArray = false) {
            if (data.hasOwnProperty(property)) {
              data = data[property];
            } else if (create) {
              if (isArray) {
                data[property] = [];
              } else {
                data[property] = {};
              }
              data = data[property];
            } else {
              throw new Errors_1.DataError(`Can't find dataPath: ${thisDb.config.separator}${dataPath.join(thisDb.config.separator)}. Stopped at ${property}`, 5);
            }
          }
          const arrayInfo = ArrayInfo_1.ArrayInfo.processArray(property);
          if (arrayInfo) {
            property = arrayInfo.property;
            findData(true);
            if (!Array.isArray(data)) {
              throw new Errors_1.DataError(`DataPath: ${thisDb.config.separator}${dataPath.join(thisDb.config.separator)}. ${property} is not an array.`, 11);
            }
            const arrayIndex = arrayInfo.getIndex(data, true);
            if (!arrayInfo.append && data.hasOwnProperty(arrayIndex)) {
              data = data[arrayIndex];
            } else if (create) {
              if (arrayInfo.append) {
                data.push({});
                data = data[data.length - 1];
              } else {
                data[arrayIndex] = {};
                data = data[arrayIndex];
              }
            } else {
              throw new Errors_1.DataError(`DataPath: ${thisDb.config.separator}${dataPath.join(thisDb.config.separator)}. . Can't find index ${arrayInfo.index} in array ${property}`, 10);
            }
          } else {
            findData();
          }
          if (dataPath.length == ++index) {
            return data;
          }
          return recursiveProcessDataPath(data, index);
        };
        if (dataPath.length === 0) {
          return this.data;
        }
        return recursiveProcessDataPath(this.data, 0);
      }
      getParentData(dataPath, create) {
        const path2 = this.processDataPath(dataPath);
        const last = path2.pop();
        return new DBParentData_1.DBParentData(this.retrieveData(path2, create), this, dataPath, last);
      }
      getData(dataPath) {
        const path2 = this.processDataPath(dataPath);
        return this.retrieveData(path2, false);
      }
      getObject(dataPath) {
        return this.getData(dataPath);
      }
      exists(dataPath) {
        try {
          this.getData(dataPath);
          return true;
        } catch (e) {
          if (e instanceof Errors_1.DataError) {
            return false;
          }
          throw e;
        }
      }
      count(dataPath) {
        const result = this.getData(dataPath);
        if (!Array.isArray(result)) {
          throw new Errors_1.DataError(`DataPath: ${dataPath} is not an array.`, 11);
        }
        const path2 = this.processDataPath(dataPath);
        const data = this.retrieveData(path2, false);
        return data.length;
      }
      getIndex(dataPath, searchValue, propertyName = "id") {
        const data = this.getArrayData(dataPath);
        return data.map(function(element) {
          return element[propertyName];
        }).indexOf(searchValue);
      }
      getIndexValue(dataPath, searchValue) {
        return this.getArrayData(dataPath).indexOf(searchValue);
      }
      getArrayData(dataPath) {
        const result = this.getData(dataPath);
        if (!Array.isArray(result)) {
          throw new Errors_1.DataError(`DataPath: ${dataPath} is not an array.`, 11);
        }
        const path2 = this.processDataPath(dataPath);
        return this.retrieveData(path2, false);
      }
      filter(rootPath, callback) {
        const result = this.getData(rootPath);
        if (Array.isArray(result)) {
          return result.filter(callback);
        }
        if (result instanceof Object) {
          const entries = Object.entries(result);
          const found = entries.filter((entry) => {
            return callback(entry[1], entry[0]);
          });
          if (!found || found.length < 1) {
            return void 0;
          }
          return found.map((entry) => {
            return entry[1];
          });
        }
        throw new Errors_1.DataError("The entry at the path (" + rootPath + ") needs to be either an Object or an Array", 12);
      }
      find(rootPath, callback) {
        const result = this.getData(rootPath);
        if (Array.isArray(result)) {
          return result.find(callback);
        }
        if (result instanceof Object) {
          const entries = Object.entries(result);
          const found = entries.find((entry) => {
            return callback(entry[1], entry[0]);
          });
          if (!found || found.length < 2) {
            return void 0;
          }
          return found[1];
        }
        throw new Errors_1.DataError("The entry at the path (" + rootPath + ") needs to be either an Object or an Array", 12);
      }
      push(dataPath, data, override = true) {
        const dbData = this.getParentData(dataPath, true);
        if (!dbData) {
          throw new Error("Data not found");
        }
        let toSet = data;
        if (!override) {
          if (Array.isArray(data)) {
            let storedData = dbData.getData();
            if (storedData === void 0) {
              storedData = [];
            } else if (!Array.isArray(storedData)) {
              throw new Errors_1.DataError("Can't merge another type of data with an Array", 3);
            }
            toSet = storedData.concat(data);
          } else if (data === Object(data)) {
            if (Array.isArray(dbData.getData())) {
              throw new Errors_1.DataError("Can't merge an Array with an Object", 4);
            }
            toSet = (0, Utils_1.merge)(dbData.getData(), data);
          }
        }
        dbData.setData(toSet);
        if (this.config.saveOnPush) {
          this.save();
        }
      }
      delete(dataPath) {
        const dbData = this.getParentData(dataPath, true);
        if (!dbData) {
          return;
        }
        dbData.delete();
        if (this.config.saveOnPush) {
          this.save();
        }
      }
      resetData(data) {
        this.data = data;
      }
      reload() {
        this.loaded = false;
        this.load();
      }
      load() {
        if (this.loaded) {
          return;
        }
        try {
          const data = FS.readFileSync(this.config.filename, "utf8");
          this.data = JSON.parse(data);
          this.loaded = true;
        } catch (err) {
          const error = new Errors_1.DatabaseError("Can't Load Database", 1, err);
          throw error;
        }
      }
      save(force) {
        force = force || false;
        if (!force && !this.loaded) {
          throw new Errors_1.DatabaseError("DataBase not loaded. Can't write", 7);
        }
        let data = "";
        try {
          if (this.config.humanReadable) {
            data = JSON.stringify(this.data, null, 4);
          } else {
            data = JSON.stringify(this.data);
          }
          if (this.config.syncOnSave) {
            const buffer = Buffer.from(String(data), "utf8");
            const fd_tmp = FS.openSync(this.config.filename, "w");
            let offset = 0;
            let length = buffer.byteLength;
            try {
              while (length > 0) {
                const written = FS.writeSync(fd_tmp, buffer, offset, length);
                offset += written;
                length -= written;
              }
            } finally {
              FS.fsyncSync(fd_tmp);
              FS.closeSync(fd_tmp);
            }
          } else {
            FS.writeFileSync(this.config.filename, data, "utf8");
          }
        } catch (err) {
          const error = new Errors_1.DatabaseError("Can't save the database", 2, err);
          throw error;
        }
      }
    };
    exports.JsonDB = JsonDB2;
  }
});

// db.mjs
var import_node_json_db = __toESM(require_JsonDB(), 1);
var import_JsonDBConfig = __toESM(require_JsonDBConfig(), 1);
var db = new import_node_json_db.JsonDB(new import_JsonDBConfig.Config("proxydb", true, true, "/"));
module.exports=db
