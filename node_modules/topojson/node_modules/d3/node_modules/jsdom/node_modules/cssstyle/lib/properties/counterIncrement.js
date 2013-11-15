'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('counter-increment', v);
    },
    get: function () {
        return this.getPropertyValue('counter-increment');
    },
    enumerable: true
};
