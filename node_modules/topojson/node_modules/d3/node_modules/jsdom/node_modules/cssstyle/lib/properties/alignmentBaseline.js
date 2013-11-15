'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('alignment-baseline', v);
    },
    get: function () {
        return this.getPropertyValue('alignment-baseline');
    },
    enumerable: true
};
