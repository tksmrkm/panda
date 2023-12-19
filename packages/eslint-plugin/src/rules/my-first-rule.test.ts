import { expect } from 'vitest'

import { RuleTester } from 'eslint'
import rule, { RULE_NAME } from './my-first-rule'

const valids = ['const a = { foo: "bar", bar: 2 }']

const invalid = ['const a = {\nfoo: "bar", bar: 2 }']

const ruleTester: RuleTester = new RuleTester({
  parser: require.resolve('@typescript-eslint/parser'),
})

ruleTester.run(RULE_NAME, rule as any, {
  valid: valids,
  invalid: invalid.map((i) =>
    typeof i === 'string'
      ? {
          code: i,
          errors: null,
          onOutput: (output: string) => {
            expect(output).toMatchSnapshot()
          },
        }
      : {
          ...(i as any),
          errors: null,
          onOutput: (output: string) => {
            expect(output).toMatchSnapshot()
          },
        },
  ),
})
