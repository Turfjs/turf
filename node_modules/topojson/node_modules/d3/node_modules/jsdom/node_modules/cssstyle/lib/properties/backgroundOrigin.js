'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('background-origin', v);
    },
    get: function () {
        return this.getPropertyValue('background-origin');
    },
    enumerable: true
};
