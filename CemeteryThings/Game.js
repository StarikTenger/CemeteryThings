// Main class that controls everything

class Game {
    constructor() {
        // Filling grid
        this.grid = [];
        for (let x = 0; x < SIZE_X; x++) {
                this.grid.push([]);
                for (let y = 0; y < SIZE_Y; y++) {
                    this.grid[x].push(new Cell);
                }
        }

        // Setting player
        this.player = new Object();
        this.player.pos = new Vec2(10, 10);
        this.player.gridPos = new Vec2(0, 0);
        
        this.spec_graves_visited = [0, 0, 0];
        this.spec_lights = [];
        this.spec_sprites = [];

        // Monster array
        this.monsterTimer = 0;
        this.monsters = [];

        // Subjects array
        this.subjectTimer = 0;
        this.subjects = [];

        // Light sources array
        this.lightSources = [];

        this.animations = [];
    }
}

// Deals damage & makes sprite animation
Game.prototype.hurt = function(target, value) {
    target.hurt(value);
    this.animations.push(new Animation(ANM_BLOOD, plus(target.pos, new Vec2(0, -8)), 0.1));
}

// Checks is the cell is in bounds
Game.prototype.checkCell = function(pos) {
    if(pos.x < 0 || pos.y < 0 || pos.x >= SIZE_X || pos.y >= SIZE_Y)
        return 1;
    return 0;
}
// Checks is the cell is in bounds and in margin
Game.prototype.checkMargin = function(pos) {
    if(pos.x < MARGIN || pos.y < MARGIN || pos.x >= SIZE_X - MARGIN || pos.y >= SIZE_Y - MARGIN)
        return 1;
    return 0;
}

// In which cell is pos
Game.prototype.getCell = function(pos) {
    let cellPos = div(pos, new Vec2(8, 8));
    cellPos.x = Math.floor(cellPos.x);
    cellPos.y = Math.floor(cellPos.y);
    return cellPos;
}

// Gets visible light value for current cell
Game.prototype.getLight = function(pos) {
    let val = 0;
    if (!this.checkCell(pos))
        val = Math.max(this.grid[pos.x][pos.y].light + DIST_LIGHT - DIST_LOAD, 0);
    return val;
}

// Choose random grave texture
Game.prototype.random_grave_type = function() {
    let graves_cnt = IMGS_GRAVE.length;
    return normalRoll(2, graves_cnt, 5);
}

// Choose random gronud texture
Game.prototype.random_ground_type = function() {
    let grounds_cnt = IMGS_GROUND.length;
    return normalRoll(1, grounds_cnt, 3);
}

// Choose random gronud covering texture
Game.prototype.random_covering_type = function() {
    let covering_cnt = IMGS_COVERING.length;
    return normalRoll(1, covering_cnt, 2);
}

// Choose random monster texture
Game.prototype.random_monster_type = function() {
    let monster_cnt = IMGS_MONSTER.length;
    return normalRoll(1, monster_cnt, 2);
}

Game.prototype.clever_covering_type = function() {
    let roll = random(1, 100);
    let grass_cnt = 5;
    let water_cnt = 2;
    let blood_cnt = 1;
    let sum = 0;
    if (roll < 90) { // Grass
        return normalRoll(sum + 1, grass_cnt, 3);
    } else {
        sum += grass_cnt;
    }

    if (roll < 98) { // Water
        return normalRoll(sum + 1, sum + water_cnt, 3);
    } else {
        sum += water_cnt;
    }

    if (roll < 100) {
        return normalRoll(sum + 1, sum + blood_cnt, 3);
    }
}

