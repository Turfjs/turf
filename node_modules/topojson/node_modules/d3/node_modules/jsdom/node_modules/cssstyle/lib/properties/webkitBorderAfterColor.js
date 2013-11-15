'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-border-after-color', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-border-after-color');
    },
    enumerable: true
};
