
// Player | monster
class Object {
    constructor() {
        this.pos = new Vec2(0, 0); // Position
        this.gridPos = new Vec2(0, 0); // Position
        this.dir = 0; // Direction

        this.lamp = 1; // 1 - on, 0 - off
        this.distLight = DIST_LIGHT;

        this.hp = LIMIT_HP;
        this.oil = LIMIT_OIL;
        this.mind = LIMIT_MIND;
        this.matches = LIMIT_MATCHES;

        this.status = 0; // 0 - alive, 1 - dead, 2 - delirious
        
        this.protectionTime = 1; // Invulnerability after taking damage (parameter)
        this.protectionTimer = 0; // Invulnerability after taking damage (Timer)
        this.subjects = [undefined, undefined];

        // For monster
        this.monsterType = 0;
        this.horror = 0; // -mind per second

        this.attackRange = 5;
        this.damage = 1;
    }
}

// mind += delta
Object.prototype.change_mind = function(delta) {
    this.mind += delta;

    if (this.mind < EPS) {
        this.mind = 0;
        this.status = 2; // Delirium
    }
    if (this.mind > LIMIT_MIND) {
        this.mind = LIMIT_MIND;
    }
}

// hp += delta
Object.prototype.change_hp = function(delta) {
    this.hp += delta;

    if (this.hp < EPS) {
        this.hp = 0;
        this.status = 1; // Death
    }
    if (this.hp > LIMIT_HP) {
        this.hp = LIMIT_HP;
    }
}

// hp += delta
Object.prototype.hurt = function(damage) {
    if (this.protectionTimer == 0) { // protection after attacks
        this.change_hp(-damage);
        this.protect();
    }
}

// oil += delta
Object.prototype.change_oil = function(delta) {
    this.oil += delta;

    if (this.oil < 0) {
        this.oil = 0;
        this.lamp = 0;
    }
    if (this.oil > LIMIT_OIL) {
        this.oil = LIMIT_OIL;
    }
}

// Protection after attacks
Object.prototype.protect = function() {
    this.protectionTimer = this.protectionTime;
}

// Cooldowns, etc
Object.prototype.step = function(dt) {
    this.protectionTimer -= dt;
    if (this.protectionTimer < 0) {
        this.protectionTimer = 0;
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
    constructor(pos) {
        this.type = 0; // See types in parameters.js
        if(pos)
            this.pos = pos;
        else
            this.pos = new Vec2(0, 0);
    }
}

// Weapon
class Weapon {

}