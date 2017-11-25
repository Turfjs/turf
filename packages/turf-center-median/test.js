import test from 'tape';
import glob from 'glob';
import path from 'path';
import load from 'load-json-file';
import write from 'write-json-file';
import { featureCollection } from '@turf/helpers';
import centerMean from '@turf/center-mean';
import centerMedian from '.';

test('turf-center-median', t => {
    glob.sync(path.join(__dirname, 'test', 'in', '*.json')).forEach(filepath => {
        // Define params
        const {name} = path.parse(filepath);
        const geojson = load.sync(filepath);
        const weight = geojson.properties.weight;
        let meanCenter = centerMean(geojson, {weight});
        meanCenter.properties['marker-color'] = '#a00';
        meanCenter.properties['marker-symbol'] = 'cross';
        let medianCenter = centerMedian(geojson, {weight});
        medianCenter.properties['marker-color'] = '#0a0';
        medianCenter.properties['marker-symbol'] = 'cross';
        const results = featureCollection([
          geojson,
          meanCenter,
          medianCenter
        ]);
        const out = filepath.replace(path.join('test', 'in'), path.join('test', 'out'));
        if (process.env.REGEN) write.sync(out, results);
        t.deepEqual(results, load.sync(out), name);
    });


    t.end();
});
