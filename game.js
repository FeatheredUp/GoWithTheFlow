let canvas = document.getElementById('canvas'),
    graphics,
    currentDifficulty,
    currentLevel; 

initialiseControls();
attachEvents();
showChooseScreen(null, null);

function congratulate() {
    document.getElementById("completeMoveCount").innerText = graphics.puzzle.moveCount;
    document.getElementById("completeMinimumMoveCount").innerText = graphics.puzzle.minSolveCount;

    storeInfo(currentDifficulty, currentLevel);
    showChooseScreen(currentDifficulty, currentLevel+1);
}

function newPuzzle() { 
    currentDifficulty = parseInt(document.getElementById("difficultySlider").value)
    currentLevel = parseInt(document.getElementById("levelSlider").value);
    const colourScheme = document.getElementById('colourSelect').value;

    document.getElementById("gameLevel").innerText = currentLevel;
    let puzzle = new Puzzle(currentDifficulty, currentLevel);
    graphics = new Graphics(canvas, puzzle, colourScheme);
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

function showChooseScreen(difficulty, level) {
    if (!difficulty) difficulty = getStoredDifficulty();

    let maxLevel = getStoredLastLevel(difficulty) + 1;
    if (!level) level = maxLevel;
    document.getElementById("levelSlider").max = maxLevel;
    document.getElementById("levelSlider").value = level;
    document.getElementById("levelValue").innerText = level;

    document.getElementById("difficultySlider").value = difficulty;
    document.getElementById("difficultyValue").innerText = mapDifficultyToWords(difficulty);

    document.getElementById("gameScreen").classList.add('hidden');
    document.getElementById("chooseScreen").classList.remove('hidden');
}

function changeLevelSlider(difficulty) {
    let maxLevel = getStoredLastLevel(difficulty) + 1;
    document.getElementById("levelSlider").max = maxLevel;
    document.getElementById("levelSlider").value = maxLevel;
    document.getElementById("levelValue").innerText = maxLevel;
}

/* Storage */
function getStoredDifficulty() {
    if (!localStorage.getItem('difficulty')) {
        localStorage.setItem('difficulty', 1);
    }
    return parseInt(localStorage.getItem('difficulty'));
}

function getStoredLastLevel(difficulty) {
    const key = 'level' + difficulty;
    if (!localStorage.getItem(key)) {
        localStorage.setItem(key, 0);
    }
    return parseInt(localStorage.getItem(key));
}

function getStoredColourScheme() {
    if (!localStorage.getItem('colourScheme')) {
        localStorage.setItem('default', 1);
    }
    return localStorage.getItem('colourScheme');
}

function storeInfo(difficulty, level) {
    const previousMax = getStoredLastLevel(difficulty);
    if (level > previousMax) localStorage.setItem('level' + difficulty, level);
}

function storeOptions(difficulty, colourScheme) {
    localStorage.setItem('difficulty', difficulty);
    localStorage.setItem('colourScheme', colourScheme);
}
/* end storage */

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
    const selectedColourScheme = getStoredColourScheme();
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
    storeOptions(currentDifficulty, colourSelect);
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
        showChooseScreen(currentDifficulty, currentLevel);
    }, false);

    document.getElementById("levelSlider").addEventListener('input', function(event){
        document.getElementById("levelValue").innerText = this.value;
    }, false);

    document.getElementById("difficultySlider").addEventListener('input', function(event){
        document.getElementById("difficultyValue").innerText = mapDifficultyToWords(parseInt(this.value));
        changeLevelSlider(parseInt(this.value));
    }, false);
}