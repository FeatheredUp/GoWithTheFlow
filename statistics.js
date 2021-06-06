class LevelIdentifier {
    shapeType; 
    difficulty; 
    invisibility; 
    level;

    constructor(shapeType, difficulty, invisibility, level) {
        this.shapeType = shapeType;
        this.difficulty = difficulty;
        this.invisibility = invisibility;
        this.level = level;
    }

    getKey() {
        return this.shapeType + '_' + this.difficulty + (this.invisibility ? '_I' : '' ) + '_' + this.level;
    }
}

class AttemptInformation {
    targetCount;
    actualCount;
    timeTaken;
    whenPlayed;
    attemptCount;

    constructor(targetCount, actualCount, timeTaken, whenPlayed, attemptCount) {
        this.targetCount = targetCount == undefined ? -1 : targetCount;
        this.actualCount = actualCount == undefined ? -1 : actualCount;
        this.timeTaken = timeTaken == undefined ? -1 : timeTaken;
        if (targetCount == undefined) {
            this.whenPlayed = 0;
            this.attemptCount = 0;
        } else {
            this.whenPlayed = whenPlayed  == undefined ? (new Date()).getTime() : whenPlayed;
            this.attemptCount = attemptCount == undefined ? 1 : attemptCount;
        }
    }

    get rating() {
        if (this.targetCount <= 0 || this.actualCount <= 0) return 0;
        if (this.percent <= 0) return 6;
        if (this.percent <= 10) return 5;
        if (this.percent <= 20) return 4;
        if (this.percent <= 30) return 3;
        if (this.percent <= 50) return 2;
        return 1;
    }

    get ratingGrade() {
        return AttemptInformation.mapRatingToGrade(this.rating);
    }

    // The percentage over the minimum
    get percent() {
        if (this.targetCount <= 0 || this.actualCount <=0) return 10000;
        // (100 * 1400/200) - 100 = 600% (7 times as many turns)
        // (100 *  400/200) - 100 = 100% (twice as many turns)
        // (100 *  220/200) - 100 = 10%  (10% more turns)
        // (100 *  200/200) - 100 = 0%   (on target)
        return (100.0 * (this.actualCount / this.targetCount)) - 100;
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