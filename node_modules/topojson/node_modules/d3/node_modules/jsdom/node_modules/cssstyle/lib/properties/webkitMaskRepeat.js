'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-mask-repeat', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-mask-repeat');
    },
    enumerable: true
};
