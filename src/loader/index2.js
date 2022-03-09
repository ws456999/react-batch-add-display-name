const { parse, parseExpression } = require('@babel/parser')
const generator = require('@babel/generator').default
const fs = require('fs')
const traverse = require('@babel/traverse').default
const pretty = require('../utils/pretty')
const display = require('../utils/display')
// const display2 = require('@hh.ru/babel-plugin-react-displayname/lib/index')
const t = require('@babel/core').types;
const store = require('../utils/store');

const plugins = [
  'typescript',
  'jsx',
  'objectRestSpread',
  'dynamicImport',
  'decorators-legacy',
  'classProperties',
  'optionalChaining',
  'nullishCoalescingOperator',
]

function trans(content, { resourcePath, fileName }) {
  const ast = parse(content, {
    sourceType: 'module',
    decoratorsBeforeExport: true,
    plugins: plugins,
  })
  traverse(
    ast,
    display(
      { types: t },
      {
        resourcePath,
        file: {
          opts: { filename: fileName },
        },
      }
    ).visitor
  )
  if (store.get(resourcePath)) {
    const code = generator(ast, {
      sourceType: 'module',
      decoratorsBeforeExport: true,
      comments: true,
      compact: true,
      plugins: plugins,
      retainLines: true,
    }).code
    fs.writeFileSync(resourcePath, pretty(code), 'utf8')
  }
}

module.exports = trans
