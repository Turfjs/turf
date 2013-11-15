'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('border-left-color', v);
    },
    get: function () {
        return this.getPropertyValue('border-left-color');
    },
    enumerable: true
};
