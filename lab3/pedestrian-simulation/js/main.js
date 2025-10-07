// js/main.js

/**
 * @description Main entry point for the simulation.
 * Sets up event listeners, animation loop, and controls.
 */

// Get elements
const canvas = document.getElementById("canvas");
const statsEl = document.getElementById("stats");
const sim = new Simulation(canvas);

// Control elements
const numAgentsInput = document.getElementById("numAgents");
const numAgentsValue = document.getElementById("numAgentsValue");
const separationWeightInput = document.getElementById("separationWeight");
const separationWeightValue = document.getElementById("separationWeightValue");
const alignmentWeightInput = document.getElementById("alignmentWeight");
const alignmentWeightValue = document.getElementById("alignmentWeightValue");
const cohesionWeightInput = document.getElementById("cohesionWeight");
const cohesionWeightValue = document.getElementById("cohesionWeightValue");
const goalWeightInput = document.getElementById("goalWeight");
const goalWeightValue = document.getElementById("goalWeightValue");
const perceptionRadiusInput = document.getElementById("perceptionRadius");
const perceptionRadiusValue = document.getElementById("perceptionRadiusValue");
const resetButton = document.getElementById("resetButton");

// Update value displays
numAgentsInput.addEventListener(
  "input",
  () => (numAgentsValue.textContent = numAgentsInput.value)
);
separationWeightInput.addEventListener(
  "input",
  () => (separationWeightValue.textContent = separationWeightInput.value)
);
alignmentWeightInput.addEventListener(
  "input",
  () => (alignmentWeightValue.textContent = alignmentWeightInput.value)
);
cohesionWeightInput.addEventListener(
  "input",
  () => (cohesionWeightValue.textContent = cohesionWeightInput.value)
);
goalWeightInput.addEventListener(
  "input",
  () => (goalWeightValue.textContent = goalWeightInput.value)
);
perceptionRadiusInput.addEventListener(
  "input",
  () => (perceptionRadiusValue.textContent = perceptionRadiusInput.value)
);

// Reset button
resetButton.addEventListener("click", () => {
  const newParams = {
    numAgents: parseInt(numAgentsInput.value),
    separationWeight: parseFloat(separationWeightInput.value),
    alignmentWeight: parseFloat(alignmentWeightInput.value),
    cohesionWeight: parseFloat(cohesionWeightInput.value),
    goalWeight: parseFloat(goalWeightInput.value),
    perceptionRadius: parseInt(perceptionRadiusInput.value),
  };
  sim.reset(newParams);
});

// Animation loop
function animate() {
  sim.update();
  sim.draw();
  sim.updateStats(statsEl);
  requestAnimationFrame(animate);
}

animate();
