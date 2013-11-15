'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('background-position', v);
    },
    get: function () {
        return this.getPropertyValue('background-position');
    },
    enumerable: true
};
