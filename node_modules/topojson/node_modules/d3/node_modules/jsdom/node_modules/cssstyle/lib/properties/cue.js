'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('cue', v);
    },
    get: function () {
        return this.getPropertyValue('cue');
    },
    enumerable: true
};
