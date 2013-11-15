'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('content', v);
    },
    get: function () {
        return this.getPropertyValue('content');
    },
    enumerable: true
};
