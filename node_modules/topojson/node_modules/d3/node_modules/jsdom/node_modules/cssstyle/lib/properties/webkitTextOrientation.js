'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-text-orientation', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-text-orientation');
    },
    enumerable: true
};
