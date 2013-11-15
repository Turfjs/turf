'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('vector-effect', v);
    },
    get: function () {
        return this.getPropertyValue('vector-effect');
    },
    enumerable: true
};