Game.prototype.initialGeneration = function() {
    // Initial graves (in each cell with some chance)
    for (let x = MARGIN - 1; x < SIZE_X - (MARGIN - 1); x++) {
        let y = (MARGIN - 1);
        let cell = this.grid[x][y];
        cell.grave = 1;
        cell.obstacle = 1;
    }
    for (let x = (MARGIN - 1); x < SIZE_X - (MARGIN - 1); x++) {
        let y = SIZE_Y - (MARGIN - 1) - 1;
        let cell = this.grid[x][y];
        cell.grave = 1;
        cell.obstacle = 1;
    } 
    for (let y = (MARGIN - 1); y < SIZE_Y - (MARGIN - 1); y++) {
        let x = (MARGIN - 1);
        let cell = this.grid[x][y];
        cell.grave = 1;
        cell.obstacle = 1;
    }
    for (let y = (MARGIN - 1); y < SIZE_Y - (MARGIN - 1); y++) {
        let x = SIZE_X - (MARGIN - 1) - 1;
        let cell = this.grid[x][y];
        cell.grave = 1;
        cell.obstacle = 1;
    }
};


// Generates the map
Game.prototype.generate = function() {
    // Initial graves (in each cell with some chance)
    for (let x = 0; x < SIZE_X; x++) {
        for (let y = 0; y < SIZE_Y; y++) {
            let cell = this.grid[x][y];
            if (cell.light > 0) // Forbidden zone
                continue;
            cell.ground = this.random_ground_type();
            cell.covering = this.clever_covering_type();
            if (cell.grave < 0) {
                this.spec_graves_visited[-cell.grave - 1] = 0;
            }
        }
    }

    for (let x = MARGIN; x < SIZE_X - MARGIN; x++) {
        for (let y = MARGIN; y < SIZE_Y - MARGIN; y++) {
            let cell = this.grid[x][y];
            if (cell.light > 0) // Forbidden zone
                continue;
            if (!random(0, 10)) { // Grave
                var spec_sum = this.spec_graves_visited[0] * this.spec_graves_visited[1] * this.spec_graves_visited[2];
                if (!random(0, 1) && spec_sum == 0) { // Spec grave!
                    cell.grave = -random(1, 3);
                    while (this.spec_graves_visited[-cell.grave - 1] > 0) {
                        cell.grave = -random(1, 3);
                    }
                    this.spec_graves_visited[-cell.grave - 1] = 1; // 1 - generated, 2 - visited
                    cell.obstacle = 1;
                    cell.covering = 0;
                } else {
                    cell.grave = this.random_grave_type();
                    cell.obstacle = 1;
                    cell.covering = 0;
                }
            } else {
                cell.grave = 0;
                cell.obstacle = 0;
            }
        }
    }

    // Neighbor graves (finds random point, sets grave if this cell has neighbor)
    let neighbors = [
        new Vec2(1, 0),
        new Vec2(-1, 0),
        new Vec2(0, 1),
        new Vec2(0, -1)
    ];
    let neighborsDiagonal = [
        new Vec2(1, 1),
        new Vec2(-1, 1),
        new Vec2(1, -1),
        new Vec2(-1, -1)
    ];
    for (let i = 0; i < (SIZE_X * SIZE_Y); i++) {
        // Generate random point
        let pos = new Vec2(random(MARGIN, SIZE_X - 1 - MARGIN), random(MARGIN, SIZE_Y - 1 - MARGIN));

        // Number of neighbors
        let neighborsCount = 0;
        let neighborsDiagonalCount = 0; 

        if(this.grid[pos.x][pos.y].light > 0) // Forbidden zone
            continue;

        // Check for neighbors
        // Close neighbors
        for (let j = 0; j < 4; j++) {
            let pos1 = plus(pos, neighbors[j]); // In this cell we check neighbor
            if(this.checkMargin(pos1)) // Cell out of borders or in margin
                continue;
            if(this.grid[pos1.x][pos1.y].obstacle) // Neighbor found
                neighborsCount++;
        }
        // Diagonal neighbors
        for (let j = 0; j < 4; j++) {
            let pos1 = plus(pos, neighborsDiagonal[j]); // In this cell we check neighbor
            if(this.checkMargin(pos1)) // Cell out of borders or in margin
                continue;
            if(this.grid[pos1.x][pos1.y].obstacle) // Neighbor found
                neighborsDiagonalCount++;
        }

        // If cell has neighbors we generate a grave
        if (neighborsCount == 1 && neighborsDiagonalCount <= 1 && this.grid[pos.x][pos.y].grave >= 0) {
            this.grid[pos.x][pos.y].grave = this.random_grave_type();
            this.grid[pos.x][pos.y].obstacle = 1;
            this.grid[pos.x][pos.y].covering = 0;
        }
    }

    //// Monsters ////
    this.monsterTimer -= DT; // dt
    // Killing lost monsters (out of stable zone)
    for (let i = 0; i < this.monsters.length; i++) {
        let monster = this.monsters[i];
        if (this.checkCell(monster.gridPos) || this.grid[monster.gridPos.x][monster.gridPos.y].light <= 0 || monster.hp <= 0 || dist(monster.pos, this.player.pos) > DIST_LOAD * 8 * 2) {
            this.monsters.splice(i, 1);
        }
    }

    // Spawning new monsters
    for (let i = 0; i < 10; i++) { // We try to spwawn monster for 10 times
        // Generate random point
        let pos = new Vec2(random(0, SIZE_X - 1), random(0, SIZE_Y - 1));

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
        let monster = new Object();
        monster.pos = plus(mult(pos, new Vec2(8, 8)), new Vec2(4, 4));
        monster.monsterType = this.random_monster_type();

        if (monster.monsterType == MNS_TENTACLE)
            monster.horror = 0.5;
        else 
            monster.horror = 0.2;

        // Adding monster to array
        this.monsters.push(monster);

        // Timer
        this.monsterTimer = MONSTER_PERIOD;
    }

    //// Subjects ////
    this.subjectTimer -= DT; // dt
    // Despawn
    for (let i = 0; i < this.subjects.length; i++) {
        let subject = this.subjects[i];
        subject.gridPos = this.getCell(subject.pos);
        if (this.checkCell(subject.gridPos) || this.grid[subject.gridPos.x][subject.gridPos.y].light <= 0 || !subject.type || dist(subject.pos, this.player.pos) > DIST_LOAD * 8 * 2) {
            this.subjects.splice(i, 1);
        }
    }

    // Spawning new subjects
    for (let i = 0; i < 10; i++) { // We try to spawn subject for 10 times
        // Generate random point
        let pos = new Vec2(random(0, SIZE_X - 1), random(0, SIZE_Y - 1));

        // Checking for limitations
        if (this.subjects.length >= SUBJECT_LIMIT) // Too much subjects
            break;
        if (this.subjectTimer > 0) // We can't spawn subjects to often
            break;
        if (this.grid[pos.x][pos.y].obstacle) // Cell is not empty
            continue;
        if (this.grid[pos.x][pos.y].light <= 0) // No light (zone is unstable)
            continue;
        if (this.grid[pos.x][pos.y].light > DIST_LIGHT - 1) // Visible zone
            continue;

        // Making a subject
        let subject = new Subject(plus(mult(pos, new Vec2(8, 8)), new Vec2(4, 4)));
        
        // Choosing type
        subject.type = random(1, 5);
        if(!random(0, 2))
            subject.type = SBJ_OIL;

        // Adding subject to array
        this.subjects.push(subject);

        // Timer
        this.subjectTimer = SUBJECT_PERIOD;
    }
};

