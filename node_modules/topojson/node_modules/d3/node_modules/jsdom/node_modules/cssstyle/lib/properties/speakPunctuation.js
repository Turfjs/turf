'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('speak-punctuation', v);
    },
    get: function () {
        return this.getPropertyValue('speak-punctuation');
    },
    enumerable: true
};
