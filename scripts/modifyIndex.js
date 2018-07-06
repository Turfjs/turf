#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Delete unused files
glob.sync(path.join(__dirname, '..', 'src', 'turf-*')).forEach(packagePath => {

    const filePath = path.join(packagePath, 'index.ts');

    if (fs.existsSync(filePath)) {
        var data = fs.readFileSync(filePath, 'utf-8');

        var newValue = data.replace(/@turf\//g, '../');

        if (newValue.includes('options')) {
          newValue = newValue.replace(/options:([^)]*)/g, 'options');     
        }

        newValue = newValue.replace(/:(?!.*\()([^,{]*)/g, '');

        fs.writeFileSync(path.join(packagePath, 'index.js'), newValue, 'utf-8');  
    }

});
