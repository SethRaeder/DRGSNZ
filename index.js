function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

class SpriteSheet {
    constructor(spritesArr) {
        this.spritesArr = spritesArr
        this.spriteIndex = 0
    }
    draw(canvas) {
        try {
            this.curElement.remove()
        } catch (error) {

        }

        this.curElement = canvas.image(this.spritesArr[this.spriteIndex]);
    }

    nextSprite() {
        this.spriteIndex += 1;
        console.log(this.spriteIndex)
        if (this.spriteIndex > this.spritesArr.length - 1) {
            this.spriteIndex = 0;
        }
    }
}

var charZephyr = new SpriteSheet(['assets/charZephyr/earFar.svg',
    'assets/charZephyr/earClose.svg',
    'assets/charZephyr/headIdle.svg',
    'assets/charZephyr/iris.svg',
])

var draw = SVG().addTo('body').size(600, 600)
charZephyr.draw(draw)

document.addEventListener('keydown', function(event) {

    if (event.code == 'ArrowRight') {
        charZephyr.nextSprite()
        charZephyr.draw(draw)
        console.log('hello')
    }
}, true)