import fs from 'fs';
import path from 'path';
import tape from 'tape';
import { all as fixtures } from 'geojson-fixtures';
import load from 'load-json-file';
import write from 'write-json-file';
import explode from '.';

const directories = {
    in: path.join(__dirname, 'test', 'in') + path.sep,
    out: path.join(__dirname, 'test', 'out') + path.sep
};

// Save input fixtures
if (process.env.REGEN) {
    Object.keys(fixtures).forEach(name => {
        write.sync(directories.in + name + '.json', fixtures[name]);
    });
}

tape('explode - geojson-fixtures', t => {
    fs.readdirSync(directories.in).forEach(filename => {
        const name = filename.replace('.json', '');
        const features = load.sync(directories.in + filename);
        const exploded = explode(features);
        if (process.env.REGEN) { write.sync(directories.out + filename, exploded); }
        t.deepEqual(exploded, load.sync(directories.out + filename), name);
    });
    t.end();
});

tape('explode - preserve properties', t => {
    const filename = 'polygon-with-properties.json';
    const features = load.sync(directories.in + filename);
    const exploded = explode(features);
    if (process.env.REGEN) { write.sync(directories.out + filename, exploded); }
    t.deepEqual(exploded, load.sync(directories.out + filename), 'properties');
    t.end();
});
