'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-margin-end', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-margin-end');
    },
    enumerable: true
};
