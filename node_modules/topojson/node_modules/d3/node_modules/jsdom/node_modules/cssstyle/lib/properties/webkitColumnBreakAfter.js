'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-column-break-after', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-column-break-after');
    },
    enumerable: true
};
