'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('font-style', v);
    },
    get: function () {
        return this.getPropertyValue('font-style');
    },
    enumerable: true
};
