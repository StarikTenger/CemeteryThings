'use strict'

//// CONSTANTS ////
// Directions
var RIGHT = 0;
var DOWN = 1;
var LEFT = 2;
var UP = 3;

//// GAME PREFERENCES ////
var CELL_SIZE = 8;

// Limitations for player
var LIMIT_HP = 3;
var LIMIT_OIL = 10;
var LIMIT_MIND = 10;
var LIMIT_MATCHES = 3;

var DIST_LIGHT = 4;
var DIST_LOAD = 7;

var LIMIT_MONSTERS = 3;

// Map parameters
var SIZE_X = 20;
var SIZE_Y = 20;


//// DRAW PREFERENCES ////
var SCALE = 16; // 1 Cell in px


// Canvas
var SCREEN = document.getElementById("screen");
SCREEN.width = SCREEN.height = 64 * SCALE;
var CTX = SCREEN.getContext("2d");

// Images
function getImg(src) { // Load images
    var img = new Image(); 
    img.src = src;
    return img;
}

// Loading current imgs
var IMGS_GROUND = [
    getImg("textures/ground0.png"),
    getImg("textures/ground1.png")
];


var IMGS_GRAVE = [
    getImg("textures/grave0.png"),
    getImg("textures/grave1.png"),
    getImg("textures/grave2.png"),
    getImg("textures/grave3.png"),
    getImg("textures/grave4.png"),
    getImg("textures/grave5.png"),
    getImg("textures/grave6.png"),
    getImg("textures/grave7.png")
];


var IMG_PLAYER = getImg("textures/player" + random(0, 2) + ".png");
var IMG_MONSTER0 = getImg("textures/player0.png");
var IMG_LIGHT = getImg("textures/light.png");
var IMG_SHADOW = getImg("textures/shadow.png");
var IMG_INTERFACE = getImg("textures/interface.png");

//// KEY CONFIG ////
// Keys (0 - released, 1 - pressed)
var KEY_W = 0;
var KEY_A = 0;
var KEY_S = 0;
var KEY_D = 0;

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
}
