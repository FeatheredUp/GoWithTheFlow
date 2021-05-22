// Represents the graphics of the puzzle
class Graphics {
    shapes;
    puzzle;
    #canvas;
    #context;
    #cellSize;
    #leftMargin = 10;
    #topMargin = 10;
    #rightMargin = 10;
    #bottomMargin = 10;
    #backColour = '#05EFFF';
    #effectiveWidth;
    #effectiveHeight;
    constructor(canvas, puzzle) {
        this.#canvas = canvas;
        this.#context = canvas.getContext('2d');
        this.shapes = [];
        this.puzzle = puzzle;

        this.#cellSize = this.#getCellSize(puzzle.colCount, puzzle.rowCount);

        this.#effectiveWidth = (this.#cellSize * puzzle.colCount) + this.#leftMargin + this.#rightMargin;
        this.#effectiveHeight = (this.#cellSize * puzzle.rowCount) + this.#topMargin + this.#bottomMargin;

        this.#addPieces(puzzle.pieces);
    }

    // Add the puzzle pieces
    #addPieces(pieces) {
        for (const piece of pieces) {
            this.#addPiece(piece);
        }
    }

    // Add a single puzzle piece
    #addPiece(piece) {
        const flowStart = this.puzzle.flowStart.row === piece.row && this.puzzle.flowStart.col === piece.col;
        this.shapes.push(new Shape(piece, this.#cellSize, this.#leftMargin, this.#topMargin, this.#context, flowStart));
    }

    // Render the puzzle area
    render() {
        this.#context.fillStyle = this.#backColour;
        this.#context.fillRect(0, 0, this.#effectiveWidth, this.#effectiveHeight);
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

    // Calculate the cell size
    #getCellSize(colCount, rowCount) {
        const cellWidth = (this.#canvas.width - this.#leftMargin - this.#rightMargin) / colCount;
        const cellHeight = (this.#canvas.height - this.#topMargin - this.#bottomMargin) / rowCount;

        return Math.min(cellWidth, cellHeight);
    }
}

// Represents a single shape on the grid
class Shape {
    #context;
    start;
    centre;
    end;
    width;
    height;
    piece;
    #flowStart;
    constructor(piece, cellSize, xOffset, yOffset, context, flowStart) {
        const halfCellSize = cellSize / 2;

        this.#context = context;
        this.start = {x: xOffset + (piece.col * cellSize), y : yOffset + (piece.row * cellSize)};
        this.centre = {x: this.start.x + halfCellSize, y : this.start.y + halfCellSize};
        this.end = {x: this.start.x + cellSize, y : this.start.y + cellSize};
        this.width = cellSize;
        this.height = cellSize;
        this.piece = piece;
        this.#flowStart = flowStart;
    }

    // Render this shape
    render() {
        // Background
        this.#context.fillStyle = this.piece.touched ? '#05FFFF' : '#05EFFF';
        this.#context.fillRect(this.start.x, this.start.y, this.width, this.height);

        // The connectors
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

        // The central 'end' if there's only one way out.
        if (this.piece.countDirections == 1) {
            this.#context.fillStyle = this.piece.flow ? '#FF0000' : '#FF00FF';
            this.#context.beginPath();
            this.#context.arc(this.centre.x, this.centre.y, 10, 0, 2 * Math.PI);
            this.#context.fill();
        }

        if (this.#flowStart) {
            this.#context.fillStyle = '#FFFFFF';
            this.#context.beginPath();
            this.#context.arc(this.centre.x, this.centre.y, 5, 0, 2 * Math.PI);
            this.#context.fill();
        }
    }
}