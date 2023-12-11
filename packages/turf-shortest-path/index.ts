import {
  Polygon,
  Feature,
  FeatureCollection,
  LineString,
  Geometry,
  Point,
} from "geojson";
import { bbox } from "@turf/bbox";
import { booleanPointInPolygon } from "@turf/boolean-point-in-polygon";
import { distance } from "@turf/distance";
import { transformScale as scale } from "@turf/transform-scale";
import { cleanCoords } from "@turf/clean-coords";
import { bboxPolygon } from "@turf/bbox-polygon";
import { getCoord, getGeom } from "@turf/invariant";
import {
  Coord,
  Units,
  point,
  isNumber,
  lineString,
  isObject,
  featureCollection,
  feature,
} from "@turf/helpers";
import { Graph, GridNode, astar } from "./lib/javascript-astar";

/**
 * Returns the shortest {@link LineString|path} from {@link Point|start} to {@link Point|end} without colliding with
 * any {@link Feature} in {@link FeatureCollection<Polygon>| obstacles}
 *
 * @name shortestPath
 * @param {Coord} start point
 * @param {Coord} end point
 * @param {Object} [options={}] optional parameters
 * @param {Geometry|Feature|FeatureCollection<Polygon>} [options.obstacles] areas which path cannot travel
 * @param {string} [options.units='kilometers'] unit in which resolution & minimum distance will be expressed in; it can be degrees, radians, miles, kilometers, ...
 * @param {number} [options.resolution=100] distance between matrix points on which the path will be calculated
 * @returns {Feature<LineString>} shortest path between start and end
 * @example
 * var start = [-5, -6];
 * var end = [9, -6];
 * var options = {
 *   obstacles: turf.polygon([[[0, -7], [5, -7], [5, -3], [0, -3], [0, -7]]])
 * };
 *
 * var path = turf.shortestPath(start, end, options);
 *
 * //addToMap
 * var addToMap = [start, end, options.obstacles, path];
 */
function shortestPath(
  start: Coord,
  end: Coord,
  options: {
    obstacles?: Polygon | Feature<Polygon> | FeatureCollection<Polygon>;
    units?: Units;
    resolution?: number;
  } = {}
): Feature<LineString> {
  // Optional parameters
  options = options || {};
  if (!isObject(options)) throw new Error("options is invalid");
  let obstacles = options.obstacles || featureCollection([]);
  let resolution = options.resolution || 100;

  // validation
  if (!start) throw new Error("start is required");
  if (!end) throw new Error("end is required");
  if (resolution && (!isNumber(resolution) || resolution <= 0))
    throw new Error("options.resolution must be a number, greater than 0");

  // Normalize Inputs
  const startCoord = getCoord(start);
  const endCoord = getCoord(end);
  start = point(startCoord);
  end = point(endCoord);

  // Handle obstacles
  if (obstacles.type === "FeatureCollection") {
    if (obstacles.features.length === 0) {
      return lineString([startCoord, endCoord]);
    }
  } else if (obstacles.type === "Polygon") {
    obstacles = featureCollection([feature(getGeom(obstacles))]);
  } else {
    throw new Error("invalid obstacles");
  }

  // define path grid area
  const collection: FeatureCollection<Geometry> = obstacles;
  collection.features.push(start);
  collection.features.push(end);
  const box = bbox(scale(bboxPolygon(bbox(collection)), 1.15)); // extend 15%
  const [west, south, east, north] = box;

  const width = distance([west, south], [east, south], options);
  const division = width / resolution;

  collection.features.pop();
  collection.features.pop();

  const xFraction = division / distance([west, south], [east, south], options);
  const cellWidth = xFraction * (east - west);
  const yFraction = division / distance([west, south], [west, north], options);
  const cellHeight = yFraction * (north - south);

  const bboxHorizontalSide = east - west;
  const bboxVerticalSide = north - south;
  const columns = Math.floor(bboxHorizontalSide / cellWidth);
  const rows = Math.floor(bboxVerticalSide / cellHeight);
  // adjust origin of the grid
  const deltaX = (bboxHorizontalSide - columns * cellWidth) / 2;
  const deltaY = (bboxVerticalSide - rows * cellHeight) / 2;

  // loop through points only once to speed up process
  // define matrix grid for A-star algorithm
  const pointMatrix: string[][] = [];
  const matrix: number[][] = [];

  let closestToStart: GridNode;
  let closestToEnd: GridNode;
  let minDistStart = Infinity;
  let minDistEnd = Infinity;
  let currentY = north - deltaY;
  let r = 0;
  while (currentY >= south) {
    // var currentY = south + deltaY;
    const matrixRow = [];
    const pointMatrixRow = [];
    let currentX = west + deltaX;
    let c = 0;
    while (currentX <= east) {
      const pt = point([currentX, currentY]);
      const isInsideObstacle = isInside(pt, obstacles);
      // feed obstacles matrix
      matrixRow.push(isInsideObstacle ? 0 : 1); // with javascript-astar
      // matrixRow.push(isInsideObstacle ? 1 : 0); // with astar-andrea
      // map point's coords
      pointMatrixRow.push(currentX + "|" + currentY);
      // set closest points
      const distStart = distance(pt, start);
      // if (distStart < minDistStart) {
      if (!isInsideObstacle && distStart < minDistStart) {
        minDistStart = distStart;
        closestToStart = { x: c, y: r };
      }
      const distEnd = distance(pt, end);
      // if (distEnd < minDistEnd) {
      if (!isInsideObstacle && distEnd < minDistEnd) {
        minDistEnd = distEnd;
        closestToEnd = { x: c, y: r };
      }
      currentX += cellWidth;
      c++;
    }
    matrix.push(matrixRow);
    pointMatrix.push(pointMatrixRow);
    currentY -= cellHeight;
    r++;
  }

  // find path on matrix grid

  // javascript-astar ----------------------
  const graph = new Graph(matrix, { diagonal: true });
  const startOnMatrix = graph.grid[closestToStart!.y][closestToStart!.x];
  const endOnMatrix = graph.grid[closestToEnd!.y][closestToEnd!.x];
  const result: GridNode[] = astar.search(graph, startOnMatrix, endOnMatrix);

  const path = [startCoord];
  result.forEach(function (coord) {
    const coords = pointMatrix[coord.x][coord.y].split("|");
    path.push([+coords[0], +coords[1]]); // make sure coords are numbers
  });
  path.push(endCoord);
  // ---------------------------------------

  // astar-andrea ------------------------
  // var result = aStar(matrix, [closestToStart.x, closestToStart.y], [closestToEnd.x, closestToEnd.y], 'DiagonalFree');
  // var path = [start.geometry.coordinates];
  // result.forEach(function (coord) {
  //     var coords = pointMatrix[coord[1]][coord[0]].split('|');
  //     path.push([+coords[0], +coords[1]]); // make sure coords are numbers
  // });
  // path.push(end.geometry.coordinates);
  // ---------------------------------------

  return cleanCoords(lineString(path));
}

/**
 * Checks if Point is inside any of the Polygons
 *
 * @private
 * @param {Feature<Point>} pt to check
 * @param {FeatureCollection<Polygon>} polygons features
 * @returns {boolean} if inside or not
 */
function isInside(pt: Feature<Point>, polygons: FeatureCollection<Polygon>) {
  for (let i = 0; i < polygons.features.length; i++) {
    if (booleanPointInPolygon(pt, polygons.features[i])) {
      return true;
    }
  }
  return false;
}

export { shortestPath };
export default shortestPath;
