'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('flood-color', v);
    },
    get: function () {
        return this.getPropertyValue('flood-color');
    },
    enumerable: true
};
