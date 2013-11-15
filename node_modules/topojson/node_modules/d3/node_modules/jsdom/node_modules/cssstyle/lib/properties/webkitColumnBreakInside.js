'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-column-break-inside', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-column-break-inside');
    },
    enumerable: true
};
