'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('text-underline-color', v);
    },
    get: function () {
        return this.getPropertyValue('text-underline-color');
    },
    enumerable: true
};
