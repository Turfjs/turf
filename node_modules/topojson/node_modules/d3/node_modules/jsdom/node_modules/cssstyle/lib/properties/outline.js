'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('outline', v);
    },
    get: function () {
        return this.getPropertyValue('outline');
    },
    enumerable: true
};
