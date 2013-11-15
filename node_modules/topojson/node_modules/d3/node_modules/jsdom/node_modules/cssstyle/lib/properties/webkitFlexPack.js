'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-flex-pack', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-flex-pack');
    },
    enumerable: true
};
