'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-transition', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-transition');
    },
    enumerable: true
};
