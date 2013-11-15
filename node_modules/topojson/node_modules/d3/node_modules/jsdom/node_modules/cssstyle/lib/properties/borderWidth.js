'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('border-width', v);
    },
    get: function () {
        return this.getPropertyValue('border-width');
    },
    enumerable: true
};
