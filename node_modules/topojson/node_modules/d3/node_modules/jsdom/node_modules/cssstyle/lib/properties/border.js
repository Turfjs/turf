'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('border', v);
    },
    get: function () {
        return this.getPropertyValue('border');
    },
    enumerable: true
};
