//lab2\minimax-lab\src\algorithms\minimaxAlphaBeta.js
import { Node } from "../models/Node.js";

/**
 * Алгоритм Мини-макс с альфа-бета отсечением
 * @param {Node} node - текущий узел
 * @param {number} depth - глубина поиска
 * @param {number} alpha - лучший значение для MAX игрока
 * @param {number} beta - лучший значение для MIN игрока
 * @param {boolean} isMaximizingPlayer - true если MAX игрок, false если MIN
 * @param {Object} metrics - объект для сбора метрик
 * @returns {number} оптимальное значение для текущего узла
 */
export function minimaxAlphaBeta(
  node,
  depth,
  alpha,
  beta,
  isMaximizingPlayer,
  metrics
) {
  // Базовый случай - достигли листа или максимальной глубины
  if (node.children.length === 0) {
    metrics.nodesEvaluated++;
    return node.value;
  }

  if (isMaximizingPlayer) {
    let maxEval = -Infinity;
    for (const child of node.children) {
      const evaluation = minimaxAlphaBeta(
        child,
        depth - 1,
        alpha,
        beta,
        false,
        metrics
      );
      maxEval = Math.max(maxEval, evaluation);
      alpha = Math.max(alpha, evaluation);

      // Альфа-бета отсечение
      if (beta <= alpha) {
        break;
      }
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const child of node.children) {
      const evaluation = minimaxAlphaBeta(
        child,
        depth - 1,
        alpha,
        beta,
        true,
        metrics
      );
      minEval = Math.min(minEval, evaluation);
      beta = Math.min(beta, evaluation);

      // Альфа-бета отсечение
      if (beta <= alpha) {
        break;
      }
    }
    return minEval;
  }
}
