let canvas = document.getElementById('canvas'),
    graphics; 

document.getElementById("startGame").addEventListener('click', function(event) {
    document.getElementById("welcome").classList.add('hidden');
    document.getElementById("congratulate").classList.remove('hidden');
    newPuzzle(5, 7);
}, false);

switchScreen('choose');
attachShapeClick();

function congratulate() {
    document.getElementById("completeMoveCount").innerText = graphics.puzzle.moveCount;
    document.getElementById("completeMinimumMoveCount").innerText = graphics.puzzle.minSolveCount;

    switchScreen('choose');
}

function newPuzzle(colCount, rowCount) { 
    switchScreen('game');
    let puzzle = new Puzzle(colCount, rowCount);
    graphics = new Graphics(canvas, puzzle);
    render(graphics);
}

function render() {
    const minSolveCount = graphics.puzzle.minSolveCount;
    const moveCount = graphics.puzzle.moveCount;
    const message = '' + moveCount + ' (minimum possible is ' + minSolveCount + ')';
    document.getElementById('moveCount').innerHTML = message;
    graphics.render();
}

function switchScreen(screenToShow) {
    document.getElementsByClassName("chooseScreen")[0].classList.add('hidden');
    document.getElementsByClassName("gameScreen")[0].classList.add('hidden');

    document.getElementsByClassName(screenToShow + "Screen")[0].classList.remove('hidden');
}

function attachShapeClick() {
    canvas.addEventListener('click', function (event) {
        let canvasLeft = canvas.offsetLeft + canvas.clientLeft,
            canvasTop = canvas.offsetTop + canvas.clientTop,
            x = event.pageX - canvasLeft,
            y = event.pageY - canvasTop;
    
        let shape = graphics.getShapeAtPoint(x, y);
    
        if (shape != null) {
            shape.piece.interact();
            render();
    
            if (graphics.puzzle.isFinished()) {
                setTimeout(congratulate, 500);
            }
        }
    }, false);
}