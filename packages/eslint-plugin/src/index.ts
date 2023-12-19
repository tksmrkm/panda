import { name, version } from '../package.json'
import myFirstRule, { RULE_NAME as MyFirstRule } from './rules/my-first-rule'
import noDebug, { RULE_NAME as NoDebug } from './rules/no-debug'

export const rules = {
  [MyFirstRule]: myFirstRule,
  [NoDebug]: noDebug,
} as any

const plugin = {
  // https://eslint.org/docs/latest/extend/plugins#meta-data-in-plugins
  meta: {
    name,
    version,
  },
  rules,
}

export default plugin