// Moves object (collision)
Game.prototype.move = function(object, shift, flight) {
    let deltaPos = shift;
    let newPosX = plus(object.pos, new Vec2(0, 0)); newPosX.x += deltaPos.x;
    let newPosY = plus(object.pos, new Vec2(0, 0)); newPosY.y += deltaPos.y;
    let cellPosX = div(newPosX, new Vec2(8, 8)); // Cell
    let cellPosY = div(newPosY, new Vec2(8, 8)); // Cell
    cellPosX.x = Math.floor(cellPosX.x);
    cellPosX.y = Math.floor(cellPosX.y);
    cellPosY.x = Math.floor(cellPosY.x);
    cellPosY.y = Math.floor(cellPosY.y);
    if(cellPosX.x < 0 || cellPosX.y < 0 || cellPosX.x >= SIZE_X || cellPosX.y >= SIZE_Y || (!flight && this.grid[cellPosX.x][cellPosX.y].obstacle)){
        deltaPos.x = 0;
    }
    if(cellPosY.x < 0 || cellPosY.y < 0 || cellPosY.x >= SIZE_X || cellPosY.y >= SIZE_Y || (!flight && this.grid[cellPosY.x][cellPosY.y].obstacle)){
        deltaPos.y = 0;
    }
    object.pos = plus(object.pos, deltaPos);

    // Grid pos
    object.grid_pos = this.getCell(this.player.pos);

}

