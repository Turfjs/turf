'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-text-emphasis-style', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-text-emphasis-style');
    },
    enumerable: true
};
