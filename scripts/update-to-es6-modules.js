#!/usr/bin/env node

const load = require('load-json-file');
const write = require('write-json-file');
const path = require('path');
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

Object.keys(dependencies).forEach(name => {
    const basename = name.replace('@turf/', '');
    const packagePath = path.join(__dirname, '..', 'packages', 'turf-' + basename, 'package.json');
    const pckg = load.sync(packagePath);
    const newPckg = {
        name: pckg.name,
        version: pckg.version,
        description: pckg.description,
        main: 'index.cjs',
        module: 'index.js',
        'jsnext:main': 'index.js',
        types: pckg.types,
        files: [...new Set(pckg.files).add('dist')],
        scripts: {
            'pretest': 'rollup -c ../../rollup.config.js',
            'test': 'node test.cjs',
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
