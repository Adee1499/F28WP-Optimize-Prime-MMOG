import {GRID_SIZE, LAYOUT, OBJECT_TYPE} from "./setup";
import Arena from './arena';
import Pacman from "./pacman";
import Ghost from './ghost';
import io from 'socket.io-client';

// --- SOUNDS --- //
import introWav from './../public/assets/pacman_beginning.wav'
import pacmanDeath from './../public/assets/pacman_death.wav'
import pacmanEatGhost from './../public/assets/pacman_eatghost.wav'

function playAudio(audio) {
    const soundEffect = new Audio(audio);
    soundEffect.play();
}
// -------------- //

// DOM elements
const gameGrid = document.querySelector('#game');
const scoreTable = document.querySelector('#score');
var username = document.getElementById("username").value;
const usernameContainer = document.querySelector('#username');

var prob = 0.5 // (50%) percent probability of getting "true"
var randomBoolean = Boolean(Math.random() <= prob);

//this section will have the ghosts be a random colour from the avaiable 4 options
//not fully working however; for a given client all ghosts are came colour, not all different
//also, a ghost player will have a phantom ghost at their spawn point of their colour,
//while they will be Blinky (red) and not the correct random colour

// let rand = Math.floor((Math.random() * 3) + 1);
// let randGhost;
// if (rand == 0){
//     randGhost = [OBJECT_TYPE.BLINKY];
// }
// else if (rand == 1){
//     randGhost = [OBJECT_TYPE.INKY];
// }
// else if (rand == 2){
//     randGhost = [OBJECT_TYPE.PINKY];
// }
// else if (rand == 3){
//     randGhost = [OBJECT_TYPE.CLYDE];
// }
let randGhost = [OBJECT_TYPE.BLINKY];


// socket.io connection setup
const socket = io(`ws://${window.location.host}`);
const connectedPromise = new Promise(resolve => {
    socket.on('connect', () => {
        console.log('Connected to server!');
        resolve();
    });
});

// Your socket id
socket.on('player-number', num => {
    console.log(`your socket id is ${num}`);
})

var numOfPlayers = 0; // init

// Another player connected / disconnected
// update current players number
socket.on('player-connection', num => {
    numOfPlayers = num;
    console.log(`${num} players online`);
})



// Game constants
const GLOBAL_SPEED = 80; //ms
const POWER_PILL_TIME = 10000; // ms
const arena = Arena.createArena(gameGrid, LAYOUT);

// Initial setup
let score = 0;
let timer = null;
let powerPillActive = false;
let powerPillTimer = null;
var player = null;
var playerType = null;

//array containing indexes of empty cells in layout (arena.js)
let emptyCells = [];
for (var i = 0; i < LAYOUT.length; i++) {
    if (LAYOUT[i] == 0)
        emptyCells.push(i);
}

//food variables, for food spawning
const maxFood = Math.floor(emptyCells.length / 4);
let currentFood = 0;


