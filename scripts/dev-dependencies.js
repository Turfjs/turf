const glob = require('glob');
const path = require('path');

glob.sync(path.join(__dirname, '..', 'packages', '*', 'package.json')).forEach(filepath => {
    const pckg = require(filepath);
    const dependencies = pckg.dependencies;
    if (dependencies['load-json-file']) console.log(filepath);
    if (dependencies['write-json-file']) console.log(filepath);
    if (dependencies['tape']) console.log(filepath);
    if (dependencies['benchmark']) console.log(filepath);
    if (dependencies['glob']) console.log(filepath);
});
