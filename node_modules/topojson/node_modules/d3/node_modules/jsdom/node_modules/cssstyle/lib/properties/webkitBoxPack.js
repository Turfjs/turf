'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-box-pack', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-box-pack');
    },
    enumerable: true
};
