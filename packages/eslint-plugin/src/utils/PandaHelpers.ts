import type { PandaContext } from '@pandacss/node'
import { createContext } from '@pandacss/fixture'
import { TSESTree, AST_NODE_TYPES } from '@typescript-eslint/utils'
import { type RuleContext } from '@typescript-eslint/utils/ts-eslint'

export class PandaHelpers<T extends RuleContext<any, any>> {
  ctx: PandaContext
  context: T

  constructor(context: T) {
    this.ctx = createContext()
    this.context = context
  }

  isPandaFunction(caller: string) {
    // TODO check imports and ensure that it's only dissalowed within panda styles
    return caller === 'css'
  }

  isValidStyledProp<T extends TSESTree.Node | string>(node: T) {
    if (typeof node === 'string') return
    return node.type === 'JSXIdentifier' && this.ctx.isValidProperty(node.name)
  }

  isPandaProp<T extends TSESTree.Node>(node: T) {
    const jsxAncestor = this.getAncestorOfType(node, AST_NODE_TYPES.JSXOpeningElement)
    if (!jsxAncestor || jsxAncestor.name.type !== AST_NODE_TYPES.JSXIdentifier) return

    const jsxName = jsxAncestor.name.name

    // TODO limit only to panda components i.e. imports and created with styled
    if (jsxName !== 'Circle' && jsxName !== 'PandaComp') return

    return true
  }

  isPandaAttribute<T extends TSESTree.Node>(node: T) {
    const callAncestor = this.getAncestorOfType(node, AST_NODE_TYPES.CallExpression)

    // Object could be in JSX prop value i.e css prop or a pseudo
    if (!callAncestor) {
      const jsxExprAncestor = this.getAncestorOfType(node, AST_NODE_TYPES.JSXExpressionContainer)
      const jsxAttrAncestor = this.getAncestorOfType(node, AST_NODE_TYPES.JSXAttribute)

      if (!jsxExprAncestor || !jsxAttrAncestor) return
      if (!this.isPandaProp(jsxAttrAncestor.name)) return
      if (!this.isValidStyledProp(jsxAttrAncestor.name)) return

      return true
    }

    // css({...})
    if (callAncestor.callee.type === AST_NODE_TYPES.Identifier) {
      return this.isPandaFunction(callAncestor.callee.name)
    }

    // css.raw({...})
    if (
      callAncestor.callee.type === AST_NODE_TYPES.MemberExpression &&
      callAncestor.callee.object.type === AST_NODE_TYPES.Identifier
    ) {
      return this.isPandaFunction(callAncestor.callee.object.name)
    }

    return
  }

  getAncestorOfType<T extends TSESTree.Node, A extends AST_NODE_TYPES, Node = Extract<TSESTree.Node, { type: A }>>(
    node: T,
    type: A,
  ): Node | undefined {
    let current: TSESTree.Node | undefined = node

    while (current) {
      if (current.type === type) return current as Node
      current = current.parent
    }

    return
  }

  hasAncestorOfType<T extends TSESTree.Node, A extends AST_NODE_TYPES>(node: T, type: A) {
    return !!this.getAncestorOfType(node, type)
  }

  resolveLonghand(name: string) {
    const reverseShorthandsMap = new Map()

    for (const [key, values] of this.ctx.utility.getPropShorthandsMap()) {
      for (const value of values) {
        reverseShorthandsMap.set(value, key)
      }
    }

    return reverseShorthandsMap.get(name)
  }
}
