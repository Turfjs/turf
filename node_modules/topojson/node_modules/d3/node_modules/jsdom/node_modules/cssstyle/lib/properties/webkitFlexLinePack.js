'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-flex-line-pack', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-flex-line-pack');
    },
    enumerable: true
};
