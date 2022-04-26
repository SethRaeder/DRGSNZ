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
        this.elementArr = []
        this.spriteIndex = 0
        this.lastSprite = -1
        this.curElement = null
    }

    async fetchElements(svgDraw) {
        for (let i = 0; i < this.spritesArr.length; i++) {
            let response = await fetch(this.spritesArr[i])
            let responseText = await response.text()
            let temp = new SVG(responseText).addTo(svgDraw)
            temp.hide()
            this.elementArr.push(temp)
        }
        this.curElement = this.elementArr[0]
    }

    draw() {
        if (this.spriteIndex != this.lastSprite) {
            try {
                this.curElement.hide()
            } catch (error) {}

            this.curElement = this.elementArr[this.spriteIndex]
            this.curElement.show()
            this.lastSprite = this.spriteIndex
        }
    }

    drawAt(rect) {
        if (this.spriteIndex != this.lastSprite) {
            this.draw()
        }
        this.curElement.x(rect.xPos)
        this.curElement.y(rect.yPos)
        let width = this.curElement.size()[0]
        let height = this.curElement.size()[1]
        this.curElement.size(rect.width * width, rect.height * height)
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

class Sprite extends Rect {
    constructor(spriteSheet, x, y, w, h) {
        super(x, y, w, h)
        this.spriteSheet = spriteSheet
    }

    draw() {
        this.spriteSheet.drawAt(this)
    }

    nextSprite() {
        this.spriteSheet.nextSprite()
    }

    setSprite(num) {
        this.spriteSheet.setSprite(num)
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

        this.irritationDecay = -1

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
        let deltaSneeze = map_range(this.irritation, 0, 100, -1, 5) / progress
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


var svgDraw = SVG().addTo('body').size(800, 800)

var snotSprites = new SpriteSheet(['assets/charZephyr/snot.svg',
    'assets/charZephyr/snot.svg',
    'assets/charZephyr/snotHitch.svg',
    'assets/charZephyr/snotSneeze.svg'
], svgDraw)

var nostrilSprites = new SpriteSheet(['assets/charZephyr/nostril.svg',
    'assets/charZephyr/nostril.svg'
], svgDraw)

var earCloseSprites = new SpriteSheet(['assets/charZephyr/earClose.svg',
    'assets/charZephyr/earCloseHitch.svg',
    'assets/charZephyr/earCloseSneeze.svg'
], svgDraw)

var eyeSprites = new SpriteSheet(['assets/charZephyr/eyeOpen.svg',
    'assets/charZephyr/eyeBlink.svg',
    'assets/charZephyr/eyeClose1.svg',
    'assets/charZephyr/eyeClose2.svg',
    'assets/charZephyr/eyeClose3.svg',
    'assets/charZephyr/eyeClosed.svg',
    'assets/charZephyr/eyeClosedB.svg'
], svgDraw)

var pupilSprites = new SpriteSheet(['assets/charZephyr/pupil.svg',
    'assets/charZephyr/pupilRound.svg',
    'assets/charZephyr/pupilRoundB.svg'
], svgDraw)

var headSprites = new SpriteSheet(['assets/charZephyr/headIdle.svg',
    'assets/charZephyr/headTickle.svg',
    'assets/charZephyr/headHitch.svg',
    'assets/charZephyr/headSneeze.svg'
], svgDraw)

var wingSprites = new SpriteSheet(['assets/charZephyr/wing.svg'], svgDraw)

var upperNeckSprites = new SpriteSheet(['assets/charZephyr/neckUpper.svg',
    'assets/charZephyr/neckUpperB.svg',
    'assets/charZephyr/neckUpperHitch.svg'
], svgDraw)

var lowerNeckSprites = new SpriteSheet(['assets/charZephyr/neckLower.svg',
    'assets/charZephyr/neckLowerHitch.svg',
    'assets/charZephyr/neckLowerSneeze.svg'
], svgDraw)

var farEarSprites = new SpriteSheet(['assets/charZephyr/earFar.svg',
    'assets/charZephyr/earFarHitch.svg',
    'assets/charZephyr/earFarSneeze.svg'
], svgDraw)

var previewSprites = new SpriteSheet([
    'assets/charZephyr/preview/previewIdle.svg',
    'assets/charZephyr/preview/previewTickle.svg',
    'assets/charZephyr/preview/previewHitch.svg',
    'assets/charZephyr/preview/previewSneezeSnot.svg'
], svgDraw)

var toolSprites = new SpriteSheet([
    'assets/tools/feather.svg',
    'assets/tools/brush.svg',
    'assets/tools/duster.svg',
    'assets/tools/flower.svg',
    'assets/tools/powderBrush.svg',
    'assets/tools/chhinkni.svg',
    'assets/tools/hand.svg',
    'assets/tools/tissue.svg',
], svgDraw)

//Load svg elements
console.log("Loading svgs")
    // await snotSprites.fetchElements(svgDraw)
    // await farEarSprites.fetchElements(svgDraw)
    // await lowerNeckSprites.fetchElements(svgDraw)
    // await upperNeckSprites.fetchElements(svgDraw)
    // await wingSprites.fetchElements(svgDraw)
    // await pupilSprites.fetchElements(svgDraw)
    // await eyeSprites.fetchElements(svgDraw)
    // await earCloseSprites.fetchElements(svgDraw)
    // await nostrilSprites.fetchElements(svgDraw)
await previewSprites.fetchElements(svgDraw)
await toolSprites.fetchElements(svgDraw)
console.log('svgs loaded')

var toolCursor = new Sprite(toolSprites, 50, 50, 0.2, 0.2)
var charZephyr = new Character()


var irritate = false
document.addEventListener('keydown', function(event) {
    if (event.code == 'ArrowUp') {
        irritate = true
    }
}, true)

document.addEventListener('mousedown', function(event) {
    if (event.button == 0) {
        toolCursor.nextSprite()
    }
}, true)

document.addEventListener('keyup', function(event) {
    if (event.code == 'ArrowUp') {
        irritate = false
    }
}, true)

var info = document.getElementById("info")
var sneezeDiv = document.getElementById("sneeze")
var mousePos = new Point(0, 0)

function tellPos(p) {
    info.innerHTML = 'Position X : ' + p.pageX + '<br />Position Y : ' + p.pageY;
    mousePos.set(p.offsetX, p.offsetY)
}
addEventListener('mousemove', tellPos, false);

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

    toolCursor.set(mousePos.xPos, mousePos.yPos)

    sneezeDiv.innerHTML = "Sneeze%: " + charZephyr.sneezePercent + "<br />Irritation: " + charZephyr.irritation
}

function draw() {
    previewSprites.draw()
    toolCursor.draw()
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