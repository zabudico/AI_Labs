// js/Agent.js

/**
 * @class Agent
 * @description Represents a pedestrian agent in the simulation.
 * Each agent has position, velocity, and applies Boids rules plus goal seeking.
 */
class Agent {
  /**
   * @constructor
   * @param {number} x - Initial x position.
   * @param {number} y - Initial y position.
   * @param {number} maxSpeed - Maximum speed (pixels per frame).
   * @param {number} perceptionRadius - Radius to perceive neighbors.
   * @param {number} desiredSeparation - Minimum distance to neighbors.
   */
  constructor(
    x,
    y,
    maxSpeed = 2,
    perceptionRadius = 50,
    desiredSeparation = 20
  ) {
    this.position = new Vector(x, y);
    this.velocity = new Vector(0, 0); // Initial velocity is zero
    this.maxSpeed = maxSpeed;
    this.perceptionRadius = perceptionRadius;
    this.desiredSeparation = desiredSeparation;
    this.radius = 5; // Visual radius for drawing
    this.wallPerceptionRadius = 30; // Radius to perceive walls for avoidance
  }

  /**
   * Applies a force vector to the velocity.
   * @param {Vector} force - The force to apply.
   */
  applyForce(force) {
    this.velocity.add(force);
  }

  /**
   * Updates position based on velocity, limits speed, and handles boundaries/walls.
   * @param {Environment} env - The environment for collision checks.
   */
  update(env) {
    this.velocity.limit(this.maxSpeed);
    let nextPosition = Vector.add(this.position, this.velocity);

    // Soft correction if next position is invalid (fallback)
    if (!env.isPositionValid(nextPosition)) {
      // Instead of hard bounce, adjust velocity slightly away from wall
      this.velocity.mult(0.8); // Reduce speed a bit
      nextPosition = Vector.add(this.position, this.velocity); // Recalculate
    }

    this.position = nextPosition;
  }

  /**
   * Calculates separation force to avoid close neighbors.
   * @param {Agent[]} neighbors - List of nearby agents.
   * @returns {Vector} Separation steering vector.
   */
  separation(neighbors) {
    let steer = new Vector(0, 0);
    let count = 0;
    for (let neighbor of neighbors) {
      const d = this.position.dist(neighbor.position);
      if (d > 0 && d < this.desiredSeparation) {
        let diff = Vector.sub(this.position, neighbor.position);
        diff.normalize();
        diff.div(d); // Weight by inverse distance
        steer.add(diff);
        count++;
      }
    }
    if (count > 0) {
      steer.div(count);
    }
    if (steer.mag() > 0) {
      steer.normalize().mult(this.maxSpeed).sub(this.velocity);
    }
    return steer;
  }

  /**
   * Calculates alignment force to match neighbors' velocity.
   * @param {Agent[]} neighbors - List of nearby agents.
   * @returns {Vector} Alignment steering vector.
   */
  alignment(neighbors) {
    let sum = new Vector(0, 0);
    let count = 0;
    for (let neighbor of neighbors) {
      sum.add(neighbor.velocity);
      count++;
    }
    if (count > 0) {
      sum.div(count).normalize().mult(this.maxSpeed).sub(this.velocity);
      return sum;
    }
    return new Vector(0, 0);
  }

  /**
   * Calculates cohesion force towards neighbors' center.
   * @param {Agent[]} neighbors - List of nearby agents.
   * @returns {Vector} Cohesion steering vector.
   */
  cohesion(neighbors) {
    let sum = new Vector(0, 0);
    let count = 0;
    for (let neighbor of neighbors) {
      sum.add(neighbor.position);
      count++;
    }
    if (count > 0) {
      sum.div(count);
      let desired = Vector.sub(sum, this.position)
        .normalize()
        .mult(this.maxSpeed)
        .sub(this.velocity);
      return desired;
    }
    return new Vector(0, 0);
  }

  /**
   * Calculates goal-seeking force towards the exit.
   * @param {Vector} goal - The goal position.
   * @returns {Vector} Goal steering vector.
   */
  seekGoal(goal) {
    let desired = Vector.sub(goal, this.position)
      .normalize()
      .mult(this.maxSpeed);
    return desired.sub(this.velocity);
  }

  /**
   * Calculates avoidance force from nearby walls.
   * @param {Environment} env - The environment with walls.
   * @returns {Vector} Wall avoidance steering vector.
   */
  wallAvoidance(env) {
    let steer = new Vector(0, 0);
    let count = 0;

    // Check each wall
    for (let wall of env.walls) {
      // Find closest point on wall to agent
      let closestX = Math.max(
        wall.x,
        Math.min(this.position.x, wall.x + wall.w)
      );
      let closestY = Math.max(
        wall.y,
        Math.min(this.position.y, wall.y + wall.h)
      );
      let closestPoint = new Vector(closestX, closestY);

      const d = this.position.dist(closestPoint);
      if (d > 0 && d < this.wallPerceptionRadius) {
        let diff = Vector.sub(this.position, closestPoint);
        diff.normalize();
        diff.div(d); // Weight by inverse distance, stronger closer
        steer.add(diff);
        count++;
      }
    }

    // Also check restricted zones similarly
    for (let zone of env.restrictedZones) {
      let closestX = Math.max(
        zone.x,
        Math.min(this.position.x, zone.x + zone.w)
      );
      let closestY = Math.max(
        zone.y,
        Math.min(this.position.y, zone.y + zone.h)
      );
      let closestPoint = new Vector(closestX, closestY);

      const d = this.position.dist(closestPoint);
      if (d > 0 && d < this.wallPerceptionRadius) {
        let diff = Vector.sub(this.position, closestPoint);
        diff.normalize();
        diff.div(d);
        steer.add(diff);
        count++;
      }
    }

    if (count > 0) {
      steer.div(count);
    }
    if (steer.mag() > 0) {
      steer.normalize().mult(this.maxSpeed).sub(this.velocity);
    }
    return steer;
  }
}
