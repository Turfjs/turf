'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-border-start-color', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-border-start-color');
    },
    enumerable: true
};
