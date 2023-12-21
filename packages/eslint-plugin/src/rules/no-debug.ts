import { isPandaProp, isPandaAttribute } from '../helpers'
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
    },
    type: 'suggestion',
    schema: [],
  },
  defaultOptions: [],
  create: (context) => {
    return {
      JSXIdentifier(node) {
        if (node.parent.type === 'JSXAttribute' && node.name === 'debug' && isPandaProp(node)) {
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
          isPandaAttribute(node)
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
