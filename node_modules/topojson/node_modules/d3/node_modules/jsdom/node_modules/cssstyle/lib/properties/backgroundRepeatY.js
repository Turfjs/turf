'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('background-repeat-y', v);
    },
    get: function () {
        return this.getPropertyValue('background-repeat-y');
    },
    enumerable: true
};
