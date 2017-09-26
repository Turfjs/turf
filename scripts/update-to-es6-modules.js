#!/usr/bin/env node

const fs = require('fs-extra');
const load = require('load-json-file');
const write = require('write-json-file');
const path = require('path');
const glob = require('glob');
const {dependencies} = require('../packages/turf/package.json');

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
Object.keys(dependencies).forEach(name => {
    const basename = name.replace('@turf/', '');
    const packagePath = path.join(__dirname, '..', 'packages', 'turf-' + basename, 'package.json');
    const pckg = load.sync(packagePath);
    const files = new Set(pckg.files);
    files.add('index.es5.js');
    files.add('index.js');
    files.delete('dist');
    files.delete('index.cjs.js');
    files.delete('index.cjs');
    files.delete('index.mjs');

    const newPckg = {
        name: pckg.name,
        version: pckg.version,
        description: pckg.description,
        main: 'index.es5.js',
        module: 'index.js',
        'jsnext:main': 'index.js',
        types: pckg.types,
        files: [...files],
        scripts: {
            'pretest': 'rollup -c ../../rollup.config.js',
            'test': 'node test.es5.js',
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
        dependencies: updateDependencies(pckg)
    };
    write.sync(packagePath, newPckg, {indent: 2});
});

// Convert ".mjs" files to ".js"
glob.sync(path.join(__dirname, '..', 'packages', 'turf*', '*.mjs')).forEach(filepath => {
    var index = fs.readFileSync(filepath, 'utf8');
    index = index.replace(/'.\/'/g, '\'.\'');
    fs.writeFileSync(filepath.replace('.mjs', '.js'), index);
    fs.removeSync(filepath);
});
