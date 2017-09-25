#!/usr/bin/env node

const fs = require('fs');
const load = require('load-json-file');
const write = require('write-json-file');
const path = require('path');
const glob = require('glob');
const {dependencies} = require('../packages/turf/package.json');

function entries(obj) {
    return Object.keys(obj || {}).map(key => [key, obj[key]]);
}

function updateDevDependencies(pckg) {
    const devDependencies = {};
    new Map(entries(pckg.devDependencies))
        .set('rollup', '*')
        .set('tape', '*')
        .set('benchmark', '*').forEach((version, name) => {
            // Change all devDependencies to *
            devDependencies[name] = '*';
        });
    return devDependencies;
}

// Update package.json
Object.keys(dependencies).forEach(name => {
    const basename = name.replace('@turf/', '');
    const packagePath = path.join(__dirname, '..', 'packages', 'turf-' + basename, 'package.json');
    const pckg = load.sync(packagePath);
    const files = new Set(pckg.files);
    files.add('index.js');
    files.add('index.mjs');
    files.delete('dist');
    files.delete('index.cjs.js');
    files.delete('index.cjs');

    const newPckg = {
        name: pckg.name,
        version: pckg.version,
        description: pckg.description,
        main: 'index.js',
        module: 'index.mjs',
        'jsnext:main': 'index.mjs',
        types: pckg.types,
        files: [...files],
        scripts: {
            'pretest': 'rollup -c ../../rollup.config.js',
            'test': 'node test.js',
            'bench': 'node bench.js'
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
        dependencies: pckg.dependencies
    };
    write.sync(packagePath, newPckg, {indent: 2});
});

// Update test.js
glob.sync(path.join(__dirname, '..', 'packages', 'turf-*', 'test.js')).forEach(filepath => {
    var test = fs.readFileSync(filepath, 'utf8');
    test = test.replace(/'.\/'/g, '\'.\'');
    fs.writeFileSync(filepath.replace('.js', '.mjs'), test);
});

glob.sync(path.join(__dirname, '..', 'packages', 'turf-*', 'index.js')).forEach(filepath => {
    var index = fs.readFileSync(filepath, 'utf8');
    index = index.replace(/'.\/'/g, '\'.\'');
    fs.writeFileSync(filepath.replace('.js', '.mjs'), index);
});
