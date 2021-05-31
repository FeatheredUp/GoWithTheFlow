class Storage {

    /* Getting */
    static getShapeType() {
        return Storage.getValue('shapeType', 'square');
    }

    static getDifficulty(shapeType) {
        const key = 'difficulty_' + shapeType;
        return parseInt(Storage.getValue(key, 1));
    }

    static getInvisibility(shapeType, difficulty) {
        const key = 'invisibility_' + shapeType + '_' + difficulty;
        return Storage.getValue(key, 0) == 1;
    }

    static getLevel(shapeType, difficulty, invisibility) {
        const key = 'level_' + shapeType + '_' + difficulty + (invisibility ? '_I' : '' );
        return parseInt(Storage.getValue(key, 0));
    }

    static getMaxLevel(shapeType, difficulty, invisibility) {
        const key = 'maxlevel_' + shapeType + '_' + difficulty + (invisibility ? '_I' : '' );
        return parseInt(Storage.getValue(key, 0));
    }

    static getColourScheme() {
        return Storage.getValue('colourScheme', 'default');
    }

    static getLevelRating(shapeType, difficulty, invisibility, level) {
        const key = 'ratings_' + shapeType + '_' + difficulty + (invisibility ? '_I' : '' ) + '_' + level;
        return Storage.getValue(key, '0');
    }

    static getLevelAttempts(shapeType, difficulty, invisibility, level) {
        const key = 'attempts_' + shapeType + '_' + difficulty + (invisibility ? '_I' : '' ) + '_' + level;
        return Storage.getValue(key, 0);
    }

    /* Updating */
    static updateShapeType(shapeType) {
        localStorage.setItem('shapeType', shapeType);
    }

    static updateDifficulty(shapeType, difficulty) {
        const key = 'difficulty_' + shapeType;
        localStorage.setItem(key, difficulty);
    }

    static updateInvisibility(shapeType, difficulty, invisibility) {
        const key = 'invisibility_' + shapeType + '_' + difficulty;
        localStorage.setItem(key, invisibility ? 1 : 0);
    }

    static updateLevel(shapeType, difficulty, invisibility, level) {
        const key = 'level_' + shapeType + '_' + difficulty + (invisibility ? '_I' : '' );
        localStorage.setItem(key, level);
    }

    static updateMaxLevel(shapeType, difficulty, invisibility, level) {
        const key = 'maxlevel_' + shapeType + '_' + difficulty + (invisibility ? '_I' : '' );
        const previousMax = Storage.getMaxLevel(shapeType, difficulty, invisibility);
        // Only store if it's a higher level
        if (level > previousMax) localStorage.setItem(key, level);
    }

    static updateColourScheme(colourScheme) {
        localStorage.setItem('colourScheme', colourScheme);
    }

    static updateLevelRating(shapeType, difficulty, invisibility, level, rating) {
        const previousRating = parseInt(Storage.getLevelRating(shapeType, difficulty, invisibility, level));
        const key = 'ratings_' + shapeType + '_' + difficulty + (invisibility ? '_I' : '' ) + '_' + level;
        // Only store if it's a better (higher) rating
        if (rating > previousRating) localStorage.setItem(key, rating);
    }

    static updateLevelAttempts(shapeType, difficulty, invisibility, level) {
        const previousAttempts = parseInt(Storage.getLevelAttempts(shapeType, difficulty, invisibility, level));
        const key = 'attempts_' + shapeType + '_' + difficulty + (invisibility ? '_I' : '' ) + '_' + level;
        // Increase attempts by one
        localStorage.setItem(key, previousAttempts + 1);
    }

    /* Internals */
    static getValue(key, defaultValue) {
        if (!localStorage.getItem(key)) {
            localStorage.setItem(key, defaultValue);
        }
        return localStorage.getItem(key);
    }

}