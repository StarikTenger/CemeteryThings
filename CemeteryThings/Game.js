// Main class that controls everything
class Game {
    constructor() {
        // Filling grid
        this.grid = [];
        for (var x = 0; x < SIZE_X; x++) {
                this.grid.push([]);
                for (var y = 0; y < SIZE_Y; y++) {
                    this.grid[x].push(new Cell);
                }
        }

        // Setting player
        this.player = new Player();

        // Monster array
        this.monsters = [];
    }
}

// Generates the map
Game.prototype.generate = function() {
    for (var x = 0; x < SIZE_X; x++) {
        for (var y = 0; y < SIZE_Y; y++) {
            if (!random(0, 2)) 
                this.grid[x][y].obstacle = 1;
        }
    }
};

// Function called in each iteration
Game.prototype.step = function() {

};