'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-border-end-style', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-border-end-style');
    },
    enumerable: true
};
