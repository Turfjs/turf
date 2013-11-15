"use strict";

var cssstyle = require('../lib/CSSStyleDeclaration');

/**
 *  These are the required properties
 *  see http://www.w3.org/TR/DOM-Level-2-Style/css.html#CSS-CSS2Properties
 **/
var properties = [ 'azimuth', 'background', 'backgroundAttachment', 'backgroundColor', 'backgroundImage', 'backgroundPosition', 'backgroundRepeat', 'border', 'borderCollapse', 'borderColor', 'borderSpacing', 'borderStyle', 'borderTop', 'borderRight', 'borderBottom', 'borderLeft', 'borderTopColor', 'borderRightColor', 'borderBottomColor', 'borderLeftColor', 'borderTopStyle', 'borderRightStyle', 'borderBottomStyle', 'borderLeftStyle', 'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth', 'borderWidth', 'bottom', 'captionSide', 'clear', 'clip', 'color', 'content', 'counterIncrement', 'counterReset', 'cue', 'cueAfter', 'cueBefore', 'cursor', 'direction', 'display', 'elevation', 'emptyCells', 'cssFloat', 'font', 'fontFamily', 'fontSize', 'fontSizeAdjust', 'fontStretch', 'fontStyle', 'fontVariant', 'fontWeight', 'height', 'left', 'letterSpacing', 'lineHeight', 'listStyle', 'listStyleImage', 'listStylePosition', 'listStyleType', 'margin', 'marginTop', 'marginRight', 'marginBottom', 'marginLeft', 'markerOffset', 'marks', 'maxHeight', 'maxWidth', 'minHeight', 'minWidth', 'orphans', 'outline', 'outlineColor', 'outlineStyle', 'outlineWidth', 'overflow', 'padding', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'page', 'pageBreakAfter', 'pageBreakBefore', 'pageBreakInside', 'pause', 'pauseAfter', 'pauseBefore', 'pitch', 'pitchRange', 'playDuring', 'position', 'quotes', 'richness', 'right', 'size', 'speak', 'speakHeader', 'speakNumeral', 'speakPunctuation', 'speechRate', 'stress', 'tableLayout', 'textAlign', 'textDecoration', 'textIndent', 'textShadow', 'textTransform', 'top', 'unicodeBidi', 'verticalAlign', 'visibility', 'voiceFamily', 'volume', 'whiteSpace', 'widows', 'width', 'wordSpacing', 'zIndex'];

module.exports = {
    'Verify Has Properties': function (test) {
        var style = new cssstyle.CSSStyleDeclaration();
        test.expect(properties.length * 2);
        properties.forEach(function (property) {
            test.ok(style.__lookupGetter__(property), 'missing ' + property + ' property');
            test.ok(style.__lookupSetter__(property), 'missing ' + property + ' property');
        });
        test.done();
    },
    'Verify Has Functions': function (test) {
        var style = new cssstyle.CSSStyleDeclaration();
        test.expect(6);
        test.ok(typeof style.getPropertyValue === 'function', 'missing getPropertyValue()');
        test.ok(typeof style.getPropertyCSSValue === 'function', 'missing getPropertyCSSValue()');
        test.ok(typeof style.removeProperty === 'function', 'missing removeProperty()');
        test.ok(typeof style.getPropertyPriority === 'function', 'missing getPropertyPriority()');
        test.ok(typeof style.setProperty === 'function', 'missing setProperty()');
        test.ok(typeof style.item === 'function', 'missing item()');
        test.done();
    },
    'Verify Has Special Properties': function (test) {
        var style = new cssstyle.CSSStyleDeclaration();
        test.expect(5);
        test.ok(style.__lookupGetter__('cssText'), 'missing cssText getter');
        test.ok(style.__lookupSetter__('cssText'), 'missing cssText setter');
        test.ok(style.__lookupGetter__('length'), 'missing length getter');
        test.ok(style.__lookupSetter__('length'), 'missing length setter');
        test.ok(style.__lookupGetter__('parentRule'), 'missing parentRule getter');
        test.done();
    },
    'Test From Style String': function (test) {
        var style = new cssstyle.CSSStyleDeclaration();
        test.expect(8);
        style.cssText = 'color: blue; background-color: red; width: 78%';
        test.ok(3 === style.length, 'length is not 3');
        test.ok('color: blue; background-color: red; width: 78%;' === style.cssText, 'cssText is wrong');
        test.ok('blue' === style.getPropertyValue('color'), "getPropertyValue('color') failed");
        test.ok('color' === style.item(0), 'item(0) failed');
        test.ok('background-color' === style[1], 'style[1] failed');
        test.ok('red' === style.backgroundColor, 'style.backgroundColor failed with "' + style.backgroundColor + '"');
        style.cssText = '';
        test.ok('' === style.cssText, 'cssText is not empty');
        test.ok(0 === style.length, 'length is not 0');
        test.done();
    },
    'Test From Properties': function (test) {
        var style = new cssstyle.CSSStyleDeclaration();
        test.expect(11);
        style.color = 'blue';
        test.ok(1 === style.length, 'length is not 1');
        test.ok('color' === style[0], 'style[0] is not color');
        test.ok('color: blue;' === style.cssText, 'cssText is wrong');
        test.ok('color' === style.item(0), 'item(0) is not color');
        test.ok('blue' === style.color, 'color is not blue');
        style.backgroundColor = 'red';
        test.ok(2 === style.length, 'length is not 2');
        test.ok('color' === style[0], 'style[0] is not color');
        test.ok('background-color' === style[1], 'style[1] is not background-color');
        test.ok('color: blue; background-color: red;' === style.cssText, 'cssText is wrong');
        test.ok('red' === style.backgroundColor, 'backgroundColor is not red');
        style.removeProperty('color');
        test.ok('background-color' === style[0], 'style[0] is not background-color');
        test.done();
    }
};