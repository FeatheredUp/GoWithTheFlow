let canvas = document.getElementById('canvas'),
    graphics,
    currentShapeType,
    currentDifficulty,
    currentLevel; 

initialiseControls();
attachEvents();
showChooseScreen();

function congratulate() {
    document.getElementById("completeMoveCount").innerText = graphics.puzzle.moveCount;
    document.getElementById("completeMinimumMoveCount").innerText = graphics.puzzle.minSolveCount;

    Storage.updateLevel(currentShapeType, currentDifficulty, currentLevel);
    Storage.updateMaxLevel(currentShapeType, currentDifficulty, currentLevel);
    showChooseScreen();
}

function newPuzzle() { 
    currentShapeType = document.getElementById("shapeSelect").value;
    currentDifficulty = parseInt(document.getElementById("difficultySlider").value)
    currentLevel = parseInt(document.getElementById("levelSlider").value);
    const colourScheme = document.getElementById('colourSelect').value;

    document.getElementById("gameLevel").innerText = currentLevel;

    let puzzle = (currentShapeType == 'square') ?  new Puzzle(currentDifficulty, currentLevel): new TrianglePuzzle(currentDifficulty, currentLevel);
    graphics = new Graphics(canvas, puzzle, colourScheme, currentShapeType);
    render(graphics);
    showGameScreen();
}

function undoLastMove() {
    graphics.undo();
    render(graphics);
}

function render() {
    const minSolveCount = graphics.puzzle.minSolveCount;
    const moveCount = graphics.puzzle.moveCount;
    document.getElementById('moveCount').innerHTML = moveCount;
    document.getElementById('minMoveCount').innerHTML = minSolveCount;
}

function showGameScreen() {
    document.getElementById("chooseScreen").classList.add('hidden');
    document.getElementById("gameScreen").classList.remove('hidden');
}

function showChooseScreen() {
    const shapeType = Storage.getShapeType();
    const difficulty = Storage.getDifficulty(shapeType);
    const maxLevel = Storage.getMaxLevel(shapeType, difficulty) + 1;
    const level = Storage.getLevel(shapeType, difficulty) + 1;

    document.getElementById("shapeSelect").value = shapeType;
    document.getElementById("difficultySlider").value = difficulty;
    document.getElementById("difficultyValue").innerText = mapDifficultyToWords(difficulty);
    document.getElementById("levelSlider").max = maxLevel;
    document.getElementById("levelSlider").value = level;
    document.getElementById("levelValue").innerText = level;

    document.getElementById("gameScreen").classList.add('hidden');
    document.getElementById("chooseScreen").classList.remove('hidden');
}

function shapeTypeUpdated() {
    const shapeType = document.getElementById("shapeSelect").value;
    let difficulty = Storage.getDifficulty(shapeType);
    document.getElementById('difficultySlider').value = difficulty;
    difficultySliderUpdated();
}

function difficultySliderUpdated() {
    const difficulty = document.getElementById("difficultySlider").value;
    document.getElementById("difficultyValue").innerText = mapDifficultyToWords(parseInt(difficulty));

    // display the levels for this updated difficulty
    const shapeType = document.getElementById("shapeSelect").value;
    let maxLevel = Storage.getMaxLevel(shapeType, difficulty) + 1;
    let level = Storage.getLevel(shapeType, difficulty) + 1;

    document.getElementById("levelSlider").max = maxLevel;
    document.getElementById("levelSlider").value = level;
    levelUpdated();
}

function levelUpdated() {
    const level = document.getElementById("levelSlider").value;
    document.getElementById("levelValue").innerText = level;
}

function mapDifficultyToWords(difficulty) {
    switch (difficulty) {
        case 1:
            return 'Trivial'; 
        case 2:
            return 'Easy';
        case 3:
            return 'Medium';
        case 4:
            return 'Hard';
        case 5:
            return 'Challenging';
    }
}

function initialiseControls() {
    const selectedColourScheme = Storage.getColourScheme();
    const colourSelect = document.getElementById("colourSelect");
    const colours = ColourScheme.allSchemes;
    for (const colour of colours) {
        addOption(colourSelect, colour.name, colour.name == selectedColourScheme);
    }
}

function addOption(select, itemText, selected) {
    const opt = document.createElement('option');
    opt.text = itemText;
    opt.selected = selected;
    select.add(opt);
}

function startNewGame() {
    document.getElementById("welcome").classList.add('hidden');
    document.getElementById("congratulate").classList.remove('hidden');
    newPuzzle();

    const colourSelect = document.getElementById("colourSelect").value;
    Storage.updateShapeType(currentShapeType);
    Storage.updateDifficulty(currentShapeType, currentDifficulty);
    Storage.updateLevel(currentShapeType, currentDifficulty, currentLevel - 1);
    Storage.updateColourScheme(colourSelect);
}

function attachEvents() {
    canvas.addEventListener('click', function (event) {
        let hit = graphics.clickAtPoint(event.pageX, event.pageY);

        if (hit) {
            render();
            if (graphics.puzzle.isFinished()) {
                congratulate();
            }
        }
    }, false);

    document.getElementById("startButton").addEventListener('click', function(event) {
        startNewGame();
    }, false);

    document.getElementById("undoButton").addEventListener('click', function(event) {
        undoLastMove();
    }, false);

    document.getElementById("restartButton").addEventListener('click', function(event) {
        newPuzzle();
    }, false);

    document.getElementById("backButton").addEventListener('click', function(event) {
        showChooseScreen();
    }, false);

    document.getElementById("levelSlider").addEventListener('input', function(event){
        document.getElementById("levelValue").innerText = this.value;
    }, false);

    document.getElementById("difficultySlider").addEventListener('input', function(event){
        difficultySliderUpdated();
    }, false);

    document.getElementById("shapeSelect").addEventListener('input', function(event){
        shapeTypeUpdated();
    }, false);
}