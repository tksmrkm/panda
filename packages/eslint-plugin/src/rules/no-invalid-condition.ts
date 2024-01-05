import { isPandaAttribute, isPandaProp } from 'src/utils/helpers'
import { createRule, type Rule } from '../utils'
import { createContext } from '@pandacss/fixture'

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
    const ctx = createContext()

    return {
      JSXIdentifier(node) {
        if (!/^_[a-zA-Z0-9_]+$/.test(node.name)) return
        if (ctx.isValidProperty(node.name)) return
        if (!isPandaProp(node)) return

        context.report({
          node,
          messageId: 'invalidCondition',
        })
      },

      Property(node) {
        if (node.key.type !== 'Identifier' || !/^_[a-zA-Z0-9_]+$/.test(node.key.name)) return
        if (ctx.isValidProperty(node.key.name)) return
        if (!isPandaAttribute(node, ctx)) return

        context.report({
          node,
          messageId: 'invalidCondition',
        })
      },
    }
  },
})

export default rule
