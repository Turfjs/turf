'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-column-rule-color', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-column-rule-color');
    },
    enumerable: true
};
