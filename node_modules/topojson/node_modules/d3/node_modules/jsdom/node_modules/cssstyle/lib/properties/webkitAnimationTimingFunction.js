'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-animation-timing-function', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-animation-timing-function');
    },
    enumerable: true
};
