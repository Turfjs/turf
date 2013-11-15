'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('border-image-repeat', v);
    },
    get: function () {
        return this.getPropertyValue('border-image-repeat');
    },
    enumerable: true
};
