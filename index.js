function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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
    }

    changeIrritation(amount) {
        this.irritation += amount
        if (this.irritation < 0) {
            this.irritation = 0
        }
        if (this.irritation > 100) {
            this.irritation = 100
        }
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

function map_range(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

function update(progress) {

    console.log(charZephyr.irritation)
    if (irritate) {
        charZephyr.changeIrritation(progress * 0.1)

    } else {
        charZephyr.changeIrritation(progress * -0.05)
    }

    previewSprites.setSprite(Math.floor(map_range(charZephyr.irritation,
        0, 100,
        0, 3)))
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