'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-wrap-padding', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-wrap-padding');
    },
    enumerable: true
};
