var fs = require('fs');

var readme = fs.readFileSync('README.md', 'utf8')
    .split('\n');

var a = true, b = true;

fs.writeFileSync('README.md', readme.filter(function(f) {
    if (f === '---') {
        a = !a;
        return true;
    }
    return a;
}).map(function(f) {
    if (f === '---' && b) {
        f = f + '\n\n' + fs.readFileSync('API.md', 'utf8') + '\n\n';
        b = false;
    }
    return f;
}).join('\n'));
