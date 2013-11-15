'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('stop-color', v);
    },
    get: function () {
        return this.getPropertyValue('stop-color');
    },
    enumerable: true
};
