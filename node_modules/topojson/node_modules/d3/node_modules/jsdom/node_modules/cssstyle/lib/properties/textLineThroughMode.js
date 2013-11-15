'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('text-line-through-mode', v);
    },
    get: function () {
        return this.getPropertyValue('text-line-through-mode');
    },
    enumerable: true
};
