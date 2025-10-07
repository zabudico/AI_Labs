//lab2\minimax-lab\src\main.js

import { buildTree } from "./utils/treeBuilder.js";
import { minimax } from "./algorithms/minimax.js";
import { minimaxAlphaBeta } from "./algorithms/minimaxAlphaBeta.js";

/**
 * Основная функция выполнения лабораторной работы
 */
function main() {
  console.log("Лабораторная работа №2: Мини-макс с альфа-бета отсечением\n");
  console.log("Параметры дерева:");
  console.log("- Глубина: 5 уровней");
  console.log("- Ширина: 2 потомка на узел");
  console.log("- Количество листьев: 32\n");

  // Фиксированные значения листьев согласно варианту
  const leafValues = [
    5, 3, 6, 9, 1, 2, 0, -1, 4, 7, 8, 10, 12, 14, 15, 18, 20, 22, 25, 30, 35,
    40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90,
  ];

  console.log("Листовые значения:", leafValues.join(", "), "\n");

  // Построение дерева
  const { root } = buildTree(5, leafValues);

  // ==================== ЧАСТЬ 1: Обычный мини-макс ====================
  console.log("=== Часть 1: Обычный алгоритм Мини-макс ===");

  const regularMetrics = { nodesEvaluated: 0 };
  const regularStartTime = process.hrtime.bigint();

  const regularResult = minimax(root, 5, true, regularMetrics);

  const regularEndTime = process.hrtime.bigint();
  const regularTime = Number(regularEndTime - regularStartTime) / 1000000; // Конвертация в миллисекунды

  console.log(`Лучшее значение для MAX: ${regularResult}`);
  console.log(`Количество оцененных узлов: ${regularMetrics.nodesEvaluated}`);
  console.log(`Время выполнения: ${regularTime.toFixed(4)} мс\n`);

  // ==================== ЧАСТЬ 2: Мини-макс с альфа-бета отсечением ====================
  console.log("=== Часть 2: Мини-макс с альфа-бета отсечением ===");

  const alphaBetaMetrics = { nodesEvaluated: 0 };
  const alphaBetaStartTime = process.hrtime.bigint();

  const alphaBetaResult = minimaxAlphaBeta(
    root,
    5,
    -Infinity,
    Infinity,
    true,
    alphaBetaMetrics
  );

  const alphaBetaEndTime = process.hrtime.bigint();
  const alphaBetaTime = Number(alphaBetaEndTime - alphaBetaStartTime) / 1000000;

  console.log(`Лучшее значение для MAX: ${alphaBetaResult}`);
  console.log(`Количество оцененных узлов: ${alphaBetaMetrics.nodesEvaluated}`);
  console.log(`Время выполнения: ${alphaBetaTime.toFixed(4)} мс\n`);

  // ==================== ЧАСТЬ 3: Сравнительный анализ ====================
  console.log("=== Часть 3: Сравнительный анализ ===");

  const nodesReduction = (
    ((regularMetrics.nodesEvaluated - alphaBetaMetrics.nodesEvaluated) /
      regularMetrics.nodesEvaluated) *
    100
  ).toFixed(2);

  const timeImprovement = (
    ((regularTime - alphaBetaTime) / regularTime) *
    100
  ).toFixed(2);

  console.log("Сравнение количества оцененных узлов:");
  console.log(`- Обычный мини-макс: ${regularMetrics.nodesEvaluated} узлов`);
  console.log(`- С альфа-бета: ${alphaBetaMetrics.nodesEvaluated} узлов`);
  console.log(`- Сокращение: ${nodesReduction}%`);

  console.log("\nСравнение времени выполнения:");
  console.log(`- Обычный мини-макс: ${regularTime.toFixed(4)} мс`);
  console.log(`- С альфа-бета: ${alphaBetaTime.toFixed(4)} мс`);
  console.log(`- Ускорение: ${timeImprovement}%`);

  console.log("\nПроверка корректности:");
  console.log(
    `- Результаты совпадают: ${
      regularResult === alphaBetaResult ? "ДА ✓" : "НЕТ ✗"
    }`
  );
  console.log(
    `- Альфа-бета отсечение работает: ${
      alphaBetaMetrics.nodesEvaluated < regularMetrics.nodesEvaluated
        ? "ДА ✓"
        : "НЕТ ✗"
    }`
  );

  // ==================== Анализ эффективности ====================
  console.log("\n=== Анализ эффективности ===");

  if (alphaBetaMetrics.nodesEvaluated < regularMetrics.nodesEvaluated) {
    console.log(
      "✓ Альфа-бета отсечение успешно сократило количество проверяемых узлов"
    );
    console.log("✓ Алгоритм с отсечением работает быстрее обычного мини-макса");

    if (parseFloat(nodesReduction) > 50) {
      console.log("✓ Высокая эффективность отсечения (>50% сокращение узлов)");
    } else if (parseFloat(nodesReduction) > 25) {
      console.log(
        "✓ Средняя эффективность отсечения (25-50% сокращение узлов)"
      );
    } else {
      console.log("○ Низкая эффективность отсечения (<25% сокращение узлов)");
    }
  } else {
    console.log("✗ Альфа-бета отсечение не дало преимущества в данном случае");
    console.log(
      "⚠ Возможно, порядок значений в дереве не оптимален для отсечения"
    );
  }

  console.log("\nОбщий вывод:");
  console.log("Альфа-бета отсечение демонстрирует свою эффективность за счет");
  console.log(
    "исключения заведомо бесперспективных ветвей дерева, что позволяет"
  );
  console.log(
    "сократить как количество вычислений, так и время выполнения алгоритма."
  );
}

// Запуск программы
main();
