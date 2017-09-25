import test from 'tape';
import glob from 'glob';
import path from 'path';
import load from 'load-json-file';
import shapely from 'boolean-shapely';
import crosses from '.';

test('turf-boolean-crosses', t => {
    // True Fixtures
    glob.sync(path.join(__dirname, 'test', 'true', '**', '*.geojson')).forEach(filepath => {
        const name = path.parse(filepath).name;
        const geojson = load.sync(filepath);
        const feature1 = geojson.features[0];
        const feature2 = geojson.features[1];
        if (process.env.SHAPELY) shapely.crosses(feature1, feature2).then(result => t.true(result, '[true] shapely - ' + name));
        t.true(crosses(feature1, feature2), '[true] ' + name);
    });
    // False Fixtures
    glob.sync(path.join(__dirname, 'test', 'false', '**', '*.geojson')).forEach(filepath => {
        const name = path.parse(filepath).name;
        const geojson = load.sync(filepath);
        const feature1 = geojson.features[0];
        const feature2 = geojson.features[1];
        if (process.env.SHAPELY) shapely.crosses(feature1, feature2).then(result => t.false(result, '[false] shapely - ' + name));
        t.false(crosses(feature1, feature2), '[false] ' + name);
    });
    t.end();
});
