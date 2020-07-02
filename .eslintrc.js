module.exports = {
  extends: [require.resolve('@znemz/js-common-eslint-config')], // so much fun figuring this out :(
  rules: {
    'import/extensions': ['error', 'json'],
    '@typescript-eslint/ban-ts-ignore': 0,
    '@typescript-eslint/no-inferrable-types': 0,
    'import/no-extraneous-dependencies': (context) => [
      'error',
      {
        devDependencies: true,
        optionalDependencies: false,
        peerDependencies: false,
        packageDir: [context.getFilename(), __dirname],
      },
    ],
  },
};
