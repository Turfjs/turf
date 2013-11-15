'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('fill-rule', v);
    },
    get: function () {
        return this.getPropertyValue('fill-rule');
    },
    enumerable: true
};
