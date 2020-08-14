'use strict'

//// CONSTANTS ////
// Directions
let RIGHT = 0;
let DOWN = 1;
let LEFT = 2;
let UP = 3;

// Subjects' names
let SBJ_HEAL = 0;
let SBJ_OIL = 1;
let SBJ_WHISKEY = 2;
let SBJ_MATCHBOX = 3;

//// GAME PREFERENCES ////
let DT = 0.050; // Tick time in seconds
let CELL_SIZE = 8;
let TEXTURE_SIZE = 8;

// Limitations for player
let LIMIT_HP = 3;
let LIMIT_OIL = 10;
let LIMIT_MIND = 10;
let LIMIT_MATCHES = 3;

let OIL_CONSUMPTION = 0.2;
let DIST_LIGHT = 4;
let DIST_LOAD = 7;

let MONSTER_LIMIT = 3; // Maximum number of monsters
let MONSTER_PERIOD = 10; // Time between monsters spawn

// Map parameters
let SIZE_X = 20;
let SIZE_Y = 20;


//// DRAW PREFERENCES ////
let SCALE = 14; // 1 Cell in px


// Canvas
let SCREEN = document.getElementById("screen");
SCREEN.width = SCREEN.height = 64 * SCALE;
let CTX = SCREEN.getContext("2d");

// Images
function getImg(src) { // Load images
    let img = new Image(); 
    img.src = src;
    return img;
}

// Loading current imgs
let IMGS_GROUND = [
    getImg("textures/ground1.png"),
    getImg("textures/ground2.png")
];

let IMGS_COVERING = [
    getImg("textures/covering1.png"),
    getImg("textures/covering2.png"),
    getImg("textures/covering3.png")
];


let IMGS_GRAVE = [
    getImg("textures/grave1.png"),
    getImg("textures/grave2.png"),
    getImg("textures/grave3.png"),
    getImg("textures/grave4.png"),
    getImg("textures/grave5.png"),
    getImg("textures/grave6.png"),
    getImg("textures/grave7.png"),
    getImg("textures/grave8.png"),
    getImg("textures/grave9.png"),
];


let IMG_PLAYER = getImg("textures/player" + random(1, 3) + ".png");
let IMG_MONSTER0 = getImg("textures/monster1.png");
let IMG_LIGHT = getImg("textures/light.png");
let IMG_SHADOW = getImg("textures/shadow.png");
let IMG_INTERFACE = getImg("textures/interface/interface.png");
let IMG_MATCH = getImg("textures/interface/match.png");

//// KEY CONFIG ////
// Keys (0 - released, 1 - pressed)
let KEY_W = 0; let KEY_W_PREV = 0; 
let KEY_A = 0; let KEY_A_PREV = 0; 
let KEY_S = 0; let KEY_S_PREV = 0; 
let KEY_D = 0; let KEY_D_PREV = 0;
let KEY_X = 0; let KEY_X_PREV = 0;

window.addEventListener('keydown',this.checkDown,false);
function checkDown(e) {
   
    // Checking for buttons pressed
    if(e.keyCode == 87)
        KEY_W = 1;	
    if(e.keyCode == 65)
        KEY_A = 1;  
    if(e.keyCode == 83)
        KEY_S = 1;
    if(e.keyCode == 68)
        KEY_D = 1;
    if(e.keyCode == 88)
        KEY_X = 1;
}

window.addEventListener('keyup',this.checkUp,false);
function checkUp(e) {
   
    // Checking for buttons pressed
    if(e.keyCode == 87)
        KEY_W = 0;	
    if(e.keyCode == 65)
        KEY_A = 0;  
    if(e.keyCode == 83)
        KEY_S = 0;
    if(e.keyCode == 68)
        KEY_D = 0;
    if(e.keyCode == 88)
        KEY_X = 0;
}
