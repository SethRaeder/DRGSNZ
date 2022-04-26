class Point {
    constructor(x, y) {
        this.xPos = x
        this.yPos = y
    }

    getDistance(point2) {
        //Distance between 2 points
        return Math.sqrt((Math.pow(point2.xPos - this.xPos, 2)) + (Math.pow(point2.yPos - this.yPos, 2)))
    }

    move(deltaX, deltaY) {
        this.xPos += deltaX
        this.yPos += deltaY
    }

    set(x, y) {
        this.xPos = x
        this.yPos = y
    }
}

class Rect extends Point {
    constructor(x, y, w, h) {
        super(x, y)
        this.width = w
        this.height = h
    }

    isLine() {
        if (this.width == 0 || this.height == 0) {
            return true
        }
        return false
    }

    getRightBound() {
        return this.xPos + this.width
    }

    getLowerBound() {
        return this.yPos + this.height
    }

    doOverlap(rect2) {
        if (this.isLine() || rect2.isLine()) {
            return false
        }

        //If one is to the left of the other
        if (this.xPos >= rect2.getRightBound() || rect2.xPos >= this.getRightBound()) {
            return false
        }

        //if one is above the other
        if (this.getLowerBound() >= rect2.yPos || rect2.getLowerBound() >= this.yPos) {
            return false
        }

        return true
    }
}

class Circle extends Point {
    constructor(x, y, r) {
        super(x, y)
        this.radius = r
    }

    doOverlap(circle2) {
        if (this.getDistance(circle2) <= (this.radius + circle2.radius)) {
            return true
        }
        return false
    }
}