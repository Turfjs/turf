var test = require('tape');
var path = require('path');

test.createStream().pipe(process.stdout);

const turfModule = [process.argv[2]];

turfModule.forEach(function (dir) {
    require(path.join(__dirname, '../src/', dir, 'test.js')); //eslint-disable-line
});
