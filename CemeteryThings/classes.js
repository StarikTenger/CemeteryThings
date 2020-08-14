
// Player | monster
class Object {
    constructor(){
        this.pos = new Vec2(0, 0); // Position
        this.grid_pos = new Vec2(0, 0); // Position
        this.dir = 0; // Direction

        this.lamp = 1; // 1 - on, 0 - off
        this.distLight = DIST_LIGHT;

        this.hp = LIMIT_HP;
        this.oil = LIMIT_OIL;
        this.mind = LIMIT_MIND;
        this.matches = LIMIT_MATCHES;
        

        // For monster
        this.type = 0;
        this.horror = 0; // -mind per second
    }
}

// Cell on the grid
class Cell {
    constructor() {
        this.ground = 0;
        this.covering = 0;
        this.grave = 0;
        this.obstacle = 0; // 0 - player can pass, 1 - player can't pass
        this.type = 0; // For different texturing
        this.light = 0; // Illumination
    }
}

// Usable subjects
class Subject {
    constructor() {
        this.type = 0; // 
    }
}

// Weapon
class Weapon {

}