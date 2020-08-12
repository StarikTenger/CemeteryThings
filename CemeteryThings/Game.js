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
    // Player movement
    var deltaPos = new Vec2(0, 0); // Shift for this step
    // Check keys
    if(KEY_D)
        deltaPos.x += 1;
    if(KEY_S)
        deltaPos.y += 1;
    if(KEY_A)
        deltaPos.x -= 1;
    if(KEY_W)
        deltaPos.y -= 1;
    // Collision
    var newPosX = plus(this.player.pos, new Vec2(0, 0)); newPosX.x += deltaPos.x;
    var newPosY = plus(this.player.pos, new Vec2(0, 0)); newPosY.y += deltaPos.y;
    var cellPosX = div(newPosX, new Vec2(8, 8)); // Cell
    var cellPosY = div(newPosY, new Vec2(8, 8)); // Cell
    cellPosX.x = Math.floor(cellPosX.x);
    cellPosX.y = Math.floor(cellPosX.y);
    cellPosY.x = Math.floor(cellPosY.x);
    cellPosY.y = Math.floor(cellPosY.y);
    if(cellPosX.x < 0 || cellPosX.y < 0 || cellPosX.x >= SIZE_X || cellPosX.y >= SIZE_Y || this.grid[cellPosX.x][cellPosX.y].obstacle){
        deltaPos.x = 0;
    }
    if(cellPosY.x < 0 || cellPosY.y < 0 || cellPosY.x >= SIZE_X || cellPosY.y >= SIZE_Y || this.grid[cellPosY.x][cellPosY.y].obstacle){
        deltaPos.y = 0;
    }
    this.player.pos = plus(this.player.pos, deltaPos);
};