// Player's movement & actions
Game.prototype.playerControl = function() {
    // Player movement
    let deltaPos = new Vec2(0, 0); // Shift for this step
    // Check keys
    // Player has only 2 directions (left & right)
    if (KEY_D) { // Right
        deltaPos.x += 1;
        this.player.dir = RIGHT;
    }
    if (KEY_S) // Down
        deltaPos.y += 1;
    if (KEY_A) { // Left
        deltaPos.x -= 1;
        this.player.dir = LEFT;
    }
    if (KEY_W) // Right
        deltaPos.y -= 1;

    // Movement
    this.move(this.player, deltaPos);

    // Animation
    if (deltaPos.x != 0 || deltaPos.y != 0) { // Player is moving now
        if (this.player.animationType == 0) { // Player was not moving
            this.player.animationType = 1;
            this.player.animationFrame = random(0, 1);
            this.player.animationTimer = 0;
        }
    }
    else { // Player is standing now
        if (this.player.animationType == 1) { // Player was moving
            this.player.animationType = 0;
            this.player.animationFrame = 0;
            this.player.animationTimer = 0;
        }
    }

    // Cooldowns
    this.player.step(DT);

    //// Lamp management ////
    // Consumption
    if (this.player.lamp)
        this.player.change_oil(-OIL_CONSUMPTION * DT);

    // Turning on/off
    if (KEY_X && !KEY_X_PREV) {
        if (this.player.lamp)
            this.player.lamp = 0;
        else if (this.player.matches > 0) {
            this.player.lamp = 1;
            this.player.matches --;

            // Lighting spec graves
            let pos = this.player.grid_pos;
            for (x = pos.x - 1; x <= pos.x + 1; ++x) {
                for (y = pos.y - 1; y <= pos.y + 1; ++y) {
                    let cell = this.grid[x][y];
                    console.log(x, y);
                    if (cell.grave < 0) {
                        this.spec_graves_visited[-cell.grave - 1] = 2;
                        this.spec_lights.push(new LightSource(new Vec2(x * 8 + 4, y * 8 + 4), 2));
                    }
                }
            }
        }
    }
        
    if (this.player.lamp)
        this.player.distLight = DIST_LIGHT;
    else
        this.player.distLight = 1;

    // Horror
    if (!this.player.lamp)
        this.player.change_mind(-0.5 * DT);

    //// Active subjects ////
    // Get subjects
    for (let i = 0; i < this.subjects.length; i++) {
        let subject = this.subjects[i];
        if (dist(subject.pos, this.player.pos) > 8) // Not close enough
            continue;
        
        // Checking slots
        for (let j = 0; j < 2; j++) {
            if (this.player.subjects[j] && this.player.subjects[j].type) // There is another subject in the slot
                continue;

            this.player.subjects[j] = new Subject();
            this.player.subjects[j].type = subject.type;

            subject.type = undefined;
        }
    }

    // Use subjects
    let keys = [KEY_1, KEY_2];
    for (let i = 0; i < 2; i++) {
        if (!this.player.subjects[i] || !this.player.subjects[i].type) // Slot is empty
            continue;
        if (!keys[i]) // No command
            continue;
        
        // Current subject
        var subject = this.player.subjects[i];

        // Checking for subject type
        if (subject.type == SBJ_HEAL){
            this.player.change_hp(1);
        }
        if (subject.type == SBJ_OIL){
            this.player.change_oil(7);
        }
        if (subject.type == SBJ_WHISKEY){
            this.player.change_mind(2);
        }
        if (subject.type == SBJ_MATCHBOX){
            if (this.player.matches < LIMIT_MATCHES)
                this.player.matches++;
        }
        if (subject.type == SBJ_AMMO){
            this.player.weapon.ammo += 2;
            this.player.weapon.ammo = Math.min(this.player.weapon.ammo, this.player.weapon.ammoMax);
        }

        // Remove subject
        this.player.subjects[i] = undefined;
    }

    //// Weapon ////
    // Cooldown progress
    this.player.weapon.timeToCooldown -= DT;

    if (KEY_UP || KEY_DOWN || KEY_LEFT || KEY_RIGHT) {
        let dir = new Vec2();

        // Get direction
        if (KEY_UP)
            dir = new Vec2(0, -1);
        if (KEY_DOWN)
            dir = new Vec2(0, 1);
        if (KEY_LEFT)
            dir = new Vec2(-1, 0);
        if (KEY_RIGHT)
            dir = new Vec2(1, 0);
        
        if (this.player.weapon.timeToCooldown <= 0 && this.player.weapon.ammo > 0) { // Are we able to shoot
            // Stupid collision check
            let pos = new Vec2(this.player.pos.x, this.player.pos.y);
            dir = mult(dir, new Vec2(2, 2));
            for (let i = 0; i < 30; i++) {
                let hit = 0;
                for (let j = 0; j < this.monsters.length; j++) {
                    // Current monster
                    let monster = this.monsters[j];
                    // Shift
                    pos = plus(pos, dir);
                    // Collision check
                    if (dist(pos, monster.pos) < 8) {
                        this.hurt(monster, this.player.weapon.damage);                       
                    }
                }
                if (hit)
                    break;
            }

            // Modify cooldown & ammo
            this.player.weapon.timeToCooldown =  this.player.weapon.cooldownTime;
            this.player.weapon.ammo--;
        }
    }
}

