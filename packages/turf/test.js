import fs from 'fs';
import path from 'path';
import glob from 'glob';
import test from 'tape';
import documentation from 'documentation';
import camelcase from 'camelcase';
import * as turf from '.';

// Helpers
const directory = path.join(__dirname, '..');
let modules = [];
for (const name of fs.readdirSync(directory)) {
    const pckgPath = path.join(directory, name, 'package.json');
    if (!fs.existsSync(pckgPath)) continue;
    const pckg = JSON.parse(fs.readFileSync(pckgPath));
    modules.push({
        name,
        dir: path.join(directory, name),
        pckg,
        dependencies: pckg.dependencies || {},
        devDependencies: pckg.devDependencies || {}
    });
}
// Exclude main Turf module
modules = modules.filter(({name}) => name !== 'turf');

test('turf -- required files', t => {
    for (const {name, dir} of modules) {
        for (const filename of ['test.js', 'bench.js', 'index.js', 'index.d.ts', 'LICENSE', 'README.md', 'yarn.lock']) {
            if (!fs.existsSync(path.join(dir, filename))) t.fail(`${name} ${filename} is required`);
        }
        // if (!fs.existsSync(path.join(dir, 'types.ts'))) t.fail(`${name} types.ts is required`);
    }
    t.skip('add "types.ts" to all packages');
    t.end();
});

test('turf -- invalid dependencies', t => {
    for (const {name, dependencies, devDependencies} of modules) {
        for (const invalidDependency of ['load-json-file', 'write-json-file', 'tape', 'benchmark', 'glob', 'lerna', 'documentation', 'uglify-js']) {
            if (dependencies[invalidDependency]) t.fail(`${name} ${invalidDependency} should be defined as devDependencies`);
        }
        if (devDependencies['eslint'] || devDependencies['eslint-config-mourner']) t.fail(`${name} eslint is handled at the root level`);
        // if (devDependencies['mkdirp']) t.fail(`${name} tests should not have to create folders`);
    }
    t.skip('remove "mkdirp" from testing');
    t.end();
});

test('turf -- strict version dependencies', t => {
    for (const {name, dependencies} of modules) {
        if (dependencies['jsts'] && dependencies['jsts'] !== '1.4.0') t.fail(name + ' jsts must use v1.4.0');
    }
    t.end();
});

test('turf -- duplicate dependencies', t => {
    for (const {name, dependencies, devDependencies} of modules) {
        for (const dependency of Object.keys(dependencies)) {
            if (devDependencies[dependency]) t.fail(`${name} ${dependency} is duplicated in devDependencies`);
        }
    }
    t.end();
});

test('turf -- check if files exists', t => {
    for (const {name, dir, pckg} of modules) {
        const {files} = pckg;
        if (!files || !files.length) t.fail(`${name} (files) must be included in package.json`);
        for (const file of files) {
            if (!fs.existsSync(path.join(dir, file))) t.fail(`${name} missing file ${file} in "files"`);
        }
    }
    t.end();
});

test('turf -- MIT license', t => {
    const text = fs.readFileSync(path.join(__dirname, 'LICENSE'), 'utf8');
    for (const {name, dir, pckg} of modules) {
        const {license} = pckg;
        if (license !== 'MIT') t.fail(`${name} (license) must be "MIT"`);
        if (fs.readFileSync(path.join(dir, 'LICENSE'), 'utf8') !== text) t.fail(`${name} (LICENSE) is different from @turf/turf`);
    }
    t.end();
});

test('turf -- contributors', t => {
    for (const {name, pckg} of modules) {
        for (const contributor of pckg.contributors || []) {
            if (!contributor.match(/<@.+>/)) t.fail(`${name} ${contributor} (contributors) should use "Full Name <@GitHub>"`);
        }
    }
    t.end();
});

test('turf -- scoped package name', t => {
    for (const {name, pckg} of modules) {
        const expected = name.replace('turf-', '@turf/');
        if (pckg.name !== expected) t.fail(`${name} (name) must use ${expected} in package.json`);
    }
    t.end();
});

test('turf -- pre-defined attributes in package.json', t => {
    for (const {name, pckg} of modules) {
        if (pckg.author !== 'Turf Authors') t.fail(name + ' (author) should be "Turf Authors"');
        if (pckg.main !== 'dist/index') t.fail(`${name} (main) must be "dist/index" in package.json`);
        if (pckg.module !== 'index') t.fail(`${name} (module) must be "index" in package.json`);
        if (pckg['jsnext:main'] !== 'index') t.fail(`${name} (jsnext:main) must be "index" in package.json`);
        if (pckg.types !== 'index.d.ts') t.fail(`${name} (types) must be "index.d.ts" in package.json`);
        if (!pckg.bugs || pckg.bugs.url !== 'https://github.com/Turfjs/turf/issues') t.fail(`${name} (bugs.url) must be "https://github.com/Turfjs/turf/issues" in package.json`);
        if (pckg.homepage !== 'https://github.com/Turfjs/turf') t.fail(`${name} (homepage) must be "https://github.com/Turfjs/turf" in package.json`);
    }
    t.end();
});

