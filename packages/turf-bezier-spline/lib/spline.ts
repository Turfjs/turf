export interface Point {
  x: number;
  y: number;
  z: number;
}

/**
 * BezierSpline
 * https://github.com/leszekr/bezier-spline-js
 *
 * @private
 * @copyright
 * Copyright (c) 2013 Leszek Rybicki
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
export default class Spline {
  public duration: number;
  public points: Point[];
  public sharpness: number;
  public centers: Point[];
  public controls: Array<[Point, Point]>;
  public stepLength: number;
  public length: number;
  public delay: number;
  public steps: number[];

  constructor(options?: any) {
    this.points = options.points || [];
    this.duration = options.duration || 10000;
    this.sharpness = options.sharpness || 0.85;
    this.centers = [];
    this.controls = [];
    this.stepLength = options.stepLength || 60;
    this.length = this.points.length;
    this.delay = 0;

    // this is to ensure compatibility with the 2d version
    for (let i = 0; i < this.length; i++) {
      this.points[i].z = this.points[i].z || 0;
    }
    for (let i = 0; i < this.length - 1; i++) {
      const p1 = this.points[i];
      const p2 = this.points[i + 1];
      this.centers.push({
        x: (p1.x + p2.x) / 2,
        y: (p1.y + p2.y) / 2,
        z: (p1.z + p2.z) / 2,
      });
    }
    this.controls.push([this.points[0], this.points[0]]);
    for (let i = 0; i < this.centers.length - 1; i++) {
      const dx =
        this.points[i + 1].x - (this.centers[i].x + this.centers[i + 1].x) / 2;
      const dy =
        this.points[i + 1].y - (this.centers[i].y + this.centers[i + 1].y) / 2;
      const dz =
        this.points[i + 1].z - (this.centers[i].y + this.centers[i + 1].z) / 2;
      this.controls.push([
        {
          x:
            (1.0 - this.sharpness) * this.points[i + 1].x +
            this.sharpness * (this.centers[i].x + dx),
          y:
            (1.0 - this.sharpness) * this.points[i + 1].y +
            this.sharpness * (this.centers[i].y + dy),
          z:
            (1.0 - this.sharpness) * this.points[i + 1].z +
            this.sharpness * (this.centers[i].z + dz),
        },
        {
          x:
            (1.0 - this.sharpness) * this.points[i + 1].x +
            this.sharpness * (this.centers[i + 1].x + dx),
          y:
            (1.0 - this.sharpness) * this.points[i + 1].y +
            this.sharpness * (this.centers[i + 1].y + dy),
          z:
            (1.0 - this.sharpness) * this.points[i + 1].z +
            this.sharpness * (this.centers[i + 1].z + dz),
        },
      ]);
    }
    this.controls.push([
      this.points[this.length - 1],
      this.points[this.length - 1],
    ]);
    this.steps = this.cacheSteps(this.stepLength);
    return this;
  }
  /**
   * Caches an array of equidistant (more or less) points on the curve.
   */
  public cacheSteps(mindist: number) {
    const steps = [];
    let laststep = this.pos(0);
    steps.push(0);
    for (let t = 0; t < this.duration; t += 10) {
      const step = this.pos(t);
      const dist = Math.sqrt(
        (step.x - laststep.x) * (step.x - laststep.x) +
          (step.y - laststep.y) * (step.y - laststep.y) +
          (step.z - laststep.z) * (step.z - laststep.z)
      );
      if (dist > mindist) {
        steps.push(t);
        laststep = step;
      }
    }
    return steps;
  }

  /**
   * returns angle and speed in the given point in the curve
   */
  public vector(t: number) {
    const p1 = this.pos(t + 10);
    const p2 = this.pos(t - 10);
    return {
      angle: (180 * Math.atan2(p1.y - p2.y, p1.x - p2.x)) / 3.14,
      speed: Math.sqrt(
        (p2.x - p1.x) * (p2.x - p1.x) +
          (p2.y - p1.y) * (p2.y - p1.y) +
          (p2.z - p1.z) * (p2.z - p1.z)
      ),
    };
  }

  /**
   * Gets the position of the point, given time.
   *
   * WARNING: The speed is not constant. The time it takes between control points is constant.
   *
   * For constant speed, use Spline.steps[i];
   */
  public pos(time: number) {
    let t = time - this.delay;
    if (t < 0) {
      t = 0;
    }
    if (t > this.duration) {
      t = this.duration - 1;
    }
    // t = t-this.delay;
    const t2 = t / this.duration;
    if (t2 >= 1) {
      return this.points[this.length - 1];
    }

    const n = Math.floor((this.points.length - 1) * t2);
    const t1 = (this.length - 1) * t2 - n;
    return bezier(
      t1,
      this.points[n],
      this.controls[n][1],
      this.controls[n + 1][0],
      this.points[n + 1]
    );
  }
}

function bezier(t: number, p1: Point, c1: Point, c2: Point, p2: Point) {
  const b = B(t);
  const pos = {
    x: p2.x * b[0] + c2.x * b[1] + c1.x * b[2] + p1.x * b[3],
    y: p2.y * b[0] + c2.y * b[1] + c1.y * b[2] + p1.y * b[3],
    z: p2.z * b[0] + c2.z * b[1] + c1.z * b[2] + p1.z * b[3],
  };
  return pos;
}
function B(t: number) {
  const t2 = t * t;
  const t3 = t2 * t;
  return [
    t3,
    3 * t2 * (1 - t),
    3 * t * (1 - t) * (1 - t),
    (1 - t) * (1 - t) * (1 - t),
  ];
}
