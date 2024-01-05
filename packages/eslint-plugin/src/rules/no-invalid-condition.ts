import { createRule, type Rule } from '../utils'
import { PandaHelpers } from 'src/utils/PandaHelpers'

export const RULE_NAME = 'no-invalid-condition'

const rule: Rule = createRule({
  name: RULE_NAME,
  meta: {
    docs: {
      description: 'Warn against invalid conditions in config and presets',
    },
    messages: {
      invalidCondition: 'Invalid condition.',
    },
    type: 'suggestion',
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const h = new PandaHelpers(context)

    return {
      JSXIdentifier(node) {
        if (!/^_[a-zA-Z0-9_]+$/.test(node.name)) return
        if (h.ctx.isValidProperty(node.name)) return
        if (!h.isPandaProp(node)) return

        context.report({
          node,
          messageId: 'invalidCondition',
        })
      },

      Property(node) {
        if (node.key.type !== 'Identifier' || !/^_[a-zA-Z0-9_]+$/.test(node.key.name)) return
        if (h.ctx.isValidProperty(node.key.name)) return
        if (!h.isPandaAttribute(node)) return

        context.report({
          node,
          messageId: 'invalidCondition',
        })
      },
    }
  },
})

export default rule
