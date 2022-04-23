function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

class SpriteSheet {
    constructor(spritesArr) {
        this.spritesArr = spritesArr
        this.spriteIndex = 0
    }
    draw(svgDraw) {
        try {
            this.curElement.remove()
        } catch (error) {

        }

        this.curElement = svgDraw.image(this.spritesArr[this.spriteIndex]);
    }

    nextSprite() {
        this.spriteIndex += 1;
        console.log(this.spriteIndex)
        if (this.spriteIndex > this.spritesArr.length - 1) {
            this.spriteIndex = 0;
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
var svgDraw = SVG().addTo('body').size(800, 800)

// farEar.draw(svgDraw)
// lowerNeck.draw(svgDraw)
// upperNeck.draw(svgDraw)
// wing.draw(svgDraw)
// head.draw(svgDraw)
// pupil.draw(svgDraw)
// eye.draw(svgDraw)
// earClose.draw(svgDraw)
// nostril.draw(svgDraw)
previewSprites.draw(svgDraw)
document.addEventListener('keydown', function(event) {
    if (event.code == 'ArrowRight') {
        previewSprites.nextSprite()
        previewSprites.draw(svgDraw)
    }
}, true)