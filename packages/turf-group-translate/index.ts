import { AllGeoJSON } from "@turf/helpers";
import { centerOfMass } from "@turf/center-of-mass";

function groupTranslate<T extends AllGeoJSON>(
  geojson: any,
  scaleX: number,
  scaleY: number,
  angle: number
): T {
  //Input validation
  if (!geojson) throw new Error("geojson is invalid");

  if (
    geojson.geometry.type !== "MultiPolygon" &&
    geojson.geometry.type !== "MultiLineString" &&
    geojson.geometry.type !== "MultiPoint"
  )
    throw new Error(
      "Only Grouped Geometry allowed. etc. MultiPolygon/MultiLineString/MultiPoint"
    );

  if (scaleX === undefined || scaleX === null || isNaN(scaleX))
    throw new Error("scaleX is required");
  if (scaleY === undefined || scaleY === null || isNaN(scaleY))
    throw new Error("scaleY is required");
  if (angle === undefined || angle === null || isNaN(angle))
    throw new Error("angle is required");

  // Shortcut no-translate
  if (scaleX === 1 && scaleY === 1) return geojson;

  let pivot = centerOfMass(geojson).geometry.coordinates;

  const angleRadian = (angle * Math.PI) / 180;
  const cos = Math.cos(angleRadian);
  const sin = Math.sin(angleRadian);

  function transformCoord([x, y]: [number, number]) {
    // 1️⃣ translate to pivot
    const dx = x - pivot[0];
    const dy = y - pivot[1];

    // 2️⃣ rotate -θ
    const rx = dx * cos + dy * sin;
    const ry = -dx * sin + dy * cos;

    // 3️⃣ scale
    const sx = rx * scaleX;
    const sy = ry * scaleY;

    // 4️⃣ rotate +θ
    const fx = sx * cos - sy * sin;
    const fy = sx * sin + sy * cos;

    // 5️⃣ translate back
    return [fx + pivot[0], fy + pivot[1]];
  }

  function walk(coords: any): any {
    return coords.map((c: any) =>
      typeof c[0] === "number" ? transformCoord(c) : walk(c)
    );
  }

  return {
    ...geojson,
    geometry: {
      ...geojson.geometry,
      coordinates: walk(geojson.geometry.coordinates),
    },
  };
}

export { groupTranslate };
export default groupTranslate;
