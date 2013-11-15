'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('play-during', v);
    },
    get: function () {
        return this.getPropertyValue('play-during');
    },
    enumerable: true
};
