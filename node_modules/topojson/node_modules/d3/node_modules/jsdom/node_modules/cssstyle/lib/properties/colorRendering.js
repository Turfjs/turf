'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('color-rendering', v);
    },
    get: function () {
        return this.getPropertyValue('color-rendering');
    },
    enumerable: true
};
