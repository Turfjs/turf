'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-text-emphasis-color', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-text-emphasis-color');
    },
    enumerable: true
};
