// js/Environment.js

/**
 * @class Environment
 * @description Represents the 2D environment with walls, exit, and boundaries.
 * Uses simple rectangles for walls and exit.
 */
class Environment {
  /**
   * @constructor
   * @param {number} width - Canvas width.
   * @param {number} height - Canvas height.
   */
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.walls = []; // Array of wall rectangles: {x, y, w, h}
    this.exit = { x: width - 50, y: height / 2 - 25, w: 50, h: 50 }; // Green exit rectangle
    this.restrictedZones = []; // Similar to walls, but could be no-entry areas
    this.setupEnvironment();
  }

  /**
   * Sets up the environment with corridors and walls.
   */
  setupEnvironment() {
    // Example: Horizontal corridor with walls on top and bottom
    // Top wall
    this.walls.push({ x: 0, y: 0, w: this.width, h: 20 });
    // Bottom wall
    this.walls.push({ x: 0, y: this.height - 20, w: this.width, h: 20 });
    // Left wall
    this.walls.push({ x: 0, y: 0, w: 20, h: this.height });
    // Narrow corridor in the middle
    this.walls.push({ x: 300, y: 100, w: 20, h: 200 }); // Vertical wall creating bottleneck
    this.walls.push({ x: 300, y: 400, w: 20, h: 200 }); // Another for corridor
    // Restricted zone example (e.g., no-entry area)
    this.restrictedZones.push({ x: 100, y: 100, w: 100, h: 100 });
  }

  /**
   * Checks if a position is valid (not inside walls or restricted zones).
   * @param {Vector} pos - Position to check.
   * @returns {boolean} True if valid.
   */
  isPositionValid(pos) {
    const agentRadius = 5; // Buffer
    const agentRect = {
      x: pos.x - agentRadius,
      y: pos.y - agentRadius,
      w: agentRadius * 2,
      h: agentRadius * 2,
    };

    // Check walls
    for (let wall of this.walls) {
      if (this.rectIntersect(agentRect, wall)) {
        return false;
      }
    }

    // Check restricted zones
    for (let zone of this.restrictedZones) {
      if (this.rectIntersect(agentRect, zone)) {
        return false;
      }
    }

    // Check boundaries
    if (pos.x < 0 || pos.x > this.width || pos.y < 0 || pos.y > this.height) {
      return false;
    }

    return true;
  }

  /**
   * Checks if two rectangles intersect.
   * @param {Object} r1 - First rect {x,y,w,h}.
   * @param {Object} r2 - Second rect {x,y,w,h}.
   * @returns {boolean} True if intersect.
   */
  rectIntersect(r1, r2) {
    return !(
      r1.x + r1.w < r2.x ||
      r1.x > r2.x + r2.w ||
      r1.y + r1.h < r2.y ||
      r1.y > r2.y + r2.h
    );
  }

  /**
   * Draws the environment on canvas.
   * @param {CanvasRenderingContext2D} ctx - Canvas context.
   */
  draw(ctx) {
    // Draw walls (gray rectangles)
    ctx.fillStyle = "gray";
    for (let wall of this.walls) {
      ctx.fillRect(wall.x, wall.y, wall.w, wall.h);
    }

    // Draw restricted zones (red hatched or semi-transparent)
    ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
    for (let zone of this.restrictedZones) {
      ctx.fillRect(zone.x, zone.y, zone.w, zone.h);
    }

    // Draw exit (green rectangle)
    ctx.fillStyle = "green";
    ctx.fillRect(this.exit.x, this.exit.y, this.exit.w, this.exit.h);
  }

  /**
   * Checks if position is at exit.
   * @param {Vector} pos - Agent position.
   * @param {number} threshold - Distance threshold.
   * @returns {boolean} True if at exit.
   */
  isAtExit(pos, threshold = 10) {
    const exitCenter = new Vector(
      this.exit.x + this.exit.w / 2,
      this.exit.y + this.exit.h / 2
    );
    return pos.dist(exitCenter) < threshold;
  }
}
