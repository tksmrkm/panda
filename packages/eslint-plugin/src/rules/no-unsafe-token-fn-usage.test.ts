import { RuleTester } from '@typescript-eslint/rule-tester'
import rule, { RULE_NAME } from './no-unsafe-token-fn-usage'

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
  `const styles = css({ bg: 'token("colors.red.300") 50%' })`,
  '<div className={css({ border: "solid {borderWidths.1} blue" })} />',
]

const invalids = [
  'const styles = css({ bg: token("colors.red.300") })',
  `const styles = css({ bg: 'token("colors.red.300")' })`,
  '<div className={css({ border: "{borders.1}" })} />',
  '<Circle _hover={{ color: "{colors.blue.300}" }} />',
  '<Circle bg={token("colors.red.300")} />',
  `<Circle bg={'token("colors.red.300")'} />`,
  `<Circle bg='token("colors.red.300")' />`,
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
        messageId: 'noUnsafeTokenFnUsage',
        suggestions: null,
      },
    ],
    parserOptions,
  })),
})
