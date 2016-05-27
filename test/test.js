var test = require('tape');
var semver = require('semver');
var path = require('path');
var fs = require('fs');

var lernaConfig = JSON.parse(fs.readFileSync('lerna.json'));

var packages = fs.readdirSync('packages').map(function(p) {
  return JSON.parse(fs.readFileSync(path.join('packages/', p, 'package.json')));
});

test('package dependency versions', function(t) {

  packages.forEach(function(p) {
    Object.keys(p.dependencies || {})
    .filter(function(dep) {
      return dep.match(/^turf/);
    })
    .filter(function(dep) {
      return !semver.satisfies(lernaConfig.version, p.dependencies[dep]);
    }).forEach(function(dep) {
      t.fail('Dependency on ' + dep + '@' + p.dependencies[dep] + ' in ' + p.name + ' is not up to date');
    });
  });


  t.end();
});
