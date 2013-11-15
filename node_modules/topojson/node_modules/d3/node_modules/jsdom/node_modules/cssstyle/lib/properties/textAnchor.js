'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('text-anchor', v);
    },
    get: function () {
        return this.getPropertyValue('text-anchor');
    },
    enumerable: true
};
