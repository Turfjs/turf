'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('background-attachment', v);
    },
    get: function () {
        return this.getPropertyValue('background-attachment');
    },
    enumerable: true
};
