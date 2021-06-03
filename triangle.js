class TriangleDirection {
    left  = { dcol: -1, drow:  0};
    right = { dcol:  1, drow:  0};
    up    = { dcol:  0, drow: -1};
    down  = { dcol:  0, drow:  1};

    // randomly choose a direction from 'piece' to another piece that hasn't been visited.
    getRandomValidDirection(piece) {
        let possibles = [];

        if (this.isDirectionPossible(piece, this.left))  possibles.push(this.left);
        if (this.isDirectionPossible(piece, this.right)) possibles.push(this.right);
        if (this.isDirectionPossible(piece, this.up))    possibles.push(this.up);
        if (this.isDirectionPossible(piece, this.down))  possibles.push(this.down);

        if (possibles.length === 0) return null;

        const chosen = getRandomValue(0, possibles.length - 1);
        return possibles[chosen];
    }

    // set 'piece' to have access on the specified side
    setPieceDirection(piece, dir) {
        if (dir == this.left) piece.left = true;
        if (dir == this.right) piece.right = true;
        if (dir == this.up) piece.up = true;
        if (dir == this.down) piece.down = true;
    }

    // set 'piece' to have access on the _oppositie_ side.
    setPieceOppositeDirection(piece, dir) {
        if (dir == this.left) piece.right = true;
        if (dir == this.right) piece.left = true;
        if (dir == this.up) piece.down = true;
        if (dir == this.down) piece.up = true;
    }

    // is the direction possible
    isDirectionPossible(piece, dir) {
        if (piece.pointUp && dir == this.up) return false;
        if (!piece.pointUp && dir == this.down) return false;
        const next = piece.findNeighbour(dir);
        if (next == undefined) return false;
        return !(next.left || next.right || next.up || next.down); 
    }
}

class TrianglePuzzle {
    pieces = [];
    flowStart;
    invisibilityCount;
    colCount;
    rowCount;
    minSolveCount = 0;
    moveCount;
    history = [];
    direction = new TriangleDirection();

    constructor(difficulty, puzzleNumber, invisibility) {
        this.addRandomSeed(puzzleNumber, invisibility);

        const size = this.getSizeFromDifficulty(difficulty);
        this.colCount = size.colCount;
        this.rowCount = size.rowCount;
        this.moveCount = 0;
        const invisibilityPercent = invisibility ? 5 : 0;
        this.invisibilityCount = Math.ceil(invisibilityPercent * this.colCount * this.rowCount / 100);

        this.makePuzzle();
        this.flowStart = this.getRandomVisiblePiece();
        this.mixUp();
        this.calculateFlow();
    }

    addRandomSeed(puzzleNumber, invisibility) {
        if (invisibility) {
            Math.seedrandom(puzzleNumber +  'I');
        } else {
            Math.seedrandom(puzzleNumber);
        }
    }

    // Get the size based on the difficulty level, with some randomness.
    getSizeFromDifficulty(difficulty) {
        switch (difficulty) {
            case 1:
                return { colCount: 3, rowCount: 3 }; 
            case 2:
                return { colCount: getRandomValue(4, 6), rowCount: getRandomValue(4, 6) };
            case 3:
                return { colCount: getRandomValue(5, 7), rowCount: getRandomValue(7, 9) };
            case 4:
                return { colCount: getRandomValue(8, 9), rowCount: getRandomValue(10, 11) };
            case 5:
                return { colCount: getRandomValue(10, 11), rowCount: getRandomValue(12, 13) };
        }
    }

    // Returns true if the flow has reached all pieces.
    isFinished() {
        for (const piece of this.pieces) {
            if (!piece.flow) return false;
        }
        return true;
    }

    // Creates the basic structure of the track.
    makePuzzle() {
        for (let col = 0; col < this.colCount; col++) {
            for (let row = 0; row < this.rowCount; row++) {
                // point up if row and col are both even, or both are odd.
                const pointUp =  col % 2 == row % 2;
                this.pieces.push(new TrianglePiece(this, row, col, false, false, false, false, pointUp));
            }
        }

        const startingPiece = this.getRandomPiece();
        this.makeTracks(startingPiece);
        this.addInvisibility();
    }

    // Recursively called - creates a track from the current track to any
    // unoccupied squares, and backtracks if necessary, until all squares are filled.
    makeTracks(piece) {
        let dir = this.direction.getRandomValidDirection(piece);
        while (dir !== null) {
            let neighbour = piece.findNeighbour(dir);
            this.direction.setPieceDirection(piece, dir);
            this.direction.setPieceOppositeDirection(neighbour, dir);
            this.makeTracks(neighbour);

            dir = this.direction.getRandomValidDirection(piece);
        }
    }

