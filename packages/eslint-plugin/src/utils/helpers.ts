import { TSESTree, AST_NODE_TYPES } from '@typescript-eslint/utils'

export const isPandaAttribute = <T extends TSESTree.Node>(node: T) => {
  const callAncestor = getAncestorOfType(node, AST_NODE_TYPES.CallExpression)

  if (!callAncestor) {
    // Object could be in JSX prop value i.e css prop or a pseudo
    const jsxExprAncestor = getAncestorOfType(node, AST_NODE_TYPES.JSXExpressionContainer)
    const jsxAttrAncestor = getAncestorOfType(node, AST_NODE_TYPES.JSXAttribute)

    if (!jsxExprAncestor || !jsxAttrAncestor) return
    if (!isPandaProp(jsxAttrAncestor)) return
    if (!isInPandaProp(jsxAttrAncestor)) return

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

const isPandaFunction = (caller: string) => {
  // TODO check imports and ensure that it's only dissalowed within panda styles
  return caller === 'css'
}

export const isPandaProp = <T extends TSESTree.Node>(node: T) => {
  const jsxAncestor = getAncestorOfType(node, AST_NODE_TYPES.JSXOpeningElement)
  if (!jsxAncestor || jsxAncestor.name.type !== AST_NODE_TYPES.JSXIdentifier) return

  const jsxName = jsxAncestor.name.name

  // TODO limit only to panda components i.e. imports and created with styled
  if (jsxName !== 'Circle' && jsxName !== 'PandaComp') return

  return true
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

export const isInPandaProp = (node: TSESTree.JSXAttribute) => {
  // TODO check if attribute is in a panda prop and not just a random prop
  return !!node
}
