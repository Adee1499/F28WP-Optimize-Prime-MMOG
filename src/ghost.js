import { OBJECT_TYPE, DIRECTIONS_GHOST } from "./setup";

class Ghost {
    constructor(speed, startPos) {
        this.pos = startPos;
        this.speed = speed;
        this.dir = null;
        this.timer = 0;
        this.rotation = true;
        this.prevMovePos = this.pos;
        this.isScared = false;
    }

    shouldMove() {
        if (this.timer === this.speed) {
            this.timer = 0;
            return true;
        }
        this.timer++;
    }

    getNextMove(objectExist) {
        let nextMovePos = this.pos + this.dir.movement;

        if (objectExist(nextMovePos, OBJECT_TYPE.WALL)) {
            nextMovePos = this.pos;
        }

        return { nextMovePos, direction: this.dir };
    }

    makeMove() {
        const classesToRemove = [OBJECT_TYPE.BLINKY, OBJECT_TYPE.SCARED];
        let classesToAdd = [OBJECT_TYPE.BLINKY];

        if (this.isScared) classesToAdd = [...classesToAdd, OBJECT_TYPE.SCARED];

        return { classesToRemove, classesToAdd };
    }

    setNewPos(nextMovePos) {
        let prevMovePos = this.pos;
        this.pos = nextMovePos;
    }

    handleKeyInput = (e, objectExist) => {
        let dir;

        if (e.keyCode >= 37 && e.keyCode <= 40) {
            dir = DIRECTIONS_GHOST[e.key]
        } else {
            return;
        }

        const nextMovePos = this.pos + dir.movement;
        if (objectExist(nextMovePos, OBJECT_TYPE.WALL)) return;
        this.dir = dir;
    };

}

export default Ghost;
