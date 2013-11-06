#!/usr/bin/env node

var insert = require('../')(process.argv.slice(2));
var JSONStream = require('JSONStream');

var parse = JSONStream.parse([ true ]);
var stringify = JSONStream.stringify();

stringify.pipe(process.stdout);
parse.pipe(insert).pipe(stringify);

process.stdin.pipe(parse);
process.stdin.resume();
