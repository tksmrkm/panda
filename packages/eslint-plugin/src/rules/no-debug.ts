import { isPandaAttribute, isPandaProp } from 'src/utils/helpers'
import { createRule, type Rule } from '../utils'
import { createContext } from '@pandacss/fixture'

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
  create(context) {
    const ctx = createContext()

    return {
      JSXIdentifier(node) {
        if (node.name !== 'debug') return
        if (!isPandaProp(node, ctx)) return

        context.report({
          node,
          messageId: 'debug',
        })
      },

      Property(node) {
        if (node.key.type !== 'Identifier' || node.key.name !== 'debug') return
        if (!isPandaAttribute(node, ctx)) return

        context.report({
          node,
          messageId: 'debug',
        })
      },
    }
  },
})

export default rule
