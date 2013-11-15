'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-padding-after', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-padding-after');
    },
    enumerable: true
};
