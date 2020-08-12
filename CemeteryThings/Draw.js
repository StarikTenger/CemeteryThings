
// This class is responsible for drawing
class Draw {
    constructor(ctx) {
       this.ctx = ctx;

       this.cam = new Vec2(0, 0); // Camera position
       this.center = new Vec2(32, 27); // Screen center
    }
}

Draw.prototype.image = function(texture, x, y, w, h) {
    this.ctx.imageSmoothingEnabled = 0;
    this.ctx.drawImage(texture, (x - this.cam.x + this.center.x) * SCALE, (y - this.cam.y + this.center.y) * SCALE, w * SCALE, h * SCALE);
};

Draw.prototype.draw = function(game) {
    // Focusing camera
    this.cam = game.player.pos;

    // Grid
    for (var x = 0; x < SIZE_X; x++) {
        for (var y = 0; y < SIZE_Y; y++) {
            if (game.grid[x][y].obstacle){
                this.image(IMG_GRAVE0, x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
            } else {
                this.image(IMG_GROUND0, x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
            }
        }
    }

    // Player
    this.image(IMG_PLAYER, game.player.pos.x - CELL_SIZE / 2, game.player.pos.y - CELL_SIZE, CELL_SIZE, CELL_SIZE)
};