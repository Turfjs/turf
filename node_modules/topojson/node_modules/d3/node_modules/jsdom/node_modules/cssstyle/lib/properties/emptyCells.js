'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('empty-cells', v);
    },
    get: function () {
        return this.getPropertyValue('empty-cells');
    },
    enumerable: true
};
