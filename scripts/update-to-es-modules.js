#!/usr/bin/env node

const load = require('load-json-file');
const write = require('write-json-file');
const path = require('path');
const glob = require('glob');

// Update package.json
glob.sync(path.join(__dirname, '..', 'packages', 'turf-*', 'package.json')).forEach(packagePath => {
    const pckg = load.sync(packagePath);
    const files = new Set(pckg.files);
    files.add('index.js');
    files.add('index.d.ts');
    files.add('main.js');
    files.delete('main.min.js');
    files.delete('dist');
    files.delete('dist/index.js');
    files.delete('index.es5.js');
    files.delete('index.mjs');
    files.delete('index.cjs.js');
    files.delete('index.cjs');

    const newPckg = {
        name: pckg.name,
        version: pckg.version,
        description: pckg.description,
        main: 'main',
        module: 'index',
        'jsnext:main': 'index',
        types: 'index.d.ts',
        files: [...files],
        scripts: {
            'pretest': 'rollup -c ../../rollup.config.js',
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
        devDependencies: pckg.devDependencies,
        dependencies: pckg.dependencies,
        '@std/esm': {
            esm: 'js',
            cjs: true
        }
    };
    // Update package.json
    write.sync(packagePath, newPckg, {indent: 2});
});
