
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
    constructor() {
        this.damage = 1;
        // Ammo
        this.ammoMax = 5;
        this.ammo = this.ammoMax;
        // Cooldown
        this.cooldownTime = 1;
        this.timeToCooldown = this.cooldownTime;
    }
}

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

        this.weapon = new Weapon();

        // animation
        this.animationType = 0; // 0 - standing, 1 - walking
        this.animationFrame = 0; // from 0 to skol'ko est'
        this.animationTime = 0.3; // time per 1 animation frame
        this.animationTimer = 0; // timer

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

// Cooldowns, timers, etc
Object.prototype.step = function(dt) {

    // Protection timer
    this.protectionTimer -= dt;
    if (this.protectionTimer < 0) {
        this.protectionTimer = 0;
    }
    
    // animation timer
    this.animationTimer += dt;
    if (this.animationTimer >= this.animationTime) {
        this.animationTimer = 0;
        this.animationFrame++;

        if (this.animationType == 0 && this.animationFrame >= 1) { // Walking frame changing
            this.animationFrame = 0;
        }
        if (this.animationType == 1 && this.animationFrame >= 2) { // Walking frame changing
            this.animationFrame = 0;
        }
    }
}

// Cell on the grid
class Cell {
    constructor() {
        this.ground = 0;
        this.covering = 0;
        this.grave = 0;
        this.gates = 0; // 0 - none, 1 - left part, 2 - right part
        this.obstacle = 0; // 0 - player can pass, 1 - player can't pass
        this.type = 0; // For different texturing
        this.light = 0; // Illumination
    }
}

// Light source
class LightSource {
    constructor(pos, power) {
        if (pos)
            this.pos = plus(pos, new Vec2(0, 0));
        else
        this.pos = new Vec2(0, 0);
        if (power)
            this.power = power;
        else
            this.power = 0;
    }
}

class Animation {
    constructor(frames, pos, box, t) {
        this.frames = frames; // Images
        this.pos = new Vec2(pos.x, pos.y); // Position
        this.box = box; // Size
        this.frameTime = t; // Frame change period
        this.timer = this.frameTime; // Countdown to change frame
        this.currentFrame = 0; // id of current frame
        this.alive = 1; // If 0 - animation must be deleted
    }
};

Animation.prototype.step = function() {
    this.timer -= DT;
    if (this.timer <= 0) {
        this.currentFrame++;
        this.timer = this.frameTime;
        if (this.currentFrame >= this.frames.length)
            this.alive = 0;
    }
}

Animation.prototype.getFrame = function() {
    return this.frames[this.currentFrame];
}