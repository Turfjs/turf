const PythonShell = require('python-shell');

/**
 * Boolean Shapely helper script
 *
 * @param {string} operation ("crosses", "contains")
 * @param {Geometry|Feature<any>} feature1 GeoJSON Feature
 * @param {Geometry|Feature<any>} feature2 GeoJSON Feature
 * @returns {Promise<Boolean>} true/false
 * @example
 * const operation = 'crosses';
 * const feature1 = lineString([[-2, 2], [1, 1]]);
 * const feature2 = lineString([[1, 1], [1, 2], [1, 3], [1, 4]]);
 *
 * booleanShapely(operation, feature1, feature2)
 *     .then(result => console.log(result));
 */
module.exports = function (operation, feature1, feature2) {
    // Convert Feature to Geometry
    if (feature1.geometry) feature1 = feature1.geometry;
    if (feature2.geometry) feature2 = feature2.geometry;

    const options = {
        scriptPath: __dirname,
        args: [
            operation,
            JSON.stringify(feature1),
            JSON.stringify(feature2)
        ]
    };
    return new Promise((resolve, reject) => {
        const pyshell = new PythonShell('boolean-shapely.py', options);
        pyshell.on('message', message => {
            return resolve(message === 'True');
        });
        pyshell.end(error => {
            if (error) throw error;
            return reject(error);
        });
    });
};
