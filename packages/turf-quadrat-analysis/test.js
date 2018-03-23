import test from 'tape';
import glob from 'glob';
import path from 'path';
import load from 'load-json-file';
import write from 'write-json-file';
import quadratAnalysis from '.';

import bbox from '@turf/bbox';
import {randomPoint} from '@turf/random';

test('turf-quadrat-analysis', t => {

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

  t.ok(resultFutian.isRandom);
  t.ok(resultFutian.maxAbsoluteDifference < resultFutian.criticalValue);

  t.ok(!resultShenzhen.isRandom);
  t.ok(resultShenzhen.maxAbsoluteDifference > resultShenzhen.criticalValue)

  t.end();

});

test('turf-quadrat-analysis 1', t=> {

  const smallBbox = [-10, -10, 10, 10];
  const dataset = randomPoint(1000, { bbox: smallBbox });
  const result1 = quadratAnalysis(dataset, {
    studyBbox: smallBbox,
    confidenceLevel: 20
  });

  t.ok(result1.isRandom);
  t.ok(result1.maxAbsoluteDifference < result1.criticalValue);
  
    
  const bigBbox = [-30, -30, 30, 30];
  const result2 = quadratAnalysis(dataset, {
    studyBbox: bigBbox,
    confidenceLevel: 20
  });
  t.ok(result2.criticalValue > 0.05);
  t.ok(!result2.isRandom);
  t.ok(result2.maxAbsoluteDifference > result2.criticalValue)

  t.end();
});
