'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-text-emphasis-position', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-text-emphasis-position');
    },
    enumerable: true
};
