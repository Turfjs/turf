'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('right', v);
    },
    get: function () {
        return this.getPropertyValue('right');
    },
    enumerable: true
};
