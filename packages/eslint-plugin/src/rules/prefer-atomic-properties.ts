import { createRule, type Rule } from '../utils'
import { PandaHelpers } from 'src/utils/PandaHelpers'
import { shorthandProperties } from 'src/utils/shorthand-properties'

export const RULE_NAME = 'prefer-atomic-properties'

const rule: Rule = createRule({
  name: RULE_NAME,
  meta: {
    docs: {
      description: 'Prefer atomic properties over shorthand properties',
    },
    messages: {
      atomic: 'Use atomic properties of `{{compound}}` instead. Prefer: \n{{atomics}}',
    },
    type: 'suggestion',
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const h = new PandaHelpers(context)

    const resolveCompoundProperty = (name: string) => {
      if (Object.hasOwn(shorthandProperties, name)) return name

      const longhand = h.ctx.utility.resolveShorthand(name)
      if (h.ctx.isValidProperty(longhand) && Object.hasOwn(shorthandProperties, longhand)) return longhand
    }

    const getReport = <N, M>(node: N, name: string) => {
      const cpd = resolveCompoundProperty(name)!

      const atomics = shorthandProperties[cpd].map((name) => `\`${name}\``).join(',\n')

      return {
        node,
        messageId: 'atomic' as M,
        data: {
          compound: name,
          atomics,
        },
      }
    }

    return {
      JSXIdentifier(node) {
        const cpd = resolveCompoundProperty(node.name)
        if (!cpd) return

        if (!h.isPandaProp(node)) return

        context.report(getReport(node, node.name))
      },

      Property(node) {
        if (node.key.type !== 'Identifier') return
        const cpd = resolveCompoundProperty(node.key.name)
        if (!cpd) return

        if (!h.isPandaAttribute(node)) return

        context.report(getReport(node, node.key.name))
      },
    }
  },
})

export default rule
