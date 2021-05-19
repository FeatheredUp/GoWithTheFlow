// returns a whole number between min and max (both inclusive).  I.e. what 'pick a number between 1 and 10' means.
function getRandomValue(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// represents a direction: left, right, up or down, and allows operations on pieces related to those directions.
class Direction {
    static left  = { dcol: -1, drow:  0};
    static right = { dcol:  1, drow:  0};
    static up    = { dcol:  0, drow: -1};
    static down  = { dcol:  0, drow:  1};

    // randomly choose a direction from 'piece' to another piece that hasn't been visited.
    static getRandomValidDirection(piece) {
        let possibles = [];

        if (Direction.#isDirectionPossible(piece, Direction.left))  possibles.push(Direction.left);
        if (Direction.#isDirectionPossible(piece, Direction.right)) possibles.push(Direction.right);
        if (Direction.#isDirectionPossible(piece, Direction.up))    possibles.push(Direction.up);
        if (Direction.#isDirectionPossible(piece, Direction.down))  possibles.push(Direction.down);

        if (possibles.length === 0) return null;

        const chosen = getRandomValue(0, possibles.length - 1);
        return possibles[chosen];
    }

    // set 'piece' to have access on the specified side
    static setPieceDirection(piece, dir) {
        if (dir == Direction.left) piece.left = true;
        if (dir == Direction.right) piece.right = true;
        if (dir == Direction.up) piece.up = true;
        if (dir == Direction.down) piece.down = true;
    }

    // set 'piece' to have access on the _oppositie_ side.
    static setPieceOppositeDirection(piece, dir) {
        if (dir == Direction.left) piece.right = true;
        if (dir == Direction.right) piece.left = true;
        if (dir == Direction.up) piece.down = true;
        if (dir == Direction.down) piece.up = true;
    }

    static #isDirectionPossible(piece, dir) {
        const next = piece.findNeighbour(dir);
        if (next == undefined) return false;
        return !(next.left || next.right || next.up || next.down); 
    }
}

// reprsents the whole puzzle.
class Puzzle {
    pieces = [];
    flowStart;
    colCount;
    rowCount;
    minSolveCount;
    moveCount;
    constructor(colCount, rowCount) {
        this.colCount = colCount;
        this.rowCount = rowCount;
        this.moveCount = 0;

        this.#makePuzzle();
        this.flowStart = { col: getRandomValue(0, 2), row: getRandomValue(0, 2) };
        this.#mixUp();
        this.calculateFlow();
    }

    // Returns true if the flow has reached all pieces.
    isFinished() {
        for (const piece of this.pieces) {
            if (!piece.flow) return false;
        }
        return true;
    }

    // Creates the basic structure of the track.
    #makePuzzle() {
        for (let col = 0; col < this.colCount; col++) {
            for (let row = 0; row < this.rowCount; row++) {
                this.pieces.push(new Piece(this, row, col, false, false, false, false));
            }
        }

        const position = { col: getRandomValue(0, this.colCount-1), row: getRandomValue(0, this.rowCount-1) };
        const piece = this.pieces.find(({ row, col }) => row == position.row && col == position.col);
        this.#makeTracks(piece);
    }

    // Recursively called - creates a track from the current track to any
    // unoccupied squares, and backtracks if necessary, until all squares are filled.
    #makeTracks(piece) {
        let dir = Direction.getRandomValidDirection(piece);
        while (dir !== null) {
            let neighbour = piece.findNeighbour(dir);
            Direction.setPieceDirection(piece, dir);
            Direction.setPieceOppositeDirection(neighbour, dir);
            this.#makeTracks(neighbour);

            dir = Direction.getRandomValidDirection(piece);
        }
    }

    // Turns each piece around randomly between 0 and 3 times.
    #mixUp() {
        let count = 0;
        for (const piece of this.pieces) {
            const rotations = getRandomValue(0, 3);
            count+= this.#getUndoCount(piece, rotations);
            for (let i = 0; i < rotations; i++) {
                piece.rotate();
            }
        }
        this.minSolveCount = count;
    }

    #getUndoCount(piece, rotations) {
        if (rotations === 0) return 0;
        if (piece.countDirections == 4) return 0;
        let count = 4 - rotations;
        if (piece.straight && count >= 2)  count -= 2;
        return count;
    }

    // Works out which pieces have flow going through them
    calculateFlow() {
        for (const piece of this.pieces) piece.flow = false;
        let thisOne = this.pieces.find(({ row, col }) => row == this.flowStart.row && col == this.flowStart.col);
        this.#followFlow(thisOne);
    }

    // Called recursively - marks and follows the flow in each direction.
    #followFlow(piece) {
        // If flow is already set, there's nothing more to do
        if (piece.flow) return;
        piece.flow = true;

        if (piece.left) {
            let next = piece.findNeighbour(Direction.left);
            if (next && next.right) this.#followFlow(next);
        }
        if (piece.up) {
            let next = piece.findNeighbour(Direction.up);
            if (next && next.down) this.#followFlow(next);
        }
        if (piece.right) {
            let next = piece.findNeighbour(Direction.right);
            if (next && next.left) this.#followFlow(next);
        }
        if (piece.down) {
            let next = piece.findNeighbour(Direction.down);
            if (next && next.up) this.#followFlow(next);
        }
    }
}

// Represents a single square of the puzzle.
class Piece {
    puzzle;
    row;
    col;
    left;
    up;
    right;
    down;
    flow;
    touched;
    constructor(puzzle, row, col, left, up, right, down) {
        this.puzzle = puzzle;
        this.row = row;
        this.col = col;
        this.left = left;
        this.up = up;
        this.right = right;
        this.down = down;

        this.flow = false;
        this.touched = false;
    }

    // The piece has been 'clicked on' by the player, so rotate it,  mark it as touched, and update the flow.
    interact() {
        this.rotate();
        this.touched = true;
        this.puzzle.moveCount += 1;
        this.puzzle.calculateFlow();
    }

    // The piece is rotated, either as part of the setup, or by the player.
    rotate() {
        const originalRight = this.right;
        this.right = this.up;
        this.up = this.left;
        this.left = this.down;
        this.down = originalRight;
    }

    // Find the neighbour of this piece in the specified direction (this could be null if it's at the edge)
    findNeighbour(dir) {
        return this.puzzle.pieces.find(({ row, col }) => row == (this.row+dir.drow) && col == (this.col+dir.dcol));
    }

    // Count in how many directions this piece points.
    get countDirections() {
        let count = 0;
        if (this.left) count += 1;
        if (this.right) count += 1;
        if (this.up) count += 1;
        if (this.down) count += 1;
        return count;
    }

    // Returns true if the connectors are left & right only, or up and down only.
    get straight() {
        if (this.left && this.right && !this.up && !this.down) return true;
        if (!this.left && !this.right && this.up && this.down) return true;
        return false;
    }
}