/* JS debugging */

var debugArgs = function (arguments_, funcName) {

  // TODO: recursive

  if (!DEBUG) return; 

  var args = Array.prototype.slice.call(arguments_)
    , funcName = funcName || ''
    , isInvalid = function (x) {
        if (x instanceof Function)
          return false;
        if (typeof x === 'object') 
          return (x === null || x === undefined);
        if (typeof x === 'string' || x === 'boolean')
          return (x === null || x === undefined);
        return (isNaN(x) || x === null || x === undefined || x === Infinity);
      }
    , doLog = function (x) {
        logger(MSG.DEBUG, 'args: ' + JSON.stringify(x, null, 2));
      }
    ;

  for (var i = 0, is = args.length; i < is; i++) {
    var arg = args[i];
    if (arg && typeof arg === 'object') {
      if (Array.isArray(arg)) {
        arg.forEach(function (e) {
          if (e && typeof e === 'object') {
            if (isTypedArray(e)) {
              for (var i = 0, is = arg.length; i < is; i++) {
                if (isInvalid(arg[i])) {
                  doLog(arg);
                  throw arg;
                }
              }
            } else if (Array.isArray(e)) {
              e.forEach(function (e2) {
                if (isInvalid(e2)) {
                  doLog(e);
                  throw e2;
                }
              });
            } else {
              for (var prop in e) {
                if (e.hasOwnProperty(prop)) {
                  if (isInvalid(e[prop])) {
                    doLog(e);
                    throw prop;
                  }
                }
              }
            }
          } else {
            if (isInvalid(e)) {
              doLog(arg);
              throw e;
            }
          }
        });
      } else if (isTypedArray(arg)) {
        for (var i = 0, is = arg.length; i < is; i++) {
          if (isInvalid(arg[i])) {
            doLog(arg);
            throw arg;
          }
        }
      } else {
        for (var prop in arg) {
          if (arg.hasOwnProperty(prop)) {
            if (isInvalid(arg[prop])) {
              doLog(arg);
              throw arg;
            }
          }
        }
      }
    } else { 
      if (isInvalid(arg)) {
        doLog(args);
        throw arg;
      }
    }
  }

};

var isTypedArray = function (x) {
  return (
    x instanceof Int8Array ||
    x instanceof Uint8Array || 
    x instanceof Uint8ClampedArray || 
    x instanceof Int16Array ||
    x instanceof Uint16Array || 
    x instanceof Int32Array ||
    x instanceof Uint32Array ||
    x instanceof Float64Array || 
    x instanceof Float64Array
  );
}

var debug = function () {

  if (!DEBUG) return;

  // check if it is an arguments object
  if (
    typeof arguments[0] === 'object' &&
    arguments[0].length != undefined && 
    !Array.isArray(arguments[0]) &&
    !isTypedArray(arguments[0])
  ) return debugArgs(arguments[0]);

  if (arguments.length === 2) {
    if (typeof arguments[1] === 'string')
      logger(MSG.DEBUG, arguments[1] + ' = ' + ((typeof arguments[0] === 'object') ? JSON.stringify(arguments[0], null, 1) : arguments[0]));
    if (typeof arguments[0] === 'string')
      logger(MSG.DEBUG, arguments[0] + ' = ' + ((typeof arguments[1] === 'object') ? JSON.stringify(arguments[1], null, 1) : arguments[1]));
  } else if (typeof arguments[0] === 'string') {
    logger(MSG.DEBUG, arguments[0]);
  } else {
    logger(MSG.DEBUG, arguments[0]);
  }

};