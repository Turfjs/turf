'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-margin-start', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-margin-start');
    },
    enumerable: true
};
