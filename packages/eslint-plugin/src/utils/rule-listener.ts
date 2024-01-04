import { TSESTree } from '@typescript-eslint/utils'
import type { RuleListener } from '@typescript-eslint/utils/ts-eslint'
import { isPandaAttribute, isPandaProp } from 'packages/eslint-plugin/src/utils/helpers'

type AttributeNode = TSESTree.Property & { key: TSESTree.Identifier }
type RuleListenerOpts<Context> = {
  attribute?: (node: AttributeNode, context: Context) => void
  prop?: (node: TSESTree.JSXIdentifier, context: Context) => void
}

export const ruleListener = <Context>(selectors: RuleListenerOpts<Context>) => {
  const { attribute, prop } = selectors
  return (context: Context) => {
    return {
      JSXIdentifier(node) {
        if (!prop) return
        if (isPandaProp(node)) prop(node, context)
      },

      Property(node: AttributeNode) {
        if (!attribute) return
        if (node.key.type === 'Identifier' && isPandaAttribute(node)) {
          attribute(node, context)
        }
      },
    } as RuleListener
  }
}
