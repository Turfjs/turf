'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('quotes', v);
    },
    get: function () {
        return this.getPropertyValue('quotes');
    },
    enumerable: true
};
