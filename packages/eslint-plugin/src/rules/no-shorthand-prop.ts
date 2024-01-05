import { createRule, type Rule } from '../utils'
import { PandaHelpers } from 'src/utils/PandaHelpers'

export const RULE_NAME = 'no-shorthand-prop'

const rule: Rule = createRule({
  name: RULE_NAME,
  meta: {
    docs: {
      description: 'Discourage the use of shorthand properties. Prefer to use longhand css property instead.',
    },
    messages: {
      longhand: 'Use atomic property of `{{shorthand}}` instead. Prefer `{{longhand}}`',
    },
    type: 'suggestion',
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const h = new PandaHelpers(context)

    const getReport = <N>(node: N, name: string) => {
      const longhand = h.resolveLonghand(name)!

      return {
        node,
        messageId: 'longhand' as const,
        data: {
          shorthand: name,
          longhand,
        },
      }
    }

    return {
      JSXIdentifier(node) {
        const longhand = h.resolveLonghand(node.name)
        if (!longhand) return

        if (!h.isPandaProp(node)) return

        context.report(getReport(node, node.name))
      },

      Property(node) {
        if (node.key.type !== 'Identifier') return
        const longhand = h.resolveLonghand(node.key.name)
        if (!longhand) return

        if (!h.isPandaAttribute(node)) return

        context.report(getReport(node, node.key.name))
      },
    }
  },
})

export default rule
