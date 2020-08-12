'use strict'

//// CONSTANTS ////
// Directions
var RIGTH = 0;
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

// Map parameters
var SIZE_X = 20;
var SIZE_Y = 20;


//// DRAW PREFERENCES ////
var SCALE = 8;


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

var IMG_GROUND0 = getImg("textures/ground0.png");
var IMG_GRAVE0 = getImg("textures/grave0.png");
