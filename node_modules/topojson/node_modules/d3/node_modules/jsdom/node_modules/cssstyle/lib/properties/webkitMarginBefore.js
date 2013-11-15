'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-margin-before', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-margin-before');
    },
    enumerable: true
};
