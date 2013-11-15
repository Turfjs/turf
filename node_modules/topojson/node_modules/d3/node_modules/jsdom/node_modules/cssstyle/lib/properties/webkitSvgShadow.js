'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-svg-shadow', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-svg-shadow');
    },
    enumerable: true
};
