import test from 'tape';
import glob from 'glob';
import path from 'path';
import load from 'load-json-file';
import write from 'write-json-file';
import { featureCollection } from '@turf/helpers';
import { featureEach } from '@turf/meta';
import standardDeviationalEllipse from '.';

test('turf-standard-deviational-ellipse', t => {
    glob.sync(path.join(__dirname, 'test', 'in', '*.json')).forEach(filepath => {
        // Define params
        const {name} = path.parse(filepath);
        const geojson = load.sync(filepath);
        let points = [];
        featureEach(geojson, point => points.push(point));
        const esriEllipse = points.pop();
        const features = featureCollection(points);
        const weight = "weight";
        const properties = {
            "stroke": "#00aa00", 
            "stroke-width": 3,
            "stroke-opacity": 1,
            "fill-opacity": 0,
            "fill": "#fff"
        };
        const results = featureCollection([
            esriEllipse,
            standardDeviationalEllipse(features, {weight, properties})
        ]);

        // Save to file
        const out = filepath.replace(path.join('test', 'in'), path.join('test', 'out'));
        if (process.env.REGEN) write.sync(out, results);
        t.deepEqual(results, load.sync(out), name);
    });
    t.end();
});