// Monster management
Game.prototype.monstersControl = function() {
    for (let i = 0; i < this.monsters.length; i++) {
        // Get current monster
        let monster = this.monsters[i];
        monster.gridPos = this.getCell(monster.pos);

        // Cooldowns
        monster.step(DT);
        if (monster.monsterType == MNS_ZOMBIE) { // ZOMBIE
            // Movement
            let deltaPos = new Vec2(0, 0);
            // Check neighbor cells to find
            let neighbors = [
                new Vec2(1, 0),
                new Vec2(-1, 0),
                new Vec2(0, 1),
                new Vec2(0, -1)
            ];
            for (let j = 0; j < 4; j ++) {
                let pos1 = plus(monster.gridPos, neighbors[j]);
                if (this.checkCell(pos1) || this.grid[pos1.x][pos1.y].obstacle)
                    continue;
                if(this.grid[pos1.x][pos1.y].light > this.grid[monster.gridPos.x][monster.gridPos.y].light)
                    deltaPos = plus(deltaPos, neighbors[j]); 
            }

            if(!random(0, 1)) {
                this.move(monster, mult(deltaPos, new Vec2(1, 1)), 0);
            }
        } 
        else if (monster.monsterType == MNS_GHOST) { // GHOST
            // Movement
            let deltaPos = new Vec2(0, 0);
            // Check neighbor cells to find
            let neighbors = [
                new Vec2(1, 0),
                new Vec2(-1, 0),
                new Vec2(0, 1),
                new Vec2(0, -1)
            ];
            for(let j = 0; j < 4; j++) {
                let pos1 = plus(monster.gridPos, neighbors[j]);
                if (this.checkCell(pos1))
                    continue;
                if(this.grid[pos1.x][pos1.y].light > this.grid[monster.gridPos.x][monster.gridPos.y].light)
                    deltaPos = plus(deltaPos, neighbors[j]); 
            }

            if(!random(0, 2))
                this.move(monster, mult(deltaPos, new Vec2(1, 1)), 1);
        }

        // Horror
        if (this.grid[monster.gridPos.x][monster.gridPos.y].light > DIST_LIGHT - 1) {
            this.player.change_mind(-monster.horror * DT);
        }

        // Damage
        if (dist(monster.pos, this.player.pos) <= monster.attackRange) {
            this.hurt(this.player, monster.damage);    
        }
    }
}

