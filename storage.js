class Storage {
    static getDifficulty() {
        if (!localStorage.getItem('difficulty')) {
            localStorage.setItem('difficulty', 1);
        }
        return parseInt(localStorage.getItem('difficulty'));
    }

    static getLevel(difficulty) {
        const key = 'level' + difficulty;
        if (!localStorage.getItem(key)) {
            localStorage.setItem(key, 0);
        }
        return parseInt(localStorage.getItem(key));
    }

    static getColourScheme() {
        if (!localStorage.getItem('colourScheme')) {
            localStorage.setItem('default', 1);
        }
        return localStorage.getItem('colourScheme');
    }

    static updateLevel(difficulty, level) {
        const previousMax = Storage.getLevel(difficulty);
        if (level > previousMax) localStorage.setItem('level' + difficulty, level);
    }

    static updateDifficulty(difficulty) {
        localStorage.setItem('difficulty', difficulty);
    }

    static updateColourScheme(colourScheme) {
        localStorage.setItem('colourScheme', colourScheme);
    }

}