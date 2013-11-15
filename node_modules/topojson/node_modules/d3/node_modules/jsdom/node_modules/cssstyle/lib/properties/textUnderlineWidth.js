'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('text-underline-width', v);
    },
    get: function () {
        return this.getPropertyValue('text-underline-width');
    },
    enumerable: true
};
