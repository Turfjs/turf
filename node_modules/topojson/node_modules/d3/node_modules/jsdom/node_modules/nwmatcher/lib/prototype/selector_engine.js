Prototype._original_property = window.NW;
//= require "repository/src/nwmatcher"

(function(engine, selector) {
  var engSelect = engine.select, extend = Element.extend;

  function select(selector, context) {
    return engSelect(selector, context, extend);
  }

  // back compat negated attribute operator '!='
  // comment this out for strict CSS3 compliance
  engine.registerOperator('!=', 'n!="%m"');

  selector.engine = engine;
  selector.select = extend === Prototype.K ? engSelect : select;
  selector.match = engine.match;
  selector.configure = engine.configure;
})(NW.Dom, Prototype.Selector);

// Restore globals.
window.NW = Prototype._original_property;
delete Prototype._original_property;
