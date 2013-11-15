'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-box-ordinal-group', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-box-ordinal-group');
    },
    enumerable: true
};
