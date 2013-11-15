'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('marks', v);
    },
    get: function () {
        return this.getPropertyValue('marks');
    },
    enumerable: true
};
