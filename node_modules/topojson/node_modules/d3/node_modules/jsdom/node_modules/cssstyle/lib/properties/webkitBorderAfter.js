'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-border-after', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-border-after');
    },
    enumerable: true
};
