'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('richness', v);
    },
    get: function () {
        return this.getPropertyValue('richness');
    },
    enumerable: true
};
