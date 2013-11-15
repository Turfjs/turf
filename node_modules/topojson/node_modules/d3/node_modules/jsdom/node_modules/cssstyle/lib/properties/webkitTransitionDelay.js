'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-transition-delay', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-transition-delay');
    },
    enumerable: true
};
