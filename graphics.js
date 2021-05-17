class Graphics {
    #canvas;
    #context;
    #cellSize;
    constructor(canvas, rowCount, colCount) {
        this.#canvas = canvas;
        this.#context = canvas.getContext('2d');
        this.shapes = [];
        this.#cellSize = this.#getCellSize(rowCount, colCount);
    }

    addPieces(pieces) {
        for (const piece of pieces) {
            this.addPiece(piece);
        }
    }

    addPiece(piece) {
        this.shapes.push(new Shape(piece, this.#cellSize, this.#context));
    }

    render() {
        for (const shape of this.shapes) {
            shape.render();
        }
    }

    // Get the shape clicked (assumes rectangular shapes)
    getShapeAtPoint(x, y) {
        for (const shape of this.shapes) {
            if (y > shape.start.y && y < shape.end.y
                && x > shape.start.x && x < shape.end.x) {
                return shape;
            }
        }

        return null;
    }

    #getCellSize(rowCount, colCount) {
        var cellWidth = this.#canvas.width / colCount;
        var cellHeight = this.#canvas.height / rowCount;

        return Math.min(cellWidth, cellHeight);
    }
}

class Shape {
    #context;
    start;
    centre;
    end;
    width;
    height;
    piece;
    constructor(piece, cellSize, context) {
        var halfCellSize = cellSize / 2;

        this.#context = context;
        this.start = {x: piece.col * cellSize, y : piece.row * cellSize};
        this.centre = {x: this.start.x + halfCellSize, y : this.start.y + halfCellSize};
        this.end = {x: this.start.x + cellSize, y : this.start.y + cellSize};
        this.width = cellSize;
        this.height = cellSize;
        this.piece = piece;
    }

    render() {
        if (this.piece.touched) this.#context.fillStyle = '#05FFFF'; else this.#context.fillStyle = '#05EFFF';
        this.#context.fillRect(this.start.x, this.start.y, this.width, this.height);

        this.#context.strokeStyle = 'purple';
        this.#context.lineWidth = 7;
        this.#context.lineJoin = 'round';
        this.#context.lineCap = 'round';

        this.#context.beginPath();
            this.#context.moveTo(this.centre.x, this.centre.y);
            if (this.piece.left) this.#context.lineTo(this.start.x, this.centre.y);

            this.#context.moveTo(this.centre.x, this.centre.y);
            if (this.piece.up) this.#context.lineTo(this.centre.x, this.start.y);

            this.#context.moveTo(this.centre.x, this.centre.y);
            if (this.piece.right) this.#context.lineTo(this.end.x, this.centre.y);

            this.#context.moveTo(this.centre.x, this.centre.y);
            if (this.piece.down) this.#context.lineTo(this.centre.x, this.end.y);
        this.#context.stroke();
    }
}