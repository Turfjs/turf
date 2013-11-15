'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-region-break-before', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-region-break-before');
    },
    enumerable: true
};
