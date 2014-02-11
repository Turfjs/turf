JTSTestFactory = {};

/**
 * Translate JTS XML testcase document to Jasmine suites
 */
JTSTestFactory.generate = function(doc, title) {
  var cases = $('case', doc);
  var precisionModelInfo = $('precisionModel', doc);
  var geometryFactory;

  // use PrecisionModel from test XML
  if (precisionModelInfo.length === 1) {
    var type = precisionModelInfo.attr('type');
    if (type !== 'FLOATING') {
      var scale = parseFloat(precisionModelInfo.attr('scale'));
      geometryFactory = new jsts.geom.GeometryFactory(
          new jsts.geom.PrecisionModel(scale));
    }
  }

  var reader = new jsts.io.WKTReader(geometryFactory);

  /**
   * Translate JTS XML "test" to a Jasmine spec
   */
  var generateSpec = function(a, b, opname, arg2, arg3, expected) {
    it('Executing ' + opname + ' on test geometry', function() {

      var inputs = ' Input geometry A: ' + a + (b ? ' B: ' + b : '');

      var result;

      // fix opnames to real methods where needed
      if (opname === 'convexhull')
        opname = 'convexHull';
      else if (opname === 'getboundary')
        opname = 'getBoundary';
      else if (opname === 'symdifference')
        opname = 'symDifference';

      // switch execution logic depending on opname
      if (opname === 'buffer') {
        result = a[opname](parseFloat(arg2));
      } else if (opname === 'getCentroid') {
        result = a[opname]();
      } else {
        result = a[opname](b, arg3);
      }

      // switch comparison logic depending on opname
      // TODO: should be a cleaner approach...
      if (opname === 'relate' || opname === 'contains' ||
          opname === 'intersects' || opname === 'equalsExact' ||
          opname === 'equalsNorm' || opname === 'isSimple') {
        var expectedBool = expected === 'true';
        if (expectedBool !== result) {
          throw new Error('Result: ' + result + ' Expected: ' + expected +
              inputs);
        } else {
          expect(true).toBeTruthy();
        }
      } else if (opname === 'distance') {
        var expectedDistance = parseFloat(expected);
        if (result !== expectedDistance) {
          throw new Error('Result: ' + result + ' Expected: ' +
              parseFloat(expectedDistance) + inputs);
        } else {
          expect(true).toBeTruthy();
        }
      } else if (opname === 'buffer') {
        var expectedGeometry = reader.read(expected);
        result.normalize();
        expectedGeometry.normalize();
        
        var matcher = new BufferResultMatcher();

        if (!matcher.isBufferResultMatch(result, expectedGeometry, parseFloat(arg2))) {
          throw new Error('Result: ' + result + ' Expected: ' +
              expectedGeometry + inputs);
        } else {
          expect(true).toBeTruthy();
        }
      } else {
        var expectedGeometry = reader.read(expected);
        result.normalize();
        expectedGeometry.normalize();

        if (result.compareTo(expectedGeometry) !== 0) {
          throw new Error('Result: ' + result + ' Expected: ' +
              expectedGeometry + inputs);
        } else {
          expect(true).toBeTruthy();
        }
      }

    });
  };

  for ( var i = 0; i < cases.length; i++) {
    var testcase = cases[i];
    var desc = $("desc", testcase).text().trim();

    describe(title + ' - ' + desc, function() {
      var awkt = $("a", testcase).text().trim().replace(/\n/g, '');
      var bwkt = $("b", testcase).text().trim().replace(/\n/g, '');
      var tests = $("test", testcase);

      for ( var j = 0; j < tests.length; j++) {

        var test = tests[j];

        var opname = $("op", test).attr('name');
        var arg2 = $("op", test).attr('arg2');
        var arg3 = $("op", test).attr('arg3');
        var expected = $("op", test).text().trim().replace(/\n/g, '');

        var a = reader.read(awkt);
        var b = bwkt.length > 0 ? reader.read(bwkt) : undefined;

        generateSpec(a, b, opname, arg2, arg3, expected);
      }
    });
  }

};