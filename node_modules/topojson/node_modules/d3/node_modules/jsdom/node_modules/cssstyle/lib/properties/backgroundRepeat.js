'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('background-repeat', v);
    },
    get: function () {
        return this.getPropertyValue('background-repeat');
    },
    enumerable: true
};
