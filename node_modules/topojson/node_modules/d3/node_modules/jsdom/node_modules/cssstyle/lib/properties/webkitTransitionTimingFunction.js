'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-transition-timing-function', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-transition-timing-function');
    },
    enumerable: true
};
