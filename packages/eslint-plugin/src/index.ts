import { name, version } from '../package.json'
import noDebug, { RULE_NAME as NoDebug } from './rules/no-debug'

export const rules = {
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
