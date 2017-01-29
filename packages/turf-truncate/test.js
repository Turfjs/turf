const test = require('tape');
const truncate = require('./');
const fs = require('fs');
const path = require('path');

const directories = {
  in: path.join(__dirname, 'test', 'in'),
  out: path.join(__dirname, 'test', 'out')
}

function save (directory, filename, features) {
  return fs.writeFileSync(path.join(directory, filename), JSON.stringify(features, null, 2))
}

function read (directory, filename) {
  return JSON.parse(fs.readFileSync(path.join(directory, filename), 'utf8'))
}

test('truncate', (t) => {
  const point = read(directories.in, 'point.json');
  const points = read(directories.in, 'points.json');
  const pointElevation = read(directories.in, 'pointElevation.json');
  const polygon = read(directories.in, 'polygon.json');
  const polygons = read(directories.in, 'polygons.json');

  const pointTruncate = truncate(point);
  const pointsTruncate = truncate(points);
  const pointElevationTruncate = truncate(pointElevation, 6, true);
  const polygonTruncate = truncate(polygon);
  const polygonsTruncate = truncate(polygons);
  const polygonsTruncateDecimal3 = truncate(polygons, 3);

  if (process.env.REGEN) {
    save(directories.out, 'pointTruncate.json', pointTruncate);
    save(directories.out, 'pointsTruncate.json', pointsTruncate);
    save(directories.out, 'pointElevationTruncate.json', pointElevationTruncate);
    save(directories.out, 'polygonTruncate.json', polygonTruncate);
    save(directories.out, 'polygonsTruncate.json', polygonsTruncate);
    save(directories.out, 'polygonsTruncateDecimal3.json', polygonsTruncateDecimal3);
  }

  t.deepEqual(pointTruncate, read(directories.out, 'pointTruncate.json'), 'pointTruncate');
  t.deepEqual(pointsTruncate, read(directories.out, 'pointsTruncate.json'), 'pointsTruncate');
  t.deepEqual(pointElevationTruncate, read(directories.out, 'pointElevationTruncate.json'), 'pointElevationTruncate');
  t.deepEqual(polygonTruncate, read(directories.out, 'polygonTruncate.json'), 'polygonTruncate');
  t.deepEqual(polygonsTruncate, read(directories.out, 'polygonsTruncate.json'), 'polygonsTruncate');
  t.deepEqual(polygonsTruncateDecimal3, read(directories.out, 'polygonsTruncateDecimal3.json'), 'polygonsTruncateDecimal3');
  t.end();
});
