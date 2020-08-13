var game = new Game();
var draw = new Draw(CTX);

game.generate();

function step() {
    game.step();
    draw.draw(game);

    // Previous keys
    KEY_W_PREV = KEY_W;
    KEY_A_PREV = KEY_A;
    KEY_S_PREV = KEY_S;
    KEY_D_PREV = KEY_D;
    KEY_X_PREV = KEY_X;
}

var interval = setInterval(step, DT * 1000);