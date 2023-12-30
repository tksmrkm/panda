import { TSESTree, AST_NODE_TYPES } from '@typescript-eslint/utils'

export const isPandaAttribute = <T extends TSESTree.Node>(node: T) => {
  // TODO Object could be in JSX prop value i.e css or pseudo
  //
  // TODO Something like this to limit to panda methods
  // node.parent.parent.callee.type === 'Identifier' && node.parent.parent.callee.name === 'css'
  if (!hasAncestorOfType(node, AST_NODE_TYPES.CallExpression)) return

  return true
}

export const isPandaProp = <T extends TSESTree.Node>(node: T) => {
  // TODO limit only to panda components
  return !!node
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
