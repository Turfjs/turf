'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-column-rule-width', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-column-rule-width');
    },
    enumerable: true
};
