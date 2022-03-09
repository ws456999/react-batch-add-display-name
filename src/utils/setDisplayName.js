const store = require('./store')

let displayNames = {}
const TRANSPILE_ANONYMOUS_FUNCTION_NAME_START_SUMBOL = '_'

/**
 * Checks if this path will be assigned later in the scope.
 *
 * @param {Types} types content of @babel/types package
 * @param {Path} assignmentPath path where assignement will take place
 * @param {string} pattern assignment path in string form e.g. `x.y.z`
 */
function hasBeenAssignedNext(types, assignmentPath, pattern) {
  return assignmentPath.getAllNextSiblings().some((sibling) => {
    const expression = sibling.get('expression')

    if (!types.isAssignmentExpression(expression.node, { operator: '=' })) {
      return false
    }
    return expression.get('left').node.property.name === 'displayName'
  })
}

module.exports = {
  resetCache() {
    displayNames = {}
  },
  setDisplayName(path, nameNodeId, types, name, resourcePath) {
    let abortAppend

    if (Array.isArray(nameNodeId)) {
      abortAppend = nameNodeId.some(
        (node) =>
          !node ||
          types.isThisExpression(node.object) ||
          (node.object && node.object.name === '_this') ||
          types.isStringLiteral(node)
      )
    } else {
      const getName = (node) =>
        types.isMemberExpression(node) ? node.object.name : node.name
      const declarationName = getName(nameNodeId)

      abortAppend =
        TRANSPILE_ANONYMOUS_FUNCTION_NAME_START_SUMBOL !==
          declarationName.charAt(0) &&
        declarationName.charAt(0) ===
          declarationName.charAt(0).toLocaleLowerCase()
    }

    if (abortAppend || !name || displayNames[name]) {
      return
    }

    const blockLevelStatement = path.find((path) => path.parentPath.isBlock())

    if (!blockLevelStatement) {
      return
    }

    let node

    if (Array.isArray(nameNodeId)) {
      for (let i = 0; i < nameNodeId.length; i += 2) {
        node = types.memberExpression(
          node || nameNodeId[i],
          node ? nameNodeId[i] : nameNodeId[i + 1]
        )
      }
    } else {
      node = nameNodeId
    }

    const displayNameStatement = types.expressionStatement(
      types.assignmentExpression(
        '=',
        types.memberExpression(node, types.identifier('displayName')),
        types.stringLiteral(name)
      )
    )

    displayNames[name] = true
    if (hasBeenAssignedNext(types, blockLevelStatement, name)) {
      return
    } else {
      store.set(resourcePath, true)
      blockLevelStatement.insertAfter(displayNameStatement)
    }
  },
}
