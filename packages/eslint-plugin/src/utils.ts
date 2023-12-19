import { ESLintUtils } from '@typescript-eslint/utils'

// TODO Document rules
export const createRule = ESLintUtils.RuleCreator(
  (name) => `https://panda-css.com/docs/references/eslint-plugin#${name}`,
)

export type Rule<A extends readonly unknown[] = any, B extends string = any> = ReturnType<typeof createRule<A, B>>
