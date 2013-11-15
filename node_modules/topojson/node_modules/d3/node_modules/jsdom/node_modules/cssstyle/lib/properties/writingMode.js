'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('writing-mode', v);
    },
    get: function () {
        return this.getPropertyValue('writing-mode');
    },
    enumerable: true
};
