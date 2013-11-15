'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-user-select', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-user-select');
    },
    enumerable: true
};
