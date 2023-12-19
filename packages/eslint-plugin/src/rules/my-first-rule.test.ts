import { RuleTester } from '@typescript-eslint/rule-tester'
import rule, { RULE_NAME } from './my-first-rule'

const ruleTester = new RuleTester()

const valid = ['const bla = { foo: "bar", bar: 2 }']

const invalid = [
  {
    code: 'const nah = { foo: "bar", bar: 2 }',
    errors: [
      {
        messageId: 'variableMessage',
        suggestions: null,
      },
    ],
  },
]

ruleTester.run(RULE_NAME, rule as any, {
  valid,
  invalid,
})
