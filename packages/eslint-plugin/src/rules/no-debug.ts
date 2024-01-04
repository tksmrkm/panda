import { createRule, type Rule } from '../utils'
import { ruleListener } from '../utils/rule-listener'

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
  create: ruleListener({
    attribute(node, context) {
      if (node.key.name === 'debug') {
        context.report({
          node,
          messageId: 'debug',
        })
      }
    },

    prop(node, context) {
      if (node.name === 'debug') {
        context.report({
          node,
          messageId: 'debug',
        })
      }
    },
  }),
})

export default rule
