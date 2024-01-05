import { RuleTester } from '@typescript-eslint/rule-tester'
import rule, { RULE_NAME } from './no-shorthand-prop'

const ruleTester = new RuleTester()

const parserOptions = {
  ecmaFeatures: {
    jsx: true,
  },
}

const imports = `import { css } from './panda/css'
import { Circle } from './panda/jsx'
`

const valids = [
  'const styles = css({ marginLeft: "4" })',
  '<div className={css({ background: "red.100" })} />',
  '<Circle _hover={{ position: "absolute" }} />',
]

const invalids = [
  'const styles = css({ ml: "4" })',
  '<div className={css({ bg: "red.100" })} />',
  '<Circle _hover={{ pos: "absolute" }} />',
]

ruleTester.run(RULE_NAME, rule as any, {
  valid: valids.map((code) => ({
    code: imports + code,
    parserOptions,
  })),
  invalid: invalids.map((code) => ({
    code: imports + code,
    errors: [
      {
        messageId: 'longhand',
        suggestions: null,
      },
    ],
    parserOptions,
  })),
})
