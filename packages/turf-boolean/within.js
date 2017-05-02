var contains = require('./contains');

module.exports = function (feature1, feature2) {
    return contains(feature2, feature1);
};
