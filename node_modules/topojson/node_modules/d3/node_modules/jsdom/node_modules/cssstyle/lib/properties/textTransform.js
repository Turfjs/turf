'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('text-transform', v);
    },
    get: function () {
        return this.getPropertyValue('text-transform');
    },
    enumerable: true
};
