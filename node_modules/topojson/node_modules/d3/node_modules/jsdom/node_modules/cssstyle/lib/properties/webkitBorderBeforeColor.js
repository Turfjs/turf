'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-border-before-color', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-border-before-color');
    },
    enumerable: true
};
