function scopeName(name) {
  if (name.match(/^turf/)) {
    return '@' + name.replace(/-/, '/');
  } else {
    return name;
  }
}

module.exports = function (file, api) {
  const j = api.jscodeshift;

  return j(file.source)
    .find(j.CallExpression)
    .filter(p => {
      if (p.value.callee && p.value.callee.name === 'require') {
        return (p.value.arguments[0].value.match(/^turf/));
      }
    })
    .replaceWith(p => {
      return j.callExpression(j.identifier('require'),
        [j.literal(scopeName(p.value.arguments[0].value))]);
    })
    .toSource({quote: 'single'});
};
