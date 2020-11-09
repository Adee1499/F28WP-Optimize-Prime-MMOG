import { GRID_SIZE, CELL_SIZE, OBJECT_TYPE, CLASS_LIST } from "./setup";

class Arena {
    constructor(DOMGrid) {
        this.grid = [];
        this.DOMGrid = DOMGrid;
    }

    createGrid(layout) {
        this.grid = [];
        this.DOMGrid.innerHTML = '';
        this.DOMGrid.style.cssText = `grid-template-columns: repeat(${GRID_SIZE}, ${CELL_SIZE}px);`;


        layout.forEach((square) => {
            const div = document.createElement('div');
            div.classList.add('square', CLASS_LIST[square]);
            div.style.cssText = `width: ${CELL_SIZE}px; height: ${CELL_SIZE}px;`;
            this.DOMGrid.appendChild(div);
            this.grid.push(div);
        });
    }

    addObject(pos, classes) {
        this.grid[pos].classList.add(...classes);
    }

    removeObject(pos, classes) {
        this.grid[pos].classList.remove(...classes);
    }

    objectExist(pos, object) {
        return this.grid[pos].classList.contains(object);
    };

    rotateDiv(pos, deg) {
        this.grid[pos].style.transform = `rotate(${deg}deg)`;
    }

    moveCharacter(character) {
        if (character.shouldMove()) {
            const { nextMovePos, direction } = character.getNextMove(
                this.objectExist.bind(this)
            );
            const { classesToRemove, classesToAdd } = character.makeMove();

            if (character.rotation && nextMovePos !== character.pos) {
                // Rotate
                this.rotateDiv(nextMovePos, character.dir.rotation);
                // Rotate the previous div back
                this.rotateDiv(character.pos, 0);
            }

            this.removeObject(character.pos, classesToRemove);
            this.addObject(nextMovePos, classesToAdd);

            character.setNewPos(nextMovePos, direction);
        }
    }


    static createArena(DOMGrid, layout) {
        const playArea = new this(DOMGrid);
        playArea.createGrid(layout);
        return playArea;
    }

}

export default Arena;