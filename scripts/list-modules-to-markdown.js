#!/usr/bin/env node

const pckg = require('../packages/turf/package.json');

Object.keys(pckg.dependencies).forEach(name => {
    const basename = name.replace('@turf/', '');
    const url = `https://github.com/Turfjs/turf/tree/master/packages/turf-${basename}`;
    console.log(`- [ ] [${name}](${url})`);
});
