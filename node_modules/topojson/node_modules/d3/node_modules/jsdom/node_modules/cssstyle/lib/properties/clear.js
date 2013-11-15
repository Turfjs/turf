'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('clear', v);
    },
    get: function () {
        return this.getPropertyValue('clear');
    },
    enumerable: true
};
