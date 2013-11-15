'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('word-spacing', v);
    },
    get: function () {
        return this.getPropertyValue('word-spacing');
    },
    enumerable: true
};
