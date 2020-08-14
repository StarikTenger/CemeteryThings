var game = new Game();
var draw = new Draw(CTX);

game.initialGeneration();
game.generate();
game.spawnPlayer(new Vec2(10 + MARGIN * 8, 10 + MARGIN * 8));

function step() {
    game.step();
    draw.draw(game);

    // Previous keys
    KEY_W_PREV = KEY_W;
    KEY_A_PREV = KEY_A;
    KEY_S_PREV = KEY_S;
    KEY_D_PREV = KEY_D;
    KEY_X_PREV = KEY_X;
    KEY_1_PREV = KEY_1;
    KEY_2_PREV = KEY_2;
}

var interval = setInterval(step, DT * 1000);