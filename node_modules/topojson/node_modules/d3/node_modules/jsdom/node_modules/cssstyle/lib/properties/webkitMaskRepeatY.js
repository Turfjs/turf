'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-mask-repeat-y', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-mask-repeat-y');
    },
    enumerable: true
};
