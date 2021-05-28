class Storage {

    /* Getting */
    static getShapeType() {
        return Storage.getValue('shapeType', 'square');
    }

    static getDifficulty(shapeType) {
        const key = 'difficulty_' + shapeType;
        return parseInt(Storage.getValue(key, 1));
    }

    static getLevel(shapeType, difficulty) {
        const key = 'level_' + shapeType + '_' + difficulty;
        return parseInt(Storage.getValue(key, 0));
    }

    static getMaxLevel(shapeType, difficulty) {
        const key = 'maxlevel_' + shapeType + '_' + difficulty;
        return parseInt(Storage.getValue(key, 0));
    }

    static getColourScheme() {
        return Storage.getValue('colourScheme', 'default');
    }

    /* Updating */
    static updateShapeType(shapeType) {
        localStorage.setItem('shapeType', shapeType);
    }

    static updateDifficulty(shapeType, difficulty) {
        const key = 'difficulty_' + shapeType;
        localStorage.setItem(key, difficulty);
    }

    static updateLevel(shapeType, difficulty, level) {
        const key = 'level_' + shapeType + '_' + difficulty;
        localStorage.setItem(key, level);
    }

    static updateMaxLevel(shapeType, difficulty, level) {
        const key = 'maxlevel_' + shapeType + '_' + difficulty;
        const previousMax = Storage.getMaxLevel(shapeType, difficulty);
        if (level > previousMax) localStorage.setItem(key, level);
    }

    static updateColourScheme(colourScheme) {
        localStorage.setItem('colourScheme', colourScheme);
    }

    /* Internals */
    static getValue(key, defaultValue) {
        if (!localStorage.getItem(key)) {
            localStorage.setItem(key, defaultValue);
        }
        return localStorage.getItem(key);
    }

}