//lab2\minimax-lab\src\models\Node.js
/**
 * Класс, представляющий узел игрового дерева
 */
export class Node {
  /**
   * @param {number} value - значение узла (только для листьев)
   * @param {number} depth - глубина узла в дереве
   */
  constructor(value = null, depth = 0) {
    this.value = value;
    this.children = [];
    this.depth = depth;
  }
}
