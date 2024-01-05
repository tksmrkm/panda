import { PandaHelpers } from 'src/utils/PandaHelpers'
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
  create(context) {
    const h = new PandaHelpers(context)

    // console.log('context.filename', context.getPhysicalFilename())
    console.log('include', h.ctx.config.include)

    return {
      JSXIdentifier(node) {
        if (node.name !== 'debug') return
        if (!h.isPandaProp(node)) return

        context.report({
          node,
          messageId: 'debug',
        })
      },

      Property(node) {
        if (node.key.type !== 'Identifier' || node.key.name !== 'debug') return
        if (!h.isPandaAttribute(node)) return

        context.report({
          node,
          messageId: 'debug',
        })
      },
    }
  },
})

export default rule
