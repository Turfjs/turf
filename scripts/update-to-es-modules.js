#!/usr/bin/env node

const load = require('load-json-file');
const write = require('write-json-file');
const path = require('path');
const glob = require('glob');

function entries(obj) {
    return Object.keys(obj || {}).map(key => [key, obj[key]]);
}

function updateDependencies(pckg) {
    const dependencies = {};
    new Map(entries(pckg.dependencies))
        .forEach((version, name) => {
            // Update dependencies to v5.0.0
            switch (name) {
            case '@turf/point-on-line':
            case '@turf/circle':
            case '@turf/bbox':
            case '@turf/linestring-to-polygon':
            case '@turf/polygon-to-linestring':
            case '@turf/point-to-line-distance':
            case '@turf/rhumb-bearing':
            case '@turf/rhumb-destination':
            case '@turf/rhumb-distance':
            case '@turf/bearing':
            case '@turf/destination':
            case '@turf/distance':
            case '@turf/line-intersect':
            case '@turf/line-segment':
            case '@turf/helpers':
            case '@turf/invariant':
            case '@turf/meta':
            case '@turf/line-overlap':
                dependencies[name] = '^5.0.0';
                break;
            case 'jsts':
                dependencies[name] = '1.4.0';
                break;
            case 'geojson-rbush':
                dependencies[name] = '2.1.0';
                break;
            default:
                dependencies[name] = version;
            }
        });
    return dependencies;
}

function updateDevDependencies(pckg) {
    const devDependencies = {};
    const dev = new Map(entries(pckg.devDependencies));
    dev.delete('rollup-plugin-uglify', '*');
    dev.delete('uglify-js', '*');
    dev.set('rollup', '*')
        .set('tape', '*')
        .set('@std/esm', '*')
        .set('benchmark', '*').forEach((version, name) => {
            // Update dependencies to v5.0.0-alpha
            switch (name) {
            case '@turf/helpers':
            case '@turf/invariant':
            case '@turf/meta':
                devDependencies[name] = '*';
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
        devDependencies: updateDevDependencies(pckg),
        dependencies: updateDependencies(pckg),
        '@std/esm': {
            esm: 'js',
            cjs: true
        }
    };
    // Update package.json
    write.sync(packagePath, newPckg, {indent: 2});
});
