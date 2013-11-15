'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('clip-path', v);
    },
    get: function () {
        return this.getPropertyValue('clip-path');
    },
    enumerable: true
};
