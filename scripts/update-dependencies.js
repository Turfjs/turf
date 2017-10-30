#!/usr/bin/env node

const load = require('load-json-file');
const write = require('write-json-file');
const path = require('path');
const glob = require('glob');

// Update package.json
glob.sync(path.join(__dirname, '..', 'packages', 'turf-*', 'package.json')).forEach(packagePath => {
    const pckg = load.sync(packagePath);
    pckg.dependencies = updateDependencies(pckg);
    pckg.devDependencies = updateDevDependencies(pckg);
    write.sync(packagePath, pckg, {indent: 2});
});

function entries(obj) {
    return Object.keys(obj || {}).map(key => [key, obj[key]]);
}

function updateDependencies(pckg) {
    const dependencies = {};
    new Map(entries(pckg.dependencies))
        .forEach((version, name) => {
            // Update dependencies to v5.0.0
            switch (name) {
            case '@turf/nearest-point-on-line':
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
            case '@turf/bbox-polygon':
            case '@turf/envelope':
            case '@turf/inside':
            case '@turf/polygonize':
            case '@turf/meta':
            case '@turf/line-overlap':
            case '@turf/clone':
            case '@turf/nearest-point':
            case '@turf/truncate':
                dependencies[name] = '5.x';
                break;
            case 'jsts':
                dependencies[name] = '1.4.0';
                break;
            case 'geojson-rbush':
                dependencies[name] = '2.1.0';
                break;
            case '@turf/line-distance':
            case '@turf/point-on-line':
            case '@turf/nearest':
                throw new Error(`${pckg.name} module has invalid dependency ${name}`);
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
            devDependencies[name] = '*';
        });
    return devDependencies;
}
