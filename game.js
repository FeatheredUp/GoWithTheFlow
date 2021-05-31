let canvas = document.getElementById('canvas'),
    graphics,
    currentShapeType,
    currentDifficulty,
    currentInvisibility,
    currentLevel; 

initialiseControls();
attachEvents();
updateChooseScreen();
showChooseScreen();

function startNewGame() {
    playSelectedLevel();

    // Store the options that are set in playSelectedLevel
    const colourSelect = document.getElementById("colourSelect").value;
    Storage.updateShapeType(currentShapeType);
    Storage.updateDifficulty(currentShapeType, currentDifficulty);
    Storage.updateInvisibility(currentShapeType, currentDifficulty, currentInvisibility);
    Storage.updateLevel(currentShapeType, currentDifficulty, currentInvisibility, currentLevel - 1);
    Storage.updateColourScheme(colourSelect);
}

function repeatGame() {
    const shapeType = Storage.getShapeType();
    const difficulty = Storage.getDifficulty(shapeType);
    const invisibility = Storage.getInvisibility(shapeType, difficulty);
    const level = Storage.getLevel(shapeType, difficulty, invisibility);
    document.getElementById("levelSlider").value = level;
    levelUpdated();
    playSelectedLevel();
}

function congratulate() {
    let stats = new LevelStatistics(currentShapeType, currentDifficulty, currentLevel, graphics.puzzle.minSolveCount, graphics.puzzle.moveCount);

    // Store the successful completion of this level
    Storage.updateLevel(currentShapeType, currentDifficulty, currentInvisibility, currentLevel);
    Storage.updateMaxLevel(currentShapeType, currentDifficulty, currentInvisibility, currentLevel);
    Storage.updateLevelRating(currentShapeType, currentDifficulty, currentInvisibility, currentLevel, stats.rating);
    Storage.updateLevelAttempts(currentShapeType, currentDifficulty, currentInvisibility, currentLevel);

    const attempts = Storage.getLevelAttempts(currentShapeType, currentDifficulty, currentInvisibility, currentLevel);
    let attemptText = "after " + attempts + " attempts";
    if (attempts == 1) attemptText = "after 1 attempt";

    document.getElementById("completeShapeType").innerText = stats.shapeType;
    document.getElementById("completeMoveCount").innerText = stats.moves;
    document.getElementById("completeMinimumMoveCount").innerText = stats.minimum;
    document.getElementById("completeRating").innerText = stats.ratingGrade;
    document.getElementById("completeDifficulty").innerText = mapDifficultyToWords(stats.difficulty);
    document.getElementById("completeLevel").innerText = stats.level;
    document.getElementById("completeAttempts").innerText = attemptText;
    document.getElementById("completeInvisibility").innerText = currentInvisibility ? " with invisibility" : "";
    showFinishScreen();
}

function showStatistics() {
    const shapeType = document.getElementById("shapeSelect").value;
    const difficulty = parseInt(document.getElementById("difficultySlider").value);
    const invisibility = document.getElementById("invisibilityCheck").checked;
    let maxLevel = Storage.getMaxLevel(shapeType, difficulty, invisibility);

    document.getElementById("statisticsShapeType").innerText = shapeType;
    document.getElementById("statisticsDifficulty").innerText = mapDifficultyToWords(difficulty);
    document.getElementById("statisticsInvisibility").innerText = currentInvisibility ? " with invisibility" : "";
    setVisibility("nostats", maxLevel == 0);
    setVisibility("stats", maxLevel != 0);

    const statsTableBody = document.getElementById("statsTableBody");
    statsTableBody.innerHTML = '';
    for (let level=1; level<=maxLevel; level++) {
        const rating = LevelStatistics.mapRatingToGrade(Storage.getLevelRating(shapeType, difficulty, currentInvisibility, level));
        const attempts = Storage.getLevelAttempts(shapeType, difficulty, currentInvisibility, level);

        let row = createStatsTableRow(level, rating, attempts);
        statsTableBody.appendChild(row);
    }

    showStatisticsScreen();
}

function createStatsTableRow(level, grade, attempts) {
    let row = document.createElement('tr');
    row.appendChild(createStatsTableCell(level));
    row.appendChild(createStatsTableCell(grade));
    row.appendChild(createStatsTableCell(attempts));
    return row;
}

