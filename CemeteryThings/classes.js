
// Playable player
class Player {
    constructor(){
        this.pos = new Vec2(0, 0); // Position
        this.dir = 0; // Direction

        this.hp = 3;
        this.oil = 10;
        this.mind = 10;
        this.matches = 1;
    }
}

// Not playable monster
class Monster {
    constructor() {
        this.pos = Vec2(0, 0); // Position
        this.dir = 0; // Direction

        this.hp = 3;
        this.vel = 0; // velocity
        this.type = 0;
    }
}

// Cell on the grid
class Cell {
    constructor() {
        this.obstacle = 0; // 0 - player can pass, 1 - player can't pass
        this.type = 0; // For different texturing
        this.light = 0; // Illumination
    }
}