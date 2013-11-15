'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('border-bottom-color', v);
    },
    get: function () {
        return this.getPropertyValue('border-bottom-color');
    },
    enumerable: true
};
