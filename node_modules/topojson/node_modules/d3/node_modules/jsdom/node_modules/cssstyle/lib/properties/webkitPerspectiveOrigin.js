'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-perspective-origin', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-perspective-origin');
    },
    enumerable: true
};
