'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-rtl-ordering', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-rtl-ordering');
    },
    enumerable: true
};
