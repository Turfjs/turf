import {
  Feature,
  LineString,
  Position,
  GeoJSON,
  Point,
  Polygon,
  GeometryCollection,
  FeatureCollection,
  MultiLineString,
  MultiPoint,
  MultiPolygon,
} from "geojson";
import equal from "deep-equal";

/**

 * GeoJSON equality checking utility.
 * Adapted from https://github.com/geosquare/geojson-equality
 *
 * @memberof helpers
 * @type {Class}
 */
export class GeojsonEquality {
  private precision: number;
  private direction = false;
  private compareProperties = true;

  constructor(opts?: {
    precision?: number;
    direction?: boolean;
    compareProperties?: boolean;
  }) {
    this.precision = 10 ** -(opts?.precision ?? 17);
    this.direction = opts?.direction ?? false;
    this.compareProperties = opts?.compareProperties ?? true;
  }

  compare(g1: GeoJSON, g2: GeoJSON): boolean {
    if (g1.type !== g2.type) {
      return false;
    }

    if (!sameLength(g1, g2)) {
      return false;
    }

    switch (g1.type) {
      case "Point":
        return this.compareCoord(g1.coordinates, (g2 as Point).coordinates);
      case "LineString":
        return this.compareLine(g1.coordinates, (g2 as LineString).coordinates);
      case "Polygon":
        return this.comparePolygon(g1, g2 as Polygon);
      case "GeometryCollection":
        return this.compareGeometryCollection(g1, g2 as GeometryCollection);
      case "Feature":
        return this.compareFeature(g1, g2 as Feature);
      case "FeatureCollection":
        return this.compareFeatureCollection(g1, g2 as FeatureCollection);
      default:
        if (g1.type.startsWith("Multi")) {
          const g1s = explode(g1);
          const g2s = explode(
            g2 as MultiLineString | MultiPoint | MultiPolygon
          );
          return g1s.every((g1part) =>
            g2s.some((g2part) => this.compare(g1part as any, g2part as any))
          );
        }
    }
    return false;
  }

  private compareCoord(c1: Position, c2: Position) {
    return (
      c1.length === c2.length &&
      c1.every((c, i) => Math.abs(c - c2[i]) < this.precision)
    );
  }

  private compareLine(
    path1: Position[],
    path2: Position[],
    ind = 0,
    isPoly = false
  ): boolean {
    if (!sameLength(path1, path2)) {
      return false;
    }
    const p1 = path1;
    let p2 = path2;
    if (isPoly && !this.compareCoord(p1[0], p2[0])) {
      // fix start index of both to same point
      const startIndex = this.fixStartIndex(p2, p1);
      if (!startIndex) {
        return false;
      } else {
        p2 = startIndex;
      }
    }
    // for linestring ind =0 and for polygon ind =1
    const sameDirection = this.compareCoord(p1[ind], p2[ind]);
    if (this.direction || sameDirection) {
      return this.comparePath(p1, p2);
    } else {
      if (this.compareCoord(p1[ind], p2[p2.length - (1 + ind)])) {
        return this.comparePath(p1.slice().reverse(), p2);
      }
      return false;
    }
  }

  private fixStartIndex(sourcePath: Position[], targetPath: Position[]) {
    //make sourcePath first point same as of targetPath
    let correctPath,
      ind = -1;
    for (let i = 0; i < sourcePath.length; i++) {
      if (this.compareCoord(sourcePath[i], targetPath[0])) {
        ind = i;
        break;
      }
    }
    if (ind >= 0) {
      correctPath = ([] as Position[]).concat(
        sourcePath.slice(ind, sourcePath.length),
        sourcePath.slice(1, ind + 1)
      );
    }
    return correctPath;
  }

  private comparePath(p1: Position[], p2: Position[]) {
    return p1.every((c, i) => this.compareCoord(c, p2[i]));
  }

  private comparePolygon(g1: Polygon, g2: Polygon) {
    if (this.compareLine(g1.coordinates[0], g2.coordinates[0], 1, true)) {
      const holes1 = g1.coordinates.slice(1, g1.coordinates.length);
      const holes2 = g2.coordinates.slice(1, g2.coordinates.length);
      return holes1.every((h1) =>
        holes2.some((h2) => this.compareLine(h1, h2, 1, true))
      );
    }
    return false;
  }

  private compareGeometryCollection(
    g1: GeometryCollection,
    g2: GeometryCollection
  ) {
    return (
      sameLength(g1.geometries, g2.geometries) &&
      this.compareBBox(g1, g2) &&
      g1.geometries.every((g, i) => this.compare(g, g2.geometries[i]))
    );
  }

  private compareFeature(g1: Feature, g2: Feature) {
    return (
      g1.id === g2.id &&
      (this.compareProperties ? equal(g1.properties, g2.properties) : true) &&
      this.compareBBox(g1, g2) &&
      this.compare(g1.geometry, g2.geometry)
    );
  }

  private compareFeatureCollection(
    g1: FeatureCollection,
    g2: FeatureCollection
  ) {
    return (
      sameLength(g1.features, g2.features) &&
      this.compareBBox(g1, g2) &&
      g1.features.every((f, i) => this.compare(f, g2.features[i]))
    );
  }

  private compareBBox(g1: GeoJSON, g2: GeoJSON): boolean {
    return (
      Boolean(!g1.bbox && !g2.bbox) ||
      (g1.bbox && g2.bbox ? this.compareCoord(g1.bbox, g2.bbox) : false)
    );
  }
}

function sameLength(g1: any, g2: any) {
  return g1.coordinates
    ? g1.coordinates.length === g2.coordinates.length
    : g1.length === g2.length;
}

function explode(g: MultiLineString | MultiPoint | MultiPolygon) {
  return g.coordinates.map((part) => ({
    type: g.type.replace("Multi", ""),
    coordinates: part,
  }));
}
