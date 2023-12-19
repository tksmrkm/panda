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
      JSXIdentifier(node) {
        if (node.parent.type === 'JSXAttribute' && node.name === 'debug') {
          context.report({
            node,
            messageId: 'debugProp',
          })
        }
      },

      Property(node) {
        if (node.key.type === 'Identifier' && node.key.name === 'debug') {
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
