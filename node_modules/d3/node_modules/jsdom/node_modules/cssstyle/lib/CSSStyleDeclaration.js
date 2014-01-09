/*********************************************************************
 * This is a fork from the CSS Style Declaration part of
 * https://github.com/NV/CSSOM
 ********************************************************************/
"use strict";
/*jslint es5: true*/
var CSSOM = require('cssom');
var fs = require('fs');
var path = require('path');

/**
 * @constructor
 * @see http://www.w3.org/TR/DOM-Level-2-Style/css.html#CSS-CSSStyleDeclaration
 */
var CSSStyleDeclaration = function CSSStyleDeclaration() {
    this._values = {};
    this._importants = {};
    this._length = 0;
};
CSSStyleDeclaration.prototype = {
    constructor: CSSStyleDeclaration,

    /**
     *
     * @param {string} name
     * @see http://www.w3.org/TR/DOM-Level-2-Style/css.html#CSS-CSSStyleDeclaration-getPropertyValue
     * @return {string} the value of the property if it has been explicitly set for this declaration block.
     * Returns the empty string if the property has not been set.
     */
    getPropertyValue: function (name) {
        return this._values[name] || "";
    },

    /**
     *
     * @param {string} name
     * @param {string} value
     * @param {string} [priority=null] "important" or null
     * @see http://www.w3.org/TR/DOM-Level-2-Style/css.html#CSS-CSSStyleDeclaration-setProperty
     */
    setProperty: function (name, value, priority) {
        if (value === undefined) {
            return;
        }
        if (value === null || value === '') {
            this.removeProperty(name);
            return;
        }
        if (this._values[name]) {
            // Property already exist. Overwrite it.
            var index = Array.prototype.indexOf.call(this, name);
            if (index < 0) {
                this[this._length] = name;
                this._length++;
            }
        } else {
            // New property.
            this[this._length] = name;
            this._length++;
        }
        this._values[name] = value;
        this._importants[name] = priority;
    },

    /**
     *
     * @param {string} name
     * @see http://www.w3.org/TR/DOM-Level-2-Style/css.html#CSS-CSSStyleDeclaration-removeProperty
     * @return {string} the value of the property if it has been explicitly set for this declaration block.
     * Returns the empty string if the property has not been set or the property name does not correspond to a known CSS property.
     */
    removeProperty: function (name) {
        if (!this._values.hasOwnProperty(name)) {
            return "";
        }
        var index = Array.prototype.indexOf.call(this, name);
        if (index < 0) {
            return "";
        }
        var prevValue = this._values[name];
        delete this._values[name];

        // That's what WebKit and Opera do
        Array.prototype.splice.call(this, index, 1);

        // That's what Firefox does
        //this[index] = ""

        return prevValue;
    },


    /**
     *
     * @param {String} name
     */
    getPropertyPriority: function (name) {
        return this._importants[name] || "";
    },


    getPropertyCSSValue: function () {
        //FIXME
    },

    /**
     *   element.style.overflow = "auto"
     *   element.style.getPropertyShorthand("overflow-x")
     *   -> "overflow"
     */
    getPropertyShorthand: function () {
        //FIXME
    },

    isPropertyImplicit: function () {
        //FIXME
    },

    /**
     *   http://www.w3.org/TR/DOM-Level-2-Style/css.html#CSS-CSSStyleDeclaration-item
     */
    item: function (index) {
        index = parseInt(index, 10);
        if (index < 0 || index >= this._length) {
            return '';
        }
        return this[index];
    }
};

Object.defineProperties(CSSStyleDeclaration.prototype, {
    cssText: {
        get: function () {
            var properties = [];
            var i;
            for (i = 0; i < this._length; i++) {
                var name = this[i];
                var value = this.getPropertyValue(name);
                var priority = this.getPropertyPriority(name);
                if (priority !== '') {
                    priority = " !" + priority;
                }
                properties.push([name, ': ', value, priority, ';'].join(''));
            }
            return properties.join(' ');
        },
        set: function (value) {
            var i;
            this._values = {};
            Array.prototype.splice.call(this, 0, this._length);
            this._importants = {};
            var dummyRule = CSSOM.parse('#bogus{' + value + '}').cssRules[0].style;
            var rule_length = dummyRule.length;
            var name;
            for (i = 0; i < rule_length; ++i) {
                name = dummyRule[i];
                this.setProperty(dummyRule[i], dummyRule.getPropertyValue(name), dummyRule.getPropertyPriority(name));
            }
        },
        enumerable: true,
        configurable: true
    },
    parentRule: {
        get: function () { return null; },
        enumerable: true,
        configurable: true
    },
    length: {
        get: function () { return this._length; },
        /**
         * This deletes indices if the new length is less then the current
         * length. If the new length is more, it does nothing, the new indices
         * will be undefined until set.
         **/
        set: function (value) {
            var i;
            for (i = value; i < this._length; i++) {
                delete this[i];
            }
            this._length = value;
        },
        enumerable: true,
        configurable: true
    }
});

/*
 *
 * http://www.w3.org/TR/DOM-Level-2-Style/css.html#CSS-CSS2Properties
 */
var property_files = fs.readdirSync(__dirname + '/properties');
property_files.forEach(function (property) {
    if (property.substr(-3) === '.js') {
        property = path.basename(property, '.js');
        Object.defineProperty(CSSStyleDeclaration.prototype, property, require('./properties/' + property).definition);
    }
});

exports.CSSStyleDeclaration = CSSStyleDeclaration;
