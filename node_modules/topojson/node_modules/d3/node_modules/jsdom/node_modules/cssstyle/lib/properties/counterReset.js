'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('counter-reset', v);
    },
    get: function () {
        return this.getPropertyValue('counter-reset');
    },
    enumerable: true
};
