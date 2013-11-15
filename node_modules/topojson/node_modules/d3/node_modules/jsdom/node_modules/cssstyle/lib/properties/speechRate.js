'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('speech-rate', v);
    },
    get: function () {
        return this.getPropertyValue('speech-rate');
    },
    enumerable: true
};
