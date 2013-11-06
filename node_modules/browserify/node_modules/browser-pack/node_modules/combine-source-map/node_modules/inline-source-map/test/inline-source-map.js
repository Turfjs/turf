'use strict';
/*jshint asi: true*/

var test = require('tap').test
var generator = require('..');

var foo = '' + function foo () {
  var hello = 'hello';
  var world = 'world';
  console.log('%s %s', hello, world);
}

var bar = '' + function bar () {
  console.log('yes?');
}

function decode(base64) {
  return new Buffer(base64, 'base64').toString();
} 

test('generated mappings', function (t) {

  t.test('one file no offset', function (t) {
    var gen = generator()
      .addGeneratedMappings('foo.js', foo)

    t.deepEqual(
        gen._mappings()
      , [ { generated: { line: 1, column: 0 },
            original: { line: 1, column: 0 },
            source: 'foo.js',
            name: null },
          { generated: { line: 2, column: 0 },
            original: { line: 2, column: 0 },
            source: 'foo.js',
            name: null },
          { generated: { line: 3, column: 0 },
            original: { line: 3, column: 0 },
            source: 'foo.js',
            name: null },
          { generated: { line: 4, column: 0 },
            original: { line: 4, column: 0 },
            source: 'foo.js',
            name: null },
          { generated: { line: 5, column: 0 },
            original: { line: 5, column: 0 },
            source: 'foo.js',
            name: null } ]      
        , 'generates correct mappings'
    )
    t.deepEqual(
        decode(gen.base64Encode()) 
      , '{"version":3,"file":"","sources":["foo.js"],"names":[],"mappings":"AAAA;AACA;AACA;AACA;AACA"}'
      , 'encodes generated mappings'
    )
    t.equal(
        gen.inlineMappingUrl()
      , '//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlcyI6WyJmb28uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSJ9'
      , 'returns correct inline mapping url'
    )
    t.end()
  })

  t.test('two files no offset', function (t) {
    var gen = generator()
      .addGeneratedMappings('foo.js', foo)
      .addGeneratedMappings('bar.js', bar)

    t.deepEqual(
        gen._mappings()
      , [ { generated: { line: 1, column: 0 },
            original: { line: 1, column: 0 },
            source: 'foo.js',
            name: null },
          { generated: { line: 2, column: 0 },
            original: { line: 2, column: 0 },
            source: 'foo.js',
            name: null },
          { generated: { line: 3, column: 0 },
            original: { line: 3, column: 0 },
            source: 'foo.js',
            name: null },
          { generated: { line: 4, column: 0 },
            original: { line: 4, column: 0 },
            source: 'foo.js',
            name: null },
          { generated: { line: 5, column: 0 },
            original: { line: 5, column: 0 },
            source: 'foo.js',
            name: null },
          { generated: { line: 1, column: 0 },
            original: { line: 1, column: 0 },
            source: 'bar.js',
            name: null },
          { generated: { line: 2, column: 0 },
            original: { line: 2, column: 0 },
            source: 'bar.js',
            name: null },
          { generated: { line: 3, column: 0 },
            original: { line: 3, column: 0 },
            source: 'bar.js',
            name: null } ]      
        , 'generates correct mappings'
    )
    t.deepEqual(
        decode(gen.base64Encode()) 
      , '{"version":3,"file":"","sources":["foo.js","bar.js"],"names":[],"mappings":"ACAA,ADAA;ACCA,ADAA;ACCA,ADAA;AACA;AACA"}'
      , 'encodes generated mappings'
    )
    t.equal(
        gen.inlineMappingUrl()
      , '//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlcyI6WyJmb28uanMiLCJiYXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFDQUEsQURBQTtBQ0NBLEFEQUE7QUNDQSxBREFBO0FBQ0E7QUFDQSJ9'
      , 'returns correct inline mapping url'
    )
    t.end()
  })

  t.test('one line source', function (t) {
    var gen = generator().addGeneratedMappings('one-liner.js',  'console.log("line one");')
    t.deepEqual(
        gen._mappings()
      , [ { generated: { line: 1, column: 0 },
            original: { line: 1, column: 0 },
            source: 'one-liner.js',
            name: null } ]      
    , 'generates correct mappings'
    )
    t.end()
  })

  t.test('with offset', function (t) {
    var gen = generator()
      .addGeneratedMappings('foo.js', foo, { line: 20 })
      .addGeneratedMappings('bar.js', bar, { line: 23, column: 22 })

    t.deepEqual(
        gen._mappings()
      , [ { generated: { line: 21, column: 0 },
            original: { line: 1, column: 0 },
            source: 'foo.js',
            name: null },
          { generated: { line: 22, column: 0 },
            original: { line: 2, column: 0 },
            source: 'foo.js',
            name: null },
          { generated: { line: 23, column: 0 },
            original: { line: 3, column: 0 },
            source: 'foo.js',
            name: null },
          { generated: { line: 24, column: 0 },
            original: { line: 4, column: 0 },
            source: 'foo.js',
            name: null },
          { generated: { line: 25, column: 0 },
            original: { line: 5, column: 0 },
            source: 'foo.js',
            name: null },
          { generated: { line: 24, column: 22 },
            original: { line: 1, column: 0 },
            source: 'bar.js',
            name: null },
          { generated: { line: 25, column: 22 },
            original: { line: 2, column: 0 },
            source: 'bar.js',
            name: null },
          { generated: { line: 26, column: 22 },
            original: { line: 3, column: 0 },
            source: 'bar.js',
            name: null } ]        
      , 'generates correct mappings'
    )
    t.equal(
        decode(gen.base64Encode())
      , '{"version":3,"file":"","sources":["foo.js","bar.js"],"names":[],"mappings":";;;;;;;;;;;;;;;;;;;;AAAA;AACA;AACA;AACA,sBCHA;ADIA,sBCHA;sBACA"}'
      , 'encodes generated mappings with offset'
    )
    t.end()
  })
})

