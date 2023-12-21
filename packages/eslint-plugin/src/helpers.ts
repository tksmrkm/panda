import { TSESTree, AST_NODE_TYPES } from '@typescript-eslint/utils'

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

  return hasAncestorOfType(node.parent, ancestorType) as false | Node
}

export const hasAncestorOfType = <T extends TSESTree.Node, A extends AST_NODE_TYPES>(node: T, ancestorType: A) => {
  return getAncestorOfType(node, ancestorType) !== false
}
