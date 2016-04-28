/* eslint-disable */

/*
 * Copyright (c) 2010, Jason Davies.
 *
 * All rights reserved.  This code is based on Bradley White's Java version,
 * which is in turn based on Nicholas Yue's C++ version, which in turn is based
 * on Paul D. Bourke's original Fortran version.  See below for the respective
 * copyright notices.
 *
 * See http://local.wasp.uwa.edu.au/~pbourke/papers/conrec/ for the original
 * paper by Paul D. Bourke.
 *
 * The vector conversion code is based on http://apptree.net/conrec.htm by
 * Graham Cox.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of the <organization> nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 * THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/*
 * Copyright (c) 1996-1997 Nicholas Yue
 *
 * This software is copyrighted by Nicholas Yue. This code is based on Paul D.
 * Bourke's CONREC.F routine.
 *
 * The authors hereby grant permission to use, copy, and distribute this
 * software and its documentation for any purpose, provided that existing
 * copyright notices are retained in all copies and that this notice is
 * included verbatim in any distributions. Additionally, the authors grant
 * permission to modify this software and its documentation for any purpose,
 * provided that such modifications are not distributed without the explicit
 * consent of the authors and that existing copyright notices are retained in
 * all copies. Some of the algorithms implemented by this software are
 * patented, observe all applicable patent law.
 *
 * IN NO EVENT SHALL THE AUTHORS OR DISTRIBUTORS BE LIABLE TO ANY PARTY FOR
 * DIRECT, INDIRECT, SPECIAL, INCIDENTAL, OR CONSEQUENTIAL DAMAGES ARISING OUT
 * OF THE USE OF THIS SOFTWARE, ITS DOCUMENTATION, OR ANY DERIVATIVES THEREOF,
 * EVEN IF THE AUTHORS HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * THE AUTHORS AND DISTRIBUTORS SPECIFICALLY DISCLAIM ANY WARRANTIES,
 * INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.  THIS SOFTWARE IS
 * PROVIDED ON AN "AS IS" BASIS, AND THE AUTHORS AND DISTRIBUTORS HAVE NO
 * OBLIGATION TO PROVIDE MAINTENANCE, SUPPORT, UPDATES, ENHANCEMENTS, OR
 * MODIFICATIONS.
 */


  module.exports = Conrec;

  var EPSILON = 1e-10;

  function pointsEqual(a, b) {
      var x = a.x - b.x, y = a.y - b.y;
      return x * x + y * y < EPSILON;
  }

  function reverseList(list) {
      var pp = list.head;

      while (pp) {
      // swap prev/next pointers
          var temp = pp.next;
          pp.next = pp.prev;
          pp.prev = temp;

      // continue through the list
          pp = temp;
      }

    // swap head/tail pointers
      var temp = list.head;
      list.head = list.tail;
      list.tail = temp;
  }

  function ContourBuilder(level) {
      this.level = level;
      this.s = null;
      this.count = 0;
  }
  ContourBuilder.prototype.remove_seq = function (list) {
    // if list is the first item, static ptr s is updated
      if (list.prev) {
          list.prev.next = list.next;
      } else {
          this.s = list.next;
      }

      if (list.next) {
          list.next.prev = list.prev;
      }
      --this.count;
  };
  ContourBuilder.prototype.addSegment = function (a, b) {
      var ss = this.s;
      var ma = null;
      var mb = null;
      var prependA = false;
      var prependB = false;

      while (ss) {
          if (ma == null) {
        // no match for a yet
              if (pointsEqual(a, ss.head.p)) {
                  ma = ss;
                  prependA = true;
              } else if (pointsEqual(a, ss.tail.p)) {
                  ma = ss;
              }
          }
          if (mb == null) {
        // no match for b yet
              if (pointsEqual(b, ss.head.p)) {
                  mb = ss;
                  prependB = true;
              } else if (pointsEqual(b, ss.tail.p)) {
                  mb = ss;
              }
          }
      // if we matched both no need to continue searching
          if (mb != null && ma != null) {
              break;
          } else {
              ss = ss.next;
          }
      }

    // c is the case selector based on which of ma and/or mb are set
      var c = ((ma != null) ? 1 : 0) | ((mb != null) ? 2 : 0);

      switch (c) {
      case 0:   // both unmatched, add as new sequence
          var aa = {p: a, prev: null};
          var bb = {p: b, next: null};
          aa.next = bb;
          bb.prev = aa;

        // create sequence element and push onto head of main list. The order
        // of items in this list is unimportant
          ma = {head: aa, tail: bb, next: this.s, prev: null, closed: false};
          if (this.s) {
              this.s.prev = ma;
          }
          this.s = ma;

          ++this.count;    // not essential - tracks number of unmerged sequences
          break;

      case 1:   // a matched, b did not - thus b extends sequence ma
          var pp = {p: b};

          if (prependA) {
              pp.next = ma.head;
              pp.prev = null;
              ma.head.prev = pp;
              ma.head = pp;
          } else {
              pp.next = null;
              pp.prev = ma.tail;
              ma.tail.next = pp;
              ma.tail = pp;
          }
          break;

      case 2:   // b matched, a did not - thus a extends sequence mb
          var pp = {p: a};

          if (prependB) {
              pp.next = mb.head;
              pp.prev = null;
              mb.head.prev = pp;
              mb.head = pp;
          } else {
              pp.next = null;
              pp.prev = mb.tail;
              mb.tail.next = pp;
              mb.tail = pp;
          }
          break;

      case 3:   // both matched, can merge sequences
        // if the sequences are the same, do nothing, as we are simply closing this path (could set a flag)

          if (ma === mb) {
              var pp = {p: ma.tail.p, next: ma.head, prev: null};
              ma.head.prev = pp;
              ma.head = pp;
              ma.closed = true;
              break;
          }

        // there are 4 ways the sequence pair can be joined. The current setting of prependA and
        // prependB will tell us which type of join is needed. For head/head and tail/tail joins
        // one sequence needs to be reversed
          switch ((prependA ? 1 : 0) | (prependB ? 2 : 0)) {
          case 0:   // tail-tail
            // reverse ma and append to mb
              reverseList(ma);
            // fall through to head/tail case
          case 1:   // head-tail
            // ma is appended to mb and ma discarded
              mb.tail.next = ma.head;
              ma.head.prev = mb.tail;
              mb.tail = ma.tail;

            //discard ma sequence record
              this.remove_seq(ma);
              break;

          case 3:   // head-head
            // reverse ma and append mb to it
              reverseList(ma);
            // fall through to tail/head case
          case 2:   // tail-head
            // mb is appended to ma and mb is discarded
              ma.tail.next = mb.head;
              mb.head.prev = ma.tail;
              ma.tail = mb.tail;

            //discard mb sequence record
              this.remove_seq(mb);
              break;
          }
      }
  };

  /*
   * Implements CONREC.
   *
   * @private
   * @param {function} drawContour function for drawing contour.  Defaults to a
   *                               custom "contour builder", which populates the
   *                               contours property.
   */
  function Conrec(drawContour) {
      if (!drawContour) {
          var c = this;
          c.contours = {};
      /**
       * drawContour - interface for implementing the user supplied method to
       * render the countours.
       *
       * Draws a line between the start and end coordinates.
       *
       * @private
       * @param startX    - start coordinate for X
       * @param startY    - start coordinate for Y
       * @param endX      - end coordinate for X
       * @param endY      - end coordinate for Y
       * @param contourLevel - Contour level for line.
       */
          this.drawContour = function (startX, startY, endX, endY, contourLevel, k) {
              var cb = c.contours[k];
              if (!cb) {
                  cb = c.contours[k] = new ContourBuilder(contourLevel);
              }
              cb.addSegment({x: startX, y: startY}, {x: endX, y: endY});
          };
          this.contourList = function () {
              var l = [];
              var a = c.contours;
              for (var k in a) {
                  var s = a[k].s;
                  var level = a[k].level;
                  while (s) {
                      var h = s.head;
                      var l2 = [];
                      l2.level = level;
                      l2.k = k;
                      while (h && h.p) {
                          l2.push(h.p);
                          h = h.next;
                      }
                      l.push(l2);
                      s = s.next;
                  }
              }
              l.sort(function (a, b) { return a.k - b.k; });
              return l;
          };
      } else {
          this.drawContour = drawContour;
      }
      this.h  = new Array(5);
      this.sh = new Array(5);
      this.xh = new Array(5);
      this.yh = new Array(5);
  }

  /*
   * contour is a contouring subroutine for rectangularily spaced data
   *
   * It emits calls to a line drawing subroutine supplied by the user which
   * draws a contour map corresponding to real*4data on a randomly spaced
   * rectangular grid. The coordinates emitted are in the same units given in
   * the x() and y() arrays.
   *
   * Any number of contour levels may be specified but they must be in order of
   * increasing value.
   *
   *
   * @param {number[][]} d - matrix of data to contour
   * @param {number} ilb,iub,jlb,jub - index bounds of data matrix
   *
   *             The following two, one dimensional arrays (x and y) contain
   *             the horizontal and vertical coordinates of each sample points.
   * @param {number[]} x  - data matrix column coordinates
   * @param {number[]} y  - data matrix row coordinates
   * @param {number} nc   - number of contour levels
   * @param {number[]} z  - contour levels in increasing order.
   */
  Conrec.prototype.contour = function (d, ilb, iub, jlb, jub, x, y, nc, z) {
      var h = this.h, sh = this.sh, xh = this.xh, yh = this.yh;
      var drawContour = this.drawContour;
      this.contours = {};

      var xsect = function (p1, p2) {
          return (h[p2] * xh[p1] - h[p1] * xh[p2]) / (h[p2] - h[p1]);
      };

      var ysect = function (p1, p2) {
          return (h[p2] * yh[p1] - h[p1] * yh[p2]) / (h[p2] - h[p1]);
      };
      var m1;
      var m2;
      var m3;
      var case_value;
      var dmin;
      var dmax;
      var x1 = 0.0;
      var x2 = 0.0;
      var y1 = 0.0;
      var y2 = 0.0;

    // The indexing of im and jm should be noted as it has to start from zero
    // unlike the fortran counter part
      var im = [0, 1, 1, 0];
      var jm = [0, 0, 1, 1];

    // Note that castab is arranged differently from the FORTRAN code because
    // Fortran and C/C++ arrays are transposed of each other, in this case
    // it is more tricky as castab is in 3 dimensions
      var castab = [
          [
        [0, 0, 8], [0, 2, 5], [7, 6, 9]
          ],
          [
        [0, 3, 4], [1, 3, 1], [4, 3, 0]
          ],
          [
        [9, 6, 7], [5, 2, 0], [8, 0, 0]
          ]
      ];

      for (var j = (jub - 1); j >= jlb; j--) {
          for (var i = ilb; i <= iub - 1; i++) {
              var temp1, temp2;
              temp1 = Math.min(d[i][j], d[i][j + 1]);
              temp2 = Math.min(d[i + 1][j], d[i + 1][j + 1]);
              dmin  = Math.min(temp1, temp2);
              temp1 = Math.max(d[i][j], d[i][j + 1]);
              temp2 = Math.max(d[i + 1][j], d[i + 1][j + 1]);
              dmax  = Math.max(temp1, temp2);

              if (dmax >= z[0] && dmin <= z[nc - 1]) {
                  for (var k = 0; k < nc; k++) {
                      if (z[k] >= dmin && z[k] <= dmax) {
                          for (var m = 4; m >= 0; m--) {
                            if (m > 0) {
                  // The indexing of im and jm should be noted as it has to
                  // start from zero
                              h[m] = d[i + im[m - 1]][j + jm[m - 1]] - z[k];
                              xh[m] = x[i + im[m - 1]];
                              yh[m] = y[j + jm[m - 1]];
                          } else {
                              h[0] = 0.25 * (h[1] + h[2] + h[3] + h[4]);
                              xh[0] = 0.5 * (x[i] + x[i + 1]);
                              yh[0] = 0.5 * (y[j] + y[j + 1]);
                          }
                            if (h[m] > EPSILON) {
                              sh[m] = 1;
                          } else if (h[m] < -EPSILON) {
                            sh[m] = -1;
                        } else
                  sh[m] = 0;
                        }
              //
              // Note: at this stage the relative heights of the corners and the
              // centre are in the h array, and the corresponding coordinates are
              // in the xh and yh arrays. The centre of the box is indexed by 0
              // and the 4 corners by 1 to 4 as shown below.
              // Each triangle is then indexed by the parameter m, and the 3
              // vertices of each triangle are indexed by parameters m1,m2,and
              // m3.
              // It is assumed that the centre of the box is always vertex 2
              // though this isimportant only when all 3 vertices lie exactly on
              // the same contour level, in which case only the side of the box
              // is drawn.
              //
              //
              //      vertex 4 +-------------------+ vertex 3
              //               | \               / |
              //               |   \    m-3    /   |
              //               |     \       /     |
              //               |       \   /       |
              //               |  m=2    X   m=2   |       the centre is vertex 0
              //               |       /   \       |
              //               |     /       \     |
              //               |   /    m=1    \   |
              //               | /               \ |
              //      vertex 1 +-------------------+ vertex 2
              //
              //
              //
              //               Scan each triangle in the box
              //
                          for (m = 1; m <= 4; m++) {
                            m1 = m;
                            m2 = 0;
                            if (m != 4) {
                              m3 = m + 1;
                          } else {
                              m3 = 1;
                          }
                            case_value = castab[sh[m1] + 1][sh[m2] + 1][sh[m3] + 1];
                            if (case_value != 0) {
                              switch (case_value) {
                            case 1: // Line between vertices 1 and 2
                                x1 = xh[m1];
                                y1 = yh[m1];
                                x2 = xh[m2];
                                y2 = yh[m2];
                                break;
                            case 2: // Line between vertices 2 and 3
                                x1 = xh[m2];
                                y1 = yh[m2];
                                x2 = xh[m3];
                                y2 = yh[m3];
                                break;
                            case 3: // Line between vertices 3 and 1
                                x1 = xh[m3];
                                y1 = yh[m3];
                                x2 = xh[m1];
                                y2 = yh[m1];
                                break;
                            case 4: // Line between vertex 1 and side 2-3
                                x1 = xh[m1];
                                y1 = yh[m1];
                                x2 = xsect(m2, m3);
                                y2 = ysect(m2, m3);
                                break;
                            case 5: // Line between vertex 2 and side 3-1
                                x1 = xh[m2];
                                y1 = yh[m2];
                                x2 = xsect(m3, m1);
                                y2 = ysect(m3, m1);
                                break;
                            case 6: //  Line between vertex 3 and side 1-2
                                x1 = xh[m3];
                                y1 = yh[m3];
                                x2 = xsect(m1, m2);
                                y2 = ysect(m1, m2);
                                break;
                            case 7: // Line between sides 1-2 and 2-3
                                x1 = xsect(m1, m2);
                                y1 = ysect(m1, m2);
                                x2 = xsect(m2, m3);
                                y2 = ysect(m2, m3);
                                break;
                            case 8: // Line between sides 2-3 and 3-1
                                x1 = xsect(m2, m3);
                                y1 = ysect(m2, m3);
                                x2 = xsect(m3, m1);
                                y2 = ysect(m3, m1);
                                break;
                            case 9: // Line between sides 3-1 and 1-2
                                x1 = xsect(m3, m1);
                                y1 = ysect(m3, m1);
                                x2 = xsect(m1, m2);
                                y2 = ysect(m1, m2);
                                break;
                            default:
                                break;
                            }
                  // Put your processing code here and comment out the printf
                  //printf("%f %f %f %f %f\n",x1,y1,x2,y2,z[k]);
                              drawContour(x1, y1, x2, y2, z[k], k);
                          }
                        }
                      }
                  }
              }
          }
      }
  };
