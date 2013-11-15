'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('background-image', v);
    },
    get: function () {
        return this.getPropertyValue('background-image');
    },
    enumerable: true
};
