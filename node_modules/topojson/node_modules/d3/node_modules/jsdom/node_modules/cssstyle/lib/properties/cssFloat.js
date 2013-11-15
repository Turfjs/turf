'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('float', v);
    },
    get: function () {
        return this.getPropertyValue('float');
    },
    enumerable: true
};
