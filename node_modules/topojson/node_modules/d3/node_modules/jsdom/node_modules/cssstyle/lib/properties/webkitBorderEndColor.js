'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-border-end-color', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-border-end-color');
    },
    enumerable: true
};
