'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-text-combine', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-text-combine');
    },
    enumerable: true
};
