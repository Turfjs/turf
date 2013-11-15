'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('border-right-color', v);
    },
    get: function () {
        return this.getPropertyValue('border-right-color');
    },
    enumerable: true
};
