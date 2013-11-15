'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('border-left', v);
    },
    get: function () {
        return this.getPropertyValue('border-left');
    },
    enumerable: true
};
