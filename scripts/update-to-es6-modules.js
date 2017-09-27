#!/usr/bin/env node

const fs = require('fs-extra');
const load = require('load-json-file');
const write = require('write-json-file');
const path = require('path');
const glob = require('glob');
// const {dependencies} = require('../packages/turf/package.json');

function entries(obj) {
    return Object.keys(obj || {}).map(key => [key, obj[key]]);
}

function updateDependencies(pckg) {
    const dependencies = {};
    new Map(entries(pckg.dependencies))
        .forEach((version, name) => {
            // Update dependencies to v5.0.0-alpha
            switch (name) {
            case '@turf/helpers':
            case '@turf/invariant':
            case '@turf/meta':
                dependencies[name] = '5.0.0-alpha';
                break;
            default:
                dependencies[name] = version;
            }
        });
    return dependencies;
}

function updateDevDependencies(pckg) {
    const devDependencies = {};
    new Map(entries(pckg.devDependencies))
        .set('rollup', '*')
        .set('tape', '*')
        .set('@std/esm', '*')
        .set('benchmark', '*').forEach((version, name) => {
            // Update dependencies to v5.0.0-alpha
            switch (name) {
            case '@turf/helpers':
            case '@turf/invariant':
            case '@turf/meta':
                devDependencies[name] = '5.0.0-alpha';
                break;
            // Change all other devDependencies to *
            default:
                devDependencies[name] = '*';
            }
        });
    return devDependencies;
}

// Update package.json
glob.sync(path.join(__dirname, '..', 'packages', 'turf-*', 'package.json')).forEach(packagePath => {
    const pckg = load.sync(packagePath);
    const files = new Set(pckg.files);
    files.add('dist');
    files.add('index.js');
    files.add('index.d.ts');
    files.delete('index.es5.js');
    files.delete('index.mjs');
    files.delete('index.cjs.js');
    files.delete('index.cjs');

    const newPckg = {
        name: pckg.name,
        version: pckg.version,
        description: pckg.description,
        main: 'dist/index',
        module: 'index',
        'jsnext:main': 'index',
        types: 'index.d.ts',
        files: [...files],
        scripts: {
            'prepublish': 'rollup -c ../../rollup.config.js',
            'test': 'node -r @std/esm test.js',
            'bench': 'node -r @std/esm bench.js'
        },
        repository: {
            type: 'git',
            url: 'git://github.com/Turfjs/turf.git'
        },
        keywords: pckg.keywords,
        author: pckg.author,
        contributors: pckg.contributors,
        license: 'MIT',
        bugs: {
            url: 'https://github.com/Turfjs/turf/issues'
        },
        homepage: 'https://github.com/Turfjs/turf',
        devDependencies: updateDevDependencies(pckg),
        dependencies: updateDependencies(pckg),
        '@std/esm': {
            esm: 'js',
            cjs: true
        }
    };
    write.sync(packagePath, newPckg, {indent: 2});
});

// // Convert ".js" files => ".mjs"
// glob.sync(path.join(__dirname, '..', 'packages', 'turf*', 'index.js')).forEach(filepath => {
//     const outpath = filepath.replace('.js', '.mjs');
//     if (fs.existsSync(outpath)) return;

//     var index = fs.readFileSync(filepath, 'utf8');
//     index = index.replace(/'\.\/'/g, '\'.\'');
//     fs.writeFileSync(outpath, index);
//     fs.removeSync(filepath);
// });

// // Convert ES Module index import
// glob.sync(path.join(__dirname, '..', 'packages', 'turf*', 'test.js')).forEach(filepath => {

//     var index = fs.readFileSync(filepath, 'utf8');
//     index = index.replace(/'.'/g, '\'./index\'');
//     fs.writeFileSync(filepath, index);
// });
