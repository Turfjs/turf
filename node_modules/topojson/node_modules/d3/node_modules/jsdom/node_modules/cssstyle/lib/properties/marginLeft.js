'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('margin-left', v);
    },
    get: function () {
        return this.getPropertyValue('margin-left');
    },
    enumerable: true
};