    addInvisibility() {
        let count = 0;
        while (count < this.invisibilityCount) {
            const piece = this.getRandomPiece();
            if (piece.invisible) continue;
            piece.invisible = true;
            count += 1;
        }
    }

    getRandomPiece() {
        const position = { col: getRandomValue(0, this.colCount-1), row: getRandomValue(0, this.rowCount-1) };
        return this.pieces.find(({ row, col }) => row == position.row && col == position.col);
    }

    getRandomVisiblePiece() {
        let piece = null;
        do {
            piece = this.getRandomPiece();
        } while (piece.invisible);
        return piece;
    }

    // Turns each piece around randomly between 0 and 2 times.
    mixUp() {
        let count = 0;
        for (const piece of this.pieces) {
            const rotations = getRandomValue(0, 2);
            count+= this.getUndoCount(piece, rotations);
            for (let i = 0; i < rotations; i++) {
                piece.rotate();
            }
        }
        this.minSolveCount = count;
    }

    // Get the number of rotations needed to turn this piece back to the correct orientation.
    getUndoCount(piece, rotations) {
        if (rotations === 0) return 0;
        if (piece.countDirections == 3) return 0;
        let count = 3 - rotations;
        return count;
    }

    // Works out which pieces have flow going through them
    calculateFlow() {
        for (const piece of this.pieces) piece.flow = false;
        let thisOne = this.pieces.find(({ row, col }) => row == this.flowStart.row && col == this.flowStart.col);
        this.followFlow(thisOne);
    }

    // Called recursively - marks and follows the flow in each direction.
    followFlow(piece) {
        // If flow is already set, there's nothing more to do
        if (piece.flow) return;
        piece.flow = true;

        if (piece.left) {
            let next = piece.findNeighbour(this.direction.left);
            if (next && next.right) this.followFlow(next);
        }
        if (piece.up) {
            let next = piece.findNeighbour(this.direction.up);
            if (next && next.down) this.followFlow(next);
        }
        if (piece.right) {
            let next = piece.findNeighbour(this.direction.right);
            if (next && next.left) this.followFlow(next);
        }
        if (piece.down) {
            let next = piece.findNeighbour(this.direction.down);
            if (next && next.up) this.followFlow(next);
        }
    }

    // add a move to the history
    addHistory(piece) {
        this.history.push({ row : piece.row, col : piece.col});
    }

    // undo the last move
    undo() {
        const lastMove = this.history.pop();
        if (!lastMove) return;
        const piece = this.pieces.find(({ row, col }) => row == lastMove.row && col == lastMove.col);
        if (!piece) return;
        piece.undo();
    }
}

// Represents a single piece of the puzzle.
class TrianglePiece {
    puzzle;
    row;
    col;
    left;
    up;
    right;
    down;
    pointUp;
    flow;
    touchCount;
    invisible;

    constructor(puzzle, row, col, left, up, right, down, pointUp) {
        this.puzzle = puzzle;
        this.row = row;
        this.col = col;
        this.left = left;
        this.up = up;
        this.right = right;
        this.down = down;
        this.pointUp = pointUp;

        this.flow = false;
        this.touchCount = 0;
        this.invisible = false;
    }

    // The piece has been 'clicked on' by the player, so rotate it,  mark it as touched, and update the flow.
    interact() {
        this.rotate();
        this.touchCount += 1;
        this.puzzle.moveCount += 1;
        this.puzzle.calculateFlow();
        this.puzzle.addHistory(this);
    }

    // undo the move on this piece
    undo() {
        this.unrotate();
        this.touchCount -= 1;
        this.puzzle.moveCount -= 1;
        this.puzzle.calculateFlow();
    }

    // The piece is rotated clockwise, either as part of the setup, or by the player.
    rotate() {
        if (this.pointUp) {
            const originalLeft = this.left;
            this.left = this.down;
            this.down = this.right;
            this.right = originalLeft;
        } else {
            const originalLeft = this.left;
            this.left = this.right;
            this.right = this.up;
            this.up = originalLeft;
        }
    }

    // The piece is rotated anti-clockwise, as part of an undo.
    unrotate() {
        if (this.pointUp) {
            const originalLeft = this.left;
            this.left = this.right;
            this.right = this.down;
            this.down = originalLeft;
        } else {
            const originalLeft = this.left;
            this.left = this.up;
            this.up = this.right;
            this.right = originalLeft;
        }
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

    // Returns true if the piece has been touched
    get touched() {
        return (this.touchCount > 0);
    }
}