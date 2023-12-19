import type { ESLint } from 'eslint'
import { name, version } from '../package.json'
import myFirstRule from './rules/my-first-rule'

export const rules = {
  'my-first-rule': myFirstRule,
}

const plugin = {
  // https://eslint.org/docs/latest/extend/plugins#meta-data-in-plugins
  // @ts-expect-error
  meta: {
    name,
    version,
  },
  rules,
} satisfies ESLint.Plugin

export default plugin