function gameLoop(player) {
    arena.moveCharacter(player);
    while (currentFood < maxFood / 3) spawnFood();

    // Set type of player
    var isPacman = null;
    if (player instanceof Pacman) isPacman = true;
    if (player instanceof Ghost) isPacman = false;

    // check if pacman eats food
    if (arena.objectExist(player.pos, OBJECT_TYPE.FOOD)) {
        arena.removeObject(player.pos, [OBJECT_TYPE.FOOD]);
        currentFood--;
        score += 10;
    }

    // Receive powerpill updates from server
    socket.on('powerpill', pos => {
        arena.removeObject(pos, [OBJECT_TYPE.POWERPILL]);
        if (!isPacman){
            player.isScared = true;
        }
    })

    socket.on('powerpill-over', pos => {
        if (!isPacman){
            player.isScared = false;
        }
    })

    if (isPacman) {
        // check if pacman eats powerpill
        if (arena.objectExist(player.pos, OBJECT_TYPE.POWERPILL)) {
            arena.removeObject(player.pos, [OBJECT_TYPE.POWERPILL]);
            player.powerPill = true;
            score += 5;
            socket.emit('powerpill', player.pos);

            // Powerpill timer
            clearTimeout(powerPillTimer);
            powerPillTimer = setTimeout(
                () => (player.powerPill = false, socket.emit('powerpill-over', player.pos)),
                POWER_PILL_TIME
            );
        }

        //check if pacman eats scared ghost
        if (player.powerPill && arena.objectExist(player.pos, [OBJECT_TYPE.SCARED])) {
            arena.removeObject(player.pos, [OBJECT_TYPE.SCARED]);
            score += 100;
            playAudio(pacmanEatGhost);
        }

        // check if pacman is eaten by a ghost
        if (arena.objectExist(player.pos, randGhost)) {
            gameOver();
            socket.emit('playereaten', player.pos);
            playAudio(pacmanDeath);
        }
    }

    // if is ghost
    if (!isPacman) {
        // if not scared and eats pacman
        if (!player.isScared && arena.objectExist(player.pos, OBJECT_TYPE.PACMAN)) {
            arena.removeObject(player.pos, [OBJECT_TYPE.PACMAN]);
            score += 100;
            playAudio(pacmanDeath);
        }
        // if scared and gets eaten by pacman
        if (player.isScared && arena.objectExist(player.pos, OBJECT_TYPE.PACMAN)) {
            gameOver();
            socket.emit('playereaten', player.pos);
            playAudio(pacmanEatGhost);
        }
    }

    scoreTable.innerHTML = score;

    // Pass current position and typeof player to the server and isScared
    socket.emit('position', {pos: player.pos, bool: isPacman, rot: player.dir.rotation, scared: player.isScared});
    socket.emit('previous', player.prevMovePos);


    // on position received
    socket.on('position', ({pos, bool, rot, scared}) => {


        // Decide whether to spawn pacman or ghost

        if (bool) playerType = [OBJECT_TYPE.PACMAN];
        if (!bool && !scared) playerType = randGhost;
        if (!bool && scared) playerType = [OBJECT_TYPE.SCARED];

        // My very janky way of getting rid of duplicate pacmen
        // It simply checks the 4 cells around the passed in pacman, if the pacman object exists there
        // If it does, just removes the object to show the empty cell again
        if(arena.objectExist(pos-1, playerType)){
            arena.removeObject(pos-1, playerType);
        }
        if(arena.objectExist(pos+1, playerType)){
            arena.removeObject(pos+1, playerType);
        }
        if(arena.objectExist(pos-GRID_SIZE, playerType)){
            arena.removeObject(pos-GRID_SIZE, playerType);
        }
        if(arena.objectExist(pos+GRID_SIZE, playerType)){
            arena.removeObject(pos+GRID_SIZE, playerType);
        }

        // Same way as above of removing ghost once that said ghost is scared
        if (scared) {
            if (arena.objectExist(pos - 1, [OBJECT_TYPE.BLINKY])) {
                arena.removeObject(pos - 1, [OBJECT_TYPE.BLINKY]);
            }
            if (arena.objectExist(pos + 1, [OBJECT_TYPE.BLINKY])) {
                arena.removeObject(pos + 1, [OBJECT_TYPE.BLINKY]);
            }
            if (arena.objectExist(pos - GRID_SIZE, [OBJECT_TYPE.BLINKY])) {
                arena.removeObject(pos - GRID_SIZE, [OBJECT_TYPE.BLINKY]);
            }
            if (arena.objectExist(pos + GRID_SIZE, [OBJECT_TYPE.BLINKY])) {
                arena.removeObject(pos + GRID_SIZE, [OBJECT_TYPE.BLINKY]);
            }
        }

        if (!scared) {
            if (arena.objectExist(pos - 1, [OBJECT_TYPE.SCARED])) {
                arena.removeObject(pos - 1, [OBJECT_TYPE.SCARED]);
            }
            if (arena.objectExist(pos + 1, [OBJECT_TYPE.SCARED])) {
                arena.removeObject(pos + 1, [OBJECT_TYPE.SCARED]);
            }
            if (arena.objectExist(pos - GRID_SIZE, [OBJECT_TYPE.SCARED])) {
                arena.removeObject(pos - GRID_SIZE, [OBJECT_TYPE.SCARED]);
            }
            if (arena.objectExist(pos + GRID_SIZE, [OBJECT_TYPE.SCARED])) {
                arena.removeObject(pos + GRID_SIZE, [OBJECT_TYPE.SCARED]);
            }
        }


        arena.addObject(pos, playerType);

        if (!arena.objectExist(pos, randGhost) || (!arena.objectExist(pos, [OBJECT_TYPE.SCARED]))) arena.rotateDiv(pos, rot);
    })


    socket.on('removal', pos => {
        arena.removeObject(pos, [OBJECT_TYPE.PACMAN])
        arena.removeObject(pos, randGhost)
        arena.removeObject(pos, [OBJECT_TYPE.SCARED])
    })


    /*  My attempt of passing in a variable that held the pacman's previous position
        I set it so in the pacman.js  setNewPos method, before setting the new position
        It'd set this.prevMovePos to this.pos but alas it didn't work
    socket.on('previous', prevMovePos => {
        arena.removeObject(prevMovePos, [OBJECT_TYPE.PACMAN]);
    })*/
}

// Spawn a food in random empty location
function spawnFood(){
// Find and choose empty position
    var index = emptyCells.splice(Math.floor(Math.random() * emptyCells.length), 1);

    // Create and position food

    arena.addObject(index, [OBJECT_TYPE.FOOD]);

    currentFood++;
}

function startGame(){
    playAudio(introWav);
    powerPillActive = false;
    usernameContainer.innerHTML = username;
    arena.createGrid(LAYOUT);
    var index = emptyCells.splice(Math.floor(Math.random() * emptyCells.length), 1);
    var randomPos = index[0];

    if (randomBoolean) {
        player = new Pacman(2, randomPos);
        arena.addObject(randomPos, [OBJECT_TYPE.PACMAN]);
    } else {
        player = new Ghost(2, randomPos);
            arena.addObject(randomPos, randGhost);
    }

    document.addEventListener('keydown', inputHandler);


    timer = setInterval(() => gameLoop(player), GLOBAL_SPEED);
}

function inputHandler(e) {
    player.handleKeyInput(e, arena.objectExist.bind(arena));
}

function gameOver() {
    document.removeEventListener('keydown', inputHandler);
    console.log('GAME OVER');
    //arena.removeObject(player.pos);
    player = null;
}

// Initialize game
startGame();
