
// This class is responsible for drawing
class Draw {
    constructor(ctx) {
       this.ctx = ctx;
    }
}

Draw.prototype.image = function(texture, x, y, w, h) {
    this.ctx.imageSmoothingEnabled = 0;
    this.ctx.drawImage(texture, x * SCALE, y * SCALE, w * SCALE, h * SCALE);
};

Draw.prototype.draw = function(gam, w, he) {
    for (var x = 0; x < SIZE_X; x++) {
        for (var y = 0; y < SIZE_Y; y++) {
            if (game.grid[x][y].obstacle){
                this.image(IMG_GRAVE0, x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
            } else {
                this.image(IMG_GROUND0, x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
            }
        }
    }
};