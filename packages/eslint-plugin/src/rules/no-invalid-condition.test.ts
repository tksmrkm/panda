import { RuleTester } from '@typescript-eslint/rule-tester'
import rule, { RULE_NAME } from './no-invalid-condition'

const ruleTester = new RuleTester()

const parserOptions = {
  ecmaFeatures: {
    jsx: true,
  },
}

const imports = `import { css } from './panda/css'
import { styled, Circle } from './panda/jsx'
`

const valids = [
  'const styles = { _hovers: { bg: "red" } }',
  'const styles = css({ _hover: { bg: "red" } })',
  'const styles = css.raw({ _focus: { bg: "red" } })',
  'const randomFunc = f({ _nah: { bg: "red" } })',
  '<NonPandaComponent _hovering={{}} />',
  `<Circle _focus={{}} />`,
]

const invalids = [
  'const styles = css({ _cond: {} })',
  '<div className={css({ _focuses: {} })} />',
  '<Circle _hovered={{}} />',
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
        messageId: 'invalidCondition',
        suggestions: null,
      },
    ],
    parserOptions,
  })),
})
