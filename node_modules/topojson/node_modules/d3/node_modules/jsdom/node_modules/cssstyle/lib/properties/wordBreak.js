'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('word-break', v);
    },
    get: function () {
        return this.getPropertyValue('word-break');
    },
    enumerable: true
};
