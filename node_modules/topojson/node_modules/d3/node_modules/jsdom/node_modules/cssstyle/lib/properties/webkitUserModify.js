'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-user-modify', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-user-modify');
    },
    enumerable: true
};
