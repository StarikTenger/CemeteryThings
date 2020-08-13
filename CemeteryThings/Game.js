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
        this.player = new Object();
        this.player.pos = new Vec2(10, 10);
        this.player.grid_pos = new Vec2(0, 0);

        // Monster array
        this.monsterTimer = 0;
        this.monsters = [];
    }
}

// Checks is the cell is in bounds
Game.prototype.checkCell = function(pos) {
    if(pos.x < 0 || pos.y < 0 || pos.x >= SIZE_X || pos.y >= SIZE_Y)
        return 1;
    return 0;
}

// In which cell is pos
Game.prototype.getCell = function(pos) {
    var cellPos = div(pos, new Vec2(8, 8));
    cellPos.x = Math.floor(cellPos.x);
    cellPos.y = Math.floor(cellPos.y);
    return cellPos;
}

// Gets visible light value for current cell
Game.prototype.getLight = function(pos) {
    var val = 0;
    if (!this.checkCell(pos))
        val = Math.max(this.grid[pos.x][pos.y].light + DIST_LIGHT - DIST_LOAD, 0);
    return val;
}

// Generates the map
Game.prototype.generate = function() {

    // Initial graves (in each cell with some chance)
    for (var x = 0; x < SIZE_X; x++) {
        for (var y = 0; y < SIZE_Y; y++) {
            if(this.grid[x][y].light > 0) // Forbidden zone
                continue;
            if (!random(0, 10)) { // Obstacle
                this.grid[x][y].type = Math.abs(normalDistribution(-7, 7, 2));
                this.grid[x][y].obstacle = 1;
            }
            else { // No obstacle
                this.grid[x][y].type =  Math.abs(normalDistribution(-1, 1, 3));
                this.grid[x][y].obstacle = 0;
            }
        }
    }

    // Neighbor graves (finds random point, sets grave if this cell has neighbor)
    var neighbors = [
        new Vec2(1, 0),
        new Vec2(-1, 0),
        new Vec2(0, 1),
        new Vec2(0, -1)
    ];
    var neighborsDiagonal = [
        new Vec2(1, 1),
        new Vec2(-1, 1),
        new Vec2(1, -1),
        new Vec2(-1, -1)
    ];
    for (var i = 0; i < (SIZE_X * SIZE_Y); i++) {
        // Generate random point
        var pos = new Vec2(random(0, SIZE_X - 1), random(0, SIZE_Y - 1));
        // Number of neighbors
        var neighborsCount = 0;
        var neighborsDiagonalCount = 0; 

        if(this.grid[pos.x][pos.y].light > 0) // Forbidden zone
            continue;

        // Check for neighbors
        // Close neighbors
        for (var j = 0; j < 4; j++) {
            var pos1 = plus(pos, neighbors[j]); // In this cell we check neighbor
            if(this.checkCell(pos1)) // Cell out of borders
                continue;
            if(this.grid[pos1.x][pos1.y].obstacle) // Neighbor found
                neighborsCount++;
        }
        // Diagonal neighbors
        for (var j = 0; j < 4; j++) {
            var pos1 = plus(pos, neighborsDiagonal[j]); // In this cell we check neighbor
            if(this.checkCell(pos1)) // Cell out of borders
                continue;
            if(this.grid[pos1.x][pos1.y].obstacle) // Neighbor found
                neighborsDiagonalCount++;
        }

        // If cell has neighbors we generate a grave
        if (neighborsCount == 1 && neighborsDiagonalCount <= 1) {
            this.grid[pos.x][pos.y].type = Math.abs(normalDistribution(-7, 7, 4));
            this.grid[pos.x][pos.y].obstacle = 1;
        }
    }

    //// Monsters ////
    this.monsterTimer -= DT; // dt
    // Killing lost monsters (out of stable zone)
    for (var i = 0; i < this.monsters.length; i++) {
        var monster = this.monsters[i];
        if (this.checkCell(monster.grid_pos) || this.grid[monster.grid_pos.x][monster.grid_pos.y].light <= 0){
            this.monsters.splice(i, 1);
        }
    }

    // Spawning new monsters
    for (var i = 0; i < 10; i++) { // We try to spwawn monster for 10 times
        // Generate random point
        var pos = new Vec2(random(0, SIZE_X - 1), random(0, SIZE_Y - 1));

        // Checking for limitations
        if(this.monsters.length >= MONSTER_LIMIT) // Too much monsters
            break;
        if(this.monsterTimer > 0) // We can't spawn monsters to often
            break;
        if(this.grid[pos.x][pos.y].obstacle) // Cell is not empty
            continue;
        if(this.grid[pos.x][pos.y].light <= 0) // No light (zone is unstable)
            continue;
        if(this.grid[pos.x][pos.y].light > DIST_LIGHT - 1) // Visible zone
            continue;

        // Making a monster
        var monster = new Object();
        monster.pos = plus(mult(pos, new Vec2(8, 8)), new Vec2(4, 4));
        monster.type = 0;

        // Adding monster to array
        this.monsters.push(monster);

        // Timer
        this.monsterTimer = MONSTER_PERIOD;
    }
};

