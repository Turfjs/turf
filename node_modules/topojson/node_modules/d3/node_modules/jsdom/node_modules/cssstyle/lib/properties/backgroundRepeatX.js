'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('background-repeat-x', v);
    },
    get: function () {
        return this.getPropertyValue('background-repeat-x');
    },
    enumerable: true
};
