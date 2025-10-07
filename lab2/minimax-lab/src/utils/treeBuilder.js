//lab2\minimax-lab\src\utils\treeBuilder.js
import { Node } from "../models/Node.js";

/**
 * Строит полное бинарное дерево заданной глубины
 * @param {number} depth - глубина дерева
 * @param {number[]} leafValues - массив значений для листьев
 * @param {number} currentDepth - текущая глубина (для рекурсии)
 * @param {number} valueIndex - индекс текущего значения листа (для рекурсии)
 * @returns {Object} объект {root: Node, valueIndex: number}
 */
export function buildTree(depth, leafValues, currentDepth = 0, valueIndex = 0) {
  const node = new Node(null, currentDepth);

  // Если достигли глубины листа, присваиваем значение
  if (currentDepth === depth) {
    node.value = leafValues[valueIndex];
    return { root: node, valueIndex: valueIndex + 1 };
  }

  // Рекурсивно строим потомков
  for (let i = 0; i < 2; i++) {
    const result = buildTree(depth, leafValues, currentDepth + 1, valueIndex);
    node.children.push(result.root);
    valueIndex = result.valueIndex;
  }

  return { root: node, valueIndex };
}
