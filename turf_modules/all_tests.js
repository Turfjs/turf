var fs = require('fs');

var dirs = fs.readdirSync('.');

dirs.forEach(function(d) {
    if (d !== 'all_tests.js') {
        if (fs.existsSync(d + '/test.js')) {
            require(d + '/test.js');
        }
    }
});
