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
      debugProp: 'Remove the debug prop.',
    },
    type: 'suggestion',
    schema: [],
  },
  defaultOptions: [],
  create: (context) => {
    return {
      // TODO limit only to panda components
      'JSXAttribute > JSXIdentifier[name="debug"]': (node) => {
        context.report({
          node,
          messageId: 'debugProp',
        })
      },
      // TODO Something like this to limit to panda methods
      // 'CallExpression[callee.name=css] > ObjectExpression Property[key.type="Identifier"][key.name="debug"]': (node) => {
      'CallExpression > ObjectExpression Property[key.type="Identifier"][key.name="debug"]': (node) => {
        context.report({
          node,
          messageId: 'debug',
        })
      },
    }
  },
})

export default rule
