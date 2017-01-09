import * as circle from '../index'

const center: GeoJSON.Feature<GeoJSON.Point> = {
    type: "Feature",
    properties: {},
    geometry: {type: "Point", coordinates: [-75.343, 39.984]}
};
const unit = "kilometers";
const radius = 5;
const steps = 10;

circle(center, radius);
circle(center, radius, steps);
circle(center, radius, steps, unit);