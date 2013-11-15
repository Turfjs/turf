'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('stress', v);
    },
    get: function () {
        return this.getPropertyValue('stress');
    },
    enumerable: true
};
