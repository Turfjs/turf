var ss = require('./ss.js');
var test = JSON.parse(require('fs').readFileSync('test.json'));

console.log(ss.jenks(test, 5));
