/*!
 * Copyright (c) 2019, Dane Springmeyer
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in
 *       the documentation and/or other materials provided with the
 *       distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS
 * IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
 * THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 * PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
 * LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

import { Feature, LineString, MultiLineString } from "geojson";

var D2R = Math.PI / 180;
var R2D = 180 / Math.PI;

class Coord {
  public x: number;
  public y: number;
  constructor(
    public lon: number,
    public lat: number
  ) {
    this.x = D2R * lon;
    this.y = D2R * lat;
  }

  public view() {
    return String(this.lon).slice(0, 4) + "," + String(this.lat).slice(0, 4);
  }
}

class Arc {
  public geometries: [number, number][][] = [];
  constructor(public properties = {}) {}

  public json() {
    if (this.geometries.length <= 0) {
      return {
        geometry: {
          type: "LineString",
          // Although null coordinates aren't part of RFC7946 (A feature with a null geometry would be preferred)
          // we leave this as-is for now in order to preserve backwards compatibility
          coordinates: null as unknown,
        },
        type: "Feature",
        properties: this.properties,
      } as Feature<LineString>;
    } else if (this.geometries.length === 1) {
      return {
        geometry: {
          type: "LineString",
          coordinates: this.geometries[0],
        },
        type: "Feature",
        properties: this.properties,
      } as Feature<LineString>;
    } else {
      var multiline = [];
      for (var i = 0; i < this.geometries.length; i++) {
        multiline.push(this.geometries[i]);
      }
      return {
        geometry: { type: "MultiLineString", coordinates: multiline },
        type: "Feature",
        properties: this.properties,
      } as Feature<MultiLineString>;
    }
  }
}

/*
 * http://en.wikipedia.org/wiki/Great-circle_distance
 */
class GreatCircle {
  public start: Coord;
  public end: Coord;
  public g: number;

  constructor(
    start: { x: number; y: number },
    end: { x: number; y: number },
    public properties = {}
  ) {
    this.start = new Coord(start.x, start.y);
    this.end = new Coord(end.x, end.y);
    this.properties = properties || {};

    var w = this.start.x - this.end.x;
    var h = this.start.y - this.end.y;
    var z =
      Math.pow(Math.sin(h / 2.0), 2) +
      Math.cos(this.start.y) *
        Math.cos(this.end.y) *
        Math.pow(Math.sin(w / 2.0), 2);
    this.g = 2.0 * Math.asin(Math.sqrt(z));

    if (this.g === Math.PI) {
      throw new Error(
        "it appears " +
          this.start.view() +
          " and " +
          this.end.view() +
          " are 'antipodal', e.g diametrically opposite, thus there is no single route but rather infinite"
      );
    } else if (isNaN(this.g)) {
      throw new Error(
        "could not calculate great circle between " + start + " and " + end
      );
    }
  }

