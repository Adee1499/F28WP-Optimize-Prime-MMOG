(function () {
    var playArea = document.createElement('div'),
        pacman = document.createElement('div'),
        username = document.getElementById("username"),
        pacmanPos = {
            x: 0,
            y: 0
        },
        pacmanSpeed = 4,
        dashSpeed = 12,
        isDashing = false,
        canDash = true,

		dirArray = [], //directions array, for multiple keys held down
        key = {
            right: false,
            left: false,
            up: false,
            down: false,
            shift: false
        };
        //pacmanWidth = pacman.offsetWidth,
        //pacmanHeight = pacman.offsetHeight;


    document.body.appendChild(playArea);
    playArea.classList.add('grid');
    document.body.appendChild(pacman);
    pacman.classList.add('pacman');

    pacmanPos.x = (playArea.offsetWidth / 2 + playArea.offsetLeft) - (pacman.offsetWidth / 2);
    pacmanPos.y = (playArea.offsetHeight + playArea.offsetTop) - (pacman.offsetHeight * 2);
    playArea.leftBoundary = playArea.offsetLeft + 10;
    playArea.rightBoundary = (playArea.offsetLeft + playArea.offsetWidth - 10) - pacman.offsetWidth;
    playArea.topBoundary = playArea.offsetTop + 10;
    playArea.bottomBoundary = (playArea.offsetTop + playArea.offsetHeight - 10) - pacman.offsetHeight;
    
    /*
    For some reason was sometimes having trouble accessing this from grid.js, despite loading it prior to index.js, 
    so have copied it here temporarily
    */
    // a constant variable layout that holds the layout of the grid which is 28x20
    // 1 = a wall, 0 = an empty cell
    let gridLayout = [
        1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0,
        1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        1, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0,
        1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0,
        0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0,
        1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0,
        1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0,
        1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0,
        1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0,
        0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0,

    ]

    //score variable (make part of pacman player class)
    let score = 0;

    //array containing indexes of empty cells in layout (grid.js)
    let emptyCells = [];
    for (var i = 0; i < gridLayout.length; i++) {
        if (gridLayout[i] == 0) 
           emptyCells.push(i);
    }

    //food variables, for food spawning
    const maxFood = Math.floor(emptyCells.length / 4);
    let currentFood = 0;
    
    
    // this function doesn't do anything 😀
    function CollisionDetect(){
        if(pacmanPos.x+10 == document.getElementById('wall') ){
            alert("crap");
        }
    }
 
    // Function will move the pacman, is constantly called from the loop at the bottom of script
    function MovePacman() {
        CollisionDetect() // doesn't do anything
        // Statements that are for handling the dash mechanic, boosting the player's speed temporarily.
        if (key.shift === true && canDash) {
            Dash();
        }
        if (isDashing === true) {
            pacmanSpeed = dashSpeed;
        } else if (isDashing === false) {
            pacmanSpeed = 4;
        }

        // Get movement direction from dirArray, rotating the pacman as specified and sets up movement
        // Do nothing if array is empty
        if (dirArray.length > 0) {
            // Test last element in dirArray (most recent). Apply transformations accordingly.
            switch (dirArray[dirArray.length - 1]) {
                case "left": 
                    pacmanPos.x -= pacmanSpeed;
                    pacman.style.transform = "rotate(0.5turn)";
                    break;
                case "right":
                    pacmanPos.x += pacmanSpeed;
                    pacman.style.transform = "rotate(0turn)";
                    break;
                case "up":
                    pacmanPos.y -= pacmanSpeed;
                    pacman.style.transform = "rotate(0.75turn)";
                    break;
                case "down":
                    pacmanPos.y += pacmanSpeed;
                    pacman.style.transform = "rotate(0.25turn)";
                    break;
            }    
        }

        // Collision detection with boundary
        if (pacmanPos.x < playArea.leftBoundary) {
            pacmanPos.x = playArea.leftBoundary;
        }
        if (pacmanPos.x > playArea.rightBoundary) {
            pacmanPos.x = playArea.rightBoundary;
        }
        if (pacmanPos.y < playArea.topBoundary) {
            pacmanPos.y = playArea.topBoundary;
        }
        if (pacmanPos.y > playArea.bottomBoundary) {
            pacmanPos.y = playArea.bottomBoundary;
        }

        // Changes the object's CSS position to move the pacman
        pacman.style.left = pacmanPos.x + 'px';
        pacman.style.top = pacmanPos.y + 'px';
    }

    // Register when a key is pressed down
    function KeyDown(e) {
        //note: dirArray is checked to restrict multiple instances.
        if (e.keyCode === 39 && dirArray.indexOf("right") == -1) {
            dirArray.push("right");
        }
        if (e.keyCode === 37 && dirArray.indexOf("left") == -1) {
            dirArray.push("left");
        }
        if (e.keyCode === 38 && dirArray.indexOf("up") == -1) {
            dirArray.push("up");
        } 
        if (e.keyCode === 40 && dirArray.indexOf("down") == -1) {
            dirArray.push("down");
        }

        if (e.keyCode === 16) {
            key.shift = true;
        }

        for (var ii=0; ii<walls.length; ii++)
        {
            walls[ii].checkIntersection(player.id, player, player.dims);
        }
    }

    // Register when a key is released
    function KeyUp(e) {
        if (e.keyCode === 39) {
            dirArray.splice(dirArray.indexOf("right"), 1);
        }
        if (e.keyCode === 37) {
            dirArray.splice(dirArray.indexOf("left"), 1)
        }
        if (e.keyCode === 38) {
            dirArray.splice(dirArray.indexOf("up"), 1)
        } 
        if (e.keyCode === 40) {
            dirArray.splice(dirArray.indexOf("down"), 1)
        }
        
        if (e.keyCode === 16) {
            key.shift = false;
        }
    }

    // Function for the dash mechanic
    function Dash() {
        isDashing = true;
        setTimeout(function dash() {
            isDashing = false;
            canDash = false;
        }, 300);
        DashCooldown();
    }

    // Function for timing the cooldown of dash
    function DashCooldown() {
        setTimeout(function DashCooldown() {
            canDash = true;
        }, 1500);
    }


    // Updates the score
    function UpdateScore() {
        //score++;
        document.getElementById("score").innerHTML = score;
    }

    // Spawn a food in random empty location
    function SpawnFood() {
        // Find and choose empty position
        var index = emptyCells.splice(Math.floor(Math.random() * emptyCells.length), 1);
        var coord = IndexToCoord(index);
        
        // Apply food offsets (food size 8x8)
        coord[0] += 12; // += cellWidth / 2 - foodWidth / 2
        coord[1] += 12;

        // Update layout
        // not implemented

        // Create and position food
        var food = document.createElement('div');
        food.id = 'food' + currentFood;
        food.className = 'food';
        food.style.position = 'absolute';
        food.style.top = coord[1] + 'px';
        food.style.left = coord[0] + 'px';

        playArea.appendChild(food);
        
        currentFood++;
    }

    // food collision
    // not implemented
    
    // food remove
    // not implemented

    // Convert layout index to x y co-ord in pixels
    function IndexToCoord(index) {  
        //convert index to xy
        //28x20: cell dimensions of grid
        var y = Math.floor(index/28);
        var x = index % 28;
        //scale to pixels
        //32: size of cell (square)
        y *= 32;
        x *= 32; 
        return [x, y]
    }

    // Spawning algorithm for food. Currently just fills 1/4 of empty cells with food.
    function UpdateFood() {
        while (currentFood < maxFood) {
            SpawnFood();
        }
    }

    document.addEventListener('keydown', KeyDown, false);
    document.addEventListener('keyup', KeyUp, false);


    // Functions to be looped over, with delay for approx frame rate
    function Loop() {
        MovePacman();
        UpdateScore();
        UpdateFood();
        setTimeout(Loop, 1000 / 60);
    }

    Loop();

})()
