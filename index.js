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
        this.sizes = []
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

            let size = [temp.width(), temp.height()]
            this.sizes.push(size)


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

            this.curElement.size(rect.width * this.sizes[this.spriteIndex][0], rect.height * this.sizes[this.spriteIndex][1])
        }
        this.curElement.center(rect.xPos, rect.yPos)
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

var breathEnum = {
    'IDLE': 0,
    'IN': 45,
    'OUT': -45,
    'HITCH': 70,
    'SNEEZE': -100,
    'HOLD': 0
}

var sneezeEnum = {
    'IDLE': 0,
    'TICKLE': 1,
    'HITCH': 2,
    'SNEEZEREADY': 3,
    'SNEEZING': 4
}

class Character {
    constructor() {
        this.sneezeThreshold = 100
        this.hitchThreshold = 90
        this.idleThreshold = 10

        this.irritation = 0.0
        this.sneezePercent = 0.0
        this.sneezePower = 0.0
        this.sneezeState = sneezeEnum.IDLE

        this.lungs = 0.0
        this.breath = breathEnum.IDLE
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

        this.irritationDecay = -10

        this.sneezeTime = 0
    }

    update(deltaSeconds) {
        this.doIrritation(deltaSeconds)
        this.doBreath(deltaSeconds)
        this.doSneeze(deltaSeconds)
    }

    changeLungs(amount) {
        //let deltaBreath = (progress * breathPerSecond / 1000)
        amount = Math.min(100 - this.lungs, amount)
        this.lungs = clamp_range(this.lungs + amount, 0, 100)
        if (amount > 0) {
            this.breathHoldCounter += (16 / 100) * amount
        }
    }

    isIdle() {
        return this.sneezeState == sneezeEnum.IDLE
    }
    isTickle() {
        return this.sneezeState == sneezeEnum.TICKLE
    }
    isHitching() {
        return this.sneezeState == sneezeEnum.HITCH
    }
    isSneezeReady() {
        return this.sneezeState == sneezeEnum.SNEEZEREADY
    }
    isSneezing() {
        return this.sneezeState == sneezeEnum.SNEEZING
    }

    doBreath(deltaSeconds) {
        switch (this.breath) {
            case breathEnum.IDLE:
                if (this.breathHoldCounter <= 5) {
                    this.breath = breathEnum.IN
                }
                if (this.sneezeState == sneezeEnum.HITCH) {
                    this.breath = breathEnum.HITCH
                }
                break;
            case breathEnum.IN:
                if (this.sneezeState == sneezeEnum.HITCH) {
                    this.breath = breathEnum.HITCH
                } else if (this.lungs >= 90) {
                    this.breath = breathEnum.OUT
                }
                break
            case breathEnum.OUT:
                if (this.lungs <= 25 && this.breathHoldCounter <= 5) {
                    this.breath = breathEnum.IN
                } else if (this.lungs <= 0) {
                    this.breath = breathEnum.IDLE
                }
                break;
            case breathEnum.HITCH:
                if (this.lungs >= 100) {
                    this.breath = breathEnum.HOLD
                }
                break;
            case breathEnum.HOLD:
                if (this.breathHoldCounter < 0) {
                    this.breath = breathEnum.OUT
                }
                break;
            case breathEnum.SNEEZE:
                if (this.lungs <= 0) {
                    this.breath = breathEnum.IDLE
                    this.sneezeState = sneezeEnum.IDLE
                }
                break;
        }

        this.breathHoldCounter = clamp_range(this.breathHoldCounter, -5, 20)
        this.breathHoldCounter -= deltaSeconds
        this.changeLungs(this.breath * deltaSeconds)

    }

    irritate(deltaSeconds) {
        this.changeIrritation(20 * deltaSeconds)
    }

    changeIrritation(amount) {
        this.irritation = clamp_range(this.irritation + amount, 0, 100)
    }

    doIrritation(deltaSeconds) {
        let deltaSneeze = map_range(this.irritation, 0, 100, -5, 30) * deltaSeconds
        this.changeSneezePercent(deltaSneeze)
        this.changeIrritation(this.irritationDecay * deltaSeconds)
    }

    changeSneezePercent(amount) {
        this.sneezePercent = clamp_range(this.sneezePercent + amount, 0, 100)
    }

    doSneeze(deltaSeconds) {
        if (this.isSneezeReady()) {
            //Start sneeze
            this.sneezeTime = 0
            this.sneezeState = sneezeEnum.SNEEZING
            this.changeSneezePercent(-1 * Math.random() * 100)
            this.changeIrritation(-1 * Math.random() * 50)
            this.breath = breathEnum.SNEEZE

        } else if (this.isSneezing()) {
            this.sneezeTime += deltaSeconds
            if (this.sneezeTime > 1) { //Adjust for sneeze time. I.E. audio length
                this.sneezeState = sneezeEnum.IDLE
            }
        } else if (this.sneezePercent >= this.hitchThreshold) {
            this.sneezeState = sneezeEnum.HITCH
            if (this.sneezePercent >= this.sneezeThreshold && this.lungs > 50) {
                this.sneezeState = sneezeEnum.SNEEZEREADY
            }
        } else if (this.sneezePercent >= this.idleThreshold) {
            this.sneezeState = sneezeEnum.TICKLE
        } else {
            //Idle.
            this.sneezeState = sneezeEnum.IDLE
        }
    }

    getSpriteIndex() {
        if (this.isSneezing()) {
            return 3
        }
        if (this.isSneezeReady() || this.isHitching()) {
            return 2
        }
        if (this.isTickle()) {
            return 1
        }
        return 0
    }
}

var svgDraw = SVG().addTo('body').size(1280, 720)

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


var mousePos = new Point(0, 0)

function tellPos(p) {
    mousePos.set(p.offsetX, p.offsetY)
}
addEventListener('mousemove', tellPos, false);

function newSlider(name, min, max) {
    const slide = document.createElement('input')
    slide.type = 'range'
    slide.min = min
    slide.max = max
    slide.class = 'slider'
    slide.id = name
    document.body.appendChild(slide)
    return slide
}

const sliderIrritation = newSlider("irritation", 0, 100)
const sliderSneezePercent = newSlider("sneezePercent", 0, 100)
const sliderLungs = newSlider("lungs", 0, 100)

sliderIrritation.addEventListener("input", function() {
    charZephyr.irritation = Number(this.value);
})

sliderSneezePercent.addEventListener("input", function() {
    charZephyr.sneezePercent = Number(this.value);
})


function update(progress) {
    if (progress == 0) {
        return
    }
    let deltaSeconds = progress / 1000
    if (irritate) {
        charZephyr.irritate(deltaSeconds)
    }
    charZephyr.update(deltaSeconds)
        //console.log(progress)
        //console.log(charZephyr.irritation)
        //console.log(charZephyr.sneezePercent)
    console.log('breath: ' + charZephyr.breath)
    console.log('holdCounter: ' + charZephyr.breathHoldCounter)
    console.log('sneezeState: ' + charZephyr.sneezeState)
    previewSprites.setSprite(charZephyr.getSpriteIndex())

    toolCursor.set(mousePos.xPos, mousePos.yPos)

    sliderIrritation.value = charZephyr.irritation;
    sliderSneezePercent.value = charZephyr.sneezePercent;
    sliderLungs.value = charZephyr.lungs;
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