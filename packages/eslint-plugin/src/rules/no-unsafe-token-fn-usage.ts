import { createRule, type Rule } from '../utils'
import { PandaHelpers } from 'src/utils/PandaHelpers'
import { TSESTree } from '@typescript-eslint/utils'

export const RULE_NAME = 'no-unsafe-token-fn-usage'

const rule: Rule = createRule({
  name: RULE_NAME,
  meta: {
    docs: {
      description: 'Ensure user does not use token fn in places they could just use the raw design token',
    },
    messages: {
      noUnsafeTokenFnUsage: 'Unneccessary token function usage. Prefer design token',
    },
    type: 'suggestion',
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const h = new PandaHelpers(context)

    const isUnsafeLiteral = (node: TSESTree.Literal) => {
      return node.value && !isCompositeValue(node.value?.toString())
    }

    const isUnsafeCallExpression = (node: TSESTree.Node) => {
      return node.type === 'CallExpression' && node.callee.type === 'Identifier' && node.callee.name === 'token'
    }

    const isCompositeValue = (input: string) => {
      // Regular expression to match token only values. i.e. token('space.2') or {space.2}
      const tokenRegex = /^(?:token\([^)]*\)|\{[^}]*\})$/
      return !tokenRegex.test(input)
    }

    return {
      JSXAttribute(node) {
        if (!h.isPandaProp(node) || !node.value) return

        if (node.value.type === 'Literal' && isUnsafeLiteral(node.value)) {
          context.report({
            node: node.value,
            messageId: 'noUnsafeTokenFnUsage',
          })
        }

        if (node.value.type !== 'JSXExpressionContainer') return

        if (node.value.expression.type === 'Literal' && isUnsafeLiteral(node.value.expression)) {
          context.report({
            node: node.value.expression,
            messageId: 'noUnsafeTokenFnUsage',
          })
        }

        if (node.value.expression.type === 'CallExpression' && isUnsafeCallExpression(node.value.expression)) {
          context.report({
            node: node.value.expression,
            messageId: 'noUnsafeTokenFnUsage',
          })
        }
      },

      Property(node) {
        if (node.key.type !== 'Identifier') return
        if (!h.isPandaAttribute(node)) return

        if (isUnsafeCallExpression(node.value)) {
          context.report({
            node: node.value,
            messageId: 'noUnsafeTokenFnUsage',
          })
        }

        if (node.value.type !== 'Literal') return
        if (isUnsafeLiteral(node.value)) {
          context.report({
            node: node.value,
            messageId: 'noUnsafeTokenFnUsage',
          })
        }
      },
    }
  },
})

export default rule
