// js/Vector.js

/**
 * @class Vector
 * @description Represents a 2D vector with operations for Boids calculations.
 * Provides methods for addition, subtraction, scaling, normalization, etc.
 */
class Vector {
  /**
   * @constructor
   * @param {number} x - The x-component.
   * @param {number} y - The y-component.
   */
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  /**
   * Adds another vector to this one.
   * @param {Vector} v - The vector to add.
   * @returns {Vector} This vector after addition.
   */
  add(v) {
    this.x += v.x;
    this.y += v.y;
    return this;
  }

  /**
   * Subtracts another vector from this one.
   * @param {Vector} v - The vector to subtract.
   * @returns {Vector} This vector after subtraction.
   */
  sub(v) {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  }

  /**
   * Scales this vector by a scalar.
   * @param {number} s - The scalar value.
   * @returns {Vector} This vector after scaling.
   */
  mult(s) {
    this.x *= s;
    this.y *= s;
    return this;
  }

  /**
   * Divides this vector by a scalar.
   * @param {number} s - The scalar value (must not be zero).
   * @returns {Vector} This vector after division.
   */
  div(s) {
    if (s !== 0) {
      this.x /= s;
      this.y /= s;
    }
    return this;
  }

  /**
   * Calculates the magnitude (length) of this vector.
   * @returns {number} The magnitude.
   */
  mag() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  /**
   * Normalizes this vector to unit length.
   * @returns {Vector} This vector after normalization.
   */
  normalize() {
    const m = this.mag();
    if (m !== 0) {
      this.div(m);
    }
    return this;
  }

  /**
   * Limits the magnitude of this vector to a maximum value.
   * @param {number} max - The maximum magnitude.
   * @returns {Vector} This vector after limiting.
   */
  limit(max) {
    const m = this.mag();
    if (m > max) {
      this.normalize().mult(max);
    }
    return this;
  }

  /**
   * Creates a copy of this vector.
   * @returns {Vector} A new Vector instance with the same components.
   */
  copy() {
    return new Vector(this.x, this.y);
  }

  /**
   * Calculates the distance to another vector.
   * @param {Vector} v - The other vector.
   * @returns {number} The Euclidean distance.
   */
  dist(v) {
    const dx = this.x - v.x;
    const dy = this.y - v.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Static method to add two vectors.
   * @param {Vector} a - First vector.
   * @param {Vector} b - Second vector.
   * @returns {Vector} A new vector sum.
   */
  static add(a, b) {
    return new Vector(a.x + b.x, a.y + b.y);
  }

  /**
   * Static method to subtract two vectors.
   * @param {Vector} a - First vector.
   * @param {Vector} b - Second vector.
   * @returns {Vector} A new vector difference.
   */
  static sub(a, b) {
    return new Vector(a.x - b.x, a.y - b.y);
  }
}
