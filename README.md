# PACMAN SOCKET.IO MULTIPLAYER GAME

Navigate inside the root directory and run command ```npm install``` then ```npm start``` to start the server.
The default port is 3000 so the server will start on http://localhost:3000

[Demo Video](https://www.youtube.com/watch?v=CRW8lzE-pPo&feature=youtu.be)

Developed as part of a team for university coursework (Web Programming course) - [Original repo](https://github.com/N0m0turtle/F28WP-Optimize-Prime-MMOG) The objective was to develop an online multiplayer 2D browser game using strictly DOM manipulation, and without using any game engines or the HTML Canvas element.

<br>

The game runs on Node.js, using npm as a package manager (Babel for backwards compatibility and Socket.io for client-server communication). Players are randomly assigned either a ghost or a Pacman (probability percentage can be edited in the source code). Both types can eat "food" for points, however only Pacmen can eat the powerup pills, and once they do they are able to eat ghosts. Server is mainly acting as a relay, sending information between all the clients.

All the game logic happens on client side. 'server/index.js' bundles all javascript files together and detects a socket connection. All of the 4 main scripts in '/src' are on client side. 
<br><br>
<strong>setup.js</strong> holds all the constants and the layout of the level
<br>
<strong>pacman.js</strong> holds all the methods to move pacman/ghost on the grid and handle player input
<br>
<strong>arena.js</strong> is used to generate a DOMGrid from the layout (from setup.js) and has a method to move the pacman (or any other character) on the grid
<br>
<strong>index.js</strong> sets up the game after importing all the other scripts
