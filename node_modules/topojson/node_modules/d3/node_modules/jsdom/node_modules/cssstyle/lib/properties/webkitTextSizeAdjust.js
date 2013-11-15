'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-text-size-adjust', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-text-size-adjust');
    },
    enumerable: true
};
