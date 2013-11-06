require=(function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0].call(u.exports,function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({"lib/controllers/testController":[function(require,module,exports){
module.exports=require('yJXPED');
},{}],"yJXPED":[function(require,module,exports){
module.exports = function () {
  return "I am a test controller";
}

},{}],"lib/models/testModel":[function(require,module,exports){
module.exports=require('v4clBR');
},{}],"v4clBR":[function(require,module,exports){
module.exports = function () {
  return "I am a test model";
}

},{}],1:[function(require,module,exports){
var testModel = require('lib/models/testModel');
var testController = require('lib/controllers/testController');

alert(testModel());
alert(testController());


},{"lib/models/testModel":"v4clBR","lib/controllers/testController":"yJXPED"}]},{},[1])
;