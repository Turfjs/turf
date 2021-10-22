import distance from "@turf/distance";
import intersect from "@turf/intersect";
import {
  polygon,
  featureCollection,
  Feature,
  FeatureCollection,
  Units,
  Properties,
  Polygon,
  BBox,
} from "@turf/helpers";

/**
 * Takes a bounding box and the diameter of the cell and returns a {@link FeatureCollection} of flat-topped
 * hexagons or triangles ({@link Polygon} features) aligned in an "odd-q" vertical grid as
 * described in [Hexagonal Grids](http://www.redblobgames.com/grids/hexagons/).
 *
 * @name hexGrid
 * @param {BBox} bbox extent in [minX, minY, maxX, maxY] order
 * @param {number} cellSide length of the side of the the hexagons or triangles, in units. It will also coincide with the
 * radius of the circumcircle of the hexagons.
 * @param {Object} [options={}] Optional parameters
 * @param {string} [options.units='kilometers'] used in calculating cell size, can be degrees, radians, miles, or kilometers
 * @param {Object} [options.properties={}] passed to each hexagon or triangle of the grid
 * @param {Feature<Polygon>} [options.mask] if passed a Polygon or MultiPolygon, the grid Points will be created only inside it
 * @param {boolean} [options.triangles=false] whether to return as triangles instead of hexagons
 * @returns {FeatureCollection<Polygon>} a hexagonal grid
 * @example
 * var bbox = [-96,31,-84,40];
 * var cellSide = 50;
 * var options = {units: 'miles'};
 *
 * var hexgrid = turf.hexGrid(bbox, cellSide, options);
 *
 * //addToMap
 * var addToMap = [hexgrid];
 */
function hexGrid<P = Properties>(
  bbox: BBox,
  cellSide: number,
  options: {
    units?: Units;
    triangles?: boolean;
    properties?: P;
    mask?: Feature<Polygon> | Polygon;
  } = {}
): FeatureCollection<Polygon, P> {
  // Issue => https://github.com/Turfjs/turf/issues/1284
  const clonedProperties = JSON.stringify(options.properties || {});

  const [west, south, east, north] = bbox;
  const centerY = (south + north) / 2;
  const centerX = (west + east) / 2;

  // https://github.com/Turfjs/turf/issues/758
  const xFraction =
    (cellSide * 2) / distance([west, centerY], [east, centerY], options);
  const cellWidth = xFraction * (east - west);
  const yFraction =
    (cellSide * 2) / distance([centerX, south], [centerX, north], options);
  const cellHeight = yFraction * (north - south);
  const radius = cellWidth / 2;

  const hex_width = radius * 2;
  const hex_height = (Math.sqrt(3) / 2) * cellHeight;

  const box_width = east - west;
  const box_height = north - south;

  const x_interval = (3 / 4) * hex_width;
  const y_interval = hex_height;

  // adjust box_width so all hexagons will be inside the bbox
  const x_span = (box_width - hex_width) / (hex_width - radius / 2);
  const x_count = Math.floor(x_span);

  const x_adjust =
    (x_count * x_interval - radius / 2 - box_width) / 2 -
    radius / 2 +
    x_interval / 2;

  // adjust box_height so all hexagons will be inside the bbox
  const y_count = Math.floor((box_height - hex_height) / hex_height);

  let y_adjust = (box_height - y_count * hex_height) / 2;

  const hasOffsetY = y_count * hex_height - box_height > hex_height / 2;
  if (hasOffsetY) {
    y_adjust -= hex_height / 4;
  }

  // Precompute cosines and sines of angles used in hexagon creation for performance gain
  const cosines = [];
  const sines = [];
  for (let i = 0; i < 6; i++) {
    const angle = ((2 * Math.PI) / 6) * i;
    cosines.push(Math.cos(angle));
    sines.push(Math.sin(angle));
  }

  const results = [];
  for (let x = 0; x <= x_count; x++) {
    for (let y = 0; y <= y_count; y++) {
      const isOdd = x % 2 === 1;
      if (y === 0 && isOdd) continue;
      if (y === 0 && hasOffsetY) continue;

      const center_x = x * x_interval + west - x_adjust;
      let center_y = y * y_interval + south + y_adjust;

      if (isOdd) {
        center_y -= hex_height / 2;
      }

      if (options.triangles === true) {
        hexTriangles(
          [center_x, center_y],
          cellWidth / 2,
          cellHeight / 2,
          JSON.parse(clonedProperties),
          cosines,
          sines
        ).forEach(function (triangle) {
          if (options.mask) {
            if (intersect(options.mask, triangle)) results.push(triangle);
          } else {
            results.push(triangle);
          }
        });
      } else {
        const hex = hexagon(
          [center_x, center_y],
          cellWidth / 2,
          cellHeight / 2,
          JSON.parse(clonedProperties),
          cosines,
          sines
        );
        if (options.mask) {
          if (intersect(options.mask, hex)) results.push(hex);
        } else {
          results.push(hex);
        }
      }
    }
  }

  return featureCollection(results) as FeatureCollection<Polygon, P>;
}

/**
 * Creates hexagon
 *
 * @private
 * @param {Array<number>} center of the hexagon
 * @param {number} rx half hexagon width
 * @param {number} ry half hexagon height
 * @param {Object} properties passed to each hexagon
 * @param {Array<number>} cosines precomputed
 * @param {Array<number>} sines precomputed
 * @returns {Feature<Polygon>} hexagon
 */
function hexagon(
  center: number[],
  rx: number,
  ry: number,
  properties: Properties,
  cosines: number[],
  sines: number[]
) {
  const vertices = [];
  for (let i = 0; i < 6; i++) {
    const x = center[0] + rx * cosines[i];
    const y = center[1] + ry * sines[i];
    vertices.push([x, y]);
  }
  //first and last vertex must be the same
  vertices.push(vertices[0].slice());
  return polygon([vertices], properties);
}

/**
 * Creates triangles composing an hexagon
 *
 * @private
 * @param {Array<number>} center of the hexagon
 * @param {number} rx half triangle width
 * @param {number} ry half triangle height
 * @param {Object} properties passed to each triangle
 * @param {Array<number>} cosines precomputed
 * @param {Array<number>} sines precomputed
 * @returns {Array<Feature<Polygon>>} triangles
 */
function hexTriangles(
  center: number[],
  rx: number,
  ry: number,
  properties: Properties,
  cosines: number[],
  sines: number[]
) {
  const triangles = [];
  for (let i = 0; i < 6; i++) {
    const vertices = [];
    vertices.push(center);
    vertices.push([center[0] + rx * cosines[i], center[1] + ry * sines[i]]);
    vertices.push([
      center[0] + rx * cosines[(i + 1) % 6],
      center[1] + ry * sines[(i + 1) % 6],
    ]);
    vertices.push(center);
    triangles.push(polygon([vertices], properties));
  }
  return triangles;
}

export default hexGrid;
