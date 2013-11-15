'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-border-before', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-border-before');
    },
    enumerable: true
};
