'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('min-height', v);
    },
    get: function () {
        return this.getPropertyValue('min-height');
    },
    enumerable: true
};
