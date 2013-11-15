'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('clip', v);
    },
    get: function () {
        return this.getPropertyValue('clip');
    },
    enumerable: true
};
