'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('border-color', v);
    },
    get: function () {
        return this.getPropertyValue('border-color');
    },
    enumerable: true
};
