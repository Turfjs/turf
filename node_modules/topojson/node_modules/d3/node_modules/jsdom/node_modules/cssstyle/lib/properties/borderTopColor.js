'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('border-top-color', v);
    },
    get: function () {
        return this.getPropertyValue('border-top-color');
    },
    enumerable: true
};
