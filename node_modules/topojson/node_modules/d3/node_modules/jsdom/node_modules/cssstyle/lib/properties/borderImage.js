'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('border-image', v);
    },
    get: function () {
        return this.getPropertyValue('border-image');
    },
    enumerable: true
};
