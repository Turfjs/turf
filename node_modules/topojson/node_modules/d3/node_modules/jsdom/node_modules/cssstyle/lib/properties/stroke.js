'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('stroke', v);
    },
    get: function () {
        return this.getPropertyValue('stroke');
    },
    enumerable: true
};
