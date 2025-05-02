// SpatialHashGrid.js
export class SpatialHashGrid {
    constructor(width, height, cellSize) {
      this.cellSize = cellSize;
      this.width = Math.ceil(width / cellSize);
      this.height = Math.ceil(height / cellSize);
      this.grid = new Array(this.width * this.height).fill().map(() => new Set());
      this.objectCells = new Map();
    }
  
    hash(x, z) {
      const cx = Math.floor(x / this.cellSize);
      const cz = Math.floor(z / this.cellSize);
      return cx + cz * this.width;
    }
  
    addObject(id, x, z) {
      const cell = this.hash(x, z);
      this.grid[cell].add(id);
      this.objectCells.set(id, cell);
    }
  
    removeObject(id) {
      const cell = this.objectCells.get(id);
      if (cell !== undefined) {
        this.grid[cell].delete(id);
        this.objectCells.delete(id);
      }
    }
  
    updateObject(id, x, z) {
      this.removeObject(id);
      this.addObject(id, x, z);
    }
  
    findNearby(x, z, radius) {
      const nearby = new Set();
      const cellRadius = Math.ceil(radius / this.cellSize);
      const cx = Math.floor(x / this.cellSize);
      const cz = Math.floor(z / this.cellSize);
  
      for (let dz = -cellRadius; dz <= cellRadius; dz++) {
        for (let dx = -cellRadius; dx <= cellRadius; dx++) {
          const cell = this.hash((cx + dx) * this.cellSize, (cz + dz) * this.cellSize);
          if (cell >= 0 && cell < this.grid.length) {
            for (const id of this.grid[cell]) {
              nearby.add(id);
            }
          }
        }
      }
  
      return Array.from(nearby);
    }
  }
  