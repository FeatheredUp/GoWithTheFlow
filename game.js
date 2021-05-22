let canvas = document.getElementById('canvas'),
    graphics,
    currentLevel; 

attachEvents();
showChooseScreen(null);

function congratulate() {
    document.getElementById("completeMoveCount").innerText = graphics.puzzle.moveCount;
    document.getElementById("completeMinimumMoveCount").innerText = graphics.puzzle.minSolveCount;

    saveLastLevel(currentLevel);
    showChooseScreen(currentLevel+1);
}

function newPuzzle(colCount, rowCount) { 
    currentLevel = parseInt(document.getElementById("levelSlider").value);
    document.getElementById("gameLevel").innerText = currentLevel;
    showGameScreen();
    let puzzle = new Puzzle(colCount, rowCount, currentLevel);
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

function showGameScreen() {
    document.getElementById("chooseScreen").classList.add('hidden');
    document.getElementById("gameScreen").classList.remove('hidden');
}

function showChooseScreen(level) {
    let maxLevel = getLastLevel() + 1;
    if (!level) level = maxLevel;
    document.getElementById("levelSlider").max = maxLevel;
    document.getElementById("levelSlider").value = level;
    document.getElementById("levelValue").innerText = level;

    document.getElementById("gameScreen").classList.add('hidden');
    document.getElementById("chooseScreen").classList.remove('hidden');
}

function getLastLevel() {
    if (!localStorage.getItem('level')) {
        localStorage.setItem('level', 0);
    }
    return parseInt(localStorage.getItem('level'));
}

function saveLastLevel(level) {
    const previousMax = getLastLevel();
    if (level > previousMax) localStorage.setItem('level', level);
}

function attachEvents() {
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
                congratulate();
            }
        }
    }, false);

    document.getElementById("startGame").addEventListener('click', function(event) {
        document.getElementById("welcome").classList.add('hidden');
        document.getElementById("congratulate").classList.remove('hidden');
        newPuzzle(5, 7);
    }, false);

    document.getElementById("levelSlider").addEventListener('input', function(event){
        document.getElementById("levelValue").innerText = this.value;
    }
    , false);
}