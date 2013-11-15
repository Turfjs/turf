'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('bottom', v);
    },
    get: function () {
        return this.getPropertyValue('bottom');
    },
    enumerable: true
};
