'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('text-rendering', v);
    },
    get: function () {
        return this.getPropertyValue('text-rendering');
    },
    enumerable: true
};
