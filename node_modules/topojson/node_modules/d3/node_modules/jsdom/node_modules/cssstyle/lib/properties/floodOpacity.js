'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('flood-opacity', v);
    },
    get: function () {
        return this.getPropertyValue('flood-opacity');
    },
    enumerable: true
};
