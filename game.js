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

function restartLevel() {
    if (confirm('Are you sure you want to restart this level?')) playSelectedLevel();
}

function repeatGame() {
    const shapeType = Storage.getShapeType();
    const difficulty = Storage.getDifficulty(shapeType);
    const invisibility = Storage.getInvisibility(shapeType, difficulty);
    const level = Storage.getLevel(shapeType, difficulty, invisibility);
    replayLevel(level);
}

function replayLevel(level) {
    document.getElementById("levelSlider").value = level;
    levelUpdated();
    startNewGame();
}

function congratulate() {
    // Store the successful completion of this level
    Storage.updateLevel(currentShapeType, currentDifficulty, currentInvisibility, currentLevel);
    Storage.updateMaxLevel(currentShapeType, currentDifficulty, currentInvisibility, currentLevel);

    const identifier = new LevelIdentifier(currentShapeType, currentDifficulty, currentInvisibility, currentLevel);
    let attemptInfo = new AttemptInformation(graphics.puzzle.minSolveCount, graphics.puzzle.moveCount, 10000)
    Storage.logAttempt(identifier, attemptInfo);
    attemptInfo = Storage.getAttemptInfo(identifier);
    
    let attemptText = "after " + attemptInfo.attemptCount + " attempts";
    if (attemptInfo.attemptCount == 1) attemptText = "after 1 attempt";

    document.getElementById("completeShapeType").innerText = currentShapeType;
    document.getElementById("completeMoveCount").innerText = attemptInfo.actualCount;
    document.getElementById("completeMinimumMoveCount").innerText = attemptInfo.targetCount;
    document.getElementById("completeRating").innerText = attemptInfo.ratingGrade;
    document.getElementById("completeDifficulty").innerText = mapDifficultyToWords(currentDifficulty);
    document.getElementById("completeLevel").innerText = currentLevel;
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
    document.getElementById("statisticsInvisibility").innerText = invisibility ? " with invisibility" : "";

    const statsTableBody = document.getElementById("statsTableBody");
    statsTableBody.innerHTML = '';

    let sumTarget = 0;
    let sumActual = 0;
    let sumAttempts = 0;
    for (let level=1; level<=maxLevel; level++) {
        const identifier = new LevelIdentifier(shapeType, difficulty, invisibility, level);
        const attemptInfo = Storage.getAttemptInfo(identifier);

        let row = createStatsTableRow(level, attemptInfo.targetCount, attemptInfo.actualCount, attemptInfo.ratingGrade, attemptInfo.attemptCount, 'Replay', "");
        statsTableBody.appendChild(row);

        // gather data
        sumTarget += attemptInfo.targetCount > 0 ? attemptInfo.targetCount : 0;
        sumActual += attemptInfo.actualCount > 0 ? attemptInfo.actualCount : 0;
        sumAttempts += attemptInfo.attemptCount > 0 ? attemptInfo.attemptCount : 0;
    }

    let newLevelRow = createStatsTableRow(maxLevel+1, '', '', '', '', 'Play', "actionButton");
    statsTableBody.appendChild(newLevelRow);

    // Add a row to the top of the table to summarise all data
    const summaryInfo = new AttemptInformation(sumTarget, sumActual, 0, '', sumAttempts);
    const summaryRow = createStatsTableRow('Overall Summary', sumTarget, sumActual, summaryInfo.ratingGrade, sumAttempts, '', '');
    statsTableBody.insertBefore(summaryRow, statsTableBody.firstChild);

    showStatisticsScreen();
}

function createStatsTableRow(level, target, actual, grade, attempts, playText, buttonClass) {
    let row = document.createElement('tr');
    row.appendChild(createStatsTableCell(level));
    row.appendChild(createStatsTableCell(target != '' && target <= 0 ? 'Unknown' : target));
    row.appendChild(createStatsTableCell(actual != '' && actual <= 0 ? 'Unknown' : actual));
    row.appendChild(createStatsTableCell(grade));
    row.appendChild(createStatsTableCell(attempts != '' && attempts <= 0 ? 'Unknown' : attempts));
    if (playText == '') {
        row.appendChild(document.createElement('td'));
    }else {
        row.appendChild(createStatsTableCellButton(level, playText, buttonClass));
    }
    return row;
}

function createStatsTableCell(value) {
    let cell = document.createElement('td');
    cell.innerText = value;
    return cell;
}

function createStatsTableCellButton(level, playText, buttonClass) {
    let button = document.createElement('button');
    button.innerText = playText;
    if (buttonClass != "") button.classList.add(buttonClass);
    button.addEventListener('click', function() {replayLevel(level);}, false);

    let cell = document.createElement('td');
    cell.appendChild(button);

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

    if (graphics) graphics.stop();
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
        restartLevel();
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

    document.getElementById("showStatisticsButtonFromFinish").addEventListener('click', function(event) {
        showStatistics();
    }, false);

    document.getElementById("invisibilityCheck").addEventListener("change", function(event) {
        invisibilityUpdated();
    }, false);
}