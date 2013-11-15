'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('padding-left', v);
    },
    get: function () {
        return this.getPropertyValue('padding-left');
    },
    enumerable: true
};
