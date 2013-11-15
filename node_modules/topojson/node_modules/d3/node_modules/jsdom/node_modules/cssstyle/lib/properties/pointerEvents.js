'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('pointer-events', v);
    },
    get: function () {
        return this.getPropertyValue('pointer-events');
    },
    enumerable: true
};
