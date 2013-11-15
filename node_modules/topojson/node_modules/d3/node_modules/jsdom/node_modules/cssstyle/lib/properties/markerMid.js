'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('marker-mid', v);
    },
    get: function () {
        return this.getPropertyValue('marker-mid');
    },
    enumerable: true
};
