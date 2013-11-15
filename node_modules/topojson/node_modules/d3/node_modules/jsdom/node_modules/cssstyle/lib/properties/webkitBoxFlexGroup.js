'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-box-flex-group', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-box-flex-group');
    },
    enumerable: true
};
