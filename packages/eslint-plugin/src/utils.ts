import { ESLintUtils } from '@typescript-eslint/utils'

// TODO Document rules
export const createRule = ESLintUtils.RuleCreator((name) => `https://example.com/rule/${name}`)

export type Rule = ReturnType<typeof createRule>
