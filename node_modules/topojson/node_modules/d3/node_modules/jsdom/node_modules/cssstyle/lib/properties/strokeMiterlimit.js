'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('stroke-miterlimit', v);
    },
    get: function () {
        return this.getPropertyValue('stroke-miterlimit');
    },
    enumerable: true
};