function createStatsTableCell(value) {
    let cell = document.createElement('td');
    cell.innerText = value;
    return cell;
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
    currentInvisibility = document.getElementById("invisibilityCheck").checked;
    const colourScheme = document.getElementById('colourSelect').value;

    document.getElementById("gameLevel").innerText = currentLevel;
    document.getElementById("gameDifficulty").innerText = mapDifficultyToWords(currentDifficulty);
    document.getElementById("gameInvisibility").innerText = currentInvisibility ? " with invisibility" : "";

    let puzzle = (currentShapeType == 'square') ?  new Puzzle(currentDifficulty, currentLevel, currentInvisibility): new TrianglePuzzle(currentDifficulty, currentLevel, currentInvisibility);
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
    setSectionVisibility("finishScreen", false);
    setSectionVisibility("chooseScreen", false);
    setSectionVisibility("statisticsScreen", false);
    setSectionVisibility("gameScreen", true);
}

function showStatisticsScreen() {
    setSectionVisibility("finishScreen", false);
    setSectionVisibility("chooseScreen", false);
    setSectionVisibility("gameScreen", false);
    setSectionVisibility("statisticsScreen", true);
}

function showChooseScreen() {
    setSectionVisibility("gameScreen", false);
    setSectionVisibility("finishScreen", false);
    setSectionVisibility("statisticsScreen", false);
    setSectionVisibility("chooseScreen", true);
}

function showFinishScreen() {
    updateChooseScreen();

    setSectionVisibility("gameScreen", false);
    setSectionVisibility("chooseScreen", false);
    setSectionVisibility("statisticsScreen", false);
    setSectionVisibility("finishScreen", true);
}

/* Respond to selection of shape, difficulty and level */

function shapeTypeUpdated() {
    const shapeType = document.getElementById("shapeSelect").value;
    let difficulty = Storage.getDifficulty(shapeType);
    document.getElementById('difficultySlider').value = difficulty;
    difficultySliderUpdated();
}

function difficultySliderUpdated() {
    const difficulty = parseInt(document.getElementById("difficultySlider").value);
    document.getElementById("difficultyValue").innerText = mapDifficultyToWords(difficulty);

    const shapeType = document.getElementById("shapeSelect").value;
    const invisibility = Storage.getInvisibility(shapeType, difficulty);
    document.getElementById("invisibilityCheck").checked = invisibility;

    invisibilityUpdated();
}

function invisibilityUpdated() {
    // display the levels for these options
    const shapeType = document.getElementById("shapeSelect").value;
    const difficulty = parseInt(document.getElementById("difficultySlider").value);
    const invisibility = document.getElementById("invisibilityCheck").checked;

    let maxLevel = Storage.getMaxLevel(shapeType, difficulty, invisibility) + 1;
    let level = Storage.getLevel(shapeType, difficulty, invisibility) + 1;

    setVisibility("levelContainer", maxLevel > 1);
    document.getElementById("levelSlider").max = maxLevel;
    document.getElementById("levelSlider").value = level;

    document.getElementById("showStatisticsButton").innerText = "Statistics for " + shapeType + " " + mapDifficultyToWords(difficulty) + (invisibility ? " with invisibility" : "");

    levelUpdated();
}

function levelUpdated() {
    const level = document.getElementById("levelSlider").value;
    document.getElementById("levelValue").innerText = level;
}

function mapDifficultyToWords(difficulty) {
    switch (difficulty) {
        case 1:
            return 'trivial'; 
        case 2:
            return 'easy';
        case 3:
            return 'medium';
        case 4:
            return 'hard';
        case 5:
            return 'challenging';
    }
}

function setVisibility(ctrl, show) {
    if (show) {
        document.getElementById(ctrl).classList.remove('hidden');
    } else {
        document.getElementById(ctrl).classList.add('hidden');
    }
}

function setSectionVisibility(section, show) {
    if (show) {
        document.getElementById(section).classList.remove('hidden');
        document.getElementById(section).classList.add('flex');
    } else {
        document.getElementById(section).classList.remove('flex');
        document.getElementById(section).classList.add('hidden');
    }
}

/* initialise drop downs */ 

function initialiseControls() {
    const selectedColourScheme = Storage.getColourScheme();
    const colourSelect = document.getElementById("colourSelect");
     let options = new Options('default');
    const colours = options.allSchemes;
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

    document.getElementById("returnFromStatisticsButton").addEventListener('click', function(event) {
        showChooseScreen();
    }, false);

    document.getElementById("showStatisticsButton").addEventListener('click', function(event) {
        showStatistics();
    }, false);

    document.getElementById("invisibilityCheck").addEventListener("change", function(event) {
        invisibilityUpdated();
    }, false);
}