// Generate light around player (& other objects)
Game.prototype.setLight = function() {
    // Add player pos to light source
    this.lightSources.push(new LightSource(this.player.pos, this.player.distLight));

    // Turning off light
    for (let x = 0; x < SIZE_X; x++) {
        for (let y = 0; y < SIZE_Y; y++) {
            this.grid[x][y].light = 0;
        }
    }

    for (let i = 0; i < this.spec_lights.length; i++) {
        this.lightSources.push(this.spec_lights[i]);
    }

    // BFS deque
    let deque = new Deque();
   
    // Adding initial cells
    for (let i = 0; i < this.lightSources.length; i++) {
        // Current light source
        let lightSource = this.lightSources[i];
        let cellPos = this.getCell(lightSource.pos);
        for (let x = cellPos.x - 1; x <= cellPos.x + 1; x++) {
            for (let y = cellPos.y - 1; y <= cellPos.y + 1; y++) {
                let d = dist(lightSource.pos, new Vec2(x * 8 + 4, y * 8 + 4));
                if (this.checkCell(new Vec2(x, y)) || dist > 16)
                    continue;
                this.grid[x][y].light = Math.max (this.grid[x][y].light, lightSource.power - DIST_LIGHT + DIST_LOAD + 1 - d / 8);
                deque.addBack(new Vec2(x, y));
            }
        }
    }

    // Clean lightSources
    this.lightSources = [];
    
    // BFS itself
    let neighbors = [
        new Vec2(1, 0),
        new Vec2(-1, 0),
        new Vec2(0, 1),
        new Vec2(0, -1)
    ];
    while (deque.peekFront()) {
        let pos = plus(deque.peekFront(), new Vec2(0, 0));
        deque.removeFront();
        if(this.grid[pos.x][pos.y].light < 0)
            this.grid[pos.x][pos.y].light = 0;
        if (this.grid[pos.x][pos.y].light <= 0)
            continue;

        let deltaLight = 1;
        if (this.grid[pos.x][pos.y].obstacle)
            deltaLight = 3;
        for (let i = 0; i < 4; i++) {
            let pos1 = plus(pos, neighbors[i]);
            if (this.checkCell(pos1) || this.grid[pos1.x][pos1.y].light > this.grid[pos.x][pos.y].light - deltaLight)
                continue;
            this.grid[pos1.x][pos1.y].light = this.grid[pos.x][pos.y].light - deltaLight;
            deque.addBack(pos1);
        }
    }
}

// Sprite animations
Game.prototype.manageAnimations = function() {
    // Step
    for (let i = 0; i < this.animations.length; i++) {
        this.animations[i].step();
    }
    // Delete
    for (let i = 0; i < this.animations.length; i++) {
        if (!this.animations[i].alive) {
            this.animations.splice(i, 1);
            i--;
        }
    }
};

// Function called in each iteration
Game.prototype.step = function() {
    if (this.player.status == 0) { // If player is alive
        this.playerControl();
        this.monstersControl();
        this.setLight();
        this.generate();
        this.manageAnimations();
    }
};

Game.prototype.spawnPlayer = function(pos) {
    let gridPos = this.getCell(pos);
    
    this.player.pos = pos;
    this.player.gridPos = gridPos;

    // Clearing area
    for (let x = Math.max(0, gridPos.x - 1); x <= Math.min(SIZE_X, gridPos.x + 1); x++) {
        for (let y = Math.max(0, gridPos.y - 1); y <= Math.min(SIZE_Y, gridPos.y + 1); y++) {
            this.grid[x][y].grave = 0;
            this.grid[x][y].obstacle = 0;
        }
    }
}