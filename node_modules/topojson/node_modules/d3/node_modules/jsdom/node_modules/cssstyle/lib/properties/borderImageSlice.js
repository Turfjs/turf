'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('border-image-slice', v);
    },
    get: function () {
        return this.getPropertyValue('border-image-slice');
    },
    enumerable: true
};
