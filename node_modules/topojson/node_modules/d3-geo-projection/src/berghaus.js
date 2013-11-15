import "projection";

var berghausAzimuthalEquidistant = d3.geo.azimuthalEquidistant.raw;

function berghaus(n) {
  var k = 2 * π / n;

  function forward(λ, φ) {
    var p = berghausAzimuthalEquidistant(λ, φ);
    if (Math.abs(λ) > π / 2) { // back hemisphere
      var θ = Math.atan2(p[1], p[0]),
          r = Math.sqrt(p[0] * p[0] + p[1] * p[1]),
          θ0 = k * Math.round((θ - π / 2) / k) + π / 2,
          α = Math.atan2(Math.sin(θ -= θ0), 2 - Math.cos(θ)); // angle relative to lobe end
      θ = θ0 + asin(π / r * Math.sin(α)) - α;
      p[0] = r * Math.cos(θ);
      p[1] = r * Math.sin(θ);
    }
    return p;
  }

  forward.invert = function(x, y) {
    var r = Math.sqrt(x * x + y * y);
    if (r > π / 2) {
      var θ = Math.atan2(y, x),
          θ0 = k * Math.round((θ - π / 2) / k) + π / 2,
          s = θ > θ0 ? -1 : 1,
          A = r * Math.cos(θ0 - θ),
          cotα = 1 / Math.tan(s * Math.acos((A - π) / Math.sqrt(π * (π - 2 * A) + r * r)));
      θ = θ0 + 2 * Math.atan((cotα + s * Math.sqrt(cotα * cotα - 3)) / 3);
      x = r * Math.cos(θ), y = r * Math.sin(θ);
    }
    return berghausAzimuthalEquidistant.invert(x, y);
  };

  return forward;
}

function berghausProjection() {
  var n = 5,
      m = projectionMutator(berghaus),
      p = m(n),
      stream_ = p.stream;

  p.lobes = function(_) {
    if (!arguments.length) return n;
    return m(n = +_);
  };

  p.stream = function(stream) {
    var rotate = p.rotate(),
        rotateStream = stream_(stream),
        sphereStream = (p.rotate([0, 0]), stream_(stream));
    p.rotate(rotate);
    rotateStream.sphere = function() {
      sphereStream.polygonStart(), sphereStream.lineStart();
      var ε = 1e-2;
      for (var i = 0, δ = 360 / n, φ = 90 - 180 / n; i < n; ++i, φ -= δ) {
        sphereStream.point(180, 0);
        if (φ < -90) {
          sphereStream.point(-90, 180 - φ - ε);
          sphereStream.point(-90, 180 - φ + ε);
        } else {
          sphereStream.point(90, φ + ε);
          sphereStream.point(90, φ - ε);
        }
      }
      sphereStream.lineEnd(), sphereStream.polygonEnd();
    };
    return rotateStream;
  };

  return p;
}

(d3.geo.berghaus = berghausProjection).raw = berghaus;
