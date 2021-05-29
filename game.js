let canvas = document.getElementById('canvas'),
    graphics,
    currentShapeType,
    currentDifficulty,
    currentLevel; 

initialiseControls();
attachEvents();
showChooseScreen();

function startNewGame() {
    playSelectedLevel();

    // Store the options that are set in playSelectedLevel
    const colourSelect = document.getElementById("colourSelect").value;
    Storage.updateShapeType(currentShapeType);
    Storage.updateDifficulty(currentShapeType, currentDifficulty);
    Storage.updateLevel(currentShapeType, currentDifficulty, currentLevel - 1);
    Storage.updateColourScheme(colourSelect);
}

function repeatGame() {
    const shapeType = Storage.getShapeType();
    const difficulty = Storage.getDifficulty(shapeType);
    const level = Storage.getLevel(shapeType, difficulty);
    document.getElementById("levelSlider").value = level;
    levelUpdated();
    playSelectedLevel();
}

function congratulate() {
    let stats = new LevelStatistics(currentShapeType, currentDifficulty, currentLevel, graphics.puzzle.minSolveCount, graphics.puzzle.moveCount);

    document.getElementById("completeShapeType").innerText = stats.shapeType;
    document.getElementById("completeMoveCount").innerText = stats.moves;
    document.getElementById("completeMinimumMoveCount").innerText = stats.minimum;
    document.getElementById("completeStarRating").innerText = stats.stars;
    document.getElementById("completeDifficulty").innerText = mapDifficultyToWords(stats.difficulty);
    document.getElementById("completeLevel").innerText = stats.level;

    // Store the successful completion of this level
    Storage.updateLevel(currentShapeType, currentDifficulty, currentLevel);
    Storage.updateMaxLevel(currentShapeType, currentDifficulty, currentLevel);
    showFinishScreen();
}

function clickCanvas(x, y){
    let hit = graphics.clickAtPoint(x, y);

    if (hit) {
        render();
        if (graphics.puzzle.isFinished()) {
            congratulate();
        }
    }
}

function playSelectedLevel() { 
    currentShapeType = document.getElementById("shapeSelect").value;
    currentDifficulty = parseInt(document.getElementById("difficultySlider").value)
    currentLevel = parseInt(document.getElementById("levelSlider").value);
    const colourScheme = document.getElementById('colourSelect').value;

    document.getElementById("gameLevel").innerText = currentLevel;
    document.getElementById("gameDifficulty").innerText = mapDifficultyToWords(currentDifficulty);

    let puzzle = (currentShapeType == 'square') ?  new Puzzle(currentDifficulty, currentLevel): new TrianglePuzzle(currentDifficulty, currentLevel);
    graphics = new Graphics(canvas, puzzle, colourScheme, currentShapeType);
    render(graphics);
    showGameScreen();
}

function updateChooseScreen() {
    const shapeType = Storage.getShapeType();
    document.getElementById("shapeSelect").value = shapeType;
    shapeTypeUpdated()
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

/* Show the selected screen and hide the others */

function showGameScreen() {
    document.getElementById("finishScreen").classList.add('hidden');
    document.getElementById("chooseScreen").classList.add('hidden');
    document.getElementById("gameScreen").classList.remove('hidden');
}

function showChooseScreen() {
    updateChooseScreen();

    document.getElementById("gameScreen").classList.add('hidden');
    document.getElementById("finishScreen").classList.add('hidden');
    document.getElementById("chooseScreen").classList.remove('hidden');
}

function showFinishScreen() {
    updateChooseScreen();

    document.getElementById("gameScreen").classList.add('hidden');
    document.getElementById("chooseScreen").classList.add('hidden');
    document.getElementById("finishScreen").classList.remove('hidden');
}

/* Respond to selection of shape, difficulty and level */

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

    setVisibility(document.getElementById("levelContainer"), maxLevel > 1);
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

function setVisibility(ctrl, show) {
    if (show) {
        ctrl.classList.remove('hidden');
    } else {
        ctrl.classList.add('hidden');
    }
}

/* initialise drop downs */ 

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

/* Attach events to appropriate functions */

function attachEvents() {
    canvas.addEventListener('click', function (event) {
        clickCanvas(event.pageX, event.pageY);
    }, false);

    document.getElementById("startButton").addEventListener('click', function(event) {
        startNewGame();
    }, false);

    document.getElementById("undoButton").addEventListener('click', function(event) {
        undoLastMove();
    }, false);

    document.getElementById("restartButton").addEventListener('click', function(event) {
        playSelectedLevel();
    }, false);

    document.getElementById("backButton").addEventListener('click', function(event) {
        showChooseScreen();
    }, false);

    document.getElementById("repeatButton").addEventListener('click', function(event) {
        repeatGame();
    }, false);

    document.getElementById("nextLevelButton").addEventListener('click', function(event) {
        startNewGame();
    }, false);

    document.getElementById("returnToChooseButton").addEventListener('click', function(event) {
        showChooseScreen();
    }, false);

    document.getElementById("levelSlider").addEventListener('input', function(event){
        levelUpdated();
    }, false);

    document.getElementById("difficultySlider").addEventListener('input', function(event){
        difficultySliderUpdated();
    }, false);

    document.getElementById("shapeSelect").addEventListener('input', function(event){
        shapeTypeUpdated();
    }, false);
}