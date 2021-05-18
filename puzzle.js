function getRandomValue(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

class Direction {
    static left  = { dcol: -1, drow:  0};
    static right = { dcol:  1, drow:  0};
    static up    = { dcol:  0, drow: -1};
    static down  = { dcol:  0, drow:  1};

    static getRandomValidDirection(piece) {
        let possibles = [];

        if (Direction.isDirectionPossible(piece, Direction.left))  possibles.push(Direction.left);
        if (Direction.isDirectionPossible(piece, Direction.right)) possibles.push(Direction.right);
        if (Direction.isDirectionPossible(piece, Direction.up))    possibles.push(Direction.up);
        if (Direction.isDirectionPossible(piece, Direction.down))  possibles.push(Direction.down);

        if (possibles.length === 0) return null;

        const chosen = getRandomValue(0, possibles.length - 1);
        return possibles[chosen];
    }

    static isDirectionPossible(piece, dir) {
        const next = piece.findNeighbour(dir);
        if (next == undefined) return false;
        return !(next.left || next.right || next.up || next.down); 
    }

    static setPieceDirection(piece, dir) {
        if (dir == Direction.left) piece.left = true;
        if (dir == Direction.right) piece.right = true;
        if (dir == Direction.up) piece.up = true;
        if (dir == Direction.down) piece.down = true;
    }

    static setPieceOppositeDirection(piece, dir) {
        if (dir == Direction.left) piece.right = true;
        if (dir == Direction.right) piece.left = true;
        if (dir == Direction.up) piece.down = true;
        if (dir == Direction.down) piece.up = true;
    }
}

class Puzzle {
    pieces = [];
    flowStart;
    colCount;
    rowCount;
    constructor(colCount, rowCount) {
        this.colCount = colCount;
        this.rowCount = rowCount;

        this.makePuzzle();
        this.flowStart = { col: getRandomValue(0, 2), row: getRandomValue(0, 2) };
    }

    makePuzzle() {
        for (let col = 0; col < this.colCount; col++) {
            for (let row = 0; row < this.rowCount; row++) {
                this.pieces.push(new Piece(this, row, col, false, false, false, false));
            }
        }

        const position = { col: getRandomValue(0, this.colCount-1), row: getRandomValue(0, this.rowCount-1) };
        const piece = this.pieces.find(({ row, col }) => row == position.row && col == position.col);
        this.makeTracks(piece);
    }

    makeTracks(piece) {
        let dir = Direction.getRandomValidDirection(piece);
        while (dir !== null) {
            let neighbour = piece.findNeighbour(dir);
            Direction.setPieceDirection(piece, dir);
            Direction.setPieceOppositeDirection(neighbour, dir);
            this.makeTracks(neighbour);

            dir = Direction.getRandomValidDirection(piece);
        }
    }

    mixUp() {
        for (const piece of this.pieces) {
            for (let i = 0; i < getRandomValue(0, 2); i++) {
                piece.rotate();
            }
        }
    }

    calculateFlow() {
        for (const piece of this.pieces) piece.flow = false;
        let thisOne = this.pieces.find(({ row, col }) => row == this.flowStart.row && col == this.flowStart.col);
        this.#followFlow(thisOne);
    }

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

    interact() {
        this.rotate();
        this.touched = true;
    }

    rotate() {
        const originalRight = this.right;
        this.right = this.up;
        this.up = this.left;
        this.left = this.down;
        this.down = originalRight;
    }

    findNeighbour(dir) {
        return this.puzzle.pieces.find(({ row, col }) => row == (this.row+dir.drow) && col == (this.col+dir.dcol));
    }
}