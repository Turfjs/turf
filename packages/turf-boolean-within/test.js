import glob from 'glob';
import path from 'path';
import test from 'tape';
import load from 'load-json-file';
import shapely from 'boolean-shapely';
import booleanJSTS from 'boolean-jsts';
import within from '.';

test('turf-boolean-within', t => {
    // True Fixtures
    glob.sync(path.join(__dirname, 'test', 'true', '**', '*.geojson')).forEach(filepath => {
        const name = path.parse(filepath).name;
        const geojson = load.sync(filepath);
        const feature1 = geojson.features[0];
        const feature2 = geojson.features[1];
        const result = within(feature1, feature2);
        if (process.env.JSTS) t.true(booleanJSTS('within', feature1, feature2), '[true] JSTS - ' + name);

        if (process.env.SHAPELY) shapely.within(feature1, feature2).then(result => t.true(result, '[true] shapely - ' + name));
        t.true(result, '[true] ' + name);
    });
    // False Fixtures
    glob.sync(path.join(__dirname, 'test', 'false', '**', '*.geojson')).forEach(filepath => {
        const name = path.parse(filepath).name;
        const geojson = load.sync(filepath);
        const feature1 = geojson.features[0];
        const feature2 = geojson.features[1];
        const result = within(feature1, feature2);
        if (process.env.JSTS) t.false(booleanJSTS('within', feature1, feature2), '[false] JSTS - ' + name);

        if (process.env.SHAPELY) shapely.within(feature1, feature2).then(result => t.false(result, '[false] shapely - ' + name));
        t.false(result, '[false] ' + name);
    });
    t.end();
});
