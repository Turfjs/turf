'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('border-image-outset', v);
    },
    get: function () {
        return this.getPropertyValue('border-image-outset');
    },
    enumerable: true
};
