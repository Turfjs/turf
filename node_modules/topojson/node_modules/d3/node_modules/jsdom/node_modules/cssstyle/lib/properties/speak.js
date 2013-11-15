'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('speak', v);
    },
    get: function () {
        return this.getPropertyValue('speak');
    },
    enumerable: true
};
