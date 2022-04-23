function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function map_range(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

function clamp_range(value, low, high) {
    if (value < low) {
        return low
    } else if (value > high) {
        return high
    }
    return value
}

class SpriteSheet {
    constructor(spritesArr) {
        this.spritesArr = spritesArr
        this.spriteIndex = 0
        this.lastSprite = -1
        this.curElement = null
    }
    draw(svgDraw) {
        if (this.spriteIndex != this.lastSprite) {
            try {
                this.curElement.remove()
            } catch (error) {}
            this.curElement = svgDraw.image(this.spritesArr[this.spriteIndex]);
            this.lastSprite = this.spriteIndex
        }

    }

    nextSprite() {
        this.spriteIndex += 1;
        console.log(this.spriteIndex)
        if (this.spriteIndex > this.spritesArr.length - 1) {
            this.spriteIndex = 0;
        }
    }

    setSprite(num) {
        this.spriteIndex = num
        if (this.spriteIndex > this.spritesArr.length - 1) {
            this.spritesIndex = this.spritesArr.length - 1
        }
    }
}

class Character {
    constructor() {
        this.sneezeThreshold = 100
        this.hitchThreshold = 90
        this.idleThreshold = 10

        this.irritation = 0.0
        this.sneezePercent = 0.0
        this.sneezePower = 0.0
        this.hitching = false
        this.sneezing = false

        this.lungs = 0.0
        this.breathHoldCounter = 0.0

        this.sensitivity = 0.0
        this.tempSensitivity = 0.0

        this.allergyPercent = 0.0
        this.allergyDecayRate = 0.0
        this.allergyDust = 0.0
        this.allergyPollen = 0.0
        this.allergyFeather = 0.0

        this.inhaledDust = 0
        this.inhaledPowder = 0
        this.inhaledChhinkni = 0
        this.inhaledPollen = 0

        this.irritationDecay = -5

        this.sneezeTime = 0
    }

    update(progress) {
        this.doIrritation(progress)
        this.doSneeze(progress)
    }
    changeIrritation(amount) {
        this.irritation = clamp_range(this.irritation + amount, 0, 100)
    }

    changeSneezePercent(amount) {
        this.sneezePercent = clamp_range(this.sneezePercent + amount, 0, 100)
    }

    changeLungs(amount) {
        //let deltaBreath = (progress * breathPerSecond / 1000)
        this.lungs = clamp_range(this.lungs + amount, 0, 100)
    }

    irritate(progress) {
        this.changeIrritation(20 / progress)
    }

    doIrritation(progress) {
        let deltaSneeze = map_range(this.irritation, 0, 100, -10, 20) / progress
        this.changeSneezePercent(deltaSneeze)
        this.changeIrritation(this.irritationDecay / progress)
    }

    doSneeze(progress) {
        if (this.sneezing) {
            if (this.sneezeTime > 1000) {
                this.sneezeTime = 0
                this.sneezing = false
                this.changeSneezePercent(-1 * Math.random() * 100)
                this.changeIrritation(-1 * Math.random() * 100)
            }
            this.sneezeTime += progress
        }
        if (this.sneezePercent >= this.sneezeThreshold) {
            this.sneezing = true

        }
    }

    getSpriteIndex() {
        if (this.sneezing) {
            return 3
        }
        if (this.sneezePercent > this.hitchThreshold) {
            return 2
        }
        if (this.sneezePercent > this.idleThreshold) {
            return 1
        }
        return 0
    }
}

var snot = new SpriteSheet(['assets/charZephyr/snot.svg',
    'assets/charZephyr/snot.svg',
    'assets/charZephyr/snotHitch.svg',
    'assets/charZephyr/snotSneeze.svg'
])
var nostril = new SpriteSheet(['assets/charZephyr/nostril.svg',
    'assets/charZephyr/nostril.svg'
])
var earClose = new SpriteSheet(['assets/charZephyr/earClose.svg',
    'assets/charZephyr/earCloseHitch.svg',
    'assets/charZephyr/earCloseSneeze.svg'
])
var eye = new SpriteSheet(['assets/charZephyr/eyeOpen.svg',
    'assets/charZephyr/eyeBlink.svg',
    'assets/charZephyr/eyeClose1.svg',
    'assets/charZephyr/eyeClose2.svg',
    'assets/charZephyr/eyeClose3.svg',
    'assets/charZephyr/eyeClosed.svg',
    'assets/charZephyr/eyeClosedB.svg'
])
var pupil = new SpriteSheet(['assets/charZephyr/pupil.svg',
    'assets/charZephyr/pupilRound.svg',
    'assets/charZephyr/pupilRoundB.svg'
])
var head = new SpriteSheet(['assets/charZephyr/headIdle.svg',
    'assets/charZephyr/headTickle.svg',
    'assets/charZephyr/headHitch.svg',
    'assets/charZephyr/headSneeze.svg'
])
var wing = new SpriteSheet(['assets/charZephyr/wing.svg'])

var upperNeck = new SpriteSheet(['assets/charZephyr/neckUpper.svg',
    'assets/charZephyr/neckUpperB.svg',
    'assets/charZephyr/neckUpperHitch.svg'
])
var lowerNeck = new SpriteSheet(['assets/charZephyr/neckLower.svg',
    'assets/charZephyr/neckLowerHitch.svg',
    'assets/charZephyr/neckLowerSneeze.svg'
])
var farEar = new SpriteSheet(['assets/charZephyr/earFar.svg',
    'assets/charZephyr/earFarHitch.svg',
    'assets/charZephyr/earFarSneeze.svg'
])

var previewSprites = new SpriteSheet([
    'assets/charZephyr/preview/previewIdle.svg',
    'assets/charZephyr/preview/previewTickle.svg',
    'assets/charZephyr/preview/previewHitch.svg',
    'assets/charZephyr/preview/previewSneezeSnot.svg'
])
var charZephyr = new Character()

var svgDraw = SVG().addTo('body').size(800, 800)

//load sprites
// farEar.draw(svgDraw)
// lowerNeck.draw(svgDraw)
// upperNeck.draw(svgDraw)
// wing.draw(svgDraw)
// head.draw(svgDraw)
// pupil.draw(svgDraw)
// eye.draw(svgDraw)
// earClose.draw(svgDraw)
// nostril.draw(svgDraw)

var irritate = false
document.addEventListener('keydown', function(event) {
    if (event.code == 'ArrowUp') {
        irritate = true
    }
}, true)

document.addEventListener('keyup', function(event) {
    if (event.code == 'ArrowUp') {
        irritate = false
    }
}, true)



function update(progress) {
    if (progress == 0) {
        return
    }
    if (irritate) {
        charZephyr.irritate(progress)
    }
    charZephyr.update(progress)
        //console.log(progress)
        //console.log(charZephyr.irritation)
        //console.log(charZephyr.sneezePercent)
    previewSprites.setSprite(charZephyr.getSpriteIndex())
}

function draw() {
    previewSprites.draw(svgDraw)
}

function loop(timestamp) {
    var progress = timestamp - lastRender
    update(progress)
    draw()
    lastRender = timestamp
    window.requestAnimationFrame(loop)
}
var lastRender = 0
window.requestAnimationFrame(loop)