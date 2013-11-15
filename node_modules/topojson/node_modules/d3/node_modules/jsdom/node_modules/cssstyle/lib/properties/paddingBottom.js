'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('padding-bottom', v);
    },
    get: function () {
        return this.getPropertyValue('padding-bottom');
    },
    enumerable: true
};
