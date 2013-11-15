'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-box-orient', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-box-orient');
    },
    enumerable: true
};
