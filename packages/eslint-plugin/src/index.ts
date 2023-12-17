import type { ESLint } from 'eslint'
import { name, version } from '../package.json'
import myFirstRule from './rules/my-first-rule'

const plugin = {
  // https://eslint.org/docs/latest/extend/plugins#meta-data-in-plugins
  // @ts-expect-error
  meta: {
    name,
    version,
  },
  rules: {
    'my-first-rule': myFirstRule,
  },
} satisfies ESLint.Plugin

export default plugin
