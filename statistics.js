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

    get rating() {
        if (this.percent <= 0) return 6;
        if (this.percent <= 10) return 5;
        if (this.percent <= 20) return 4;
        if (this.percent <= 30) return 3;
        if (this.percent <= 50) return 2;
        return 1;
    }

    get ratingGrade() {
        return LevelStatistics.mapRatingToGrade(this.rating);
    }

    // The percentage over the minimum
    get percent() {
        return (100.0 * (this.moves / this.minimum)) - 100;
    }

    static mapRatingToGrade(rating) {
        if (rating == 6) return 'S';
        if (rating == 5) return 'A';
        if (rating == 4) return 'B';
        if (rating == 3) return 'C';
        if (rating == 2) return 'D';
        if (rating == 1) return 'E';
        return 'Ungraded';
    }
}