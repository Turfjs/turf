'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-flex-flow', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-flex-flow');
    },
    enumerable: true
};
