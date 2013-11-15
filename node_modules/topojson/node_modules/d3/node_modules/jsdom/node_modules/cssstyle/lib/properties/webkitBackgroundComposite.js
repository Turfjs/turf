'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-background-composite', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-background-composite');
    },
    enumerable: true
};
