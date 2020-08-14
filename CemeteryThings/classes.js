
// Player | monster
class Object {
    constructor(){
        this.pos = new Vec2(0, 0); // Position
        this.gridPos = new Vec2(0, 0); // Position
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

// mind += delta
Object.prototype.change_mind = function(delta) {
    this.mind += delta;

    if (this.mind < 0)
        this.mind = 0;
}

// hp += delta
Object.prototype.change_hp = function(delta) {
    this.hp += delta;

    if (this.hp < 0)
        this.hp = 0;
}

// oil += delta
Object.prototype.change_oil = function(delta) {
    this.oil += delta;

    if (this.oil <= 0) {
        this.oil = 0;
        this.lamp = 0;
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