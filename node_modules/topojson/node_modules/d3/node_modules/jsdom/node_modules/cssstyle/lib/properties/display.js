'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('display', v);
    },
    get: function () {
        return this.getPropertyValue('display');
    },
    enumerable: true
};
