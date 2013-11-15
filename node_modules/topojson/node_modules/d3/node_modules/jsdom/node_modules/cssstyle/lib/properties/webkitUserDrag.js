'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-user-drag', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-user-drag');
    },
    enumerable: true
};
