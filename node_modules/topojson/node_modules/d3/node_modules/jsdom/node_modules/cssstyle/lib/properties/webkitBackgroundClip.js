'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-background-clip', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-background-clip');
    },
    enumerable: true
};
