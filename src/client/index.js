(function () {
    var playArea = document.createElement('div'),
        pacman = document.createElement('div'),
        pacmanPos = {
            x: 0,
            y: 0
        },
        pacmanSpeed = 4,
        dashSpeed = 12,
        isDashing = false,
        canDash = true,
        key = {
            right: false,
            left: false,
            up: false,
            down: false,
            shift: false
        },
        pacmanWidth = pacman.offsetWidth,
        pacmanHeight = pacman.offsetHeight;

    document.body.appendChild(playArea);
    playArea.classList.add('playArea');
    document.body.appendChild(pacman);
    pacman.classList.add('pacman');

    // This variable is used in the rotation of the pacman class in CSS
    var rotatePac = document.getElementsByClassName('pacman');

    pacmanPos.x = (playArea.offsetWidth / 2 + playArea.offsetLeft) - (pacman.offsetWidth / 2);
    pacmanPos.y = (playArea.offsetHeight + playArea.offsetTop) - (pacman.offsetHeight * 2);
    playArea.leftBoundary = playArea.offsetLeft + 10;
    playArea.rightBoundary = (playArea.offsetLeft + playArea.offsetWidth - 10) - pacman.offsetWidth;
    playArea.topBoundary = playArea.offsetTop + 10;
    playArea.bottomBoundary = (playArea.offsetTop + playArea.offsetHeight - 10) - pacman.offsetHeight;


    // Function will move the pacman, is constantly called from the loop at the bottom of script
    function MovePacman() {
        // Statements that are for handling the dash mechanic, boosting the player's speed temporarily.
        if (key.shift === true && canDash) {
            dash();
        }
        if (isDashing == true) {
            pacmanSpeed = dashSpeed;
        } else if (isDashing == false) {
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

            pacman.style.transform = "rotate(0turn)";
        } else if (e.keyCode === 37) {
            key.left = true;
            key.down = false;
            key.up = false;
            key.right = false;

            pacman.style.transform = "rotate(0.5turn)";
        }
        if (e.keyCode === 38) {
            key.up = true;
            key.left = false;
            key.right = false;
            key.down = false;

            pacman.style.transform = "rotate(0.75turn)";
        } else if (e.keyCode === 40) {
            key.down = true;
            key.left = false;
            key.right = false;
            key.up = false;

            pacman.style.transform = "rotate(0.25turn)";
        }
        if (e.keyCode === 16) {
            key.shift = true;
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
        dashCooldown();
    }
    // Function for timing the cooldown of dash
    function DashCooldown() {
        setTimeout(function dashCooldown() {
            canDash = true;
        }, 1500);
    }

    // Don't think this function does anything currently
    function ResetSpeed() {
        pacmanSpeed = 4;
    }

    function Sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    document.addEventListener('keydown', KeyDown, false);
    document.addEventListener('keyup', KeyUp, false);

    function Loop() {
        MovePacman();
        setTimeout(Loop, 1000 / 60);
    }

    Loop();

})()