const prettier = require('prettier');

module.exports = function pretty(code) {
  return prettier.format(code, {
    parser: 'typescript',
    printWidth: 80,
    tabWidth: 2,
    useTabs: false,
    semi: true,
    singleQuote: true,
    trailingComma: 'es5',
    bracketSpacing: false,
    arrowParens: 'always',
    jsxBracketSameLine: false,
  });
}
