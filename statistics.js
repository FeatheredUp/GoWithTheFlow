class LevelStatistics {
    shapeType;
    difficulty;
    level;
    minimum;
    moves;
    constructor(shapeType, difficulty, level, minimum, moves) {
        this.shapeType = shapeType;
        this.difficulty = difficulty;
        this.level = level;
        this.minimum = minimum;
        this.moves = moves;
    }

    get stars() {
        if (this.percent <= 0) return 5;
        if (this.percent <= 10) return 4;
        if (this.percent <= 30) return 3;
        if (this.percent <= 50) return 2;
        return 1;
    }

    // The percentage over the minimum
    get percent() {
        return (100.0 * (this.moves / this.minimum)) - 100;
    }
}