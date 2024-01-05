import { name, version } from '../package.json'
import noDebug, { RULE_NAME as NoDebug } from './rules/no-debug'
import noInvalidCondition, { RULE_NAME as NoInvalidCondition } from './rules/no-invalid-condition'
import preferAtomicProperties, { RULE_NAME as PreferAtomicProperties } from './rules/prefer-atomic-properties'

export const rules = {
  [NoDebug]: noDebug,
  [NoInvalidCondition]: noInvalidCondition,
  [PreferAtomicProperties]: preferAtomicProperties,
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
