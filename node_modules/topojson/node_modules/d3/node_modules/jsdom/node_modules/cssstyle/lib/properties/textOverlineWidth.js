'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('text-overline-width', v);
    },
    get: function () {
        return this.getPropertyValue('text-overline-width');
    },
    enumerable: true
};
