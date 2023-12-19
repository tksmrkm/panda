import { createRule, type Rule } from '../utils'

export const RULE_NAME = 'my-first-rule'

const rule: Rule = createRule({
  name: RULE_NAME,
  meta: {
    docs: {
      description: 'This rule is run on typescript!',
    },
    messages: {
      variableMessage: 'All variabled should be named "bla"!',
    },
    type: 'suggestion',
    schema: [],
  },
  defaultOptions: [],
  create: (context) => {
    return {
      // esquery way
      'VariableDeclarator[id.type="Identifier"][id.name="bla"]': (node) => {
        context.report({
          node,
          messageId: 'variableMessage',
        })
      },
      // VariableDeclarator: (node) => {
      //   if (node.id.type === 'Identifier' && node.id.name !== 'bla') {
      //     context.report({
      //       node,
      //       messageId: 'variableMessage',
      //     })
      //   }
      // },
    }
  },
})

export default rule
