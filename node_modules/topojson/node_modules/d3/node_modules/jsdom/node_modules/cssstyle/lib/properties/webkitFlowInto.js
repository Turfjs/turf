'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-flow-into', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-flow-into');
    },
    enumerable: true
};
