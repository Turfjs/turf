'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('text-overline-style', v);
    },
    get: function () {
        return this.getPropertyValue('text-overline-style');
    },
    enumerable: true
};
