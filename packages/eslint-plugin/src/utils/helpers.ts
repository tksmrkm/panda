import type { PandaContext } from '@pandacss/node'
import { TSESTree, AST_NODE_TYPES } from '@typescript-eslint/utils'

const isPandaFunction = (caller: string) => {
  // TODO check imports and ensure that it's only dissalowed within panda styles
  return caller === 'css'
}

// Ensure a prop is in a panda component and it's a styled prop
export const isValidStyledProp = <T extends TSESTree.Node | string>(node: T, ctx: PandaContext) => {
  if (typeof node === 'string') return
  return node.type === 'JSXIdentifier' && ctx.isValidProperty(node.name)
}

export const isPandaProp = <T extends TSESTree.Node>(node: T) => {
  const jsxAncestor = getAncestorOfType(node, AST_NODE_TYPES.JSXOpeningElement)
  if (!jsxAncestor || jsxAncestor.name.type !== AST_NODE_TYPES.JSXIdentifier) return

  const jsxName = jsxAncestor.name.name

  // TODO limit only to panda components i.e. imports and created with styled
  if (jsxName !== 'Circle' && jsxName !== 'PandaComp') return

  return true
}

export const isPandaAttribute = <T extends TSESTree.Node>(node: T, ctx: PandaContext) => {
  const callAncestor = getAncestorOfType(node, AST_NODE_TYPES.CallExpression)

  // Object could be in JSX prop value i.e css prop or a pseudo
  if (!callAncestor) {
    const jsxExprAncestor = getAncestorOfType(node, AST_NODE_TYPES.JSXExpressionContainer)
    const jsxAttrAncestor = getAncestorOfType(node, AST_NODE_TYPES.JSXAttribute)

    if (!jsxExprAncestor || !jsxAttrAncestor) return
    if (!isPandaProp(jsxAttrAncestor.name)) return
    if (!isValidStyledProp(jsxAttrAncestor.name, ctx)) return

    return true
  }

  // css({...})
  if (callAncestor.callee.type === AST_NODE_TYPES.Identifier) {
    return isPandaFunction(callAncestor.callee.name)
  }

  // css.raw({...})
  if (
    callAncestor.callee.type === AST_NODE_TYPES.MemberExpression &&
    callAncestor.callee.object.type === AST_NODE_TYPES.Identifier
  ) {
    return isPandaFunction(callAncestor.callee.object.name)
  }

  return
}

export const getAncestorOfType = <
  T extends TSESTree.Node,
  A extends AST_NODE_TYPES,
  Node = Extract<TSESTree.Node, { type: A }>,
>(
  node: T,
  ancestorType: A,
): false | Node => {
  if (!node || !node.parent) {
    return false
  }

  if (node.parent.type === ancestorType) {
    return node.parent as Node
  }

  return getAncestorOfType(node.parent, ancestorType) as false | Node
}

export const hasAncestorOfType = <T extends TSESTree.Node, A extends AST_NODE_TYPES>(node: T, ancestorType: A) => {
  return getAncestorOfType(node, ancestorType) !== false
}
