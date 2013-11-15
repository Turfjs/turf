'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-border-radius', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-border-radius');
    },
    enumerable: true
};
