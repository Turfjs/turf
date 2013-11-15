'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('dominant-baseline', v);
    },
    get: function () {
        return this.getPropertyValue('dominant-baseline');
    },
    enumerable: true
};
