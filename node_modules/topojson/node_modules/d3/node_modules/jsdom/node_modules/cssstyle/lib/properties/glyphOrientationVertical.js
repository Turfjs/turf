'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('glyph-orientation-vertical', v);
    },
    get: function () {
        return this.getPropertyValue('glyph-orientation-vertical');
    },
    enumerable: true
};
