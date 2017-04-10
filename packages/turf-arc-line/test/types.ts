import * as arcline from '../index'

const center: GeoJSON.Feature<GeoJSON.Point> = {
    type: "Feature",
    properties: {},
    geometry: {type: "Point", coordinates: [-75.343, 39.984]}
};
const unit = "kilometers";
const bearing1 = 10;
const bearing2 = -30;
const radius = 5;
const steps = 10;

arcline(center, radius, bearing1, bearing2);
arcline(center, radius, bearing1, bearing2, steps);
arcline(center, radius, bearing1, bearing2, steps, unit);