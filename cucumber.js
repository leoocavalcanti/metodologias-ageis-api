const common = {
  requireModule: ['ts-node/register'],
  require: ['tests/steps/*.ts', 'tests/hooks/*.ts'],
  paths: ['tests/features/'],
  format: ['progress-bar', 'html:cucumber-report.html'],
  formatOptions: { snippetInterface: 'async-await' },
  publishQuiet: true,
};

module.exports = {
  default: {
    ...common,
  },
}; 