class Graphics {
    shapes;
    #canvas;
    #context;
    #cellSize;
    constructor(canvas, colCount, rowCount) {
        this.#canvas = canvas;
        this.#context = canvas.getContext('2d');
        this.shapes = [];
        this.#cellSize = this.#getCellSize(colCount, rowCount);
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

    #getCellSize(colCount, rowCount) {
        const cellWidth = this.#canvas.width / colCount;
        const cellHeight = this.#canvas.height / rowCount;

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
        const halfCellSize = cellSize / 2;

        this.#context = context;
        this.start = {x: piece.col * cellSize, y : piece.row * cellSize};
        this.centre = {x: this.start.x + halfCellSize, y : this.start.y + halfCellSize};
        this.end = {x: this.start.x + cellSize, y : this.start.y + cellSize};
        this.width = cellSize;
        this.height = cellSize;
        this.piece = piece;
    }

    render() {
        this.#context.fillStyle = this.piece.touched ? '#05FFFF' : '#05EFFF';
        this.#context.fillRect(this.start.x, this.start.y, this.width, this.height);

        this.#context.strokeStyle = this.piece.flow ? '#FF0000' : '#FF00FF';
        this.#context.lineWidth = 12;
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