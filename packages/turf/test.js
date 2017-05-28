const fs = require('fs');
const path = require('path');
const test = require('tape');

// Helpers
const directory = path.join(__dirname, '..');
let modules = fs.readdirSync(directory).map(name => {
    return {
        name,
        dir: path.join(directory, name),
        pckg: JSON.parse(fs.readFileSync(path.join(directory, name, 'package.json')))
    };
});
// Exclude main Turf module
modules = modules.filter(({name}) => name !== 'turf');

test('turf - required files', t => {
    for (const {name, dir} of modules) {
        for (const filename of ['test.js', 'bench.js', 'index.js', 'index.d.ts', 'LICENSE', 'README.md', 'yarn.lock']) {
            if (!fs.existsSync(path.join(dir, filename))) t.fail(`${name} ${filename} is required`);
        }
        // if (!fs.existsSync(path.join(dir, 'types.ts'))) t.fail(`${name} types.ts is required`);
    }
    t.skip('add "types.ts" to all packages');
    t.end();
});

test('turf - invalid dependencies', t => {
    for (const {name, pckg} of modules) {
        const {dependencies, devDependencies} = pckg;
        for (const invalidDependency of ['load-json-file', 'write-json-file', 'tape', 'benchmark', 'glob', 'lerna', 'documentation', 'uglify-js']) {
            if (dependencies[invalidDependency]) t.fail(`${name} ${invalidDependency} should be defined as devDependencies`);
        }
        if (devDependencies['eslint'] || devDependencies['eslint-config-mourner']) t.fail(`${name} eslint is handled at the root level`);
        // if (devDependencies['mkdirp']) t.fail(`${name} tests should not have to create folders`);
    }
    t.skip('remove "mkdirp" from testing');
    t.end();
});

test('turf - strict version dependencies', t => {
    for (const {name, pckg} of modules) {
        const {dependencies} = pckg;
        if (dependencies['jsts'] && dependencies['jsts'] !== '1.3.0') t.fail(`${name} jsts must use v1.3.0`);
    }
    t.end();
});

test('turf - duplicate dependencies', t => {
    for (const {name, pckg} of modules) {
        const {dependencies, devDependencies} = pckg;
        for (const dependency of Object.keys(dependencies)) {
            if (devDependencies[dependency]) t.fail(`${name} ${dependency} is duplicated in devDependencies`);
        }
    }
    t.end();
});

test('turf - check if files exists', t => {
    for (const {name, dir, pckg} of modules) {
        const {files} = pckg;
        if (!files || !files.length) t.fail(`${name} (files) must be included in package.json`);
        for (const file of files) {
            if (!fs.existsSync(path.join(dir, file))) t.fail(`${name} missing file ${file} in "files"`);
        }
    }
    t.end();
});

test('turf - MIT license', t => {
    const text = fs.readFileSync(path.join(__dirname, 'LICENSE'), 'utf8');
    for (const {name, dir, pckg} of modules) {
        const {license} = pckg;
        if (license !== 'MIT') t.fail(`${name} (license) must be "MIT"`);
        if (fs.readFileSync(path.join(dir, 'LICENSE'), 'utf8') !== text) t.fail(`${name} (LICENSE) is different from @turf/turf`);
    }
    t.end();
});

test('turf - contributors', t => {
    for (const {name, pckg} of modules) {
        for (const contributor of pckg.contributors || []) {
            if (!contributor.match(/<@.+>/)) t.fail(`${name} ${contributor} (contributors) should use "Full Name <@GitHub>"`);
        }
    }
    t.end();
});

test('turf - scoped package name', t => {
    for (const {name, pckg} of modules) {
        const expected = name.replace('turf-', '@turf/');
        if (pckg.name !== expected) t.fail(`${name} (name) must use ${expected} in package.json`);
    }
    t.end();
});

test('turf - pre-defined attributes in package.json', t => {
    for (const {name, pckg} of modules) {
        if (pckg.author !== 'Turf Authors') t.fail(name + ' (author) should be "Turf Authors"');
        if (pckg.main !== 'index.js') t.fail(`${name} (main) must be "index.js" in package.json`);
        if (pckg.types !== 'index.d.ts') t.fail(`${name} (types) must be "index.d.ts" in package.json`);
        if (!pckg.bugs || pckg.bugs.url !== 'https://github.com/Turfjs/turf/issues') t.fail(`${name} (bugs.url) must be "https://github.com/Turfjs/turf/issues" in package.json`);
        if (pckg.homepage !== 'https://github.com/Turfjs/turf') t.fail(`${name} (homepage) must be "https://github.com/Turfjs/turf" in package.json`);
    }
    t.end();
});

test('turf - parsing dependencies from index.js', t => {
    for (const {name, dir, pckg} of modules) {
        const index = fs.readFileSync(path.join(dir, 'index.js'), 'utf8');

        // Read Depedencies from index.js
        const dependencies = new Set();
        for (const dependency of index.match(/require\('[\@\/a-z-\d]+'\)/gi) || []) {
            const dependencyName = dependency.split(/'/)[1];
            if (!pckg.dependencies[dependencyName]) t.fail(`${name} ${dependencyName} is missing from dependencies`);
            if (dependencies.has(dependencyName)) t.fail(`${name} ${dependencyName} is duplicated in index.js`);
            dependencies.add(dependencyName);
        }

        // Read Dependencies from package.json
        for (const dependencyName of Object.keys(pckg.dependencies)) {
            if (!dependencies.has(dependencyName)) t.fail(`${name} ${dependencyName} is not required in index.js`);
        }
    }
    t.end();
});