test('turf -- parsing dependencies from index.js', t => {
    for (const {name, dir, dependencies} of modules) {
        const index = fs.readFileSync(path.join(dir, 'index.js'), 'utf8');

        // Read Depedencies from index.js
        const dependenciesUsed = new Set();
        for (const dependency of index.match(/(require\(|from )'[@/a-z-\d]+'/gi) || []) {
            const dependencyName = dependency.split(/'/)[1];
            if (!dependencies[dependencyName]) t.fail(`${name} ${dependencyName} is missing from dependencies`);
            if (dependenciesUsed.has(dependencyName)) t.fail(`${name} ${dependencyName} is duplicated in index.js`);
            dependenciesUsed.add(dependencyName);
        }

        // Read Dependencies from package.json
        for (const dependencyName of Object.keys(dependencies)) {
            // Ignore @turf/helpers since it could be used in Typescript definition
            switch (dependencyName) {
            case '@turf/helpers':
            case '@turf/invariant':
            case '@turf/meta':
                continue;
            }
            if (!dependenciesUsed.has(dependencyName)) t.fail(`${name} ${dependencyName} is not required in index.js`);
        }
    }
    t.end();
});


/**
 * =========================
 * Builds => test.example.js
 * =========================
 * will be run as `posttest`
 */

// File Paths
const testFilePath = path.join(__dirname, 'test.example.js');
const turfModulesPath = path.join(__dirname, '..', 'turf-*', 'index.js');

// Test Strings
const requireString = `const test = require('tape');
const turf = require('.');
`;

/**
 * Generate Test String
 *
 * @param {Object} turfFunction Documentation function object
 * @param {Object} example Documentation example object
 * @returns {string} Test String
 */
function testString(turfFunction, example) {
    const turfName = turfFunction.name;
    const testFunctionName = turfName + 'Test';

    // New modules will be excluded from tests
    if (!turf.hasOwnProperty(turfName)) return `
test('turf-${turfName}', t => {
    t.skip('${turfName}');
    t.end();
});
`;
    return `
test('turf-${turfName}', t => {
    const ${testFunctionName} = () => {
        ${example.description}
    }
    ${testFunctionName}();
    t.pass('${turfName}');
    t.end();
});
`;
}

// // Test for missing modules
// test('turf -- missing modules', t => {
//     const files = {
//         typescript: fs.readFileSync(path.join(__dirname, 'index.d.ts')),
//         modules: fs.readFileSync(path.join(__dirname, 'index.js'))
//     };

//     modules.forEach(({name}) => {
//         name = camelcase(name.replace('turf-', ''));
//         // name exception with linestring => lineString
//         name = name.replace('linestring', 'lineString').replace('Linestring', 'LineString');

//         if (!files.typescript.includes(name)) t.fail(name + ' is missing from index.d.ts');
//         if (!files.modules.includes(name)) t.fail(name + ' is missing from index.js');

//         switch (typeof turf[name]) {
//         case 'function': break;
//         case 'object':
//             Object.keys(turf[name]).forEach(method => {
//                 if (typeof turf[method] !== 'function') t.skip(name + '.' + method + ' is missing from index.js');
//                 if (!files.typescript.includes(method)) t.skip(name + '.' + method + ' is missing from index.d.ts');
//                 if (!files.modules.includes(method)) t.skip(name + '.' + method + ' is missing from index.js');
//             });
//             break;
//         case 'undefined':
//             t.fail(name + ' is missing from index.js');
//         }
//     });
//     t.end();
// });

// // Iterate over each module and retrieve @example to build tests from them
// glob(turfModulesPath, (err, files) => {
//     if (err) throw err;

//     // Read each JSDocs from index.js files
//     documentation.build(files, {}).then(turfFunctions => {
//         if (err) throw err;

//         // Write header of test.js
//         const writeableStream = fs.createWriteStream(testFilePath);
//         writeableStream.write(requireString);
//         writeableStream.on('error', err => { throw err; });

//         // Retrieve @example
//         turfFunctions.forEach(turfFunction => {
//             if (turfFunction.examples) {

//                 // Save to test.js
//                 turfFunction.examples.forEach(example => {
//                     writeableStream.write(testString(turfFunction, example));
//                 });
//             }
//         });
//         writeableStream.end();
//     });
// });
