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
        if (this.percent <= 0) return 'S';
        if (this.percent <= 10) return 'A';
        if (this.percent <= 20) return 'B';
        if (this.percent <= 30) return 'C';
        if (this.percent <= 50) return 'D';
        return 'E';
    }

    // The percentage over the minimum
    get percent() {
        return (100.0 * (this.moves / this.minimum)) - 100;
    }
}