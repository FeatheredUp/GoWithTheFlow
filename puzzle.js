class Puzzle {
    pieces = [];
    flowStart;
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

        this.flowStart = {col: this.#getRandomValue(0,2), row: this.#getRandomValue(0,2)};
    }

    mixUp() {
        for (const piece of this.pieces) {
            for (let i=0; i < this.#getRandomValue(0,2); i++) {
                piece.rotate();
            }
        }
    }

    calculateFlow() {
        for (const piece of this.pieces) piece.flow = false;
        let thisOne = this.pieces.find(({row, col}) => row==this.flowStart.row   && col==this.flowStart.col);
        this.#followTrail(thisOne);
    }

    #followTrail(piece) {
        if (piece.flow) return;
        piece.flow = true;
        
        if (piece.left)  {
            let next = this.pieces.find(({row, col}) => row==piece.row && col==piece.col-1);
            if (next && next.right) this.#followTrail(next);
        }
        if (piece.up)    {
            let next = this.pieces.find(({row, col}) => row==piece.row-1 && col==piece.col);
            if (next && next.down) this.#followTrail(next);
        }
        if (piece.right) {
            let next = this.pieces.find(({row, col}) => row==piece.row && col==piece.col+1);
            if (next && next.left) this.#followTrail(next);
        }
        if (piece.down)  {
            let next = this.pieces.find(({row, col}) => row==piece.row+1 && col==piece.col);
            if (next && next.up) this.#followTrail(next);
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
    flow;
    touched;
    constructor(row, col, left, up, right, down) {
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
}