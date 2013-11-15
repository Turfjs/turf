'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('line-height', v);
    },
    get: function () {
        return this.getPropertyValue('line-height');
    },
    enumerable: true
};
