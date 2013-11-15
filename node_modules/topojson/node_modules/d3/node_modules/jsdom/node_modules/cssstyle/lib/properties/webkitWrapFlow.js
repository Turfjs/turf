'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-wrap-flow', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-wrap-flow');
    },
    enumerable: true
};
