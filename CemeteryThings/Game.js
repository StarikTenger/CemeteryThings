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
        this.player.pos = new Vec2(10, 10);

        // Monster array
        this.monsters = [];
    }
}

// Checks is the cell is in bounds
Game.prototype.checkCell = function(pos) {
    if(pos.x < 0 || pos.y < 0 || pos.x >= SIZE_X || pos.y >= SIZE_Y)
        return 1;
    return 0;
}

// Generates the map
Game.prototype.generate = function() {
    for (var x = 0; x < SIZE_X; x++) {
        for (var y = 0; y < SIZE_Y; y++) {
            if(this.grid[x][y].light > 0)
                continue;
            if (!random(0, 4)) {
                this.grid[x][y].type = Math.abs(normalDistribution(-7, 7, 4));
                this.grid[x][y].obstacle = 1;
            }
            else {
                this.grid[x][y].type =  Math.abs(normalDistribution(-1, 1, 3));
                this.grid[x][y].obstacle = 0;
            }
        }
    }
};

Game.prototype.playerControl = function() {
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
}

Game.prototype.setLight = function() {
    // Turning off light
    for (var x = 0; x < SIZE_X; x++) {
        for (var y = 0; y < SIZE_Y; y++) {
            this.grid[x][y].light = 0;
        }
    }

    // Light around person
    var cellPos = div(this.player.pos, new Vec2(8, 8));
    cellPos.x = Math.floor(cellPos.x);
    cellPos.y = Math.floor(cellPos.y);

    // BFS
    var deque = new Deque();
   
    var neighbors = [
        new Vec2(1, 0),
        new Vec2(-1, 0),
        new Vec2(0, 1),
        new Vec2(0, -1)
    ];

    // Adding initial cells
    for (var x = cellPos.x - 1; x <= cellPos.x + 1; x++) {
        for (var y = cellPos.y - 1; y <= cellPos.y + 1; y++) {
            var d = dist(this.player.pos, new Vec2(x * 8 + 4, y * 8 + 4));
            if (this.checkCell(new Vec2(x, y)) || dist > 8)
                continue;
            this.grid[x][y].light = DIST_LIGHT + 1 - d / 8;
            deque.addBack(new Vec2(x, y));
        }
    }

    // BFS itself
    while (deque.peekFront()) {
        var pos = plus(deque.peekFront(), new Vec2(0, 0));
        deque.removeFront();
        if(this.grid[pos.x][pos.y].light < 0)
            this.grid[pos.x][pos.y].light = 0;
        if (this.grid[pos.x][pos.y].light <= 0)
            continue;

        var deltaLight = 1;
        if (this.grid[pos.x][pos.y].obstacle)
            deltaLight = 2;
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
    this.setLight();
};