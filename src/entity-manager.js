module.exports = exports = EntityManager;

function EntityManager(width, height, cellSize) {
    this.cellSize = cellSize;
    this.widthInCells = Math.ceil(width / cellSize);
    this.heightInCells = Math.ceil(height / cellSize);
    this.cells = [];
    this.numberOfCells = this.widthInCells * this.heightInCells;
    for (var i = 0; i < this.numberOfCells; i++) {
        this.cells[i] = [];
    }
    this.cells[-1] = [];
}

EntityManager.prototype.update = function(entity) {
  this.cells.forEach(function(cell) {
    cells.forEach(function(entity){
      entity.update(elapsedTime);
      var index = cellIndex(entity);
      if (index != entity._cell) {
        // Remove from old cell
        var subIndex = this.cells[entity._cell].indexOf(entity);
        if(subIndex != -1) this.cells[entity._cell].splice(subIndex, 1);
        // Place in new cell
        this.cells[index].push(entity);
        entity._cell = index;
      }
    });
  });  
}