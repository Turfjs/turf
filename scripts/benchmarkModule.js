var path = require('path');

const turfModule = [process.argv[2]];

turfModule.forEach(function (dir) {
    require(path.join(__dirname, '../src/', dir, 'bench.js')); //eslint-disable-line
});
