var util = require('util');
var color = require('colorful');

var log = module.exports = {};

var levels = {
  debug: 1,
  info: 2,
  warn: 3,
  error: 4
};

log.quiet = false;

log.level = 'info';

log.log = function(level, msg) {
  if (levels[level] >= levels[log.level] && log.quiet === false) {
    if (console[level]) {
      console[level](msg);
    } else {
      console.log(msg);
    }
  }
};

log.debug = function() {
  var category = arguments[0];
  var args = Array.prototype.slice.call(arguments).slice(1);
  var msg = util.format.apply(this, args);

  log.log('debug', getMsg(category, msg, color.blue));
};

log.info = function() {
  var category = arguments[0];
  var args = Array.prototype.slice.call(arguments).slice(1);
  var msg = util.format.apply(this, args);

  log.log('info', getMsg(category, msg, color.cyan));
};

log.warn = function() {
  var category = arguments[0];
  var args = Array.prototype.slice.call(arguments).slice(1);
  var msg = util.format.apply(this, args);

  log.log('warn', getMsg(category, msg, color.yellow));
};

log.error = function() {
  var category = arguments[0];
  var args = Array.prototype.slice.call(arguments).slice(1);
  args = args.map(function(arg) {
    if (arg.message) {
      return arg.message;
    } else if (arg.code) {
      return arg.code;
    } else {
      return arg;
    }
  });
  var msg = util.format.apply(this, args);

  log.log('error', getMsg(category, msg, color.red));
  if (category === 'exit') {
    console.log();
  }
};

log.config = function(options) {
  if (options.verbose) {
    log.level = 'debug';
  }
  if (options.quiet) {
    log.level = 'warn';
  }
  if (!options.color) {
    require('colorful').disabled = true;
  }
};


function getMsg(category, msg, fn) {
  var w = 15;
  var len = Math.max(0, w - category.length);
  var pad = new Array(len + 1).join(' ');
  if (~msg.indexOf('\x1b[')) {
    msg = pad + fn(category) + ': ' + msg;
  } else {
    msg = msg.replace(process.cwd(), '$CWD');
    msg = msg.replace(process.env.HOME, '~');
    //if (msg.length > 50) msg = msg.slice(0, 47) + '...';
    msg = pad + fn(category) + ': ' + color.grey(msg);
  }
  return msg;
}
