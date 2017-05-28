const test = require('tape'),
  { featureCollection, lineString, polygon } = require('@turf/helpers'),
  polygonize = require('./'),
  fs = require('fs'),
  path = require('path');

const directories = {
  in: path.join(__dirname, 'test', 'in') + path.sep,
  out: path.join(__dirname, 'test', 'out') + path.sep,
};

function getFullPath(filename, type='in') {
  return path.join(directories[type], filename);
}

function readJsonFile(filename, type='in') {
  try {
    return JSON.parse(fs.readFileSync(getFullPath(filename, type)));
  } catch(e) {
    if (e.code !== 'ENOENT')
      throw e;
    return undefined;
  }
}

function writeJsonFile(filename, data, type='out') {
  fs.writeFileSync(getFullPath(filename, type), JSON.stringify(data));
}

fs.readdirSync(directories.in)
  .filter(filename => !filename.startsWith('.'))
  .map(filename => {
    return {
      filename,
      name: path.parse(filename).name,
      input: readJsonFile(filename, 'in'),
      output: readJsonFile(filename, 'out'),
    }
  })
  .forEach(({filename, name, input, output}) => {
    test(`turf-polygonize :: ${name}`, t => {
      const result = polygonize(input);
      if (output) {
        t.deepEqual(result, output);
      } else {
        t.skip(`${name} not found :: writing`);
        writeJsonFile(filename, result);
      }
      t.end();
    });
  });
