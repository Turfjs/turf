'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-box-direction', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-box-direction');
    },
    enumerable: true
};
