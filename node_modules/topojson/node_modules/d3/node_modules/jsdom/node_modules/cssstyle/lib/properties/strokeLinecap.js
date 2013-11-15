'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('stroke-linecap', v);
    },
    get: function () {
        return this.getPropertyValue('stroke-linecap');
    },
    enumerable: true
};