// Moves object (collision)
Game.prototype.move = function(object, shift) {
    var deltaPos = shift;
    var newPosX = plus(object.pos, new Vec2(0, 0)); newPosX.x += deltaPos.x;
    var newPosY = plus(object.pos, new Vec2(0, 0)); newPosY.y += deltaPos.y;
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
    object.pos = plus(object.pos, deltaPos);

    // Grid pos
    object.grid_pos = this.getCell(this.player.pos);
}

// Player's movement & actions
Game.prototype.playerControl = function() {
    // Player movement
    var deltaPos = new Vec2(0, 0); // Shift for this step
    // Check keys
    // Player has only 2 directions (left & right)
    if(KEY_D) { // Right
        deltaPos.x += 1;
        this.player.dir = RIGHT;
    }
    if(KEY_S) // Down
        deltaPos.y += 1;
    if(KEY_A) { // Left
        deltaPos.x -= 1;
        this.player.dir = LEFT;
    }
    if(KEY_W) // Right
        deltaPos.y -= 1;

    // Movement
    this.move(this.player, deltaPos);

}

// Monster management
Game.prototype.monstersControl = function() {
    for (var i = 0; i < this.monsters.length; i++) {
        // Get current monster
        var monster = this.monsters[i];
        monster.grid_pos = this.getCell(monster.pos);

        // Movement
        var deltaPos = new Vec2(0, 0);
        // Check neighbor cells to find
        var neighbors = [
            new Vec2(1, 0),
            new Vec2(-1, 0),
            new Vec2(0, 1),
            new Vec2(0, -1)
        ];
        for(var j = 0; j < 4; j ++) {
            var pos1 = plus(monster.grid_pos, neighbors[j]);
            if (this.checkCell(pos1) || this.grid[pos1.x][pos1.y].obstacle)
                continue;
            if(this.grid[pos1.x][pos1.y].light > this.grid[monster.grid_pos.x][monster.grid_pos.y].light)
                deltaPos = plus(deltaPos, neighbors[j]); 
        }

        if(!random(0, 1))
            this.move(monster, mult(deltaPos, new Vec2(1, 1)));

        // Horror
        if (this.grid[monster.grid_pos.x][monster.grid_pos.y].light > DIST_LIGHT - 1) {
            this.player.mind -= monster.horror * DT;
        }
    }
    
}

// Generate light around player (& other objects)
Game.prototype.setLight = function() {
    // Turning off light
    for (var x = 0; x < SIZE_X; x++) {
        for (var y = 0; y < SIZE_Y; y++) {
            this.grid[x][y].light = 0;
        }
    }

    // Light around person
    var cellPos = this.getCell(this.player.pos);

    // BFS deque
    var deque = new Deque();
   
    // Adding initial cells
    for (var x = cellPos.x - 1; x <= cellPos.x + 1; x++) {
        for (var y = cellPos.y - 1; y <= cellPos.y + 1; y++) {
            var d = dist(this.player.pos, new Vec2(x * 8 + 4, y * 8 + 4));
            if (this.checkCell(new Vec2(x, y)) || dist > 8)
                continue;
            this.grid[x][y].light = DIST_LOAD + 1 - d / 8;
            deque.addBack(new Vec2(x, y));
        }
    }

    // BFS itself
    var neighbors = [
        new Vec2(1, 0),
        new Vec2(-1, 0),
        new Vec2(0, 1),
        new Vec2(0, -1)
    ];
    while (deque.peekFront()) {
        var pos = plus(deque.peekFront(), new Vec2(0, 0));
        deque.removeFront();
        if(this.grid[pos.x][pos.y].light < 0)
            this.grid[pos.x][pos.y].light = 0;
        if (this.grid[pos.x][pos.y].light <= 0)
            continue;

        var deltaLight = 1;
        if (this.grid[pos.x][pos.y].obstacle)
            deltaLight = 3;
        for (var i = 0; i < 4; i++) {
            var pos1 = plus(pos, neighbors[i]);
            if(this.checkCell(pos1) || this.grid[pos1.x][pos1.y].light > this.grid[pos.x][pos.y].light - deltaLight)
                continue;
            this.grid[pos1.x][pos1.y].light = this.grid[pos.x][pos.y].light - deltaLight;
            deque.addBack(pos1);
        }
    }
}

// Function called in each iteration
Game.prototype.step = function() {
    this.generate();
    this.playerControl();
    this.monstersControl();
    this.setLight();
};