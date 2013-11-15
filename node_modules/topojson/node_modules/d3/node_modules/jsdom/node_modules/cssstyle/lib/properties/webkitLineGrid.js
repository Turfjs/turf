'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-line-grid', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-line-grid');
    },
    enumerable: true
};
