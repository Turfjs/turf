'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-perspective-origin-x', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-perspective-origin-x');
    },
    enumerable: true
};
