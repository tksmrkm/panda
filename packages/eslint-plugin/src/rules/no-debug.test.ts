import { RuleTester } from '@typescript-eslint/rule-tester'
import rule, { RULE_NAME } from './no-debug'

const ruleTester = new RuleTester()

const valid = [
  { code: 'const styles = css({ bg: "red" })' },

  // TODO Ensure that it's only dissalowed within panda styles
  //   { code: 'const obj = { keyA: "red", keyB: 2, debug: true }' },
  //   {
  //     code: '<NonPandaComponent debug={true} />',
  //     parserOptions: {
  //       ecmaFeatures: {
  //         jsx: true,
  //       },
  //     },
  //   },
]

const invalid = [
  {
    code: 'const styles = css({ bg: "red", debug: true })',
    errors: [
      {
        messageId: 'debug',
        suggestions: null,
      },
    ],
  },
  {
    code: `import { Circle } from './panda/jsx'
    <Circle debug={true} />`,
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
