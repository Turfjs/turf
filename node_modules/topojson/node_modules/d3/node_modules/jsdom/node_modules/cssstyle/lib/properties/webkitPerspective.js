'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-perspective', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-perspective');
    },
    enumerable: true
};
