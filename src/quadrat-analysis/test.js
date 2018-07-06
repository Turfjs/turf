const test = require('tape');
const glob = require('glob');
const path = require('path');
const load = require('load-json-file');
const write = require('write-json-file');
const bbox = require('../bbox').default;
const centroid = require('../centroid').default;
const squareGrid = require('../square-grid').default;
const bboxPolygon = require('../bbox-polygon').default;
const { randomPoint } = require('../random');
const { featureCollection } = require('../helpers');
const quadratAnalysis = require('./').default;

test('turf-quadrat-analysis geojson file', t => {
  const futianBboxPath = path.join(__dirname, 'test', 'in', 'futian_bbox.json');
  const futianPointPath = path.join(__dirname, 'test', 'in', 'futian_random_point.json');
  const shenzhenBboxPath = path.join(__dirname, 'test', 'in', 'shenzhen_bbox.json');

  const futianBbox = load.sync(futianBboxPath);
  const futianPoint = load.sync(futianPointPath);
  const shenzhenBbox = load.sync(shenzhenBboxPath);

  const resultFutian = quadratAnalysis(futianPoint, {
    studyBbox: bbox(futianBbox),
    confidenceLevel: 20
  });

  const resultShenzhen = quadratAnalysis(futianPoint, {
    studyBbox: bbox(shenzhenBbox),
    confidenceLevel: 20
  });

  t.ok(resultFutian.isRandom, 'ramdom pattern ok');
  t.ok(resultFutian.maxAbsoluteDifference < resultFutian.criticalValue, 'random pattern maxAbsoluteDifference < criticalValue');

  t.ok(!resultShenzhen.isRandom, 'cluster pattern ok');
  t.ok(resultShenzhen.maxAbsoluteDifference > resultShenzhen.criticalValue, 'cluster pattern maxAbsoluteDifference > criticalValue')

  t.end();

});

test('turf-quadrat-analysis random point', t => {
  // random
  const smallBbox = [-1, -1, 1, 1];
  const randomPointSet = randomPoint(400, { bbox: smallBbox });
  const result1 = quadratAnalysis(randomPointSet, {
    studyBbox: smallBbox,
    confidenceLevel: 20
  });

  t.ok(result1.isRandom, 'random pattern ok');
  t.ok(result1.maxAbsoluteDifference < result1.criticalValue, 'random pattern maxAbsoluteDifference < criticalValue');

  // cluster
  const bigBbox = [-3, -3, 3, 3];
  const result2 = quadratAnalysis(randomPointSet, {
    studyBbox: bigBbox,
    confidenceLevel: 20
  });

  t.ok(!result2.isRandom, 'cluster pattern ok');
  t.ok(result2.maxAbsoluteDifference > result2.criticalValue, 'cluster pattern maxAbsoluteDifference > criticalValue');

  // uniform
  const smallGrid = squareGrid(smallBbox, 0.1, {
    units: 'degrees'
  })
  let uniformPointSet = [];
  smallGrid.features.map(function (feature) {
    uniformPointSet.push(centroid(feature));
  });
  uniformPointSet = featureCollection(uniformPointSet);
  const result3 = quadratAnalysis(uniformPointSet, {
    studyBbox: smallBbox,
    confidenceLevel: 20
  });

  t.ok(!result3.isRandom, 'uniform pattern ok');
  t.ok(result3.maxAbsoluteDifference > result3.criticalValue, 'uniform pattern maxAbsoluteDifference > criticalValue');

  const randomPointSetPath = path.join(__dirname, 'test', 'out', 'randomPoint.json');
  const uniformPointSetPath = path.join(__dirname, 'test', 'out', 'uniformPoint.json');
  const smallBboxPath = path.join(__dirname, 'test', 'out', 'smallBox.json');
  const bigBboxPath = path.join(__dirname, 'test', 'out', 'bigBox.json');
  const smallGridPath = path.join(__dirname, 'test', 'out', 'smallGrid.json');

  // console.log(result1, result2, result3);

  if (process.env.REGEN) {
    write.sync(randomPointSetPath, randomPointSet);
    write.sync(uniformPointSetPath, uniformPointSet);
    write.sync(smallBboxPath, bboxPolygon(smallBbox));
    write.sync(bigBboxPath, bboxPolygon(bigBbox));
    write.sync(smallGridPath, smallGrid);
  }

  t.end();

});
