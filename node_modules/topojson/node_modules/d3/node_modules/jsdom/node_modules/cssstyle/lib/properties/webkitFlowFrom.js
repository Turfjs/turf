'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-flow-from', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-flow-from');
    },
    enumerable: true
};
