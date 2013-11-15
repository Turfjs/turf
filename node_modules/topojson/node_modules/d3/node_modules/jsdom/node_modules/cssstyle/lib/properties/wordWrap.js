'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('word-wrap', v);
    },
    get: function () {
        return this.getPropertyValue('word-wrap');
    },
    enumerable: true
};
