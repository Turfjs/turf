/**
 * MIT License
 *
 * Copyright (c) 2019 Rowan Winsemius
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

// This code is a vendored version from https://github.com/rowanwins/sweepline-intersections
// We have applied our formatting rules, and then added type annotations.

// The vendoring was required because the latest upstream versions are required to fix packaging,
// but those versions include devDependencies in dependencies (see: rowanwins/sweepline-intersections#25)

import TinyQueue from "tinyqueue";
import { orient2d } from "robust-predicates";
import type { FeatureCollection, Feature, GeometryObject } from "geojson";

export type Intersection = [number, number];

/**
 * @param geojson Must not use GeometryCollections
 */
export function sweeplineIntersections(
  geojson: FeatureCollection<GeometryObject> | Feature<GeometryObject>,
  ignoreSelfIntersections: boolean
): [number, number][] {
  const eventQueue = new TinyQueue([], checkWhichEventIsLeft);
  fillEventQueue(geojson, eventQueue);
  return runCheck(eventQueue, ignoreSelfIntersections);
}

function checkWhichEventIsLeft(e1: Event, e2: Event) {
  if (e1.p.x > e2.p.x) return 1;
  if (e1.p.x < e2.p.x) return -1;

  if (
    e1.p.x === e2.p.x &&
    (e1.featureId !== e2.featureId || e1.ringId !== e2.ringId)
  ) {
    if (e1.isLeftEndpoint && !e2.isLeftEndpoint) return -1;
  }

  if (e1.p.y !== e2.p.y) return e1.p.y > e2.p.y ? 1 : -1;
  return 1;
}

function checkWhichSegmentHasRightEndpointFirst(seg1: Segment, seg2: Segment) {
  if (seg1.rightSweepEvent.p.x > seg2.rightSweepEvent.p.x) return 1;
  if (seg1.rightSweepEvent.p.x < seg2.rightSweepEvent.p.x) return -1;

  if (seg1.rightSweepEvent.p.y !== seg2.rightSweepEvent.p.y) {
    return seg1.rightSweepEvent.p.y < seg2.rightSweepEvent.p.y ? 1 : -1;
  }
  return 1;
}

function fillEventQueue(
  geojson: FeatureCollection<GeometryObject> | Feature<GeometryObject>,
  eventQueue: TinyQueue<Event>
) {
  if (geojson.type === "FeatureCollection") {
    const features = geojson.features;
    for (let i = 0; i < features.length; i++) {
      processFeature(features[i], eventQueue);
    }
  } else {
    processFeature(geojson, eventQueue);
  }
}

let featureId = 0;
let ringId = 0;
let eventId = 0;
function processFeature(
  featureOrGeometry: Feature<GeometryObject> | GeometryObject,
  eventQueue: TinyQueue<Event>
) {
  const geom =
    featureOrGeometry.type === "Feature"
      ? featureOrGeometry.geometry
      : featureOrGeometry;

  // This `as any` cast is a bit unfortunate, but Exclude<GeometryObject, GeometryCollection>
  // winds up causing several more errors below, and we'd like to avoid making any meaningful
  // code changes just for the sake of type correctness.
  let coords = (geom as any).coordinates;

  // standardise the input
  if (geom.type === "Polygon" || geom.type === "MultiLineString")
    coords = [coords];
  if (geom.type === "LineString") coords = [[coords]];

  for (let i = 0; i < coords.length; i++) {
    for (let ii = 0; ii < coords[i].length; ii++) {
      let currentP = coords[i][ii][0];
      let nextP = null;
      ringId = ringId + 1;
      for (let iii = 0; iii < coords[i][ii].length - 1; iii++) {
        nextP = coords[i][ii][iii + 1];

        const e1 = new Event(currentP, featureId, ringId, eventId);
        const e2 = new Event(nextP, featureId, ringId, eventId + 1);

        e1.otherEvent = e2;
        e2.otherEvent = e1;

        if (checkWhichEventIsLeft(e1, e2) > 0) {
          e2.isLeftEndpoint = true;
          e1.isLeftEndpoint = false;
        } else {
          e1.isLeftEndpoint = true;
          e2.isLeftEndpoint = false;
        }
        eventQueue.push(e1);
        eventQueue.push(e2);

        currentP = nextP;
        eventId = eventId + 1;
      }
    }
  }
  featureId = featureId + 1;
}

class Event {
  public featureId: number;
  public ringId: number;
  public eventId: number;
  public p: { x: number; y: number };
  public otherEvent: Event | null;
  public isLeftEndpoint: null | boolean;

