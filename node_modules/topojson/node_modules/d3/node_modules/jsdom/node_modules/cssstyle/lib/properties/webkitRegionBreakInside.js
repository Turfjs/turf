'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-region-break-inside', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-region-break-inside');
    },
    enumerable: true
};
