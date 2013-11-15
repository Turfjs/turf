'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-tap-highlight-color', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-tap-highlight-color');
    },
    enumerable: true
};