  constructor(
    p: [number, number],
    featureId: number,
    ringId: number,
    eventId: number
  ) {
    this.p = {
      x: p[0],
      y: p[1],
    };
    this.featureId = featureId;
    this.ringId = ringId;
    this.eventId = eventId;

    this.otherEvent = null;
    this.isLeftEndpoint = null;
  }

  isSamePoint(eventToCheck: Event) {
    return this.p.x === eventToCheck.p.x && this.p.y === eventToCheck.p.y;
  }

  asNewXY(): [number, number] {
    return [this.p.x, this.p.y];
  }
}

function runCheck(
  eventQueue: TinyQueue<Event>,
  ignoreSelfIntersections: boolean = false
): [number, number][] {
  const intersectionPoints: [number, number][] = [];
  const outQueue = new TinyQueue([], checkWhichSegmentHasRightEndpointFirst);

  while (eventQueue.length) {
    const event = eventQueue.pop()!;
    if (event.isLeftEndpoint) {
      // debugEventAndSegments(event.p, outQueue.data)
      const segment = new Segment(event);
      for (let i = 0; i < outQueue.data.length; i++) {
        const otherSeg = outQueue.data[i];
        if (ignoreSelfIntersections) {
          if (otherSeg.leftSweepEvent.featureId === event.featureId) continue;
        }
        const intersection = testSegmentIntersect(segment, otherSeg);
        if (intersection !== false) intersectionPoints.push(intersection);
      }
      outQueue.push(segment);
    } else if (event.isLeftEndpoint === false) {
      outQueue.pop();
      // const seg = outQueue.pop()
      // debugRemovingSegment(event.p, seg)
    }
  }
  return intersectionPoints;
}

class Segment {
  public leftSweepEvent: Event;
  public rightSweepEvent: Event;

  /** @param event must have otherEvent non-null */
  constructor(event: Event) {
    this.leftSweepEvent = event;
    this.rightSweepEvent = event.otherEvent!;
  }
}

function testSegmentIntersect(
  seg1: Segment,
  seg2: Segment
): [number, number] | false {
  if (seg1 === null || seg2 === null) return false;

  const x1 = seg1.leftSweepEvent.p.x;
  const y1 = seg1.leftSweepEvent.p.y;
  const x2 = seg1.rightSweepEvent.p.x;
  const y2 = seg1.rightSweepEvent.p.y;
  const x3 = seg2.leftSweepEvent.p.x;
  const y3 = seg2.leftSweepEvent.p.y;
  const x4 = seg2.rightSweepEvent.p.x;
  const y4 = seg2.rightSweepEvent.p.y;

  const score1 = orient2d(x1, y1, x2, y2, x3, y3);
  const score2 = orient2d(x1, y1, x2, y2, x4, y4);

  if (score1 > 0 && score2 > 0) return false;
  else if (score1 < 0 && score2 < 0) return false;

  if (seg1.leftSweepEvent.ringId === seg2.leftSweepEvent.ringId) {
    if (
      seg1.rightSweepEvent.isSamePoint(seg2.leftSweepEvent) ||
      seg1.rightSweepEvent.isSamePoint(seg2.rightSweepEvent) ||
      seg1.leftSweepEvent.isSamePoint(seg2.leftSweepEvent) ||
      seg1.leftSweepEvent.isSamePoint(seg2.rightSweepEvent)
    )
      return false;
  } else {
    if (seg1.rightSweepEvent.isSamePoint(seg2.leftSweepEvent))
      return seg2.leftSweepEvent.asNewXY();
    if (seg1.rightSweepEvent.isSamePoint(seg2.rightSweepEvent))
      return seg2.rightSweepEvent.asNewXY();
    if (seg1.leftSweepEvent.isSamePoint(seg2.leftSweepEvent))
      return seg2.leftSweepEvent.asNewXY();
    if (seg1.leftSweepEvent.isSamePoint(seg2.rightSweepEvent))
      return seg2.rightSweepEvent.asNewXY();
  }

  const denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
  const numeA = (x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3);
  const numeB = (x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3);

  if (denom === 0) {
    if (numeA === 0 && numeB === 0) return false;
    return false;
  }

  const uA = numeA / denom;
  const uB = numeB / denom;

  if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
    const x = x1 + uA * (x2 - x1);
    const y = y1 + uA * (y2 - y1);
    return [x, y];
  }
  return false;
}
