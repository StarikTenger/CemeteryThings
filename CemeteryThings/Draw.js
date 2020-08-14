
// This class is responsible for drawing
class Draw {
    constructor(ctx) {
       this.ctx = ctx;

       this.cam = new Vec2(0, 0); // Camera position
       this.center = new Vec2(32, 27); // Screen center (здфнукы ы)
    }
}

Draw.prototype.image = function(texture, x, y, w, h, flip) {
    x = Math.round(x);
    y = Math.round(y);
    w = Math.round(w);
    h = Math.round(h);

    if(!flip)
        flip = 0;
        
    this.ctx.save();
    let width = 1;
    if (flip) {
        this.ctx.scale(-1, 1);
        width = -1;
    }
    this.ctx.imageSmoothingEnabled = 0;
    this.ctx.drawImage(texture, width*(x + w * flip - this.cam.x + this.center.x) * SCALE, (y - this.cam.y + this.center.y) * SCALE, w * SCALE, h * SCALE);
    this.ctx.restore();
};

Draw.prototype.rect = function(x, y, w, h, color) {
    x = Math.round(x);
    y = Math.round(y);
    w = Math.round(w);
    h = Math.round(h);

    this.ctx.imageSmoothingEnabled = 0;
    this.ctx.fillStyle = color;
    this.ctx.fillRect((x - this.cam.x + this.center.x) * SCALE, (y - this.cam.y + this.center.y) * SCALE, w * SCALE, h * SCALE);
};

Draw.prototype.draw = function(game) {
    // Focusing camera
    this.cam = game.player.pos;
    this.center = new Vec2(32, 27);

    // Filling background
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, 10000, 10000);

    this.ySorted = [];

    // Grid
    for (let x = 0; x < SIZE_X; x++) {
        for (let y = 0; y < SIZE_Y; y++) {
            if(game.grid[x][y].light <= 0) // We don't see this cell
                continue;
            let cell = game.grid[x][y];

            if (cell.ground) {
                this.ySorted.push([IMGS_GROUND[cell.ground - 1], x * CELL_SIZE, y * CELL_SIZE, TEXTURE_SIZE, TEXTURE_SIZE, 0, -5]);
            }
            if (cell.covering) {
                this.ySorted.push([IMGS_COVERING[cell.covering - 1], x * CELL_SIZE, (y - 1) * CELL_SIZE, TEXTURE_SIZE, TEXTURE_SIZE * 2, 0, -4]);
            }
            if (cell.grave) {
                this.ySorted.push([IMGS_GRAVE[cell.grave - 1], x * CELL_SIZE, (y - 1) * CELL_SIZE, TEXTURE_SIZE, TEXTURE_SIZE * 2, 0, (y + 1) * 8]);
            }
        }
    }

    // Player
    if (game.player.dir == RIGHT)
        this.ySorted.push([IMG_PLAYER, game.player.pos.x - CELL_SIZE / 2, game.player.pos.y - CELL_SIZE, TEXTURE_SIZE, TEXTURE_SIZE, 0, game.player.pos.y]);
    else
        this.ySorted.push([IMG_PLAYER, game.player.pos.x - CELL_SIZE / 2, game.player.pos.y - CELL_SIZE, TEXTURE_SIZE, TEXTURE_SIZE, 1, game.player.pos.y]);

    // Monsters
    for (let i = 0; i < game.monsters.length; i++) {
        let monster = game.monsters[i];
        this.ySorted.push([IMG_MONSTER0, monster.pos.x - CELL_SIZE / 2, monster.pos.y - CELL_SIZE, TEXTURE_SIZE, TEXTURE_SIZE, 0, monster.pos.y]);
    }

    // Sorting objects by Y-pos
    this.ySorted.sort(function(a, b) {
        return a[6] - b[6];
    });

    // Drawing sorted objects
    for (let x = 0; x < this.ySorted.length; x++) {
        let a = this.ySorted[x];
        this.image(a[0], a[1], a[2], a[3], a[4], a[5]);
    }

    // Gradient light
    for (let x1 = this.cam.x - 32; x1 <= this.cam.x + 32; x1++) {
        for (let y1 = this.cam.y - 32; y1 <= this.cam.y + 32; y1++) {
            let val = 0; // Light value
            let sum = 0; // Dist sum
            let pos = new Vec2(x1, y1)
            let cellPos = game.getCell(pos);

            // Neighbor cells
            for (let x = cellPos.x - 1; x <= cellPos.x + 1; x++) {
                for (let y = cellPos.y - 1; y <= cellPos.y + 1; y++) {
                    let d = dist(pos, new Vec2(x * 8 + 4, y * 8 + 4));
                    if (game.checkCell(new Vec2(x, y)) || dist >= 16)
                        continue;
                    val += game.getLight(new Vec2(x, y)) * (18 - d);
                    sum += 18 - d;
                }
            }

            val /= sum;
           
            let alpha = (1 - (val / DIST_LIGHT));
            this.rect(x1, y1, 1, 1, "rgba(0,0,0," + alpha + ")");
        }
    }

    // Interface
    this.cam = new Vec2(0, 0);
    this.center = new Vec2(0, 0);
    this.image(IMG_INTERFACE, 0, 0, 64, 64);

    // Mind
    this.rect(53, 55, game.player.mind * 10 / LIMIT_MIND, 1, "rgb(0,100,200)");
    // Hp 
    this.rect(18, 63, 2, - game.player.hp * 6 / LIMIT_HP, "rgb(194, 29, 40)");
    // Oil 
    this.rect(8, 63, 2, - game.player.oil * 6 / LIMIT_OIL, "rgb(148, 133, 46)");
    // Matches
    for (let i = 0; i < game.player.matches; i++) {
        this.image(IMG_MATCH, 22 + i * 2, 58, 1, 5);
    }
};