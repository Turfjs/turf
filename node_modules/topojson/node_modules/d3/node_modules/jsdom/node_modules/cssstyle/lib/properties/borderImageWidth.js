'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('border-image-width', v);
    },
    get: function () {
        return this.getPropertyValue('border-image-width');
    },
    enumerable: true
};
