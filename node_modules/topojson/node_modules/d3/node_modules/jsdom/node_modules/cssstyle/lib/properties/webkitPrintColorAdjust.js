'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-print-color-adjust', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-print-color-adjust');
    },
    enumerable: true
};
