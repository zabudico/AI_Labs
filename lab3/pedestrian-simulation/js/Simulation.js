// js/Simulation.js

/**
 * @class Simulation
 * @description Manages the agents, environment, and simulation logic.
 * Handles updates, neighbor searches, visualizations, and stats.
 */
class Simulation {
  /**
   * @constructor
   * @param {HTMLCanvasElement} canvas - The canvas element.
   */
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.env = new Environment(canvas.width, canvas.height);
    this.agents = [];
    this.frame = 0;
    this.maxDensity = 0;
    this.jamCount = 0;
    this.startTime = Date.now(); // For evacuation time
    this.params = {
      numAgents: 50,
      separationWeight: 1.5,
      alignmentWeight: 1.0,
      cohesionWeight: 1.0,
      goalWeight: 1.2,
      perceptionRadius: 50,
    };
    this.grid = null; // For spatial partitioning
    this.gridSize = 50; // Bucket size for optimization
    this.initAgents();
    this.setupGrid();
  }

  /**
   * Initializes agents in a starting area.
   */
  initAgents() {
    this.agents = [];
    const startArea = { x: 50, y: 50, w: 200, h: 500 }; // Starting room
    for (let i = 0; i < this.params.numAgents; i++) {
      let x, y;
      do {
        x = startArea.x + Math.random() * startArea.w;
        y = startArea.y + Math.random() * startArea.h;
      } while (!this.env.isPositionValid(new Vector(x, y)));
      const agent = new Agent(x, y, 2, this.params.perceptionRadius, 20);
      this.agents.push(agent);
    }
  }

  /**
   * Sets up spatial grid for efficient neighbor search.
   */
  setupGrid() {
    this.grid = [];
    const cols = Math.ceil(this.canvas.width / this.gridSize);
    const rows = Math.ceil(this.canvas.height / this.gridSize);
    for (let i = 0; i < cols; i++) {
      this.grid[i] = [];
      for (let j = 0; j < rows; j++) {
        this.grid[i][j] = [];
      }
    }
  }

  /**
   * Updates the spatial grid with current agents.
   */
  updateGrid() {
    // Clear grid
    for (let i = 0; i < this.grid.length; i++) {
      for (let j = 0; j < this.grid[i].length; j++) {
        this.grid[i][j].length = 0;
      }
    }
    // Place agents in buckets
    for (let agent of this.agents) {
      const col = Math.floor(agent.position.x / this.gridSize);
      const row = Math.floor(agent.position.y / this.gridSize);
      if (
        col >= 0 &&
        col < this.grid.length &&
        row >= 0 &&
        row < this.grid[0].length
      ) {
        this.grid[col][row].push(agent);
      }
    }
  }

  /**
   * Finds neighbors for an agent using spatial grid.
   * @param {Agent} agent - The agent.
   * @returns {Agent[]} List of neighbors within perception radius (limited to 10).
   */
  getNeighbors(agent) {
    const neighbors = [];
    const col = Math.floor(agent.position.x / this.gridSize);
    const row = Math.floor(agent.position.y / this.gridSize);
    const range = Math.ceil(agent.perceptionRadius / this.gridSize);

    for (let i = -range; i <= range; i++) {
      for (let j = -range; j <= range; j++) {
        const c = col + i;
        const r = row + j;
        if (
          c >= 0 &&
          c < this.grid.length &&
          r >= 0 &&
          r < this.grid[0].length
        ) {
          for (let other of this.grid[c][r]) {
            if (
              other !== agent &&
              agent.position.dist(other.position) < agent.perceptionRadius
            ) {
              neighbors.push(other);
              if (neighbors.length >= 10) return neighbors; // Limit to top 10
            }
          }
        }
      }
    }
    return neighbors;
  }

  /**
   * Updates all agents' forces and positions.
   */
  update() {
    this.frame++;
    this.updateGrid();
    let totalSpeed = 0;
    let jamThisFrame = 0;

    for (let i = this.agents.length - 1; i >= 0; i--) {
      const agent = this.agents[i];
      const neighbors = this.getNeighbors(agent);

      // Calculate forces
      const separation = agent
        .separation(neighbors)
        .mult(this.params.separationWeight);
      const alignment = agent
        .alignment(neighbors)
        .mult(this.params.alignmentWeight);
      const cohesion = agent
        .cohesion(neighbors)
        .mult(this.params.cohesionWeight);
      const goal = agent
        .seekGoal(
          new Vector(
            this.env.exit.x + this.env.exit.w / 2,
            this.env.exit.y + this.env.exit.h / 2
          )
        )
        .mult(this.params.goalWeight);

      // Wall avoidance force
      const wallAvoid = agent.wallAvoidance(this.env).mult(1.5); // Weight for wall avoidance

      // Apply combined force
      const force = new Vector(0, 0)
        .add(separation)
        .add(alignment)
        .add(cohesion)
        .add(goal)
        .add(wallAvoid);
      agent.applyForce(force);

      // Update position
      agent.update(this.env);

      // Check for exit
      if (this.env.isAtExit(agent.position)) {
        this.agents.splice(i, 1);
      }

      totalSpeed += agent.velocity.mag();

      // Check for jams (speed < 0.5)
      if (agent.velocity.mag() < 0.5) {
        jamThisFrame++;
      }
    }

    // Update stats
    const density = this.calculateMaxDensity();
    this.maxDensity = Math.max(this.maxDensity, density);
    this.jamCount += jamThisFrame > 0 ? 1 : 0; // Count frames with jams

    // Check if all evacuated
    if (this.agents.length === 0) {
      const evacTime = (Date.now() - this.startTime) / 1000; // Seconds
      console.log(
        `Evacuation time: ${this.frame} frames (${evacTime} seconds)`
      );
      console.log(`Max density observed: ${this.maxDensity}`);
      console.log(`Jam count (frames with low speed): ${this.jamCount}`);
    }

    // Average speed for stats
    this.averageSpeed =
      this.agents.length > 0 ? totalSpeed / this.agents.length : 0;
  }

  /**
   * Calculates current max density (agents per unit area in clusters).
   * @returns {number} Max density.
   */
  calculateMaxDensity() {
    let maxD = 0;
    for (let agent of this.agents) {
      const neighbors = this.getNeighbors(agent);
      const localD = neighbors.length / (Math.PI * agent.perceptionRadius ** 2); // Density
      maxD = Math.max(maxD, localD);
    }
    return maxD;
  }

  /**
   * Draws everything on the canvas.
   */
  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.env.draw(this.ctx);

    // Draw agents (blue circles)
    this.ctx.fillStyle = "blue";
    for (let agent of this.agents) {
      this.ctx.beginPath();
      this.ctx.arc(
        agent.position.x,
        agent.position.y,
        agent.radius,
        0,
        2 * Math.PI
      );
      this.ctx.fill();
    }

    // Highlight bottlenecks (red circles where >5 agents in 30px)
    // And crowds (yellow overlays for dense clusters)
    this.highlightClusters();
  }

  /**
   * Highlights dense areas and bottlenecks.
   */
  highlightClusters() {
    for (let agent of this.agents) {
      const neighbors = this.getNeighbors(agent);
      if (neighbors.length > 5) {
        const clusterRadius = 30;
        // Yellow overlay for crowd
        this.ctx.fillStyle = "rgba(255, 255, 0, 0.3)";
        this.ctx.beginPath();
        this.ctx.arc(
          agent.position.x,
          agent.position.y,
          clusterRadius,
          0,
          2 * Math.PI
        );
        this.ctx.fill();

        // Red circle for bottleneck if in narrow area (simple: near walls)
        if (this.isNearWall(agent.position)) {
          this.ctx.strokeStyle = "red";
          this.ctx.lineWidth = 2;
          this.ctx.beginPath();
          this.ctx.arc(
            agent.position.x,
            agent.position.y,
            clusterRadius,
            0,
            2 * Math.PI
          );
          this.ctx.stroke();
        }
      }
    }
  }

  /**
   * Checks if position is near a wall (within 20px).
   * @param {Vector} pos - Position.
   * @returns {boolean} True if near wall.
   */
  isNearWall(pos) {
    for (let wall of this.env.walls) {
      if (
        Math.min(
          Math.abs(pos.x - wall.x),
          Math.abs(pos.x - (wall.x + wall.w))
        ) < 20 ||
        Math.min(
          Math.abs(pos.y - wall.y),
          Math.abs(pos.y - (wall.y + wall.h))
        ) < 20
      ) {
        return true;
      }
    }
    return false;
  }

  /**
   * Resets the simulation with new parameters.
   * @param {Object} newParams - New parameter values.
   */
  reset(newParams) {
    Object.assign(this.params, newParams);
    this.frame = 0;
    this.maxDensity = 0;
    this.jamCount = 0;
    this.startTime = Date.now();
    this.initAgents();
  }

  /**
   * Updates the stats display.
   * @param {HTMLElement} statsEl - The stats DOM element.
   */
  updateStats(statsEl) {
    statsEl.innerHTML = `
            Frame: ${this.frame}<br>
            Agents Left: ${this.agents.length}<br>
            Average Speed: ${this.averageSpeed.toFixed(2)}
        `;
  }
}
