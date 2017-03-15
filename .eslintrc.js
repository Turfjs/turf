module.exports = {
  extends: 'mourner',
  parserOptions: {
    sourceType: 'module'
  },
  rules: {
    strict: [0],
    camelcase: [0],
    'consistent-return': [0],
    'valid-jsdoc': [2, {
      prefer: {'return': 'returns'},
      requireReturn: false
    }]
  }
};
