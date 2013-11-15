'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-transform-origin', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-transform-origin');
    },
    enumerable: true
};
