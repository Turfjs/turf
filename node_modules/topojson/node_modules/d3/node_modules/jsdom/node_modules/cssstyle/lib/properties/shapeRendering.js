'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('shape-rendering', v);
    },
    get: function () {
        return this.getPropertyValue('shape-rendering');
    },
    enumerable: true
};
