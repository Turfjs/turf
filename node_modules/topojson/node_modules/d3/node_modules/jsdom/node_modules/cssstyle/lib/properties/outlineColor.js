'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('outline-color', v);
    },
    get: function () {
        return this.getPropertyValue('outline-color');
    },
    enumerable: true
};
