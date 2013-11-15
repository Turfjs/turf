'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('text-underline-mode', v);
    },
    get: function () {
        return this.getPropertyValue('text-underline-mode');
    },
    enumerable: true
};
