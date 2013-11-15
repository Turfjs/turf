'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-border-before-style', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-border-before-style');
    },
    enumerable: true
};
