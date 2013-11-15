'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('border-style', v);
    },
    get: function () {
        return this.getPropertyValue('border-style');
    },
    enumerable: true
};
