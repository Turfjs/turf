'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('marker-end', v);
    },
    get: function () {
        return this.getPropertyValue('marker-end');
    },
    enumerable: true
};
