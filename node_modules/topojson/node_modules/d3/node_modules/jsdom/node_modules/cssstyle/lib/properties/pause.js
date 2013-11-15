'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('pause', v);
    },
    get: function () {
        return this.getPropertyValue('pause');
    },
    enumerable: true
};
