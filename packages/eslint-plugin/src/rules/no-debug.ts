import { createRule, type Rule } from '../utils'

export const RULE_NAME = 'no-debug'

const rule: Rule = createRule({
  name: RULE_NAME,
  meta: {
    docs: {
      description: 'Prevent shipping the debug attribute to production',
    },
    messages: {
      debug: 'Remove the debug utility.',
      debugProp: 'Remove the debug prop.',
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
            messageId: 'debugProp',
          })
        }
      },

      Property(node) {
        if (
          node.key.type === 'Identifier' &&
          node.key.name === 'debug' &&
          node.parent.type === 'ObjectExpression' &&
          node.parent.parent.type === 'CallExpression'
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
