import { LAYOUT, OBJECT_TYPE } from "./setup";
import Arena from './arena';
import Pacman from "./pacman";
import io from 'socket.io-client';

// DOM elements
const gameGrid = document.querySelector('#game');
const scoreTable = document.querySelector('#score');
var username = document.getElementById("username").value;
const usernameContainer = document.querySelector('#username');

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

// Another player connected / disconnected
// update current players number
socket.on('player-connection', num => {
    console.log(`${num} players online`);
})



// Game constants
const GLOBAL_SPEED = 80; //ms
const arena = Arena.createArena(gameGrid, LAYOUT);

// Initial setup
let score = 0;
let timer = null;

//array containing indexes of empty cells in layout (arena.js)
let emptyCells = [];
for (var i = 0; i < LAYOUT.length; i++) {
    if (LAYOUT[i] == 0)
        emptyCells.push(i);
}

//food variables, for food spawning
const maxFood = Math.floor(emptyCells.length / 4);
let currentFood = 0;

function checkCollision(pacman, ghosts) {

}

function gameLoop(pacman, ghosts) {
    arena.moveCharacter(pacman);
    while (currentFood < maxFood / 3) spawnFood();

    // check if pacman eats food
    if (arena.objectExist(pacman.pos, OBJECT_TYPE.FOOD)) {
        arena.removeObject(pacman.pos, [OBJECT_TYPE.FOOD]);
        currentFood--;
        score += 10;
    }


    scoreTable.innerHTML = score;

    // Pass current position to the server
    socket.emit('position', pacman.pos);

    socket.emit('previous', pacman.prevMovePos);

    // on position received
    socket.on('position', pos => {
        // My very janky way of getting rid of duplicate pacmen
        // It simply checks the 4 cells around the passed in pacman, if the pacman object exists there
        // If it does, just removes the object to show the empty cell again
        if(arena.objectExist(pos-1, [OBJECT_TYPE.PACMAN])){
            arena.removeObject(pos-1, [OBJECT_TYPE.PACMAN]);
        }
        if(arena.objectExist(pos+1, [OBJECT_TYPE.PACMAN])){
            arena.removeObject(pos+1, [OBJECT_TYPE.PACMAN]);
        }
        if(arena.objectExist(pos-28, [OBJECT_TYPE.PACMAN])){
            arena.removeObject(pos-28, [OBJECT_TYPE.PACMAN]);
        }
        if(arena.objectExist(pos+28, [OBJECT_TYPE.PACMAN])){
            arena.removeObject(pos+28, [OBJECT_TYPE.PACMAN]);
        }

        arena.addObject(pos, [OBJECT_TYPE.PACMAN]);
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
    usernameContainer.innerHTML = username;
    arena.createGrid(LAYOUT);
    var index = emptyCells.splice(Math.floor(Math.random() * emptyCells.length), 1);
    var randomPos = index[0];
    const pacman = new Pacman(2, randomPos);
    arena.addObject(randomPos, [OBJECT_TYPE.PACMAN]);

    document.addEventListener('keydown', (e) =>
        pacman.handleKeyInput(e, arena.objectExist.bind(arena))
    );

    timer = setInterval(() => gameLoop(pacman), GLOBAL_SPEED);
}

// Initialize game
startGame();
