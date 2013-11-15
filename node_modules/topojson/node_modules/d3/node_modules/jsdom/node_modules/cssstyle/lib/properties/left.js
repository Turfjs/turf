'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('left', v);
    },
    get: function () {
        return this.getPropertyValue('left');
    },
    enumerable: true
};
