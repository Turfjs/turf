'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-region-overflow', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-region-overflow');
    },
    enumerable: true
};
