const toNotIgnore = {
  modules: [].join('|'),
};

const toExport = {
  roots: ['<rootDir>'],
  transformIgnorePatterns: ['node_modules', '/<rootDir>/lib', '/<rootDir>/(?!src)'],
  verbose: true,
  testRegex: '(/test/.*(test|spec))\\.[jt]sx?$',
};

if (toNotIgnore.modules.length) {
  toExport.transformIgnorePatterns.push(`/node_modules/(?!(${toNotIgnore.modules}))`);
}

module.exports = toExport;
