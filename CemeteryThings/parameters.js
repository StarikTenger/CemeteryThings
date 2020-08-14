'use strict'

//// CONSTANTS ////
// Directions
let RIGHT = 0;
let DOWN = 1;
let LEFT = 2;
let UP = 3;

// Subjects' names
let SBJ_HEAL = 1;
let SBJ_OIL = 2;
let SBJ_WHISKEY = 3;
let SBJ_MATCHBOX = 4;

// Monsters' names

let MNS_ZOMBIE = 1;
let MNS_GHOST = 2;
let MNS_TENTACLE = 3;

//// GAME PREFERENCES ////
let DT = 0.050; // Tick time in seconds
let CELL_SIZE = 8;
let TEXTURE_SIZE = 8;

let EPS = 0.0001;

// Limitations for player
let LIMIT_HP = 3;
let LIMIT_OIL = 10;
let LIMIT_MIND = 10;
let LIMIT_MATCHES = 3;

let OIL_CONSUMPTION = 0.2;
let DIST_LIGHT = 4;
let DIST_LOAD = 7;

let MONSTER_LIMIT = 3; // Maximum number of monsters
let MONSTER_PERIOD = 20; // Time between monsters spawn

let SUBJECT_LIMIT = 3; // Maximum number of subjects
let SUBJECT_PERIOD = 5; // Time between subjects spawn

// Map parameters
let MARGIN = 3; // Cells on map's sides, that are not changing
let SIZE_X = 20 + MARGIN * 2;
let SIZE_Y = 20 + MARGIN * 2;


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
    getImg("textures/covering3.png"),
    getImg("textures/covering4.png"),
    getImg("textures/covering5.png"),
    getImg("textures/covering6.png"),
    getImg("textures/covering7.png"),
    getImg("textures/covering8.png")
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
    getImg("textures/grave10.png"),
];

let IMGS_MONSTER = [
    getImg("textures/monster1.png"),
    getImg("textures/monster2.png"),
    getImg("textures/monster3.png")
];

let IMGS_SUBJECT = [
    getImg("textures/subjects/heal.png"),
    getImg("textures/subjects/oil.png"),
    getImg("textures/subjects/whiskey.png"),
    getImg("textures/subjects/matchbox.png")
];


let IMG_PLAYER = getImg("textures/player" + random(1, 3) + ".png");
let IMG_MONSTER0 = getImg("textures/monster1.png");
let IMG_LIGHT = getImg("textures/light.png");
let IMG_SHADOW = getImg("textures/shadow.png");
let IMG_INTERFACE = getImg("textures/interface/interface.png");
let IMG_INTERFACE_OVERLAY = getImg("textures/interface/interfaceOverlay.png");
let IMG_MATCH = getImg("textures/interface/match.png");

let IMG_DEAD = getImg("textures/interface/deathscreen.png");
let IMG_DELIRIOUS = getImg("textures/interface/deliriumscreen.png");

//// KEY CONFIG ////
// Keys (0 - released, 1 - pressed)
let KEY_W = 0; let KEY_W_PREV = 0; 
let KEY_A = 0; let KEY_A_PREV = 0; 
let KEY_S = 0; let KEY_S_PREV = 0; 
let KEY_D = 0; let KEY_D_PREV = 0;
let KEY_X = 0; let KEY_X_PREV = 0;
let KEY_1 = 0; let KEY_1_PREV = 0;
let KEY_2 = 0; let KEY_2_PREV = 0;
let KEY_UP = 0; let KEY_UP_PREV = 0; 
let KEY_DOWN = 0; let KEY_DOWN_PREV = 0; 
let KEY_LEFT = 0; let KEY_LEFT_PREV = 0; 
let KEY_RIGHT = 0; let KEY_RIGHT_PREV = 0; 

function checkKey(e, t) {
    if(e.keyCode == 87)
        KEY_W = t;	
    if(e.keyCode == 65)
        KEY_A = t;  
    if(e.keyCode == 83)
        KEY_S = t;
    if(e.keyCode == 68)
        KEY_D = t;
    if(e.keyCode == 88)
        KEY_X = t;
    if(e.keyCode == 49)
        KEY_1 = t;
    if(e.keyCode == 50)
        KEY_2 = t;
    if(e.keyCode == 37)
        KEY_LEFT = t;
    if(e.keyCode == 38)
        KEY_UP = t;
    if(e.keyCode == 39)
        KEY_RIGHT = t;
    if(e.keyCode == 40)
        KEY_DOWN = t;
}

window.addEventListener('keydown',this.checkDown,false);
function checkDown(e) {
   
    // Checking for buttons pressed
    checkKey(e, 1);
}

window.addEventListener('keyup',this.checkUp,false);
function checkUp(e) {
   
    // Checking for buttons pressed
    checkKey(e, 0);
}