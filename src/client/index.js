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
    pacmanPos.x = (playArea.offsetWidth / 2 + playArea.offsetLeft) - (pacman.offsetWidth / 2);
    pacmanPos.y = (playArea.offsetHeight + playArea.offsetTop) - (pacman.offsetHeight * 2);
    playArea.leftBoundary = playArea.offsetLeft + 10;
    playArea.rightBoundary = (playArea.offsetLeft + playArea.offsetWidth - 10) - pacman.offsetWidth;
    playArea.topBoundary = playArea.offsetTop + 10;
    playArea.bottomBoundary = (playArea.offsetTop + playArea.offsetHeight - 10) - pacman.offsetHeight;



    function movePacman() {
        if (key.shift === true && canDash) {
            dash();
        }
        if (isDashing == true) {
            pacmanSpeed = dashSpeed;
        } else if (isDashing == false) {
            pacmanSpeed = 4;
        }
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
        pacman.style.left = pacmanPos.x + 'px';
        pacman.style.top = pacmanPos.y + 'px';
    }

    function keyDown(e) {
        if (e.keyCode === 39) {
            key.right = true;
        } else if (e.keyCode === 37) {
            key.left = true;
        }
        if (e.keyCode === 38) {
            key.up = true;
        } else if (e.keyCode === 40) {
            key.down = true;
        }
        if (e.keyCode === 16) {
            key.shift = true;
        }
    }

    function keyUp(e) {
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

    function dash() {
        isDashing = true;
        setTimeout(function dash() {
            isDashing = false;
            canDash = false;
        }, 300);
        dashCooldown();
    }

    function dashCooldown() {
        setTimeout(function dashCooldown() {
            canDash = true;
        }, 1500);
    }

    function resetSpeed() {
        pacmanSpeed = 4;
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    document.addEventListener('keydown', keyDown, false);
    document.addEventListener('keyup', keyUp, false);

    function loop() {
        movePacman();
        setTimeout(loop, 1000 / 60);
    }

    loop();

})()