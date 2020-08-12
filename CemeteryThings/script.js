var game = new Game();
var draw = new Draw(CTX);

game.generate();

function step() {
    game.step();
    draw.draw(game);
}

var interval = setInterval(step, 100);