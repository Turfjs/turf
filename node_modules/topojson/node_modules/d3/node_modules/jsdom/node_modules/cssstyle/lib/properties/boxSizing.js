'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('box-sizing', v);
    },
    get: function () {
        return this.getPropertyValue('box-sizing');
    },
    enumerable: true
};
