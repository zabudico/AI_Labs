//lab2\minimax-lab\src\algorithms\minimax.js
import { Node } from "../models/Node.js";

/**
 * Обычный алгоритм Мини-макс
 * @param {Node} node - текущий узел
 * @param {number} depth - глубина поиска
 * @param {boolean} isMaximizingPlayer - true если MAX игрок, false если MIN
 * @param {Object} metrics - объект для сбора метрик
 * @returns {number} оптимальное значение для текущего узла
 */
export function minimax(node, depth, isMaximizingPlayer, metrics) {
  // Базовый случай - достигли листа или максимальной глубины
  if (node.children.length === 0) {
    metrics.nodesEvaluated++;
    return node.value;
  }

  if (isMaximizingPlayer) {
    let maxEval = -Infinity;
    for (const child of node.children) {
      const evaluation = minimax(child, depth - 1, false, metrics);
      maxEval = Math.max(maxEval, evaluation);
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const child of node.children) {
      const evaluation = minimax(child, depth - 1, true, metrics);
      minEval = Math.min(minEval, evaluation);
    }
    return minEval;
  }
}
