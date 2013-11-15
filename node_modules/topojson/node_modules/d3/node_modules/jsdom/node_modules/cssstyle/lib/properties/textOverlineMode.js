'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('text-overline-mode', v);
    },
    get: function () {
        return this.getPropertyValue('text-overline-mode');
    },
    enumerable: true
};
