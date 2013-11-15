'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('image-rendering', v);
    },
    get: function () {
        return this.getPropertyValue('image-rendering');
    },
    enumerable: true
};
