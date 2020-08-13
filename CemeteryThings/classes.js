
// Player | monster
class Object {
    constructor(){
        this.pos = new Vec2(0, 0); // Position
        this.grid_pos = new Vec2(0, 0); // Position
        this.dir = 0; // Direction

        this.hp = 3;
        this.oil = 10;
        this.mind = 10;
        this.matches = 1;

        // For monster
        this.type = 0;
        this.horror = 0; // -mind per second
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