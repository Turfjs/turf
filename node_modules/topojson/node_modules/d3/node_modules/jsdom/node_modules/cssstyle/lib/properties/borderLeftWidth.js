'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('border-left-width', v);
    },
    get: function () {
        return this.getPropertyValue('border-left-width');
    },
    enumerable: true
};
