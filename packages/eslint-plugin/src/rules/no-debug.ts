import { AST_NODE_TYPES, createRule, type Rule } from '../utils'

export const RULE_NAME = 'no-debug'

function hasAncestorOfType(node: any, ancestorType: any) {
  if (!node || !node.parent) {
    return false
  }

  if (node.parent.type === ancestorType) {
    return true
  }

  return hasAncestorOfType(node.parent, ancestorType)
}

const rule: Rule = createRule({
  name: RULE_NAME,
  meta: {
    docs: {
      description: 'Prevent shipping the debug attribute to production',
    },
    messages: {
      debug: 'Remove the debug utility.',
    },
    type: 'suggestion',
    schema: [],
  },
  defaultOptions: [],
  create: (context) => {
    return {
      // TODO limit only to panda components
      JSXIdentifier(node) {
        if (node.parent.type === 'JSXAttribute' && node.name === 'debug') {
          context.report({
            node,
            messageId: 'debug',
          })
        }
      },

      Property(node) {
        if (
          node.key.type === 'Identifier' &&
          node.key.name === 'debug' &&
          node.parent.type === 'ObjectExpression' &&
          // TODO Object could be JSX prop value i.e css or pseudo
          //
          hasAncestorOfType(node, AST_NODE_TYPES.CallExpression)
          // TODO Something like this to limit to panda methods
          // node.parent.parent.callee.type === 'Identifier' && node.parent.parent.callee.name === 'css'
        ) {
          context.report({
            node,
            messageId: 'debug',
          })
        }
      },
    }
  },
})

export default rule
