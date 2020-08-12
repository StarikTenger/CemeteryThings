
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

    // Filling background
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, 10000, 10000);


    // Grid
    for (var x = 0; x < SIZE_X; x++) {
        for (var y = 0; y < SIZE_Y; y++) {
            if (game.grid[x][y].obstacle){
                this.image(IMGS_GROUND[0], x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
                this.image(IMGS_GRAVE[game.grid[x][y].type], x * CELL_SIZE, (y - 1) * CELL_SIZE, CELL_SIZE, CELL_SIZE * 2);
            } else {
                this.image(IMGS_GROUND[game.grid[x][y].type], x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
            }
        }
    }

    // Player
    if(game.player.dir == RIGHT)
        this.image(IMG_PLAYER, game.player.pos.x - CELL_SIZE / 2, game.player.pos.y - CELL_SIZE, CELL_SIZE, CELL_SIZE, 0);
    else
        this.image(IMG_PLAYER, game.player.pos.x - CELL_SIZE / 2, game.player.pos.y - CELL_SIZE, CELL_SIZE, CELL_SIZE, 1);

    // Light
    for (var x = 0; x < SIZE_X; x++) {
        for (var y = 0; y < SIZE_Y; y++) {
            if (game.grid[x][y].light <= 0){
                this.image(IMG_SHADOW, x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
            } else {
                var alpha = (1 - (game.grid[x][y].light / DIST_LIGHT));
                this.rect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE, "rgba(0,0,0," + alpha + ")");
            }
        }
    }
};