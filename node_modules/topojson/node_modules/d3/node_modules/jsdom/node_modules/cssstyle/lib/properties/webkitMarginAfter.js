'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-margin-after', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-margin-after');
    },
    enumerable: true
};
