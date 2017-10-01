#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');
const load = require('load-json-file');
const camelcase = require('camelcase');

// Update index.js export default module (Typescript compatible)
glob.sync(path.join(__dirname, '..', 'packages', 'turf-*', 'index.js')).forEach(filepath => {
    let index = fs.readFileSync(filepath, 'utf8');
    const dir = path.parse(filepath).dir;
    const pckg = load.sync(path.join(dir, 'package.json'));
    const name = camelcase(pckg.name).replace('@turf/', '');

    // Modules without named export function
    if (index.includes('export default function (')) {
        // duplicate function names
        if (index.includes('function ' + name)) {
            throw new Error('duplicate function name', name);
        }
        index = index.replace('export default function (', `function ${name}(`);
        index += `\nexport default ${name};`;
        index += `\nmodule.exports.default = ${name};\n`;
        fs.writeFileSync(filepath, index);
    }
    // Modules with named export function
    if (index.includes(`export default function ${name}(`)) {
        index = index.replace(`export default function ${name}(`, `function ${name}(`);
        index += `\nexport default ${name};`;
        index += `\nmodule.exports.default = ${name};\n`;
        fs.writeFileSync(filepath, index);
    }
    if (index.includes('export default') && !index.includes('module.exports.default')) {
        throw new Error('missing module.exports.default =', name);
    }
});
