import { Feature, GeoJsonProperties, Polygon } from "geojson";
import { point } from "@turf/helpers";
import { sector } from "./index.js";

const center = point([-75.343, 39.984]);
const units = "kilometers";
const bearing1 = 10;
const bearing2 = -30;
const radius = 5;
const steps = 10;

sector(center, radius, bearing1, bearing2);
sector(center, radius, bearing1, bearing2, { steps });
sector(center, radius, bearing1, bearing2, { steps, units });

// Default properties type when none are provided
const noProps: Feature<Polygon, GeoJsonProperties> = sector(
  center,
  radius,
  bearing1,
  bearing2
);

// Properties type is inferred from options.properties
const inferred = sector(center, radius, bearing1, bearing2, {
  properties: { foo: "bar" },
});
const foo: string = inferred.properties.foo;

// Properties type can be passed explicitly
const explicit: Feature<Polygon, { id: number }> = sector<{ id: number }>(
  center,
  radius,
  bearing1,
  bearing2,
  { steps, units, properties: { id: 1 } }
);
