
// This transformer changes the require calls so they don't point to the
// browserify builtins (older version of this module).

var path = require('path');
var util = require('util');
var stream = require('stream');
var builtins = require('../index.js');

function RequireRedirect() {
  if (!(this instanceof RequireRedirect)) return new RequireRedirect();
  stream.Transform.call(this);
  this.buffers = [];
}
module.exports = RequireRedirect;
util.inherits(RequireRedirect, stream.Transform);

RequireRedirect.prototype._transform = function (chunk, encoding, done) {
  this.buffers.push(chunk);
  done(null);
};

// NOTE: this is an incomplete require RegExp, but for internal use here its fine.
var REQUIRE_REGEX = /require\((?:"|')([^"']+)(?:"|')\)/g;
var RELATIVE_DIR = path.resolve(__dirname, '..');

RequireRedirect.prototype._flush = function (done) {
  var file = Buffer.concat(this.buffers).toString();

  file = file.replace(REQUIRE_REGEX, function (source, name) {
    if (builtins.hasOwnProperty(name)) {
      return "require('" + builtins[name] + "')";
    } else {
      return source;
    }
  });

  this.push(file);
  done(null);
};
