
// This class is responsible for drawing
class Draw {
    constructor(ctx) {
       this.ctx = ctx;

       this.cam = new Vec2(0, 0); // Camera position
       this.center = new Vec2(32, 27); // Screen center (здфнукы ы)
    }
}

Draw.prototype.image = function(texture, x, y, w, h, flip) {
    if(!flip)
        flip = 0;
        
    this.ctx.save();
    var width = 1;
    if (flip) {
        this.ctx.scale(-1, 1);
        width = -1;
    }
    this.ctx.imageSmoothingEnabled = 0;
    this.ctx.drawImage(texture, width*(x + w * flip - this.cam.x + this.center.x) * SCALE, (y - this.cam.y + this.center.y) * SCALE, w * SCALE, h * SCALE);
    this.ctx.restore();
};

Draw.prototype.rect = function(x, y, w, h, color) {
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
    for (var x = 0; x < SIZE_X; x++) {
        for (var y = 0; y < SIZE_Y; y++) {
            if(game.grid[x][y].light <= 0) // We don't see this cell
                continue;
            if (game.grid[x][y].obstacle) {
                this.ySorted.push([IMGS_GROUND[0], x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE, 0, -1]);
                this.ySorted.push([IMGS_GRAVE[game.grid[x][y].type], x * CELL_SIZE, (y - 1) * CELL_SIZE, CELL_SIZE, CELL_SIZE * 2, 0, y]);
            } else {
                this.ySorted.push([IMGS_GROUND[game.grid[x][y].type], x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE, 0, -1]);
            }
        }
    }

    // Player
    if(game.player.dir == RIGHT)
        this.ySorted.push([IMG_PLAYER, game.player.pos.x - CELL_SIZE / 2, game.player.pos.y - CELL_SIZE, CELL_SIZE, CELL_SIZE, 0, game.player.grid_pos.y]);
    else
        this.ySorted.push([IMG_PLAYER, game.player.pos.x - CELL_SIZE / 2, game.player.pos.y - CELL_SIZE, CELL_SIZE, CELL_SIZE, 1, game.player.grid_pos.y]);


    this.ySorted.sort(function(a, b) {
        return a[6] - b[6];
    });

    for (var x = 0; x < this.ySorted.length; x++) {
        var a = this.ySorted[x];
        this.image(a[0], a[1], a[2], a[3], a[4], a[5]);
    }

    // Gradient light
    for (var x1 = this.cam.x - 32; x1 <= this.cam.x + 32; x1++) {
        for (var y1 = this.cam.y - 32; y1 <= this.cam.y + 32; y1++) {
            var val = 0; // Light value
            var sum = 0; // Dist sum
            var pos = new Vec2(x1, y1)
            var cellPos = game.getCell(pos);

            // Neighbor cells
            for (var x = cellPos.x - 1; x <= cellPos.x + 1; x++) {
                for (var y = cellPos.y - 1; y <= cellPos.y + 1; y++) {
                    var d = dist(pos, new Vec2(x * 8 + 4, y * 8 + 4));
                    if (game.checkCell(new Vec2(x, y)) || dist > 8)
                        continue;
                    val += game.getLight(new Vec2(x, y)) * (17 - d);
                    sum += 17 - d;
                }
            }

            val /= sum;
           
            var alpha = (1 - (val / DIST_LIGHT));
            this.rect(x1, y1, 1, 1, "rgba(0,0,0," + alpha + ")");
        }
    }

    // Interface
    this.cam = new Vec2(0, 0);
    this.center = new Vec2(0, 0);
    this.image(IMG_INTERFACE, 0, 0, 64, 64);
};