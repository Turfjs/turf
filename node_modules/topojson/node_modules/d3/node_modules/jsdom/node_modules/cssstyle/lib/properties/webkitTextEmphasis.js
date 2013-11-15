'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-text-emphasis', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-text-emphasis');
    },
    enumerable: true
};
