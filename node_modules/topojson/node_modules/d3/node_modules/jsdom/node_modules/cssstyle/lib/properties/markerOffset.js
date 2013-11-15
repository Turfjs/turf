'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('marker-offset', v);
    },
    get: function () {
        return this.getPropertyValue('marker-offset');
    },
    enumerable: true
};
