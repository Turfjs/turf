'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-animation-name', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-animation-name');
    },
    enumerable: true
};
