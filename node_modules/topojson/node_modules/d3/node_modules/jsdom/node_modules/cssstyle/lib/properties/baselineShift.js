'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('baseline-shift', v);
    },
    get: function () {
        return this.getPropertyValue('baseline-shift');
    },
    enumerable: true
};
