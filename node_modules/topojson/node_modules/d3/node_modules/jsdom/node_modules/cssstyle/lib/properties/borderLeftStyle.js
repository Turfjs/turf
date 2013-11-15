'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('border-left-style', v);
    },
    get: function () {
        return this.getPropertyValue('border-left-style');
    },
    enumerable: true
};