  /*
   * http://williams.best.vwh.net/avform.htm#Intermediate
   */
  public interpolate(f: number): [number, number] {
    var A = Math.sin((1 - f) * this.g) / Math.sin(this.g);
    var B = Math.sin(f * this.g) / Math.sin(this.g);
    var x =
      A * Math.cos(this.start.y) * Math.cos(this.start.x) +
      B * Math.cos(this.end.y) * Math.cos(this.end.x);
    var y =
      A * Math.cos(this.start.y) * Math.sin(this.start.x) +
      B * Math.cos(this.end.y) * Math.sin(this.end.x);
    var z = A * Math.sin(this.start.y) + B * Math.sin(this.end.y);
    var lat = R2D * Math.atan2(z, Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)));
    var lon = R2D * Math.atan2(y, x);
    return [lon, lat];
  }

  /*
   * Generate points along the great circle
   */
  public Arc(npoints: number, options?: { offset: number }) {
    var first_pass: [number, number][] = [];
    if (!npoints || npoints <= 2) {
      first_pass.push([this.start.lon, this.start.lat]);
      first_pass.push([this.end.lon, this.end.lat]);
    } else {
      var delta = 1.0 / (npoints - 1);
      for (var i = 0; i < npoints; ++i) {
        var step = delta * i;
        var pair = this.interpolate(step);
        first_pass.push(pair);
      }
    }
    /* partial port of dateline handling from:
        gdal/ogr/ogrgeometryfactory.cpp

        TODO - does not handle all wrapping scenarios yet
      */
    var bHasBigDiff = false;
    var dfMaxSmallDiffLong = 0;
    // from http://www.gdal.org/ogr2ogr.html
    // -datelineoffset:
    // (starting with GDAL 1.10) offset from dateline in degrees (default long. = +/- 10deg, geometries within 170deg to -170deg will be splited)
    var dfDateLineOffset = options && options.offset ? options.offset : 10;
    var dfLeftBorderX = 180 - dfDateLineOffset;
    var dfRightBorderX = -180 + dfDateLineOffset;
    var dfDiffSpace = 360 - dfDateLineOffset;

    // https://github.com/OSGeo/gdal/blob/7bfb9c452a59aac958bff0c8386b891edf8154ca/gdal/ogr/ogrgeometryfactory.cpp#L2342
    for (var j = 1; j < first_pass.length; ++j) {
      var dfPrevX = first_pass[j - 1][0];
      var dfX = first_pass[j][0];
      var dfDiffLong = Math.abs(dfX - dfPrevX);
      if (
        dfDiffLong > dfDiffSpace &&
        ((dfX > dfLeftBorderX && dfPrevX < dfRightBorderX) ||
          (dfPrevX > dfLeftBorderX && dfX < dfRightBorderX))
      ) {
        bHasBigDiff = true;
      } else if (dfDiffLong > dfMaxSmallDiffLong) {
        dfMaxSmallDiffLong = dfDiffLong;
      }
    }

    var poMulti = [];
    if (bHasBigDiff && dfMaxSmallDiffLong < dfDateLineOffset) {
      var poNewLS: [number, number][] = [];
      poMulti.push(poNewLS);
      for (var k = 0; k < first_pass.length; ++k) {
        var dfX0 = first_pass[k][0];
        if (k > 0 && Math.abs(dfX0 - first_pass[k - 1][0]) > dfDiffSpace) {
          var dfX1 = first_pass[k - 1][0];
          var dfY1 = first_pass[k - 1][1];
          var dfX2 = first_pass[k][0];
          var dfY2 = first_pass[k][1];
          if (
            dfX1 > -180 &&
            dfX1 < dfRightBorderX &&
            dfX2 === 180 &&
            k + 1 < first_pass.length &&
            first_pass[k - 1][0] > -180 &&
            first_pass[k - 1][0] < dfRightBorderX
          ) {
            poNewLS.push([-180, first_pass[k][1]]);
            k++;
            poNewLS.push([first_pass[k][0], first_pass[k][1]]);
            continue;
          } else if (
            dfX1 > dfLeftBorderX &&
            dfX1 < 180 &&
            dfX2 === -180 &&
            k + 1 < first_pass.length &&
            first_pass[k - 1][0] > dfLeftBorderX &&
            first_pass[k - 1][0] < 180
          ) {
            poNewLS.push([180, first_pass[k][1]]);
            k++;
            poNewLS.push([first_pass[k][0], first_pass[k][1]]);
            continue;
          }

          if (dfX1 < dfRightBorderX && dfX2 > dfLeftBorderX) {
            // swap dfX1, dfX2
            var tmpX = dfX1;
            dfX1 = dfX2;
            dfX2 = tmpX;
            // swap dfY1, dfY2
            var tmpY = dfY1;
            dfY1 = dfY2;
            dfY2 = tmpY;
          }
          if (dfX1 > dfLeftBorderX && dfX2 < dfRightBorderX) {
            dfX2 += 360;
          }

          if (dfX1 <= 180 && dfX2 >= 180 && dfX1 < dfX2) {
            var dfRatio = (180 - dfX1) / (dfX2 - dfX1);
            var dfY = dfRatio * dfY2 + (1 - dfRatio) * dfY1;
            poNewLS.push([
              first_pass[k - 1][0] > dfLeftBorderX ? 180 : -180,
              dfY,
            ]);
            poNewLS = [];
            poNewLS.push([
              first_pass[k - 1][0] > dfLeftBorderX ? -180 : 180,
              dfY,
            ]);
            poMulti.push(poNewLS);
          } else {
            poNewLS = [];
            poMulti.push(poNewLS);
          }
          poNewLS.push([dfX0, first_pass[k][1]]);
        } else {
          poNewLS.push([first_pass[k][0], first_pass[k][1]]);
        }
      }
    } else {
      // add normally
      var poNewLS0: [number, number][] = [];
      poMulti.push(poNewLS0);
      for (var l = 0; l < first_pass.length; ++l) {
        poNewLS0.push([first_pass[l][0], first_pass[l][1]]);
      }
    }

    var arc = new Arc(this.properties);
    for (var m = 0; m < poMulti.length; ++m) {
      var line: [number, number][] = [];
      arc.geometries.push(line);
      var points = poMulti[m];
      for (var j0 = 0; j0 < points.length; ++j0) {
        line.push(points[j0]);
      }
    }
    return arc;
  }
}

export { GreatCircle };
