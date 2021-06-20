// Cohen-Sutherland line clipping algorithm, adapted to efficiently
// handle polylines rather than just segments

import { BBox } from "@turf/helpers";

export function lineclip(
  points: number[][],
  bbox: BBox,
  result?: number[][][]
): number[][][] {
  var len = points.length,
    codeA = bitCode(points[0], bbox),
    part = [] as number[][],
    i,
    codeB,
    lastCode;
  let a: number[];
  let b: number[];

  if (!result) result = [];

  for (i = 1; i < len; i++) {
    a = points[i - 1];
    b = points[i];
    codeB = lastCode = bitCode(b, bbox);

    while (true) {
      if (!(codeA | codeB)) {
        // accept
        part.push(a);

        if (codeB !== lastCode) {
          // segment went outside
          part.push(b);

          if (i < len - 1) {
            // start a new line
            result.push(part);
            part = [];
          }
        } else if (i === len - 1) {
          part.push(b);
        }
        break;
      } else if (codeA & codeB) {
        // trivial reject
        break;
      } else if (codeA) {
        // a outside, intersect with clip edge
        a = intersect(a, b, codeA, bbox)!;
        codeA = bitCode(a, bbox);
      } else {
        // b outside
        b = intersect(a, b, codeB, bbox)!;
        codeB = bitCode(b, bbox);
      }
    }

    codeA = lastCode;
  }

  if (part.length) result.push(part);

  return result;
}

// Sutherland-Hodgeman polygon clipping algorithm

export function polygonclip(points: number[][], bbox: BBox): number[][] {
  var result: number[][], edge, prev, prevInside, i, p, inside;

  // clip against each side of the clip rectangle
  for (edge = 1; edge <= 8; edge *= 2) {
    result = [];
    prev = points[points.length - 1];
    prevInside = !(bitCode(prev, bbox) & edge);

    for (i = 0; i < points.length; i++) {
      p = points[i];
      inside = !(bitCode(p, bbox) & edge);

      // if segment goes through the clip window, add an intersection
      if (inside !== prevInside) result.push(intersect(prev, p, edge, bbox)!);

      if (inside) result.push(p); // add a point if it's inside

      prev = p;
      prevInside = inside;
    }

    points = result;

    if (!points.length) break;
  }

  return result!;
}

// intersect a segment against one of the 4 lines that make up the bbox

function intersect(
  a: number[],
  b: number[],
  edge: number,
  bbox: BBox
): number[] | null {
  return edge & 8
    ? [a[0] + ((b[0] - a[0]) * (bbox[3] - a[1])) / (b[1] - a[1]), bbox[3]] // top
    : edge & 4
    ? [a[0] + ((b[0] - a[0]) * (bbox[1] - a[1])) / (b[1] - a[1]), bbox[1]] // bottom
    : edge & 2
    ? [bbox[2], a[1] + ((b[1] - a[1]) * (bbox[2] - a[0])) / (b[0] - a[0])] // right
    : edge & 1
    ? [bbox[0], a[1] + ((b[1] - a[1]) * (bbox[0] - a[0])) / (b[0] - a[0])] // left
    : null;
}

// bit code reflects the point position relative to the bbox:

//         left  mid  right
//    top  1001  1000  1010
//    mid  0001  0000  0010
// bottom  0101  0100  0110

function bitCode(p: number[], bbox: BBox) {
  var code = 0;

  if (p[0] < bbox[0]) code |= 1;
  // left
  else if (p[0] > bbox[2]) code |= 2; // right

  if (p[1] < bbox[1]) code |= 4;
  // bottom
  else if (p[1] > bbox[3]) code |= 8; // top

  return code;
}
