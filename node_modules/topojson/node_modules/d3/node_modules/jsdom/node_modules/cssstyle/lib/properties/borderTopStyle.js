'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('border-top-style', v);
    },
    get: function () {
        return this.getPropertyValue('border-top-style');
    },
    enumerable: true
};
