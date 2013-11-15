'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('elevation', v);
    },
    get: function () {
        return this.getPropertyValue('elevation');
    },
    enumerable: true
};
