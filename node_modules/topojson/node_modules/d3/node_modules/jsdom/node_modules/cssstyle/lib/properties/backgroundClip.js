'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('background-clip', v);
    },
    get: function () {
        return this.getPropertyValue('background-clip');
    },
    enumerable: true
};
