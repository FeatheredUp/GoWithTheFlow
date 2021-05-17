class Puzzle {
    pieces = [];
    constructor() {
        this.pieces.push(new Piece(0, 0, false, false, true,  true));       
        this.pieces.push(new Piece(0, 1, true,  false, false, true));
        this.pieces.push(new Piece(0, 2, false, false, false, true));
        this.pieces.push(new Piece(1, 0, false, true,  false, true));
        this.pieces.push(new Piece(1, 1, false, true,  false, false));
        this.pieces.push(new Piece(1, 2, false, true,  false, true));
        this.pieces.push(new Piece(2, 0, false, true,  true,  false));
        this.pieces.push(new Piece(2, 1, true,  false, true,  false));
        this.pieces.push(new Piece(2, 2, true,  true,  false, false));
    }

    mixUp() {
        for (const thing of this.pieces) {
            for (var i=0; i < this.#getRandomValue(0,3); i++) {
                thing.rotate();
            }
        }
    }

    #getRandomValue(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}

class Piece {
    row;
    col;
    left;
    up;
    right;
    down;
    constructor(row, col, left, up, right, down) {
        this.row = row;
        this.col = col;
        this.left = left;
        this.up = up;
        this.right = right;
        this.down = down;
        this.touched = false;
    }

    interact() {
        this.rotate();
        this.touched = true;
    }

    rotate() {
        var originalRight = this.right;
        this.right = this.up;
        this.up = this.left;
        this.left = this.down;
        this.down = originalRight;
    }
}