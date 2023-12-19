import { RuleTester } from '@typescript-eslint/rule-tester'
import rule, { RULE_NAME } from './no-debug'

const ruleTester = new RuleTester()

const valid = ['const bla = { foo: "bar", bar: 2 }']

const invalid = [
  {
    code: 'const a = {debug:true}',
    errors: [
      {
        messageId: 'debug',
        suggestions: null,
      },
    ],
  },
  {
    code: '<Circle debug={true} />',
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
    errors: [
      {
        messageId: 'debugProp',
        suggestions: null,
      },
    ],
  },
]

ruleTester.run(RULE_NAME, rule as any, {
  valid,
  invalid,
})
