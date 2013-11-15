'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-padding-before', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-padding-before');
    },
    enumerable: true
};
