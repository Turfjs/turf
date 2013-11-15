'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-line-snap', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-line-snap');
    },
    enumerable: true
};
