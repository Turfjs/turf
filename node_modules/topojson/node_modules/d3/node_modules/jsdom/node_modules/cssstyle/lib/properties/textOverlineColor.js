'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('text-overline-color', v);
    },
    get: function () {
        return this.getPropertyValue('text-overline-color');
    },
    enumerable: true
};
