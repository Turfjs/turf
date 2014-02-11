/*!
 * Should
 * Copyright(c) 2010-2014 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

/*!
 * Portions copyright (c) 2010, 2011, 2012 Wojciech Zawistowski, Travis Jeffery
 * From the jasmine-jquery project under the MIT License.
 */

var util = require('../../util');

module.exports = function(should, Assertion) {
  var i = should.format;
  var $ = this.jQuery || this.$;

  /* Otherwise, node's util.inspect loops hangs */
  if (typeof HTMLElement !== "undefined" && HTMLElement && !HTMLElement.prototype.inspect) {
    HTMLElement.prototype.inspect = function () {
      return this.outerHTML;
    };
  }

  if (typeof jQuery !== "undefined" && jQuery && !jQuery.prototype.inspect) {
    jQuery.fn.inspect = function () {
      var elementList = this.toArray().map(function (e) {
        return util.inspect(e);
      }).join(", ");
      if (this.selector) {
        return "SELECTOR(" + this.selector + ") matching " + this.length + " elements" + (elementList.length ? ": " + elementList : "");
      } else {
        return elementList;
      }
    };
  }

  function jQueryAttributeTestHelper(method, singular, plural, nameOrHash, value) {
    var keys = util.isObject(nameOrHash) ? Object.keys(nameOrHash) : [nameOrHash];
    var allRelevantAttributes = keys.reduce(function (memo, key) {
      var value = $(this.obj)[method](key);
      if (typeof value !== 'undefined') {
        memo[key] = value;
      }
      return memo;
    }.bind(this), {});

    if (arguments.length === 4 && util.isObject(nameOrHash)) {
      this.params = { operator: 'to have ' + plural + ' ' + i(nameOrHash) };
      allRelevantAttributes.should.have.properties(nameOrHash);
    } else if (arguments.length === 4) {
      this.params = { operator: 'to have ' + singular + ' ' + i(nameOrHash) };
      allRelevantAttributes.should.have.property(nameOrHash);
    } else {
      this.params = { operator: 'to have ' + singular + ' ' + i(nameOrHash) + ' with value ' + i(value) };
      allRelevantAttributes.should.have.property(nameOrHash, value);
    }
  }

  var browserTagCaseIndependentHtml = function (html) {
    return $('<div/>').append(html).html();
  };

  var addJqPredicateAssertion = function (predicate, nameOverride, operatorOverride) {
    Assertion.add(nameOverride || predicate, function() {
      this.params = { operator: 'to be ' + (operatorOverride || predicate) };
      this.assert($(this.obj).is(':' + predicate));
    }, true);
  }

  Assertion.add('className', function(className) {
    this.params = { operator: 'to have class ' + className };
    this.assert($(this.obj).hasClass(className));
  });

  Assertion.add('css', function(css) {
    this.params = { operator: 'to have css ' + i(css) };
    for (var prop in css) {
      var value = css[prop];
      if (value === 'auto' && $(this.obj).get(0).style[prop] === 'auto') {
        continue;
      }
      $(this.obj).css(prop).should.eql(value);
    }
  });

  addJqPredicateAssertion('visible');
  addJqPredicateAssertion('hidden');
  addJqPredicateAssertion('selected');
  addJqPredicateAssertion('checked');
  addJqPredicateAssertion('disabled');
  addJqPredicateAssertion('empty', 'emptyJq');
  addJqPredicateAssertion('focus', 'focused', 'focused');

  Assertion.add('inDOM', function() {
    this.params = { operator: 'to be in the DOM' };
    this.assert($.contains(document.documentElement, $(this.obj)[0]));
  }, true);

  Assertion.add('exist', function() {
    this.params = { operator: 'to exist' };
    $(this.obj).should.not.have.length(0);
  }, true);

  Assertion.add('attr', function() {
    var args = [
      'attr',
      'attribute',
      'attributes'
    ].concat(Array.prototype.slice.call(arguments, 0));
    jQueryAttributeTestHelper.apply(this, args);
  });

  Assertion.add('prop', function() {
    var args = [
      'prop',
      'property',
      'properties'
    ].concat(Array.prototype.slice.call(arguments, 0));
    jQueryAttributeTestHelper.apply(this, args);
  });

  Assertion.add('elementId', function(id) {
    this.params = { operator: 'to have ID ' + i(id) };
    this.obj.should.have.attr('id', id);
  });

  Assertion.add('html', function(html) {
    this.params = { operator: 'to have HTML ' + i(html) };
    $(this.obj).html().should.eql(browserTagCaseIndependentHtml(html));
  });

  Assertion.add('containHtml', function(html) {
    this.params = { operator: 'to contain HTML ' + i(html) };
    $(this.obj).html().indexOf(browserTagCaseIndependentHtml(html)).should.be.above(-1);
  });

  Assertion.add('text', function(text) {
    this.params = { operator: 'to have text ' + i(text) };
    var trimmedText = $.trim($(this.obj).text());

    if (util.isRegExp(text)) {
      trimmedText.should.match(text);
    } else {
      trimmedText.should.eql(text);
    }
  });

  Assertion.add('containText', function(text) {
    this.params = { operator: 'to contain text ' + i(text) };
    var trimmedText = $.trim($(this.obj).text());

    if (util.isRegExp(text)) {
      trimmedText.should.match(text);
    } else {
      trimmedText.indexOf(text).should.be.above(-1);
    }
  });

  Assertion.add('value', function(val) {
    this.params = { operator: 'to have value ' + i(val) };
    $(this.obj).val().should.eql(val);
  });

  Assertion.add('data', function() {
    var args = [
      'data',
      'data',
      'data'
    ].concat(Array.prototype.slice.call(arguments, 0));
    jQueryAttributeTestHelper.apply(this, args);
  });

  Assertion.add('containElement', function(target) {
    this.params = { operator: 'to contain ' + $(target).inspect() };
    $(this.obj).find(target).should.not.have.length(0);
  });

  Assertion.add('matchedBy', function(selector) {
    this.params = { operator: 'to be matched by selector ' + selector };
    $(this.obj).filter(selector).should.not.have.length(0);
  });

  Assertion.add('handle', function(event) {
    this.params = { operator: 'to handle ' + event };

    var events = $._data($(this.obj).get(0), "events");

    if (!events || !event || typeof event !== "string") {
      return this.assert(false);
    }

    var namespaces = event.split("."),
        eventType = namespaces.shift(),
        sortedNamespaces = namespaces.slice(0).sort(),
        namespaceRegExp = new RegExp("(^|\\.)" + sortedNamespaces.join("\\.(?:.*\\.)?") + "(\\.|$)");

    if (events[eventType] && namespaces.length) {
      for (var i = 0; i < events[eventType].length; i++) {
        var namespace = events[eventType][i].namespace;

        if (namespaceRegExp.test(namespace)) {
          return;
        }
      }
    } else {
      events.should.have.property(eventType);
      events[eventType].should.not.have.length(0);
      return;
    }

    this.assert(false);
  });

  Assertion.add('handleWith', function(eventName, eventHandler) {
    this.params = { operator: 'to handle ' + eventName + ' with ' + eventHandler };

    var normalizedEventName = eventName.split('.')[0],
        stack = $._data($(this.obj).get(0), "events")[normalizedEventName];

    for (var i = 0; i < stack.length; i++) {
      if (stack[i].handler == eventHandler) {
        return;
      }
    }

    this.assert(false);
  });
};