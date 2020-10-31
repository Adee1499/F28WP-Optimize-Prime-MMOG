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
		dirArray = ["", "", "", ""], //directions array, for multiple keys held down
		addDir = "",                 //direction to add to dirArray
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
        // Amends the pacman's position with the direction and current pacman's speed
        if (key.right === true) {
            pacmanPos.x += pacmanSpeed;
        } else if (key.left === true) {
            pacmanPos.x -= pacmanSpeed;
        }
        if (key.up === true) {
            pacmanPos.y -= pacmanSpeed;
        } else if (key.down === true) {
            pacmanPos.y += pacmanSpeed;
        }
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
        // Changes the object's CSS position
        pacman.style.left = pacmanPos.x + 'px';
        pacman.style.top = pacmanPos.y + 'px';
    }


    // Functions for event handling of keys pressed, for arrow keys and shift
    // key.right, key.down etc makes it so that the object can only move in one direction.
    // Each if statement will rotate the CSS .pacman class accordingly via changing the rotate value
    function KeyDown(e) {
        if (e.keyCode === 39) {
            key.right = true;
            key.down = false;
            key.up = false;
            key.left = false;
			addDir = "right";
			addArray(dirArray, addDir);

            pacman.style.transform = "rotate(0turn)";
        } else if (e.keyCode === 37) {
            key.left = true;
            key.down = false;
            key.up = false;
            key.right = false;
			addDir = "left";
			addArray(dirArray, addDir);

            pacman.style.transform = "rotate(0.5turn)";
        }
        if (e.keyCode === 38) {
            key.up = true;
            key.left = false;
            key.right = false;
            key.down = false;
			addDir = "up";
			addArray(dirArray, addDir);

            pacman.style.transform = "rotate(0.75turn)";
        } else if (e.keyCode === 40) {
            key.down = true;
            key.left = false;
            key.right = false;
            key.up = false;
			addDir = "down";
			addArray(dirArray, addDir);

            pacman.style.transform = "rotate(0.25turn)";
        }
        if (e.keyCode === 16) {
            key.shift = true;
        }

        for (var ii=0; ii<walls.length; ii++)
        {
            walls[ii].checkIntersection(player.id, player, player.dims);
        }
    }


    // keyUp makes it so when the user releases key, it'll stop moving the object
    function KeyUp(e) {
        if (e.keyCode === 39) {
            key.right = false;
        } else if (e.keyCode === 37) {
            key.left = false;
        }
        if (e.keyCode === 38) {
            key.up = false;
        } else if (e.keyCode === 40) {
            key.down = false;
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

    //spawn a food in random empty location
    function SpawnFood() {
        //find and choose empty position
        var index = emptyCells.splice(Math.floor(Math.random() * emptyCells.length), 1);
        var coord = IndexToCoord(index);
        
        //apply food offsets (food size 8x8)
        coord[0] += 12; // += cellWidth / 2 - foodWidth / 2
        coord[1] += 12;

        //update layout
        // not implemented, unsure if wanted

        //create and position food
        var food = document.createElement('div');
        food.id = 'food' + currentFood;
        food.className = 'food';
        food.style.position = 'absolute';
        food.style.top = coord[1] + 'px';
        food.style.left = coord[0] + 'px';

        playArea.appendChild(food);
        
        currentFood++;
    }

    //convert layout index to x y co-ord in pixels
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

    //spawning algorithm for food. Currently fills 1/4 of empty cells with food.
    function UpdateFood() {
        while (currentFood < maxFood) {
            SpawnFood();
        }
    }
    


    document.addEventListener('keydown', KeyDown, false);
    document.addEventListener('keyup', KeyUp, false);
	
	//add new key direction held down to the array
	function addArray(dirArray, addDir){
		for(i = 0; i < dirArray.length; i++){
			if(dirArray[i] == ""){
				dirArray[i] = addDir;
			}
		}
	}
	
	//changes pac movement direction back to previous key's
	function revertDir(dirArray, arrayIndex){
		if (dirArray[arrayIndex] == "right"){
			key.right = true;
            key.down = false;
            key.up = false;
            key.left = false;
			MovePacman();
		}
		else if (dirArray[arrayIndex] == "left"){
			key.right = false;
            key.down = false;
            key.up = false;
            key.left = true;
			MovePacman();
		}
		else if (dirArray[arrayIndex] == "up"){
			key.right = false;
            key.down = false;
            key.up = true;
            key.left = false;
			MovePacman();
		}
		else if (dirArray[arrayIndex] == "down"){
			key.right = false;
            key.down = true;
            key.up = false;
            key.left = false;
			MovePacman();
		}
	}
	
	//reverts last array value to previous key held down
	function removeArray(dirArray){
		var arrayIndex = 0;
		if(dirArray[0] !== ""){
			dirArray[0] = "";
		}
		else if(dirArray[1] !== ""){
			dirArray[1] = "";
			revertDir(dirArray, arrayIndex);
		}
		else if(dirArray[2] !== ""){
			dirArray[2] = "";
			revertDir(dirArray, arrayIndex);
		}
		else if(dirArray[3] !== ""){
			dirArray[3] = "";
			revertDir(dirArray, arrayIndex);
		}
	}


    //functions to be looped over, performed every frame
    function Loop() {
        MovePacman();
        UpdateScore();
        UpdateFood();
        setTimeout(Loop, 1000 / 60);
    }

    Loop();

})()
