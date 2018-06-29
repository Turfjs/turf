#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Delete unused files
glob.sync(path.join(__dirname, '..', 'src', 'turf-*')).forEach(packagePath => {

    fs.unlink(path.join(packagePath, '.gitignore'), function (error) {
        if (error) console.log(error);
    });
    fs.unlink(path.join(packagePath, 'LICENSE'), function (error) {
        if (error) console.log(error);
    });
    fs.unlink(path.join(packagePath, 'package.json'), function (error) {
        if (error) console.log(error);
    });
    fs.unlink(path.join(packagePath, 'package-lock.json'), function (error) {
        if (error) console.log(error);
    });
    fs.unlink(path.join(packagePath, 'tsconfig.json'), function (error) {
        if (error) console.log(error);
    });
    fs.unlink(path.join(packagePath, 'tslint.json'), function (error) {
        if (error) console.log(error);
    });
    fs.unlink(path.join(packagePath, 'index.js'), function (error) {
        if (error) console.log(error);
    });
    fs.unlink(path.join(packagePath, 'README.md'), function (error) {
        if (error) console.log(error);
    });
});