test('given mappings, with one having no original', function (t) {
  t.test('no offset', function (t) {
    var gen = generator()
      .addMappings('foo.js', [{ original: { line: 2, column: 3 } , generated: { line: 5, column: 10 } }])

      // This addresses an edgecase in which a transpiler generates mappings but doesn't include the original position.
      // If we set source to sourceFile (as usual) in that case, the mappings are considered invalid by the source-map module's
      // SourceMapGenerator. Keeping source undefined fixes this problem.
      // Raised issue: https://github.com/thlorenz/inline-source-map/issues/2
      // Validate function: https://github.com/mozilla/source-map/blob/a3372ea78e662582087dd25ebda999c06424e047/lib/source-map/source-map-generator.js#L232
      .addMappings('bar.js', [
            { original: { line: 6, column: 0 } , generated: { line: 7, column: 20 } }
          , { generated: { line: 8, column: 30 } }
      ])

    t.deepEqual(
        gen._mappings()
      , [ { generated: { line: 5, column: 10 },
            original: { line: 2, column: 3 },
            source: 'foo.js',
            name: null },
          { generated: { line: 7, column: 20 },
            original: { line: 6, column: 0 },
            source: 'bar.js',
            name: null },
          { generated: { line: 8, column: 30 },
            original: undefined,
            source: undefined,
            name: null } ]
      , 'adds correct mappings'
    )
    t.deepEqual(
        decode(gen.base64Encode()) 
      , '{"version":3,"file":"","sources":["foo.js","bar.js"],"names":[],"mappings":";;;;UACG;;oBCIH;8B"}'
      , 'encodes generated mappings'
    )
    t.equal(
        gen.inlineMappingUrl()
      , '//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlcyI6WyJmb28uanMiLCJiYXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztVQUNHOztvQkNJSDs4QiJ9'
      , 'returns correct inline mapping url'
    )
    t.end()
  })

  t.test('with offset', function (t) {
    var gen = generator()
      .addMappings('foo.js', [{ original: { line: 2, column: 3 } , generated: { line: 5, column: 10 } }], { line: 5 })
      .addMappings('bar.js', [{ original: { line: 6, column: 0 } , generated: { line: 7, column: 20 } }, { generated: { line: 8, column: 30 } }], { line: 9, column: 3 })

    t.deepEqual(
        gen._mappings()
      , [ { generated: { line: 10, column: 10 },
            original: { line: 2, column: 3 },
            source: 'foo.js',
            name: null },
          { generated: { line: 16, column: 23 },
            original: { line: 6, column: 0 },
            source: 'bar.js',
            name: null },
          { generated: { line: 17, column: 33 },
            original: undefined,
            source: undefined,
            name: null } ]     
      , 'adds correct mappings'
    )
    t.equal(
        decode(gen.base64Encode())
      , '{\"version\":3,\"file\":\"\",\"sources\":[\"foo.js\",\"bar.js\"],\"names\":[],\"mappings\":\";;;;;;;;;UACG;;;;;;uBCIH;iC\"}'
      , 'encodes mappings with offset'
    )
    t.end()
  })
});
