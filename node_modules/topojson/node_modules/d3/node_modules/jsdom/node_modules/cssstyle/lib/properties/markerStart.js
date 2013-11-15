'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('marker-start', v);
    },
    get: function () {
        return this.getPropertyValue('marker-start');
    },
    enumerable: true
};
